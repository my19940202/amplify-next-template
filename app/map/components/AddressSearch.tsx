"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { fetchReverseGeocode } from "@/lib/analysis/client";
import { waitForGoogleMaps } from "@/lib/maps/wait-for-google";

type AddressSearchProps = {
  onPlaceSelect: (place: {
    address: string;
    lat: number;
    lng: number;
  }) => void;
  disabled?: boolean;
};

export default function AddressSearch({
  onPlaceSelect,
  disabled,
}: AddressSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onSelectRef = useRef(onPlaceSelect);
  onSelectRef.current = onPlaceSelect;

  const [locating, setLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  useEffect(() => {
    if (disabled || !inputRef.current) return;

    let autocomplete: google.maps.places.Autocomplete | null = null;
    let listener: google.maps.MapsEventListener | null = null;
    let cancelled = false;

    async function init() {
      try {
        await waitForGoogleMaps();
        if (cancelled || !inputRef.current) return;

        autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          fields: ["formatted_address", "geometry", "name"],
          types: ["geocode", "establishment"],
        });

        listener = autocomplete.addListener("place_changed", () => {
          const place = autocomplete?.getPlace();
          const location = place?.geometry?.location;
          if (!location) return;

          onSelectRef.current({
            address:
              place.formatted_address ??
              place.name ??
              "Selected location",
            lat: location.lat(),
            lng: location.lng(),
          });

          if (inputRef.current) {
            inputRef.current.value = "";
          }
        });
      } catch {
        // Autocomplete unavailable — manual map pin still works
      }
    }

    init();

    return () => {
      cancelled = true;
      listener?.remove();
    };
  }, [disabled]);

  const handleLocate = useCallback(() => {
    if (disabled || locating) return;

    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported in this browser");
      return;
    }

    setGeoError(null);
    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const address = await fetchReverseGeocode(lat, lng);

          if (inputRef.current) {
            inputRef.current.value = address;
          }

          onSelectRef.current({ address, lat, lng });
        } catch {
          setGeoError("Failed to resolve your location");
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Location access denied");
        } else {
          setGeoError("Unable to get your location");
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [disabled, locating]);

  return (
    <div className="mb-2">
      <div className="flex overflow-hidden rounded-lg border border-slate-200 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 disabled:bg-slate-50">
        <input
          ref={inputRef}
          type="search"
          placeholder="Search address or business…"
          disabled={disabled}
          className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:text-slate-400"
        />
        <button
          type="button"
          onClick={handleLocate}
          disabled={disabled || locating}
          aria-label="Use current location"
          title="Use current location"
          className="flex shrink-0 items-center justify-center border-l border-slate-200 px-3 text-slate-500 transition-colors hover:bg-slate-50 hover:text-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FaLocationCrosshairs
            className={`h-4 w-4 ${locating ? "animate-pulse text-brand-600" : ""}`}
          />
        </button>
      </div>
      {geoError && (
        <p className="mt-1 text-xs text-amber-700">{geoError}</p>
      )}
    </div>
  );
}
