import type { Metadata } from "next";
import FaqSection from "./components/landing/FaqSection";
import FeaturesSection from "./components/landing/FeaturesSection";
import HeroSection from "./components/landing/HeroSection";
import HowItWorksSection from "./components/landing/HowItWorksSection";
import LandingFooter from "./components/landing/LandingFooter";
import LandingHeader from "./components/landing/LandingHeader";
import PainPointsSection from "./components/landing/PainPointsSection";
import PricingSection from "./components/landing/PricingSection";
import SeoContentSection from "./components/landing/SeoContentSection";
import TestimonialsSection from "./components/landing/TestimonialsSection";

export const metadata: Metadata = {
  title: "Store Location Analyzer | Retail Site Selection Tool",
  description:
    "Free store location analyzer powered by Google Maps. Score retail site selection with competitor density, foot traffic proxies, and visibility — built for solo founders and small businesses.",
  openGraph: {
    title: "Store Location Analyzer | Retail Site Selection Tool",
    description:
      "Score store locations in minutes with Google Maps data. Competitor analysis, foot traffic proxies, and site scoring for retail site selection.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <main>
        <HeroSection />
        <PainPointsSection />
        <SeoContentSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
      </main>
      <LandingFooter />
    </div>
  );
}
