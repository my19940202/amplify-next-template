import PricingCards from "@/app/components/pricing/PricingCards";

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

        <PricingCards />
      </div>
    </section>
  );
}
