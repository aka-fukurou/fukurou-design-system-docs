#!/usr/bin/env node
/** Persist inline quarter chunk exports → store-chunk.mjs → .token-export-qN.b64 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const inputs = process.argv.slice(2);
if (!inputs.length) {
  console.error("usage: persist-mcp-inline.mjs <inline-q0.json> [inline-q1.json ...]");
  process.exit(1);
}

fs.mkdirSync(path.join(__dirname, ".chunks"), { recursive: true });
let total = 0;
for (const file of inputs) {
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  const { part, chunks, tokenCount } = data;
  for (let i = 0; i < chunks.length; i++) {
    execSync(`node "${path.join(__dirname, "store-chunk.mjs")}" ${part} ${i} "${chunks[i]}"`, {
      stdio: "pipe",
    });
    console.log(`stored p${part}-c${i} (${chunks[i].length} chars)`);
  }
  const b64 = chunks.join("");
  fs.writeFileSync(path.join(__dirname, `.token-export-q${part}.b64`), b64);
  const n = Object.keys(JSON.parse(Buffer.from(b64, "base64").toString("utf8")).tokens).length;
  console.log(`q${part}: ${n} tokens (${tokenCount} expected)`);
  total += n;
}
console.log(`total: ${total} tokens`);
