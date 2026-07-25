import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — AI Provider & Profile Configuration",
  description:
    "Configure AI providers, manage API keys, set your career profile, adjust theme preferences, and manage plugins. Supports 13 AI providers including OpenAI, Claude, Gemini, Groq, Ollama, and more.",
  keywords: [
    "career OS settings", "AI provider config", "API key management", "openai settings",
    "claude settings", "gemini settings", "groq settings", "career profile settings",
  ],
  robots: { index: false, follow: false },
  alternates: { canonical: "/settings" },
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
