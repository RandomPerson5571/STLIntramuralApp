export interface UpcomingMatch {
  id: string;
  opponent: string;
  sport: string;
  dateTime: string;
  location: string;
  accentColor: "primary" | "secondary";
}

/** Placeholder until matches schema exists */
export const WIN_STREAK = 4;
