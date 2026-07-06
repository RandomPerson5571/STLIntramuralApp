import type { Metadata } from "next";
import { redirect } from "next/navigation";
import EventsSideNav from "@/components/events/EventsSideNav";
import ScanContent from "@/components/scan/ScanContent";
import ScanPageHeader from "@/components/scan/ScanPageHeader";
import { canScanCheckIn } from "@/lib/permissions";
import { fetchCurrentUser } from "@/lib/queries/users";
import { createPageMetadata } from "@/lib/seo";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = createPageMetadata({
  title: "Check-In Scanner",
  description: "Scan student QR codes for intramural event check-in.",
  path: "/scan",
  noIndex: true,
});

export default async function ScanPage() {
  const supabase = await createClient();
  const user = await fetchCurrentUser(supabase);

  if (!user) {
    redirect("/login");
  }

  if (!canScanCheckIn(user)) {
    redirect("/dashboard");
  }

  return (
    <div className="events-noise-overlay bg-surface text-on-surface font-body-md min-h-screen">
      <EventsSideNav />

      <main className="min-w-0 lg:ml-64">
        <ScanPageHeader />
        <ScanContent />
      </main>
    </div>
  );
}
