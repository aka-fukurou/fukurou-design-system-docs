#!/usr/bin/env node
/** Store inline quarter chunks via store-chunk.mjs, then assemble + merge */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exports = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const chunkDir = path.join(__dirname, ".chunks");
fs.mkdirSync(chunkDir, { recursive: true });

for (const { part, chunks } of exports) {
  for (let i = 0; i < chunks.length; i++) {
    execSync(`node "${path.join(__dirname, "store-chunk.mjs")}" ${part} ${i} "${chunks[i]}"`, {
      stdio: "pipe",
    });
    console.log(`stored p${part}-c${i} (${chunks[i].length} chars)`);
  }
}

execSync(`node "${path.join(__dirname, "assemble-stored-chunks.mjs")}"`, { stdio: "inherit" });
execSync(`node "${path.join(__dirname, "merge-quarters.mjs")}"`, { stdio: "inherit" });
