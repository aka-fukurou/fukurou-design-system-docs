// use_figma — Toggle / Switch component set
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
var section = formPage.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Toggle Switch"; });
if (!section) {
  section = figma.createSection(); section.name = "Component/Toggle Switch"; formPage.appendChild(section);
  var cbSec = formPage.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Checkbox"; });
  section.x = cbSec ? cbSec.x + 1100 : 9400; section.y = cbSec ? cbSec.y : -1086;
  section.resizeWithoutConstraints(1100, 1200);
}
var existing = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Toggle / Switch"; });
if (existing) existing.remove();

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var bodyMd = figma.getLocalTextStyles().find(function (s) { return s.name === "body/md"; });
var bodySm = figma.getLocalTextStyles().find(function (s) { return s.name === "body/sm"; });
var borderMd = gv("border/width/md");
var spacing2 = gv("spacing/2");
var trackW = gv("density/switch/track-width");
var trackH = gv("density/switch/track-height");
var thumbSize = gv("density/switch/thumb-size");
var gapTok = gv("density/switch/gap");

var states = ["Default", "Hover", "Focus", "Disabled"];
var cfg = {
  Default: { ring: false },
  Hover: { ring: false },
  Focus: { ring: true },
  Disabled: { ring: false, opacity: 0.6 }
};
var propKeys = {};

function build(state, checked) {
  var c = cfg[state];
  var isOn = checked === "True";
  var disabled = state === "Disabled";
  var st = state.toLowerCase();

  var root = figma.createComponent();
  root.name = "State=" + state + ", Checked=" + checked;
  root.layoutMode = "HORIZONTAL"; root.primaryAxisSizingMode = "AUTO"; root.counterAxisSizingMode = "AUTO";
  root.counterAxisAlignItems = "MIN"; root.primaryAxisAlignItems = "MIN";
  root.setBoundVariable("itemSpacing", gapTok); root.fills = [];
  root.resize(360, 10);

  var controlWrap = root;
  if (c.ring) {
    var focusRing = figma.createFrame();
    focusRing.name = "focus-ring";
    focusRing.layoutMode = "HORIZONTAL"; focusRing.primaryAxisSizingMode = "AUTO"; focusRing.counterAxisSizingMode = "AUTO";
    focusRing.primaryAxisAlignItems = "CENTER"; focusRing.counterAxisAlignItems = "CENTER";
    focusRing.fills = [boundPaint(gv("color/switch/focus/gap"))];
    focusRing.strokes = [boundPaint(gv("color/switch/focus/ring"))];
    focusRing.setBoundVariable("strokeWeight", borderMd); focusRing.strokeAlign = "OUTSIDE";
    ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"].forEach(function (p) { focusRing.setBoundVariable(p, spacing2); });
    focusRing.cornerRadius = 999;
    root.appendChild(focusRing); controlWrap = focusRing;
  }

  var track = figma.createFrame();
  track.name = "track"; track.layoutMode = "NONE"; track.clipsContent = true;
  track.setBoundVariable("width", trackW); track.setBoundVariable("height", trackH);
  track.cornerRadius = 999;
  var trackTok = disabled ? "disabled" : (isOn ? (st === "hover" ? "on/hover" : "on/default") : (st === "hover" ? "off/hover" : "off/default"));
  track.fills = [boundPaint(gv("color/switch/track/" + trackTok))];
  controlWrap.appendChild(track);
  track.layoutSizingHorizontal = "FIXED"; track.layoutSizingVertical = "FIXED";

  var thumb = figma.createEllipse();
  thumb.name = "thumb";
  thumb.setBoundVariable("width", thumbSize); thumb.setBoundVariable("height", thumbSize);
  thumb.fills = [boundPaint(gv("color/switch/thumb/" + (disabled ? "disabled" : isOn ? "on" : "default")))];
  track.appendChild(thumb);
  thumb.x = isOn ? 22 : 2; thumb.y = 2;

  var content = figma.createFrame();
  content.name = "content"; content.layoutMode = "VERTICAL"; content.primaryAxisSizingMode = "AUTO"; content.counterAxisSizingMode = "AUTO";
  content.itemSpacing = 4; content.fills = []; root.appendChild(content);
  content.layoutSizingHorizontal = "FILL";

  var label = figma.createText(); label.name = "label"; label.fontName = { family: "Poppins", style: "Regular" };
  label.characters = "Email notifications"; if (bodyMd) label.textStyleId = bodyMd.id;
  label.fills = [boundPaint(gv("color/switch/label/" + (disabled ? "disabled" : "default")))]; content.appendChild(label);
  label.textAutoResize = "HEIGHT"; label.layoutSizingHorizontal = "FILL";

  var desc = figma.createText(); desc.name = "description"; desc.fontName = { family: "Poppins", style: "Regular" };
  desc.characters = "Receive updates about account activity."; if (bodySm) desc.textStyleId = bodySm.id;
  desc.fills = [boundPaint(gv("color/switch/description/" + (disabled ? "disabled" : "default")))]; content.appendChild(desc);
  desc.textAutoResize = "HEIGHT"; desc.layoutSizingHorizontal = "FILL";

  if (c.opacity) root.opacity = c.opacity;
  root.counterAxisSizingMode = "AUTO";

  if (state === "Default" && checked === "False") {
    propKeys.label = root.addComponentProperty("Label", "TEXT", "Email notifications");
    propKeys.desc = root.addComponentProperty("Description", "TEXT", "Receive updates about account activity.");
    propKeys.showDesc = root.addComponentProperty("Show description", "BOOLEAN", true);
    label.componentPropertyReferences = { characters: propKeys.label };
    desc.componentPropertyReferences = { characters: propKeys.desc, visible: propKeys.showDesc };
  }
  return root;
}

var variants = [];
states.forEach(function (state) {
  variants.push(build(state, "False"));
  variants.push(build(state, "True"));
});
var set = figma.combineAsVariants(variants, section);
set.name = "Toggle / Switch";
set.layoutMode = "HORIZONTAL"; set.layoutWrap = "WRAP"; set.itemSpacing = 24; set.counterAxisSpacing = 24;
set.paddingTop = 32; set.paddingBottom = 32; set.paddingLeft = 32; set.paddingRight = 32;
set.primaryAxisSizingMode = "AUTO"; set.counterAxisSizingMode = "AUTO";
set.children.forEach(function (v) { v.counterAxisSizingMode = "AUTO"; });
set.x = 0; set.y = 0;
set.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; set.cornerRadius = 16;
set.description = "Toggle / Switch — binary on/off settings. State: Default/Hover/Focus/Disabled × Checked True/False. Optional description. On track uses primary action color. Focus: 2px brand ring + 2px gap. Use native switch/checkbox semantics in code.";

function wireSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var keys = { label: key("Label"), desc: key("Description"), showDesc: key("Show description") };
  cs.children.forEach(function (ch) {
    var label = ch.findOne(function (n) { return n.name === "label"; });
    var desc = ch.findOne(function (n) { return n.name === "description"; });
    if (label && keys.label) label.componentPropertyReferences = { characters: keys.label };
    if (desc && keys.desc) desc.componentPropertyReferences = { characters: keys.desc, visible: keys.showDesc };
  });
}
wireSet(set);

return { setId: set.id, variants: set.children.length, sectionId: section.id };
