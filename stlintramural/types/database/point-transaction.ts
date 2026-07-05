import type { Tables, TablesInsert } from "@/types/database.types";

import type { Event } from "./event";

export type PointTransaction = Tables<"point_transactions">;
export type NewPointTransaction = TablesInsert<"point_transactions">;

export interface PointTransactionWithContext extends PointTransaction {
  event: Pick<Event, "id" | "title"> | null;
}
