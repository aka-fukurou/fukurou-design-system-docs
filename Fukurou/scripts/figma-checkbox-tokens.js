// use_figma — Checkbox component tokens + density
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function getCol(name) { return figma.variables.getLocalVariableCollections().find(function (c) { return c.name === name; }); }
function upsertAlias(col, name, targetName, scopes) {
  var existing = gv(name);
  var target = gv(targetName);
  if (!target) return { name: name, error: "missing target " + targetName };
  var v = existing;
  if (!v) { v = figma.variables.createVariable(name, col, "COLOR"); v.scopes = scopes || ["ALL_SCOPES"]; }
  v.setValueForMode(col.modes[0].modeId, { type: "VARIABLE_ALIAS", id: target.id });
  return { name: name, id: v.id, created: !existing };
}
function upsertFloat(col, name, values, scopes) {
  var existing = gv(name);
  var v = existing;
  if (!v) { v = figma.variables.createVariable(name, col, "FLOAT"); v.scopes = scopes || ["WIDTH_HEIGHT", "GAP"]; }
  col.modes.forEach(function (m, i) { v.setValueForMode(m.modeId, values[i] !== undefined ? values[i] : values[0]); });
  return { name: name, id: v.id, created: !existing };
}
var compCol = getCol("3. Component");
var densCol = getCol("2. Density");
var BG = ["FRAME_FILL", "SHAPE_FILL"];
var BORDER = ["STROKE_COLOR"];
var TEXT = ["TEXT_FILL"];
var ICON = ["SHAPE_FILL", "STROKE_COLOR"];
var created = [];
[
  ["color/checkbox/background/default", "color/surface/card", BG],
  ["color/checkbox/background/hover", "color/action/primary/subtle", BG],
  ["color/checkbox/background/checked", "color/action/primary/default", BG],
  ["color/checkbox/background/indeterminate", "color/action/primary/default", BG],
  ["color/checkbox/background/disabled", "color/surface/subtle", BG],
  ["color/checkbox/background/error", "color/surface/card", BG],
  ["color/checkbox/border/default", "color/border/control/default", BORDER],
  ["color/checkbox/border/hover", "color/border/control/hover", BORDER],
  ["color/checkbox/border/checked", "color/action/primary/default", BORDER],
  ["color/checkbox/border/indeterminate", "color/action/primary/default", BORDER],
  ["color/checkbox/border/focus", "color/border/focus", BORDER],
  ["color/checkbox/border/disabled", "color/border/control/disabled", BORDER],
  ["color/checkbox/border/error", "color/status/danger/default", BORDER],
  ["color/checkbox/mark/checked", "color/text/inverse", ICON],
  ["color/checkbox/mark/indeterminate", "color/text/inverse", ICON],
  ["color/checkbox/mark/disabled", "color/text/disabled", ICON],
  ["color/checkbox/label/default", "color/text/default", TEXT],
  ["color/checkbox/label/disabled", "color/text/disabled", TEXT],
  ["color/checkbox/label/error", "color/status/danger/text", TEXT],
  ["color/checkbox/description/default", "color/text/subtle", TEXT],
  ["color/checkbox/description/disabled", "color/text/disabled", TEXT],
  ["color/checkbox/description/error", "color/text/subtle", TEXT],
  ["color/checkbox/focus/ring", "color/border/focus", BORDER],
  ["color/checkbox/focus/gap", "color/surface/page", BG]
].forEach(function (row) { created.push(upsertAlias(compCol, row[0], row[1], row[2])); });
[
  ["density/checkbox/control-size", [20, 18, 22]],
  ["density/checkbox/mark-size", [12, 11, 13]],
  ["density/checkbox/indeterminate-width", [10, 9, 11]],
  ["density/checkbox/gap", [12, 10, 14]]
].forEach(function (row) { created.push(upsertFloat(densCol, row[0], row[1])); });
return { checkboxTokens: created.filter(function (c) { return c.name && c.name.indexOf("color/checkbox") === 0; }).length, created: created.length, errors: created.filter(function (c) { return c.error; }) };
