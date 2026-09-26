#!/usr/bin/env node
/** Save inline quarter export chunks from latest use_figma export run */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const exportPath = path.join(__dirname, ".latest-export.json");
if (!fs.existsSync(exportPath)) {
  console.error("Missing .latest-export.json");
  process.exit(1);
}
const exports = JSON.parse(fs.readFileSync(exportPath, "utf8"));
const chunkDir = path.join(__dirname, ".chunks");
if (fs.existsSync(chunkDir)) {
  for (const f of fs.readdirSync(chunkDir)) fs.unlinkSync(path.join(chunkDir, f));
} else {
  fs.mkdirSync(chunkDir, { recursive: true });
}

for (const { part, chunks } of exports) {
  for (let i = 0; i < chunks.length; i++) {
    fs.writeFileSync(path.join(chunkDir, `p${part}-c${i}.txt`), chunks[i]);
    console.log(`stored p${part}-c${i} (${chunks[i].length} chars)`);
  }
}

execSync(`node "${path.join(__dirname, "assemble-stored-chunks.mjs")}"`, { stdio: "inherit" });
execSync(`node "${path.join(__dirname, "merge-quarters.mjs")}"`, { stdio: "inherit" });
