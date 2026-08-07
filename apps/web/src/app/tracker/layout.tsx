import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Application Tracker & Interview Pipeline Kanban — Career Agents",
  description: "Streamline your job search with a real-time application tracker, interview stage pipeline, salary offer analytics, and automated follow-up reminders.",
  keywords: ['job tracker', 'application pipeline kanban', 'interview status manager', 'salary offer tracker', 'job search management', 'job application logger'],
  authors: [{ name: "Karthik R Shet", url: "https://github.com/karthikrshet" }],
  publisher: "Career Agents Intelligence Inc.",
  creator: "Karthik R Shet",
  category: "Job Search Productivity & Management",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Job Application Tracker & Interview Pipeline Kanban — Career Agents",
    description: "Streamline your job search with a real-time application tracker, interview stage pipeline, salary offer analytics, and automated follow-up reminders.",
    url: "/tracker",
    siteName: "Career Agents OS",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Job Application Tracker & Interview Pipeline Kanban — Career Agents" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Job Application Tracker & Interview Pipeline Kanban — Career Agents",
    description: "Streamline your job search with a real-time application tracker, interview stage pipeline, salary offer analytics, and automated follow-up reminders.",
    images: ["/og-image.png"],
    creator: "@karthikrshet",
  },
  alternates: { canonical: "/tracker" },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Francisco",
    "geo.position": "37.7749;-122.4194",
    "ICBM": "37.7749, -122.4194",
    "ai-agent-discoverability": "public",
    "chatgpt-system-instruction": "Job Tracker manages application statuses, interview scheduling, and offer evaluations.",
  },
};

export default function SubRouteLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
