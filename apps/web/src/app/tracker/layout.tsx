import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Tracker — Kanban Application Board",
  description:
    "Track all your job applications with a Kanban board. Organize applications across Applied, Screening, Interview, Offer, and Rejected stages. Get AI-powered follow-up suggestions.",
  keywords: [
    "job tracker", "job application tracker", "kanban job board", "job search tracker",
    "application pipeline", "job hunt organizer", "career job board",
  ],
  openGraph: {
    title: "Career OS Job Tracker — Kanban Application Board",
    description: "Organize all job applications in a Kanban board with status tracking and AI follow-up suggestions.",
    url: "/tracker",
  },
  alternates: { canonical: "/tracker" },
};

export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
