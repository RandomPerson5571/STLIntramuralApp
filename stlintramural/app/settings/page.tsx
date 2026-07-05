import type { Metadata } from "next";
import EventsBottomNav from "@/components/events/EventsBottomNav";
import EventsMobileHeader from "@/components/events/EventsMobileHeader";
import EventsSideNav from "@/components/events/EventsSideNav";
import SettingsContent from "@/components/settings/SettingsContent";
import SettingsPageHeader from "@/components/settings/SettingsPageHeader";

export const metadata: Metadata = {
  title: "Settings - STL Intramural",
  description:
    "Manage your profile, notifications, privacy, and app preferences.",
};

export default function SettingsPage() {
  return (
    <div className="events-noise-overlay bg-surface text-on-surface font-body-md min-h-screen flex flex-col md:flex-row pb-[80px] md:pb-0">
      <EventsSideNav />
      <EventsMobileHeader />

      <main className="flex-1 lg:ml-64 w-full">
        <SettingsPageHeader />
        <SettingsContent />
      </main>

      <EventsBottomNav />
    </div>
  );
}
