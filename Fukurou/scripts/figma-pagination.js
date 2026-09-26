// use_figma — Pagination subcomponents + default bar (Form page)
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

var page = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(page);
var section = page.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Pagination"; });
if (!section) {
  section = figma.createSection();
  section.name = "Component/Pagination";
  page.appendChild(section);
  var dropdownSec = page.findOne(function (n) { return n.type === "SECTION" && n.name.indexOf("Dropdown") >= 0; });
  section.x = dropdownSec ? dropdownSec.x : 80;
  section.y = dropdownSec ? dropdownSec.y + dropdownSec.height + 120 : 4200;
  section.resizeWithoutConstraints(2200, 2200);
}
["Pagination / Item", "Pagination / Previous", "Pagination / Next", "Pagination / Ellipsis", "Pagination", "Pagination Component"].forEach(function (name) {
  var old = section.findOne(function (n) {
    return (n.type === "COMPONENT_SET" || n.type === "COMPONENT" || n.type === "FRAME") && n.name === name;
  });
  if (old) old.remove();
});

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var bodySm = figma.getLocalTextStyles().find(function (s) { return s.name === "body/sm"; });
var radius8 = gv("radius/8");
var borderSm = gv("border/width/sm");
var borderMd = gv("border/width/md");
var spacing2 = gv("spacing/2");
var gapTok = gv("density/pagination/gap");

var itemStates = ["Default", "Hover", "Active", "Focus", "Disabled"];
var controlStates = ["Default", "Hover", "Focus", "Disabled"];
var sizes = ["Small", "Medium"];

var itemCfg = {
  Default: { bg: "default", border: "default", text: "default", weight: "Regular", opacity: 1 },
  Hover: { bg: "hover", border: "hover", text: "hover", weight: "Regular", opacity: 1 },
  Active: { bg: "active", border: "active", text: "active", weight: "SemiBold", opacity: 1 },
  Focus: { bg: "default", border: "focus", text: "default", weight: "Regular", opacity: 1, ring: true },
  Disabled: { bg: "disabled", border: "disabled", text: "disabled", weight: "Regular", opacity: 0.5 }
};

function buildItem(state, size) {
  var c = itemCfg[state];
  var sizeTok = gv(size === "Small" ? "density/pagination/small/size" : "density/pagination/medium/size");
  var root = figma.createComponent();
  root.name = "State=" + state + ", Size=" + size;
  root.layoutMode = "HORIZONTAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "AUTO";
  root.fills = [];
  root.clipsContent = false;
  root.opacity = c.opacity;

  var wrap = root;
  if (c.ring) {
    var ring = figma.createFrame();
    ring.name = "focus-ring";
    ring.layoutMode = "HORIZONTAL";
    ring.primaryAxisSizingMode = "AUTO";
    ring.counterAxisSizingMode = "AUTO";
    ring.fills = [boundPaint(gv("color/pagination/focus/gap"))];
    ring.strokes = [boundPaint(gv("color/pagination/focus/ring"))];
    ring.setBoundVariable("strokeWeight", borderMd);
    ring.strokeAlign = "OUTSIDE";
    ring.setBoundVariable("paddingTop", spacing2);
    ring.setBoundVariable("paddingBottom", spacing2);
    ring.setBoundVariable("paddingLeft", spacing2);
    ring.setBoundVariable("paddingRight", spacing2);
    ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) {
      ring.setBoundVariable(k, radius8);
    });
    ring.clipsContent = false;
    root.appendChild(ring);
    wrap = ring;
  }

  var btn = figma.createFrame();
  btn.name = "item";
  btn.layoutMode = "HORIZONTAL";
  btn.primaryAxisSizingMode = "FIXED";
  btn.counterAxisSizingMode = "FIXED";
  btn.primaryAxisAlignItems = "CENTER";
  btn.counterAxisAlignItems = "CENTER";
  btn.setBoundVariable("width", sizeTok);
  btn.setBoundVariable("height", sizeTok);
  btn.fills = [boundPaint(gv("color/pagination/item/background/" + c.bg))];
  btn.strokes = [boundPaint(gv("color/pagination/item/border/" + c.border))];
  btn.setBoundVariable("strokeWeight", borderSm);
  btn.strokeAlign = "INSIDE";
  ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) {
    btn.setBoundVariable(k, radius8);
  });
  wrap.appendChild(btn);

  var num = figma.createText();
  num.name = "page-number";
  num.fontName = { family: "Poppins", style: c.weight };
  num.characters = "1";
  if (bodySm) num.textStyleId = bodySm.id;
  num.fills = [boundPaint(gv("color/pagination/item/text/" + c.text))];
  num.textAlignHorizontal = "CENTER";
  btn.appendChild(num);

  if (state === "Default" && size === "Medium") {
    var pageProp = root.addComponentProperty("Page number", "TEXT", "1");
    num.componentPropertyReferences = { characters: pageProp };
  }
  return root;
}

