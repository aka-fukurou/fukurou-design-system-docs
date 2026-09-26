#!/usr/bin/env node
/** Persist eighth MCP exports from argv JSON files into tokens.json */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const parts = process.argv.slice(2).map((f) => JSON.parse(fs.readFileSync(f, "utf8")));

const tokens = {};
for (const p of parts) Object.assign(tokens, p.tokens);

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
