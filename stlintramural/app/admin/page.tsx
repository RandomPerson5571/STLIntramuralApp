import type { Metadata } from "next";
import AdminContent from "@/components/admin/AdminContent";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AppShell from "@/components/layout/AppShell";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Admin Console",
  description:
    "Manage users, events, shop items, and platform settings for STL Intramurals.",
  path: "/admin",
  noIndex: true,
});

export default function AdminPage() {
  return (
    <AppShell header={<AdminPageHeader />}>
      <AdminContent />
    </AppShell>
  );
}
