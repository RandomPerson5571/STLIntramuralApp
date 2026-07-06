import { NextResponse } from "next/server";

import { isInsideSchoolBoundary } from "@/lib/school-boundary";

export async function POST(request: Request) {
  try {
    const { lng, lat } = await request.json();

    if (typeof lng !== "number" || typeof lat !== "number") {
      return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
    }

    return NextResponse.json({ allowed: isInsideSchoolBoundary(lng, lat) });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}