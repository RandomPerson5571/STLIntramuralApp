import type { UserRole } from "@/types/database/user";

export type SettingsTab = "profile" | "notifications" | "privacy" | "preferences";

export interface SettingsTabItem {
  id: SettingsTab;
  label: string;
  icon: string;
  description: string;
}

export interface UserSettingsProfile {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  memberSince: string;
  pointsBalance: number;
}

export interface NotificationPreferences {
  eventReminders: boolean;
  matchResults: boolean;
  pointsEarned: boolean;
  shopRestocks: boolean;
  weeklyDigest: boolean;
  pushEnabled: boolean;
}

export interface PrivacyPreferences {
  showOnLeaderboard: boolean;
  showPointsPublicly: boolean;
  allowQrScanning: boolean;
  shareActivity: boolean;
}

export interface AppPreferences {
  compactDashboard: boolean;
  hapticFeedback: boolean;
  soundEffects: boolean;
  reducedMotion: boolean;
}

export const SETTINGS_TABS: SettingsTabItem[] = [
  {
    id: "profile",
    label: "Profile",
    icon: "person",
    description: "Name, email, and account details",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: "notifications",
    description: "Alerts, reminders, and digests",
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: "shield",
    description: "Visibility and data controls",
  },
  {
    id: "preferences",
    label: "Preferences",
    icon: "tune",
    description: "App behavior and display",
  },
];

export const DEFAULT_NOTIFICATIONS: NotificationPreferences = {
  eventReminders: true,
  matchResults: true,
  pointsEarned: true,
  shopRestocks: false,
  weeklyDigest: true,
  pushEnabled: true,
};

export const DEFAULT_PRIVACY: PrivacyPreferences = {
  showOnLeaderboard: true,
  showPointsPublicly: false,
  allowQrScanning: true,
  shareActivity: true,
};

export const DEFAULT_PREFERENCES: AppPreferences = {
  compactDashboard: false,
  hapticFeedback: true,
  soundEffects: false,
  reducedMotion: false,
};
