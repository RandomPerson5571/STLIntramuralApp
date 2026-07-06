import type { SupabaseClient } from "@supabase/supabase-js";

import type { AdminActivityItem } from "@/lib/constants/admin-nav";
import { formatRelativeTime } from "@/lib/format";
import {
  mapEventToItem,
  type EventQueryRow,
} from "@/lib/mappers/event";
import { getAttendanceCount, throwIfError } from "@/lib/queries/utils";
import type { UserRole } from "@/types/database";

export interface AdminStats {
  totalUsers: number;
  activeEvents: number;
  pointsDistributed: number;
  shopItems: number;
}

export async function fetchAdminStats(
  supabase: SupabaseClient,
): Promise<AdminStats> {
  const now = new Date().toISOString();

  const [
    { count: totalUsers, error: usersError },
    { count: activeEvents, error: eventsError },
    { data: pointsRows, error: pointsError },
    { count: shopItems, error: shopError },
  ] = await Promise.all([
    supabase.from("users").select("id", { count: "exact", head: true }),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .gte("end_date", now),
    supabase.from("users").select("points_balance"),
    supabase.from("shop_items").select("id", { count: "exact", head: true }),
  ]);

  throwIfError(usersError);
  throwIfError(eventsError);
  throwIfError(pointsError);
  throwIfError(shopError);

  const pointsDistributed = (pointsRows ?? []).reduce(
    (sum, row) => sum + row.points_balance,
    0,
  );

  return {
    totalUsers: totalUsers ?? 0,
    activeEvents: activeEvents ?? 0,
    pointsDistributed,
    shopItems: shopItems ?? 0,
  };
}

const ACTIVITY_FETCH_LIMIT = 10;
const ACTIVITY_DISPLAY_LIMIT = 8;

export const DEFAULT_ADMIN_EVENTS_PAGE_SIZE = 12;
export const DEFAULT_ADMIN_USERS_PAGE_SIZE = 20;
export const ADMIN_USER_TRANSACTIONS_LIMIT = 10;

export type AdminEventTiming = "upcoming" | "active" | "past";

export interface AdminEvent {
  id: string;
  slug: string;
  title: string;
  sport: string;
  format: string;
  location: string;
  dateTime: string;
  startDate: string;
  endDate: string;
  hostName: string;
  registration: string;
  registrationCount: number;
  maxAttendees: number | null;
  pointsAwarded: number;
  description: string | null;
  timing: AdminEventTiming;
}

