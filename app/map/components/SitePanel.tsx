"use client";

import { useEffect, useRef, useState } from "react";
import type { ExportFormat } from "@/lib/report/export-client";
import type { UsageInfo } from "@/lib/types/usage";
import type { SiteCandidate, SiteStage } from "@/lib/types/site";
import SiteCard from "./SiteCard";
import TopToolbar from "./TopToolbar";
import UsageBanner from "./UsageBanner";

type SitePanelProps = {
  sites: SiteCandidate[];
  selectedId: string | null;
  analyzingIds: Set<string>;
  isAnalyzing: boolean;
  exportCount: number;
  usage: UsageInfo | null;
  onSelectSite: (id: string) => void;
  onAddSite: () => void;
  onStageChange: (id: string, stage: SiteStage) => void;
  onNewAnalysis: () => void;
  onPlaceSelect: (place: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  onAnalyzeSite: (id: string) => void;
  onExport: (format: ExportFormat) => void;
};

const COLUMNS: { stage: SiteStage; title: string; description: string }[] = [
  {
    stage: "pending",
    title: "Pending",
    description: "Sites waiting for analysis",
  },
  {
    stage: "analyzed",
    title: "Analyzed",
    description: "Scored and reviewed",
  },
];

export default function SitePanel({
  sites,
  selectedId,
  analyzingIds,
  isAnalyzing,
  onSelectSite,
  onAddSite,
  onStageChange,
  onNewAnalysis,
  onPlaceSelect,
  onAnalyzeSite,
  onExport,
  exportCount,
  usage,
}: SitePanelProps) {
  const [mobileExpanded, setMobileExpanded] = useState(true);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (!selectedId) return;
    const el = cardRefs.current.get(selectedId);
    el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedId]);

  return (
    <aside
      className={`pointer-events-auto absolute z-10 flex flex-col overflow-hidden rounded-2xl bg-white/95 shadow-panel backdrop-blur-sm transition-all
        left-4 top-4 max-h-[calc(100vh-2rem)] w-[min(400px,calc(100vw-2rem))]
        max-md:inset-x-0 max-md:bottom-0 max-md:top-auto max-md:left-0 max-md:w-full max-md:rounded-b-none max-md:rounded-t-2xl
        ${mobileExpanded ? "max-md:max-h-[48vh]" : "max-md:max-h-14"}`}
    >
      <button
        type="button"
        className="hidden w-full shrink-0 flex-col items-center border-b border-slate-100 py-2 max-md:flex"
        onClick={() => setMobileExpanded((v) => !v)}
        aria-expanded={mobileExpanded}
        aria-label={mobileExpanded ? "Collapse panel" : "Expand panel"}
      >
        <span className="mb-1 h-1 w-10 rounded-full bg-slate-300" />
        <span className="text-xs font-medium text-slate-600">
          {mobileExpanded ? "Site Analysis" : `${sites.length} sites`}
        </span>
      </button>

      <div
        className={`flex min-h-0 flex-1 flex-col ${mobileExpanded ? "" : "max-md:hidden"}`}
      >
        <div className="hidden border-b border-slate-100 px-4 py-3 md:block">
          <h1 className="text-base font-semibold text-slate-900">
            Site Analysis
          </h1>
          <p className="mt-0.5 text-xs text-slate-500">
            {sites.length} site{sites.length !== 1 ? "s" : ""} · search or
            click map to add
          </p>
        </div>

        <TopToolbar
          onNewAnalysis={onNewAnalysis}
          onPlaceSelect={onPlaceSelect}
          onExport={onExport}
          exportCount={exportCount}
          analyzing={isAnalyzing}
        />

        <UsageBanner usage={usage} />

        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
            {COLUMNS.map((column) => {
              const columnSites = sites.filter((s) => s.stage === column.stage);

              return (
                <div key={column.stage} className="min-w-0">
                  <div className="mb-2">
                    <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {column.title}
                    </h2>
                    <p className="text-[10px] text-slate-400">
                      {column.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {columnSites.length === 0 ? (
                      <p className="rounded-lg border border-dashed border-slate-200 px-2 py-4 text-center text-xs text-slate-400">
                        No sites
                      </p>
                    ) : (
                      columnSites.map((site) => (
                        <SiteCard
                          key={site.id}
                          site={site}
                          selected={selectedId === site.id}
                          analyzing={analyzingIds.has(site.id)}
                          cardRef={(el) => {
                            if (el) cardRefs.current.set(site.id, el);
                            else cardRefs.current.delete(site.id);
                          }}
                          onClick={() => onSelectSite(site.id)}
                          onStageChange={(stage) =>
                            onStageChange(site.id, stage)
                          }
                          onAnalyze={() => onAnalyzeSite(site.id)}
                        />
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onAddSite}
            disabled={isAnalyzing || (usage != null && usage.remaining <= 0)}
            className="w-full rounded-lg border border-dashed border-brand-500/50 bg-brand-50 py-2.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-100 disabled:opacity-50"
          >
            + Add a site
          </button>
        </div>
      </div>
    </aside>
  );
}
