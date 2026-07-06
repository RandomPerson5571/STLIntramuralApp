import type { User } from "@/types/database";

export function canManageUsers(user: User | null | undefined): boolean {
  return !!user?.is_admin;
}

export function canCreateEvents(user: User | null | undefined): boolean {
  return !!user?.is_admin;
}

export function canCreateShopItems(user: User | null | undefined): boolean {
  return user?.role === "admin" || user?.role === "teacher";
}

export function canScanCheckIn(user: User | null | undefined): boolean {
  return !!user?.is_admin || user?.role === "teacher";
}
