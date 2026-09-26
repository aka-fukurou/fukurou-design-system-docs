#!/usr/bin/env node
/** Assemble .chunks/p*-c*.txt → .token-export-qN.b64 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chunkDir = path.join(__dirname, ".chunks");

for (let part = 0; part < 4; part++) {
  const files = fs
    .readdirSync(chunkDir)
    .filter((f) => f.startsWith(`p${part}-c`) && f.endsWith(".txt"))
    .sort((a, b) => {
      const ai = parseInt(a.match(/c(\d+)/)[1], 10);
      const bi = parseInt(b.match(/c(\d+)/)[1], 10);
      return ai - bi;
    });
  if (!files.length) continue;
  const b64 = files.map((f) => fs.readFileSync(path.join(chunkDir, f), "utf8")).join("");
  fs.writeFileSync(path.join(__dirname, `.token-export-q${part}.b64`), b64);
  const n = Object.keys(JSON.parse(Buffer.from(b64, "base64").toString("utf8")).tokens).length;
  console.log(`q${part}: ${n} tokens from ${files.length} chunks`);
}
