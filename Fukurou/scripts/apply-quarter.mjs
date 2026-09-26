#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(0, "utf8"));
const { part, chunks, tokenCount } = data;
const chunkDir = path.join(__dirname, ".chunks");
fs.mkdirSync(chunkDir, { recursive: true });
for (let i = 0; i < chunks.length; i++) {
  const f = path.join(chunkDir, `p${part}-c${i}.txt`);
  fs.writeFileSync(f, chunks[i]);
  console.log(`stored ${f} (${chunks[i].length} chars)`);
}
const b64 = chunks.join("");
fs.writeFileSync(path.join(__dirname, `.token-export-q${part}.b64`), b64);
const n = Object.keys(JSON.parse(Buffer.from(b64, "base64").toString("utf8")).tokens).length;
console.log(`q${part}: ${n} tokens (${tokenCount} expected)`);
