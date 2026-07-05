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

/** Placeholder until leaderboard schema exists */
export const LEAGUE_RANK = 7;

export const LEAGUE_TOTAL = 42;

/** Placeholder until matches schema exists */
export const UPCOMING_MATCHES: UpcomingMatch[] = [
  {
    id: "1",
    opponent: "Sigma Chi",
    sport: "Basketball",
    dateTime: "Mon, Nov 4 • 7:00 PM",
    location: "Main Rec, Court 2",
    accentColor: "primary",
  },
  {
    id: "2",
    opponent: "Kappa Delta",
    sport: "Volleyball",
    dateTime: "Wed, Nov 6 • 6:30 PM",
    location: "South Sand Courts",
    accentColor: "secondary",
  },
  {
    id: "3",
    opponent: "Pi Kappa Phi",
    sport: "Soccer",
    dateTime: "Sat, Nov 9 • 2:00 PM",
    location: "Intramural Field A",
    accentColor: "primary",
  },
];
