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
  { href: "/qrcode", label: "QR Code", icon: "qr_code_scanner" },
  { href: "/settings", label: "Settings", icon: "settings", filled: true },
];

export const TEACHER_SCAN_NAV_ITEM: NavItem = {
  href: "/scan",
  label: "Scanner",
  icon: "qr_code_scanner",
  filled: true,
};

export const ADMIN_NAV_ITEM: NavItem = {
  href: "/admin",
  label: "Admin",
  icon: "admin_panel_settings",
  filled: true,
};
