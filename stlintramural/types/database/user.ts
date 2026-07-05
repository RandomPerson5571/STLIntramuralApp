import type { Enums, Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

export const USER_ROLES = ["student", "teacher", "admin"] as const;
export type UserRole = Enums<"user_role">;

export type User = Tables<"users">;
export type NewUser = TablesInsert<"users">;
export type UserUpdate = TablesUpdate<"users">;

export interface UserPublic {
  id: User["id"];
  first_name: User["first_name"];
  last_name: User["last_name"];
  role: User["role"];
  points_balance: User["points_balance"];
}
