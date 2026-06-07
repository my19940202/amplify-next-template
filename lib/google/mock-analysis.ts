import type { SiteAnalysis } from "@/lib/types/analysis";
import { calculateSiteAnalysis } from "@/lib/scoring/calculate";

/** Deterministic mock for local dev when Google APIs are unreachable. */
export function mockSiteAnalysis(lat: number, lng: number): SiteAnalysis {
  const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233)) * 10000;
  return calculateSiteAnalysis({
    stores: (seed % 5) + 1,
    restaurants: (seed % 7) + 2,
    cafes: (seed % 4) + 1,
    offices: (seed % 6) + 1,
    schools: seed % 3,
    transit: (seed % 4) + 1,
    shoppingMalls: seed % 2,
    parking: (seed % 3) + 1,
    competitors: [
      {
        name: "Mock Competitor A",
        rating: 4.2,
        distanceMeters: 120 + (seed % 200),
      },
      {
        name: "Mock Competitor B",
        rating: 3.8,
        distanceMeters: 200 + (seed % 250),
      },
    ],
  });
}

export function mockReverseGeocode(lat: number, lng: number): string {
  return `Mock Address near ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
}
