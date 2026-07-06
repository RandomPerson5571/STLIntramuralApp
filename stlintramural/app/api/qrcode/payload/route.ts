import { NextResponse } from "next/server";

import { getStudentGrade } from "@/lib/constants/leaderboard";
import { buildSignedQrPayload } from "@/lib/qr-code-salt";
import { fetchCurrentUser } from "@/lib/queries/users";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const user = await fetchCurrentUser(supabase);

    if (!user) {
      return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
    }

    const grade = getStudentGrade(user.graduation_year);
    if (grade == null) {
      return NextResponse.json({ error: "invalid_student_grade" }, { status: 400 });
    }

    const payload = buildSignedQrPayload({
      firstName: user.first_name,
      lastName: user.last_name,
      grade,
      token: user.qr_code_token,
    });

    return NextResponse.json({ payload });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("QR_CODE_SALT")) {
      return NextResponse.json({ error: "qr_not_configured" }, { status: 503 });
    }

    return NextResponse.json({ error: "internal_server_error" }, { status: 500 });
  }
}
