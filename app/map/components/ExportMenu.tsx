"use client";

import { useEffect, useRef, useState } from "react";
import type { ExportFormat } from "@/lib/report/export-client";

type ExportMenuProps = {
  disabled?: boolean;
  exportCount: number;
  onExport: (format: ExportFormat) => void;
  compact?: boolean;
};

export default function ExportMenu({
  disabled,
  exportCount,
  onExport,
  compact,
}: ExportMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const isDisabled = disabled || exportCount === 0;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setOpen((v) => !v)}
        className={`rounded-lg border border-slate-200 text-xs font-medium disabled:text-slate-400 ${
          compact
            ? "flex-1 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            : "px-3 py-1.5 text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        }`}
      >
        Export{exportCount > 0 ? ` (${exportCount})` : ""}
      </button>

      {open && !isDisabled && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
            onClick={() => {
              onExport("html");
              setOpen(false);
            }}
          >
            Download HTML
          </button>
          <button
            type="button"
            className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-50"
            onClick={() => {
              onExport("pdf");
              setOpen(false);
            }}
          >
            Print / Save PDF
          </button>
        </div>
      )}
    </div>
  );
}
