export interface CreateEventDraft {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  maxAttendees: string;
  pointsAwarded: string;
  externalLinks: string[];
}

export const DEFAULT_CREATE_EVENT_DRAFT: CreateEventDraft = {
  title: "",
  description: "",
  location: "",
  startDate: "",
  endDate: "",
  maxAttendees: "",
  pointsAwarded: "50",
  externalLinks: [""],
};

/** Embeds location in description using the pipe format the event mapper reads. */
export function buildStoredDescription(draft: CreateEventDraft): string | null {
  const body = draft.description.trim();
  const location = draft.location.trim();

  if (!body && !location) return null;
  if (!location) return body || null;
  if (!body) return `Location: ${location}`;
  return `${body} | Location: ${location}`;
}

export class EventCreateError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "missing_title"
      | "missing_dates"
      | "invalid_dates"
      | "invalid_capacity"
      | "invalid_points"
      | "unknown",
  ) {
    super(message);
    this.name = "EventCreateError";
  }
}

export function toEventInsertPayload(
  draft: CreateEventDraft,
  hostId: string,
): {
  host_id: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string;
  max_attendees: number | null;
  points_awarded: number;
  external_links: string[] | null;
} {
  const title = draft.title.trim();
  if (!title) {
    throw new EventCreateError("Event title is required.", "missing_title");
  }

  if (!draft.startDate || !draft.endDate) {
    throw new EventCreateError(
      "Start and end dates are required.",
      "missing_dates",
    );
  }

  const startDate = new Date(draft.startDate);
  const endDate = new Date(draft.endDate);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    throw new EventCreateError("Enter valid start and end dates.", "invalid_dates");
  }

  if (endDate < startDate) {
    throw new EventCreateError(
      "End date must be on or after the start date.",
      "invalid_dates",
    );
  }

  const pointsAwarded = draft.pointsAwarded.trim()
    ? Number(draft.pointsAwarded)
    : 0;

  if (!Number.isFinite(pointsAwarded) || pointsAwarded < 0) {
    throw new EventCreateError(
      "Points awarded must be zero or greater.",
      "invalid_points",
    );
  }

  let maxAttendees: number | null = null;
  if (draft.maxAttendees.trim()) {
    maxAttendees = Number(draft.maxAttendees);
    if (!Number.isFinite(maxAttendees) || maxAttendees <= 0) {
      throw new EventCreateError(
        "Max attendees must be greater than zero.",
        "invalid_capacity",
      );
    }
  }

  const externalLinks = draft.externalLinks
    .map((link) => link.trim())
    .filter(Boolean);

  return {
    host_id: hostId,
    title,
    description: buildStoredDescription(draft),
    start_date: startDate.toISOString(),
    end_date: endDate.toISOString(),
    max_attendees: maxAttendees,
    points_awarded: pointsAwarded,
    external_links: externalLinks.length > 0 ? externalLinks : null,
  };
}
