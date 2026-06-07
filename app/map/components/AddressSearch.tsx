"use client";

import { useEffect, useRef } from "react";
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

  return (
    <input
      ref={inputRef}
      type="search"
      placeholder="Search address or business…"
      disabled={disabled}
      className="mb-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:bg-slate-50 disabled:text-slate-400"
    />
  );
}
