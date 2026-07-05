export const queryKeys = {
  auth: { session: ["auth", "session"] as const },
  users: {
    me: ["users", "me"] as const,
    byQr: (token: string) => ["users", "qr", token] as const,
  },
  events: {
    all: (filters: { sport?: string; period?: string }) =>
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
    checkInsThisMonth: (userId: string) =>
      ["dashboard", "check-ins-month", userId] as const,
  },
} as const;
