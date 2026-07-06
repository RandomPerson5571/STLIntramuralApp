"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import LeagueRankWidget from "@/components/dashboard/LeagueRankWidget";
import MyPointsWidget from "@/components/dashboard/MyPointsWidget";
import MyQRCodeWidget from "@/components/dashboard/MyQRCodeWidget";
import ShopWidget from "@/components/dashboard/ShopWidget";
import UpcomingEventsWidget from "@/components/dashboard/UpcomingEventsWidget";
import WeeklyActivityWidget from "@/components/dashboard/WeeklyActivityWidget";
import WinStreakWidget from "@/components/dashboard/WinStreakWidget";
import { useCheapestShopItemCost, useUpcomingRegisteredEvents } from "@/hooks/useDashboard";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { WIN_STREAK } from "@/lib/constants/dashboard";
import { STAT_SHADE } from "@/lib/constants/stat-shade";

export default function DashboardContent() {
  const { data: user, isPending: userPending } = useCurrentUser();
  const { data: cheapestCost, isPending: costPending } = useCheapestShopItemCost();
  const { data: upcomingEvents } = useUpcomingRegisteredEvents();

  const points = user?.points_balance ?? 0;
  const nextReward = cheapestCost ?? 0;
  const toReward = nextReward > 0 ? Math.max(nextReward - points, 0) : "—";
  const nextEvent = upcomingEvents?.[0];

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
      value: nextEvent?.sport ?? "—",
      suffix: nextEvent?.dateTime.split(",")[1]?.trim() ?? "",
      accent: "secondary" as const,
    },
  ];

  return (
    <div className="relative mx-auto max-w-7xl px-lg py-lg">
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
        className="mb-md grid grid-cols-4 gap-sm"
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
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br px-sm py-3 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 ${shade.bg} ${shade.shadow} ${shade.hover} ${shade.border}`}
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

      <div className="grid grid-cols-2 items-start gap-md xl:grid-cols-12">
        <div className="xl:col-span-6">
          <MyPointsWidget index={0} />
        </div>
        <div className="xl:col-span-3">
          <WinStreakWidget index={1} />
        </div>
        <div className="xl:col-span-3">
          <LeagueRankWidget index={2} />
        </div>

        <div className="col-span-1 xl:col-span-4">
          <MyQRCodeWidget index={3} />
        </div>
        <div className="col-span-1 xl:col-span-4">
          <WeeklyActivityWidget index={4} />
        </div>
        <div className="col-span-2 xl:col-span-4">
          <ShopWidget index={5} />
        </div>

        <div className="col-span-2 xl:col-span-12">
          <UpcomingEventsWidget index={6} />
        </div>
      </div>
    </div>
  );
}
