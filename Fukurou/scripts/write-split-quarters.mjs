#!/usr/bin/env node
/** One-off: write q1–q3 b64 from split MCP export halves */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const splits = JSON.parse(fs.readFileSync(path.join(__dirname, ".quarter-splits.json"), "utf8"));

for (const [part, { a, b }] of Object.entries(splits)) {
  const b64 = a + b;
  fs.writeFileSync(path.join(__dirname, `.token-export-q${part}.b64`), b64);
  const n = Object.keys(JSON.parse(Buffer.from(b64, "base64").toString("utf8")).tokens).length;
  console.log(`q${part}: ${n} tokens, ${b64.length} b64 chars`);
}
