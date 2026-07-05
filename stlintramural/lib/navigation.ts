export interface NavItem {
  href: string;
  label: string;
  icon: string;
  filled?: boolean;
}

export const SIDE_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", filled: true },
  { href: "/events", label: "Events", icon: "calendar_today", filled: true },
  { href: "/leaderboard", label: "Leaderboard", icon: "leaderboard", filled: true },
  { href: "/shop", label: "Shop", icon: "shopping_bag", filled: true },
  { href: "#", label: "QR Scanner", icon: "qr_code_scanner" },
  { href: "/settings", label: "Settings", icon: "settings", filled: true },
];

export const BOTTOM_NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Home", icon: "home" },
  { href: "/events", label: "Events", icon: "event", filled: true },
  { href: "#", label: "Scan", icon: "qr_code_2" },
  { href: "/leaderboard", label: "Rankings", icon: "format_list_numbered", filled: true },
  { href: "/shop", label: "Shop", icon: "storefront", filled: true },
];
