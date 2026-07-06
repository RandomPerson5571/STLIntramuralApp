export type AdminSection =
  | "overview"
  | "users"
  | "events"
  | "shop"
  | "points";

export const ADMIN_SECTIONS: {
  id: AdminSection;
  label: string;
  icon: string;
  description: string;
}[] = [
  {
    id: "overview",
    label: "Overview",
    icon: "dashboard",
    description: "Platform snapshot and quick actions.",
  },
  {
    id: "users",
    label: "Users",
    icon: "group",
    description: "Manage accounts, roles, and permissions.",
  },
  {
    id: "events",
    label: "Events",
    icon: "calendar_month",
    description: "Create, edit, and monitor intramural events.",
  },
  {
    id: "shop",
    label: "Shop",
    icon: "storefront",
    description: "Manage rewards, inventory, and redemptions.",
  },
  {
    id: "points",
    label: "Points",
    icon: "paid",
    description: "Manage user balances, adjust points, and review accounts.",
  },
];

export const ADMIN_STATS = [
  {
    id: "users",
    label: "Total users",
    icon: "group",
    accent: "primary" as const,
  },
  {
    id: "events",
    label: "Active events",
    icon: "event_available",
    accent: "secondary" as const,
  },
  {
    id: "points",
    label: "Points distributed",
    icon: "stars",
    accent: "primary" as const,
  },
  {
    id: "shop",
    label: "Shop items",
    icon: "shopping_bag",
    accent: "secondary" as const,
  },
] as const;

export type AdminStatId = (typeof ADMIN_STATS)[number]["id"];

export const ADMIN_QUICK_ACTIONS = [
  {
    id: "create-event",
    label: "Create event",
    description: "Schedule a new intramural game or activity.",
    icon: "add_circle",
  },
  {
    id: "add-shop-item",
    label: "Add shop item",
    description: "Publish a new reward for students to redeem.",
    icon: "add_shopping_cart",
  },
  {
    id: "manage-users",
    label: "Manage users",
    description: "Search accounts and adjust roles or admin access.",
    icon: "manage_accounts",
  },
  {
    id: "export-report",
    label: "Export report",
    description: "Download attendance and points summaries.",
    icon: "download",
  },
];

export type AdminActivityItem = {
  id: string;
  action: string;
  detail: string;
  time: string;
  icon: string;
};

export const ADMIN_SECTION_PLACEHOLDERS: Record<
  Exclude<AdminSection, "overview">,
  { title: string; body: string; icon: string }
> = {
  users: {
    title: "User management",
    body: "Search, filter, and manage student and staff accounts. Role changes and admin grants will appear here.",
    icon: "group",
  },
  events: {
    title: "Event management",
    body: "View all events, edit schedules, and monitor attendance. Full CRUD controls are on the way.",
    icon: "calendar_month",
  },
  shop: {
    title: "Shop management",
    body: "Manage reward catalog, stock levels, and redemption history from one place.",
    icon: "storefront",
  },
  points: {
    title: "Points ledger",
    body: "Review point transactions, manual adjustments, and balance audits across the platform.",
    icon: "paid",
  },
};
