// Render review stills for several scenes with a single bundle.
// Usage: node scripts/stills.mjs S02:120,300 S03:150 ...
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const browserExecutable = "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell";
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
for (const arg of process.argv.slice(2)) {
  const [id, frames] = arg.split(":");
  const composition = await selectComposition({ serveUrl, id, browserExecutable });
  for (const f of frames.split(",").map(Number)) {
    const output = `out/stills/${id}_f${f}.jpg`;
    await renderStill({ composition, serveUrl, output, frame: f, imageFormat: "jpeg", jpegQuality: 88, browserExecutable });
    console.log("ok", output);
  }
}
