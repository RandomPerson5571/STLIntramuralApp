export const STAT_SHADE = {
  primary: {
    bg: "from-primary/[0.06] to-surface-container-lowest",
    shadow:
      "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_6px_24px_-4px_rgba(0,48,174,0.12)]",
    hover:
      "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,48,174,0.18)]",
    icon: "text-primary bg-primary/[0.1]",
    border: "border-primary/10 hover:border-primary/20",
  },
  secondary: {
    bg: "from-secondary/[0.06] to-surface-container-lowest",
    shadow:
      "shadow-[0_2px_8px_rgba(26,28,31,0.04),0_6px_24px_-4px_rgba(0,102,136,0.12)]",
    hover:
      "hover:shadow-[0_4px_12px_rgba(26,28,31,0.05),0_12px_32px_-4px_rgba(0,102,136,0.18)]",
    icon: "text-secondary bg-secondary/[0.1]",
    border: "border-secondary/10 hover:border-secondary/20",
  },
} as const;
