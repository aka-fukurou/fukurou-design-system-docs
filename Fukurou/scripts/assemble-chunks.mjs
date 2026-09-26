#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(path.join(__dirname, ".chunk-export.json"), "utf8"));

for (const [part, chunks] of Object.entries(data)) {
  const b64 = chunks.join("");
  fs.writeFileSync(path.join(__dirname, `.token-export-q${part}.b64`), b64);
  const n = Object.keys(JSON.parse(Buffer.from(b64, "base64").toString("utf8")).tokens).length;
  console.log(`q${part}: ${n} tokens`);
}
