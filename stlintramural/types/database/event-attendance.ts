import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

import type { Event } from "./event";
import type { User } from "./user";

export type EventAttendance = Tables<"event_attendances">;
export type NewEventAttendance = TablesInsert<"event_attendances">;
export type EventAttendanceUpdate = TablesUpdate<"event_attendances">;

export interface EventAttendanceWithRelations extends EventAttendance {
  user: Pick<User, "id" | "first_name" | "last_name">;
  event: Pick<Event, "id" | "title" | "start_date" | "end_date" | "points_awarded">;
  scanner: Pick<User, "id" | "first_name" | "last_name"> | null;
}
