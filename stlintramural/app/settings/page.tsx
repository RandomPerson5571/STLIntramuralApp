import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import SettingsContent from "@/components/settings/SettingsContent";
import SettingsPageHeader from "@/components/settings/SettingsPageHeader";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Settings",
  description:
    "Manage your profile, notifications, privacy, and app preferences.",
  path: "/settings",
  noIndex: true,
});

export default function SettingsPage() {
  return (
    <AppShell header={<SettingsPageHeader />}>
      <SettingsContent />
    </AppShell>
  );
}
