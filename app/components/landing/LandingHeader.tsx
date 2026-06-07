import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function LandingHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold text-slate-900">
          Store Location Analyzer
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-600 md:flex">
          <a href="#how-it-works" className="hover:text-slate-900">
            How It Works
          </a>
          <a href="#features" className="hover:text-slate-900">
            Features
          </a>
          <a href="#pricing" className="hover:text-slate-900">
            Pricing
          </a>
          <a href="#faq" className="hover:text-slate-900">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 sm:inline"
              >
                Dashboard
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="hidden rounded-lg bg-red-400 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500 sm:inline"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900 sm:inline"
            >
              Log in
            </Link>
          )}
          <Link
            href="/map"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Try Free Analysis
          </Link>
        </div>
      </div>
    </header>
  );
}
