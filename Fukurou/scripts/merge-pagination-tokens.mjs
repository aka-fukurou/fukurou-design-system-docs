import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "tokens.json");
const data = JSON.parse(fs.readFileSync(file, "utf8"));
const T = data.tokens;

const aliasMap = {
  "color/pagination/item/background/default": "color/surface/page",
  "color/pagination/item/background/hover": "color/surface/card",
  "color/pagination/item/background/active": "color/action/primary/default",
  "color/pagination/item/background/disabled": "color/surface/subtle",
  "color/pagination/item/text/default": "color/text/default",
  "color/pagination/item/text/hover": "color/text/default",
  "color/pagination/item/text/active": "color/text/inverse",
  "color/pagination/item/text/disabled": "color/text/disabled",
  "color/pagination/item/border/default": "color/border/default",
  "color/pagination/item/border/hover": "color/border/control/hover",
  "color/pagination/item/border/active": "color/action/primary/default",
  "color/pagination/item/border/focus": "color/border/focus",
  "color/pagination/item/border/disabled": "color/border/control/disabled",
  "color/pagination/focus/ring": "color/border/focus",
  "color/pagination/focus/gap": "color/surface/page",
  "color/pagination/control/background/default": "color/surface/page",
  "color/pagination/control/background/hover": "color/pagination/item/background/hover",
  "color/pagination/control/background/disabled": "color/surface/subtle",
  "color/pagination/control/text/default": "color/text-button/text/default",
  "color/pagination/control/text/hover": "color/text-button/text/hover",
  "color/pagination/control/text/disabled": "color/text-button/text/disabled",
  "color/pagination/control/border/default": "color/border/subtle",
  "color/pagination/control/border/hover": "color/border/control/hover",
  "color/pagination/ellipsis/text/default": "color/text/subtle",
};

for (const [name, target] of Object.entries(aliasMap)) {
  const src = T[target];
  if (!src) throw new Error(`Missing alias target ${target} for ${name}`);
  T[name] = { ...src };
}

const names = Object.keys(T).sort();
const sorted = {};
for (const n of names) sorted[n] = T[n];
data.tokens = sorted;
data.tokenCount = names.length;
data.exportedAt = new Date().toISOString();
fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
console.log("tokens.json:", names.length, "tokens,", Object.keys(aliasMap).length, "pagination entries added");
