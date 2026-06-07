import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Site Analysis Map | Store Location Analyzer",
  description:
    "Map-first workspace to search, score, and compare retail site candidates.",
};

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function MapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {apiKey ? (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&v=weekly`}
          strategy="afterInteractive"
        />
      ) : null}
      <div className="relative h-screen w-screen overflow-hidden bg-slate-200">
        {children}
      </div>
    </>
  );
}
