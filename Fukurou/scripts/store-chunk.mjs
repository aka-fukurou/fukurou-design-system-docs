#!/usr/bin/env node
/** Append one base64 chunk: node store-chunk.mjs <part> <chunkIdx> <d> */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const part = process.argv[2];
const chunkIdx = process.argv[3];
const d = process.argv[4];
if (part == null || chunkIdx == null || !d) {
  console.error("usage: store-chunk.mjs <part> <chunkIdx> <d>");
  process.exit(1);
}
const dir = path.join(__dirname, ".chunks");
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `p${part}-c${chunkIdx}.txt`);
fs.writeFileSync(file, d);
console.log(`stored ${file} (${d.length} chars)`);
