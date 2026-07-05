import type { Metadata } from "next";
import EventsBottomNav from "@/components/events/EventsBottomNav";
import EventsMobileHeader from "@/components/events/EventsMobileHeader";
import EventsSideNav from "@/components/events/EventsSideNav";
import ShopContent from "@/components/shop/ShopContent";
import ShopPageHeader from "@/components/shop/ShopPageHeader";

export const metadata: Metadata = {
  title: "Shop - STL Intramural",
  description:
    "Redeem your intramural points for gear, experiences, and campus perks.",
};

export default function ShopPage() {
  return (
    <div className="events-noise-overlay bg-surface text-on-surface font-body-md min-h-screen flex flex-col md:flex-row pb-[80px] md:pb-0">
      <EventsSideNav />
      <EventsMobileHeader />

      <main className="flex-1 lg:ml-64 w-full">
        <ShopPageHeader />
        <ShopContent />
      </main>

      <EventsBottomNav />
    </div>
  );
}
