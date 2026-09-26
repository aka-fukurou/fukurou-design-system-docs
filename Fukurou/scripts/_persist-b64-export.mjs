#!/usr/bin/env node
/** Persist live MCP b64 quarter exports → tokens.json */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input = path.join(__dirname, ".live-b64-export.json");
const quarters = JSON.parse(fs.readFileSync(input, "utf8"));

const tokens = {};
for (const { part, b64 } of quarters) {
  fs.writeFileSync(path.join(__dirname, `.token-export-q${part}.b64`), b64);
  const chunk = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  Object.assign(tokens, chunk.tokens);
}

const names = Object.keys(tokens).sort();
const count = names.length;

const out = {
  _comment:
    "Resolved token values extracted from the live Figma file Fukurou Design System (file key FNLHeDQrr7JKBj81Qg7L7a) via the Figma Variables API. Alias resolution across Foundation -> Theme -> Component tiers was performed against the live variables; values below are the FINAL resolved colors per theme mode. The Figma file in Fukurou/ is the source of truth (see ACCESSIBILITY_AUDIT.md 'Audit Method').",
  _brand: { primary: "#D33F55", secondary: "#231F20" },
  exportedAt: new Date().toISOString(),
  tokenCount: count,
  tokens: Object.fromEntries(names.map((n) => [n, tokens[n]])),
};

const dest = path.join(__dirname, "tokens.json");
fs.writeFileSync(dest, JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote ${dest} — ${count} tokens`);
