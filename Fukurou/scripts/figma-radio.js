// use_figma — Radio Selector component set
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function resolveColor(variable) {
  var v = variable, g = 0;
  while (v && g++ < 12) {
    var mid = Object.keys(v.valuesByMode)[0];
    var val = v.valuesByMode[mid];
    if (val && val.type === "VARIABLE_ALIAS") v = figma.variables.getVariableById(val.id);
    else return val;
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}
function boundPaint(variable) {
  var c = resolveColor(variable);
  return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: c.r, g: c.g, b: c.b }, opacity: c.a === undefined ? 1 : c.a }, "color", variable);
}

var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
var section = formPage.findOne(function (n) { return n.name === "Component/Radio Selector"; });
if (!section) {
  section = figma.createSection();
  section.name = "Component/Radio Selector";
  formPage.appendChild(section);
  section.x = 80; section.y = 2600;
  section.resizeWithoutConstraints(900, 600);
}
var existing = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Radio Selector"; });
if (existing) existing.remove();

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var bodyMd = figma.getLocalTextStyles().find(function (s) { return s.name === "body/md"; });
var bodySm = figma.getLocalTextStyles().find(function (s) { return s.name === "body/sm"; });
var radiusFull = gv("radius/full");
var borderSm = gv("border/width/sm");
var borderMd = gv("border/width/md");
var spacing2 = gv("spacing/2");
var ctrlSize = gv("density/radio/control-size");
var dotSize = gv("density/radio/dot-size");
var gapTok = gv("density/radio/gap");

var states = ["Default", "Hover", "Focus", "Disabled", "Error"];
var selectedVals = ["False", "True"];
var cfg = {
  Default: { bg: "default", border: "default", borderSel: "selected", label: "default", desc: "default", ring: false },
  Hover: { bg: "hover", border: "hover", borderSel: "selected", label: "default", desc: "default", ring: false },
  Focus: { bg: "default", border: "focus", borderSel: "selected", label: "default", desc: "default", ring: true },
  Disabled: { bg: "disabled", border: "disabled", borderSel: "disabled", label: "disabled", desc: "disabled", ring: false, opacity: 0.6 },
  Error: { bg: "error", border: "error", borderSel: "error", label: "error", desc: "error", ring: false }
};

