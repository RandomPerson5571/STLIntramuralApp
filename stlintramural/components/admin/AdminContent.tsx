"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AdminQuickActions from "@/components/admin/AdminQuickActions";
import AdminEventsPanel from "@/components/admin/AdminEventsPanel";
import AdminPointsPanel from "@/components/admin/AdminPointsPanel";
import CreateShopItemWidget from "@/components/shop/CreateShopItemWidget";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import { useAdminRecentActivity, useAdminStats } from "@/hooks/useAdmin";
import {
  ADMIN_SECTIONS,
  ADMIN_SECTION_PLACEHOLDERS,
  ADMIN_STATS,
  type AdminSection,
  type AdminStatId,
} from "@/lib/constants/admin-nav";
import { STAT_SHADE } from "@/lib/constants/stat-shade";
import type { AdminStats } from "@/lib/queries/admin";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function formatAdminStatValue(
  id: AdminStatId,
  stats: AdminStats | undefined,
  isPending: boolean,
): string {
  if (isPending) {
    return "…";
  }

  if (!stats) {
    return "—";
  }

  switch (id) {
    case "users":
      return stats.totalUsers.toLocaleString();
    case "events":
      return stats.activeEvents.toLocaleString();
    case "points":
      return stats.pointsDistributed.toLocaleString();
    case "shop":
      return stats.shopItems.toLocaleString();
  }
}

function statDelta(id: AdminStatId): string {
  switch (id) {
    case "users":
      return "Registered accounts";
    case "events":
      return "Upcoming or in progress";
    case "points":
      return "Total points in circulation";
    case "shop":
      return "Items in the catalog";
  }
}

