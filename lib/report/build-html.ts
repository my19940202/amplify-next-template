import type { SiteCandidate } from "@/lib/types/site";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function staticMapUrl(lat: number, lng: number, apiKey: string): string {
  const params = new URLSearchParams({
    center: `${lat},${lng}`,
    zoom: "15",
    size: "640x320",
    scale: "2",
    maptype: "roadmap",
    markers: `color:0x2563eb|${lat},${lng}`,
    key: apiKey,
  });
  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}`;
}

function multiSiteMapUrl(sites: SiteCandidate[], apiKey: string): string | null {
  if (sites.length === 0) return null;
  const markers = sites
    .map((s, i) => `label:${i + 1}|color:0x2563eb|${s.lat},${s.lng}`)
    .join("&markers=");
  const center = sites[0];
  const params = new URLSearchParams({
    center: `${center.lat},${center.lng}`,
    zoom: sites.length > 1 ? "13" : "15",
    size: "640x320",
    scale: "2",
    maptype: "roadmap",
    key: apiKey,
  });
  return `https://maps.googleapis.com/maps/api/staticmap?${params.toString()}&markers=${markers}`;
}

function scoreRow(label: string, score: number): string {
  return `<tr>
    <td>${escapeHtml(label)}</td>
    <td style="text-align:right;font-weight:600">${score}/100</td>
  </tr>`;
}

function renderSiteSection(site: SiteCandidate, apiKey?: string): string {
  const analysis = site.analysis;
  const mapImg =
    apiKey != null
      ? `<img src="${staticMapUrl(site.lat, site.lng, apiKey)}" alt="Map" width="100%" style="border-radius:8px;border:1px solid #e2e8f0" />`
      : `<p style="color:#64748b;font-size:13px">${site.lat.toFixed(5)}, ${site.lng.toFixed(5)}</p>`;

  if (!analysis) {
    return `<section class="site-block">
      <h2>${escapeHtml(site.address)}</h2>
      ${mapImg}
      <p class="muted">Analysis not available — run analysis before exporting.</p>
    </section>`;
  }

  const competitors = analysis.competition.nearby
    .map(
      (c) =>
        `<li>${escapeHtml(c.name)}${c.rating != null ? ` · ★ ${c.rating}` : ""} · ${c.distanceMeters}m</li>`
    )
    .join("");

  const footTraffic = analysis.footTraffic.breakdown
    .map(
      (item) =>
        `<li>${escapeHtml(item.label)}: ${item.count} POIs (weight ${item.weight})</li>`
    )
    .join("");

  return `<section class="site-block">
    <h2>${escapeHtml(site.address)}</h2>
    <p class="coords">${site.lat.toFixed(5)}, ${site.lng.toFixed(5)}</p>
    ${mapImg}
    <div class="score-hero">
      <span class="score-value">${analysis.overallScore}</span>
      <span class="score-label">${escapeHtml(analysis.scoreLabel)}</span>
    </div>
    <table class="scores">
      <tbody>
        ${scoreRow("Foot traffic", analysis.footTraffic.score)}
        ${scoreRow("Competition", analysis.competition.score)}
        ${scoreRow("Amenities", analysis.amenities.score)}
        ${scoreRow("Visibility", analysis.visibility.score)}
      </tbody>
    </table>
    <h3>Competition (${analysis.competition.count} nearby)</h3>
    <ul>${competitors || "<li>No direct competitors found</li>"}</ul>
    <h3>Foot traffic proxies</h3>
    <ul>${footTraffic}</ul>
    <h3>Amenities</h3>
    <p>Parking ${analysis.amenities.parking} · Transit ${analysis.amenities.transit} · Dining ${analysis.amenities.dining}</p>
    <div class="recommendation">${escapeHtml(analysis.recommendation)}</div>
    <p class="note">${escapeHtml(analysis.visibility.note)}</p>
    <p class="muted">Analyzed ${new Date(analysis.analyzedAt).toLocaleString()}</p>
  </section>`;
}

export function buildReportHtml(
  sites: SiteCandidate[],
  options?: { apiKey?: string; title?: string }
): string {
  const apiKey = options?.apiKey ?? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const title = options?.title ?? "Site Location Analysis Report";
  const generatedAt = new Date().toLocaleString();
  const analyzedSites = sites.filter((s) => s.analysis);
  const overviewMap =
    apiKey && analyzedSites.length > 1
      ? `<img src="${multiSiteMapUrl(analyzedSites, apiKey)}" alt="Overview map" width="100%" style="border-radius:8px;border:1px solid #e2e8f0;margin-bottom:24px" />`
      : "";

  const siteSections = sites.map((s) => renderSiteSection(s, apiKey)).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      line-height: 1.5;
      max-width: 720px;
      margin: 0 auto;
      padding: 40px 24px;
      background: #fff;
    }
    header { border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 32px; }
    header h1 { margin: 0 0 8px; font-size: 24px; }
    header p { margin: 0; color: #64748b; font-size: 14px; }
    .site-block { page-break-inside: avoid; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid #e2e8f0; }
    .site-block:last-child { border-bottom: none; }
    .site-block h2 { margin: 0 0 4px; font-size: 18px; }
    .coords { margin: 0 0 12px; font-size: 12px; color: #64748b; font-family: monospace; }
    .score-hero { display: flex; align-items: baseline; gap: 12px; margin: 16px 0; }
    .score-value { font-size: 48px; font-weight: 700; color: #2563eb; line-height: 1; }
    .score-label { font-size: 16px; font-weight: 600; color: #334155; }
    .scores { width: 100%; border-collapse: collapse; margin: 12px 0 20px; font-size: 14px; }
    .scores td { padding: 8px 0; border-bottom: 1px solid #f1f5f9; }
    h3 { font-size: 14px; margin: 16px 0 8px; color: #334155; }
    ul { margin: 0; padding-left: 20px; font-size: 13px; color: #475569; }
    li { margin-bottom: 4px; }
    .recommendation { background: #f8fafc; border-left: 4px solid #2563eb; padding: 12px 16px; margin: 16px 0 8px; font-size: 14px; }
    .note { font-size: 12px; color: #64748b; }
    .muted { font-size: 12px; color: #94a3b8; }
    footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; }
    @media print {
      body { padding: 20px; }
      .site-block { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  <header>
    <h1>${escapeHtml(title)}</h1>
    <p>Generated ${escapeHtml(generatedAt)} · Store Location Analyzer</p>
    <p>${sites.length} site${sites.length !== 1 ? "s" : ""} included</p>
  </header>
  ${overviewMap}
  ${siteSections}
  <footer>
    Scores and foot traffic figures are POI-based estimates, not guarantees of business performance.
    Verify any site decision with on-site visits before signing a lease.
    Data © Google Maps.
  </footer>
</body>
</html>`;
}

export function slugifyAddress(address: string): string {
  return address
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
}
