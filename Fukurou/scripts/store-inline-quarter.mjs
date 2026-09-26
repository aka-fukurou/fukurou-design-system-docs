#!/usr/bin/env node
/** Store one quarter's inline chunks via store-chunk.mjs */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const { part, chunks } = data;
for (let i = 0; i < chunks.length; i++) {
  execSync(`node "${path.join(__dirname, "store-chunk.mjs")}" ${part} ${i} "${chunks[i]}"`, {
    stdio: "pipe",
  });
  console.log(`stored p${part}-c${i} (${chunks[i].length} chars)`);
}
const b64 = chunks.join("");
fs.writeFileSync(path.join(__dirname, `.token-export-q${part}.b64`), b64);
const n = Object.keys(JSON.parse(Buffer.from(b64, "base64").toString("utf8")).tokens).length;
console.log(`q${part}: ${n} tokens from ${chunks.length} chunks`);
