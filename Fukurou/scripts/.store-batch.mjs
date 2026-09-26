#!/usr/bin/env node
/** Store chunks from JSON array: [{part, chunkIdx, d}, ...] */
import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const chunks = JSON.parse(process.argv[2] || "[]");
for (const { part, chunkIdx, d } of chunks) {
  execSync(`node "${path.join(__dirname, "store-chunk.mjs")}" ${part} ${chunkIdx} "${d}"`, { stdio: "inherit" });
}
