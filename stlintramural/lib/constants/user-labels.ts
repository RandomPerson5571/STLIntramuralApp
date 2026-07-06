import type { UserRole } from "@/types/database";

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  student: "Student",
  teacher: "Teacher",
  admin: "Admin",
};
