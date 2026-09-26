#!/usr/bin/env node
/** Convert use_figma quarter export objects → export-pN.json, process, merge */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input = process.argv[2] || path.join(__dirname, ".latest-mcp-exports.json");
const quarters = JSON.parse(fs.readFileSync(input, "utf8"));

for (const q of quarters) {
  const out = path.join(__dirname, `export-p${q.part}.json`);
  fs.writeFileSync(out, JSON.stringify(q));
  console.log(`Wrote ${path.basename(out)} — ${q.tokenCount} tokens`);
}

for (let i = 0; i < 4; i++) {
  execSync(`node "${path.join(__dirname, "process-quarter-export.mjs")}" export-p${i}.json`, {
    stdio: "inherit",
    cwd: __dirname,
  });
}
execSync(`node "${path.join(__dirname, "merge-quarters.mjs")}"`, { stdio: "inherit", cwd: __dirname });
