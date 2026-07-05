"use client";

import { motion } from "framer-motion";
import MaterialSymbol from "@/components/events/MaterialSymbol";
import type { SettingsTab, SettingsTabItem } from "@/lib/settings-data";

interface SettingsNavTabsProps {
  tabs: SettingsTabItem[];
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export default function SettingsNavTabs({
  tabs,
  activeTab,
  onTabChange,
}: SettingsNavTabsProps) {
  return (
    <nav
      aria-label="Settings sections"
      className="relative overflow-hidden rounded-2xl border border-surface-variant/70 bg-surface-container-lowest/95 p-1.5 shadow-[0_2px_8px_rgba(26,28,31,0.04),0_8px_32px_-8px_rgba(0,48,174,0.08)] backdrop-blur-sm"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-transparent to-secondary/[0.02]"
        aria-hidden
      />

      <ul className="relative flex flex-col gap-0.5">
        {tabs.map((tab, i) => {
          const isActive = activeTab === tab.id;

          return (
            <motion.li
              key={tab.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.35,
                delay: 0.05 + i * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <button
                type="button"
                onClick={() => onTabChange(tab.id)}
                aria-current={isActive ? "page" : undefined}
                className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-[transform,background-color,box-shadow,color] duration-200 ${
                  isActive
                    ? "bg-primary text-on-primary shadow-[0_4px_14px_rgba(0,48,174,0.22)]"
                    : "text-on-surface-variant hover:bg-surface-container-high/80 hover:text-on-surface active:scale-[0.98]"
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                    isActive
                      ? "bg-white/15"
                      : "bg-surface-container-low group-hover:bg-surface-container"
                  }`}
                >
                  <MaterialSymbol
                    icon={tab.icon}
                    filled={isActive}
                    className={
                      isActive
                        ? "text-on-primary"
                        : "text-on-surface-variant group-hover:text-primary"
                    }
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={`block text-body-md font-body-md ${
                      isActive ? "uppercase tracking-wide" : ""
                    }`}
                  >
                    {tab.label}
                  </span>
                  <span
                    className={`mt-0.5 block truncate text-label-sm font-label-sm ${
                      isActive ? "text-on-primary/80" : "text-outline"
                    }`}
                  >
                    {tab.description}
                  </span>
                </span>
                {isActive && (
                  <span
                    className="absolute right-3 h-1.5 w-1.5 rounded-full bg-on-primary/80"
                    aria-hidden
                  />
                )}
              </button>
            </motion.li>
          );
        })}
      </ul>
    </nav>
  );
}
