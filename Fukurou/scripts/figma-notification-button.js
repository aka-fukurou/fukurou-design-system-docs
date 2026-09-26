// use_figma — Notification Button component set (reuses Icon Button tokens + structure)
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

var page = figma.root.children.find(function (p) { return p.name === "Buttons"; });
await figma.setCurrentPageAsync(page);
var section = page.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Notification Button"; });
if (!section) {
  section = figma.createSection(); section.name = "Component/Notification Button"; page.appendChild(section);
  section.x = 4700; section.y = -213; section.resizeWithoutConstraints(900, 700);
}
var existing = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Notification Button"; });
if (existing) existing.remove();

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var captionSm = figma.getLocalTextStyles().find(function (s) { return s.name === "caption/sm"; });
var ctrlSize = gv("density/icon-button/small/size");
var radiusFull = gv("radius/full");
var borderMd = gv("border/width/md");
var spacing2 = gv("spacing/2");
var dotSize = gv("density/notification-button/dot-size");
var badgeMinH = gv("density/notification-button/badge-min-height");
var badgePadX = gv("density/notification-button/badge-padding-x");

var states = ["Default", "Hover", "Pressed", "Focus", "Disabled"];
var badges = ["None", "Dot", "Count"];
var propKeys = {};

function bellIcon(state) {
  var wrap = figma.createFrame();
  wrap.name = "Icon / Bell"; wrap.resize(20, 20); wrap.fills = []; wrap.clipsContent = false;
  wrap.layoutMode = "NONE";
  var bell = figma.createVector();
  bell.name = "icon";
  bell.vectorPaths = [{ windingRule: "NONZERO", data: "M10 2.2 C7.1 2.2 5 4.5 5 7.3 L5 10.8 L3.4 13.2 C3.1 13.7 3.4 14.4 4.1 14.4 L15.9 14.4 C16.6 14.4 16.9 13.7 16.6 13.2 L15 10.8 L15 7.3 C15 4.5 12.9 2.2 10 2.2 Z M8.1 15.8 C8.3 16.9 9.1 17.6 10 17.6 C10.9 17.6 11.7 16.9 11.9 15.8 Z" }];
  bell.fills = [boundPaint(gv("color/icon-button/content/" + (state === "Focus" ? "default" : state.toLowerCase())))];
  bell.strokes = [];
  wrap.appendChild(bell);
  bell.x = 0; bell.y = 0; bell.resize(20, 20);
  bell.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  return wrap;
}

