// use_figma — Checkbox component set
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
var section = formPage.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Checkbox"; });
if (!section) {
  section = figma.createSection();
  section.name = "Component/Checkbox";
  formPage.appendChild(section);
  section.x = 8300; section.y = -1086;
  section.resizeWithoutConstraints(1000, 1400);
}
var existing = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Checkbox"; });
if (existing) existing.remove();

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var bodyMd = figma.getLocalTextStyles().find(function (s) { return s.name === "body/md"; });
var bodySm = figma.getLocalTextStyles().find(function (s) { return s.name === "body/sm"; });
var radius4 = gv("radius/4");
var borderSm = gv("border/width/sm");
var borderMd = gv("border/width/md");
var spacing2 = gv("spacing/2");
var ctrlSize = gv("density/checkbox/control-size");
var markSize = gv("density/checkbox/mark-size");
var indWidth = gv("density/checkbox/indeterminate-width");
var gapTok = gv("density/checkbox/gap");

var states = ["Default", "Hover", "Focus", "Disabled", "Error"];
var cfg = {
  Default: { uncheckedBg: "default", uncheckedBorder: "default", label: "default", desc: "default", ring: false },
  Hover: { uncheckedBg: "hover", uncheckedBorder: "hover", label: "default", desc: "default", ring: false },
  Focus: { uncheckedBg: "default", uncheckedBorder: "focus", label: "default", desc: "default", ring: true },
  Disabled: { uncheckedBg: "disabled", uncheckedBorder: "disabled", label: "disabled", desc: "disabled", ring: false, opacity: 0.6 },
  Error: { uncheckedBg: "error", uncheckedBorder: "error", label: "error", desc: "error", ring: false }
};

var propKeys = {};
function build(state, checked, indeterminate) {
  var c = cfg[state];
  var isChecked = checked === "True";
  var isInd = indeterminate === "True";
  var filled = (isChecked || isInd);
  var disabled = state === "Disabled";

  var root = figma.createComponent();
  root.name = "State=" + state + ", Checked=" + checked + ", Indeterminate=" + indeterminate;
  root.layoutMode = "HORIZONTAL"; root.primaryAxisSizingMode = "AUTO"; root.counterAxisSizingMode = "AUTO";
  root.counterAxisAlignItems = "MIN"; root.primaryAxisAlignItems = "MIN";
  root.setBoundVariable("itemSpacing", gapTok); root.fills = [];
  root.resize(360, 10);

  // Optional focus ring wrapper around the control only
  var indicatorWrap = root;
  if (c.ring) {
    var focusRing = figma.createFrame();
    focusRing.name = "focus-ring";
    focusRing.layoutMode = "HORIZONTAL"; focusRing.primaryAxisSizingMode = "AUTO"; focusRing.counterAxisSizingMode = "AUTO";
    focusRing.primaryAxisAlignItems = "CENTER"; focusRing.counterAxisAlignItems = "CENTER";
    focusRing.fills = [boundPaint(gv("color/checkbox/focus/gap"))];
    focusRing.strokes = [boundPaint(gv("color/checkbox/focus/ring"))];
    focusRing.setBoundVariable("strokeWeight", borderMd); focusRing.strokeAlign = "OUTSIDE";
    ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"].forEach(function (p) { focusRing.setBoundVariable(p, spacing2); });
    focusRing.setBoundVariable("cornerRadius", radius4);
    root.appendChild(focusRing); indicatorWrap = focusRing;
  }

  // Control box
  var box = figma.createFrame();
  box.name = "checkbox-indicator";
  box.layoutMode = "HORIZONTAL"; box.primaryAxisSizingMode = "FIXED"; box.counterAxisSizingMode = "FIXED";
  box.primaryAxisAlignItems = "CENTER"; box.counterAxisAlignItems = "CENTER";
  box.setBoundVariable("width", ctrlSize); box.setBoundVariable("height", ctrlSize);
  var bgTok = disabled ? "disabled" : (isInd ? "indeterminate" : (isChecked ? "checked" : c.uncheckedBg));
  var borderTok = disabled ? "disabled" : (isInd ? "indeterminate" : (isChecked ? "checked" : c.uncheckedBorder));
  if (state === "Error" && filled && !disabled) borderTok = "error";
  box.fills = [boundPaint(gv("color/checkbox/background/" + bgTok))];
  box.strokes = [boundPaint(gv("color/checkbox/border/" + borderTok))];
  box.setBoundVariable("strokeWeight", borderSm); box.strokeAlign = "INSIDE";
  box.setBoundVariable("cornerRadius", radius4);
  box.clipsContent = false;
  indicatorWrap.appendChild(box);
  box.layoutSizingHorizontal = "FIXED"; box.layoutSizingVertical = "FIXED";

  var markTok = disabled ? "disabled" : (isInd ? "indeterminate" : "checked");

  // Checkmark (visible when checked & not indeterminate)
  var checkWrap = figma.createFrame();
  checkWrap.name = "checkmark";
  checkWrap.layoutMode = "HORIZONTAL"; checkWrap.primaryAxisSizingMode = "FIXED"; checkWrap.counterAxisSizingMode = "FIXED";
  checkWrap.setBoundVariable("width", markSize); checkWrap.setBoundVariable("height", markSize);
  checkWrap.fills = [];
  var check = figma.createVector();
  check.name = "check-vector";
  check.vectorPaths = [{ windingRule: "NONZERO", data: "M 2 6.5 L 5 9.5 L 10 3" }];
  check.strokes = [boundPaint(gv("color/checkbox/mark/" + markTok))];
  check.strokeWeight = 2; check.strokeCap = "ROUND"; check.strokeJoin = "ROUND"; check.fills = [];
  checkWrap.appendChild(check);
  check.x = 0; check.y = 0; check.resize(12, 12);
  check.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  box.appendChild(checkWrap);
  checkWrap.layoutSizingHorizontal = "FIXED"; checkWrap.layoutSizingVertical = "FIXED";
  checkWrap.visible = isChecked && !isInd;

  // Indeterminate bar (visible when indeterminate)
  var indBar = figma.createRectangle();
  indBar.name = "indeterminate-mark";
  indBar.setBoundVariable("width", indWidth);
  indBar.resize(10, 2);
  indBar.cornerRadius = 1;
  indBar.fills = [boundPaint(gv("color/checkbox/mark/" + markTok))];
  box.appendChild(indBar);
  indBar.visible = isInd;

  // Content
  var content = figma.createFrame();
  content.name = "content"; content.layoutMode = "VERTICAL"; content.primaryAxisSizingMode = "AUTO"; content.counterAxisSizingMode = "AUTO";
  content.itemSpacing = 4; content.fills = []; root.appendChild(content);
  content.layoutSizingHorizontal = "FILL";

  var label = figma.createText(); label.name = "label"; label.fontName = { family: "Poppins", style: "Regular" };
  label.characters = "I agree to the terms"; if (bodyMd) label.textStyleId = bodyMd.id;
  label.fills = [boundPaint(gv("color/checkbox/label/" + c.label))]; content.appendChild(label);
  label.textAutoResize = "HEIGHT"; label.layoutSizingHorizontal = "FILL";

  var desc = figma.createText(); desc.name = "description"; desc.fontName = { family: "Poppins", style: "Regular" };
  desc.characters = "You can update your preferences later."; if (bodySm) desc.textStyleId = bodySm.id;
  desc.fills = [boundPaint(gv("color/checkbox/description/" + c.desc))]; content.appendChild(desc);
  desc.textAutoResize = "HEIGHT"; desc.layoutSizingHorizontal = "FILL";

  if (c.opacity) root.opacity = c.opacity;

  // resize() above flips hug axes to FIXED; re-assert vertical hug.
  root.counterAxisSizingMode = "AUTO";

  if (state === "Default" && checked === "False" && indeterminate === "False") {
    propKeys.label = root.addComponentProperty("Label", "TEXT", "I agree to the terms");
    propKeys.desc = root.addComponentProperty("Description", "TEXT", "You can update your preferences later.");
    propKeys.showDesc = root.addComponentProperty("Show description", "BOOLEAN", true);
    label.componentPropertyReferences = { characters: propKeys.label };
    desc.componentPropertyReferences = { characters: propKeys.desc, visible: propKeys.showDesc };
  }
  return root;
}

