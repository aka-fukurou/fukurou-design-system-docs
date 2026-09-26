#!/usr/bin/env node
/** Write .token-export-qN.b64 from MCP quarter export JSON on stdin */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const input = JSON.parse(fs.readFileSync(0, "utf8"));
const part = input.part;
const b64 = input.chunks.join("");
const out = path.join(__dirname, `.token-export-q${part}.b64`);
fs.writeFileSync(out, b64);
const n = Object.keys(JSON.parse(Buffer.from(b64, "base64").toString("utf8")).tokens).length;
console.log(`Wrote ${out} — ${n} tokens, ${input.totalChunks} chunks`);
