// use_figma — Tokens for Alert/Banner, Tooltip, Modal/Dialog, Toggle/Switch
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function getCol(name) { return figma.variables.getLocalVariableCollections().find(function (c) { return c.name === name; }); }

var tCol = getCol("2. Theme");
var cCol = getCol("3. Component");
var dCol = getCol("2. Density");
var tLight = tCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var tDark = tCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
var cMode = cCol.modes[0].modeId;
var created = [];

function upTheme(name, lt, dt) {
  var v = gv(name);
  if (!v) { v = figma.variables.createVariable(name, tCol, "COLOR"); v.scopes = ["ALL_SCOPES"]; }
  var ltV = gv(lt), dtV = gv(dt);
  if (!ltV || !dtV) return { name: name, error: "missing " + lt + "/" + dt };
  v.setValueForMode(tLight, { type: "VARIABLE_ALIAS", id: ltV.id });
  v.setValueForMode(tDark, { type: "VARIABLE_ALIAS", id: dtV.id });
  return { name: name };
}
[["color/status/success/subtle", "color/green/50", "color/green/900"],
 ["color/status/warning/subtle", "color/amber/50", "color/amber/900"],
 ["color/status/info/subtle", "color/blue/50", "color/blue/900"]
].forEach(function (r) { if (!gv(r[0])) created.push(upTheme(r[0], r[1], r[2])); });

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
var ICON = ["SHAPE_FILL", "STROKE_COLOR"];

// Alert / Banner
var tones = ["neutral", "info", "success", "warning", "danger"];
tones.forEach(function (t) {
  var bg = t === "neutral" ? "color/surface/subtle" : "color/status/" + t + "/subtle";
  if (t === "neutral") bg = "color/surface/subtle";
  else bg = "color/status/" + (t === "danger" ? "danger" : t) + "/subtle";
  created.push(upComp("color/alert/background/" + t, bg, BG));
  created.push(upComp("color/alert/border/" + t, t === "neutral" ? "color/border/default" : "color/status/" + (t === "danger" ? "danger" : t) + "/default", BORDER));
  created.push(upComp("color/alert/title/" + t, t === "neutral" ? "color/text/default" : "color/status/" + (t === "danger" ? "danger" : t) + "/text", TEXT));
  created.push(upComp("color/alert/message/" + t, "color/text/subtle", TEXT));
  created.push(upComp("color/alert/icon/" + t, t === "neutral" ? "color/text/default" : "color/status/" + (t === "danger" ? "danger" : t) + "/default", ICON));
});
["default", "hover", "pressed"].forEach(function (s) {
  created.push(upComp("color/alert/action/text/" + s, s === "default" ? "color/text/action" : "color/text/action", TEXT));
});
created.push(upComp("color/alert/close/icon/default", "color/text/subtle", ICON));
created.push(upComp("color/alert/close/icon/hover", "color/text/default", ICON));

// Tooltip
created.push(upComp("color/tooltip/background/default", "color/surface/inverse", BG));
created.push(upComp("color/tooltip/text/default", "color/text/inverse", TEXT));
created.push(upComp("color/tooltip/arrow/default", "color/surface/inverse", BG));

// Modal
created.push(upComp("color/modal/overlay/background", "color/surface/overlay", BG));
created.push(upComp("color/modal/background/default", "color/surface/card", BG));
created.push(upComp("color/modal/border/default", "color/border/default", BORDER));
created.push(upComp("color/modal/title/default", "color/text/default", TEXT));
created.push(upComp("color/modal/body/default", "color/text/subtle", TEXT));

// Switch
[["color/switch/track/off/default", "color/border/default"],
 ["color/switch/track/off/hover", "color/border/control/hover"],
 ["color/switch/track/on/default", "color/action/primary/default"],
 ["color/switch/track/on/hover", "color/action/primary/hover"],
 ["color/switch/track/disabled", "color/border/control/disabled"],
 ["color/switch/thumb/default", "color/surface/card"],
 ["color/switch/thumb/on", "color/surface/card"],
 ["color/switch/thumb/disabled", "color/surface/subtle"],
 ["color/switch/focus/ring", "color/border/focus"],
 ["color/switch/focus/gap", "color/surface/page"],
 ["color/switch/label/default", "color/text/default"],
 ["color/switch/label/disabled", "color/text/disabled"],
 ["color/switch/description/default", "color/text/subtle"],
 ["color/switch/description/disabled", "color/text/disabled"]
].forEach(function (r) { created.push(upComp(r[0], r[1], r[0].indexOf("border") >= 0 || r[0].indexOf("focus/ring") >= 0 ? BORDER : r[0].indexOf("text") >= 0 || r[0].indexOf("label") >= 0 || r[0].indexOf("description") >= 0 ? TEXT : BG)); });

function upElevStr(name, target) {
  var v = gv(name);
  var t = gv(target);
  if (!t) return { name: name, error: "missing " + target };
  if (!v) { v = figma.variables.createVariable(name, cCol, "STRING"); v.scopes = []; }
  v.setValueForMode(cMode, { type: "VARIABLE_ALIAS", id: t.id });
  return { name: name };
}
if (gv("elevation/floating") && !gv("elevation/tooltip/default")) created.push(upElevStr("elevation/tooltip/default", "elevation/floating"));

function upFloat(name, values) {
  var v = gv(name);
  if (!v) { v = figma.variables.createVariable(name, dCol, "FLOAT"); v.scopes = ["WIDTH_HEIGHT", "GAP"]; }
  dCol.modes.forEach(function (m, i) { v.setValueForMode(m.modeId, values[i] !== undefined ? values[i] : values[0]); });
  return { name: name };
}
[["density/alert/padding-x", [16, 14, 18]],
 ["density/alert/padding-y", [12, 10, 14]],
 ["density/alert/gap", [12, 10, 14]],
 ["density/tooltip/padding-x", [12, 10, 14]],
 ["density/tooltip/padding-y", [8, 6, 10]],
 ["density/modal/padding", [24, 20, 28]],
 ["density/modal/gap", [16, 14, 20]],
 ["density/modal/width-sm", [360, 320, 400]],
 ["density/modal/width-md", [480, 440, 520]],
 ["density/modal/width-lg", [640, 560, 720]],
 ["density/switch/track-width", [44, 40, 48]],
 ["density/switch/track-height", [24, 22, 26]],
 ["density/switch/thumb-size", [20, 18, 22]],
 ["density/switch/gap", [12, 10, 14]]
].forEach(function (r) { created.push(upFloat(r[0], r[1])); });

return { created: created.length, errors: created.filter(function (c) { return c && c.error; }) };
