"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import LeagueRankWidget from "@/components/dashboard/LeagueRankWidget";
import MyPointsWidget from "@/components/dashboard/MyPointsWidget";
import MyQRCodeWidget from "@/components/dashboard/MyQRCodeWidget";
import ShopWidget from "@/components/dashboard/ShopWidget";
import UpcomingMatchesWidget from "@/components/dashboard/UpcomingMatchesWidget";
import WeeklyActivityWidget from "@/components/dashboard/WeeklyActivityWidget";
import WinStreakWidget from "@/components/dashboard/WinStreakWidget";
import { useCheapestShopItemCost } from "@/hooks/useDashboard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UPCOMING_MATCHES, WIN_STREAK } from "@/lib/dashboard-data";

const STAT_SHADE = {
  primary: {
    bg: "from-primary/[0.06] to-surface-container-lowest",
    shadow: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_6px_24px_-4px_rgba(0,48,174,0.12)]",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,48,174,0.18)]",
    icon: "text-primary bg-primary/[0.1]",
    border: "border-primary/10 hover:border-primary/20",
  },
  secondary: {
    bg: "from-secondary/[0.06] to-surface-container-lowest",
    shadow: "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_6px_24px_-4px_rgba(0,102,136,0.12)]",
    hover: "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,102,136,0.18)]",
    icon: "text-secondary bg-secondary/[0.1]",
    border: "border-secondary/10 hover:border-secondary/20",
  },
};

export default function DashboardContent() {
  const { data: user, isPending: userPending } = useCurrentUser();
  const { data: cheapestCost, isPending: costPending } = useCheapestShopItemCost();

  const points = user?.points_balance ?? 0;
  const nextReward = cheapestCost ?? 0;
  const toReward = nextReward > 0 ? Math.max(nextReward - points, 0) : "—";

  const stats = [
    {
      icon: "stars",
      label: "Balance",
      value: userPending ? "…" : points.toLocaleString(),
      suffix: "pts",
      accent: "primary" as const,
    },
    {
      icon: "local_fire_department",
      label: "Streak",
      value: String(WIN_STREAK),
      suffix: "wins",
      accent: "secondary" as const,
    },
    {
      icon: "redeem",
      label: "To reward",
      value: userPending || costPending ? "…" : String(toReward),
      suffix: toReward === "—" ? "" : "pts",
      accent: "primary" as const,
    },
    {
      icon: "event",
      label: "Next up",
      value: UPCOMING_MATCHES[0]?.sport ?? "—",
      suffix: UPCOMING_MATCHES[0]?.dateTime.split("•")[1]?.trim() ?? "",
      accent: "secondary" as const,
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-margin py-md md:px-lg md:py-lg">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-secondary/[0.05] blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mb-sm grid grid-cols-2 gap-xs sm:mb-md sm:grid-cols-4 sm:gap-sm"
      >
        {stats.map((stat, i) => {
          const shade = STAT_SHADE[stat.accent];

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.04 + i * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br px-sm py-2.5 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 sm:py-3 ${shade.bg} ${shade.shadow} ${shade.hover} ${shade.border}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${shade.icon}`}
                >
                  <MaterialSymbol icon={stat.icon} className="text-base" filled={stat.icon === "local_fire_department"} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-label-sm font-label-sm uppercase tracking-wider text-on-surface-variant">
                    {stat.label}
                  </p>
                  <p className="truncate text-headline-md font-headline-md uppercase leading-tight text-on-surface">
                    {stat.value}
                    {stat.suffix && (
                      <span className="ml-1 text-label-sm font-label-sm normal-case text-on-surface-variant">
                        {stat.suffix}
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 items-start gap-sm md:grid-cols-2 md:gap-md xl:grid-cols-12">
        <div className="xl:col-span-6">
          <MyPointsWidget index={0} />
        </div>
        <div className="xl:col-span-3">
          <WinStreakWidget index={1} />
        </div>
        <div className="xl:col-span-3">
          <LeagueRankWidget index={2} />
        </div>

        <div className="md:col-span-1 xl:col-span-4">
          <MyQRCodeWidget index={3} />
        </div>
        <div className="md:col-span-1 xl:col-span-4">
          <WeeklyActivityWidget index={4} />
        </div>
        <div className="md:col-span-2 xl:col-span-4">
          <ShopWidget index={5} />
        </div>

        <div className="md:col-span-2 xl:col-span-12">
          <UpcomingMatchesWidget index={6} />
        </div>
      </div>
    </div>
  );
}
