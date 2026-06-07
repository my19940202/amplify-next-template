import Link from "next/link";
import type { PlanId, PricingPlan } from "@/lib/pricing/plans";
import { PRICING_PLANS } from "@/lib/pricing/plans";

type PricingCardsProps = {
  plans?: PricingPlan[];
  currentPlanId?: PlanId;
};

export default function PricingCards({
  plans = PRICING_PLANS,
  currentPlanId,
}: PricingCardsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => {
        const isCurrent = currentPlanId === plan.id;
        const highlighted = isCurrent || plan.highlighted;

        return (
          <div
            key={plan.id}
            className={`flex flex-col rounded-2xl border p-6 ${
              highlighted
                ? "border-brand-500 bg-white shadow-panel ring-2 ring-brand-500/20"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold text-slate-900">
                {plan.name}
              </h3>
              {isCurrent && (
                <span className="shrink-0 rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                  Current plan
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
            <p className="mt-4">
              <span className="text-3xl font-bold text-slate-900">
                {plan.price}
              </span>
              <span className="text-sm text-slate-500">{plan.period}</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2">
              {plan.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-2 text-sm text-slate-600"
                >
                  <span className="text-brand-600">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            {isCurrent ? (
              <Link
                href="/map"
                className="mt-6 block rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Open map workspace
              </Link>
            ) : plan.cta === "Coming soon" ? (
              <button
                type="button"
                disabled
                className="mt-6 block w-full cursor-not-allowed rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-400"
              >
                {plan.cta}
              </button>
            ) : (
              <Link
                href={plan.href}
                className={`mt-6 block rounded-xl py-2.5 text-center text-sm font-semibold ${
                  plan.highlighted
                    ? "bg-brand-600 text-white hover:bg-brand-700"
                    : "border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {plan.cta}
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}
