#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
const file = process.argv[2];
if (!file) { console.error('usage: run-figma-script.mjs <script.js>'); process.exit(1); }
const code = fs.readFileSync(file, 'utf8').replace(/^\/\/[^\n]*\n/, '');
process.stdout.write(JSON.stringify({ code, fileKey: 'FNLHeDQrr7JKBj81Qg7L7a', skillNames: 'figma-use,figma-generate-library' }));
