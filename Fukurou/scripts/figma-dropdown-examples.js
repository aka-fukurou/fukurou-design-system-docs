// use_figma — Dropdown / Examples + naming docs §15
var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
var dropdownSet = formPage.findOne(function (n) { return n.name === "Dropdown"; });
var menuComp = formPage.findOne(function (n) { return n.name === "Dropdown / Menu"; });
var old = formPage.findOne(function (n) { return n.name === "Dropdown / Examples"; });
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
  sec.name = name; sec.layoutMode = "VERTICAL"; sec.primaryAxisSizingMode = "AUTO"; sec.counterAxisSizingMode = "AUTO";
  sec.itemSpacing = 24; sec.paddingTop = 24; sec.paddingBottom = 24; sec.paddingLeft = 24; sec.paddingRight = 24;
  sec.fills = [boundPaint(pageBg)]; sec.cornerRadius = 12; sec.setExplicitVariableModeForCollection(themeCol, modeId);
  return sec;
}
function addExample(parent, title, cfg) {
  var row = figma.createFrame();
  row.name = title; row.layoutMode = "VERTICAL"; row.primaryAxisSizingMode = "AUTO"; row.counterAxisSizingMode = "FIXED";
  row.resize(360, 10); row.itemSpacing = 8; row.fills = []; parent.appendChild(row); row.layoutSizingHorizontal = "FILL";
  var cap = figma.createText(); cap.name = "caption"; cap.fontName = { family: "Poppins", style: "SemiBold" };
  cap.characters = title; cap.fontSize = 12; row.appendChild(cap); cap.layoutSizingHorizontal = "FILL";
  var base = dropdownSet.children.find(function (c) { return c.name.indexOf("State=" + (cfg.state || "Default")) >= 0 && c.name.indexOf("Size=" + (cfg.size || "Medium")) >= 0; });
  var inst = base.createInstance(); inst.name = "Dropdown"; row.appendChild(inst); inst.layoutSizingHorizontal = "FILL";
  var props = { State: cfg.state || "Default", Size: cfg.size || "Medium" };
  if (cfg.showHelper) props["Show helper text"] = true;
  if (cfg.required) props["Required"] = true;
  if (cfg.showLead) props["Show leading icon"] = true;
  if (cfg.noLabel) props["Show label"] = false;
  try { inst.setProperties(props); } catch (e) {}
}
var frame = figma.createFrame();
frame.name = "Dropdown / Examples";
frame.layoutMode = "VERTICAL"; frame.primaryAxisSizingMode = "AUTO"; frame.counterAxisSizingMode = "AUTO";
frame.itemSpacing = 32; frame.paddingTop = 40; frame.paddingBottom = 40; frame.paddingLeft = 40; frame.paddingRight = 40;
frame.fills = [{ type: "SOLID", color: { r: 0.98, g: 0.98, b: 0.97 } }];
formPage.appendChild(frame); frame.x = 720; frame.y = 80;
var title = figma.createText(); title.fontName = { family: "Poppins", style: "SemiBold" }; title.characters = "Dropdown / Examples";
title.fontSize = 20; frame.appendChild(title);
var intro = figma.createText(); intro.fontName = { family: "Poppins", style: "Regular" };
intro.characters = "Friendly rounded form select — shares control borders, focus ring, and support text patterns with Text Field. Inspired by tax-product form UI, adapted to Fukurou.";
intro.fontSize = 14; intro.layoutSizingHorizontal = "FILL"; frame.appendChild(intro);
var light = makeSection("Light", lightId); frame.appendChild(light); light.layoutSizingHorizontal = "FILL";
[
  { title: "Default", cfg: {} },
  { title: "Hover", cfg: { state: "Hover" } },
  { title: "Focus", cfg: { state: "Focus" } },
  { title: "Filled", cfg: { state: "Filled" } },
  { title: "Error", cfg: { state: "Error" } },
  { title: "Disabled", cfg: { state: "Disabled" } },
  { title: "With helper text", cfg: { showHelper: true } },
  { title: "Required", cfg: { required: true } },
  { title: "With leading icon", cfg: { showLead: true } },
  { title: "Small", cfg: { size: "Small" } }
].forEach(function (ex) { addExample(light, ex.title, ex.cfg); });
var dark = makeSection("Dark", darkId); frame.appendChild(dark); dark.layoutSizingHorizontal = "FILL";
addExample(dark, "Default (Dark)", {});
addExample(dark, "Filled (Dark)", { state: "Filled" });
addExample(dark, "Error (Dark)", { state: "Error" });
var openRow = figma.createFrame();
openRow.name = "Open menu"; openRow.layoutMode = "VERTICAL"; openRow.primaryAxisSizingMode = "AUTO"; openRow.counterAxisSizingMode = "FIXED";
openRow.resize(360, 10); openRow.itemSpacing = 8; openRow.fills = []; light.appendChild(openRow); openRow.layoutSizingHorizontal = "FILL";
var openCap = figma.createText(); openCap.fontName = { family: "Poppins", style: "SemiBold" }; openCap.characters = "Open menu";
openCap.fontSize = 12; openRow.appendChild(openCap);
var openWrap = figma.createFrame(); openWrap.name = "open-example"; openWrap.layoutMode = "VERTICAL"; openWrap.itemSpacing = 4;
openWrap.fills = []; openWrap.primaryAxisSizingMode = "AUTO"; openWrap.counterAxisSizingMode = "FIXED"; openWrap.resize(320, 10);
openRow.appendChild(openWrap); openWrap.layoutSizingHorizontal = "FILL";
var trig = dropdownSet.children.find(function (c) { return c.name === "State=Filled, Size=Medium"; }).createInstance();
trig.name = "Dropdown"; openWrap.appendChild(trig); trig.layoutSizingHorizontal = "FILL";
var menuInst = menuComp.createInstance(); menuInst.name = "Dropdown / Menu"; openWrap.appendChild(menuInst); menuInst.layoutSizingHorizontal = "FILL";

