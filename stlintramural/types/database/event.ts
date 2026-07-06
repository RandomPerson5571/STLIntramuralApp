import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

import type { Tag } from "./tag";
import type { User } from "./user";

export type Event = Tables<"events">;
export type NewEvent = TablesInsert<"events">;
export type EventUpdate = TablesUpdate<"events">;

export interface EventWithHost extends Event {
  host: Pick<User, "id" | "first_name" | "last_name" | "role">;
}

export interface EventWithTags extends Event {
  tags: Tag[];
}

export interface EventWithHostAndTags extends EventWithHost {
  tags: Tag[];
}
