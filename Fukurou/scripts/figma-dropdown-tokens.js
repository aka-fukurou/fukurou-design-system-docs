// use_figma — Dropdown component tokens + density
function gv(n) {
  return figma.variables.getLocalVariables().find(function (v) { return v.name === n; });
}
function getCol(name) {
  return figma.variables.getLocalVariableCollections().find(function (c) { return c.name === name; });
}
function upsertAlias(col, name, targetName, scopes) {
  var existing = gv(name);
  var target = gv(targetName);
  if (!target) return { name: name, error: "missing target " + targetName };
  var v = existing;
  if (!v) {
    v = figma.variables.createVariable(name, col, "COLOR");
    v.scopes = scopes || ["ALL_SCOPES"];
  }
  var mid = col.modes[0].modeId;
  v.setValueForMode(mid, { type: "VARIABLE_ALIAS", id: target.id });
  return { name: name, id: v.id, created: !existing };
}
function upsertFloat(col, name, values, scopes) {
  var existing = gv(name);
  var v = existing;
  if (!v) {
    v = figma.variables.createVariable(name, col, "FLOAT");
    v.scopes = scopes || ["WIDTH_HEIGHT", "GAP"];
  }
  col.modes.forEach(function (m, i) {
    v.setValueForMode(m.modeId, values[i] !== undefined ? values[i] : values[0]);
  });
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
  ["color/dropdown/background/default", "color/surface/card", BG],
  ["color/dropdown/background/hover", "color/surface/card", BG],
  ["color/dropdown/background/focus", "color/surface/card", BG],
  ["color/dropdown/background/filled", "color/surface/card", BG],
  ["color/dropdown/background/error", "color/surface/card", BG],
  ["color/dropdown/background/disabled", "color/surface/subtle", BG],
  ["color/dropdown/border/default", "color/border/control/default", BORDER],
  ["color/dropdown/border/hover", "color/border/control/hover", BORDER],
  ["color/dropdown/border/focus", "color/border/control/focus", BORDER],
  ["color/dropdown/border/error", "color/border/control/error", BORDER],
  ["color/dropdown/border/disabled", "color/border/control/disabled", BORDER],
  ["color/dropdown/text/value", "color/text/default", TEXT],
  ["color/dropdown/text/placeholder", "color/text/subtle", TEXT],
  ["color/dropdown/text/disabled", "color/text/disabled", TEXT],
  ["color/dropdown/label/default", "color/text/default", TEXT],
  ["color/dropdown/label/focus", "color/text/default", TEXT],
  ["color/dropdown/label/error", "color/status/danger/text", TEXT],
  ["color/dropdown/label/disabled", "color/text/disabled", TEXT],
  ["color/dropdown/helper/default", "color/text/subtle", TEXT],
  ["color/dropdown/helper/disabled", "color/text/disabled", TEXT],
  ["color/dropdown/error/default", "color/status/danger/text", TEXT],
  ["color/dropdown/icon/default", "color/text/subtle", ICON],
  ["color/dropdown/icon/focus", "color/text/default", ICON],
  ["color/dropdown/icon/error", "color/status/danger/default", ICON],
  ["color/dropdown/icon/disabled", "color/text/disabled", ICON],
  ["color/dropdown/focus/ring", "color/border/focus", BORDER],
  ["color/dropdown/focus/gap", "color/surface/page", BG],
  ["color/dropdown-menu/background/default", "color/surface/elevated", BG],
  ["color/dropdown-menu/border/default", "color/border/default", BORDER],
  ["color/dropdown-menu/option/background/default", "color/surface/elevated", BG],
  ["color/dropdown-menu/option/background/hover", "color/action/primary/subtle", BG],
  ["color/dropdown-menu/option/background/selected", "color/action/primary/subtle", BG],
  ["color/dropdown-menu/option/text/default", "color/text/default", TEXT],
  ["color/dropdown-menu/option/text/selected", "color/text/default", TEXT],
  ["color/dropdown-menu/option/text/disabled", "color/text/disabled", TEXT],
  ["color/dropdown-menu/checkmark/default", "color/text/action", ICON]
].forEach(function (row) {
  created.push(upsertAlias(compCol, row[0], row[1], row[2]));
});

[
  ["density/dropdown/small/height", [40, 36, 44]],
  ["density/dropdown/medium/height", [48, 44, 52]],
  ["density/dropdown/small/padding-x", [12, 10, 14]],
  ["density/dropdown/medium/padding-x", [16, 14, 18]],
  ["density/dropdown/gap", [8, 6, 10]],
  ["density/dropdown-menu/option-height", [40, 36, 44]],
  ["density/dropdown-menu/padding-x", [12, 10, 14]]
].forEach(function (row) {
  created.push(upsertFloat(densCol, row[0], row[1]));
});

return {
  componentTokens: created.filter(function (c) { return c.name && c.name.indexOf("color/dropdown") === 0; }).length,
  densityTokens: created.filter(function (c) { return c.name && c.name.indexOf("density/dropdown") === 0; }).length,
  created: created
};
