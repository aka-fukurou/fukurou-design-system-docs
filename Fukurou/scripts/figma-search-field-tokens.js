// use_figma — Search Field component tokens (3. Component aliases)
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

var compCol = getCol("3. Component");
var BG = ["FRAME_FILL", "SHAPE_FILL"];
var BORDER = ["STROKE_COLOR"];
var TEXT = ["TEXT_FILL"];
var ICON = ["SHAPE_FILL", "STROKE_COLOR"];

var created = [];
[
  ["color/search-field/background/default", "color/surface/card", BG],
  ["color/search-field/background/hover", "color/surface/card", BG],
  ["color/search-field/background/focus", "color/surface/card", BG],
  ["color/search-field/background/filled", "color/surface/card", BG],
  ["color/search-field/background/error", "color/surface/card", BG],
  ["color/search-field/background/disabled", "color/surface/subtle", BG],
  ["color/search-field/border/default", "color/border/control/default", BORDER],
  ["color/search-field/border/hover", "color/border/control/hover", BORDER],
  ["color/search-field/border/focus", "color/border/control/focus", BORDER],
  ["color/search-field/border/error", "color/border/control/error", BORDER],
  ["color/search-field/border/disabled", "color/border/control/disabled", BORDER],
  ["color/search-field/text/value", "color/text/default", TEXT],
  ["color/search-field/text/placeholder", "color/text/subtle", TEXT],
  ["color/search-field/text/disabled", "color/text/disabled", TEXT],
  ["color/search-field/label/default", "color/text/default", TEXT],
  ["color/search-field/label/focus", "color/text/default", TEXT],
  ["color/search-field/label/error", "color/status/danger/text", TEXT],
  ["color/search-field/label/disabled", "color/text/disabled", TEXT],
  ["color/search-field/helper/default", "color/text/subtle", TEXT],
  ["color/search-field/helper/disabled", "color/text/disabled", TEXT],
  ["color/search-field/error/default", "color/status/danger/text", TEXT],
  ["color/search-field/icon/default", "color/text/subtle", ICON],
  ["color/search-field/icon/focus", "color/text/default", ICON],
  ["color/search-field/icon/error", "color/status/danger/surface", ICON],
  ["color/search-field/icon/disabled", "color/text/disabled", ICON],
  ["color/search-field/clear-icon/default", "color/text/subtle", ICON],
  ["color/search-field/clear-icon/hover", "color/text/default", ICON],
  ["color/search-field/clear-icon/disabled", "color/text/disabled", ICON],
  ["color/search-field/focus/ring", "color/border/focus", BORDER],
  ["color/search-field/focus/gap", "color/surface/page", BG]
].forEach(function (row) {
  created.push(upsertAlias(compCol, row[0], row[1], row[2]));
});

return {
  tokenCount: created.filter(function (c) { return c.name && !c.error; }).length,
  errors: created.filter(function (c) { return c.error; }),
  created: created
};
