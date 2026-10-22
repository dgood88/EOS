// Builds EOS into dist/: copies public/ as-is, then bundles src/main.jsx to dist/app.js
// as a single IIFE (same shape as the original drag-and-drop deploy).
import * as esbuild from "esbuild";
import { cpSync, mkdirSync, rmSync } from "node:fs";

const serve = process.argv.includes("--serve");
rmSync("dist", { recursive: true, force: true });
mkdirSync("dist", { recursive: true });
cpSync("public", "dist", { recursive: true });

const opts = {
  entryPoints: ["src/main.jsx"],
  outfile: "dist/app.js",
  bundle: true,
  format: "iife",
  minify: true,
  target: ["safari15", "chrome100"],
  jsx: "transform",
  loader: { ".woff": "file", ".woff2": "file" },
  assetNames: "fonts/[name]-[hash]",
  define: { "process.env.NODE_ENV": '"production"' },
  logLevel: "info",
};

if (serve) {
  const ctx = await esbuild.context(opts);
  await ctx.watch();
  const { port } = await ctx.serve({ servedir: "dist", port: 5173 });
  console.log(`EOS dev server on http://localhost:${port}`);
} else {
  await esbuild.build(opts);
}
