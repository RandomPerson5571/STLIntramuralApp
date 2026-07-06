import { NextResponse } from "next/server";

import { getClientIp, isPrivateOrLocalIp } from "@/lib/client-ip";
import { geolocateIp } from "@/lib/ip-geolocation";
import { canScanCheckIn } from "@/lib/permissions";
import { verifySignedQrPayload } from "@/lib/qr-code-salt";
import {
  normalizeQrToken,
  type CheckInResult,
  type CheckInStatus,
} from "@/lib/queries/scan";
import { fetchCurrentUser } from "@/lib/queries/users";
import { isInsideSchoolBoundary } from "@/lib/school-boundary";
import { createClient } from "@/lib/supabase/server";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

async function assertInsideSchoolBoundary(request: Request): Promise<boolean> {
  if (process.env.SKIP_GEOFENCE === "true") {
    return true;
  }

  const ip = getClientIp(request);
  if (!ip || isPrivateOrLocalIp(ip)) {
    return process.env.NODE_ENV === "development";
  }

  const coords = await geolocateIp(ip);
  if (!coords) {
    return false;
  }

  return isInsideSchoolBoundary(coords.lng, coords.lat);
}

function parseEventId(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const id = raw.trim();
  return UUID_RE.test(id) ? id : null;
}

function mapRpcPayload(data: {
  status: CheckInStatus;
  student_name?: string;
  points?: number;
}): CheckInResult {
  return {
    status: data.status,
    studentName: data.student_name ?? "Student",
    points: data.points ?? 0,
  };
}

export async function POST(request: Request) {
  try {
    const insideBoundary = await assertInsideSchoolBoundary(request);
    if (!insideBoundary) {
      return NextResponse.json(
        {
          status: "outside_boundary",
          studentName: "Unknown",
          points: 0,
          message: "Check-in is only available on campus.",
        },
        { status: 403 },
      );
    }

    const supabase = await createClient();
    const scanner = await fetchCurrentUser(supabase);

    if (!scanner) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    if (!canScanCheckIn(scanner)) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }

    const body = (await request.json()) as {
      eventId?: unknown;
      qrToken?: unknown;
    };

    const eventId = parseEventId(body.eventId);
    const rawPayload =
      typeof body.qrToken === "string" ? body.qrToken.trim() : "";
    const signedPayload = normalizeQrToken(rawPayload);
    const qrToken = signedPayload
      ? verifySignedQrPayload(signedPayload)
      : null;

    if (!eventId || !qrToken) {
      return NextResponse.json(
        mapRpcPayload({ status: "invalid" }),
        { status: 400 },
      );
    }

    const { data, error } = await supabase.rpc("verify_qr_scan", {
      p_event_id: eventId,
      p_qr_token: qrToken,
    });

    if (error) {
      const message = error.message ?? "";

      if (message.includes("not_authenticated")) {
        return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
      }
      if (message.includes("forbidden")) {
        return NextResponse.json({ error: "forbidden" }, { status: 403 });
      }
      if (message.includes("event_not_found")) {
        return NextResponse.json({ error: "event_not_found" }, { status: 404 });
      }

      return NextResponse.json({ error: "check_in_failed" }, { status: 500 });
    }

    return NextResponse.json(
      mapRpcPayload(
        data as {
          status: CheckInStatus;
          student_name?: string;
          points?: number;
        },
      ),
    );
  } catch {
    return NextResponse.json({ error: "internal_server_error" }, { status: 500 });
  }
}
