// use_figma — Search Field component + search icon set
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
function bindIcon(node, token) {
  node.findAll(function (n) { return ("fills" in n || "strokes" in n) && n.type !== "INSTANCE"; }).forEach(function (n) {
    var paint = boundPaint(token);
    if ("fills" in n && n.fills.length >= 0) try { n.fills = [paint]; } catch (e) {}
    if ("strokes" in n && n.strokeWeight > 0) try { n.strokes = [paint]; } catch (e) {}
  });
}
function makeSearchGlyph(size) {
  var wrap = figma.createFrame();
  wrap.name = "glyph";
  wrap.resize(size, size);
  wrap.fills = [];
  wrap.clipsContent = false;
  var lens = figma.createEllipse();
  lens.resize(size * 0.55, size * 0.55);
  lens.x = size * 0.125;
  lens.y = size * 0.125;
  lens.fills = [];
  lens.strokes = [boundPaint(gv("color/text/subtle"))];
  lens.strokeWeight = Math.max(1.5, size / 10);
  wrap.appendChild(lens);
  var handle = figma.createVector();
  handle.name = "handle";
  handle.vectorPaths = [{ windingRule: "NONZERO", data: "M " + (size * 0.575) + " " + (size * 0.575) + " L " + (size * 0.8125) + " " + (size * 0.8125) }];
  handle.strokes = lens.strokes;
  handle.strokeWeight = lens.strokeWeight;
  handle.strokeCap = "ROUND";
  handle.fills = [];
  wrap.appendChild(handle);
  return wrap;
}
function buildIconSet(page, name, yPos) {
  function variant(size) {
    var c = figma.createComponent(); c.name = "Size=" + size; c.resize(size, size); c.fills = [];
    c.appendChild(makeSearchGlyph(size)); return c;
  }
  var c16 = variant(16), c20 = variant(20);
  page.appendChild(c16); c16.x = 1600; c16.y = yPos;
  page.appendChild(c20); c20.x = 1600; c20.y = yPos + 80;
  var set = figma.combineAsVariants([c16, c20], page);
  set.name = name; set.x = 1580; set.y = yPos - 20;
  return set;
}
function clearButton(size, tokenName) {
  var wrap = figma.createFrame();
  wrap.name = "clear-button";
  wrap.resize(size, size);
  wrap.fills = [];
  wrap.clipsContent = false;
  wrap.layoutMode = "NONE";
  var g = figma.createVector();
  g.name = "icon";
  g.vectorPaths = [{ windingRule: "NONZERO", data: "M " + (size * 0.3125) + " " + (size * 0.3125) + " L " + (size * 0.6875) + " " + (size * 0.6875) + " M " + (size * 0.6875) + " " + (size * 0.3125) + " L " + (size * 0.3125) + " " + (size * 0.6875) }];
  g.strokes = [boundPaint(gv(tokenName))];
  g.strokeWeight = Math.max(1.5, size / 10);
  g.strokeCap = "ROUND";
  g.fills = [];
  wrap.appendChild(g);
  g.x = 0; g.y = 0; g.resize(size, size);
  g.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  return wrap;
}

var search16 = figma.getNodeById("527:145");
var search20 = figma.getNodeById("527:149");
if (!search16 || !search20) {
  var cardsPage = figma.root.children.find(function (p) { return p.name === "Cards"; });
  await figma.setCurrentPageAsync(cardsPage);
  var searchSet = cardsPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Icon / Placeholder / Search"; });
  if (!searchSet) searchSet = buildIconSet(cardsPage, "Icon / Placeholder / Search", 720);
  search16 = searchSet.children.find(function (c) { return c.name === "Size=16"; });
  search20 = searchSet.children.find(function (c) { return c.name === "Size=20"; });
}

var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
if (!formPage) { formPage = figma.createPage(); formPage.name = "Form"; }
await figma.setCurrentPageAsync(formPage);
var existing = formPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Search Field"; });
if (existing) existing.remove();

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var bodySm = figma.getLocalTextStyles().find(function (s) { return s.name === "body/sm"; });
var bodyMd = figma.getLocalTextStyles().find(function (s) { return s.name === "body/md"; });
var caption = figma.getLocalTextStyles().find(function (s) { return s.name === "caption/md"; });

var radius8 = gv("radius/8");
var borderSm = gv("border/width/sm");
var borderMd = gv("border/width/md");
var gapTok = gv("density/text-field/gap");
var spacing2 = gv("spacing/2");

var states = ["Default", "Hover", "Focus", "Filled", "Error", "Disabled"];
var sizes = ["Small", "Medium"];
var cfg = {
  Default: { bg: "default", border: "default", label: "default", input: "placeholder", icon: "default", clear: "default", chars: "placeholder", showClear: false },
  Hover: { bg: "default", border: "hover", label: "default", input: "placeholder", icon: "default", clear: "default", chars: "placeholder", showClear: false },
  Focus: { bg: "focus", border: "focus", label: "focus", input: "placeholder", icon: "focus", clear: "default", chars: "placeholder", ring: true, showClear: false },
  Filled: { bg: "filled", border: "default", label: "default", input: "value", icon: "default", clear: "default", chars: "value", showClear: true },
  Error: { bg: "error", border: "error", label: "error", input: "value", icon: "error", clear: "default", chars: "value", showClear: false },
  Disabled: { bg: "disabled", border: "disabled", label: "disabled", input: "disabled", icon: "disabled", clear: "disabled", chars: "placeholder", opacity: 0.6, showClear: false }
};

