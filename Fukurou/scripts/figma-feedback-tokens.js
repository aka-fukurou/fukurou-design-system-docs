// use_figma — Tokens for Snackbar + Notification Button
// Foundation green/blue ramps · Theme status success/warning/info · Component snackbar/* + notification-button/*
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function getCol(name) { return figma.variables.getLocalVariableCollections().find(function (c) { return c.name === name; }); }
function hexToRgb(h) { h = h.replace("#", ""); return { r: parseInt(h.substr(0, 2), 16) / 255, g: parseInt(h.substr(2, 2), 16) / 255, b: parseInt(h.substr(4, 2), 16) / 255 }; }

var fCol = getCol("1. Foundation");
var tCol = getCol("2. Theme");
var cCol = getCol("3. Component");
var dCol = getCol("2. Density");
var fMode = fCol.modes[0].modeId;
var tLight = tCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var tDark = tCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
var created = [];

// ---- 1. Foundation: green + blue ramps (muted, matching red/amber spirit) ----
function upFoundation(name, hex) {
  var v = gv(name);
  if (!v) { v = figma.variables.createVariable(name, fCol, "COLOR"); v.scopes = ["ALL_SCOPES"]; }
  v.setValueForMode(fMode, hexToRgb(hex));
  return { name: name, created: true };
}
var greens = { "50": "#f1f8f4", "100": "#d8ecdf", "200": "#acdabd", "300": "#7fc89b", "400": "#4caf76", "500": "#2f9e60", "600": "#25804e", "700": "#1c6b41", "800": "#145331", "900": "#0d3a22" };
var blues = { "50": "#eef4fd", "100": "#d6e6fb", "200": "#b9d3f6", "300": "#9cc0f2", "400": "#5f97e6", "500": "#3f86e0", "600": "#2f6fc4", "700": "#1d4a8a", "800": "#183a6d", "900": "#122a4f" };
Object.keys(greens).forEach(function (s) { if (!gv("color/green/" + s)) created.push(upFoundation("color/green/" + s, greens[s])); });
Object.keys(blues).forEach(function (s) { if (!gv("color/blue/" + s)) created.push(upFoundation("color/blue/" + s, blues[s])); });

// ---- 2. Theme: status success/warning/info (default + text). danger already exists. ----
function upTheme(name, lightTarget, darkTarget, scopes) {
  var v = gv(name);
  if (!v) { v = figma.variables.createVariable(name, tCol, "COLOR"); v.scopes = scopes || ["ALL_SCOPES"]; }
  var lt = gv(lightTarget), dt = gv(darkTarget);
  if (!lt || !dt) return { name: name, error: "missing " + lightTarget + "/" + darkTarget };
  v.setValueForMode(tLight, { type: "VARIABLE_ALIAS", id: lt.id });
  v.setValueForMode(tDark, { type: "VARIABLE_ALIAS", id: dt.id });
  return { name: name, created: true };
}
[
  ["color/status/success/default", "color/green/500", "color/green/400"],
  ["color/status/success/text", "color/green/700", "color/green/300"],
  ["color/status/warning/default", "color/amber/500", "color/amber/400"],
  ["color/status/warning/text", "color/amber/700", "color/amber/300"],
  ["color/status/info/default", "color/blue/500", "color/blue/400"],
  ["color/status/info/text", "color/blue/700", "color/blue/300"]
].forEach(function (r) { created.push(upTheme(r[0], r[1], r[2])); });

// ---- 3. Component aliases (3. Component, single Value mode) ----
function upComp(name, target, scopes) {
  var v = gv(name);
  var t = gv(target);
  if (!t) return { name: name, error: "missing target " + target };
  if (!v) { v = figma.variables.createVariable(name, cCol, "COLOR"); v.scopes = scopes || ["ALL_SCOPES"]; }
  v.setValueForMode(cCol.modes[0].modeId, { type: "VARIABLE_ALIAS", id: t.id });
  return { name: name, created: true };
}
var BG = ["FRAME_FILL", "SHAPE_FILL"];
var BORDER = ["STROKE_COLOR"];
var TEXT = ["TEXT_FILL"];
var ICON = ["SHAPE_FILL", "STROKE_COLOR"];

