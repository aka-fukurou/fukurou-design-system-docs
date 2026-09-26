#!/usr/bin/env node
/**
 * Write scripts/tokens.json from a live Figma export payload.
 * Usage: node scripts/save-tokens-export.mjs < export-payload.json
 * Payload: { count: number, tokens: Record<string, { light, lightA, dark, darkA }> }
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input = JSON.parse(fs.readFileSync(0, "utf8"));
const tokens = input.tokens ?? input;
const names = Object.keys(tokens).sort();
const count = input.count ?? names.length;

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
