import type { SiteAnalysis } from "@/lib/types/analysis";
import type { UsageInfo } from "@/lib/types/usage";

export type AnalyzeApiResponse = SiteAnalysis & {
  usage?: UsageInfo;
};

export class AnalysisQuotaError extends Error {
  usage: UsageInfo;

  constructor(message: string, usage: UsageInfo) {
    super(message);
    this.name = "AnalysisQuotaError";
    this.usage = usage;
  }
}

export async function fetchUsageStatus(): Promise<UsageInfo> {
  const res = await fetch("/api/usage", { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to load usage status");
  }
  const data = (await res.json()) as { usage: UsageInfo };
  return data.usage;
}

export async function fetchSiteAnalysis(
  lat: number,
  lng: number
): Promise<AnalyzeApiResponse> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng }),
  });

  const data = (await res.json().catch(() => ({}))) as AnalyzeApiResponse & {
    error?: string;
    usage?: UsageInfo;
  };

  if (res.status === 429 && data.usage) {
    throw new AnalysisQuotaError(
      data.error ?? "Monthly analysis limit reached",
      data.usage
    );
  }

  if (!res.ok) {
    throw new Error(data.error ?? "Analysis request failed");
  }

  return data;
}

export async function fetchReverseGeocode(
  lat: number,
  lng: number
): Promise<string> {
  const res = await fetch("/api/geocode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng }),
  });

  if (!res.ok) {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }

  const data = (await res.json()) as { address: string };
  return data.address;
}
