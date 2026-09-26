// DEPRECATED (2026-06-19 removal; re-verified 2026-07-17) — DO NOT RUN.
// Date Picker / Calendar tokens were removed from Fukurou Design System.
// use_figma — Date Picker + Calendar component tokens (3. Component aliases)
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
function upsertStringAlias(col, name, targetName) {
  var existing = gv(name);
  var target = gv(targetName);
  if (!target) return { name: name, error: "missing target " + targetName };
  var v = existing;
  if (!v) v = figma.variables.createVariable(name, col, "STRING");
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
  ["color/date-picker/background/default", "color/surface/card", BG],
  ["color/date-picker/background/hover", "color/surface/card", BG],
  ["color/date-picker/background/focus", "color/surface/card", BG],
  ["color/date-picker/background/filled", "color/surface/card", BG],
  ["color/date-picker/background/error", "color/surface/card", BG],
  ["color/date-picker/background/disabled", "color/surface/subtle", BG],
  ["color/date-picker/border/default", "color/border/control/default", BORDER],
  ["color/date-picker/border/hover", "color/border/control/hover", BORDER],
  ["color/date-picker/border/focus", "color/border/control/focus", BORDER],
  ["color/date-picker/border/error", "color/border/control/error", BORDER],
  ["color/date-picker/border/disabled", "color/border/control/disabled", BORDER],
  ["color/date-picker/text/value", "color/text/default", TEXT],
  ["color/date-picker/text/placeholder", "color/text/subtle", TEXT],
  ["color/date-picker/text/disabled", "color/text/disabled", TEXT],
  ["color/date-picker/label/default", "color/text/default", TEXT],
  ["color/date-picker/label/focus", "color/text/default", TEXT],
  ["color/date-picker/label/error", "color/status/danger/text", TEXT],
  ["color/date-picker/label/disabled", "color/text/disabled", TEXT],
  ["color/date-picker/helper/default", "color/text/subtle", TEXT],
  ["color/date-picker/helper/disabled", "color/text/disabled", TEXT],
  ["color/date-picker/error/default", "color/status/danger/text", TEXT],
  ["color/date-picker/icon/default", "color/text/subtle", ICON],
  ["color/date-picker/icon/focus", "color/text/default", ICON],
  ["color/date-picker/icon/error", "color/status/danger/surface", ICON],
  ["color/date-picker/icon/disabled", "color/text/disabled", ICON],
  ["color/date-picker/focus/ring", "color/border/focus", BORDER],
  ["color/date-picker/focus/gap", "color/surface/page", BG],
  ["color/calendar/background/default", "color/surface/card", BG],
  ["color/calendar/border/default", "color/border/default", BORDER],
  ["color/calendar/header/text/default", "color/text/default", TEXT],
  ["color/calendar/week/text/default", "color/text/subtle", TEXT],
  ["color/calendar/day/text/default", "color/text/default", TEXT],
  ["color/calendar/day/text/outside", "color/text/subtle", TEXT],
  ["color/calendar/day/text/disabled", "color/text/disabled", TEXT],
  ["color/calendar/day/text/selected", "color/text/inverse", TEXT],
  ["color/calendar/day/background/default", "color/surface/card", BG],
  ["color/calendar/day/background/hover", "color/action/primary/subtle", BG],
  ["color/calendar/day/background/today", "color/surface/card", BG],
  ["color/calendar/day/background/selected", "color/action/primary/default", BG],
  ["color/calendar/day/background/range-middle", "color/action/primary/subtle", BG],
  ["color/calendar/day/background/range-start", "color/action/primary/default", BG],
  ["color/calendar/day/background/range-end", "color/action/primary/default", BG],
  ["color/calendar/day/border/today", "color/action/primary/default", BORDER],
  ["color/calendar/day/focus/ring", "color/border/focus", BORDER],
  ["color/calendar/day/focus/gap", "color/surface/card", BG],
  ["color/calendar/nav/icon/default", "color/text/subtle", ICON],
  ["color/calendar/nav/icon/hover", "color/text/default", ICON],
  ["color/calendar/nav/icon/disabled", "color/text/disabled", ICON],
  ["color/calendar/footer/text/default", "color/text/action", TEXT]
].forEach(function (row) {
  created.push(upsertAlias(compCol, row[0], row[1], row[2]));
});

var elevTarget = gv("elevation/popover") || gv("elevation/dropdown/default");
if (elevTarget) {
  created.push(upsertStringAlias(compCol, "elevation/calendar/default", elevTarget.name));
  created.push(upsertStringAlias(compCol, "elevation/date-picker/default", elevTarget.name));
} else {
  created.push({ name: "elevation/calendar/default", error: "missing elevation target" });
}

var densModes = densCol.modes.map(function (m) { return m.modeId; });
created.push(upsertFloat(densCol, "density/calendar/day-size", [36, 36, 36], ["WIDTH_HEIGHT"]));
created.push(upsertFloat(densCol, "density/calendar/gap", [4, 4, 4], ["GAP"]));
created.push(upsertFloat(densCol, "density/calendar/padding", [12, 12, 12], ["GAP", "WIDTH_HEIGHT"]));

return {
  tokenCount: created.filter(function (c) { return c.name && !c.error; }).length,
  errors: created.filter(function (c) { return c.error; }),
  created: created
};
