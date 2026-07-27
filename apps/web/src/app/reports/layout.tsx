import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Reports — Export Career Analysis",
  description:
    "Generate and export comprehensive career analysis reports combining resume scores, GitHub portfolio health, LinkedIn visibility, interview performance, and job application metrics.",
  keywords: [
    "career report", "career analysis export", "resume report", "career score report",
    "job search analytics", "career dashboard export",
  ],
  openGraph: {
    title: "Career Agents Reports — Career Analysis Dashboard",
    description: "Export comprehensive career reports combining all module scores and analysis.",
    url: "/reports",
  },
  alternates: { canonical: "/reports" },
};

export default function ReportsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
