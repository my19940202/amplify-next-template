"use client";

import Link from "next/link";
import type { UsageInfo } from "@/lib/types/usage";

type UsageBannerProps = {
  usage: UsageInfo | null;
};

export default function UsageBanner({ usage }: UsageBannerProps) {
  if (!usage) return null;

  const atLimit = usage.remaining <= 0;
  const nearLimit = usage.remaining === 1;

  return (
    <div
      className={`border-b px-4 py-2 text-xs ${
        atLimit
          ? "border-amber-200 bg-amber-50 text-amber-900"
          : nearLimit
            ? "border-brand-100 bg-brand-50 text-brand-800"
            : "border-slate-100 bg-slate-50 text-slate-600"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span>
          Free plan:{" "}
          <strong>
            {usage.used}/{usage.limit}
          </strong>{" "}
          analyses used this month
          {usage.isAuthenticated ? " (signed in)" : " (guest)"}
        </span>

        {atLimit ? (
          <span className="flex flex-wrap gap-2">
            <Link
              href="/login?redirect=/map"
              className="font-medium text-brand-700 underline"
            >
              Sign in
            </Link>
            <Link href="/#pricing" className="font-medium underline">
              View Pro
            </Link>
          </span>
        ) : (
          <Link href="/#pricing" className="text-slate-500 hover:text-slate-700">
            Upgrade
          </Link>
        )}
      </div>
    </div>
  );
}