var propKeys = {};
function build(state, size) {
  var c = cfg[state];
  var heightTok = gv(size === "Small" ? "density/text-field/small/height" : "density/text-field/medium/height");
  var padTok = gv(size === "Small" ? "density/text-field/small/padding-x" : "density/text-field/medium/padding-x");
  var searchComp = size === "Small" ? search16 : search20;
  var iconSize = size === "Small" ? 16 : 20;
  var textStyle = size === "Small" ? bodySm : bodyMd;

  var root = figma.createComponent();
  root.name = "State=" + state + ", Size=" + size;
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "FIXED";
  root.resize(320, 10);
  root.setBoundVariable("itemSpacing", spacing2);
  root.fills = [];

  var labelRow = figma.createFrame();
  labelRow.name = "label-row";
  labelRow.layoutMode = "HORIZONTAL";
  labelRow.primaryAxisSizingMode = "AUTO";
  labelRow.counterAxisSizingMode = "AUTO";
  labelRow.itemSpacing = 4;
  labelRow.fills = [];
  root.appendChild(labelRow);
  labelRow.layoutSizingHorizontal = "FILL";
  labelRow.layoutSizingVertical = "HUG";

  var label = figma.createText();
  label.name = "label";
  label.fontName = { family: "Poppins", style: "SemiBold" };
  label.characters = "Search";
  if (bodySm) label.textStyleId = bodySm.id;
  label.fills = [boundPaint(gv("color/search-field/label/" + c.label))];
  labelRow.appendChild(label);
  label.textAutoResize = "WIDTH_AND_HEIGHT";
  label.layoutSizingHorizontal = "HUG";
  label.layoutSizingVertical = "HUG";

  var inputWrap = root;
  if (c.ring) {
    var focusRing = figma.createFrame();
    focusRing.name = "focus-ring";
    focusRing.layoutMode = "HORIZONTAL";
    focusRing.primaryAxisSizingMode = "AUTO";
    focusRing.counterAxisSizingMode = "AUTO";
    focusRing.fills = [boundPaint(gv("color/search-field/focus/gap"))];
    focusRing.strokes = [boundPaint(gv("color/search-field/focus/ring"))];
    focusRing.setBoundVariable("strokeWeight", borderMd);
    focusRing.strokeAlign = "OUTSIDE";
    focusRing.setBoundVariable("paddingTop", spacing2);
    focusRing.setBoundVariable("paddingBottom", spacing2);
    focusRing.setBoundVariable("paddingLeft", spacing2);
    focusRing.setBoundVariable("paddingRight", spacing2);
    ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) {
      focusRing.setBoundVariable(k, radius8);
    });
    root.appendChild(focusRing);
    focusRing.layoutSizingHorizontal = "FILL";
    inputWrap = focusRing;
  }

  var input = figma.createFrame();
  input.name = "input-container";
  input.layoutMode = "HORIZONTAL";
  input.primaryAxisSizingMode = "FIXED";
  input.counterAxisSizingMode = "FIXED";
  input.counterAxisAlignItems = "CENTER";
  input.primaryAxisAlignItems = "CENTER";
  input.setBoundVariable("height", heightTok);
  input.setBoundVariable("paddingLeft", padTok);
  input.setBoundVariable("paddingRight", padTok);
  input.setBoundVariable("itemSpacing", gapTok);
  input.fills = [boundPaint(gv("color/search-field/background/" + c.bg))];
  input.strokes = [boundPaint(gv("color/search-field/border/" + c.border))];
  input.setBoundVariable("strokeWeight", borderSm);
  input.strokeAlign = "INSIDE";
  ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) {
    input.setBoundVariable(k, radius8);
  });
  inputWrap.appendChild(input);
  input.layoutSizingHorizontal = "FILL";

  var searchIcon = searchComp.createInstance();
  searchIcon.name = "search-icon";
  input.appendChild(searchIcon);
  searchIcon.layoutSizingHorizontal = "FIXED";
  searchIcon.layoutSizingVertical = "FIXED";
  bindIcon(searchIcon, gv("color/search-field/icon/" + c.icon));

  var placeholderText = figma.createText();
  placeholderText.name = "placeholder-text";
  placeholderText.fontName = { family: "Poppins", style: "Regular" };
  placeholderText.characters = "Search";
  if (textStyle) placeholderText.textStyleId = textStyle.id;
  var phTok = c.input === "disabled" ? "color/search-field/text/disabled" : "color/search-field/text/placeholder";
  placeholderText.fills = [boundPaint(gv(phTok))];
  placeholderText.visible = c.chars === "placeholder";
  input.appendChild(placeholderText);
  placeholderText.textAutoResize = "HEIGHT";
  placeholderText.layoutSizingHorizontal = "FILL";
  placeholderText.layoutSizingVertical = "HUG";

  var valueText = figma.createText();
  valueText.name = "value-text";
  valueText.fontName = { family: "Poppins", style: "Regular" };
  valueText.characters = "Design system";
  if (textStyle) valueText.textStyleId = textStyle.id;
  var valueTok = c.input === "disabled" ? "color/search-field/text/disabled" : "color/search-field/text/value";
  valueText.fills = [boundPaint(gv(valueTok))];
  valueText.visible = c.chars === "value";
  input.appendChild(valueText);
  valueText.textAutoResize = "HEIGHT";
  valueText.layoutSizingHorizontal = "FILL";
  valueText.layoutSizingVertical = "HUG";

  var clearTok = "color/search-field/clear-icon/" + c.clear;
  var clearBtn = clearButton(iconSize, clearTok);
  clearBtn.visible = c.showClear;
  input.appendChild(clearBtn);
  clearBtn.layoutSizingHorizontal = "FIXED";
  clearBtn.layoutSizingVertical = "FIXED";

  var support = figma.createFrame();
  support.name = "support-text";
  support.layoutMode = "VERTICAL";
  support.primaryAxisSizingMode = "AUTO";
  support.counterAxisSizingMode = "AUTO";
  support.itemSpacing = 4;
  support.fills = [];
  root.appendChild(support);
  support.layoutSizingHorizontal = "FILL";

  var helper = figma.createText();
  helper.name = "helper";
  helper.fontName = { family: "Poppins", style: "Regular" };
  helper.characters = "Search by name or keyword.";
  if (caption) helper.textStyleId = caption.id;
  helper.fills = [boundPaint(gv("color/search-field/helper/default"))];
  helper.visible = false;
  support.appendChild(helper);
  helper.textAutoResize = "HEIGHT";
  helper.layoutSizingHorizontal = "FILL";
  helper.layoutSizingVertical = "HUG";

  var error = figma.createText();
  error.name = "error";
  error.fontName = { family: "Poppins", style: "Regular" };
  error.characters = "Search query is invalid.";
  if (caption) error.textStyleId = caption.id;
  error.fills = [boundPaint(gv("color/search-field/error/default"))];
  error.visible = state === "Error";
  support.appendChild(error);
  error.textAutoResize = "HEIGHT";
  error.layoutSizingHorizontal = "FILL";
  error.layoutSizingVertical = "HUG";

  if (c.opacity) root.opacity = c.opacity;

  if (state === "Default" && size === "Small") {
    propKeys.label = root.addComponentProperty("Label", "TEXT", "Search");
    propKeys.placeholder = root.addComponentProperty("Placeholder", "TEXT", "Search");
    propKeys.value = root.addComponentProperty("Value", "TEXT", "Design system");
    propKeys.helper = root.addComponentProperty("Helper", "TEXT", "Search by name or keyword.");
    propKeys.errorText = root.addComponentProperty("Error", "TEXT", "Search query is invalid.");
    propKeys.showLabel = root.addComponentProperty("Show label", "BOOLEAN", true);
    propKeys.showHelper = root.addComponentProperty("Show helper text", "BOOLEAN", false);
    propKeys.showError = root.addComponentProperty("Show error text", "BOOLEAN", false);
    propKeys.showClear = root.addComponentProperty("Show clear button", "BOOLEAN", false);
    label.componentPropertyReferences = { characters: propKeys.label, visible: propKeys.showLabel };
    helper.componentPropertyReferences = { characters: propKeys.helper };
    error.componentPropertyReferences = { characters: propKeys.errorText };
    clearBtn.componentPropertyReferences = { visible: propKeys.showClear };
    placeholderText.componentPropertyReferences = { characters: propKeys.placeholder };
    valueText.componentPropertyReferences = { characters: propKeys.value };
  }

  return root;
}

var variants = [];
states.forEach(function (state) {
  sizes.forEach(function (size) { variants.push(build(state, size)); });
});
var set = figma.combineAsVariants(variants, formPage);
set.name = "Search Field";
set.layoutMode = "HORIZONTAL";
set.layoutWrap = "WRAP";
set.itemSpacing = 24;
set.counterAxisSpacing = 24;
set.paddingTop = 32;
set.paddingBottom = 32;
set.paddingLeft = 32;
set.paddingRight = 32;
set.primaryAxisSizingMode = "AUTO";
set.counterAxisSizingMode = "AUTO";
set.x = 1439;
set.y = 980;
set.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }];
set.cornerRadius = 16;
set.description = "Search Field — specialized form control for search queries and filtering. States: Default/Hover/Focus/Filled/Error/Disabled. Sizes: Small (40px)/Medium (48px). Always shows search icon. Optional label, helper, error, and clear button. Theme via color/search-field/* tokens. Focus: 2px brand-red offset ring. Accessibility: visible label or accessible name required; placeholder is not a label; clear button needs accessible label (e.g. Clear search) in product code; use type=search when appropriate.";

return { setId: set.id, variantCount: set.children.length, propKeys: propKeys };
