import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Store Location Analyzer",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="text-sm font-semibold text-slate-900">
            ← Store Location Analyzer
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
        <div className="mt-8 space-y-4 text-slate-600">
          <p>
            Store Location Analyzer provides location scoring and analysis for
            informational purposes only. Scores and foot traffic estimates are
            proxies — not guarantees of business performance.
          </p>
          <p>
            You are responsible for verifying any site decision with on-site
            visits, lease review, and professional advice. We are not liable for
            business outcomes based on tool output.
          </p>
          <p>
            Use of Google Maps data is subject to{" "}
            <a
              href="https://maps.google.com/help/terms_maps/"
              className="text-brand-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s terms
            </a>
            .
          </p>
        </div>
      </main>
    </div>
  );
}