function SectionTabs({
  active,
  onChange,
}: {
  active: AdminSection;
  onChange: (section: AdminSection) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto rounded-2xl border border-surface-variant/60 bg-surface-container-lowest/80 p-1 backdrop-blur-sm">
      {ADMIN_SECTIONS.map((section) => {
        const isActive = active === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => onChange(section.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-label-sm font-label-sm transition-[transform,background-color,box-shadow,color] duration-200 ${
              isActive
                ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)]"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface active:scale-[0.98]"
            }`}
          >
            <MaterialSymbol
              icon={section.icon}
              filled={isActive}
              className={isActive ? "text-on-primary" : undefined}
            />
            {section.label}
          </button>
        );
      })}
    </div>
  );
}

function OverviewPanel({
  onNavigate,
}: {
  onNavigate: (section: AdminSection) => void;
}) {
  const {
    data: stats,
    isPending: statsPending,
    isError: statsError,
    refetch: refetchStats,
  } = useAdminStats();
  const {
    data: activity,
    isPending: activityPending,
    isError: activityError,
    refetch: refetchActivity,
  } = useAdminRecentActivity();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-lg"
    >
      <motion.div
        variants={itemVariants}
        className="grid gap-sm sm:grid-cols-2 xl:grid-cols-4"
      >
        {ADMIN_STATS.map((stat) => {
          const shade = STAT_SHADE[stat.accent];
          return (
            <div
              key={stat.id}
              className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${shade.bg} ${shade.border} ${shade.shadow} ${shade.hover} p-md transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5`}
            >
              <div className="mb-md flex items-start justify-between">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${shade.icon}`}
                >
                  <MaterialSymbol icon={stat.icon} />
                </span>
                <span className="rounded-full border border-surface-variant/60 bg-surface-container-low/80 px-2 py-0.5 text-label-sm font-label-sm text-outline">
                  {statsError ? (
                    <button
                      type="button"
                      onClick={() => void refetchStats()}
                      className="text-primary hover:underline"
                    >
                      Retry
                    </button>
                  ) : (
                    "Live"
                  )}
                </span>
              </div>
              <p className="text-label-sm font-label-sm uppercase tracking-wide text-on-surface-variant">
                {stat.label}
              </p>
              <p className="mt-1 text-display-md font-display-md text-on-surface">
                {formatAdminStatValue(stat.id, stats, statsPending)}
              </p>
              <p className="mt-1 text-body-sm font-body-sm text-outline">
                {statDelta(stat.id)}
              </p>
            </div>
          );
        })}
      </motion.div>

      <div className="grid gap-lg lg:grid-cols-[1.2fr_0.8fr]">
        <motion.div variants={itemVariants}>
          <h2 className="mb-sm text-title-lg font-title-lg text-on-surface">
            Quick actions
          </h2>
          <AdminQuickActions onNavigate={onNavigate} />
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="mb-sm flex items-center justify-between">
            <h2 className="text-title-lg font-title-lg text-on-surface">
              Recent activity
            </h2>
            {activityError && (
              <button
                type="button"
                onClick={() => void refetchActivity()}
                className="text-label-sm font-label-sm text-primary hover:underline"
              >
                Retry
              </button>
            )}
          </div>
          <div className="overflow-hidden rounded-2xl border border-surface-variant/60 bg-surface-container-lowest/80 backdrop-blur-sm">
            {activityPending ? (
              <ul className="divide-y divide-surface-variant/50">
                {Array.from({ length: 4 }).map((_, i) => (
                  <li key={i} className="flex items-start gap-sm p-md">
                    <span className="h-9 w-9 shrink-0 animate-pulse rounded-xl bg-surface-container" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <span className="block h-4 w-28 animate-pulse rounded bg-surface-container" />
                      <span className="block h-3 w-full animate-pulse rounded bg-surface-container-high" />
                    </div>
                    <span className="h-3 w-12 shrink-0 animate-pulse rounded bg-surface-container" />
                  </li>
                ))}
              </ul>
            ) : activityError ? (
              <p className="p-md text-body-sm font-body-sm text-on-surface-variant">
                Could not load recent activity.
              </p>
            ) : (activity?.length ?? 0) === 0 ? (
              <p className="p-md text-body-sm font-body-sm text-on-surface-variant">
                No activity yet.
              </p>
            ) : (
              <ul className="divide-y divide-surface-variant/50">
                {activity!.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start gap-sm p-md transition-colors duration-200 hover:bg-surface-container-low/60"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface-container text-on-surface-variant">
                      <MaterialSymbol icon={item.icon} className="text-lg" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-body-md font-body-md text-on-surface">
                        {item.action}
                      </p>
                      <p className="truncate text-body-sm font-body-sm text-on-surface-variant">
                        {item.detail}
                      </p>
                    </div>
                    <span className="shrink-0 text-label-sm font-label-sm text-outline">
                      {item.time}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ShopManagementPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-surface-variant/60 bg-gradient-to-br from-surface-container-lowest via-surface to-surface-container-low/40 p-xl backdrop-blur-sm"
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-secondary/[0.05] blur-3xl"
        aria-hidden
      />
      <div className="relative z-10 flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-lg">
          <span className="mb-md flex h-16 w-16 items-center justify-center rounded-2xl border border-secondary/15 bg-secondary/[0.08] text-secondary shadow-[0_8px_32px_-8px_rgba(0,102,136,0.25)]">
            <MaterialSymbol icon="storefront" className="text-3xl" />
          </span>
          <h2 className="mb-2 text-display-sm font-display-sm uppercase text-on-surface slanted-accent">
            Shop catalog
          </h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant">
            Publish rewards for students to redeem with intramural points. Inventory
            and redemption history will live here soon.
          </p>
        </div>
        <CreateShopItemWidget showTrigger />
      </div>
    </motion.div>
  );
}

function SectionPlaceholder() {
  const placeholder = ADMIN_SECTION_PLACEHOLDERS.users;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-3xl border border-surface-variant/60 bg-gradient-to-br from-surface-container-lowest via-surface to-surface-container-low/40 p-xl backdrop-blur-sm"
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/[0.05] blur-3xl"
        aria-hidden
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="mb-md flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/15 bg-primary/[0.08] text-primary shadow-[0_8px_32px_-8px_rgba(0,48,174,0.25)]">
          <MaterialSymbol icon={placeholder.icon} className="text-3xl" />
        </span>
        <h2 className="mb-2 text-display-sm font-display-sm uppercase text-on-surface slanted-accent">
          {placeholder.title}
        </h2>
        <p className="mb-lg max-w-md text-body-lg font-body-lg text-on-surface-variant">
          {placeholder.body}
        </p>
        <div className="inline-flex items-center gap-2 rounded-full border border-surface-variant/70 bg-surface-container-low/80 px-4 py-2 text-label-sm font-label-sm text-outline">
          <MaterialSymbol icon="construction" className="text-base" />
          Backend wiring in progress
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminContent() {
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");

  return (
    <div className="relative mx-auto max-w-7xl px-lg py-lg">
      <div
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -top-20 right-0 h-72 w-72 rounded-full bg-primary/[0.04] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-secondary/[0.03] blur-3xl" />
      </div>

      <div className="mb-lg">
        <SectionTabs active={activeSection} onChange={setActiveSection} />
        <p className="mt-sm text-body-sm font-body-sm text-on-surface-variant">
          {ADMIN_SECTIONS.find((s) => s.id === activeSection)?.description}
        </p>
      </div>

      {activeSection === "overview" ? (
        <OverviewPanel onNavigate={setActiveSection} />
      ) : activeSection === "events" ? (
        <AdminEventsPanel />
      ) : activeSection === "shop" ? (
        <ShopManagementPanel />
      ) : activeSection === "points" ? (
        <AdminPointsPanel />
      ) : (
        <SectionPlaceholder />
      )}
    </div>
  );
}
