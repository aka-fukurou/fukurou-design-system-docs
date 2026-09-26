#!/usr/bin/env node
import fs from 'fs';
const part = process.argv[2];
const src = process.argv[3];
if (!part || !src) {
  console.error('usage: save-part-b64.mjs <part> <b64-file>');
  process.exit(1);
}
const b64 = fs.readFileSync(src, 'utf8').trim();
fs.writeFileSync(`.token-export-q${part}.b64`, b64);
const n = Object.keys(JSON.parse(Buffer.from(b64, 'base64').toString('utf8')).tokens).length;
console.log(`q${part}: ${n} tokens, ${b64.length} chars`);
