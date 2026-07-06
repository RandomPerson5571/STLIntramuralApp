import type { Metadata } from "next";
import EventsContent from "@/components/events/EventsContent";
import EventsPageHeader from "@/components/events/EventsPageHeader";
import AppShell from "@/components/layout/AppShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Events",
  description:
    "Find and join intramural games, tournaments, and practices across campus.",
  path: "/events",
});

export default function EventsPage() {
  return (
    <AppShell header={<EventsPageHeader />}>
      <EventsContent />
    </AppShell>
  );
}
