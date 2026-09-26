#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p1 = JSON.parse(fs.readFileSync(path.join(__dirname, ".token-export-part1.json"), "utf8"));
const p2 = JSON.parse(fs.readFileSync(path.join(__dirname, ".token-export-part2.json"), "utf8"));
const tokens = { ...p1.tokens, ...p2.tokens };
const count = Object.keys(tokens).length;

const out = {
  _comment:
    "Resolved token values extracted from the live Figma file Fukurou Design System (file key FNLHeDQrr7JKBj81Qg7L7a) via the Figma Variables API. Alias resolution across Foundation -> Theme -> Component tiers was performed against the live variables; values below are the FINAL resolved colors per theme mode. The Figma file in Fukurou/ is the source of truth (see ACCESSIBILITY_AUDIT.md 'Audit Method').",
  _brand: { primary: "#D33F55", secondary: "#231F20" },
  exportedAt: new Date().toISOString(),
  tokenCount: count,
  tokens: Object.fromEntries(Object.keys(tokens).sort().map((n) => [n, tokens[n]])),
};

fs.writeFileSync(path.join(__dirname, "tokens.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote tokens.json — ${count} tokens`);
