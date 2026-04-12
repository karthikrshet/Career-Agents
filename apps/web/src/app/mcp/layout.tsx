import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MCP Server — Model Context Protocol Configuration",
  description:
    "Configure Career OS as an MCP (Model Context Protocol) server. Generate client config files for Cursor, Claude Desktop, VS Code, Windsurf, Cline, RooCode, OpenHands, Bolt, and Aider.",
  keywords: [
    "MCP server", "model context protocol", "cursor MCP", "claude desktop MCP",
    "VS code MCP", "windsurf MCP", "career agents MCP", "AI tools MCP config",
  ],
  openGraph: {
    title: "Career OS MCP Server — Model Context Protocol Config",
    description: "Connect 146 career agents to any MCP-compatible AI client. Generate configs for Cursor, Claude Desktop, VS Code, and more.",
    url: "/mcp",
  },
  alternates: { canonical: "/mcp" },
};

export default function McpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
