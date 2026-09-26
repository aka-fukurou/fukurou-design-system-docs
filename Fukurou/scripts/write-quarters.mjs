#!/usr/bin/env node
/** Write quarter JSON files from MCP export results file */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = process.argv[2];
if (!file) {
  console.error("usage: write-quarters.mjs <quarters.json>");
  process.exit(1);
}
const quarters = JSON.parse(fs.readFileSync(file, "utf8"));
const dir = path.join(__dirname, ".quarter-tokens");
fs.mkdirSync(dir, { recursive: true });
for (const q of quarters) {
  const out = path.join(dir, `q${q.part}.json`);
  fs.writeFileSync(out, JSON.stringify(q));
  console.log(`wrote ${out} — ${q.tokenCount} tokens`);
}
