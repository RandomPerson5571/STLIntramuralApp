export type EventStatus = "registration-open" | "waitlist-only";

export type EventAction = "join-team" | "join-waitlist" | "register";

export type AccentColor = "primary" | "secondary";

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  sport: string;
  format: string;
  dateTime: string;
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
}

export type SportFilter =
  | "All Sports"
  | "Basketball"
  | "Volleyball"
  | "Soccer"
  | "Tennis";

export type TimePeriod =
  | "Upcoming"
  | "This Week"
  | "Next Week"
  | "This Month";
