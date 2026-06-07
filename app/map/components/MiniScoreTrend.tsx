"use client";

import type { SiteCandidate } from "@/lib/types/site";

type MiniScoreTrendProps = {
  scores: number[];
  className?: string;
};

export function MiniScoreTrend({ scores, className = "" }: MiniScoreTrendProps) {
  if (scores.length === 0) return null;

  return (
    <div
      className={`flex items-end gap-0.5 ${className}`}
      aria-label="Score breakdown"
    >
      {scores.map((score, i) => (
        <div
          key={i}
          className="w-1.5 rounded-sm bg-brand-200"
          style={{ height: `${Math.max(4, (score / 100) * 16)}px` }}
          title={`${score}`}
        />
      ))}
    </div>
  );
}

export function getAnalysisTrend(site: SiteCandidate): number[] {
  if (!site.analysis) return [];
  const { footTraffic, competition, amenities, visibility } = site.analysis;
  return [
    footTraffic.score,
    competition.score,
    amenities.score,
    visibility.score,
  ];
}

export function getAnalysisSummary(site: SiteCandidate): string | null {
  if (!site.analysis) return null;
  const { competition, footTraffic, amenities } = site.analysis;
  return `${competition.count} competitors · Traffic ${footTraffic.score} · Amenities ${amenities.score}`;
}
