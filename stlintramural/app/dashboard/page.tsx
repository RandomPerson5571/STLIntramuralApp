import type { Metadata } from "next";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import EventsBottomNav from "@/components/events/EventsBottomNav";
import EventsMobileHeader from "@/components/events/EventsMobileHeader";
import EventsSideNav from "@/components/events/EventsSideNav";

export const metadata: Metadata = {
  title: "Dashboard - STL Intramural",
  description: "Your hub for points, check-ins, and upcoming intramural games.",
};

export default function DashboardPage() {
  return (
    <div className="events-noise-overlay bg-surface text-on-surface font-body-md min-h-screen flex flex-col md:flex-row pb-[80px] md:pb-0">
      <EventsSideNav />
      <EventsMobileHeader />

      <main className="flex-1 lg:ml-64 w-full">
        <DashboardPageHeader />
        <DashboardContent />
      </main>

      <EventsBottomNav />
    </div>
  );
}
