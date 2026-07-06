export const queryKeys = {
  auth: { session: ["auth", "session"] as const },
  users: {
    me: ["users", "me"] as const,
    qrPayload: ["users", "qr-payload"] as const,
    byQr: (token: string) => ["users", "qr", token] as const,
  },
  events: {
    all: (filters: { sport?: string; period?: string; page?: number }) =>
      ["events", filters] as const,
    detail: (id: string) => ["events", id] as const,
    myAttendances: ["events", "my-attendances"] as const,
  },
  shop: {
    items: ["shop", "items"] as const,
    featured: ["shop", "featured"] as const,
    cheapestCost: ["shop", "cheapest-cost"] as const,
  },
  dashboard: {
    weeklyActivity: (userId: string) =>
      ["dashboard", "weekly-activity", userId] as const,
    leagueRank: (userId: string) =>
      ["dashboard", "league-rank", userId] as const,
    upcomingEvents: (userId: string) =>
      ["dashboard", "upcoming-events", userId] as const,
  },
  leaderboard: {
    all: ["leaderboard"] as const,
  },
  admin: {
    stats: ["admin", "stats"] as const,
    recentActivity: ["admin", "recent-activity"] as const,
    users: (page: number) => ["admin", "users", page] as const,
    userDetail: (userId: string) => ["admin", "users", "detail", userId] as const,
    events: (page: number) => ["admin", "events", page] as const,
  },
  scan: {
    events: ["scan", "events"] as const,
    recent: (eventId: string) => ["scan", "recent", eventId] as const,
  },
} as const;
