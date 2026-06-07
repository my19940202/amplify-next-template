"use client";

import type { ExportFormat } from "@/lib/report/export-client";
import AddressSearch from "./AddressSearch";
import ExportMenu from "./ExportMenu";

type TopToolbarProps = {
  onNewAnalysis: () => void;
  onPlaceSelect: (place: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  onExport: (format: ExportFormat) => void;
  exportCount: number;
  analyzing?: boolean;
};

export default function TopToolbar({
  onNewAnalysis,
  onPlaceSelect,
  onExport,
  exportCount,
  analyzing,
}: TopToolbarProps) {
  return (
    <div className="border-b border-slate-100 px-4 py-3">
      <AddressSearch onPlaceSelect={onPlaceSelect} disabled={analyzing} />

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-0.5">
          <span className="rounded-md bg-brand-500 px-2.5 py-1 text-xs font-medium text-white">
            Map
          </span>
          <span className="rounded-md px-2.5 py-1 text-xs text-slate-400">
            Kanban
          </span>
          <span className="rounded-md px-2.5 py-1 text-xs text-slate-400">
            List
          </span>
        </div>

        <ExportMenu
          exportCount={exportCount}
          onExport={onExport}
          disabled={analyzing}
        />

        <button
          type="button"
          onClick={onNewAnalysis}
          disabled={analyzing}
          className="ml-auto rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700 disabled:opacity-50"
        >
          New Analysis
        </button>
      </div>

      {analyzing && (
        <p className="mt-2 text-xs text-brand-600">Analyzing location…</p>
      )}
    </div>
  );
}
