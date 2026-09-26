// use_figma — Tooltip component set
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function resolveColor(variable) {
  var v = variable, g = 0;
  while (v && g++ < 12) {
    var mid = Object.keys(v.valuesByMode)[0];
    var val = v.valuesByMode[mid];
    if (val && val.type === "VARIABLE_ALIAS") v = figma.variables.getVariableById(val.id);
    else return val;
  }
  return { r: 0.1, g: 0.1, b: 0.1, a: 1 };
}
function boundPaint(variable) {
  var c = resolveColor(variable);
  return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: c.r, g: c.g, b: c.b }, opacity: c.a === undefined ? 1 : c.a }, "color", variable);
}

var page = figma.root.children.find(function (p) { return p.name === "_Documentation"; });
await figma.setCurrentPageAsync(page);
var section = page.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Tooltip"; });
if (!section) {
  section = figma.createSection(); section.name = "Component/Tooltip"; page.appendChild(section);
  section.x = 80; section.y = 80; section.resizeWithoutConstraints(900, 700);
}
var existing = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Tooltip"; });
if (existing) existing.remove();

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
var bodySm = figma.getLocalTextStyles().find(function (s) { return s.name === "body/sm"; });
var radius8 = gv("radius/8");
var padX = gv("density/tooltip/padding-x");
var padY = gv("density/tooltip/padding-y");
var effectStyles = figma.getLocalEffectStyles();
var floatEffect = effectStyles.find(function (s) { return /floating/i.test(s.name); }) || effectStyles.find(function (s) { return /popover/i.test(s.name); });

var arrowPaths = { down: "M0 0 L8 0 L4 6 Z", up: "M0 6 L8 6 L4 0 Z", right: "M0 0 L6 4 L0 8 Z", left: "M6 0 L6 8 L0 4 Z" };
var placements = ["Top", "Right", "Bottom", "Left"];
var propKeys = {};

function bubble() {
  var b = figma.createFrame(); b.name = "tooltip-container";
  b.layoutMode = "HORIZONTAL"; b.primaryAxisSizingMode = "AUTO"; b.counterAxisSizingMode = "AUTO";
  b.setBoundVariable("paddingLeft", padX); b.setBoundVariable("paddingRight", padX);
  b.setBoundVariable("paddingTop", padY); b.setBoundVariable("paddingBottom", padY);
  b.fills = [boundPaint(gv("color/tooltip/background/default"))];
  b.setBoundVariable("cornerRadius", radius8); b.clipsContent = false;
  if (floatEffect) b.effectStyleId = floatEffect.id;
  var txt = figma.createText(); txt.name = "message"; txt.fontName = { family: "Poppins", style: "Regular" };
  txt.characters = "More information about this option."; if (bodySm) txt.textStyleId = bodySm.id;
  txt.fills = [boundPaint(gv("color/tooltip/text/default"))]; b.appendChild(txt);
  txt.textAutoResize = "WIDTH_AND_HEIGHT"; txt.layoutSizingHorizontal = "HUG";
  return b;
}
function arrow(dir) {
  var a = figma.createVector(); a.name = "arrow";
  a.vectorPaths = [{ windingRule: "NONZERO", data: arrowPaths[dir] }];
  a.fills = [boundPaint(gv("color/tooltip/arrow/default"))]; a.strokes = []; a.resize(8, 8);
  return a;
}

function build(placement) {
  var root = figma.createComponent();
  root.name = "Placement=" + placement;
  root.fills = []; root.clipsContent = false;
  var p = placement.toLowerCase();
  var isVert = p === "top" || p === "bottom";
  root.layoutMode = isVert ? "VERTICAL" : "HORIZONTAL";
  root.primaryAxisSizingMode = "AUTO"; root.counterAxisSizingMode = "AUTO";
  root.counterAxisAlignItems = "CENTER"; root.primaryAxisAlignItems = "CENTER";
  root.itemSpacing = 0;

  var b = bubble();
  var a = arrow(p === "top" ? "down" : p === "bottom" ? "up" : p === "left" ? "right" : "left");

  if (p === "top") { root.appendChild(b); root.appendChild(a); }
  else if (p === "bottom") { root.appendChild(a); root.appendChild(b); }
  else if (p === "left") { root.appendChild(b); root.appendChild(a); }
  else { root.appendChild(a); root.appendChild(b); }

  b.layoutSizingHorizontal = "HUG"; b.layoutSizingVertical = "HUG";
  a.layoutSizingHorizontal = "FIXED"; a.layoutSizingVertical = "FIXED";

  if (placement === "Top") {
    propKeys.text = root.addComponentProperty("Tooltip text", "TEXT", "More information about this option.");
    propKeys.showArrow = root.addComponentProperty("Show arrow", "BOOLEAN", true);
    var msg = b.findOne(function (n) { return n.name === "message"; });
    msg.componentPropertyReferences = { characters: propKeys.text };
    a.componentPropertyReferences = { visible: propKeys.showArrow };
  }
  return root;
}

var variants = placements.map(build);
var set = figma.combineAsVariants(variants, section);
set.name = "Tooltip";
set.layoutMode = "HORIZONTAL"; set.layoutWrap = "WRAP"; set.itemSpacing = 32; set.counterAxisSpacing = 32;
set.paddingTop = 32; set.paddingBottom = 32; set.paddingLeft = 32; set.paddingRight = 32;
set.primaryAxisSizingMode = "AUTO"; set.counterAxisSizingMode = "AUTO"; set.clipsContent = false;
set.x = 0; set.y = 0; set.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; set.cornerRadius = 16;
set.description = "Tooltip — short contextual help. Placement: Top/Right/Bottom/Left. Show arrow toggle. Inverse surface + text (theme-aware). Keep copy short; not for critical info. Keyboard/screen-reader patterns required in code.";

function wireSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var keys = { text: key("Tooltip text"), showArrow: key("Show arrow") };
  cs.children.forEach(function (ch) {
    var msg = ch.findOne(function (n) { return n.name === "message"; });
    var arr = ch.findOne(function (n) { return n.name === "arrow"; });
    if (msg && keys.text) msg.componentPropertyReferences = { characters: keys.text };
    if (arr && keys.showArrow) arr.componentPropertyReferences = { visible: keys.showArrow };
  });
}
wireSet(set);

return { setId: set.id, variants: set.children.length, sectionId: section.id };
