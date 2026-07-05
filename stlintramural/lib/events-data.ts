import type { EventItem, SportFilter, TimePeriod } from "@/types/event";

export const SPORT_FILTERS: SportFilter[] = [
  "All Sports",
  "Basketball",
  "Volleyball",
  "Soccer",
  "Tennis",
];

export const TIME_PERIODS: TimePeriod[] = ["This Week", "Next Week", "This Month"];

export const EVENTS: EventItem[] = [
  {
    id: "1",
    title: "Midnight Madness Tourney",
    sport: "Basketball",
    format: "5v5",
    dateTime: "Fri, Oct 27 • 10:00 PM",
    location: "Main Rec Center, Court 1",
    registration: "12/16 Teams Registered",
    status: "registration-open",
    action: "join-team",
    actionLabel: "Join Team",
    borderColor: "primary",
    accentColor: "primary",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqlzOpE3rAAgQ34k9dbGChbUhb4na0TO_sVI8RzULJpipCnlVaDBIGR8ZW4oCJgxo3cq_IJ_SWK-BuaiLyAErAmoKRb55iSGwHFLa2UaJUGzI20-wqzYyYWn9_5ZKcP2el8A1AlauH5uvJ_UhxaN5yr7_WyNdg14m8f_yi81tkt2UzTFyehCGlYxNcPRrFi8hqompyrrvIuBCe0XfPcMaZvevHl8t3077u6zuoIQ17ZpRpsHGgiW9HzEh1XfLigOQKuPQRDtCkYaA",
    imageAlt: "Basketball Game",
  },
  {
    id: "2",
    title: "Fall Sand Classic",
    sport: "Volleyball",
    format: "Co-Ed",
    dateTime: "Sat, Oct 28 • 2:00 PM",
    location: "South Campus Sand Courts",
    registration: "8/8 Teams Full",
    status: "waitlist-only",
    action: "join-waitlist",
    actionLabel: "Join Waitlist",
    borderColor: "secondary",
    accentColor: "secondary",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAdk-FDsYwhR-Zmeewys6004C_dQ33Dk5OhXbOUuAi5uIc5EIjdGHV_5FaeodPOB2cRBShTg27hbWzs4YsfTBAOKnmjEYTBPo7dr0XJPdUKKgxE9xecgOQuhfH5QvA2E9wzl72lroeZgw7cPxu3mZYYmZageX15nhxXnPvBQpfMBInAJYTkntpFAGPrsRl5Cp51soAKmL3XkN-ix7J-4W7q1tJc7eCFDc4i8MGGTv7PAqU42xuZY4UPsrbce8edyNHdduNQMjiFVzs",
    imageAlt: "Volleyball Game",
  },
  {
    id: "3",
    title: "Winter League Draft",
    sport: "Indoor Soccer",
    format: "7v7",
    dateTime: "Wed, Nov 1 • 6:00 PM",
    location: "Rec Center Turf Field",
    registration: "Free Agents Welcome",
    status: "registration-open",
    action: "register",
    actionLabel: "Register",
    borderColor: "primary",
    accentColor: "primary",
    placeholderIcon: "sports_soccer",
  },
];
