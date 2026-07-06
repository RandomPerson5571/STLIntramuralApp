import { formatDateTime } from "@/lib/format";
import { parseEventDescription } from "@/lib/mappers/event";
import type { ScanEventOption, ScanRecentEntry } from "@/lib/scan-data";
import type { Event } from "@/types/database";

export interface ScanEventRow extends Pick<
  Event,
  "id" | "title" | "description" | "start_date" | "points_awarded"
> {
  attendances: { attended_at: string | null }[];
}

export function mapEventToScanOption(row: ScanEventRow): ScanEventOption {
  const parsed = parseEventDescription(row.description);
  const registered = row.attendances.length;
  const checkedIn = row.attendances.filter((a) => a.attended_at).length;

  return {
    id: row.id,
    title: row.title,
    sport: parsed.sport,
    dateTime: formatDateTime(row.start_date),
    location: parsed.location,
    pointsAwarded: row.points_awarded,
    checkedIn,
    registered,
  };
}

export function mapAttendanceToRecentEntry(input: {
  id: string;
  attended_at: string;
  points: number;
  studentName: string;
  isDuplicate?: boolean;
}): ScanRecentEntry {
  return {
    id: input.id,
    studentName: input.studentName,
    time: formatRecentScanTime(input.attended_at),
    points: input.points,
    status: input.isDuplicate ? "duplicate" : "success",
  };
}

function formatRecentScanTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  return formatDateTime(iso);
}
