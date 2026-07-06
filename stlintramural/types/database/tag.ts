import type { Tables, TablesInsert, TablesUpdate } from "@/types/database.types";

import type { Event } from "./event";

export type Tag = Tables<"tags">;
export type NewTag = TablesInsert<"tags">;
export type TagUpdate = TablesUpdate<"tags">;

export interface TagWithEvent extends Tag {
  event: Pick<Event, "id" | "title">;
}
