// use_figma — Textarea examples (Form page)
var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
var set = formPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Textarea"; });
var old = formPage.findOne(function (n) { return n.name === "Textarea / Examples"; });
if (old) old.remove();
if (!set) return { error: "missing Textarea set" };

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

function makeSection(name, modeId) {
  var sec = figma.createFrame();
  sec.name = name;
  sec.layoutMode = "VERTICAL";
  sec.primaryAxisSizingMode = "AUTO";
  sec.counterAxisSizingMode = "AUTO";
  sec.itemSpacing = 24;
  sec.paddingTop = 24; sec.paddingBottom = 24; sec.paddingLeft = 24; sec.paddingRight = 24;
  sec.fills = [boundPaint(pageBg)];
  sec.cornerRadius = 12;
  sec.setExplicitVariableModeForCollection(themeCol, modeId);
  sec.clipsContent = false;
  return sec;
}

function addExample(parent, title, cfg) {
  var row = figma.createFrame();
  row.name = title;
  row.layoutMode = "VERTICAL";
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "FIXED";
  row.resize(360, 10);
  row.itemSpacing = 8;
  row.fills = [];
  parent.appendChild(row);
  row.layoutSizingHorizontal = "FILL";
  var cap = figma.createText();
  cap.name = "caption";
  cap.fontName = { family: "Poppins", style: "SemiBold" };
  cap.characters = title;
  cap.fontSize = 12;
  row.appendChild(cap);
  cap.layoutSizingHorizontal = "FILL";
  var size = cfg.size || "Medium";
  var inst = set.children.find(function (c) { return c.name === "State=" + (cfg.state || "Default") + ", Size=" + size; }).createInstance();
  inst.name = "Textarea";
  row.appendChild(inst);
  inst.layoutSizingHorizontal = "FILL";
  var props = {};
  if (cfg.showHelper) props["Show helper text"] = true;
  if (cfg.showError) props["Show error text"] = true;
  if (cfg.noHelper) props["Show helper text"] = false;
  if (cfg.showCharCount) props["Show character count"] = true;
  if (cfg.required) props["Required"] = true;
  if (cfg.noLabel) props["Show label"] = false;
  try { inst.setProperties(props); } catch (e) {}
}

var frame = figma.createFrame();
frame.name = "Textarea / Examples";
frame.layoutMode = "VERTICAL";
frame.primaryAxisSizingMode = "AUTO";
frame.counterAxisSizingMode = "AUTO";
frame.itemSpacing = 32;
frame.paddingTop = 40; frame.paddingBottom = 40; frame.paddingLeft = 40; frame.paddingRight = 40;
frame.fills = [];
frame.clipsContent = false;
formPage.appendChild(frame);
frame.x = 1200;
frame.y = 900;

var title = figma.createText();
title.fontName = { family: "Poppins", style: "SemiBold" };
title.characters = "TEXTAREA — Examples";
title.fontSize = 20;
frame.appendChild(title);

var sub = figma.createText();
sub.fontName = { family: "Poppins", style: "Regular" };
sub.characters = "Multi-line input for notes, comments, and longer form responses. Aligns with Text Field label, border, focus ring, and support text patterns. Medium (96px min-height) and Large (144px).";
sub.fontSize = 14;
frame.appendChild(sub);
sub.layoutSizingHorizontal = "FILL";

var a11y = figma.createText();
a11y.fontName = { family: "Poppins", style: "Regular" };
a11y.characters = "Accessibility: always provide an accessible label; do not rely on placeholder alone; associate error text programmatically; announce dynamic character counts in code; ensure visible focus; disabled must be non-interactive.";
a11y.fontSize = 12;
frame.appendChild(a11y);
a11y.layoutSizingHorizontal = "FILL";

var light = makeSection("Light", lightId);
frame.appendChild(light);
var dark = makeSection("Dark", darkId);
frame.appendChild(dark);

var cfgs = [
  { title: "Default", state: "Default" },
  { title: "Hover", state: "Hover" },
  { title: "Focus", state: "Focus" },
  { title: "Filled", state: "Filled" },
  { title: "Error", state: "Error", showError: true },
  { title: "Disabled", state: "Disabled" },
  { title: "With helper text", state: "Default", showHelper: true },
  { title: "Without helper text", state: "Default", noHelper: true },
  { title: "With character count", state: "Default", showCharCount: true },
  { title: "Medium", state: "Default", size: "Medium" },
  { title: "Large", state: "Default", size: "Large" }
];

cfgs.forEach(function (cfg) {
  addExample(light, cfg.title, cfg);
  addExample(dark, cfg.title, cfg);
});

return { frameId: frame.id, exampleCount: cfgs.length * 2 };
