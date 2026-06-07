import { reverseGeocode } from "@/lib/google/places-server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { lat?: number; lng?: number };
    const { lat, lng } = body;

    if (
      typeof lat !== "number" ||
      typeof lng !== "number" ||
      Number.isNaN(lat) ||
      Number.isNaN(lng)
    ) {
      return NextResponse.json(
        { error: "Invalid lat/lng" },
        { status: 400 }
      );
    }

    const address = await reverseGeocode(lat, lng);
    return NextResponse.json({ address });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Geocode failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
