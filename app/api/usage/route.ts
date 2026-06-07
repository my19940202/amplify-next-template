import { createClient } from "@/lib/supabase/server";
import {
  ANON_USAGE_COOKIE,
  getUsageStatus,
} from "@/lib/usage/quota-server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const cookieStore = await cookies();
  const anonCookie = cookieStore.get(ANON_USAGE_COOKIE)?.value;

  const usage = await getUsageStatus({
    userId: user?.id ?? null,
    anonCookieValue: anonCookie,
  });

  return NextResponse.json({ usage });
}
