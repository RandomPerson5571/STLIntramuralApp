import type { SupabaseClient } from "@supabase/supabase-js";

import { formatFullName } from "@/lib/constants/leaderboard";
import {
  mapAttendanceToRecentEntry,
  mapEventToScanOption,
  type ScanEventRow,
} from "@/lib/mappers/scan";
import { throwIfError } from "@/lib/queries/utils";
import type { ScanEventOption, ScanRecentEntry, ScanResultPreview } from "@/lib/scan-data";
import type { User } from "@/types/database";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type CheckInStatus =
  | "success"
  | "already_checked_in"
  | "not_registered"
  | "invalid"
  | "outside_boundary";

export interface CheckInResult {
  status: CheckInStatus;
  studentName: string;
  points: number;
}

export class ScanCheckInError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "forbidden"
      | "not_authenticated"
      | "event_not_found"
      | "unknown",
  ) {
    super(message);
    this.name = "ScanCheckInError";
  }
}

export function normalizeQrToken(raw: string): string | null {
  const token = raw.trim();
  return UUID_RE.test(token) ? token : null;
}

export function toScanResultPreview(result: CheckInResult): ScanResultPreview {
  const messages: Record<CheckInStatus, string> = {
    success: "Checked in and points awarded.",
    already_checked_in: "This student was already checked in for this event.",
    not_registered: "Student is not registered for this event.",
    invalid:
      "QR code not recognized. Ask the student to open their check-in page.",
    outside_boundary: "Check-in is only available on campus.",
  };

  return {
    kind: result.status,
    studentName: result.studentName,
    points: result.points,
    message: messages[result.status],
  };
}

export async function fetchScanEvents(
  supabase: SupabaseClient,
  user: Pick<User, "id" | "is_admin">,
): Promise<ScanEventOption[]> {
  let query = supabase
    .from("events")
    .select(
      "id, title, description, start_date, points_awarded, attendances:event_attendances(attended_at)",
    )
    .order("start_date", { ascending: false })
    .limit(30);

  if (!user.is_admin) {
    query = query.eq("host_id", user.id);
  }

  const { data, error } = await query;
  throwIfError(error);

  return ((data ?? []) as ScanEventRow[]).map(mapEventToScanOption);
}

export async function fetchRecentScans(
  supabase: SupabaseClient,
  eventId: string,
  pointsAwarded: number,
): Promise<ScanRecentEntry[]> {
  const { data, error } = await supabase
    .from("event_attendances")
    .select(
      "id, attended_at, user:users!user_id(first_name, last_name)",
    )
    .eq("event_id", eventId)
    .not("attended_at", "is", null)
    .order("attended_at", { ascending: false })
    .limit(8);

  throwIfError(error);

  return (data ?? []).map((row) => {
    const user = Array.isArray(row.user) ? row.user[0] : row.user;
    const studentName = user
      ? formatFullName(user)
      : "Student";

    return mapAttendanceToRecentEntry({
      id: row.id as string,
      attended_at: row.attended_at as string,
      points: pointsAwarded,
      studentName,
    });
  });
}

export async function recordEventCheckIn(input: {
  eventId: string;
  qrToken: string;
}): Promise<CheckInResult> {
  const token = normalizeQrToken(input.qrToken);
  if (!token) {
    return {
      status: "invalid",
      studentName: "Unknown",
      points: 0,
    };
  }

  const response = await fetch("/api/scan/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventId: input.eventId,
      qrToken: token,
    }),
  });

  const payload = (await response.json()) as {
    status?: CheckInStatus;
    studentName?: string;
    points?: number;
    message?: string;
    error?: string;
  };

  if (!response.ok) {
    if (payload.status === "outside_boundary") {
      return {
        status: "outside_boundary",
        studentName: payload.studentName ?? "Unknown",
        points: payload.points ?? 0,
      };
    }

    if (payload.status === "invalid") {
      return {
        status: "invalid",
        studentName: payload.studentName ?? "Unknown",
        points: 0,
      };
    }

    if (payload.error === "not_authenticated") {
      throw new ScanCheckInError("You must be signed in.", "not_authenticated");
    }
    if (payload.error === "forbidden") {
      throw new ScanCheckInError(
        "You can only scan for events you host.",
        "forbidden",
      );
    }
    if (payload.error === "event_not_found") {
      throw new ScanCheckInError("Event not found.", "event_not_found");
    }

    throw new ScanCheckInError("Check-in failed. Please try again.", "unknown");
  }

  return {
    status: payload.status ?? "invalid",
    studentName: payload.studentName ?? "Student",
    points: payload.points ?? 0,
  };
}