export interface FetchAdminEventsResult {
  events: AdminEvent[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function getEventTiming(startDate: string, endDate: string): AdminEventTiming {
  const now = Date.now();
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  if (now > end) return "past";
  if (now >= start) return "active";
  return "upcoming";
}

function mapRowToAdminEvent(row: EventQueryRow, index: number): AdminEvent {
  const item = mapEventToItem(row, { index, isRegistered: false });
  const host = relationOne(
    row.host as UserNameRow | UserNameRow[] | null,
  );

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    sport: item.sport,
    format: item.format,
    location: item.location,
    dateTime: item.dateTime,
    startDate: row.start_date,
    endDate: row.end_date,
    hostName: formatUserName(host),
    registration: item.registration,
    registrationCount: getAttendanceCount(row),
    maxAttendees: row.max_attendees,
    pointsAwarded: row.points_awarded,
    description: row.description,
    timing: getEventTiming(row.start_date, row.end_date),
  };
}

type UserNameRow = { first_name: string; last_name: string };

function relationOne<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function formatUserName(user: UserNameRow | null): string {
  if (!user) return "Unknown user";
  return `${user.first_name} ${user.last_name}`.trim();
}

export async function fetchAdminRecentActivity(
  supabase: SupabaseClient,
): Promise<AdminActivityItem[]> {
  const [
    { data: attendances, error: attendanceError },
    { data: shopTxns, error: shopError },
    { data: pointTxns, error: pointsError },
  ] = await Promise.all([
    supabase
      .from("event_attendances")
      .select(
        "id, attended_at, user:users!user_id(first_name, last_name), event:events!event_id(title)",
      )
      .not("attended_at", "is", null)
      .order("attended_at", { ascending: false })
      .limit(ACTIVITY_FETCH_LIMIT),
    supabase
      .from("shop_transactions")
      .select(
        "id, purchased_at, points_spent, quantity, user:users!user_id(first_name, last_name), item:shop_items(title)",
      )
      .order("purchased_at", { ascending: false })
      .limit(ACTIVITY_FETCH_LIMIT),
    supabase
      .from("point_transactions")
      .select(
        "id, created_at, points, description, user:users!user_id(first_name, last_name), event:events(title)",
      )
      .order("created_at", { ascending: false })
      .limit(ACTIVITY_FETCH_LIMIT),
  ]);

  throwIfError(attendanceError);
  throwIfError(shopError);
  throwIfError(pointsError);

  type RawActivity = AdminActivityItem & { timestamp: string };

  const items: RawActivity[] = [];

  for (const row of attendances ?? []) {
    const attendedAt = row.attended_at as string;
    const user = relationOne(row.user as UserNameRow | UserNameRow[] | null);
    const event = relationOne(
      row.event as { title: string } | { title: string }[] | null,
    );

    items.push({
      id: `attendance-${row.id}`,
      action: "Event check-in",
      detail: `${formatUserName(user)} — ${event?.title ?? "Event"}`,
      time: formatRelativeTime(attendedAt),
      icon: "qr_code_scanner",
      timestamp: attendedAt,
    });
  }

  for (const row of shopTxns ?? []) {
    const purchasedAt = row.purchased_at as string;
    const user = relationOne(row.user as UserNameRow | UserNameRow[] | null);
    const item = relationOne(
      row.item as { title: string } | { title: string }[] | null,
    );
    const qty = row.quantity as number;
    const qtyLabel = qty > 1 ? ` (×${qty})` : "";

    items.push({
      id: `shop-${row.id}`,
      action: "Shop redemption",
      detail: `${formatUserName(user)} — ${item?.title ?? "Item"}${qtyLabel} for ${row.points_spent} pts`,
      time: formatRelativeTime(purchasedAt),
      icon: "redeem",
      timestamp: purchasedAt,
    });
  }

  for (const row of pointTxns ?? []) {
    const createdAt = row.created_at as string;
    const user = relationOne(row.user as UserNameRow | UserNameRow[] | null);
    const points = row.points as number;
    const signed = points > 0 ? `+${points}` : String(points);

    items.push({
      id: `points-${row.id}`,
      action: points >= 0 ? "Points awarded" : "Points deducted",
      detail: `${formatUserName(user)} — ${row.description} (${signed} pts)`,
      time: formatRelativeTime(createdAt),
      icon: points >= 0 ? "stars" : "paid",
      timestamp: createdAt,
    });
  }

  return items
    .sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    )
    .slice(0, ACTIVITY_DISPLAY_LIMIT)
    .map(({ timestamp: _, ...item }) => item);
}

export interface AdminUser {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: UserRole;
  isAdmin: boolean;
  pointsBalance: number;
  graduationYear: number | null;
  createdAt: string;
}

export interface AdminUserTransaction {
  id: string;
  createdAt: string;
  points: number;
  description: string;
  eventTitle: string | null;
}

export interface AdminUserDetail extends AdminUser {
  recentTransactions: AdminUserTransaction[];
}

