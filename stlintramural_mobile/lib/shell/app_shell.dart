import 'package:flutter/material.dart';
import 'package:stlintramural_mobile/navigation/nav_items.dart';
import 'package:stlintramural_mobile/screens/dashboard_screen.dart';
import 'package:stlintramural_mobile/screens/events_screen.dart';
import 'package:stlintramural_mobile/screens/leaderboard_screen.dart';
import 'package:stlintramural_mobile/screens/settings_screen.dart';
import 'package:stlintramural_mobile/screens/shop_screen.dart';
import 'package:stlintramural_mobile/widgets/bottom_nav_bar.dart';

const _screens = [
  DashboardScreen(),
  EventsScreen(),
  LeaderboardScreen(),
  ShopScreen(),
  SettingsScreen(),
];

class AppShell extends StatefulWidget {
  const AppShell({super.key});

  @override
  State<AppShell> createState() => _AppShellState();
}

class _AppShellState extends State<AppShell> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(sideNavItems[_currentIndex].label)),
      body: IndexedStack(index: _currentIndex, children: _screens),
      bottomNavigationBar: AppBottomNavBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
      ),
    );
  }
}
