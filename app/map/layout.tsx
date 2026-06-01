import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Place Details Map",
  description: "Google Maps with place details",
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
      <div
        style={{
          position: "relative",
          width: "100vw",
          height: "100vh",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    </>
  );
}
