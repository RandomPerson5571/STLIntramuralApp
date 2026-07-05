import type { Metadata } from "next";
import LandingPage from "@/components/landing/LandingPage";

export const metadata: Metadata = {
  title: "STL Intramural — Play Hard. Win Big.",
  description:
    "Track points, check in to games, climb the leaderboard, and redeem rewards.",
};

export default function HomePage() {
  return <LandingPage />;
}
