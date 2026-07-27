import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plugin Marketplace — Extend Career Agents",
  description:
    "Browse and install plugins to extend Career Agents functionality. STAR Behavioral Coach, LeetCode Tracker, Resume PDF Parser, Salary Intelligence, and more community plugins.",
  keywords: [
    "career OS plugins", "plugin marketplace", "STAR coach plugin", "leetcode tracker",
    "resume pdf parser", "salary intelligence", "career tools extensions",
  ],
  openGraph: {
    title: "Career Agents Plugin Marketplace",
    description: "Install community plugins to extend Career Agents — STAR Coach, LeetCode Tracker, Salary Intelligence, and more.",
    url: "/marketplace",
  },
  alternates: { canonical: "/marketplace" },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
