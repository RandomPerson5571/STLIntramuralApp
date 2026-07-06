import { createHmac, timingSafeEqual } from "node:crypto";

import {
  buildStudentQrId,
  SIGNED_QR_RE,
  type StudentQrIdentity,
} from "@/lib/qr-code-format";

function getQrCodeSalt(): string {
  const salt = process.env.QR_CODE_SALT;
  if (!salt) {
    throw new Error("QR_CODE_SALT environment variable is not set");
  }
  return salt;
}

function signStudentQrId(studentQrId: string): string {
  return createHmac("sha256", getQrCodeSalt())
    .update(studentQrId)
    .digest("base64url");
}

export function buildSignedQrPayload(identity: StudentQrIdentity): string {
  const studentQrId = buildStudentQrId(identity);
  return `${studentQrId}.${signStudentQrId(studentQrId)}`;
}

export function verifySignedQrPayload(payload: string): string | null {
  const match = SIGNED_QR_RE.exec(payload.trim());
  if (!match) {
    return null;
  }

  const [, namePart, grade, token, signature] = match;
  const studentQrId = `${namePart}-${grade}-${token}`;
  const expected = signStudentQrId(studentQrId);

  if (signature.length !== expected.length) {
    return null;
  }

  try {
    if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }
  } catch {
    return null;
  }

  return token;
}
