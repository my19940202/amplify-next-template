import { createClient } from "@/lib/supabase/server";
import type { UsageInfo } from "@/lib/types/usage";
import { buildUsageInfo } from "@/lib/types/usage";
import {
  ANON_USAGE_COOKIE,
  FREE_MONTHLY_ANALYSIS_LIMIT,
} from "./constants";
import { getMonthKey } from "./month-key";

type UsageCookiePayload = {
  month: string;
  count: number;
};

function parseAnonCookie(value: string | undefined): UsageCookiePayload {
  const month = getMonthKey();
  if (!value) return { month, count: 0 };

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as UsageCookiePayload;
    if (parsed.month !== month) return { month, count: 0 };
    return { month, count: Math.max(0, parsed.count) };
  } catch {
    try {
      const parsed = JSON.parse(value) as UsageCookiePayload;
      if (parsed.month !== month) return { month, count: 0 };
      return { month, count: Math.max(0, parsed.count) };
    } catch {
      return { month, count: 0 };
    }
  }
}

function serializeAnonCookie(payload: UsageCookiePayload): string {
  return JSON.stringify(payload);
}

async function getAuthenticatedUsage(userId: string): Promise<number> {
  const supabase = await createClient();
  const monthKey = getMonthKey();

  const { data, error } = await supabase
    .from("analysis_usage")
    .select("count")
    .eq("user_id", userId)
    .eq("month_key", monthKey)
    .maybeSingle();

  if (error) {
    console.warn("analysis_usage lookup failed:", error.message);
    return 0;
  }

  const row = data as { count: number } | null;
  return row?.count ?? 0;
}

async function incrementAuthenticatedUsage(userId: string): Promise<number> {
  const supabase = await createClient();
  const monthKey = getMonthKey();
  const current = await getAuthenticatedUsage(userId);
  const next = current + 1;

  if (current === 0) {
    const { error } = await supabase.from("analysis_usage").insert({
      user_id: userId,
      month_key: monthKey,
      count: 1,
    });
    if (error) console.warn("analysis_usage insert failed:", error.message);
    return 1;
  }

  const { error } = await supabase
    .from("analysis_usage")
    .update({ count: next })
    .eq("user_id", userId)
    .eq("month_key", monthKey);

  if (error) console.warn("analysis_usage update failed:", error.message);
  return next;
}

export async function getUsageStatus(options: {
  userId: string | null;
  anonCookieValue?: string;
}): Promise<UsageInfo> {
  const monthKey = getMonthKey();
  const limit = FREE_MONTHLY_ANALYSIS_LIMIT;

  if (options.userId) {
    const used = await getAuthenticatedUsage(options.userId);
    return buildUsageInfo(used, limit, true, monthKey);
  }

  const anon = parseAnonCookie(options.anonCookieValue);
  return buildUsageInfo(anon.count, limit, false, monthKey);
}

export async function recordAnalysisUsage(options: {
  userId: string | null;
  anonCookieValue?: string;
}): Promise<{ usage: UsageInfo; anonCookie?: string }> {
  const limit = FREE_MONTHLY_ANALYSIS_LIMIT;
  const monthKey = getMonthKey();

  if (options.userId) {
    const used = await incrementAuthenticatedUsage(options.userId);
    return {
      usage: buildUsageInfo(used, limit, true, monthKey),
    };
  }

  const anon = parseAnonCookie(options.anonCookieValue);
  const next = anon.count + 1;
  return {
    usage: buildUsageInfo(next, limit, false, monthKey),
    anonCookie: serializeAnonCookie({ month: monthKey, count: next }),
  };
}

export { ANON_USAGE_COOKIE };
