import type { Metadata } from "next";
import EventsBottomNav from "@/components/events/EventsBottomNav";
import EventsMobileHeader from "@/components/events/EventsMobileHeader";
import EventsSideNav from "@/components/events/EventsSideNav";
import LeaderboardContent from "@/components/leaderboard/LeaderboardContent";
import LeaderboardPageHeader from "@/components/leaderboard/LeaderboardPageHeader";

export const metadata: Metadata = {
  title: "Leaderboard - STL Intramural",
  description:
    "See where you rank among intramural players. Earn points through check-ins, wins, and events.",
};

export default function LeaderboardPage() {
  return (
    <div className="events-noise-overlay bg-surface text-on-surface font-body-md min-h-screen flex flex-col md:flex-row pb-[80px] md:pb-0">
      <EventsSideNav />
      <EventsMobileHeader />

      <main className="flex-1 lg:ml-64 w-full">
        <LeaderboardPageHeader />
        <LeaderboardContent />
      </main>

      <EventsBottomNav />
    </div>
  );
}
