import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white px-4 py-16 sm:px-6 sm:py-24">
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-brand-200 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-64 w-64 rounded-full bg-slate-200 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-wide text-brand-700">
            Retail site selection · Google Maps powered
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Score store locations in minutes, not weeks
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-slate-600">
            A lightweight store location analyzer for solo founders and small
            businesses. Compare candidates with competitor density, foot traffic
            proxies, and street-level visibility — before you sign a lease.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/map"
              className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/20 hover:bg-brand-700"
            >
              Start Your Free Analysis
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              See how it works
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-500">
            Free tier · 3 analyses/month · No credit card
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel">
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2 text-xs text-slate-400">Map workspace preview</span>
          </div>
          <div className="grid gap-0 md:grid-cols-[280px_1fr]">
            <div className="space-y-3 border-r border-slate-100 p-4">
              <div className="rounded-lg border border-brand-200 bg-brand-50 p-3">
                <p className="text-xs font-medium text-slate-900">
                  123 Market St, San Francisco
                </p>
                <p className="mt-1 text-lg font-bold text-brand-700">78</p>
                <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-800">
                  Good
                </span>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 opacity-60">
                <p className="text-xs text-slate-600">Pending site…</p>
              </div>
            </div>
            <div className="relative min-h-[220px] bg-[linear-gradient(135deg,#dbeafe_0%,#e2e8f0_50%,#f8fafc_100%)]">
              <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600 ring-4 ring-brand-200" />
              <div className="absolute bottom-4 right-4 rounded-lg bg-white/90 px-3 py-2 text-xs text-slate-600 shadow-sm">
                Competitors · Traffic · Amenities
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
