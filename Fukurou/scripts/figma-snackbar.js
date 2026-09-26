// use_figma — Snackbar component set (fixed dark container; tone via icon + accent border)
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

var page = figma.root.children.find(function (p) { return p.name === "_Documentation"; });
await figma.setCurrentPageAsync(page);
var section = page.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Snackbar"; });
if (!section) {
  section = figma.createSection(); section.name = "Component/Snackbar"; page.appendChild(section);
  section.x = 80; section.y = 1600; section.resizeWithoutConstraints(1200, 900);
}
var existing = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Snackbar"; });
if (existing) existing.remove();

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var bodySm = figma.getLocalTextStyles().find(function (s) { return s.name === "body/sm"; });
var radius12 = gv("radius/12");
var padX = gv("density/snackbar/padding-x");
var padY = gv("density/snackbar/padding-y");
var gap = gv("density/snackbar/gap");
var floatStyle = figma.getLocalPaintStyles ? null : null;
var effectStyles = figma.getLocalEffectStyles();
var floatEffect = effectStyles.find(function (s) { return /floating/i.test(s.name); }) || effectStyles.find(function (s) { return /popover/i.test(s.name); });

var glyphs = {
  Neutral: "M10 6 L10 6 M10 9 L10 14",
  Success: "M5 10 L8.5 13.5 L15 6",
  Warning: "M10 5 L10 11 M10 14 L10 14",
  Danger: "M10 5 L10 11 M10 14 L10 14",
  Info: "M10 6 L10 6 M10 9 L10 14"
};
var tones = ["Neutral", "Success", "Warning", "Danger", "Info"];
var propKeys = {};

function leadingIcon(tone) {
  var wrap = figma.createFrame(); wrap.name = "leading-icon"; wrap.resize(20, 20); wrap.fills = []; wrap.clipsContent = false; wrap.layoutMode = "NONE";
  var g = figma.createVector(); g.name = "icon";
  g.vectorPaths = [{ windingRule: "NONZERO", data: glyphs[tone] }];
  g.strokes = [boundPaint(gv("color/snackbar/icon/" + tone.toLowerCase()))];
  g.strokeWeight = 2; g.strokeCap = "ROUND"; g.strokeJoin = "ROUND"; g.fills = [];
  wrap.appendChild(g); g.x = 0; g.y = 0; g.resize(20, 20); g.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  return wrap;
}
function closeIcon() {
  var wrap = figma.createFrame(); wrap.name = "close"; wrap.resize(20, 20); wrap.fills = []; wrap.clipsContent = false; wrap.layoutMode = "NONE";
  var g = figma.createVector(); g.name = "icon";
  g.vectorPaths = [{ windingRule: "NONZERO", data: "M6 6 L14 14 M14 6 L6 14" }];
  g.strokes = [boundPaint(gv("color/snackbar/close/icon/default"))];
  g.strokeWeight = 2; g.strokeCap = "ROUND"; g.fills = [];
  wrap.appendChild(g); g.x = 0; g.y = 0; g.resize(20, 20); g.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  return wrap;
}

