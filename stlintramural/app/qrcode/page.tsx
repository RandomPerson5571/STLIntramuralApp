import type { Metadata } from "next";
import AppShell from "@/components/layout/AppShell";
import QRCodeContent from "@/components/qrcode/QRCodeContent";
import QRCodePageHeader from "@/components/qrcode/QRCodePageHeader";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "My Check-In Code",
  description: "Your personal QR code for intramural event check-in.",
  path: "/qrcode",
  noIndex: true,
});

export default function QRCodePage() {
  return (
    <AppShell header={<QRCodePageHeader />}>
      <QRCodeContent />
    </AppShell>
  );
}
