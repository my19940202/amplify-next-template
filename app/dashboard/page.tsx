import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import PricingCards from "@/app/components/pricing/PricingCards";
import { createClient } from "@/lib/supabase/server";
import { getUsageStatus } from "@/lib/usage/quota-server";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Manage your account and choose a plan for store location analysis.",
};

function formatJoinDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(isoDate));
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const usage = await getUsageStatus({ userId: user.id });
  const joinedAt = user.created_at ? formatJoinDate(user.created_at) : null;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="text-sm font-semibold text-slate-900">
            Store Location Analyzer
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/map"
              className="rounded-lg px-3 py-1.5 text-sm text-slate-600 hover:text-slate-900"
            >
              Map workspace
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="rounded-lg bg-red-400 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-500"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Account
          </h1>
          <p className="mt-2 text-slate-600">
            Review your profile and pick the plan that fits your site selection
            workflow.
          </p>
        </div>

        <section className="mb-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-panel sm:p-8">
          <h2 className="text-lg font-semibold text-slate-900">
            Profile
          </h2>

          <dl className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Email
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">
                {user.email ?? "—"}
              </dd>
            </div>

            {joinedAt && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                  Member since
                </dt>
                <dd className="mt-1 text-sm font-medium text-slate-900">
                  {joinedAt}
                </dd>
              </div>
            )}

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Current plan
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">Free</dd>
            </div>

            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                Usage this month
              </dt>
              <dd className="mt-1 text-sm font-medium text-slate-900">
                {usage.used}/{usage.limit} analyses
                {usage.remaining <= 0 && (
                  <span className="ml-2 text-xs font-normal text-amber-700">
                    Limit reached
                  </span>
                )}
              </dd>
            </div>
          </dl>

          {usage.remaining <= 0 && (
            <p className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              You have used all free analyses for this month. Upgrade to Pro or
              purchase a one-time report to keep evaluating locations.
            </p>
          )}
        </section>

        <section>
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Plans & billing
            </h2>
            <p className="mt-2 text-slate-600">
              Compare plans and upgrade when you need more analyses or deeper
              reports.
            </p>
          </div>

          <PricingCards currentPlanId="free" />
        </section>
      </main>
    </div>
  );
}
