"use client";

import { useEffect, useRef } from "react";
import type { SiteCandidate } from "@/lib/types/site";
import { waitForGoogleMaps } from "@/lib/maps/wait-for-google";

type MapCanvasProps = {
  sites: SiteCandidate[];
  selectedId: string | null;
  defaultCenter: google.maps.LatLngLiteral;
  onMapClick: (lat: number, lng: number) => void;
  onMarkerClick: (siteId: string) => void;
  onMapReady?: (map: google.maps.Map) => void;
};

const SELECTED_ZOOM = 16;

export default function MapCanvas({
  sites,
  selectedId,
  defaultCenter,
  onMapClick,
  onMarkerClick,
  onMapReady,
}: MapCanvasProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const onMapClickRef = useRef(onMapClick);
  const onMarkerClickRef = useRef(onMarkerClick);
  const onMapReadyRef = useRef(onMapReady);

  onMapClickRef.current = onMapClick;
  onMarkerClickRef.current = onMarkerClick;
  onMapReadyRef.current = onMapReady;

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) return;

    let cancelled = false;

    async function initMap() {
      try {
        await waitForGoogleMaps();
        if (cancelled || !mapRef.current) return;

        const map = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        });

        mapInstanceRef.current = map;
        infoWindowRef.current = new google.maps.InfoWindow();
        onMapReadyRef.current?.(map);

        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClickRef.current(e.latLng.lat(), e.latLng.lng());
          }
        });
      } catch {
        // Parent handles error display
      }
    }

    initMap();

    return () => {
      cancelled = true;
      infoWindowRef.current?.close();
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current.clear();
      mapInstanceRef.current = null;
      infoWindowRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.panTo(defaultCenter);
  }, [defaultCenter]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const existing = markersRef.current;
    const siteIds = new Set(sites.map((s) => s.id));

    existing.forEach((marker, id) => {
      if (!siteIds.has(id)) {
        marker.setMap(null);
        existing.delete(id);
      }
    });

    sites.forEach((site) => {
      const position = { lat: site.lat, lng: site.lng };
      let marker = existing.get(site.id);

      if (marker) {
        marker.setPosition(position);
        marker.setTitle(site.address);
      } else {
        marker = new google.maps.Marker({
          map,
          position,
          title: site.address,
        });
        marker.addListener("click", () => {
          onMarkerClickRef.current(site.id);
        });
        existing.set(site.id, marker);
      }

      const isSelected = site.id === selectedId;
      marker.setIcon({
        path: google.maps.SymbolPath.CIRCLE,
        scale: isSelected ? 12 : 8,
        fillColor: isSelected ? "#2563eb" : "#64748b",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      });
      marker.setZIndex(isSelected ? 1000 : 1);
    });
  }, [sites, selectedId]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const infoWindow = infoWindowRef.current;
    if (!map || !infoWindow) return;

    if (!selectedId) {
      infoWindow.close();
      return;
    }

    const site = sites.find((s) => s.id === selectedId);
    const marker = markersRef.current.get(selectedId);
    if (!site || !marker) return;

    map.panTo({ lat: site.lat, lng: site.lng });
    if (map.getZoom()! < SELECTED_ZOOM) {
      map.setZoom(SELECTED_ZOOM);
    }

    const scoreLine =
      site.score != null
        ? `<p style="margin:4px 0 0;font-size:13px;font-weight:600;color:#2563eb">Score: ${site.score}/100${site.scoreLabel ? ` · ${site.scoreLabel}` : ""}</p>`
        : `<p style="margin:4px 0 0;font-size:12px;color:#64748b">Pending analysis</p>`;

    const summaryLine = site.analysis
      ? `<p style="margin:4px 0 0;font-size:11px;color:#64748b">${site.analysis.competition.count} competitors nearby</p>`
      : "";

    infoWindow.setContent(
      `<div style="max-width:220px;padding:2px 0">
        <p style="margin:0;font-size:13px;font-weight:600;color:#0f172a">${site.address}</p>
        ${scoreLine}
        ${summaryLine}
      </div>`
    );
    infoWindow.open({ map, anchor: marker });
  }, [selectedId, sites]);

  return <div ref={mapRef} className="absolute inset-0 z-0 h-full w-full" />;
}
