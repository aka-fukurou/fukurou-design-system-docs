// use_figma — Search Field documentation examples (Light + Dark)
var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
var set = formPage.findOne(function (n) { return n.name === "Search Field"; });
if (!set) return { error: "Search Field set not found" };
var old = formPage.findOne(function (n) { return n.name === "Search Field / Examples"; });
if (old) old.remove();

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
  var base = set.children.find(function (c) {
    return c.name === "State=" + (cfg.state || "Default") + ", Size=" + (cfg.size || "Medium");
  }) || set.children.find(function (c) { return c.name === "State=Default, Size=Medium"; });
  var inst = base.createInstance();
  inst.name = "Search Field";
  row.appendChild(inst);
  inst.layoutSizingHorizontal = "FILL";
  var props = { State: cfg.state || "Default", Size: cfg.size || "Medium" };
  if (cfg.showHelper) props["Show helper text"] = true;
  if (cfg.showError) props["Show error text"] = true;
  if (cfg.showClear) props["Show clear button"] = true;
  if (cfg.noLabel) props["Show label"] = false;
  if (cfg.noHelper) props["Show helper text"] = false;
  try { inst.setProperties(props); } catch (e) {}
}

var frame = figma.createFrame();
frame.name = "Search Field / Examples";
frame.layoutMode = "VERTICAL";
frame.primaryAxisSizingMode = "AUTO";
frame.counterAxisSizingMode = "AUTO";
frame.itemSpacing = 32;
frame.paddingTop = 40; frame.paddingBottom = 40; frame.paddingLeft = 40; frame.paddingRight = 40;
frame.fills = [];
formPage.appendChild(frame);
frame.x = 2100; frame.y = 80;

var title = figma.createText();
title.fontName = { family: "Poppins", style: "SemiBold" };
title.characters = "SEARCH FIELD — Examples";
title.fontSize = 20;
frame.appendChild(title);

var sub = figma.createText();
sub.fontName = { family: "Poppins", style: "Regular" };
sub.characters = "Specialized search input with always-visible search icon, optional clear button, and Text Field–aligned focus/error treatment. Small (40px) and Medium (48px).";
sub.fontSize = 14;
frame.appendChild(sub);

var a11y = figma.createText();
a11y.fontName = { family: "Poppins", style: "Regular" };
a11y.characters = "Accessibility: provide a visible label or accessible name; placeholder is not a label; search icon is decorative; clear button needs label (e.g. Clear search) and keyboard support in code; associate error text programmatically; use type=search when appropriate.";
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
  { title: "Filled with clear button", state: "Filled", showClear: true },
  { title: "Error", state: "Error" },
  { title: "Disabled", state: "Disabled" },
  { title: "With label", state: "Default" },
  { title: "Without label", state: "Default", noLabel: true },
  { title: "With helper text", state: "Default", showHelper: true },
  { title: "Without helper text", state: "Default", noHelper: true },
  { title: "Small", state: "Default", size: "Small" },
  { title: "Medium", state: "Default", size: "Medium" }
];

cfgs.forEach(function (cfg) {
  addExample(light, cfg.title, cfg);
  addExample(dark, cfg.title, cfg);
});

return { frameId: frame.id, exampleCount: cfgs.length * 2 };
