import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import LeaderboardContent from "@/components/leaderboard/LeaderboardContent";
import LeaderboardPageHeader from "@/components/leaderboard/LeaderboardPageHeader";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Leaderboard",
  description:
    "See where you rank among intramural players. Earn points through check-ins, wins, and events.",
  path: "/leaderboard",
});

export default function LeaderboardPage() {
  return (
    <AppShell header={<LeaderboardPageHeader />}>
      <LeaderboardContent />
    </AppShell>
  );
}
