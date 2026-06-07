import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Store Location Analyzer",
};

export default function ContactPage() {
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
        <h1 className="text-3xl font-bold text-slate-900">Contact</h1>
        <p className="mt-6 text-slate-600">
          Questions about retail site selection, partnerships, or feedback on
          the map workspace? Reach out — we read every message.
        </p>
        <p className="mt-4">
          <a
            href="mailto:siteselect@163.com"
            className="font-medium text-brand-600 hover:underline"
          >
            siteselect@163.com
          </a>
        </p>
        <p className="mt-8">
          <Link
            href="/map"
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Try the map workspace
          </Link>
        </p>
      </main>
    </div>
  );
}
