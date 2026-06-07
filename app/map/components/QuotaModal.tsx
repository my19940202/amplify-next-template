"use client";

import Link from "next/link";
import type { UsageInfo } from "@/lib/types/usage";

type QuotaModalProps = {
  usage: UsageInfo;
  onClose: () => void;
};

export default function QuotaModal({ usage, onClose }: QuotaModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-panel"
        role="dialog"
        aria-modal="true"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Free limit reached
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          You&apos;ve used all {usage.limit} free analyses for{" "}
          {usage.monthKey}. Upgrade to Pro for unlimited analyses, or sign in to
          sync usage across devices.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          <Link
            href="/#pricing"
            className="rounded-lg bg-brand-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-brand-700"
          >
            View Pro plans
          </Link>
          <Link
            href="/login?redirect=/map"
            className="rounded-lg border border-slate-200 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Sign in
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="py-2 text-sm text-slate-500 hover:text-slate-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
