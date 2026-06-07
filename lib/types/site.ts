import type { SiteAnalysis } from "./analysis";

export type SiteStage = "pending" | "analyzed";

export type ScoreLabel = "Bad" | "OK" | "Good" | "Great";

export type SiteCandidate = {
  id: string;
  address: string;
  lat: number;
  lng: number;
  stage: SiteStage;
  score?: number;
  scoreLabel?: ScoreLabel;
  analysis?: SiteAnalysis;
  createdAt: string;
};

export const SITE_STAGES: { value: SiteStage; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "analyzed", label: "Analyzed" },
];

export function createSiteCandidate(
  partial: Pick<SiteCandidate, "address" | "lat" | "lng"> &
    Partial<
      Pick<
        SiteCandidate,
        "stage" | "score" | "scoreLabel" | "analysis"
      >
    >
): SiteCandidate {
  return {
    id: crypto.randomUUID(),
    stage: partial.stage ?? "pending",
    score: partial.score,
    scoreLabel: partial.scoreLabel,
    analysis: partial.analysis,
    createdAt: new Date().toISOString(),
    address: partial.address,
    lat: partial.lat,
    lng: partial.lng,
  };
}

export function scoreToLabel(score: number): ScoreLabel {
  if (score >= 80) return "Great";
  if (score >= 60) return "Good";
  if (score >= 40) return "OK";
  return "Bad";
}
