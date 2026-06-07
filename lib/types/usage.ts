export type UsageInfo = {
  used: number;
  limit: number;
  remaining: number;
  isAuthenticated: boolean;
  monthKey: string;
};

export type QuotaExceededError = {
  error: string;
  usage: UsageInfo;
};

export function buildUsageInfo(
  used: number,
  limit: number,
  isAuthenticated: boolean,
  monthKey: string
): UsageInfo {
  return {
    used,
    limit,
    remaining: Math.max(0, limit - used),
    isAuthenticated,
    monthKey,
  };
}
