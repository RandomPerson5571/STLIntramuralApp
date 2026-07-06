import 'package:flutter/material.dart';

class NavItem {
  const NavItem({
    required this.label,
    required this.icon,
    required this.selectedIcon,
  });

  final String label;
  final IconData icon;
  final IconData selectedIcon;
}

/// Mirrors [SIDE_NAV_ITEMS] from stlintramural/lib/navigation.ts
const List<NavItem> sideNavItems = [
  NavItem(
    label: 'Dashboard',
    icon: Icons.dashboard_outlined,
    selectedIcon: Icons.dashboard,
  ),
  NavItem(
    label: 'Events',
    icon: Icons.calendar_today_outlined,
    selectedIcon: Icons.calendar_today,
  ),
  NavItem(
    label: 'Leaderboard',
    icon: Icons.leaderboard_outlined,
    selectedIcon: Icons.leaderboard,
  ),
  NavItem(
    label: 'Shop',
    icon: Icons.shopping_bag_outlined,
    selectedIcon: Icons.shopping_bag,
  ),
  NavItem(
    label: 'Settings',
    icon: Icons.settings_outlined,
    selectedIcon: Icons.settings,
  ),
];
