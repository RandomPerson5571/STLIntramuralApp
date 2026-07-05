import type { Metadata } from "next";
import EventsBottomNav from "@/components/events/EventsBottomNav";
import EventsContent from "@/components/events/EventsContent";
import EventsMobileHeader from "@/components/events/EventsMobileHeader";
import EventsPageHeader from "@/components/events/EventsPageHeader";
import EventsSideNav from "@/components/events/EventsSideNav";

export const metadata: Metadata = {
  title: "Events - STL Intramural",
  description:
    "Find and join intramural games, tournaments, and practices across campus.",
};

export default function EventsPage() {
  return (
    <div className="events-noise-overlay bg-surface text-on-surface font-body-md min-h-screen flex flex-col md:flex-row pb-[80px] md:pb-0">
      <EventsSideNav />
      <EventsMobileHeader />

      <main className="flex-1 lg:ml-64 w-full">
        <EventsPageHeader />
        <EventsContent />
      </main>

      <EventsBottomNav />
    </div>
  );
}
