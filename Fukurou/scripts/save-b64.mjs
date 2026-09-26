#!/usr/bin/env node
/** Write joined quarter export: node save-b64.mjs <part> < base64.txt */
import fs from "fs";
const part = process.argv[2];
if (part == null) {
  console.error("usage: save-b64.mjs <part> < base64.txt");
  process.exit(1);
}
const b64 = fs.readFileSync(0, "utf8").trim();
fs.writeFileSync(`.token-export-q${part}.b64`, b64);
const n = Object.keys(JSON.parse(Buffer.from(b64, "base64").toString("utf8")).tokens).length;
console.log(`wrote q${part}.b64 (${n} tokens, ${b64.length} chars)`);
