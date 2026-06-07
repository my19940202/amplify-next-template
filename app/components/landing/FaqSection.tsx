import Link from "next/link";

const FAQ_ITEMS = [
  {
    question: "What is a store location analyzer?",
    answer:
      "A store location analyzer helps you evaluate potential retail sites using data — competitor density, nearby demand signals, and visibility — instead of gut feel alone. Our tool wraps Google Maps POI data in a simple score you can act on quickly.",
  },
  {
    question: "How is this different from Google Maps alone?",
    answer:
      "Google Maps is great for exploring an area, but it does not score sites, track multiple candidates, or summarize trade-offs in one view. We add structured analysis, repeatable scoring, and a workspace built for site selection decisions.",
  },
  {
    question: "Is there a free store location analysis tool?",
    answer:
      "Yes. The free tier includes 3 analyses per month with basic scoring and summaries — enough to validate a shortlist before upgrading. No credit card required to start.",
  },
  {
    question: "Which businesses benefit most?",
    answer:
      "Coffee shops, boutique retail, restaurants, gyms, and local service businesses opening their first or second location get the most value. Any business where rent is high and foot traffic matters is a fit.",
  },
  {
    question: "How accurate is foot traffic estimation?",
    answer:
      "We use POI-based proxies (offices, schools, transit, etc.), not proprietary foot-traffic sensors. Scores are directional guides — always confirm with peak-hour visits before signing a lease.",
  },
];

export default function FaqSection() {
  return (
    <section id="faq" className="border-b border-slate-200 bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">FAQ</h2>
          <p className="mt-3 text-slate-600">
            Common questions about retail site selection
          </p>
        </div>

        <div className="space-y-6">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group rounded-xl border border-slate-200 bg-slate-50 p-5"
            >
              <summary className="cursor-pointer list-none font-semibold text-slate-900 marker:content-none [&::-webkit-details-marker]:hidden">
                {item.question}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {item.answer}{" "}
                <Link href="/map" className="font-medium text-brand-600 hover:underline">
                  Try it on the map →
                </Link>
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
