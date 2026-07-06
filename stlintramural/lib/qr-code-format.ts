export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** firstname-lastname-grade-uuid.signature */
export const SIGNED_QR_RE =
  /^(.+)-(9|10|11|12)-([0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\.([A-Za-z0-9_-]+)$/i;

export function slugQrName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface StudentQrIdentity {
  firstName: string;
  lastName: string;
  grade: number;
  token: string;
}

export function buildStudentQrId({
  firstName,
  lastName,
  grade,
  token,
}: StudentQrIdentity): string {
  const first = slugQrName(firstName);
  const last = slugQrName(lastName);

  if (!first || !last || !UUID_RE.test(token)) {
    throw new Error("Invalid student QR identity");
  }

  if (grade < 9 || grade > 12) {
    throw new Error("Invalid student grade for QR code");
  }

  return `${first}-${last}-${grade}-${token}`;
}

export function isSignedQrPayload(raw: string): boolean {
  return SIGNED_QR_RE.test(raw.trim());
}
