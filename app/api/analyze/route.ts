import { analyzeLocation } from "@/lib/google/places-server";
import { createClient } from "@/lib/supabase/server";
import type { AnalyzeRequest } from "@/lib/types/analysis";
import {
  ANON_USAGE_COOKIE,
  getUsageStatus,
  recordAnalysisUsage,
} from "@/lib/usage/quota-server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AnalyzeRequest;
    const { lat, lng } = body;

    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      return NextResponse.json({ error: "Invalid lat/lng" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const cookieStore = await cookies();
    const anonCookie = cookieStore.get(ANON_USAGE_COOKIE)?.value;

    const usageBefore = await getUsageStatus({
      userId: user?.id ?? null,
      anonCookieValue: anonCookie,
    });

    if (usageBefore.remaining <= 0) {
      return NextResponse.json(
        {
          error:
            "Monthly analysis limit reached (3/month on Free). Create an account or upgrade to continue.",
          usage: usageBefore,
        },
        { status: 429 }
      );
    }

    const analysis = await analyzeLocation(lat, lng);

    const recorded = await recordAnalysisUsage({
      userId: user?.id ?? null,
      anonCookieValue: anonCookie,
    });

    const response = NextResponse.json({
      ...analysis,
      usage: recorded.usage,
    });

    if (recorded.anonCookie) {
      response.cookies.set(ANON_USAGE_COOKIE, recorded.anonCookie, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 35,
        path: "/",
      });
    }

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
