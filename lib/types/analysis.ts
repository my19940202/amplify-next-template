import type { ScoreLabel } from "./site";

export type CompetitorPlace = {
  name: string;
  rating?: number;
  distanceMeters: number;
};

export type FootTrafficBreakdown = {
  label: string;
  count: number;
  weight: number;
  contribution: number;
};

export type SiteAnalysis = {
  competition: {
    count: number;
    score: number;
    nearby: CompetitorPlace[];
  };
  footTraffic: {
    score: number;
    breakdown: FootTrafficBreakdown[];
  };
  amenities: {
    score: number;
    parking: number;
    transit: number;
    dining: number;
  };
  visibility: {
    score: number;
    note: string;
  };
  overallScore: number;
  scoreLabel: ScoreLabel;
  recommendation: string;
  analyzedAt: string;
};

export type AnalyzeRequest = {
  lat: number;
  lng: number;
};

export type AnalyzeResponse = SiteAnalysis;
