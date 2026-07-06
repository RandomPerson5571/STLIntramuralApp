import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import ShopContent from "@/components/shop/ShopContent";
import ShopPageHeader from "@/components/shop/ShopPageHeader";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Shop",
  description:
    "Redeem your intramural points for gear, experiences, and campus perks.",
  path: "/shop",
});

export default function ShopPage() {
  return (
    <AppShell header={<ShopPageHeader />}>
      <ShopContent />
    </AppShell>
  );
}
