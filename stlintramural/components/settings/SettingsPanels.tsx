"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import SettingsRow from "@/components/settings/SettingsRow";
import SettingsSectionCard from "@/components/settings/SettingsSectionCard";
import type {
  AppPreferences,
  NotificationPreferences,
  PrivacyPreferences,
  SettingsTab,
  UserSettingsProfile,
} from "@/lib/settings-data";

const ROLE_LABELS: Record<UserSettingsProfile["role"], string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Administrator",
};

interface ProfilePanelProps {
  profile: UserSettingsProfile;
  onProfileChange: (updates: Partial<UserSettingsProfile>) => void;
}

export function ProfilePanel({ profile, onProfileChange }: ProfilePanelProps) {
  const initials = `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();

  return (
    <motion.div
      key="profile"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-sm"
    >
      <SettingsSectionCard title="Avatar" icon="account_circle" accentColor="primary">
        <div className="flex flex-col items-center gap-sm py-2 sm:flex-row sm:items-start">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary-container to-[#001355] text-display-xl font-display-xl text-on-primary shadow-[0_8px_24px_rgba(0,48,174,0.3)]">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg border border-surface-variant/60 bg-surface-container-lowest shadow-sm">
              <MaterialSymbol icon="photo_camera" className="text-sm text-primary" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-headline-md font-headline-md uppercase text-on-surface">
              {profile.firstName} {profile.lastName}
            </p>
            <p className="mt-0.5 text-label-sm font-label-sm text-on-surface-variant">
              {ROLE_LABELS[profile.role]} · Member since {profile.memberSince}
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-secondary/20 bg-secondary/[0.06] px-2.5 py-1 text-label-sm font-label-sm text-secondary">
              <MaterialSymbol icon="stars" className="text-sm" />
              {profile.pointsBalance.toLocaleString()} points
            </p>
          </div>
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard title="Personal Info" icon="badge" accentColor="secondary" index={1}>
        <div className="grid gap-sm sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="firstName"
              className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              value={profile.firstName}
              onChange={(e) => onProfileChange({ firstName: e.target.value })}
              className="w-full rounded-xl border border-surface-variant/70 bg-surface px-3 py-3 text-body-md text-on-surface outline-none transition-[border-color,box-shadow] duration-200 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="lastName"
              className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              value={profile.lastName}
              onChange={(e) => onProfileChange({ lastName: e.target.value })}
              className="w-full rounded-xl border border-surface-variant/70 bg-surface px-3 py-3 text-body-md text-on-surface outline-none transition-[border-color,box-shadow] duration-200 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label
              htmlFor="email"
              className="text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant"
            >
              Email
            </label>
            <div className="relative">
              <MaterialSymbol
                icon="mail"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline"
              />
              <input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => onProfileChange({ email: e.target.value })}
                className="w-full rounded-xl border border-surface-variant/70 bg-surface py-3 pl-10 pr-3 text-body-md text-on-surface outline-none transition-[border-color,box-shadow] duration-200 focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              />
            </div>
          </div>
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard title="Account" icon="manage_accounts" accentColor="tertiary" index={2}>
        <div className="divide-y divide-surface-variant/50">
          <SettingsRow
            id="change-password"
            label="Change Password"
            description="Update your login credentials"
            action={
              <button
                type="button"
                className="shrink-0 rounded-xl border border-surface-variant/70 bg-surface px-3 py-1.5 text-label-sm font-label-sm uppercase tracking-wider text-on-surface transition-[transform,background-color,border-color] duration-200 hover:border-primary/30 hover:bg-primary/[0.04] active:scale-[0.98]"
              >
                Update
              </button>
            }
          />
          <SettingsRow
            id="qr-code"
            label="QR Check-in Code"
            description="View or regenerate your event check-in QR"
            action={
              <Link
                href="/"
                className="shrink-0 rounded-xl border border-primary/20 bg-primary/[0.06] px-3 py-1.5 text-label-sm font-label-sm uppercase tracking-wider text-primary transition-[transform,background-color] duration-200 hover:bg-primary/[0.1] active:scale-[0.98]"
              >
                View
              </Link>
            }
          />
        </div>
      </SettingsSectionCard>
    </motion.div>
  );
}

interface NotificationsPanelProps {
  notifications: NotificationPreferences;
  onChange: (updates: Partial<NotificationPreferences>) => void;
}

export function NotificationsPanel({
  notifications,
  onChange,
}: NotificationsPanelProps) {
  return (
    <motion.div
      key="notifications"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-sm"
    >
      <SettingsSectionCard title="Push Notifications" icon="phonelink_ring" accentColor="primary">
        <div className="divide-y divide-surface-variant/50">
          <SettingsRow
            id="pushEnabled"
            label="Enable Push Notifications"
            description="Receive alerts on this device"
            checked={notifications.pushEnabled}
            onChange={(v) => onChange({ pushEnabled: v })}
          />
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard title="Activity Alerts" icon="campaign" accentColor="secondary" index={1}>
        <div className="divide-y divide-surface-variant/50">
          <SettingsRow
            id="eventReminders"
            label="Event Reminders"
            description="Get notified before games you're registered for"
            checked={notifications.eventReminders}
            onChange={(v) => onChange({ eventReminders: v })}
          />
          <SettingsRow
            id="matchResults"
            label="Match Results"
            description="Scores and outcomes from your recent games"
            checked={notifications.matchResults}
            onChange={(v) => onChange({ matchResults: v })}
          />
          <SettingsRow
            id="pointsEarned"
            label="Points Earned"
            description="Instant alerts when you earn intramural points"
            checked={notifications.pointsEarned}
            onChange={(v) => onChange({ pointsEarned: v })}
          />
          <SettingsRow
            id="shopRestocks"
            label="Shop Restocks"
            description="When new rewards become available"
            checked={notifications.shopRestocks}
            onChange={(v) => onChange({ shopRestocks: v })}
          />
          <SettingsRow
            id="weeklyDigest"
            label="Weekly Digest"
            description="Summary of your activity and upcoming events"
            checked={notifications.weeklyDigest}
            onChange={(v) => onChange({ weeklyDigest: v })}
          />
        </div>
      </SettingsSectionCard>
    </motion.div>
  );
}

interface PrivacyPanelProps {
  privacy: PrivacyPreferences;
  onChange: (updates: Partial<PrivacyPreferences>) => void;
}

export function PrivacyPanel({ privacy, onChange }: PrivacyPanelProps) {
  return (
    <motion.div
      key="privacy"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-sm"
    >
      <SettingsSectionCard title="Visibility" icon="visibility" accentColor="primary">
        <div className="divide-y divide-surface-variant/50">
          <SettingsRow
            id="showOnLeaderboard"
            label="Show on Leaderboard"
            description="Display your name and rank publicly"
            checked={privacy.showOnLeaderboard}
            onChange={(v) => onChange({ showOnLeaderboard: v })}
          />
          <SettingsRow
            id="showPointsPublicly"
            label="Public Points Balance"
            description="Let others see your point total"
            checked={privacy.showPointsPublicly}
            onChange={(v) => onChange({ showPointsPublicly: v })}
          />
          <SettingsRow
            id="shareActivity"
            label="Share Activity"
            description="Show recent games on your profile"
            checked={privacy.shareActivity}
            onChange={(v) => onChange({ shareActivity: v })}
          />
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard title="Check-in" icon="qr_code_2" accentColor="secondary" index={1}>
        <div className="divide-y divide-surface-variant/50">
          <SettingsRow
            id="allowQrScanning"
            label="Allow QR Scanning"
            description="Let staff scan your code at events"
            checked={privacy.allowQrScanning}
            onChange={(v) => onChange({ allowQrScanning: v })}
          />
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard title="Data" icon="database" accentColor="tertiary" index={2}>
        <div className="divide-y divide-surface-variant/50">
          <SettingsRow
            id="export-data"
            label="Export My Data"
            description="Download a copy of your account data"
            action={
              <button
                type="button"
                className="shrink-0 rounded-xl border border-surface-variant/70 bg-surface px-3 py-1.5 text-label-sm font-label-sm uppercase tracking-wider text-on-surface transition-[transform,background-color,border-color] duration-200 hover:border-primary/30 hover:bg-primary/[0.04] active:scale-[0.98]"
              >
                Export
              </button>
            }
          />
        </div>
      </SettingsSectionCard>
    </motion.div>
  );
}

interface PreferencesPanelProps {
  preferences: AppPreferences;
  onChange: (updates: Partial<AppPreferences>) => void;
}

export function PreferencesPanel({ preferences, onChange }: PreferencesPanelProps) {
  return (
    <motion.div
      key="preferences"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-sm"
    >
      <SettingsSectionCard title="Display" icon="dashboard_customize" accentColor="primary">
        <div className="divide-y divide-surface-variant/50">
          <SettingsRow
            id="compactDashboard"
            label="Compact Dashboard"
            description="Use a denser layout for widgets"
            checked={preferences.compactDashboard}
            onChange={(v) => onChange({ compactDashboard: v })}
          />
          <SettingsRow
            id="reducedMotion"
            label="Reduce Motion"
            description="Minimize animations throughout the app"
            checked={preferences.reducedMotion}
            onChange={(v) => onChange({ reducedMotion: v })}
          />
        </div>
      </SettingsSectionCard>

      <SettingsSectionCard title="Feedback" icon="vibration" accentColor="secondary" index={1}>
        <div className="divide-y divide-surface-variant/50">
          <SettingsRow
            id="hapticFeedback"
            label="Haptic Feedback"
            description="Vibration on key actions (mobile)"
            checked={preferences.hapticFeedback}
            onChange={(v) => onChange({ hapticFeedback: v })}
          />
          <SettingsRow
            id="soundEffects"
            label="Sound Effects"
            description="Play sounds for check-ins and rewards"
            checked={preferences.soundEffects}
            onChange={(v) => onChange({ soundEffects: v })}
          />
        </div>
      </SettingsSectionCard>
    </motion.div>
  );
}

interface DangerZoneProps {
  onSignOut: () => void;
}

export function DangerZone({ onSignOut }: DangerZoneProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-error/20 bg-error-container/30 backdrop-blur-sm"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-error/[0.04] to-transparent"
        aria-hidden
      />
      <header className="relative flex items-center gap-2 border-b border-error/15 px-sm py-2.5 sm:px-md sm:py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-error/[0.1] text-error ring-1 ring-error/10">
          <MaterialSymbol icon="warning" />
        </div>
        <h2 className="text-headline-md font-headline-md uppercase tracking-wide text-error">
          Danger Zone
        </h2>
      </header>
      <div className="relative space-y-sm px-sm py-sm sm:px-md sm:py-md">
        <div className="flex flex-col gap-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-body-md font-body-md text-on-surface">Sign Out</p>
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              Log out of your account on this device
            </p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="shrink-0 rounded-xl border border-error/30 bg-surface px-4 py-2 text-label-sm font-label-sm uppercase tracking-wider text-error transition-[transform,background-color] duration-200 hover:bg-error/[0.06] active:scale-[0.98]"
          >
            Sign Out
          </button>
        </div>
        <div className="h-px bg-error/10" />
        <div className="flex flex-col gap-xs sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-body-md font-body-md text-on-surface">Delete Account</p>
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              Permanently remove your account and all data
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 rounded-xl bg-error px-4 py-2 text-label-sm font-label-sm uppercase tracking-wider text-on-error transition-[transform,opacity] duration-200 hover:opacity-90 active:scale-[0.98]"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.section>
  );
}

export function SettingsPanelContent({
  activeTab,
  profile,
  notifications,
  privacy,
  preferences,
  onProfileChange,
  onNotificationsChange,
  onPrivacyChange,
  onPreferencesChange,
}: {
  activeTab: SettingsTab;
  profile: UserSettingsProfile;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  preferences: AppPreferences;
  onProfileChange: (updates: Partial<UserSettingsProfile>) => void;
  onNotificationsChange: (updates: Partial<NotificationPreferences>) => void;
  onPrivacyChange: (updates: Partial<PrivacyPreferences>) => void;
  onPreferencesChange: (updates: Partial<AppPreferences>) => void;
}) {
  return (
    <AnimatePresence mode="wait">
      {activeTab === "profile" && (
        <ProfilePanel profile={profile} onProfileChange={onProfileChange} />
      )}
      {activeTab === "notifications" && (
        <NotificationsPanel
          notifications={notifications}
          onChange={onNotificationsChange}
        />
      )}
      {activeTab === "privacy" && (
        <PrivacyPanel privacy={privacy} onChange={onPrivacyChange} />
      )}
      {activeTab === "preferences" && (
        <PreferencesPanel preferences={preferences} onChange={onPreferencesChange} />
      )}
    </AnimatePresence>
  );
}