function buildControl(kind, state, size) {
  var sizeTok = gv(size === "Small" ? "density/pagination/small/size" : "density/pagination/medium/size");
  var padX = gv("density/pagination/control/padding-x");
  var label = kind === "Previous" ? "Previous" : "Next";
  var root = figma.createComponent();
  root.name = "State=" + state + ", Size=" + size;
  root.layoutMode = "HORIZONTAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "AUTO";
  root.fills = [];
  root.clipsContent = false;
  if (state === "Disabled") root.opacity = 0.5;

  var wrap = root;
  if (state === "Focus") {
    var ring = figma.createFrame();
    ring.name = "focus-ring";
    ring.layoutMode = "HORIZONTAL";
    ring.primaryAxisSizingMode = "AUTO";
    ring.counterAxisSizingMode = "AUTO";
    ring.fills = [boundPaint(gv("color/pagination/focus/gap"))];
    ring.strokes = [boundPaint(gv("color/pagination/focus/ring"))];
    ring.setBoundVariable("strokeWeight", borderMd);
    ring.strokeAlign = "OUTSIDE";
    ring.setBoundVariable("paddingTop", spacing2);
    ring.setBoundVariable("paddingBottom", spacing2);
    ring.setBoundVariable("paddingLeft", spacing2);
    ring.setBoundVariable("paddingRight", spacing2);
    ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) {
      ring.setBoundVariable(k, radius8);
    });
    ring.clipsContent = false;
    root.appendChild(ring);
    wrap = ring;
  }

  var btn = figma.createFrame();
  btn.name = kind.toLowerCase();
  btn.layoutMode = "HORIZONTAL";
  btn.primaryAxisSizingMode = "AUTO";
  btn.counterAxisSizingMode = "FIXED";
  btn.primaryAxisAlignItems = "CENTER";
  btn.counterAxisAlignItems = "CENTER";
  btn.setBoundVariable("height", sizeTok);
  btn.setBoundVariable("paddingLeft", padX);
  btn.setBoundVariable("paddingRight", padX);
  btn.fills = state === "Hover"
    ? [boundPaint(gv("color/pagination/control/background/hover"))]
    : state === "Disabled"
      ? [boundPaint(gv("color/pagination/control/background/disabled"))]
      : [boundPaint(gv("color/pagination/control/background/default"))];
  if (state === "Hover" || state === "Default") {
    btn.strokes = [boundPaint(gv(state === "Hover" ? "color/pagination/control/border/hover" : "color/pagination/control/border/default"))];
    btn.setBoundVariable("strokeWeight", borderSm);
    btn.strokeAlign = "INSIDE";
    ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) {
      btn.setBoundVariable(k, radius8);
    });
  }
  wrap.appendChild(btn);

  var txt = figma.createText();
  txt.name = "label";
  txt.fontName = { family: "Poppins", style: "Regular" };
  txt.characters = label;
  if (bodySm) txt.textStyleId = bodySm.id;
  var tok = state === "Disabled" ? "color/pagination/control/text/disabled" : state === "Hover" ? "color/pagination/control/text/hover" : "color/pagination/control/text/default";
  txt.fills = [boundPaint(gv(tok))];
  btn.appendChild(txt);

  if (state === "Default" && size === "Medium") {
    var prop = root.addComponentProperty("Label", "TEXT", label);
    txt.componentPropertyReferences = { characters: prop };
  }
  return root;
}

function buildEllipsis(size) {
  var sizeTok = gv(size === "Small" ? "density/pagination/small/size" : "density/pagination/medium/size");
  var root = figma.createComponent();
  root.name = "Size=" + size;
  root.layoutMode = "HORIZONTAL";
  root.primaryAxisSizingMode = "FIXED";
  root.counterAxisSizingMode = "FIXED";
  root.primaryAxisAlignItems = "CENTER";
  root.counterAxisAlignItems = "CENTER";
  root.setBoundVariable("width", sizeTok);
  root.setBoundVariable("height", sizeTok);
  root.fills = [];
  var txt = figma.createText();
  txt.name = "ellipsis";
  txt.fontName = { family: "Poppins", style: "Regular" };
  txt.characters = "\u2026";
  if (bodySm) txt.textStyleId = bodySm.id;
  txt.fills = [boundPaint(gv("color/pagination/ellipsis/text/default"))];
  txt.textAlignHorizontal = "CENTER";
  root.appendChild(txt);
  return root;
}

var itemVariants = [];
itemStates.forEach(function (s) { sizes.forEach(function (sz) { itemVariants.push(buildItem(s, sz)); }); });
var itemSet = figma.combineAsVariants(itemVariants, section);
itemSet.name = "Pagination / Item";
itemSet.layoutMode = "HORIZONTAL";
itemSet.layoutWrap = "WRAP";
itemSet.itemSpacing = 16;
itemSet.counterAxisSpacing = 16;
itemSet.paddingTop = 24;
itemSet.paddingBottom = 24;
itemSet.paddingLeft = 24;
itemSet.paddingRight = 24;
itemSet.x = 80;
itemSet.y = 120;
itemSet.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }];
itemSet.cornerRadius = 12;
itemSet.clipsContent = false;
itemSet.description = "Pagination page item. States: Default/Hover/Active/Focus/Disabled. Active uses semibold + primary fill (not color-only). Sizes: Small/Medium.";