var variants = [];
states.forEach(function (state) {
  [["False", "False"], ["True", "False"], ["False", "True"]].forEach(function (combo) {
    variants.push(build(state, combo[0], combo[1]));
  });
});
var set = figma.combineAsVariants(variants, section);
set.name = "Checkbox";
set.layoutMode = "HORIZONTAL"; set.layoutWrap = "WRAP"; set.itemSpacing = 24; set.counterAxisSpacing = 24;
set.paddingTop = 32; set.paddingBottom = 32; set.paddingLeft = 32; set.paddingRight = 32;
set.primaryAxisSizingMode = "AUTO"; set.counterAxisSizingMode = "AUTO";
set.children.forEach(function (v) { v.counterAxisSizingMode = "AUTO"; });
set.x = 0; set.y = 0;
set.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; set.cornerRadius = 16;
set.description = "Checkbox — independent on/off selection. State: Default/Hover/Focus/Disabled/Error. Checked: True/False. Indeterminate: True/False. Optional description. Focus: offset 2px ring. Tokens: color/checkbox/*. Use Radio Selector for mutually exclusive choices.";

function wireCheckboxSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var keys = { label: key("Label"), desc: key("Description"), showDesc: key("Show description") };
  cs.children.forEach(function (ch) {
    var label = ch.findOne(function (n) { return n.name === "label"; });
    var desc = ch.findOne(function (n) { return n.name === "description"; });
    if (label && keys.label) label.componentPropertyReferences = { characters: keys.label };
    if (desc && keys.desc) desc.componentPropertyReferences = { characters: keys.desc, visible: keys.showDesc };
  });
}
wireCheckboxSet(set);

return { setId: set.id, variants: set.children.length, sectionId: section.id, propKeys: propKeys };
