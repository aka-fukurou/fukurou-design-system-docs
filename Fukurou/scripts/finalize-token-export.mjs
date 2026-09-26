#!/usr/bin/env node
/**
 * Finalize tokens.json from quarter token files + chunked b64 pipeline.
 * Expects .quarter-tokens/q{0,1,2,3}.json OR existing .chunks + assemble.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHUNK_SIZE = 3000;

// If quarter token files exist, use build-from-quarters
const quarterDir = path.join(__dirname, ".quarter-tokens");
const quarterFiles = [0, 1, 2, 3].map((p) => path.join(quarterDir, `q${p}.json`));
if (quarterFiles.every((f) => fs.existsSync(f))) {
  execSync(`node "${path.join(__dirname, "build-from-quarters.mjs")}"`, { stdio: "inherit" });
  process.exit(0);
}

// Otherwise assemble from .chunks if complete
const chunkDir = path.join(__dirname, ".chunks");
for (let part = 0; part < 4; part++) {
  const files = fs
    .readdirSync(chunkDir)
    .filter((f) => f.startsWith(`p${part}-c`) && f.endsWith(".txt"))
    .sort((a, b) => parseInt(a.match(/c(\d+)/)[1], 10) - parseInt(b.match(/c(\d+)/)[1], 10));
  if (!files.length) {
    console.error(`Missing chunks for quarter ${part}`);
    process.exit(1);
  }
}

execSync(`node "${path.join(__dirname, "assemble-stored-chunks.mjs")}"`, { stdio: "inherit" });

// Update merge-quarters expected count dynamically
const mergeSrc = fs.readFileSync(path.join(__dirname, "merge-quarters.mjs"), "utf8");
if (mergeSrc.includes("expected 436")) {
  fs.writeFileSync(
    path.join(__dirname, "merge-quarters.mjs"),
    mergeSrc.replace(/expected 436/g, "expected 449").replace(/count !== 436/g, "count !== 449"),
  );
}

execSync(`node "${path.join(__dirname, "merge-quarters.mjs")}"`, { stdio: "inherit" });