var prevVariants = [];
controlStates.forEach(function (s) { sizes.forEach(function (sz) { prevVariants.push(buildControl("Previous", s, sz)); }); });
var prevSet = figma.combineAsVariants(prevVariants, section);
prevSet.name = "Pagination / Previous";
prevSet.layoutMode = "HORIZONTAL";
prevSet.layoutWrap = "WRAP";
prevSet.itemSpacing = 16;
prevSet.counterAxisSpacing = 16;
prevSet.paddingTop = 24;
prevSet.paddingBottom = 24;
prevSet.paddingLeft = 24;
prevSet.paddingRight = 24;
prevSet.x = 80;
prevSet.y = 720;
prevSet.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }];
prevSet.cornerRadius = 12;
prevSet.clipsContent = false;
prevSet.description = "Pagination Previous control. Text-button style. States: Default/Hover/Focus/Disabled.";

var nextVariants = [];
controlStates.forEach(function (s) { sizes.forEach(function (sz) { nextVariants.push(buildControl("Next", s, sz)); }); });
var nextSet = figma.combineAsVariants(nextVariants, section);
nextSet.name = "Pagination / Next";
nextSet.layoutMode = "HORIZONTAL";
nextSet.layoutWrap = "WRAP";
nextSet.itemSpacing = 16;
nextSet.counterAxisSpacing = 16;
nextSet.paddingTop = 24;
nextSet.paddingBottom = 24;
nextSet.paddingLeft = 24;
nextSet.paddingRight = 24;
nextSet.x = 720;
nextSet.y = 720;
nextSet.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }];
nextSet.cornerRadius = 12;
nextSet.clipsContent = false;
nextSet.description = "Pagination Next control. Text-button style. States: Default/Hover/Focus/Disabled.";

var ellVariants = sizes.map(buildEllipsis);
var ellSet = figma.combineAsVariants(ellVariants, section);
ellSet.name = "Pagination / Ellipsis";
ellSet.layoutMode = "HORIZONTAL";
ellSet.itemSpacing = 16;
ellSet.paddingTop = 16;
ellSet.paddingBottom = 16;
ellSet.paddingLeft = 16;
ellSet.paddingRight = 16;
ellSet.x = 720;
ellSet.y = 120;
ellSet.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }];
ellSet.cornerRadius = 12;
ellSet.description = "Pagination ellipsis — non-interactive, not focusable in product code.";

function inst(set, variantName) {
  var c = set.children.find(function (ch) { return ch.name === variantName; });
  return c ? c.createInstance() : null;
}

var bar = figma.createComponent();
bar.name = "Pagination";
bar.layoutMode = "HORIZONTAL";
bar.primaryAxisSizingMode = "AUTO";
bar.counterAxisSizingMode = "AUTO";
bar.primaryAxisAlignItems = "CENTER";
bar.counterAxisAlignItems = "CENTER";
bar.setBoundVariable("itemSpacing", gapTok);
bar.fills = [];
bar.clipsContent = false;
section.appendChild(bar);
bar.x = 80;
bar.y = 1180;

var prev = inst(prevSet, "State=Default, Size=Medium");
var n1 = inst(itemSet, "State=Default, Size=Medium"); if (n1) { try { n1.setProperties({ "Page number": "1" }); } catch (e) {} }
var n2 = inst(itemSet, "State=Active, Size=Medium"); if (n2) { try { n2.setProperties({ "Page number": "2" }); } catch (e) {} }
var n3 = inst(itemSet, "State=Default, Size=Medium"); if (n3) { try { n3.setProperties({ "Page number": "3" }); } catch (e) {} }
var ell = inst(ellSet, "Size=Medium");
var n8 = inst(itemSet, "State=Default, Size=Medium"); if (n8) { try { n8.setProperties({ "Page number": "8" }); } catch (e) {} }
var next = inst(nextSet, "State=Default, Size=Medium");
[prev, n1, n2, n3, ell, n8, next].forEach(function (node) { if (node) bar.appendChild(node); });
bar.description = "Pagination — navigate paged content (tables, lists, search results). Default example: Previous · 1 · 2 (active) · 3 · … · 8 · Next. Compose from Pagination / Item, Previous, Next, Ellipsis subcomponents.";

return {
  itemSetId: itemSet.id,
  prevSetId: prevSet.id,
  nextSetId: nextSet.id,
  ellSetId: ellSet.id,
  barId: bar.id,
  itemVariants: itemSet.children.length,
  prevVariants: prevSet.children.length
};
