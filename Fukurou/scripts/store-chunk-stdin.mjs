#!/usr/bin/env node
/** store-chunk from stdin: node store-chunk-stdin.mjs <part> <chunkIdx> < d.txt */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const part = process.argv[2];
const chunkIdx = process.argv[3];
const d = fs.readFileSync(0, "utf8").trim();
const dir = path.join(__dirname, ".chunks");
fs.mkdirSync(dir, { recursive: true });
const file = path.join(dir, `p${part}-c${chunkIdx}.txt`);
fs.writeFileSync(file, d);
console.log(`stored ${file} (${d.length} chars)`);
