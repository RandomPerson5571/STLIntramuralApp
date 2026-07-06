import type { ReactNode } from "react";
import EventsSideNav from "@/components/events/EventsSideNav";

type AppShellProps = {
  header?: ReactNode;
  children: ReactNode;
};

export default function AppShell({ header, children }: AppShellProps) {
  return (
    <div className="events-noise-overlay bg-surface text-on-surface font-body-md min-h-screen">
      <EventsSideNav />

      <main className="min-w-0 lg:ml-64">
        {header}
        {children}
      </main>
    </div>
  );
}
