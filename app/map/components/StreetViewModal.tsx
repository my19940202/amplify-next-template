"use client";

import { useEffect, useRef } from "react";
import { waitForGoogleMaps } from "@/lib/maps/wait-for-google";

type StreetViewModalProps = {
  lat: number;
  lng: number;
  address: string;
  onClose: () => void;
};

export default function StreetViewModal({
  lat,
  lng,
  address,
  onClose,
}: StreetViewModalProps) {
  const panoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let panorama: google.maps.StreetViewPanorama | null = null;

    async function init() {
      try {
        await waitForGoogleMaps();
        if (cancelled || !panoRef.current) return;

        panorama = new google.maps.StreetViewPanorama(panoRef.current, {
          position: { lat, lng },
          pov: { heading: 34, pitch: 10 },
          zoom: 1,
          addressControl: false,
          linksControl: true,
          panControl: true,
          enableCloseButton: false,
        });

        const service = new google.maps.StreetViewService();
        service.getPanorama({ location: { lat, lng }, radius: 80 }, (data, status) => {
          if (cancelled || !panorama) return;
          if (
            status === google.maps.StreetViewStatus.OK &&
            data?.location?.latLng
          ) {
            panorama.setPosition(data.location.latLng);
          }
        });
      } catch {
        // Street View unavailable at this location
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, [lat, lng]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-slate-900/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Street View preview"
    >
      <div className="flex shrink-0 items-center justify-between gap-3 bg-white px-4 py-3 shadow-sm">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-900">
            Street View
          </p>
          <p className="truncate text-xs text-slate-500">{address}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="shrink-0 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          Close
        </button>
      </div>
      <div ref={panoRef} className="min-h-0 flex-1 bg-slate-800" />
    </div>
  );
}