function build(tone) {
  var t = tone.toLowerCase();
  var root = figma.createComponent();
  root.name = "Tone=" + tone;
  root.layoutMode = "HORIZONTAL"; root.primaryAxisSizingMode = "AUTO"; root.counterAxisSizingMode = "AUTO";
  root.counterAxisAlignItems = "CENTER"; root.primaryAxisAlignItems = "MIN";
  root.setBoundVariable("itemSpacing", gap);
  root.setBoundVariable("paddingLeft", padX); root.setBoundVariable("paddingRight", padX);
  root.setBoundVariable("paddingTop", padY); root.setBoundVariable("paddingBottom", padY);
  root.fills = [boundPaint(gv("color/snackbar/background/" + t))];
  root.strokes = [boundPaint(gv("color/snackbar/border/" + t))]; root.strokeWeight = 1; root.strokeAlign = "INSIDE";
  root.setBoundVariable("cornerRadius", radius12); root.clipsContent = false;
  try { root.maxWidth = 480; } catch (e) {}
  if (floatEffect) root.effectStyleId = floatEffect.id;
  else root.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.28 }, offset: { x: 0, y: 8 }, radius: 24, spread: -4, visible: true, blendMode: "NORMAL" }];

  var icon = leadingIcon(tone); root.appendChild(icon); icon.layoutSizingHorizontal = "FIXED"; icon.layoutSizingVertical = "FIXED";

  var msg = figma.createText(); msg.name = "message"; msg.fontName = { family: "Poppins", style: "Regular" };
  msg.characters = "Changes saved."; if (bodySm) msg.textStyleId = bodySm.id;
  msg.fills = [boundPaint(gv("color/snackbar/text/" + t))]; root.appendChild(msg);
  msg.layoutGrow = 1; msg.textAutoResize = "HEIGHT"; msg.layoutSizingHorizontal = "FILL";

  var action = figma.createText(); action.name = "action"; action.fontName = { family: "Poppins", style: "SemiBold" };
  action.characters = "Undo"; if (bodySm) action.textStyleId = bodySm.id;
  action.fills = [boundPaint(gv("color/snackbar/action/text/default"))]; action.textDecoration = "UNDERLINE";
  root.appendChild(action); action.layoutSizingHorizontal = "HUG"; action.textAutoResize = "WIDTH_AND_HEIGHT";

  var close = closeIcon(); root.appendChild(close); close.layoutSizingHorizontal = "FIXED"; close.layoutSizingVertical = "FIXED";

  if (tone === "Neutral") {
    propKeys.msg = root.addComponentProperty("Message", "TEXT", "Changes saved.");
    propKeys.action = root.addComponentProperty("Action", "TEXT", "Undo");
    propKeys.showIcon = root.addComponentProperty("Show icon", "BOOLEAN", true);
    propKeys.showAction = root.addComponentProperty("Show action", "BOOLEAN", true);
    propKeys.showClose = root.addComponentProperty("Show close", "BOOLEAN", true);
    msg.componentPropertyReferences = { characters: propKeys.msg };
    action.componentPropertyReferences = { characters: propKeys.action, visible: propKeys.showAction };
    icon.componentPropertyReferences = { visible: propKeys.showIcon };
    close.componentPropertyReferences = { visible: propKeys.showClose };
  }
  return root;
}

var variants = tones.map(build);
var set = figma.combineAsVariants(variants, section);
set.name = "Snackbar";
set.layoutMode = "VERTICAL"; set.itemSpacing = 24; set.paddingTop = 32; set.paddingBottom = 32; set.paddingLeft = 32; set.paddingRight = 32;
set.primaryAxisSizingMode = "AUTO"; set.counterAxisSizingMode = "AUTO"; set.clipsContent = false;
set.x = 0; set.y = 0; set.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; set.cornerRadius = 16;
set.description = "Snackbar — short temporary feedback. Tone: Neutral/Success/Warning/Danger/Info. Toggles: Show icon/action/close. Editable Message/Action. Fixed dark container (both themes); tone via icon + accent border. Elevation: floating.";

function wireSnackbarSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var keys = { msg: key("Message"), action: key("Action"), showIcon: key("Show icon"), showAction: key("Show action"), showClose: key("Show close") };
  cs.children.forEach(function (ch) {
    var msg = ch.findOne(function (n) { return n.name === "message"; });
    var action = ch.findOne(function (n) { return n.name === "action"; });
    var icon = ch.findOne(function (n) { return n.name === "leading-icon"; });
    var close = ch.findOne(function (n) { return n.name === "close"; });
    if (msg && keys.msg) msg.componentPropertyReferences = { characters: keys.msg };
    if (action && keys.action) action.componentPropertyReferences = { characters: keys.action, visible: keys.showAction };
    if (icon && keys.showIcon) icon.componentPropertyReferences = { visible: keys.showIcon };
    if (close && keys.showClose) close.componentPropertyReferences = { visible: keys.showClose };
  });
}
wireSnackbarSet(set);

return { setId: set.id, variants: set.children.length, sectionId: section.id, propKeys: propKeys, floatEffect: floatEffect ? floatEffect.name : "fallback-shadow" };
