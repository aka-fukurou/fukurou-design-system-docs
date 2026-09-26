#!/usr/bin/env node
/** Bulk store export chunks: node bulk-store-export.mjs export-pN.json */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input = process.argv[2];
if (!input) {
  console.error("usage: bulk-store-export.mjs export-pN.json");
  process.exit(1);
}
const { part, chunks } = JSON.parse(fs.readFileSync(input, "utf8"));
const dir = path.join(__dirname, ".chunks");
fs.mkdirSync(dir, { recursive: true });
chunks.forEach((c, i) => {
  fs.writeFileSync(path.join(dir, `p${part}-c${i}.txt`), c);
});
console.log(`stored p${part} ${chunks.length} chunks`);
