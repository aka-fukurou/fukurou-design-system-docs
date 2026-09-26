// use_figma — WCAG contrast fixes (token aliases only; brand primitives unchanged)
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function getCol(name) { return figma.variables.getLocalVariableCollections().find(function (c) { return c.name === name; }); }

var tCol = getCol("2. Theme");
var cCol = getCol("3. Component");
var tLight = tCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var tDark = tCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
var cMode = cCol.modes[0].modeId;
var changes = [];
var errors = [];

function aliasTheme(name, lightTarget, darkTarget) {
  var v = gv(name);
  var lt = gv(lightTarget), dt = gv(darkTarget);
  if (!v || !lt || !dt) { errors.push({ name: name, error: "missing var or target" }); return; }
  v.setValueForMode(tLight, { type: "VARIABLE_ALIAS", id: lt.id });
  v.setValueForMode(tDark, { type: "VARIABLE_ALIAS", id: dt.id });
  changes.push(name + " → " + lightTarget + " / " + darkTarget);
}

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
  changes.push(name + " scrim alpha L=" + lightA + " D=" + darkA);
}

// FIX-1: Decorative/control borders ≥3:1 (card, dropdown-menu, modal, pagination item, border/default on page)
aliasTheme("color/border/default", "color/neutral/500", "color/neutral/400");

// FIX-2: Status neutral subtle — dark mode bg must be dark (not light gray #e7e5e4)
aliasTheme("color/status/neutral/subtle", "color/neutral/50", "color/neutral/800");

// FIX-3: Status danger inverse text on filled surface — use pure white Light
aliasTheme("color/status/danger/text-inverse", "color/neutral/0", "color/red/900");

// FIX-4: Modal scrim — black on light page; light scrim on dark page (black-on-black = 1:1)
setThemeAlpha("color/surface/overlay", { r: 0, g: 0, b: 0 }, 0.55, { r: 1, g: 1, b: 1 }, 0.5);

// FIX-5: Switch off-track — darker track for thumb 3:1 non-text
aliasComp("color/switch/track/off/default", "color/border/control/default", ["FRAME_FILL", "SHAPE_FILL"]);

// FIX-6: Text Button default on page — accessible action text (brand/700)
aliasComp("color/text-button/text/default", "color/text/action", ["TEXT_FILL"]);

// FIX-7: Pagination control — pagination-specific accessible icon/text (not global Icon Button)
aliasComp("color/pagination/control/text/default", "color/text/action", ["TEXT_FILL"]);
aliasComp("color/pagination/control/text/hover", "color/text-button/text/hover", ["TEXT_FILL"]);
aliasComp("color/pagination/control/icon/default", "color/text/action", ["SHAPE_FILL", "STROKE_COLOR"]);
aliasComp("color/pagination/control/icon/hover", "color/text-button/text/hover", ["SHAPE_FILL", "STROKE_COLOR"]);
aliasComp("color/pagination/control/icon/disabled", "color/text-button/text/disabled", ["SHAPE_FILL", "STROKE_COLOR"]);

// FIX-8: Status filled surface text/icon — inverse on filled treatments
var tones = ["danger", "info", "success", "warning"];
var ICON = ["SHAPE_FILL", "STROKE_COLOR"];
tones.forEach(function (t) {
  aliasComp("color/status/" + t + "/filled/text", "color/text/inverse", ["TEXT_FILL"]);
  aliasComp("color/status/" + t + "/filled/icon", "color/text/inverse", ICON);
});

// FIX-9: Snackbar dismiss icon (fixed dark bar Light / inverted bar Dark)
aliasComp("color/snackbar/close/icon/default", "color/neutral/300", ICON);
aliasComp("color/snackbar/close/icon/hover", "color/neutral/0", ICON);

return { changes: changes.length, changesList: changes, errors: errors };