function build(state, badge) {
  var isFocus = state === "Focus";
  var stKey = state === "Focus" ? "default" : state.toLowerCase();
  var root = figma.createComponent();
  root.name = "State=" + state + ", Badge=" + badge;
  root.layoutMode = "HORIZONTAL"; root.primaryAxisSizingMode = "AUTO"; root.counterAxisSizingMode = "AUTO";
  root.primaryAxisAlignItems = "CENTER"; root.counterAxisAlignItems = "CENTER"; root.fills = []; root.clipsContent = false;

  var wrap = root;
  if (isFocus) {
    var ring = figma.createFrame(); ring.name = "focus-ring";
    ring.layoutMode = "HORIZONTAL"; ring.primaryAxisSizingMode = "AUTO"; ring.counterAxisSizingMode = "AUTO";
    ring.primaryAxisAlignItems = "CENTER"; ring.counterAxisAlignItems = "CENTER";
    ring.fills = [boundPaint(gv("color/icon-button/focus/gap"))];
    ring.strokes = [boundPaint(gv("color/icon-button/focus/ring"))];
    ring.setBoundVariable("strokeWeight", borderMd); ring.strokeAlign = "OUTSIDE";
    ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"].forEach(function (p) { ring.setBoundVariable(p, spacing2); });
    ring.setBoundVariable("cornerRadius", radiusFull); ring.clipsContent = false;
    root.appendChild(ring); wrap = ring;
  }

  var body = figma.createFrame(); body.name = "button-body";
  body.layoutMode = "HORIZONTAL"; body.primaryAxisSizingMode = "FIXED"; body.counterAxisSizingMode = "FIXED";
  body.primaryAxisAlignItems = "CENTER"; body.counterAxisAlignItems = "CENTER";
  body.setBoundVariable("width", ctrlSize); body.setBoundVariable("height", ctrlSize);
  body.fills = [boundPaint(gv("color/icon-button/background/" + stKey))];
  body.setBoundVariable("cornerRadius", radiusFull); body.clipsContent = false;
  wrap.appendChild(body);
  body.layoutSizingHorizontal = "FIXED"; body.layoutSizingVertical = "FIXED";

  var icon = bellIcon(state); body.appendChild(icon);
  icon.layoutSizingHorizontal = "FIXED"; icon.layoutSizingVertical = "FIXED";

  if (state === "Disabled") root.opacity = 1; // tokens already handle muted colors

  // Badge (absolute, top-right, overflowing)
  if (badge === "Dot") {
    var dot = figma.createEllipse(); dot.name = "badge-dot";
    dot.setBoundVariable("width", dotSize); dot.setBoundVariable("height", dotSize); dot.resize(8, 8);
    dot.fills = [boundPaint(gv("color/notification-button/dot/background"))];
    dot.strokes = [boundPaint(gv("color/notification-button/dot/border"))]; dot.strokeWeight = 2; dot.strokeAlign = "OUTSIDE";
    root.appendChild(dot); dot.layoutPositioning = "ABSOLUTE";
    dot.constraints = { horizontal: "MAX", vertical: "MIN" };
    dot.x = root.width - dot.width; dot.y = 0;
  } else if (badge === "Count") {
    var pill = figma.createFrame(); pill.name = "badge-count";
    pill.layoutMode = "HORIZONTAL"; pill.primaryAxisSizingMode = "AUTO"; pill.counterAxisSizingMode = "FIXED";
    pill.primaryAxisAlignItems = "CENTER"; pill.counterAxisAlignItems = "CENTER";
    pill.setBoundVariable("height", badgeMinH); pill.setBoundVariable("minWidth", badgeMinH);
    pill.setBoundVariable("paddingLeft", badgePadX); pill.setBoundVariable("paddingRight", badgePadX);
    pill.fills = [boundPaint(gv("color/notification-button/badge/background"))];
    pill.strokes = [boundPaint(gv("color/notification-button/badge/border"))]; pill.strokeWeight = 2; pill.strokeAlign = "OUTSIDE";
    pill.setBoundVariable("cornerRadius", radiusFull); pill.clipsContent = false;
    var cnt = figma.createText(); cnt.name = "count"; cnt.fontName = { family: "Poppins", style: "SemiBold" };
    cnt.characters = "3"; if (captionSm) cnt.textStyleId = captionSm.id;
    cnt.fills = [boundPaint(gv("color/notification-button/badge/text"))];
    pill.appendChild(cnt); cnt.layoutSizingHorizontal = "HUG"; cnt.layoutSizingVertical = "HUG";
    root.appendChild(pill); pill.layoutSizingVertical = "FIXED";
    pill.layoutPositioning = "ABSOLUTE"; pill.constraints = { horizontal: "MAX", vertical: "MIN" };
    pill.x = root.width - pill.width; pill.y = -2;

    if (state === "Default") {
      propKeys.count = root.addComponentProperty("Count", "TEXT", "3");
      cnt.componentPropertyReferences = { characters: propKeys.count };
    }
  }
  return root;
}

var variants = [];
states.forEach(function (s) { badges.forEach(function (b) { variants.push(build(s, b)); }); });
var set = figma.combineAsVariants(variants, section);
set.name = "Notification Button";
set.layoutMode = "HORIZONTAL"; set.layoutWrap = "WRAP"; set.itemSpacing = 32; set.counterAxisSpacing = 32;
set.paddingTop = 40; set.paddingBottom = 40; set.paddingLeft = 40; set.paddingRight = 40;
set.primaryAxisSizingMode = "AUTO"; set.counterAxisSizingMode = "AUTO"; set.clipsContent = false;
set.x = 0; set.y = 0; set.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; set.cornerRadius = 16;
set.description = "Notification Button — icon-only entry point for notifications. Reuses Icon Button tokens (color/icon-button/*), structure, states & focus ring. Badge: None/Dot/Count. Count text editable. Bell icon fixed.";

function wireCountSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var k = key("Count");
  cs.children.forEach(function (ch) {
    var cnt = ch.findOne(function (n) { return n.name === "count"; });
    if (cnt && k) cnt.componentPropertyReferences = { characters: k };
  });
}
wireCountSet(set);

return { setId: set.id, variants: set.children.length, sectionId: section.id, propKeys: propKeys };
