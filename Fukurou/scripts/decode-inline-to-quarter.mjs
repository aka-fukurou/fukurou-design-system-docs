#!/usr/bin/env node
/** Decode inline chunk export JSON → .quarter-tokens/qN.json */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const b64 = data.chunks.join("");
const { tokens } = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
const dir = path.join(__dirname, ".quarter-tokens");
fs.mkdirSync(dir, { recursive: true });
const out = path.join(dir, `q${data.part}.json`);
fs.writeFileSync(out, JSON.stringify({ part: data.part, tokenCount: data.tokenCount, tokens }));
const n = Object.keys(tokens).length;
console.log(`wrote ${out} — ${n} tokens (${data.tokenCount} expected)`);
