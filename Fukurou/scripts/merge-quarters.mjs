#!/usr/bin/env node
/** Merge 4 quarter base64 exports from use_figma → scripts/tokens.json */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = __dirname;

const tokens = {};
for (let i = 0; i < 4; i++) {
  const b64Path = path.join(dir, `.token-export-q${i}.b64`);
  if (!fs.existsSync(b64Path)) {
    console.error(`Missing ${b64Path}`);
    process.exit(1);
  }
  const b64 = fs.readFileSync(b64Path, "utf8").trim();
  const chunk = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  Object.assign(tokens, chunk.tokens);
}

const count = Object.keys(tokens).length;
const out = {
  _comment:
    "Resolved token values extracted from the live Figma file Fukurou Design System (file key FNLHeDQrr7JKBj81Qg7L7a) via the Figma Variables API. Alias resolution across Foundation -> Theme -> Component tiers was performed against the live variables; values below are the FINAL resolved colors per theme mode. The Figma file in Fukurou/ is the source of truth (see ACCESSIBILITY_AUDIT.md 'Audit Method').",
  _brand: { primary: "#D33F55", secondary: "#231F20" },
  exportedAt: new Date().toISOString(),
  tokenCount: count,
  tokens: Object.fromEntries(Object.keys(tokens).sort().map((n) => [n, tokens[n]])),
};

fs.writeFileSync(path.join(dir, "tokens.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`Wrote tokens.json — ${count} tokens (expected 505)`);
if (count !== 505) process.exitCode = 1;
