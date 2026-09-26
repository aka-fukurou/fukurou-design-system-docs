#!/usr/bin/env node
/** node store-mcp-export.mjs <part> — read use_figma export JSON from stdin → export-pN.json */
import fs from 'fs';
const part = Number(process.argv[2]);
const data = JSON.parse(fs.readFileSync(0, 'utf8'));
if (data.part === undefined) data.part = part;
fs.writeFileSync(`export-p${part}.json`, JSON.stringify(data));
console.log(`Wrote export-p${part}.json — ${data.tokenCount} tokens, ${data.chunks.length} chunks`);
