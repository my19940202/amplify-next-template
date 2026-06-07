const TESTIMONIALS = [
  {
    quote:
      "I compared three coffee shop locations in an afternoon. The competitor count alone saved me from a bad lease.",
    name: "Sarah Chen",
    role: "Cafe owner",
    city: "Austin, TX",
    industry: "Coffee shop",
  },
  {
    quote:
      "Way faster than spreadsheets and Google Maps tabs. The score gave my business partner something concrete to discuss.",
    name: "Marcus Webb",
    role: "Retail founder",
    city: "Portland, OR",
    industry: "Boutique retail",
  },
  {
    quote:
      "Enterprise tools quoted us $15k/year. This did 80% of what we needed for our first location shortlist.",
    name: "Elena Rodriguez",
    role: "Franchisee",
    city: "Denver, CO",
    industry: "Fitness studio",
  },
];

export default function TestimonialsSection() {
  return (
    <section
      id="reviews"
      className="border-b border-slate-200 bg-white px-4 py-16 sm:px-6"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Reviews
          </h2>
          <p className="mt-3 text-slate-600">
            Early users validating sites before they sign
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <p className="flex-1 text-sm leading-relaxed text-slate-700">
                &ldquo;{t.quote}&rdquo;
              </p>
              <footer className="mt-4 border-t border-slate-200 pt-4">
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">
                  {t.role} · {t.city} · {t.industry}
                </p>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
