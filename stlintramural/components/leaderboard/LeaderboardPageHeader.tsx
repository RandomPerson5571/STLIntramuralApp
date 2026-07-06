import PageHeader from "@/components/layout/PageHeader";

export default function LeaderboardPageHeader() {
  return (
    <PageHeader
      eyebrow="Season Rankings"
      title="Leaderboard"
      titleClassName="text-[clamp(2.75rem,8vw,4.5rem)] font-display-xl uppercase leading-none tracking-tight text-on-surface slanted-accent"
      subtitle="Compete for the top spot. Earn points through check-ins, wins, and event participation."
    />
  );
}
