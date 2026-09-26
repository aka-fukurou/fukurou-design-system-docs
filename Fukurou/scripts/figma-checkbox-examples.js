// use_figma — Checkbox / Examples + Checkbox Group (Form page)
var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
var set = formPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Checkbox"; });
var old = formPage.findOne(function (n) { return n.name === "Checkbox / Examples"; });
if (old) old.remove();
if (!set) return { error: "Missing Checkbox component set" };

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var themeCol = figma.variables.getLocalVariableCollections().find(function (c) { return c.name === "2. Theme"; });
var lightId = themeCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var darkId = themeCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
var pageBg = figma.variables.getLocalVariables().find(function (v) { return v.name === "color/surface/page"; });
function boundPaint(variable) {
  function resolveColor(v) {
    var g = 0;
    while (v && g++ < 12) {
      var mid = Object.keys(v.valuesByMode)[0];
      var val = v.valuesByMode[mid];
      if (val && val.type === "VARIABLE_ALIAS") v = figma.variables.getVariableById(val.id);
      else return val;
    }
    return { r: 0.96, g: 0.96, b: 0.95, a: 1 };
  }
  var c = resolveColor(variable);
  return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: c.r, g: c.g, b: c.b }, opacity: 1 }, "color", variable);
}
function findVariant(state, checked, indeterminate) {
  return set.children.find(function (c) {
    return c.name.indexOf("State=" + state) >= 0 && c.name.indexOf("Checked=" + checked) >= 0 && c.name.indexOf("Indeterminate=" + indeterminate) >= 0;
  });
}
// Non-variant (TEXT/BOOLEAN) props must be set with their full key (incl. #id suffix).
function propKey(prefix) { return Object.keys(set.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
var K = { label: propKey("Label"), desc: propKey("Description"), showDesc: propKey("Show description") };
function makeSection(name, modeId) {
  var sec = figma.createFrame();
  sec.name = name; sec.layoutMode = "VERTICAL"; sec.primaryAxisSizingMode = "AUTO"; sec.counterAxisSizingMode = "FIXED";
  sec.itemSpacing = 20; sec.paddingTop = 24; sec.paddingBottom = 24; sec.paddingLeft = 24; sec.paddingRight = 24;
  sec.fills = [boundPaint(pageBg)]; sec.cornerRadius = 12; sec.setExplicitVariableModeForCollection(themeCol, modeId);
  return sec;
}
function addExample(parent, title, cfg) {
  var row = figma.createFrame();
  row.name = title; row.layoutMode = "VERTICAL"; row.primaryAxisSizingMode = "AUTO"; row.counterAxisSizingMode = "FIXED";
  row.resize(340, 10); row.itemSpacing = 8; row.fills = []; parent.appendChild(row); row.layoutSizingHorizontal = "FILL";
  var cap = figma.createText(); cap.name = "caption"; cap.fontName = { family: "Poppins", style: "SemiBold" };
  cap.characters = title; cap.fontSize = 12; row.appendChild(cap); cap.layoutSizingHorizontal = "FILL";
  var base = findVariant(cfg.state || "Default", cfg.checked || "False", cfg.indeterminate || "False");
  var inst = base.createInstance(); inst.name = "Checkbox"; row.appendChild(inst); inst.layoutSizingHorizontal = "FILL";
  var props = {};
  if (cfg.label) props[K.label] = cfg.label;
  if (cfg.desc) props[K.desc] = cfg.desc;
  if (cfg.showDesc === false) props[K.showDesc] = false;
  try { inst.setProperties(props); } catch (e) {}
  row.primaryAxisSizingMode = "AUTO"; // re-assert hug after resize()
  return inst;
}
function addGroup(parent, modeLabel) {
  var group = figma.createFrame();
  group.name = "Checkbox Group" + (modeLabel ? " (" + modeLabel + ")" : "");
  group.layoutMode = "VERTICAL"; group.primaryAxisSizingMode = "AUTO"; group.counterAxisSizingMode = "FIXED"; group.resize(360, 10);
  group.itemSpacing = 16; group.paddingTop = 20; group.paddingBottom = 20; group.paddingLeft = 20; group.paddingRight = 20;
  group.fills = [boundPaint(pageBg)]; group.strokes = [boundPaint(figma.variables.getLocalVariables().find(function (v) { return v.name === "color/border/default"; }))];
  group.strokeWeight = 1; group.cornerRadius = 12; parent.appendChild(group); group.layoutSizingHorizontal = "FILL";
  var legend = figma.createText(); legend.name = "group-label"; legend.fontName = { family: "Poppins", style: "SemiBold" };
  legend.characters = "Income sources"; legend.fontSize = 16; group.appendChild(legend); legend.layoutSizingHorizontal = "FILL";
  var opts = [
    { state: "Default", checked: "True", indeterminate: "False", label: "W-2 income", desc: "Select this if you received wages from an employer." },
    { state: "Default", checked: "False", indeterminate: "False", label: "1099 income", desc: "Select this if you received freelance or contract income." },
    { state: "Default", checked: "False", indeterminate: "True", label: "Self-employment", desc: "Select this if you operate your own business." },
    { state: "Disabled", checked: "False", indeterminate: "False", label: "Rental income", desc: "Select this if you earned income from rental property." }
  ];
  opts.forEach(function (o) {
    var base = findVariant(o.state, o.checked, o.indeterminate);
    var inst = base.createInstance(); inst.name = "Checkbox"; group.appendChild(inst); inst.layoutSizingHorizontal = "FILL";
    var p = {}; p[K.label] = o.label; p[K.desc] = o.desc;
    try { inst.setProperties(p); } catch (e) {}
  });
  group.primaryAxisSizingMode = "AUTO"; // re-assert hug after resize()
  return group;
}

var frame = figma.createFrame();
frame.name = "Checkbox / Examples";
frame.layoutMode = "VERTICAL"; frame.primaryAxisSizingMode = "AUTO"; frame.counterAxisSizingMode = "AUTO";
frame.itemSpacing = 32; frame.paddingTop = 40; frame.paddingBottom = 40; frame.paddingLeft = 40; frame.paddingRight = 40;
frame.fills = [{ type: "SOLID", color: { r: 0.98, g: 0.98, b: 0.97 } }];
formPage.appendChild(frame); frame.x = 8300; frame.y = 450;
var title = figma.createText(); title.fontName = { family: "Poppins", style: "SemiBold" };
title.characters = "Checkbox / Examples"; title.fontSize = 20; frame.appendChild(title);
var intro = figma.createText(); intro.fontName = { family: "Poppins", style: "Regular" };
intro.characters = "Checkbox for independent on/off selections. Use Checkbox when multiple options can be selected; use Radio Selector for mutually exclusive choices. Checked state uses brand fill + checkmark (not color alone); indeterminate uses a center bar.";
intro.fontSize = 14; frame.appendChild(intro); intro.layoutSizingHorizontal = "FILL";
var a11y = figma.createText(); a11y.fontName = { family: "Poppins", style: "Regular" };
a11y.characters = "Accessibility: each checkbox has a visible label; description supports (not replaces) the label; focus ring is 2px + offset and not clipped; checked/indeterminate use a visible mark; disabled is exempt from full contrast; groups need a fieldset/legend and text-based error messages.";
a11y.fontSize = 12; frame.appendChild(a11y); a11y.layoutSizingHorizontal = "FILL";

var light = makeSection("Light", lightId); frame.appendChild(light); light.resize(440, light.height);
[
  { title: "Unchecked / Default", cfg: {} },
  { title: "Unchecked / Hover", cfg: { state: "Hover" } },
  { title: "Unchecked / Focus", cfg: { state: "Focus" } },
  { title: "Checked / Default", cfg: { state: "Default", checked: "True" } },
  { title: "Checked / Hover", cfg: { state: "Hover", checked: "True" } },
  { title: "Checked / Focus", cfg: { state: "Focus", checked: "True" } },
  { title: "Indeterminate / Default", cfg: { state: "Default", indeterminate: "True" } },
  { title: "Disabled / Unchecked", cfg: { state: "Disabled" } },
  { title: "Disabled / Checked", cfg: { state: "Disabled", checked: "True" } },
  { title: "Error", cfg: { state: "Error" } },
  { title: "With description", cfg: {} },
  { title: "Without description", cfg: { showDesc: false } }
].forEach(function (ex) { addExample(light, ex.title, ex.cfg); });
addGroup(light, "");

var dark = makeSection("Dark", darkId); frame.appendChild(dark); dark.resize(440, dark.height);
addExample(dark, "Unchecked / Default (Dark)", {});
addExample(dark, "Checked / Default (Dark)", { state: "Default", checked: "True" });
addExample(dark, "Indeterminate (Dark)", { state: "Default", indeterminate: "True" });
addExample(dark, "Error (Dark)", { state: "Error" });
addGroup(dark, "Dark");

return { examplesId: frame.id };
