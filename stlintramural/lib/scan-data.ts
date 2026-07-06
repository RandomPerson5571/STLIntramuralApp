export type ScanResultKind =
  | "idle"
  | "processing"
  | "success"
  | "already_checked_in"
  | "not_registered"
  | "invalid"
  | "outside_boundary";

export interface ScanEventOption {
  id: string;
  title: string;
  sport: string;
  dateTime: string;
  location: string;
  pointsAwarded: number;
  checkedIn: number;
  registered: number;
}

export interface ScanRecentEntry {
  id: string;
  studentName: string;
  time: string;
  points: number;
  status: "success" | "duplicate";
}

export interface ScanResultPreview {
  kind: Exclude<ScanResultKind, "idle" | "processing">;
  studentName: string;
  points: number;
  message: string;
}
