#!/usr/bin/env node
/**
 * Persist quarter exports from use_figma MCP (run after fetching q0–q3).
 * Reads .mcp-quarter-{0,1,2,3}.json then runs build-from-quarters.mjs.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, ".quarter-tokens");
fs.mkdirSync(dir, { recursive: true });

let total = 0;
for (let p = 0; p < 4; p++) {
  const src = path.join(__dirname, `.mcp-quarter-${p}.json`);
  if (!fs.existsSync(src)) {
    console.error(`Missing ${src}`);
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(src, "utf8"));
  const out = path.join(dir, `q${p}.json`);
  fs.writeFileSync(out, JSON.stringify(data));
  total += data.tokenCount;
  console.log(`wrote ${out} — ${data.tokenCount} tokens`);
}
console.log(`total: ${total} tokens`);
execSync(`node "${path.join(__dirname, "build-from-quarters.mjs")}"`, { stdio: "inherit" });
