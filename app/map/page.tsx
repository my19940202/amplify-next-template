"use client";

import { useEffect, useRef, useState } from "react";

const PLACE_ID = "ChIJ_yMf_u0ABDQRVFlgX-wlYnA";
const MAP_CENTER = { lat: 22.482614504308923, lng: 114.10144265418096 };

type PlaceDetails = {
  name: string;
  formattedAddress: string;
  placeId: string;
};

function waitForGoogleMaps(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve();
      return;
    }

    let attempts = 0;
    const interval = window.setInterval(() => {
      attempts += 1;
      if (window.google?.maps) {
        window.clearInterval(interval);
        resolve();
      } else if (attempts > 100) {
        window.clearInterval(interval);
        reject(new Error("Google Maps failed to load"));
      }
    }, 100);
  });
}

export default function MapPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<PlaceDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      setError("Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY environment variable.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function initMap() {
      try {
        await waitForGoogleMaps();
        if (cancelled || !mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center: MAP_CENTER,
          zoom: 15,
        });

        const infoWindow = new google.maps.InfoWindow();
        const service = new google.maps.places.PlacesService(map);

        service.getDetails(
          {
            placeId: PLACE_ID,
            fields: ["name", "formatted_address", "place_id", "geometry"],
          },
          (placeResult, status) => {
            if (cancelled) return;

            if (
              status !== google.maps.places.PlacesServiceStatus.OK ||
              !placeResult?.geometry?.location
            ) {
              setError("Unable to load place details.");
              setLoading(false);
              return;
            }

            const details: PlaceDetails = {
              name: placeResult.name ?? "Unknown place",
              formattedAddress: placeResult.formatted_address ?? "",
              placeId: placeResult.place_id ?? PLACE_ID,
            };

            setPlace(details);
            setLoading(false);

            const marker = new google.maps.Marker({
              map,
              position: placeResult.geometry.location,
              title: details.name,
            });

            const openInfoWindow = () => {
              const content = document.createElement("div");
              content.style.maxWidth = "240px";

              const title = document.createElement("h3");
              title.textContent = details.name;
              title.style.margin = "0 0 8px";
              content.appendChild(title);

              const address = document.createElement("p");
              address.textContent = details.formattedAddress;
              address.style.margin = "0 0 8px";
              content.appendChild(address);

              const id = document.createElement("p");
              id.textContent = details.placeId;
              id.style.margin = "0";
              id.style.fontSize = "12px";
              id.style.color = "#666";
              content.appendChild(id);

              infoWindow.setContent(content);
              infoWindow.setOptions({ ariaLabel: details.name });
              infoWindow.open(map, marker);
            };

            marker.addListener("click", openInfoWindow);
            openInfoWindow();
          }
        );
      } catch {
        if (!cancelled) {
          setError("Google Maps failed to load.");
          setLoading(false);
        }
      }
    }

    initMap();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {(loading || place || error) && (
        <aside
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 1,
            width: "min(320px, calc(100vw - 32px))",
            padding: "16px",
            borderRadius: 12,
            background: "rgba(255, 255, 255, 0.96)",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
          }}
        >
          {loading && !error && <p style={{ margin: 0 }}>Loading place details…</p>}

          {error && (
            <p style={{ margin: 0, color: "#b42318" }}>{error}</p>
          )}

          {place && (
            <>
              <h1
                style={{
                  margin: "0 0 8px",
                  fontSize: "1.125rem",
                  lineHeight: 1.3,
                }}
              >
                {place.name}
              </h1>
              <p style={{ margin: "0 0 8px", color: "#444" }}>
                {place.formattedAddress}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.75rem",
                  color: "#666",
                  wordBreak: "break-all",
                }}
              >
                {place.placeId}
              </p>
            </>
          )}
        </aside>
      )}
    </>
  );
}
