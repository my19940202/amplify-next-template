import type { SiteCandidate } from "@/lib/types/site";
import { buildReportHtml, slugifyAddress } from "./build-html";

export type ExportFormat = "html" | "pdf";

function reportFilename(sites: SiteCandidate[], format: ExportFormat): string {
  const date = new Date().toISOString().slice(0, 10);
  if (sites.length === 1) {
    const slug = slugifyAddress(sites[0].address) || "site";
    return `site-report-${slug}-${date}.${format === "html" ? "html" : "pdf"}`;
  }
  return `site-report-${sites.length}-sites-${date}.${format === "html" ? "html" : "pdf"}`;
}

export function getExportableSites(
  sites: SiteCandidate[],
  selectedId: string | null
): SiteCandidate[] {
  if (selectedId) {
    const selected = sites.find((s) => s.id === selectedId);
    if (selected?.analysis) return [selected];
  }
  return sites.filter((s) => s.analysis);
}

export function downloadReportHtml(sites: SiteCandidate[]): void {
  if (sites.length === 0) {
    throw new Error("No analyzed sites to export");
  }

  const html = buildReportHtml(sites, {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    title:
      sites.length === 1
        ? `Site Report — ${sites[0].address}`
        : `Site Comparison Report (${sites.length} sites)`,
  });

  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = reportFilename(sites, "html");
  anchor.click();
  URL.revokeObjectURL(url);
}

export function printReportPdf(sites: SiteCandidate[]): void {
  if (sites.length === 0) {
    throw new Error("No analyzed sites to export");
  }

  const html = buildReportHtml(sites, {
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    title:
      sites.length === 1
        ? `Site Report — ${sites[0].address}`
        : `Site Comparison Report (${sites.length} sites)`,
  });

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    throw new Error("Popup blocked — allow popups to export PDF");
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}

export function exportReport(
  sites: SiteCandidate[],
  format: ExportFormat
): void {
  if (format === "html") {
    downloadReportHtml(sites);
  } else {
    printReportPdf(sites);
  }
}