// Snackbar — fixed dark container both themes; tone via icon + accent border
[
  ["color/snackbar/background/neutral", "color/brand/secondary/500", BG],
  ["color/snackbar/background/success", "color/brand/secondary/500", BG],
  ["color/snackbar/background/warning", "color/brand/secondary/500", BG],
  ["color/snackbar/background/danger", "color/brand/secondary/500", BG],
  ["color/snackbar/background/info", "color/brand/secondary/500", BG],
  ["color/snackbar/border/neutral", "color/neutral/700", BORDER],
  ["color/snackbar/border/success", "color/green/500", BORDER],
  ["color/snackbar/border/warning", "color/amber/500", BORDER],
  ["color/snackbar/border/danger", "color/red/500", BORDER],
  ["color/snackbar/border/info", "color/blue/500", BORDER],
  ["color/snackbar/text/neutral", "color/neutral/0", TEXT],
  ["color/snackbar/text/success", "color/neutral/0", TEXT],
  ["color/snackbar/text/warning", "color/neutral/0", TEXT],
  ["color/snackbar/text/danger", "color/neutral/0", TEXT],
  ["color/snackbar/text/info", "color/neutral/0", TEXT],
  ["color/snackbar/icon/neutral", "color/neutral/0", ICON],
  ["color/snackbar/icon/success", "color/green/400", ICON],
  ["color/snackbar/icon/warning", "color/amber/400", ICON],
  ["color/snackbar/icon/danger", "color/red/400", ICON],
  ["color/snackbar/icon/info", "color/blue/400", ICON],
  ["color/snackbar/action/text/default", "color/neutral/0", TEXT],
  ["color/snackbar/action/text/hover", "color/neutral/200", TEXT],
  ["color/snackbar/action/text/pressed", "color/neutral/300", TEXT],
  ["color/snackbar/close/icon/default", "color/neutral/300", ICON],
  ["color/snackbar/close/icon/hover", "color/neutral/0", ICON]
].forEach(function (r) { created.push(upComp(r[0], r[1], r[2])); });

// Notification Button — badge/dot (reuses Icon Button tokens for the button itself)
[
  ["color/notification-button/badge/background", "color/red/600", BG],
  ["color/notification-button/badge/text", "color/neutral/0", TEXT],
  ["color/notification-button/badge/border", "color/surface/page", BORDER],
  ["color/notification-button/dot/background", "color/red/600", BG],
  ["color/notification-button/dot/border", "color/surface/page", BORDER]
].forEach(function (r) { created.push(upComp(r[0], r[1], r[2])); });

// Elevation STRING token for code export
function upElevationStr(name, target) {
  var v = gv(name);
  var t = gv(target);
  if (!t) return { name: name, error: "missing " + target };
  if (!v) { v = figma.variables.createVariable(name, cCol, "STRING"); v.scopes = []; }
  v.setValueForMode(cCol.modes[0].modeId, { type: "VARIABLE_ALIAS", id: t.id });
  return { name: name, created: true };
}
if (gv("elevation/floating")) created.push(upElevationStr("elevation/snackbar/default", "elevation/floating"));

// Density tokens
function upFloat(col, name, values, scopes) {
  var v = gv(name);
  if (!v) { v = figma.variables.createVariable(name, col, "FLOAT"); v.scopes = scopes || ["WIDTH_HEIGHT", "GAP"]; }
  col.modes.forEach(function (m, i) { v.setValueForMode(m.modeId, values[i] !== undefined ? values[i] : values[0]); });
  return { name: name, created: true };
}
[
  ["density/notification-button/dot-size", [8, 8, 10]],
  ["density/notification-button/badge-min-height", [16, 16, 18]],
  ["density/notification-button/badge-padding-x", [6, 5, 7]],
  ["density/snackbar/padding-x", [16, 14, 18]],
  ["density/snackbar/padding-y", [12, 10, 14]],
  ["density/snackbar/gap", [12, 10, 14]]
].forEach(function (r) { created.push(upFloat(dCol, r[0], r[1])); });

// presence report for build step
var present = {};
["radius/12", "radius/8", "radius/full", "spacing/2", "spacing/3", "spacing/4", "spacing/5", "border/width/sm", "border/width/md"].forEach(function (n) { present[n] = !!gv(n); });
return { created: created.length, errors: created.filter(function (c) { return c.error; }), tokensPresent: present };
