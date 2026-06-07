"use client";

import {
  FaArrowsRotate,
  FaLocationDot,
  FaSpinner,
  FaStreetView,
  FaTrashCan,
  FaXmark,
} from "react-icons/fa6";
import type { ExportFormat } from "@/lib/report/export-client";
import type { SiteCandidate } from "@/lib/types/site";
import ExportMenu from "./ExportMenu";

type SiteDetailDrawerProps = {
  site: SiteCandidate | null;
  analyzing?: boolean;
  onClose: () => void;
  onRemove: (id: string) => void;
  onReanalyze?: (id: string) => void;
  onOpenStreetView?: (site: SiteCandidate) => void;
  onExport?: (format: ExportFormat) => void;
  canExport?: boolean;
};

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-slate-500">{label}</span>
        <span className="font-medium text-slate-700">{score}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-500 transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function SiteDetailDrawer({
  site,
  analyzing,
  onClose,
  onRemove,
  onReanalyze,
  onOpenStreetView,
  onExport,
  canExport,
}: SiteDetailDrawerProps) {
  if (!site) return null;

  const analysis = site.analysis;

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-20 bg-slate-900/20 md:hidden"
        onClick={onClose}
        aria-label="Close details overlay"
      />

      <div className="pointer-events-auto absolute z-30 overflow-y-auto rounded-2xl bg-white/95 p-4 shadow-panel backdrop-blur-sm
        top-4 right-4 max-h-[calc(100vh-6rem)] w-[min(360px,calc(100vw-2rem))]
        max-md:fixed max-md:inset-x-0 max-md:w-full max-md:max-h-none max-md:rounded-none max-md:rounded-t-2xl">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Site Details
            </h2>
            <p className="mt-1 flex items-start gap-1.5 text-xs text-slate-500">
              <FaLocationDot
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600"
                aria-hidden
              />
              {site.address}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close details"
          >
            <FaXmark className="h-3.5 w-3.5" />
          </button>
        </div>

        {analyzing && (
          <p className="mb-3 flex items-center gap-2 rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">
            <FaSpinner
              className="h-3.5 w-3.5 shrink-0 animate-spin"
              aria-hidden
            />
            Running competitor, traffic, and amenities analysis…
          </p>
        )}

        <dl className="mb-3 space-y-2 text-xs">
          <div className="flex justify-between">
            <dt className="text-slate-500">Overall score</dt>
            <dd className="font-semibold text-slate-900">
              {site.score != null ? `${site.score} / 100` : "—"}
            </dd>
          </div>
          {site.scoreLabel && (
            <div className="flex justify-between">
              <dt className="text-slate-500">Rating</dt>
              <dd className="capitalize text-slate-700">{site.scoreLabel}</dd>
            </div>
          )}
        </dl>

        {analysis ? (
          <div className="space-y-4">
            <ScoreBar label="Foot traffic" score={analysis.footTraffic.score} />
            <ScoreBar label="Competition" score={analysis.competition.score} />
            <ScoreBar label="Amenities" score={analysis.amenities.score} />
            <ScoreBar label="Visibility" score={analysis.visibility.score} />

            <div>
              <h3 className="mb-1 text-xs font-semibold text-slate-700">
                Competition ({analysis.competition.count} nearby)
              </h3>
              {analysis.competition.nearby.length === 0 ? (
                <p className="text-xs text-slate-400">
                  No direct competitors found
                </p>
              ) : (
                <ul className="space-y-1">
                  {analysis.competition.nearby.map((c) => (
                    <li
                      key={`${c.name}-${c.distanceMeters}`}
                      className="flex justify-between text-xs text-slate-600"
                    >
                      <span className="truncate pr-2">{c.name}</span>
                      <span className="shrink-0 text-slate-400">
                        {c.rating != null ? `★ ${c.rating}` : ""}{" "}
                        {c.distanceMeters}m
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="mb-1 text-xs font-semibold text-slate-700">
                Foot traffic proxies
              </h3>
              <ul className="space-y-0.5">
                {analysis.footTraffic.breakdown.map((item) => (
                  <li
                    key={item.label}
                    className="flex justify-between text-xs text-slate-600"
                  >
                    <span>{item.label}</span>
                    <span>{item.count} POIs</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-1 text-xs font-semibold text-slate-700">
                Amenities
              </h3>
              <p className="text-xs text-slate-600">
                Parking {analysis.amenities.parking} · Transit{" "}
                {analysis.amenities.transit} · Dining{" "}
                {analysis.amenities.dining}
              </p>
            </div>

            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
              {analysis.recommendation}
            </p>
            <p className="text-[10px] text-slate-400">
              {analysis.visibility.note}
            </p>
          </div>
        ) : (
          !analyzing && (
            <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              Search an address or click Analyze to generate a site score.
            </p>
          )
        )}

        <div className="mt-4 flex flex-wrap gap-2">
          {onOpenStreetView && (
            <button
              type="button"
              onClick={() => onOpenStreetView(site)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              <FaStreetView className="h-3.5 w-3.5" aria-hidden />
              Street View
            </button>
          )}
          {onReanalyze && (
            <button
              type="button"
              onClick={() => onReanalyze(site.id)}
              disabled={analyzing}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <FaArrowsRotate className="h-3.5 w-3.5" aria-hidden />
              Re-analyze
            </button>
          )}
          {onExport && (
            <ExportMenu
              compact
              exportCount={canExport ? 1 : 0}
              onExport={onExport}
              disabled={analyzing}
            />
          )}
          <button
            type="button"
            onClick={() => onRemove(site.id)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
          >
            <FaTrashCan className="h-3.5 w-3.5" aria-hidden />
            Remove
          </button>
        </div>
      </div>
    </>
  );
}
