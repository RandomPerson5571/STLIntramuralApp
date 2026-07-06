import type { Metadata } from "next";
import DashboardContent from "@/components/dashboard/DashboardContent";
import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import AppShell from "@/components/layout/AppShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Dashboard",
  description: "Your hub for points, check-ins, and upcoming intramural games.",
  path: "/dashboard",
  noIndex: true,
});

export default function DashboardPage() {
  return (
    <AppShell header={<DashboardPageHeader />}>
      <DashboardContent />
    </AppShell>
  );
}
