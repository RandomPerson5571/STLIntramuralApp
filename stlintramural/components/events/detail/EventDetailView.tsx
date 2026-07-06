"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import EventDetailContent from "@/components/events/detail/EventDetailContent";
import EventDetailHero from "@/components/events/detail/EventDetailHero";
import EventDetailPreloader from "@/components/events/detail/EventDetailPreloader";
import EventDetailStickyNav from "@/components/events/detail/EventDetailStickyNav";
import type { EventDetail } from "@/types/event-detail";

interface EventDetailViewProps {
  event: EventDetail;
  related: EventDetail[];
}

export default function EventDetailView({ event, related }: EventDetailViewProps) {
  const reducedMotion = useReducedMotion();
  const [preloading, setPreloading] = useState(true);

  useEffect(() => {
    if (reducedMotion) return;

    const timer = window.setTimeout(() => setPreloading(false), 900);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  const icon =
    event.placeholderIcon ??
    (event.sport === "Basketball"
      ? "sports_basketball"
      : event.sport === "Volleyball"
        ? "sports_volleyball"
        : event.sport === "Indoor Soccer"
          ? "sports_soccer"
          : "sports");

  return (
    <>
      <EventDetailPreloader
        title={event.title}
        icon={icon}
        visible={preloading && !reducedMotion}
      />
      <EventDetailStickyNav title={event.title} />
      <EventDetailHero event={event} />
      <EventDetailContent event={event} related={related} />
    </>
  );
}
