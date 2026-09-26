// use_figma — Alert / Banner component set
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

var page = figma.root.children.find(function (p) { return p.name === "Notifications"; });
await figma.setCurrentPageAsync(page);
var section = page.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Alert Banner"; });
if (!section) {
  section = figma.createSection(); section.name = "Component/Alert Banner"; page.appendChild(section);
  var snackSec = page.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Snackbar"; });
  section.x = snackSec ? snackSec.x : 80; section.y = snackSec ? snackSec.y + 1100 : 2800;
  section.resizeWithoutConstraints(1200, 1000);
}
var existing = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Alert / Banner"; });
if (existing) existing.remove();

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var bodySm = figma.getLocalTextStyles().find(function (s) { return s.name === "body/sm"; });
var labelMd = figma.getLocalTextStyles().find(function (s) { return s.name === "label/md"; });
var radius12 = gv("radius/12");
var padX = gv("density/alert/padding-x");
var padY = gv("density/alert/padding-y");
var gap = gv("density/alert/gap");

var glyphs = {
  Neutral: "M10 6 L10 6 M10 9 L10 14",
  Info: "M10 6 L10 6 M10 9 L10 14",
  Success: "M5 10 L8.5 13.5 L15 6",
  Warning: "M10 5 L10 11 M10 14 L10 14",
  Danger: "M10 5 L10 11 M10 14 L10 14"
};
var tones = ["Neutral", "Info", "Success", "Warning", "Danger"];
var propKeys = {};

function leadingIcon(tone) {
  var wrap = figma.createFrame(); wrap.name = "leading-icon"; wrap.resize(20, 20); wrap.fills = []; wrap.clipsContent = false; wrap.layoutMode = "NONE";
  var g = figma.createVector(); g.name = "icon";
  g.vectorPaths = [{ windingRule: "NONZERO", data: glyphs[tone] }];
  g.strokes = [boundPaint(gv("color/alert/icon/" + tone.toLowerCase()))];
  g.strokeWeight = 2; g.strokeCap = "ROUND"; g.strokeJoin = "ROUND"; g.fills = [];
  wrap.appendChild(g); g.x = 0; g.y = 0; g.resize(20, 20); g.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  return wrap;
}
function closeIcon() {
  var wrap = figma.createFrame(); wrap.name = "close"; wrap.resize(20, 20); wrap.fills = []; wrap.clipsContent = false; wrap.layoutMode = "NONE";
  var g = figma.createVector(); g.name = "icon";
  g.vectorPaths = [{ windingRule: "NONZERO", data: "M6 6 L14 14 M14 6 L6 14" }];
  g.strokes = [boundPaint(gv("color/alert/close/icon/default"))];
  g.strokeWeight = 2; g.strokeCap = "ROUND"; g.fills = [];
  wrap.appendChild(g); g.x = 0; g.y = 0; g.resize(20, 20); g.constraints = { horizontal: "SCALE", vertical: "SCALE" };
  return wrap;
}

