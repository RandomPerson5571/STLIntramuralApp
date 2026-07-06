export function throwIfError(error: unknown): void {
  if (error) {
    throw error;
  }
}

export interface AttendanceCountRow {
  attendances: { count: number }[];
}

export function getAttendanceCount(row: AttendanceCountRow): number {
  return row.attendances?.[0]?.count ?? 0;
}
