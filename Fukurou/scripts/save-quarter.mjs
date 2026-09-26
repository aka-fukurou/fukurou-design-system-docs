#!/usr/bin/env node
/** Save quarter export from stdin JSON → .quarter-tokens/qN.json */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const part = process.argv[2];
if (part == null) {
  console.error("usage: save-quarter.mjs <part> < export.json");
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(0, "utf8"));
const dir = path.join(__dirname, ".quarter-tokens");
fs.mkdirSync(dir, { recursive: true });
const out = path.join(dir, `q${part}.json`);
fs.writeFileSync(out, JSON.stringify(data));
console.log(`saved ${out} — ${data.tokenCount} tokens`);
