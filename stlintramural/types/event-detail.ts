import type { AccentColor, EventAction, EventStatus } from "@/types/event";

export interface EventDetailHost {
  name: string;
  role: string;
}

export interface EventDetail {
  slug: string;
  id: string;
  title: string;
  sport: string;
  format: string;
  dateTime: string;
  endDateTime: string;
  location: string;
  registration: string;
  status: EventStatus;
  action: EventAction;
  actionLabel: string;
  borderColor: AccentColor;
  accentColor: AccentColor;
  imageUrl?: string;
  imageAlt?: string;
  placeholderIcon?: string;
  description: string;
  pointsAwarded: number;
  maxAttendees: number | null;
  attendeeCount: number;
  host: EventDetailHost;
  tags: string[];
}
