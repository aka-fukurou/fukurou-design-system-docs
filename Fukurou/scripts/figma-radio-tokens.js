// use_figma — Radio Selector component tokens + density
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
var created = [];
[
  ["color/radio/background/default", "color/surface/card", BG],
  ["color/radio/background/hover", "color/action/primary/subtle", BG],
  ["color/radio/background/selected", "color/surface/card", BG],
  ["color/radio/background/disabled", "color/surface/subtle", BG],
  ["color/radio/background/error", "color/surface/card", BG],
  ["color/radio/border/default", "color/border/control/default", BORDER],
  ["color/radio/border/hover", "color/border/control/hover", BORDER],
  ["color/radio/border/selected", "color/action/primary/default", BORDER],
  ["color/radio/border/focus", "color/border/focus", BORDER],
  ["color/radio/border/disabled", "color/border/control/disabled", BORDER],
  ["color/radio/border/error", "color/status/danger/default", BORDER],
  ["color/radio/dot/selected", "color/action/primary/default", BG],
  ["color/radio/dot/disabled", "color/text/disabled", BG],
  ["color/radio/label/default", "color/text/default", TEXT],
  ["color/radio/label/disabled", "color/text/disabled", TEXT],
  ["color/radio/label/error", "color/status/danger/text", TEXT],
  ["color/radio/description/default", "color/text/subtle", TEXT],
  ["color/radio/description/disabled", "color/text/disabled", TEXT],
  ["color/radio/description/error", "color/text/subtle", TEXT],
  ["color/radio/focus/ring", "color/border/focus", BORDER],
  ["color/radio/focus/gap", "color/surface/page", BG]
].forEach(function (row) { created.push(upsertAlias(compCol, row[0], row[1], row[2])); });
[
  ["density/radio/control-size", [20, 18, 22]],
  ["density/radio/dot-size", [8, 7, 9]],
  ["density/radio/gap", [12, 10, 14]]
].forEach(function (row) { created.push(upsertFloat(densCol, row[0], row[1])); });
return { radioTokens: created.filter(function (c) { return c.name && c.name.indexOf("color/radio") === 0; }).length, created: created.length };
