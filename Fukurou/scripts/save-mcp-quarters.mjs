#!/usr/bin/env node
/** Save quarter token exports from .mcp-quarter-*.json → .quarter-tokens/qN.json */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, ".quarter-tokens");
fs.mkdirSync(dir, { recursive: true });

for (let part = 0; part < 4; part++) {
  const src = path.join(__dirname, `.mcp-quarter-${part}.json`);
  const data = JSON.parse(fs.readFileSync(src, "utf8"));
  const out = path.join(dir, `q${part}.json`);
  fs.writeFileSync(out, JSON.stringify(data));
  console.log(`saved ${out} — ${data.tokenCount} tokens`);
}
