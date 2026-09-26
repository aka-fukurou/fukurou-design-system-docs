var PART = 0;
var themeCol = figma.variables.getLocalVariableCollections().find(function (c) { return c.name === "2. Theme"; });
var lightId = themeCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var darkId = themeCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
function resolveVar(v, themeModeId) {
  var cur = v, guard = 0;
  while (cur && guard++ < 16) {
    var col = figma.variables.getVariableCollectionById(cur.variableCollectionId);
    var modeId = col.name === "2. Theme" ? themeModeId : col.modes[0].modeId;
    var val = cur.valuesByMode[modeId];
    if (val && val.type === "VARIABLE_ALIAS") cur = figma.variables.getVariableById(val.id);
    else {
      if (val && val.r !== undefined) {
        function h(x) { var s = Math.round(x * 255).toString(16); return s.length < 2 ? "0" + s : s; }
        return { hex: "#" + h(val.r) + h(val.g) + h(val.b), a: val.a === undefined ? 1 : val.a };
      }
      return { hex: "#000000", a: 1 };
    }
  }
  return { hex: "#000000", a: 1 };
}
var names = figma.variables.getLocalVariables().filter(function (v) { return v.resolvedType === "COLOR"; }).map(function (v) { return v.name; }).sort();
var qSize = Math.ceil(names.length / 4);
var batch = names.slice(PART * qSize, (PART + 1) * qSize);
var tokens = {};
figma.variables.getLocalVariables().filter(function (v) { return v.resolvedType === "COLOR" && batch.indexOf(v.name) >= 0; }).forEach(function (v) {
  var l = resolveVar(v, lightId), d = resolveVar(v, darkId);
  tokens[v.name] = { light: l.hex, lightA: l.a, dark: d.hex, darkA: d.a };
});
return { part: PART, tokenCount: Object.keys(tokens).length, tokens: tokens };