function build(tone) {
  var t = tone.toLowerCase();
  var root = figma.createComponent();
  root.name = "Tone=" + tone;
  root.layoutMode = "HORIZONTAL"; root.primaryAxisSizingMode = "AUTO"; root.counterAxisSizingMode = "AUTO";
  root.counterAxisAlignItems = "MIN"; root.primaryAxisAlignItems = "MIN";
  root.setBoundVariable("itemSpacing", gap);
  root.setBoundVariable("paddingLeft", padX); root.setBoundVariable("paddingRight", padX);
  root.setBoundVariable("paddingTop", padY); root.setBoundVariable("paddingBottom", padY);
  root.fills = [boundPaint(gv("color/alert/background/" + t))];
  root.strokes = [boundPaint(gv("color/alert/border/" + t))]; root.strokeWeight = 1; root.strokeAlign = "INSIDE";
  root.setBoundVariable("cornerRadius", radius12); root.clipsContent = false;
  try { root.maxWidth = 640; } catch (e) {}

  var icon = leadingIcon(tone); root.appendChild(icon); icon.layoutSizingHorizontal = "FIXED"; icon.layoutSizingVertical = "FIXED";

  var content = figma.createFrame(); content.name = "content"; content.layoutMode = "VERTICAL"; content.primaryAxisSizingMode = "AUTO"; content.counterAxisSizingMode = "AUTO";
  content.itemSpacing = 4; content.fills = []; root.appendChild(content);
  content.layoutGrow = 1; content.layoutSizingHorizontal = "FILL";

  var title = figma.createText(); title.name = "title"; title.fontName = { family: "Poppins", style: "SemiBold" };
  title.characters = "Update available"; if (labelMd) title.textStyleId = labelMd.id;
  title.fills = [boundPaint(gv("color/alert/title/" + t))]; content.appendChild(title);
  title.textAutoResize = "HEIGHT"; title.layoutSizingHorizontal = "FILL";

  var msg = figma.createText(); msg.name = "message"; msg.fontName = { family: "Poppins", style: "Regular" };
  msg.characters = "A new version is ready to install."; if (bodySm) msg.textStyleId = bodySm.id;
  msg.fills = [boundPaint(gv("color/alert/message/" + t))]; content.appendChild(msg);
  msg.textAutoResize = "HEIGHT"; msg.layoutSizingHorizontal = "FILL";

  var action = figma.createText(); action.name = "action"; action.fontName = { family: "Poppins", style: "SemiBold" };
  action.characters = "Review"; if (bodySm) action.textStyleId = bodySm.id;
  action.fills = [boundPaint(gv("color/alert/action/text/default"))]; action.textDecoration = "UNDERLINE";
  root.appendChild(action); action.layoutSizingHorizontal = "HUG"; action.textAutoResize = "WIDTH_AND_HEIGHT";

  var close = closeIcon(); root.appendChild(close); close.layoutSizingHorizontal = "FIXED"; close.layoutSizingVertical = "FIXED";

  if (tone === "Neutral") {
    propKeys.title = root.addComponentProperty("Title", "TEXT", "Update available");
    propKeys.msg = root.addComponentProperty("Message", "TEXT", "A new version is ready to install.");
    propKeys.action = root.addComponentProperty("Action", "TEXT", "Review");
    propKeys.showIcon = root.addComponentProperty("Show icon", "BOOLEAN", true);
    propKeys.showTitle = root.addComponentProperty("Show title", "BOOLEAN", true);
    propKeys.showAction = root.addComponentProperty("Show action", "BOOLEAN", true);
    propKeys.showClose = root.addComponentProperty("Show close", "BOOLEAN", true);
    title.componentPropertyReferences = { characters: propKeys.title, visible: propKeys.showTitle };
    msg.componentPropertyReferences = { characters: propKeys.msg };
    action.componentPropertyReferences = { characters: propKeys.action, visible: propKeys.showAction };
    icon.componentPropertyReferences = { visible: propKeys.showIcon };
    close.componentPropertyReferences = { visible: propKeys.showClose };
  }
  root.counterAxisSizingMode = "AUTO";
  return root;
}

var variants = tones.map(build);
var set = figma.combineAsVariants(variants, section);
set.name = "Alert / Banner";
set.layoutMode = "VERTICAL"; set.itemSpacing = 24; set.paddingTop = 32; set.paddingBottom = 32; set.paddingLeft = 32; set.paddingRight = 32;
set.primaryAxisSizingMode = "AUTO"; set.counterAxisSizingMode = "AUTO"; set.clipsContent = false;
set.x = 0; set.y = 0; set.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; set.cornerRadius = 16;
set.description = "Alert / Banner — persistent system messages (not temporary like Snackbar). Tone: Neutral/Info/Success/Warning/Danger. Toggles: Show icon/title/action/close. Editable Title/Message/Action. Subtle tone backgrounds + border. Use role=alert for critical messages in code.";

function wireSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var keys = { title: key("Title"), msg: key("Message"), action: key("Action"), showIcon: key("Show icon"), showTitle: key("Show title"), showAction: key("Show action"), showClose: key("Show close") };
  cs.children.forEach(function (ch) {
    var title = ch.findOne(function (n) { return n.name === "title"; });
    var msg = ch.findOne(function (n) { return n.name === "message"; });
    var action = ch.findOne(function (n) { return n.name === "action"; });
    var icon = ch.findOne(function (n) { return n.name === "leading-icon"; });
    var close = ch.findOne(function (n) { return n.name === "close"; });
    if (title && keys.title) title.componentPropertyReferences = { characters: keys.title, visible: keys.showTitle };
    if (msg && keys.msg) msg.componentPropertyReferences = { characters: keys.msg };
    if (action && keys.action) action.componentPropertyReferences = { characters: keys.action, visible: keys.showAction };
    if (icon && keys.showIcon) icon.componentPropertyReferences = { visible: keys.showIcon };
    if (close && keys.showClose) close.componentPropertyReferences = { visible: keys.showClose };
  });
}
wireSet(set);

return { setId: set.id, variants: set.children.length, sectionId: section.id };
