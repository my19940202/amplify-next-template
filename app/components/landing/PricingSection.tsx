import Link from "next/link";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Validate demand before you upgrade",
    features: [
      "3 analyses per month",
      "Basic site scoring",
      "Competitor & traffic summary",
      "Map workspace access",
    ],
    cta: "Start Free",
    href: "/map",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For active site hunters",
    features: [
      "Unlimited analyses",
      "Advanced reports",
      "Analysis history",
      "Priority support",
    ],
    cta: "Coming soon",
    href: "/map",
    highlighted: false,
  },
  {
    name: "One-time report",
    price: "$9",
    period: "/report",
    description: "Pay per site when you need it",
    features: [
      "Single location deep-dive",
      "PDF export",
      "Shareable link",
      "No subscription",
    ],
    cta: "Coming soon",
    href: "/map",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="border-b border-slate-200 bg-slate-50 px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Pricing
          </h2>
          <p className="mt-3 text-slate-600">
            Start free — upgrade when you are ready to move faster
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col rounded-2xl border p-6 ${
                plan.highlighted
                  ? "border-brand-500 bg-white shadow-panel ring-2 ring-brand-500/20"
                  : "border-slate-200 bg-white"
              }`}
            >
              <h3 className="text-lg font-semibold text-slate-900">
                {plan.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              <p className="mt-4">
                <span className="text-3xl font-bold text-slate-900">
                  {plan.price}
                </span>
                <span className="text-sm text-slate-500">{plan.period}</span>
              </p>
              <ul className="mt-6 flex-1 space-y-2">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <span className="text-brand-600">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
