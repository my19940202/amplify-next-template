export type PlanId = "free" | "pro" | "one-time";

export type PricingPlan = {
  id: PlanId;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  highlighted: boolean;
};

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "free",
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
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "AI-assisted retail select for teams comparing sites every week",
    features: [
      "Unlimited analyses with AI site summaries",
      "AI-generated pros, risks & lease talking points",
      "Advanced retail select reports & history",
      "Priority support for faster decisions",
    ],
    cta: "Coming soon",
    href: "/map",
    highlighted: false,
  },
  {
    id: "one-time",
    name: "One-time report",
    price: "$9",
    period: "/report",
    description: "One full AI retail select report — pay only when you need it",
    features: [
      "AI deep-dive on a single location",
      "Retail select score, risks & competitor context",
      "PDF export ready for landlord meetings",
      "Shareable link — no subscription required",
    ],
    cta: "Coming soon",
    href: "/map",
    highlighted: false,
  },
];
