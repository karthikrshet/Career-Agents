// apps/chrome-extension/build.js
import fs from "fs";
import path from "path";
import { build as viteBuild } from "vite";
import { build as esbuildBuild, context as esbuildContext } from "esbuild";

const watchMode = process.argv.includes("--watch") || process.argv.includes("-w");

async function build() {
  console.log("🧹 Cleaning dist directory...");
  fs.rmSync("dist", { recursive: true, force: true });
  fs.mkdirSync("dist", { recursive: true });

  console.log("📦 Copying manifest.json...");
  fs.copyFileSync("manifest.json", "dist/manifest.json");

  // Copy icons if public folder exists, or ensure a public folder works
  if (fs.existsSync("public")) {
    fs.cpSync("public", "dist", { recursive: true });
  }

  console.log("⚡ Building React UI applications (Vite)...");
  await viteBuild({
    configFile: "./vite.config.ts"
  });

  const esbuildOpts = (entry, outfile) => ({
    entryPoints: [entry],
    outfile: outfile,
    bundle: true,
    minify: !watchMode,
    sourcemap: watchMode ? "inline" : false,
    platform: "browser",
    target: ["chrome100"],
    format: "iife", // Self-executing bundle suitable for standard extensions
  });

  if (watchMode) {
    console.log("👀 Starting watch mode compiler...");
    const bgCtx = await esbuildContext(esbuildOpts("src/background/background.ts", "dist/background.js"));
    const ctCtx = await esbuildContext(esbuildOpts("src/content/content.ts", "dist/content.js"));
    
    await bgCtx.watch();
    await ctCtx.watch();
    console.log("🚀 Watching service worker and content scripts for changes...");
  } else {
    console.log("🔨 Compiling background service worker...");
    await esbuildBuild(esbuildOpts("src/background/background.ts", "dist/background.js"));

    console.log("🔨 Compiling content scripts...");
    await esbuildBuild(esbuildOpts("src/content/content.ts", "dist/content.js"));
    console.log("🎉 Production packaging complete!");
  }
}

build().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
