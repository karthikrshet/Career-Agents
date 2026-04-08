import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Career Operating System Dashboard",
  description: "Ecosystem dashboard for resume scoring, portfolio grading, mock interview loops, and target paths.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
