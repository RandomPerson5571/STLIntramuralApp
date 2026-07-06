export async function fetchQrCodePayload(): Promise<string> {
  const response = await fetch("/api/qrcode/payload");

  if (!response.ok) {
    throw new Error("Failed to load check-in code");
  }

  const data = (await response.json()) as { payload?: string };
  if (!data.payload) {
    throw new Error("Failed to load check-in code");
  }

  return data.payload;
}
