#!/usr/bin/env node
/** Persist MCP export: node persist-mcp-b64.mjs <part> reads b64 from stdin */
import fs from 'fs';
const part = process.argv[2];
const b64 = fs.readFileSync(0, 'utf8').trim();
fs.writeFileSync(`.token-export-q${part}.b64`, b64);
const n = Object.keys(JSON.parse(Buffer.from(b64, 'base64').toString('utf8')).tokens).length;
console.log(`q${part}: ${n} tokens`);
