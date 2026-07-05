import EventCard from "@/components/events/EventCard";
import type { EventItem } from "@/types/event";

interface EventsGridProps {
  events: EventItem[];
}

export default function EventsGrid({ events }: EventsGridProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-sm md:grid-cols-2 md:gap-md xl:grid-cols-3">
      {events.map((event, index) => (
        <EventCard key={event.id} event={event} index={index} />
      ))}
    </div>
  );
}
