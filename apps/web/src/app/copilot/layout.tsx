import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Copilot — AI Career Assistant Chat",
  description:
    "Chat with your AI career copilot, powered by 146 specialized agents. Get personalized resume advice, GitHub portfolio tips, LinkedIn optimization, interview coaching, and career roadmaps.",
  keywords: [
    "career copilot", "AI career chat", "career assistant", "career advice AI",
    "resume chat", "interview chat", "job search AI", "career coaching chatbot",
  ],
  openGraph: {
    title: "Career OS Copilot — AI Career Assistant",
    description: "Multi-agent AI career copilot with persistent chat history, context injection, and 146 specialized agents.",
    url: "/copilot",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Career OS Copilot" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Copilot",
    description: "AI career assistant powered by 146 specialized agents — resume, GitHub, interview, and more.",
  },
  alternates: { canonical: "/copilot" },
};

export default function CopilotLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
