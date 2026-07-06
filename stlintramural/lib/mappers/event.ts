import { USER_ROLE_LABELS } from "@/lib/constants/user-labels";
import { getAttendanceCount } from "@/lib/queries/utils";
import type { EventWithHost } from "@/types/database";
import type { AccentColor, EventAction, EventItem } from "@/types/event";
import type { EventDetail } from "@/types/event-detail";

/**
 * Recommended `events.description` formats for teachers (no schema change required):
 *
 * 1. Pipe-delimited:
 *    Sport: Basketball | Format: 5v5 | Location: Main Rec Center, Court 1
 *
 * 2. JSON object:
 *    {"sport":"Basketball","format":"5v5","location":"Main Rec Center, Court 1"}
 *
 * Unstructured text still works — sport defaults to "Event", format to "", location to "TBD".
 */

export interface EventQueryRow extends EventWithHost {
  attendances: { count: number }[];
}

export interface EventDetailQueryRow extends EventQueryRow {
  tags: { title: string }[];
}

export interface MapEventOptions {
  index: number;
  isRegistered: boolean;
}

const IMAGE_URL_PATTERN = /\.(jpg|jpeg|png|gif|webp|avif)(\?|$)/i;

const SPORT_ICONS: Record<string, string> = {
  Basketball: "sports_basketball",
  Volleyball: "sports_volleyball",
  Soccer: "sports_soccer",
  Tennis: "sports_tennis",
};

const DATE_TIME_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/Chicago",
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

interface ParsedDescription {
  sport: string;
  format: string;
  location: string;
}

export function parseEventDescription(description: string | null): ParsedDescription {
  const defaults: ParsedDescription = {
    sport: "Event",
    format: "",
    location: "TBD",
  };

  if (!description?.trim()) {
    return defaults;
  }

  const trimmed = description.trim();

  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as Partial<ParsedDescription>;
      return {
        sport: parsed.sport?.trim() || defaults.sport,
        format: parsed.format?.trim() || defaults.format,
        location: parsed.location?.trim() || defaults.location,
      };
    } catch {
      // fall through to pipe / plain-text parsing
    }
  }

  const pipeFields: Partial<ParsedDescription> = {};
  for (const segment of trimmed.split("|")) {
    const [rawKey, ...rest] = segment.split(":");
    if (!rawKey || rest.length === 0) continue;

    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (!value) continue;

    if (key === "sport") pipeFields.sport = value;
    if (key === "format") pipeFields.format = value;
    if (key === "location") pipeFields.location = value;
  }

  if (pipeFields.sport || pipeFields.format || pipeFields.location) {
    return {
      sport: pipeFields.sport ?? defaults.sport,
      format: pipeFields.format ?? defaults.format,
      location: pipeFields.location ?? defaults.location,
    };
  }

  return defaults;
}

function isImageUrl(url: string): boolean {
  return IMAGE_URL_PATTERN.test(url);
}

function getImageFromLinks(links: string[] | null): {
  imageUrl?: string;
  imageAlt?: string;
} {
  if (!links?.length) return {};

  const imageUrl = links.find(isImageUrl);
  if (!imageUrl) return {};

  return { imageUrl, imageAlt: "Event image" };
}

function getAccentColor(index: number): AccentColor {
  return index % 2 === 0 ? "primary" : "secondary";
}

function getRegistrationLabel(count: number, maxAttendees: number | null): string {
  if (maxAttendees == null) return "Open";
  return `${count}/${maxAttendees} Registered`;
}

function getStatus(
  count: number,
  maxAttendees: number | null,
): EventItem["status"] {
  if (maxAttendees == null || count < maxAttendees) {
    return "registration-open";
  }
  return "waitlist-only";
}

function getAction(
  status: EventItem["status"],
  isRegistered: boolean,
): { action: EventAction; actionLabel: string } {
  if (isRegistered) {
    return { action: "register", actionLabel: "Registered" };
  }

  if (status === "waitlist-only") {
    return { action: "join-waitlist", actionLabel: "Join Waitlist" };
  }

  return { action: "register", actionLabel: "Register" };
}

function getDescriptionText(description: string | null): string {
  if (!description?.trim()) {
    return "No description provided.";
  }

  const trimmed = description.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed) as { body?: string };
      if (parsed.body?.trim()) return parsed.body.trim();
    } catch {
      // fall through
    }
    return "No description provided.";
  }

  const textSegments = trimmed
    .split("|")
    .map((segment) => segment.trim())
    .filter((segment) => segment && !/^(sport|format|location)\s*:/i.test(segment));

  if (textSegments.length > 0) {
    return textSegments.join(" | ");
  }

  return "No description provided.";
}

function getHostName(host: EventQueryRow["host"]): string {
  return `${host.first_name} ${host.last_name}`.trim();
}

function getHostRole(role: string): string {
  return USER_ROLE_LABELS[role as keyof typeof USER_ROLE_LABELS] ?? role;
}

export function mapEventToItem(
  row: EventQueryRow,
  options: MapEventOptions,
): EventItem {
  const { sport, format, location } = parseEventDescription(row.description);
  const attendanceCount = getAttendanceCount(row);
  const status = getStatus(attendanceCount, row.max_attendees);
  const { action, actionLabel } = getAction(status, options.isRegistered);
  const accentColor = getAccentColor(options.index);
  const { imageUrl, imageAlt } = getImageFromLinks(row.external_links);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    sport,
    format,
    dateTime: DATE_TIME_FORMAT.format(new Date(row.start_date)),
    location,
    registration: getRegistrationLabel(attendanceCount, row.max_attendees),
    status,
    action,
    actionLabel,
    borderColor: accentColor,
    accentColor,
    imageUrl,
    imageAlt,
    placeholderIcon: SPORT_ICONS[sport] ?? "sports",
  };
}

export function mapEventToDetail(
  row: EventDetailQueryRow,
  options: MapEventOptions,
): EventDetail {
  const item = mapEventToItem(row, options);

  return {
    ...item,
    description: getDescriptionText(row.description),
    endDateTime: DATE_TIME_FORMAT.format(new Date(row.end_date)),
    pointsAwarded: row.points_awarded,
    maxAttendees: row.max_attendees,
    attendeeCount: getAttendanceCount(row),
    host: {
      name: getHostName(row.host),
      role: getHostRole(row.host.role),
    },
    tags: (row.tags ?? []).map((tag) => tag.title),
  };
}
