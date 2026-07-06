import PageHeader from "@/components/layout/PageHeader";

export default function SettingsPageHeader() {
  return (
    <PageHeader
      title={["Account", "Settings"]}
      subtitle="Manage your profile, notifications, privacy, and app preferences."
    />
  );
}
