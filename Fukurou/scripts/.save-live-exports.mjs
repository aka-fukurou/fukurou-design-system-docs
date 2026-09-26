#!/usr/bin/env node
/** One-shot: write export-p0..p3 from latest parallel use_figma MCP results, then process + merge */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const exports = JSON.parse(
  fs.readFileSync(path.join(__dirname, ".latest-mcp-exports.json"), "utf8")
);

for (const e of exports) {
  const out = path.join(__dirname, `export-p${e.part}.json`);
  fs.writeFileSync(out, JSON.stringify(e));
  console.log(`Wrote ${path.basename(out)} — ${e.tokenCount} tokens`);
}

for (let i = 0; i < 4; i++) {
  execSync(`node "${path.join(__dirname, "process-quarter-export.mjs")}" export-p${i}.json`, {
    stdio: "inherit",
    cwd: __dirname,
  });
}
execSync(`node "${path.join(__dirname, "merge-quarters.mjs")}"`, { stdio: "inherit", cwd: __dirname });
