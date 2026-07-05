"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import { DangerZone, SettingsPanelContent } from "@/components/settings/SettingsPanels";
import SettingsNavTabs from "@/components/settings/SettingsNavTabs";
import {
  DEFAULT_NOTIFICATIONS,
  DEFAULT_PREFERENCES,
  DEFAULT_PRIVACY,
  MOCK_PROFILE,
  SETTINGS_TABS,
  type SettingsTab,
} from "@/lib/settings-data";

export default function SettingsContent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [privacy, setPrivacy] = useState(DEFAULT_PRIVACY);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const handleSignOut = () => {
    router.push("/login");
  };

  return (
    <div className="relative mx-auto max-w-7xl px-margin py-md md:px-lg md:py-lg">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-tertiary/[0.04] blur-3xl" />
      </div>

      <div className="grid gap-md lg:grid-cols-[280px_1fr] lg:gap-lg">
        <aside className="lg:sticky lg:top-md lg:self-start">
          <SettingsNavTabs
            tabs={SETTINGS_TABS}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </aside>

        <div className="min-w-0 flex flex-col gap-md">
          <SettingsPanelContent
            activeTab={activeTab}
            profile={profile}
            notifications={notifications}
            privacy={privacy}
            preferences={preferences}
            onProfileChange={(updates) => setProfile((p) => ({ ...p, ...updates }))}
            onNotificationsChange={(updates) =>
              setNotifications((n) => ({ ...n, ...updates }))
            }
            onPrivacyChange={(updates) => setPrivacy((p) => ({ ...p, ...updates }))}
            onPreferencesChange={(updates) =>
              setPreferences((p) => ({ ...p, ...updates }))
            }
          />

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-xs sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              Changes are saved locally until backend integration is connected.
            </p>
            <button
              type="button"
              onClick={handleSave}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary px-5 py-2.5 text-label-sm font-label-sm uppercase tracking-wider text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.25)] transition-[transform,box-shadow] duration-200 hover:shadow-[0_6px_20px_rgba(0,48,174,0.32)] active:scale-[0.98]"
            >
              <MaterialSymbol
                icon={saved ? "check" : "save"}
                className="text-base transition-transform duration-300 group-hover:scale-110"
              />
              {saved ? "Saved" : "Save Changes"}
            </button>
          </motion.div>

          <DangerZone onSignOut={handleSignOut} />
        </div>
      </div>
    </div>
  );
}
