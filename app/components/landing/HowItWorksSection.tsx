import Link from "next/link";

const STEPS = [
  {
    step: "1",
    title: "Enter an address or drop a pin",
    description:
      "Open the map workspace, search an address, or click the map to add a candidate site.",
  },
  {
    step: "2",
    title: "Get instant insights",
    description:
      "See competitors, foot traffic proxies, and nearby amenities within a 500m radius.",
  },
  {
    step: "3",
    title: "Receive a score & export",
    description:
      "Get a 0–100 site score with a plain-language recommendation — share with partners or landlords.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-b border-slate-200 bg-white px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            How It Works
          </h2>
          <p className="mt-3 text-slate-600">
            Three steps from address to actionable site score
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/map"
            className="inline-flex rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Open Map Workspace
          </Link>
        </div>
      </div>
    </section>
  );
}
