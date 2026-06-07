import type { SiteAnalysis } from "@/lib/types/analysis";
import { scoreToLabel } from "@/lib/types/site";

export type RawPoiCounts = {
  stores: number;
  restaurants: number;
  cafes: number;
  offices: number;
  schools: number;
  transit: number;
  shoppingMalls: number;
  parking: number;
  competitors: { name: string; rating?: number; distanceMeters: number }[];
};

const RECOMMENDATIONS: Record<
  ReturnType<typeof scoreToLabel>,
  string
> = {
  Great:
    "Strong foot-traffic proxies with manageable competition. Schedule a peak-hour site visit.",
  Good:
    "Solid trade-offs between visibility and competition. Compare rent before committing.",
  OK:
    "Mixed signals — validate demand with weekend and weekday foot traffic checks.",
  Bad:
    "Weak traffic proxies or heavy competition nearby. Prioritize other candidates.",
};

function clamp(value: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, value));
}

function competitionScore(count: number): number {
  if (count === 0) return 92;
  if (count <= 3) return 78;
  if (count <= 8) return 58;
  if (count <= 15) return 38;
  return 22;
}

function footTrafficScore(counts: RawPoiCounts): {
  score: number;
  breakdown: SiteAnalysis["footTraffic"]["breakdown"];
} {
  const items = [
    { label: "Offices", count: counts.offices, weight: 3 },
    { label: "Schools", count: counts.schools, weight: 2 },
    { label: "Transit", count: counts.transit, weight: 4 },
    { label: "Shopping", count: counts.shoppingMalls, weight: 2 },
  ];

  const weighted = items.reduce(
    (sum, item) => sum + item.count * item.weight,
    0
  );
  const score = clamp(Math.round(weighted * 4));
  const breakdown = items.map((item) => ({
    ...item,
    contribution: item.count * item.weight,
  }));

  return { score, breakdown };
}

function amenitiesScore(counts: RawPoiCounts): SiteAnalysis["amenities"] {
  const parking = counts.parking;
  const transit = counts.transit;
  const dining = counts.restaurants + counts.cafes;

  const parkingScore = clamp(parking * 25, 0, 100);
  const transitScore = clamp(transit * 20, 0, 100);
  const diningScore = clamp(dining * 8, 0, 100);
  const score = Math.round((parkingScore + transitScore + diningScore) / 3);

  return { score, parking, transit, dining };
}

function visibilityScore(
  footTraffic: number,
  competition: number
): SiteAnalysis["visibility"] {
  const score = clamp(Math.round(50 + (footTraffic - competition) / 3));
  const note =
    score >= 65
      ? "Likely visible from nearby foot paths based on POI density."
      : score >= 45
        ? "Moderate street presence — confirm signage sightlines on-site."
        : "May be tucked away — check corner visibility and parking access.";

  return { score, note };
}

export function calculateSiteAnalysis(counts: RawPoiCounts): SiteAnalysis {
  const competitorCount =
    counts.stores + counts.restaurants + counts.cafes;
  const compScore = competitionScore(competitorCount);
  const foot = footTrafficScore(counts);
  const amenities = amenitiesScore(counts);
  const visibility = visibilityScore(foot.score, compScore);

  const overallScore = Math.round(
    foot.score * 0.4 +
      compScore * 0.3 +
      amenities.score * 0.2 +
      visibility.score * 0.1
  );
  const scoreLabel = scoreToLabel(overallScore);

  const nearby = counts.competitors
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
    .slice(0, 5);

  return {
    competition: {
      count: competitorCount,
      score: compScore,
      nearby,
    },
    footTraffic: foot,
    amenities,
    visibility,
    overallScore,
    scoreLabel,
    recommendation: RECOMMENDATIONS[scoreLabel],
    analyzedAt: new Date().toISOString(),
  };
}
