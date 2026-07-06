"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { USER_ROLE_LABELS } from "@/lib/constants/user-labels";
import {
  formatFullName,
  type LeaderboardEntry,
} from "@/lib/constants/leaderboard";

const PODIUM_CONFIG = {
  1: {
    order: "order-2",
    height: "h-36 sm:h-44",
    medal: "emoji_events",
    accent: "from-primary via-primary-container to-primary",
    glow: "shadow-[0_8px_32px_rgba(0,48,174,0.28)]",
    ring: "ring-primary/30",
    label: "1st",
  },
  2: {
    order: "order-1",
    height: "h-28 sm:h-36",
    medal: "military_tech",
    accent: "from-secondary/90 via-secondary to-secondary-container",
    glow: "shadow-[0_6px_24px_rgba(0,102,136,0.22)]",
    ring: "ring-secondary/25",
    label: "2nd",
  },
  3: {
    order: "order-3",
    height: "h-24 sm:h-32",
    medal: "workspace_premium",
    accent: "from-tertiary via-tertiary-container to-outline",
    glow: "shadow-[0_6px_24px_rgba(61,65,67,0.18)]",
    ring: "ring-outline/20",
    label: "3rd",
  },
} as const;

function PodiumSlot({
  entry,
  place,
  index,
  currentUserId,
}: {
  entry: LeaderboardEntry;
  place: 1 | 2 | 3;
  index: number;
  currentUserId?: string;
}) {
  const config = PODIUM_CONFIG[place];
  const isCurrentUser = entry.id === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.55,
        delay: 0.08 + index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`flex flex-1 flex-col items-center ${config.order}`}
    >
      <div
        className={`relative mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br sm:h-16 sm:w-16 ${config.accent} ${config.glow} ring-2 ${config.ring} ${
          isCurrentUser ? "ring-offset-2 ring-offset-surface" : ""
        }`}
      >
        <span className="text-headline-md font-headline-md text-on-primary">
          {entry.first_name.charAt(0)}
          {entry.last_name.charAt(0)}
        </span>
        {isCurrentUser && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary-container text-[10px] font-label-sm text-on-secondary-container">
            ★
          </span>
        )}
      </div>

      <p className="max-w-[7rem] truncate text-center text-body-md font-body-md text-on-surface">
        {formatFullName(entry)}
      </p>
      <p className="text-label-sm font-label-sm uppercase text-on-surface-variant">
        {USER_ROLE_LABELS[entry.role]}
      </p>
      <p className="mt-1 text-headline-md font-headline-md tabular-nums text-primary">
        {entry.points_balance.toLocaleString()}
        <span className="ml-1 text-label-sm font-label-sm text-on-surface-variant">
          pts
        </span>
      </p>

      <div
        className={`mt-3 flex w-full flex-col items-center justify-end rounded-t-2xl border border-b-0 border-surface-variant/50 bg-gradient-to-t from-surface-container-low to-surface-container-lowest/90 px-2 pb-3 pt-4 backdrop-blur-sm ${config.height}`}
      >
        <MaterialSymbol icon={config.medal} className="mb-1 text-2xl text-primary" filled />
        <span className="text-label-sm font-label-sm uppercase tracking-widest text-on-surface-variant">
          {config.label}
        </span>
      </div>
    </motion.div>
  );
}

interface LeaderboardPodiumProps {
  entries: LeaderboardEntry[];
}

export default function LeaderboardPodium({ entries }: LeaderboardPodiumProps) {
  const { data: user } = useCurrentUser();
  const topThree = entries.slice(0, 3);

  if (topThree.length < 3) return null;

  const [first, second, third] = topThree;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-surface-variant/70 bg-surface-container-lowest/95 p-sm shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,48,174,0.1)] backdrop-blur-sm sm:p-md">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-secondary/[0.04]"
        aria-hidden
      />
      <div className="relative flex items-end justify-center gap-2 sm:gap-4">
        <PodiumSlot entry={second} place={2} index={0} currentUserId={user?.id} />
        <PodiumSlot entry={first} place={1} index={1} currentUserId={user?.id} />
        <PodiumSlot entry={third} place={3} index={2} currentUserId={user?.id} />
      </div>
    </div>
  );
}
