/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./popup.html", "./options.html", "./sidepanel.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#070d1f",
        card: "rgba(13, 22, 47, 0.65)",
        border: "rgba(59, 130, 246, 0.2)",
        primary: {
          DEFAULT: "#3b82f6",
          hover: "#2563eb",
        },
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        foreground: "#f1f5f9",
        muted: "#94a3b8",
      },
    },
  },
  plugins: [],
};
