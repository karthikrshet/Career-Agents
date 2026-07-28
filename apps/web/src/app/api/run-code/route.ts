// apps/web/src/app/api/run-code/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { language, code } = await req.json();

    if (!language || !code) {
      return NextResponse.json({ success: false, error: "Language and code content are required." }, { status: 400 });
    }

    if (code.length > 8192) {
      return NextResponse.json({ success: false, error: "Code content exceeds the maximum size limit of 8KB." }, { status: 400 });
    }

    // Map user language ids to Piston API language ids
    const languageMapping: Record<string, string> = {
      javascript: "javascript",
      typescript: "typescript",
      python: "python",
      java: "java",
      go: "go",
      rust: "rust",
      cpp: "cpp"
    };

    const pistonLang = languageMapping[language.toLowerCase()];
    if (!pistonLang) {
      return NextResponse.json({ success: false, error: `Language "${language}" is not supported for execution.` }, { status: 400 });
    }

    const payload = {
      language: pistonLang,
      version: "*",
      files: [
        {
          content: code
        }
      ]
    };

    const { secureFetch } = await import("packages/security");
    const res = await secureFetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      allowedProvider: "piston"
    });

    if (!res.ok) {
      const errMsg = await res.text();
      return NextResponse.json({ success: false, error: `Piston execution engine failed: ${errMsg.slice(0, 150)}` }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({
      success: true,
      stdout: data.run?.stdout || "",
      stderr: data.run?.stderr || "",
      code: data.run?.code ?? 0,
      signal: data.run?.signal || null,
      output: data.run?.output || "",
      compileLogs: data.compile?.output || data.compile?.stderr || "",
      executionTime: data.run?.time ? `${(data.run.time * 1000).toFixed(1)}ms` : "N/A",
      memory: data.run?.memory ? `${(data.run.memory / 1024 / 1024).toFixed(2)}MB` : "N/A",
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Failed to execute code" }, { status: 500 });
  }
}
