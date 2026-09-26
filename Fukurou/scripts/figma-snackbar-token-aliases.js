// use_figma — Snackbar token aliases for elevated-surface contrast (token-only; no component edits)
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function getCol(name) { return figma.variables.getLocalVariableCollections().find(function (c) { return c.name === name; }); }
var cCol = getCol("3. Component");
var cMode = cCol.modes[0].modeId;
var ICON = ["SHAPE_FILL", "STROKE_COLOR"];
var TEXT = ["TEXT_FILL"];
var changes = [];
function aliasComp(name, target) {
  var v = gv(name), t = gv(target);
  if (!v || !t) return { error: name };
  v.setValueForMode(cMode, { type: "VARIABLE_ALIAS", id: t.id });
  changes.push(name + " → " + target);
}
[
  ["color/snackbar/action/text/default", "color/text/action", TEXT],
  ["color/snackbar/action/text/hover", "color/text-button/text/hover", TEXT],
  ["color/snackbar/action/text/pressed", "color/text-button/text/pressed", TEXT],
  ["color/snackbar/close/icon/default", "color/text/subtle", ICON],
  ["color/snackbar/close/icon/hover", "color/text/default", ICON]
].forEach(function (r) { aliasComp(r[0], r[1]); });
return { changes: changes };
