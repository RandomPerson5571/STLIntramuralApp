"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import { DangerZone, SettingsPanelContent } from "@/components/settings/SettingsPanels";
import SettingsNavTabs from "@/components/settings/SettingsNavTabs";
import { useSession, useSignOut } from "@/hooks/useAuth";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatMemberSince } from "@/lib/format";
import {
  DEFAULT_NOTIFICATIONS,
  DEFAULT_PREFERENCES,
  DEFAULT_PRIVACY,
  SETTINGS_TABS,
  type SettingsTab,
  type UserSettingsProfile,
} from "@/lib/constants/settings-nav";

function profileFromUser(
  user: NonNullable<ReturnType<typeof useCurrentUser>["data"]>,
  email: string,
): UserSettingsProfile {
  return {
    firstName: user.first_name,
    lastName: user.last_name,
    email,
    role: user.role,
    memberSince: formatMemberSince(user.created_at),
    pointsBalance: user.points_balance,
  };
}

export default function SettingsContent() {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const { data: user, isLoading: userLoading, isError: userError, refetch: refetchUser } = useCurrentUser();
  const signOut = useSignOut();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [profileOverrides, setProfileOverrides] = useState<
    Partial<UserSettingsProfile>
  >({});
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [privacy, setPrivacy] = useState(DEFAULT_PRIVACY);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState(false);

  const profile = useMemo(() => {
    if (!user) return null;
    return {
      ...profileFromUser(user, session?.user?.email ?? ""),
      ...profileOverrides,
    };
  }, [user, session?.user?.email, profileOverrides]);

  const isLoading = sessionPending || (!!session && userLoading);

  useEffect(() => {
    if (!sessionPending && !session) {
      router.replace("/login");
    }
  }, [session, sessionPending, router]);

  const handleSave = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };

  const handleSignOut = async () => {
    await signOut.mutateAsync();
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="relative mx-auto max-w-7xl px-lg py-lg">
        <div className="grid gap-md grid-cols-[280px_1fr]">
          <div className="h-64 animate-pulse rounded-2xl bg-surface-container-high" />
          <div className="h-96 animate-pulse rounded-2xl bg-surface-container-high" />
        </div>
      </div>
    );
  }

  if (!session || userError || !user || !profile) {
    return (
      <div className="relative mx-auto max-w-7xl px-lg py-lg">
        <div className="rounded-2xl border border-error/20 bg-error-container/30 px-md py-lg text-center">
          <MaterialSymbol icon="error" className="mx-auto text-3xl text-error" />
          <p className="mt-sm text-headline-md font-headline-md text-on-surface">
            Could not load your settings
          </p>
          <p className="mt-xs text-body-md text-on-surface-variant">
            {userError
              ? "We could not load your profile. Try again or sign in once more."
              : "Your account is signed in, but no profile was found yet."}
          </p>
          <button
            type="button"
            onClick={() => void refetchUser()}
            className="mt-sm rounded-xl border border-outline-variant px-4 py-2 text-label-sm font-label-sm uppercase text-on-surface transition-colors hover:border-primary hover:text-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-7xl px-lg py-lg">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-tertiary/[0.04] blur-3xl" />
      </div>

      <div className="grid gap-lg grid-cols-[280px_1fr]">
        <aside className="sticky top-md self-start">
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
            onProfileChange={(updates) =>
              setProfileOverrides((p) => ({ ...p, ...updates }))
            }
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
            className="flex flex-row items-center justify-between gap-md"
          >
            <p className="text-label-sm font-label-sm text-on-surface-variant">
              Profile data syncs from your account. Notification and preference changes are saved locally.
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

          <DangerZone
            onSignOut={handleSignOut}
            isSigningOut={signOut.isPending}
          />
        </div>
      </div>
    </div>
  );
}
