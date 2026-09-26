// use_figma — Textarea + Pagination component tokens (3. Component + 2. Density)
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function getCol(name) { return figma.variables.getLocalVariableCollections().find(function (c) { return c.name === name; }); }

var cCol = getCol("3. Component");
var dCol = getCol("2. Density");
var cMode = cCol.modes[0].modeId;
var created = [];

function upComp(name, target, scopes) {
  var v = gv(name);
  var t = gv(target);
  if (!t) return { name: name, error: "missing " + target };
  if (!v) { v = figma.variables.createVariable(name, cCol, "COLOR"); v.scopes = scopes || ["ALL_SCOPES"]; }
  v.setValueForMode(cMode, { type: "VARIABLE_ALIAS", id: t.id });
  return { name: name };
}

var BG = ["FRAME_FILL", "SHAPE_FILL"];
var BORDER = ["STROKE_COLOR"];
var TEXT = ["TEXT_FILL"];

// Textarea — mirrors Text Field mappings per spec
[
  ["color/textarea/background/default", "color/surface/card", BG],
  ["color/textarea/background/hover", "color/surface/card", BG],
  ["color/textarea/background/focus", "color/surface/card", BG],
  ["color/textarea/background/filled", "color/textarea/background/default", BG],
  ["color/textarea/background/error", "color/textarea/background/default", BG],
  ["color/textarea/background/disabled", "color/surface/subtle", BG],
  ["color/textarea/border/default", "color/border/control/default", BORDER],
  ["color/textarea/border/hover", "color/border/control/hover", BORDER],
  ["color/textarea/border/focus", "color/border/focus", BORDER],
  ["color/textarea/border/error", "color/status/danger/default", BORDER],
  ["color/textarea/border/disabled", "color/border/control/disabled", BORDER],
  ["color/textarea/label/default", "color/text/default", TEXT],
  ["color/textarea/label/focus", "color/textarea/label/default", TEXT],
  ["color/textarea/label/error", "color/status/danger/text", TEXT],
  ["color/textarea/label/disabled", "color/text/disabled", TEXT],
  ["color/textarea/text/placeholder", "color/text/subtle", TEXT],
  ["color/textarea/text/value", "color/text/default", TEXT],
  ["color/textarea/text/disabled", "color/text/disabled", TEXT],
  ["color/textarea/helper/default", "color/text/subtle", TEXT],
  ["color/textarea/helper/disabled", "color/text/disabled", TEXT],
  ["color/textarea/error/default", "color/status/danger/text", TEXT],
  ["color/textarea/character-count/default", "color/text/subtle", TEXT],
  ["color/textarea/character-count/disabled", "color/text/disabled", TEXT],
  ["color/textarea/focus/ring", "color/border/focus", BORDER],
  ["color/textarea/focus/gap", "color/surface/page", BG]
].forEach(function (r) { created.push(upComp(r[0], r[1], r[2])); });

// Pagination
[
  ["color/pagination/item/background/default", "color/surface/page", BG],
  ["color/pagination/item/background/hover", "color/surface/card", BG],
  ["color/pagination/item/background/active", "color/action/primary/default", BG],
  ["color/pagination/item/background/disabled", "color/surface/subtle", BG],
  ["color/pagination/item/text/default", "color/text/default", TEXT],
  ["color/pagination/item/text/hover", "color/text/default", TEXT],
  ["color/pagination/item/text/active", "color/text/inverse", TEXT],
  ["color/pagination/item/text/disabled", "color/text/disabled", TEXT],
  ["color/pagination/item/border/default", "color/border/default", BORDER],
  ["color/pagination/item/border/hover", "color/border/control/hover", BORDER],
  ["color/pagination/item/border/active", "color/action/primary/default", BORDER],
  ["color/pagination/item/border/focus", "color/border/focus", BORDER],
  ["color/pagination/item/border/disabled", "color/border/control/disabled", BORDER],
  ["color/pagination/focus/ring", "color/border/focus", BORDER],
  ["color/pagination/focus/gap", "color/surface/page", BG],
  ["color/pagination/control/text/default", "color/text-button/text/default", TEXT],
  ["color/pagination/control/text/hover", "color/text-button/text/hover", TEXT],
  ["color/pagination/control/text/disabled", "color/text-button/text/disabled", TEXT],
  ["color/pagination/ellipsis/text", "color/text/subtle", TEXT]
].forEach(function (r) { created.push(upComp(r[0], r[1], r[2])); });

function upFloat(name, values) {
  var v = gv(name);
  if (!v) { v = figma.variables.createVariable(name, dCol, "FLOAT"); v.scopes = ["WIDTH_HEIGHT", "GAP", "CORNER_RADIUS"]; }
  dCol.modes.forEach(function (m, i) { v.setValueForMode(m.modeId, values[i] !== undefined ? values[i] : values[0]); });
  return { name: name };
}

[
  ["density/textarea/medium/min-height", [96, 88, 104]],
  ["density/textarea/large/min-height", [144, 128, 160]],
  ["density/textarea/medium/padding-x", [16, 14, 18]],
  ["density/textarea/large/padding-x", [16, 14, 18]],
  ["density/textarea/padding-y", [12, 10, 14]],
  ["density/textarea/gap", [8, 6, 10]],
  ["density/pagination/small/size", [32, 28, 36]],
  ["density/pagination/medium/size", [40, 36, 44]],
  ["density/pagination/gap", [4, 2, 6]],
  ["density/pagination/control/padding-x", [8, 6, 10]]
].forEach(function (r) { created.push(upFloat(r[0], r[1])); });

return {
  created: created.filter(function (c) { return c && !c.error; }).length,
  errors: created.filter(function (c) { return c && c.error; })
};
