import AdminCreateEventTrigger from "@/components/events/AdminCreateEventTrigger";
import PageHeader from "@/components/layout/PageHeader";

export default function EventsPageHeader() {
  return (
    <PageHeader
      title="Upcoming Events"
      subtitle="Find and join intramural games, tournaments, and practices across campus."
      actions={<AdminCreateEventTrigger />}
    />
  );
}
