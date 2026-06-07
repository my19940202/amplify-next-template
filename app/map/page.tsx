"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AnalysisQuotaError,
  fetchReverseGeocode,
  fetchSiteAnalysis,
  fetchUsageStatus,
} from "@/lib/analysis/client";
import {
  exportReport,
  getExportableSites,
  type ExportFormat,
} from "@/lib/report/export-client";
import type { UsageInfo } from "@/lib/types/usage";
import {
  createSiteCandidate,
  type SiteCandidate,
  type SiteStage,
} from "@/lib/types/site";
import MapCanvas from "./components/MapCanvas";
import QuotaModal from "./components/QuotaModal";
import SiteDetailDrawer from "./components/SiteDetailDrawer";
import SitePanel from "./components/SitePanel";
import StreetViewModal from "./components/StreetViewModal";

const DEFAULT_CENTER = { lat: 37.7749, lng: -122.4194 };

export default function MapWorkspacePage() {
  const [sites, setSites] = useState<SiteCandidate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mapCenter] = useState(DEFAULT_CENTER);
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [quotaModalUsage, setQuotaModalUsage] = useState<UsageInfo | null>(
    null
  );
  const [streetViewSite, setStreetViewSite] = useState<SiteCandidate | null>(
    null
  );

  useEffect(() => {
    fetchUsageStatus()
      .then(setUsage)
      .catch(() => {
        // Usage API optional if Supabase not configured
      });
  }, []);

  const selectedSite = useMemo(
    () => sites.find((s) => s.id === selectedId) ?? null,
    [sites, selectedId]
  );

  const isAnalyzing = analyzingIds.size > 0;

  const exportableSites = useMemo(
    () => getExportableSites(sites, selectedId),
    [sites, selectedId]
  );

  const handleExport = useCallback(
    (format: ExportFormat) => {
      try {
        exportReport(exportableSites, format);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Export failed";
        setError(message);
      }
    },
    [exportableSites]
  );

  const runAnalysis = useCallback(
    async (siteId: string, lat: number, lng: number) => {
      setAnalyzingIds((prev) => new Set(prev).add(siteId));
      setError(null);

      try {
        const result = await fetchSiteAnalysis(lat, lng);
        if (result.usage) setUsage(result.usage);

        const { usage: _usage, ...analysis } = result;

        setSites((prev) =>
          prev.map((site) =>
            site.id === siteId
              ? {
                  ...site,
                  score: analysis.overallScore,
                  scoreLabel: analysis.scoreLabel,
                  analysis,
                  stage: "analyzed",
                }
              : site
          )
        );
      } catch (err) {
        if (err instanceof AnalysisQuotaError) {
          setUsage(err.usage);
          setQuotaModalUsage(err.usage);
          setError(err.message);
        } else {
          const message =
            err instanceof Error ? err.message : "Analysis failed";
          setError(message);
        }
      } finally {
        setAnalyzingIds((prev) => {
          const next = new Set(prev);
          next.delete(siteId);
          return next;
        });
      }
    },
    []
  );

  const addAndAnalyze = useCallback(
    async (address: string, lat: number, lng: number) => {
      if (usage && usage.remaining <= 0) {
        setQuotaModalUsage(usage);
        setError("Monthly analysis limit reached");
        return;
      }

      const site = createSiteCandidate({
        address,
        lat,
        lng,
        stage: "pending",
      });
      setSites((prev) => [...prev, site]);
      setSelectedId(site.id);
      await runAnalysis(site.id, lat, lng);
    },
    [runAnalysis, usage]
  );

  const handlePlaceSelect = useCallback(
    (place: { address: string; lat: number; lng: number }) => {
      void addAndAnalyze(place.address, place.lat, place.lng);
    },
    [addAndAnalyze]
  );

  const handleMapClick = useCallback(
    async (lat: number, lng: number) => {
      if (usage && usage.remaining <= 0) {
        setQuotaModalUsage(usage);
        setError("Monthly analysis limit reached");
        return;
      }

      const site = createSiteCandidate({
        address: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        lat,
        lng,
        stage: "pending",
      });
      setSites((prev) => [...prev, site]);
      setSelectedId(site.id);

      const address = await fetchReverseGeocode(lat, lng);
      setSites((prev) =>
        prev.map((s) => (s.id === site.id ? { ...s, address } : s))
      );
      await runAnalysis(site.id, lat, lng);
    },
    [runAnalysis, usage]
  );

  const handleAddSite = useCallback(() => {
    const offset = sites.length * 0.002;
    void addAndAnalyze(
      "New site — drag map or search to refine",
      mapCenter.lat + offset,
      mapCenter.lng + offset
    );
  }, [addAndAnalyze, mapCenter, sites.length]);

  const handleAnalyzeSite = useCallback(
    (id: string) => {
      const site = sites.find((s) => s.id === id);
      if (!site) return;
      void runAnalysis(id, site.lat, site.lng);
    },
    [runAnalysis, sites]
  );

  const handleStageChange = useCallback((id: string, stage: SiteStage) => {
    setSites((prev) =>
      prev.map((site) => (site.id === id ? { ...site, stage } : site))
    );
  }, []);

  const handleRemoveSite = useCallback((id: string) => {
    setSites((prev) => prev.filter((s) => s.id !== id));
    setSelectedId((current) => (current === id ? null : current));
  }, []);

  const handleNewAnalysis = useCallback(() => {
    setSites([]);
    setSelectedId(null);
    setError(null);
  }, []);

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex h-full items-center justify-center bg-slate-100 p-6">
        <p className="max-w-md rounded-xl bg-white p-6 text-center text-sm text-red-600 shadow-panel">
          Missing NEXT_PUBLIC_GOOGLE_MAPS_API_KEY. Add it to .env.local to load
          the map workspace.
        </p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <MapCanvas
        sites={sites}
        selectedId={selectedId}
        defaultCenter={mapCenter}
        onMapClick={handleMapClick}
        onMarkerClick={setSelectedId}
      />

      <SitePanel
        sites={sites}
        selectedId={selectedId}
        analyzingIds={analyzingIds}
        isAnalyzing={isAnalyzing}
        usage={usage}
        onSelectSite={setSelectedId}
        onAddSite={handleAddSite}
        onStageChange={handleStageChange}
        onNewAnalysis={handleNewAnalysis}
        onPlaceSelect={handlePlaceSelect}
        onAnalyzeSite={handleAnalyzeSite}
        onExport={handleExport}
        exportCount={exportableSites.length}
      />

      <SiteDetailDrawer
        site={selectedSite}
        analyzing={selectedId ? analyzingIds.has(selectedId) : false}
        onClose={() => setSelectedId(null)}
        onRemove={handleRemoveSite}
        onReanalyze={handleAnalyzeSite}
        onOpenStreetView={setStreetViewSite}
        onExport={handleExport}
        canExport={Boolean(selectedSite?.analysis)}
      />

      {streetViewSite && (
        <StreetViewModal
          lat={streetViewSite.lat}
          lng={streetViewSite.lng}
          address={streetViewSite.address}
          onClose={() => setStreetViewSite(null)}
        />
      )}

      {quotaModalUsage && (
        <QuotaModal
          usage={quotaModalUsage}
          onClose={() => setQuotaModalUsage(null)}
        />
      )}

      {error && (
        <div className="pointer-events-auto absolute bottom-4 left-1/2 z-40 max-w-sm -translate-x-1/2 rounded-lg bg-red-600 px-4 py-2 text-center text-sm text-white shadow-lg">
          {error}
          <button
            type="button"
            onClick={() => setError(null)}
            className="ml-2 underline opacity-80"
          >
            dismiss
          </button>
        </div>
      )}
    </div>
  );
}
