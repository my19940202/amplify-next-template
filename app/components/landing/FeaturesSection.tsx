const FEATURES = [
  {
    title: "Competitor analysis",
    description:
      "See same-type POI density, distance, and Google ratings within 500m — know who you are up against.",
    icon: "📍",
  },
  {
    title: "Foot traffic proxies",
    description:
      "Rule-weighted scores from nearby offices, schools, transit, and shopping — practical demand signals without enterprise data.",
    icon: "👣",
  },
  {
    title: "Amenities scoring",
    description:
      "Parking, transit, and dining counts rolled into an amenities score for everyday convenience.",
    icon: "🏪",
  },
  {
    title: "Street View preview",
    description:
      "Check street-level visibility and storefront sightlines before you visit in person.",
    icon: "🛣️",
  },
  {
    title: "Kanban workspace",
    description:
      "Track candidates as Pending or Analyzed — map-first UI built for quick decisions, not GIS workflows.",
    icon: "🗂️",
  },
  {
    title: "Export-ready reports",
    description:
      "Share scores and summaries with partners, landlords, or investors (PDF export coming soon).",
    icon: "📄",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="border-b border-slate-200 bg-slate-50 px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Features
          </h2>
          <p className="mt-3 text-slate-600">
            Everything you need for retail site selection — nothing you don&apos;t
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <span className="text-2xl" aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className="mt-3 font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
