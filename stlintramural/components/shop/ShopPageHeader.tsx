import CreateShopItemWidget from "@/components/shop/CreateShopItemWidget";
import PageHeader from "@/components/layout/PageHeader";

export default function ShopPageHeader() {
  return (
    <PageHeader
      title={["Rewards", "Shop"]}
      subtitle="Redeem your intramural points for gear, experiences, and campus perks."
      actions={<CreateShopItemWidget showTrigger />}
    />
  );
}
