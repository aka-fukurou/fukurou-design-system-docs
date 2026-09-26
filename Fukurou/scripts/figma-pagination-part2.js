// use_figma — Pagination Previous/Next + composed bar
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
if (!section) return { error: "missing section" };
["Pagination / Previous", "Pagination / Next", "Pagination"].forEach(function (name) {
  var old = section.findOne(function (n) { return (n.type === "COMPONENT_SET" || n.type === "COMPONENT") && n.name === name; });
  if (old) old.remove();
});
var itemSet = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Pagination / Item"; });
var ellSet = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Pagination / Ellipsis"; });
if (!itemSet || !ellSet) return { error: "missing item/ellipsis sets" };
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var bodySm = figma.getLocalTextStyles().find(function (s) { return s.name === "body/sm"; });
var radius8 = gv("radius/8"); var borderSm = gv("border/width/sm"); var borderMd = gv("border/width/md"); var spacing2 = gv("spacing/2"); var gapTok = gv("density/pagination/gap");
var controlStates = ["Default", "Hover", "Focus", "Disabled"]; var sizes = ["Small", "Medium"];
function buildControl(kind, state, size) {
  var sizeTok = gv(size === "Small" ? "density/pagination/small/size" : "density/pagination/medium/size");
  var padX = gv("density/pagination/control/padding-x"); var label = kind === "Previous" ? "Previous" : "Next";
  var root = figma.createComponent(); root.name = "State=" + state + ", Size=" + size;
  root.layoutMode = "HORIZONTAL"; root.primaryAxisSizingMode = "AUTO"; root.counterAxisSizingMode = "AUTO"; root.fills = []; root.clipsContent = false;
  if (state === "Disabled") root.opacity = 0.5;
  var wrap = root;
  if (state === "Focus") {
    var ring = figma.createFrame(); ring.name = "focus-ring"; ring.layoutMode = "HORIZONTAL"; ring.primaryAxisSizingMode = "AUTO"; ring.counterAxisSizingMode = "AUTO";
    ring.fills = [boundPaint(gv("color/pagination/focus/gap"))]; ring.strokes = [boundPaint(gv("color/pagination/focus/ring"))];
    ring.setBoundVariable("strokeWeight", borderMd); ring.strokeAlign = "OUTSIDE";
    ring.setBoundVariable("paddingTop", spacing2); ring.setBoundVariable("paddingBottom", spacing2); ring.setBoundVariable("paddingLeft", spacing2); ring.setBoundVariable("paddingRight", spacing2);
    ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { ring.setBoundVariable(k, radius8); });
    ring.clipsContent = false; root.appendChild(ring); wrap = ring;
  }
  var btn = figma.createFrame(); btn.name = kind.toLowerCase(); btn.layoutMode = "HORIZONTAL"; btn.primaryAxisSizingMode = "AUTO"; btn.counterAxisSizingMode = "FIXED";
  btn.primaryAxisAlignItems = "CENTER"; btn.counterAxisAlignItems = "CENTER"; btn.setBoundVariable("height", sizeTok); btn.setBoundVariable("paddingLeft", padX); btn.setBoundVariable("paddingRight", padX);
  btn.fills = state === "Hover" ? [boundPaint(gv("color/pagination/control/background/hover"))] : state === "Disabled" ? [boundPaint(gv("color/pagination/control/background/disabled"))] : [boundPaint(gv("color/pagination/control/background/default"))];
  if (state === "Hover" || state === "Default") {
    btn.strokes = [boundPaint(gv(state === "Hover" ? "color/pagination/control/border/hover" : "color/pagination/control/border/default"))];
    btn.setBoundVariable("strokeWeight", borderSm); btn.strokeAlign = "INSIDE";
    ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { btn.setBoundVariable(k, radius8); });
  }
  wrap.appendChild(btn);
  var txt = figma.createText(); txt.name = "label"; txt.fontName = { family: "Poppins", style: "Regular" }; txt.characters = label;
  if (bodySm) txt.textStyleId = bodySm.id;
  var tok = state === "Disabled" ? "color/pagination/control/text/disabled" : state === "Hover" ? "color/pagination/control/text/hover" : "color/pagination/control/text/default";
  txt.fills = [boundPaint(gv(tok))]; btn.appendChild(txt);
  if (state === "Default" && size === "Medium") { var prop = root.addComponentProperty("Label", "TEXT", label); txt.componentPropertyReferences = { characters: prop }; }
  return root;
}
var prevVariants = [];
controlStates.forEach(function (s) { sizes.forEach(function (sz) { prevVariants.push(buildControl("Previous", s, sz)); }); });
var prevSet = figma.combineAsVariants(prevVariants, section);
prevSet.name = "Pagination / Previous"; prevSet.layoutMode = "HORIZONTAL"; prevSet.layoutWrap = "WRAP"; prevSet.itemSpacing = 16; prevSet.counterAxisSpacing = 16;
prevSet.paddingTop = 24; prevSet.paddingBottom = 24; prevSet.paddingLeft = 24; prevSet.paddingRight = 24; prevSet.x = 80; prevSet.y = 720;
prevSet.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; prevSet.cornerRadius = 12; prevSet.clipsContent = false;
prevSet.description = "Pagination Previous control. Text-button style. States: Default/Hover/Focus/Disabled.";
var nextVariants = [];
controlStates.forEach(function (s) { sizes.forEach(function (sz) { nextVariants.push(buildControl("Next", s, sz)); }); });
var nextSet = figma.combineAsVariants(nextVariants, section);
nextSet.name = "Pagination / Next"; nextSet.layoutMode = "HORIZONTAL"; nextSet.layoutWrap = "WRAP"; nextSet.itemSpacing = 16; nextSet.counterAxisSpacing = 16;
nextSet.paddingTop = 24; nextSet.paddingBottom = 24; nextSet.paddingLeft = 24; nextSet.paddingRight = 24; nextSet.x = 720; nextSet.y = 720;
nextSet.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; nextSet.cornerRadius = 12; nextSet.clipsContent = false;
nextSet.description = "Pagination Next control. Text-button style. States: Default/Hover/Focus/Disabled.";
function inst(set, variantName) { var c = set.children.find(function (ch) { return ch.name === variantName; }); return c ? c.createInstance() : null; }
var bar = figma.createComponent(); bar.name = "Pagination"; bar.layoutMode = "HORIZONTAL"; bar.primaryAxisSizingMode = "AUTO"; bar.counterAxisSizingMode = "AUTO";
bar.primaryAxisAlignItems = "CENTER"; bar.counterAxisAlignItems = "CENTER"; bar.setBoundVariable("itemSpacing", gapTok); bar.fills = []; bar.clipsContent = false;
section.appendChild(bar); bar.x = 80; bar.y = 1180;
var prev = inst(prevSet, "State=Default, Size=Medium");
var n1 = inst(itemSet, "State=Default, Size=Medium"); if (n1) { try { n1.setProperties({ "Page number": "1" }); } catch (e) {} }
var n2 = inst(itemSet, "State=Active, Size=Medium"); if (n2) { try { n2.setProperties({ "Page number": "2" }); } catch (e) {} }
var n3 = inst(itemSet, "State=Default, Size=Medium"); if (n3) { try { n3.setProperties({ "Page number": "3" }); } catch (e) {} }
var ell = inst(ellSet, "Size=Medium");
var n8 = inst(itemSet, "State=Default, Size=Medium"); if (n8) { try { n8.setProperties({ "Page number": "8" }); } catch (e) {} }
var next = inst(nextSet, "State=Default, Size=Medium");
[prev, n1, n2, n3, ell, n8, next].forEach(function (node) { if (node) bar.appendChild(node); });
bar.description = "Pagination — navigate paged content (tables, lists, search results). Default: Previous · 1 · 2 (active) · 3 · … · 8 · Next.";
return { prevSetId: prevSet.id, nextSetId: nextSet.id, barId: bar.id };
