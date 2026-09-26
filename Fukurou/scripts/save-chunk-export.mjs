#!/usr/bin/env node
/** Save MCP chunk responses → .token-export-qN.b64 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chunksFile = process.argv[2] || path.join(__dirname, ".chunk-export.json");
const data = JSON.parse(fs.readFileSync(chunksFile, "utf8"));

for (const [part, chunks] of Object.entries(data)) {
  const b64 = chunks.join("");
  const outPath = path.join(__dirname, `.token-export-q${part}.b64`);
  fs.writeFileSync(outPath, b64);
  const n = Object.keys(JSON.parse(Buffer.from(b64, "base64").toString("utf8")).tokens).length;
  console.log(`q${part}: ${n} tokens, ${b64.length} b64 chars → ${outPath}`);
}