var propKeys = {};
function build(state, selected) {
  var c = cfg[state];
  var isSel = selected === "True";
  var root = figma.createComponent();
  root.name = "State=" + state + ", Selected=" + selected;
  root.layoutMode = "HORIZONTAL"; root.primaryAxisSizingMode = "AUTO"; root.counterAxisSizingMode = "AUTO";
  root.counterAxisAlignItems = "MIN"; root.primaryAxisAlignItems = "MIN";
  root.setBoundVariable("itemSpacing", gapTok); root.fills = [];
  root.resize(360, 10);

  var indicatorWrap = root;
  if (c.ring) {
    var focusRing = figma.createFrame();
    focusRing.name = "focus-ring";
    focusRing.layoutMode = "HORIZONTAL"; focusRing.primaryAxisSizingMode = "AUTO"; focusRing.counterAxisSizingMode = "AUTO";
    focusRing.primaryAxisAlignItems = "CENTER"; focusRing.counterAxisAlignItems = "CENTER";
    focusRing.fills = [boundPaint(gv("color/radio/focus/gap"))];
    focusRing.strokes = [boundPaint(gv("color/radio/focus/ring"))];
    focusRing.setBoundVariable("strokeWeight", borderMd); focusRing.strokeAlign = "OUTSIDE";
    ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"].forEach(function (p) { focusRing.setBoundVariable(p, spacing2); });
    focusRing.setBoundVariable("cornerRadius", radiusFull);
    root.appendChild(focusRing); indicatorWrap = focusRing;
  }

  var indicator = figma.createFrame();
  indicator.name = "radio-indicator";
  indicator.layoutMode = "HORIZONTAL"; indicator.primaryAxisSizingMode = "FIXED"; indicator.counterAxisSizingMode = "FIXED";
  indicator.primaryAxisAlignItems = "CENTER"; indicator.counterAxisAlignItems = "CENTER";
  indicator.setBoundVariable("width", ctrlSize); indicator.setBoundVariable("height", ctrlSize);
  indicator.fills = [boundPaint(gv("color/radio/background/" + c.bg))];
  var borderTok = isSel ? c.borderSel : c.border;
  indicator.strokes = [boundPaint(gv("color/radio/border/" + borderTok))];
  indicator.setBoundVariable("strokeWeight", borderSm); indicator.strokeAlign = "INSIDE";
  indicator.setBoundVariable("cornerRadius", radiusFull);
  indicatorWrap.appendChild(indicator);
  indicator.layoutSizingHorizontal = "FIXED"; indicator.layoutSizingVertical = "FIXED";

  var dot = figma.createEllipse();
  dot.name = "selected-dot";
  dot.setBoundVariable("width", dotSize); dot.setBoundVariable("height", dotSize);
  dot.fills = [boundPaint(gv(state === "Disabled" && isSel ? "color/radio/dot/disabled" : "color/radio/dot/selected"))];
  dot.visible = isSel;
  indicator.appendChild(dot);

  var content = figma.createFrame();
  content.name = "content"; content.layoutMode = "VERTICAL"; content.primaryAxisSizingMode = "AUTO"; content.counterAxisSizingMode = "AUTO";
  content.itemSpacing = 4; content.fills = []; root.appendChild(content);
  content.layoutSizingHorizontal = "FILL";

  var label = figma.createText(); label.name = "label"; label.fontName = { family: "Poppins", style: "Regular" };
  label.characters = "Individual"; if (bodyMd) label.textStyleId = bodyMd.id;
  label.fills = [boundPaint(gv("color/radio/label/" + c.label))]; content.appendChild(label);
  label.textAutoResize = "HEIGHT"; label.layoutSizingHorizontal = "FILL";

  var desc = figma.createText(); desc.name = "description"; desc.fontName = { family: "Poppins", style: "Regular" };
  desc.characters = "Select this option if you are filing for yourself."; if (bodySm) desc.textStyleId = bodySm.id;
  desc.fills = [boundPaint(gv("color/radio/description/" + c.desc))]; content.appendChild(desc);
  desc.textAutoResize = "HEIGHT"; desc.layoutSizingHorizontal = "FILL";

  if (c.opacity) root.opacity = c.opacity;

  if (state === "Default" && selected === "False") {
    propKeys.label = root.addComponentProperty("Label", "TEXT", "Individual");
    propKeys.desc = root.addComponentProperty("Description", "TEXT", "Select this option if you are filing for yourself.");
    propKeys.showDesc = root.addComponentProperty("Show description", "BOOLEAN", true);
    label.componentPropertyReferences = { characters: propKeys.label };
    desc.componentPropertyReferences = { characters: propKeys.desc, visible: propKeys.showDesc };
  }
  return root;
}

var variants = [];
states.forEach(function (state) {
  selectedVals.forEach(function (sel) { variants.push(build(state, sel)); });
});
var set = figma.combineAsVariants(variants, section);
set.name = "Radio Selector";
set.layoutMode = "HORIZONTAL"; set.layoutWrap = "WRAP"; set.itemSpacing = 24; set.counterAxisSpacing = 24;
set.paddingTop = 32; set.paddingBottom = 32; set.paddingLeft = 32; set.paddingRight = 32;
set.primaryAxisSizingMode = "AUTO"; set.counterAxisSizingMode = "AUTO";
set.x = 0; set.y = 0;
set.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; set.cornerRadius = 16;
set.description = "Radio Selector — mutually exclusive choice. States: Default/Hover/Focus/Disabled/Error. Selected: True/False. Optional description. Focus: offset ring on indicator. Tokens: color/radio/*.";

function wireRadioSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var keys = { label: key("Label"), desc: key("Description"), showDesc: key("Show description") };
  cs.children.forEach(function (ch) {
    var label = ch.findOne(function (n) { return n.name === "label"; });
    var desc = ch.findOne(function (n) { return n.name === "description"; });
    if (label && keys.label) label.componentPropertyReferences = { characters: keys.label };
    if (desc && keys.desc) desc.componentPropertyReferences = { characters: keys.desc, visible: keys.showDesc };
  });
}
wireRadioSet(set);

return { setId: set.id, variants: set.children.length, sectionId: section.id, propKeys: propKeys };