export interface FetchAdminUsersResult {
  users: AdminUser[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type AdminUserRow = {
  id: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_admin: boolean;
  points_balance: number;
  graduation_year: number | null;
  created_at: string;
};

function mapRowToAdminUser(row: AdminUserRow): AdminUser {
  const firstName = row.first_name.trim();
  const lastName = row.last_name.trim();

  return {
    id: row.id,
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`.trim() || "Unknown user",
    role: row.role,
    isAdmin: row.is_admin,
    pointsBalance: row.points_balance,
    graduationYear: row.graduation_year,
    createdAt: row.created_at,
  };
}

export async function fetchAdminUsers(
  supabase: SupabaseClient,
  page: number,
  pageSize = DEFAULT_ADMIN_USERS_PAGE_SIZE,
): Promise<FetchAdminUsersResult> {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("users")
    .select(
      "id, first_name, last_name, role, is_admin, points_balance, graduation_year, created_at",
      { count: "exact" },
    )
    .order("points_balance", { ascending: false })
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true })
    .range(from, to);

  throwIfError(error);

  const rows = (data ?? []) as AdminUserRow[];
  const totalCount = count ?? rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    users: rows.map(mapRowToAdminUser),
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}

export async function fetchAdminUserDetail(
  supabase: SupabaseClient,
  userId: string,
): Promise<AdminUserDetail | null> {
  const [{ data: userRow, error: userError }, { data: txnRows, error: txnError }] =
    await Promise.all([
      supabase
        .from("users")
        .select(
          "id, first_name, last_name, role, is_admin, points_balance, graduation_year, created_at",
        )
        .eq("id", userId)
        .maybeSingle(),
      supabase
        .from("point_transactions")
        .select(
          "id, created_at, points, description, event:events(title)",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(ADMIN_USER_TRANSACTIONS_LIMIT),
    ]);

  throwIfError(userError);
  throwIfError(txnError);

  if (!userRow) {
    return null;
  }

  const recentTransactions: AdminUserTransaction[] = (txnRows ?? []).map(
    (row) => {
      const event = relationOne(
        row.event as { title: string } | { title: string }[] | null,
      );

      return {
        id: row.id as string,
        createdAt: row.created_at as string,
        points: row.points as number,
        description: row.description as string,
        eventTitle: event?.title ?? null,
      };
    },
  );

  return {
    ...mapRowToAdminUser(userRow as AdminUserRow),
    recentTransactions,
  };
}

export interface AdminUserUpdateInput {
  firstName: string;
  lastName: string;
  role: UserRole;
  isAdmin: boolean;
  graduationYear: number | null;
}

export async function updateAdminUser(
  supabase: SupabaseClient,
  userId: string,
  input: AdminUserUpdateInput,
): Promise<void> {
  const { error } = await supabase
    .from("users")
    .update({
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      role: input.role,
      is_admin: input.isAdmin,
      graduation_year: input.role === "student" ? input.graduationYear : null,
    })
    .eq("id", userId);

  throwIfError(error);
}

export async function deleteAdminUser(
  supabase: SupabaseClient,
  userId: string,
): Promise<void> {
  const { error } = await supabase.from("users").delete().eq("id", userId);

  throwIfError(error);
}

export async function adjustAdminUserPoints(
  supabase: SupabaseClient,
  userId: string,
  delta: number,
  description: string,
): Promise<void> {
  const { error } = await supabase.rpc("admin_adjust_user_points", {
    p_user_id: userId,
    p_delta: delta,
    p_description: description,
  });

  throwIfError(error);
}

export async function fetchAdminEvents(
  supabase: SupabaseClient,
  page: number,
  pageSize = DEFAULT_ADMIN_EVENTS_PAGE_SIZE,
): Promise<FetchAdminEventsResult> {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("events")
    .select(
      "*, host:users!host_id(id, first_name, last_name, role), attendances:event_attendances(count)",
      { count: "exact" },
    )
    .order("start_date", { ascending: false })
    .range(from, to);

  throwIfError(error);

  const rows = (data ?? []) as EventQueryRow[];
  const totalCount = count ?? rows.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    events: rows.map((row, index) => mapRowToAdminEvent(row, index)),
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}
