import Link from "next/link";

export default function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="border-b border-slate-800 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to find your best location?
          </h2>
          <p className="mt-3 text-slate-400">
            Score your first candidate in under 3 minutes — free tier available.
          </p>
          <Link
            href="/map"
            className="mt-8 inline-flex rounded-xl bg-brand-600 px-8 py-3 text-sm font-semibold text-white hover:bg-brand-500"
          >
            Try Free Analysis
          </Link>
        </div>
      </div>

      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} Store Location Analyzer
        </p>
        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          <Link href="/privacy" className="hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
          <Link href="/map" className="hover:text-white">
            Map Workspace
          </Link>
        </nav>
      </div>
    </footer>
  );
}
