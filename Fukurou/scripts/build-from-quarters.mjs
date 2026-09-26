#!/usr/bin/env node
/** Merge quarter token exports, write tokens.json + chunked .b64 files */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CHUNK_SIZE = 3000;
const chunkDir = path.join(__dirname, ".chunks");
fs.mkdirSync(chunkDir, { recursive: true });

const allTokens = {};
for (let part = 0; part < 4; part++) {
  const f = path.join(__dirname, `.quarter-tokens/q${part}.json`);
  const { tokens } = JSON.parse(fs.readFileSync(f, "utf8"));
  Object.assign(allTokens, tokens);

  const json = JSON.stringify({ tokens });
  const b64 = Buffer.from(json, "utf8").toString("base64");
  const totalChunks = Math.ceil(b64.length / CHUNK_SIZE);
  for (let i = 0; i < totalChunks; i++) {
    const d = b64.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    const chunkFile = path.join(chunkDir, `p${part}-c${i}.txt`);
    fs.writeFileSync(chunkFile, d);
    execSync(`node "${path.join(__dirname, "store-chunk.mjs")}" ${part} ${i} "${d}"`, { stdio: "pipe" });
  }
  fs.writeFileSync(path.join(__dirname, `.token-export-q${part}.b64`), b64);
  console.log(`q${part}: ${Object.keys(tokens).length} tokens, ${totalChunks} chunks`);
}

const count = Object.keys(allTokens).length;
const out = {
  _comment:
    "Resolved token values extracted from the live Figma file Fukurou Design System (file key FNLHeDQrr7JKBj81Qg7L7a) via the Figma Variables API. Alias resolution across Foundation -> Theme -> Component tiers was performed against the live variables; values below are the FINAL resolved colors per theme mode. The Figma file in Fukurou/ is the source of truth (see ACCESSIBILITY_AUDIT.md 'Audit Method').",
  _brand: { primary: "#D33F55", secondary: "#231F20" },
  exportedAt: new Date().toISOString(),
  tokenCount: count,
  tokens: Object.fromEntries(Object.keys(allTokens).sort().map((n) => [n, allTokens[n]])),
};
fs.writeFileSync(path.join(__dirname, "tokens.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote tokens.json — ${count} tokens`);
