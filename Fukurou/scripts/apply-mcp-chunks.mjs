#!/usr/bin/env node
/** Apply MCP chunk results via store-chunk.mjs */
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = process.argv[2];
if (!file) {
  console.error("usage: apply-mcp-chunks.mjs <results.json>");
  process.exit(1);
}
const chunks = JSON.parse(fs.readFileSync(file, "utf8"));
for (const { part, chunkIdx, d } of chunks) {
  execSync(`node "${path.join(__dirname, "store-chunk.mjs")}" ${part} ${chunkIdx} "${d}"`, {
    stdio: "inherit",
  });
}
