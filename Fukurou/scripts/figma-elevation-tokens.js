function getCol(name) {
  return figma.variables.getLocalVariableCollections().find(function (c) { return c.name === name; });
}
function getVar(name) {
  return figma.variables.getLocalVariables().find(function (v) { return v.name === name; });
}
function web(name) { return "var(--" + name.replace(/[\s\/]+/g, "-").toLowerCase() + ")"; }

var CSS = {
  none: "none",
  50: "0px 1px 2px rgba(35, 31, 32, 0.06)",
  100: "0px 1px 3px rgba(35, 31, 32, 0.08), 0px 1px 2px rgba(35, 31, 32, 0.04)",
  200: "0px 4px 8px rgba(35, 31, 32, 0.08), 0px 2px 4px rgba(35, 31, 32, 0.04)",
  300: "0px 8px 16px rgba(35, 31, 32, 0.10), 0px 4px 8px rgba(35, 31, 32, 0.06)",
  400: "0px 16px 32px rgba(35, 31, 32, 0.12), 0px 8px 16px rgba(35, 31, 32, 0.08)",
  500: "0px 24px 48px rgba(35, 31, 32, 0.14), 0px 12px 24px rgba(35, 31, 32, 0.10)",
  600: "0px 32px 64px rgba(35, 31, 32, 0.18), 0px 16px 32px rgba(35, 31, 32, 0.12)"
};
var STYLE = {
  none: "Shadow / none", 50: "Shadow / 50", 100: "Shadow / 100", 200: "Shadow / 200",
  300: "Shadow / 300", 400: "Shadow / 400", 500: "Shadow / 500", 600: "Shadow / 600"
};

var primCol = getCol("1. Foundation");
var themeCol = getCol("2. Theme");
var compCol = getCol("3. Component");
var primMode = primCol.modes[0].modeId;
var L = themeCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var D = themeCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
var compMode = compCol.modes[0].modeId;
var created = [];
var primShadow = {};

function primString(name, css, figmaStyle) {
  var v = getVar(name);
  if (!v) { v = figma.variables.createVariable(name, primCol, "STRING"); created.push(name); }
  v.setValueForMode(primMode, css);
  v.scopes = [];
  v.description = "Figma effect style: " + figmaStyle + ". Plugin API cannot create EFFECT variables; use effect styles in Figma and this CSS string for code.";
  v.setVariableCodeSyntax("WEB", web(name));
  primShadow[name] = v;
  return v;
}

Object.keys(CSS).forEach(function (k) {
  primString("effect/shadow/" + k, CSS[k], STYLE[k]);
});

function P(n) { return getVar("color/" + n); }
function themeColor(name, lp, dp) {
  if (getVar(name)) return getVar(name);
  var v = figma.variables.createVariable(name, themeCol, "COLOR");
  v.setValueForMode(L, { type: "VARIABLE_ALIAS", id: P(lp).id });
  v.setValueForMode(D, { type: "VARIABLE_ALIAS", id: P(dp).id });
  v.scopes = ["FRAME_FILL", "SHAPE_FILL"];
  v.setVariableCodeSyntax("WEB", web(name));
  created.push(name);
  return v;
}
function themeBorder(name, lp, dp) {
  if (getVar(name)) return getVar(name);
  var v = figma.variables.createVariable(name, themeCol, "COLOR");
  v.setValueForMode(L, { type: "VARIABLE_ALIAS", id: P(lp).id });
  v.setValueForMode(D, { type: "VARIABLE_ALIAS", id: P(dp).id });
  v.scopes = ["STROKE_COLOR"];
  v.setVariableCodeSyntax("WEB", web(name));
  created.push(name);
  return v;
}

themeColor("color/surface/overlay", "neutral/0", "neutral/800");
themeColor("color/surface/floating", "neutral/0", "neutral/700");
themeBorder("color/border/elevated", "neutral/200", "neutral/600");

var elevationMap = {
  "elevation/none": "effect/shadow/none",
  "elevation/surface": "effect/shadow/50",
  "elevation/raised": "effect/shadow/100",
  "elevation/floating": "effect/shadow/200",
  "elevation/popover": "effect/shadow/300",
  "elevation/modal": "effect/shadow/400",
  "elevation/overlay": "effect/shadow/500"
};
var themeElev = {};
Object.keys(elevationMap).forEach(function (name) {
  var target = primShadow[elevationMap[name]];
  var v = getVar(name);
  if (!v) { v = figma.variables.createVariable(name, themeCol, "STRING"); created.push(name); }
  v.setValueForMode(L, { type: "VARIABLE_ALIAS", id: target.id });
  v.setValueForMode(D, { type: "VARIABLE_ALIAS", id: target.id });
  v.scopes = [];
  v.description = "Semantic elevation → " + elevationMap[name] + ". Apply matching Elevation/* effect style in Figma.";
  v.setVariableCodeSyntax("WEB", web(name));
  themeElev[name] = v;
});

var compMap = {
  "elevation/card/default": "elevation/surface",
  "elevation/card/hover": "elevation/raised",
  "elevation/card/selected": "elevation/floating",
  "elevation/button/default": "elevation/none",
  "elevation/button/hover": "elevation/none",
  "elevation/button/focus": "elevation/none",
  "elevation/text-field/default": "elevation/none",
  "elevation/text-field/focus": "elevation/none",
  "elevation/popover/default": "elevation/popover",
  "elevation/modal/default": "elevation/modal",
  "elevation/dropdown/default": "elevation/popover",
  "elevation/toast/default": "elevation/floating"
};
Object.keys(compMap).forEach(function (name) {
  var target = themeElev[compMap[name]];
  var v = getVar(name);
  if (!v) { v = figma.variables.createVariable(name, compCol, "STRING"); created.push(name); }
  v.setValueForMode(compMode, { type: "VARIABLE_ALIAS", id: target.id });
  v.scopes = [];
  v.setVariableCodeSyntax("WEB", web(name));
  created.push(name);
});

return {
  created: created,
  counts: {
    foundation: primCol.variableIds.length,
    theme: themeCol.variableIds.length,
    component: compCol.variableIds.length
  },
  limitation: "EFFECT variable type not supported in Plugin API; shadow tokens are STRING (CSS) + Figma effect styles"
};
