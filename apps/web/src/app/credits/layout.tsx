import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credits — Open Source Contributors & Repository Stats",
  description:
    "Career OS is fully open source (MIT). Meet the contributors, explore live GitHub repository stats, clone the project, and join the open source career intelligence ecosystem.",
  keywords: [
    "career OS open source", "career OS contributors", "career OS github", "MIT license career tool",
    "open source career platform", "career OS repository",
  ],
  openGraph: {
    title: "Career OS Credits — Open Source Contributors",
    description: "Open source career intelligence platform — meet contributors, view GitHub stats, and join the community.",
    url: "/credits",
  },
  alternates: { canonical: "/credits" },
};

export default function CreditsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
