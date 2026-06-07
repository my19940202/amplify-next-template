"use client";

import type { SiteCandidate } from "@/lib/types/site";
import { scoreToLabel } from "@/lib/types/site";
import {
  getAnalysisSummary,
  getAnalysisTrend,
  MiniScoreTrend,
} from "./MiniScoreTrend";

type SiteCardProps = {
  site: SiteCandidate;
  selected: boolean;
  analyzing?: boolean;
  cardRef?: (el: HTMLDivElement | null) => void;
  onClick: () => void;
  onStageChange: (stage: SiteCandidate["stage"]) => void;
  onAnalyze?: () => void;
};

const labelStyles: Record<
  NonNullable<SiteCandidate["scoreLabel"]>,
  string
> = {
  Bad: "bg-red-100 text-red-700",
  OK: "bg-amber-100 text-amber-800",
  Good: "bg-emerald-100 text-emerald-800",
  Great: "bg-blue-100 text-blue-800",
};

export default function SiteCard({
  site,
  selected,
  analyzing,
  cardRef,
  onClick,
  onStageChange,
  onAnalyze,
}: SiteCardProps) {
  const label =
    site.scoreLabel ??
    (site.score != null ? scoreToLabel(site.score) : null);
  const trend = getAnalysisTrend(site);
  const summary = getAnalysisSummary(site);

  return (
    <div
      ref={cardRef}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={`w-full cursor-pointer rounded-lg border p-3 text-left transition-all ${
        selected
          ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/30"
          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <p className="line-clamp-2 text-sm font-medium text-slate-900">
          {site.address}
        </p>
        <div className="flex shrink-0 flex-col items-end gap-1">
          {analyzing ? (
            <span className="text-xs text-brand-600">…</span>
          ) : site.score != null ? (
            <span className="text-lg font-bold text-slate-900">{site.score}</span>
          ) : null}
          {!analyzing && trend.length > 0 && (
            <MiniScoreTrend scores={trend} />
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        {analyzing ? (
          <span className="text-xs text-brand-600">Analyzing…</span>
        ) : label ? (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${labelStyles[label]}`}
          >
            {label}
          </span>
        ) : (
          <span className="text-xs text-slate-400">Not analyzed</span>
        )}

        <div className="flex items-center gap-1">
          {!analyzing && !site.analysis && onAnalyze && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAnalyze();
              }}
              className="rounded border border-brand-200 px-1.5 py-0.5 text-[10px] font-medium text-brand-700 hover:bg-brand-50"
            >
              Analyze
            </button>
          )}
          <select
            value={site.stage}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              onStageChange(e.target.value as SiteCandidate["stage"])
            }
            className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-600"
          >
            <option value="pending">Pending</option>
            <option value="analyzed">Analyzed</option>
          </select>
        </div>
      </div>

      {selected && summary && (
        <p className="mt-2 border-t border-brand-200/60 pt-2 text-[11px] text-slate-600">
          {summary}
        </p>
      )}
    </div>
  );
}
