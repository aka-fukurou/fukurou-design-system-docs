#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, ".chunks");
fs.mkdirSync(dir, { recursive: true });
const chunks = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
for (const { part, chunkIdx, d } of chunks) {
  const f = path.join(dir, `p${part}-c${chunkIdx}.txt`);
  fs.writeFileSync(f, d);
  console.log(`stored ${f} (${d.length} chars)`);
}
