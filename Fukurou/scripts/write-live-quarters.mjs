#!/usr/bin/env node
/** Write .token-export-q*.b64 from .incoming/live-q*.json (MCP export payloads) */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
for (let i = 0; i < 4; i++) {
  const src = path.join(dir, '.incoming', `live-q${i}.json`);
  const { b64, tokenCount } = JSON.parse(fs.readFileSync(src, 'utf8'));
  fs.writeFileSync(path.join(dir, `.token-export-q${i}.b64`), b64);
  const n = Object.keys(JSON.parse(Buffer.from(b64, 'base64').toString('utf8')).tokens).length;
  console.log(`q${i}: wrote ${n} tokens (expected ${tokenCount})`);
}