var namingPage = figma.root.children.find(function (p) { return p.name === "_Naming, Theme, Density & Responsive"; });
await figma.setCurrentPageAsync(namingPage);
var docsFrame = namingPage.findOne(function (n) { return n.name.indexOf("Documentation") >= 0 || n.type === "FRAME"; });
var docParent = namingPage.children.find(function (n) { return n.type === "FRAME" && n.name.indexOf("Naming") >= 0; }) || namingPage.children[1] || namingPage;
var oldSec = namingPage.findOne(function (n) { return n.name === "15 · DROPDOWN"; });
if (oldSec) oldSec.remove();
var sec = figma.createFrame();
sec.name = "15 · DROPDOWN";
sec.layoutMode = "VERTICAL"; sec.primaryAxisSizingMode = "AUTO"; sec.counterAxisSizingMode = "FIXED"; sec.resize(720, 10);
sec.itemSpacing = 12; sec.paddingTop = 24; sec.paddingBottom = 24; sec.paddingLeft = 24; sec.paddingRight = 24;
sec.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]; sec.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.88 } }]; sec.strokeWeight = 1;
namingPage.appendChild(sec); sec.x = 80; sec.y = 5200;
function line(text, bold) {
  var t = figma.createText(); t.fontName = { family: "Poppins", style: bold ? "SemiBold" : "Regular" };
  t.characters = text; t.fontSize = bold ? 14 : 12; t.layoutSizingHorizontal = "FILL"; sec.appendChild(t); return t;
}
line("15 · DROPDOWN", true);
line("Component sets: Dropdown (trigger) · Dropdown / Menu / Option · Dropdown / Menu", false);
line("Tokens: color/dropdown/* · color/dropdown-menu/* · density/dropdown/* · elevation/dropdown/default", false);
line("States: Default · Hover · Focus · Filled · Error · Disabled — Sizes: Small · Medium", false);
line("Focus: 2px ring + 2px offset (color/dropdown/focus/*). Error text below trigger in support-text.", false);
line("Menu: Elevation / Popover + color/dropdown-menu/* — selected option uses checkmark + primary subtle bg.", false);
line("Accessibility: visible label; placeholder does not replace label; error is text; focus ring required; use correct select/listbox semantics in code.", false);

return { examplesId: frame.id, docsSectionId: sec.id, openExample: openWrap.id };
