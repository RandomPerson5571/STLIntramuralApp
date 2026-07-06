"use client";

import QRCode from "react-qr-code";

interface CheckInQRCodeProps {
  token: string;
  size?: number;
  title?: string;
}

export default function CheckInQRCode({
  token,
  size = 256,
  title = "Student check-in QR code",
}: CheckInQRCodeProps) {
  return (
    <QRCode
      value={token}
      size={size}
      level="M"
      fgColor="#0030ae"
      bgColor="#ffffff"
      title={title}
      className="block h-full w-full"
      style={{ height: "auto", maxWidth: "100%", width: "100%" }}
      viewBox={`0 0 ${size} ${size}`}
    />
  );
}
