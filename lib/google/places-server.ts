import {
  calculateSiteAnalysis,
  type RawPoiCounts,
} from "@/lib/scoring/calculate";
import type { SiteAnalysis } from "@/lib/types/analysis";
import { cacheKey, getCached, setCached } from "./cache";
import { fetchGoogle, isGoogleMapsMockEnabled } from "./fetch-google";
import { mockReverseGeocode, mockSiteAnalysis } from "./mock-analysis";

type NearbyResult = {
  place_id: string;
  name: string;
  rating?: number;
  types?: string[];
  geometry?: { location: { lat: number; lng: number } };
};

type NearbyResponse = {
  status: string;
  results?: NearbyResult[];
  error_message?: string;
};

const RADIUS = 500;
const COMPETITOR_TYPES = ["store", "restaurant", "cafe"] as const;
const FOOT_TRAFFIC_TYPES = [
  "office",
  "school",
  "transit_station",
  "shopping_mall",
] as const;
const AMENITY_TYPES = ["parking"] as const;

function getApiKey(): string {
  const key =
    process.env.GOOGLE_MAPS_API_KEY ??
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error("Missing GOOGLE_MAPS_API_KEY");
  }
  return key;
}

function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function nearbySearch(
  lat: number,
  lng: number,
  type: string
): Promise<NearbyResult[]> {
  const key = getApiKey();
  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
  );
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", String(RADIUS));
  url.searchParams.set("type", type);
  url.searchParams.set("key", key);

  const res = await fetchGoogle(url.toString());
  const data = (await res.json()) as NearbyResponse;

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    throw new Error(data.error_message ?? `Places API error: ${data.status}`);
  }

  return data.results ?? [];
}

function toCompetitor(
  result: NearbyResult,
  originLat: number,
  originLng: number
) {
  const lat = result.geometry?.location.lat ?? originLat;
  const lng = result.geometry?.location.lng ?? originLng;
  return {
    name: result.name,
    rating: result.rating,
    distanceMeters: Math.round(haversineMeters(originLat, originLng, lat, lng)),
  };
}

export async function analyzeLocation(
  lat: number,
  lng: number
): Promise<SiteAnalysis> {
  const key = cacheKey(lat, lng, "analysis");
  const cached = getCached<SiteAnalysis>(key);
  if (cached) return cached;

  if (isGoogleMapsMockEnabled()) {
    const analysis = mockSiteAnalysis(lat, lng);
    setCached(key, analysis);
    return analysis;
  }

  const searches = [
    ...COMPETITOR_TYPES.map((type) => nearbySearch(lat, lng, type)),
    ...FOOT_TRAFFIC_TYPES.map((type) => nearbySearch(lat, lng, type)),
    ...AMENITY_TYPES.map((type) => nearbySearch(lat, lng, type)),
  ];

  const [
    stores,
    restaurants,
    cafes,
    offices,
    schools,
    transit,
    shoppingMalls,
    parking,
  ] = await Promise.all(searches);

  const competitorMap = new Map<
    string,
    { name: string; rating?: number; distanceMeters: number }
  >();

  for (const result of [...stores, ...restaurants, ...cafes]) {
    competitorMap.set(result.place_id, toCompetitor(result, lat, lng));
  }

  const counts: RawPoiCounts = {
    stores: stores.length,
    restaurants: restaurants.length,
    cafes: cafes.length,
    offices: offices.length,
    schools: schools.length,
    transit: transit.length,
    shoppingMalls: shoppingMalls.length,
    parking: parking.length,
    competitors: Array.from(competitorMap.values()),
  };

  const analysis = calculateSiteAnalysis(counts);
  setCached(key, analysis);
  return analysis;
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  const key = cacheKey(lat, lng, "geocode");
  const cached = getCached<string>(key);
  if (cached) return cached;

  if (isGoogleMapsMockEnabled()) {
    const address = mockReverseGeocode(lat, lng);
    setCached(key, address);
    return address;
  }

  const apiKey = getApiKey();
  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("latlng", `${lat},${lng}`);
  url.searchParams.set("key", apiKey);

  try {
    const res = await fetchGoogle(url.toString());
    const data = (await res.json()) as {
      status: string;
      results?: { formatted_address: string }[];
      error_message?: string;
    };

    if (data.status !== "OK" || !data.results?.[0]) {
      const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      setCached(key, fallback);
      return fallback;
    }

    const address = data.results[0].formatted_address;
    setCached(key, address);
    return address;
  } catch {
    const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    setCached(key, fallback);
    return fallback;
  }
}
