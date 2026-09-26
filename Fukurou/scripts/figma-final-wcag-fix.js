// use_figma — Final WCAG fixes: snackbar mode-stable tokens + dark modal scrim
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function getCol(name) { return figma.variables.getLocalVariableCollections().find(function (c) { return c.name === name; }); }

var tCol = getCol("2. Theme");
var cCol = getCol("3. Component");
var tLight = tCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var tDark = tCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
var cMode = cCol.modes[0].modeId;
var changes = [];
var errors = [];

function aliasComp(name, target, scopes) {
  var v = gv(name);
  var t = gv(target);
  if (!t) { errors.push({ name: name, error: "missing " + target }); return; }
  if (!v) {
    v = figma.variables.createVariable(name, cCol, "COLOR");
    v.scopes = scopes || ["ALL_SCOPES"];
  }
  v.setValueForMode(cMode, { type: "VARIABLE_ALIAS", id: t.id });
  changes.push(name + " → " + target);
}

function setThemeAlpha(name, lightRgb, lightA, darkRgb, darkA) {
  var v = gv(name);
  if (!v) { errors.push({ name: name, error: "missing" }); return; }
  v.setValueForMode(tLight, { r: lightRgb.r, g: lightRgb.g, b: lightRgb.b, a: lightA });
  v.setValueForMode(tDark, { r: darkRgb.r, g: darkRgb.g, b: darkRgb.b, a: darkA });
  changes.push(name + " scrim L=" + lightA + " D=" + darkA);
}

var BG = ["FRAME_FILL", "SHAPE_FILL"];
var BORDER = ["STROKE_COLOR"];
var TEXT = ["TEXT_FILL"];
var ICON = ["SHAPE_FILL", "STROKE_COLOR"];

// Snackbar — fixed dark bar both themes; text/icon/borders must not flip with theme
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
].forEach(function (r) { aliasComp(r[0], r[1], r[2]); });

// Modal scrim — black on light page, light scrim on dark page (both ≥3:1 vs page)
setThemeAlpha("color/surface/overlay", { r: 0, g: 0, b: 0 }, 0.55, { r: 1, g: 1, b: 1 }, 0.5);

// Ensure modal overlay component token still aliases theme scrim
aliasComp("color/modal/overlay/background", "color/surface/overlay", BG);

return { changes: changes.length, changesList: changes, errors: errors };
