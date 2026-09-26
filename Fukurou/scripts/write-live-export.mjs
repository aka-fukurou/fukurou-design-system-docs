#!/usr/bin/env node
/** Write quarter b64 files from JSON: { "0": "<b64>", ... } */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input = process.argv[2] || path.join(__dirname, "live-export-b64.json");
const data = JSON.parse(fs.readFileSync(input, "utf8"));
for (const [part, b64] of Object.entries(data)) {
  fs.writeFileSync(path.join(__dirname, `.token-export-q${part}.b64`), b64);
  const n = Object.keys(JSON.parse(Buffer.from(b64, "base64").toString("utf8")).tokens).length;
  console.log(`q${part}: ${n} tokens`);
}
