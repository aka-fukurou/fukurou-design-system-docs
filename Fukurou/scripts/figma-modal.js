// use_figma — Modal / Dialog component set
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function resolveColor(variable) {
  var v = variable, g = 0;
  while (v && g++ < 12) {
    var mid = Object.keys(v.valuesByMode)[0];
    var val = v.valuesByMode[mid];
    if (val && val.type === "VARIABLE_ALIAS") v = figma.variables.getVariableById(val.id);
    else return val;
  }
  return { r: 1, g: 1, b: 1, a: 1 };
}
function boundPaint(variable) {
  var c = resolveColor(variable);
  return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: c.r, g: c.g, b: c.b }, opacity: c.a === undefined ? 1 : c.a }, "color", variable);
}

var page = figma.root.children.find(function (p) { return p.name === "_Documentation"; });
await figma.setCurrentPageAsync(page);
var section = page.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Modal Dialog"; });
if (!section) {
  section = figma.createSection(); section.name = "Component/Modal Dialog"; page.appendChild(section);
  var tipSec = page.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Tooltip"; });
  section.x = tipSec ? tipSec.x : 80; section.y = tipSec ? tipSec.y + 900 : 900;
  section.resizeWithoutConstraints(1400, 1600);
}
var existing = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Modal / Dialog"; });
if (existing) existing.remove();

var buttonsPage = figma.root.children.find(function (p) { return p.name === "Buttons"; });
var btnSet = buttonsPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Button"; });
var iconSet = buttonsPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Icon Button"; });
var btnPrimary = btnSet.children.find(function (c) { return c.name === "Type=Action, Size=Medium, State=Default"; });
var btnSecondary = btnSet.children.find(function (c) { return c.name === "Type=Secondary, Size=Medium, State=Default"; });
var iconClose = iconSet.children.find(function (c) { return c.name === "Content=Icon, State=Default"; });
var btnLabelKey = Object.keys(btnSet.componentPropertyDefinitions).find(function (k) { return k.indexOf("Label") === 0; });

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var headingMd = figma.getLocalTextStyles().find(function (s) { return s.name === "heading/md"; });
var bodyMd = figma.getLocalTextStyles().find(function (s) { return s.name === "body/md"; });
var radius12 = gv("radius/12");
var pad = gv("density/modal/padding");
var gap = gv("density/modal/gap");
var wSm = gv("density/modal/width-sm");
var wMd = gv("density/modal/width-md");
var wLg = gv("density/modal/width-lg");
var effectStyles = figma.getLocalEffectStyles();
var modalEffect = effectStyles.find(function (s) { return /modal/i.test(s.name); }) || effectStyles.find(function (s) { return /popover/i.test(s.name); });

var types = ["Default", "Confirmation", "Danger confirmation"];
var sizes = ["Small", "Medium", "Large"];
var widthMap = { Small: wSm, Medium: wMd, Large: wLg };
var propKeys = {};

function build(type, size) {
  var root = figma.createComponent();
  root.name = "Type=" + type + ", Size=" + size;
  root.layoutMode = "VERTICAL"; root.primaryAxisSizingMode = "AUTO"; root.counterAxisSizingMode = "FIXED";
  root.setBoundVariable("width", widthMap[size]);
  root.setBoundVariable("paddingLeft", pad); root.setBoundVariable("paddingRight", pad);
  root.setBoundVariable("paddingTop", pad); root.setBoundVariable("paddingBottom", pad);
  root.setBoundVariable("itemSpacing", gap);
  root.fills = [boundPaint(gv("color/modal/background/default"))];
  root.strokes = [boundPaint(gv("color/modal/border/default"))]; root.strokeWeight = 1; root.strokeAlign = "INSIDE";
  root.setBoundVariable("cornerRadius", radius12); root.clipsContent = false;
  if (modalEffect) root.effectStyleId = modalEffect.id;

  var header = figma.createFrame(); header.name = "header";
  header.layoutMode = "HORIZONTAL"; header.primaryAxisSizingMode = "AUTO"; header.counterAxisSizingMode = "AUTO";
  header.counterAxisAlignItems = "CENTER"; header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.itemSpacing = 12; header.fills = []; root.appendChild(header); header.layoutSizingHorizontal = "FILL";

  var title = figma.createText(); title.name = "title"; title.fontName = { family: "Poppins", style: "SemiBold" };
  title.characters = type.indexOf("Danger") >= 0 ? "Delete item?" : "Confirm changes";
  title.fontSize = 24; title.lineHeight = { unit: "PIXELS", value: 32 };
  title.fills = [boundPaint(gv("color/modal/title/default"))]; header.appendChild(title);
  title.layoutGrow = 1; title.textAutoResize = "HEIGHT"; title.layoutSizingHorizontal = "FILL";

  var close = iconClose.createInstance(); close.name = "close-button"; header.appendChild(close);
  close.layoutSizingHorizontal = "HUG"; close.layoutSizingVertical = "HUG";

  var body = figma.createFrame(); body.name = "body"; body.layoutMode = "VERTICAL"; body.primaryAxisSizingMode = "AUTO"; body.counterAxisSizingMode = "AUTO";
  body.fills = []; root.appendChild(body); body.layoutSizingHorizontal = "FILL";
  var bodyText = figma.createText(); bodyText.name = "body-text"; bodyText.fontName = { family: "Poppins", style: "Regular" };
  bodyText.characters = type.indexOf("Danger") >= 0 ? "This action cannot be undone." : "Are you sure you want to continue?";
  if (bodyMd) bodyText.textStyleId = bodyMd.id;
  bodyText.fills = [boundPaint(gv("color/modal/body/default"))]; body.appendChild(bodyText);
  bodyText.textAutoResize = "HEIGHT"; bodyText.layoutSizingHorizontal = "FILL";

  var footer = figma.createFrame(); footer.name = "footer";
  footer.layoutMode = "HORIZONTAL"; footer.primaryAxisSizingMode = "AUTO"; footer.counterAxisSizingMode = "AUTO";
  footer.primaryAxisAlignItems = "MAX"; footer.counterAxisAlignItems = "CENTER";
  footer.itemSpacing = 12; footer.fills = []; root.appendChild(footer); footer.layoutSizingHorizontal = "FILL";

  var secondary = btnSecondary.createInstance(); secondary.name = "secondary-action"; footer.appendChild(secondary);
  secondary.layoutSizingHorizontal = "HUG";
  var primary = btnPrimary.createInstance(); primary.name = "primary-action"; footer.appendChild(primary);
  primary.layoutSizingHorizontal = "HUG";

  var priLabel = type.indexOf("Danger") >= 0 ? "Delete" : "Continue";
  var secLabel = "Cancel";
  if (btnLabelKey) {
    var p = {}; p[btnLabelKey] = priLabel; try { primary.setProperties(p); } catch (e) {}
    p[btnLabelKey] = secLabel; try { secondary.setProperties(p); } catch (e) {}
  }

  if (type === "Default" && size === "Medium") {
    propKeys.title = root.addComponentProperty("Title", "TEXT", "Confirm changes");
    propKeys.body = root.addComponentProperty("Body", "TEXT", "Are you sure you want to continue?");
    propKeys.primary = root.addComponentProperty("Primary action", "TEXT", "Continue");
    propKeys.secondary = root.addComponentProperty("Secondary action", "TEXT", "Cancel");
    propKeys.showClose = root.addComponentProperty("Show close button", "BOOLEAN", true);
    propKeys.showFooter = root.addComponentProperty("Show footer", "BOOLEAN", true);
    propKeys.showSecondary = root.addComponentProperty("Show secondary action", "BOOLEAN", true);
    title.componentPropertyReferences = { characters: propKeys.title };
    bodyText.componentPropertyReferences = { characters: propKeys.body };
    close.componentPropertyReferences = { visible: propKeys.showClose };
    footer.componentPropertyReferences = { visible: propKeys.showFooter };
    secondary.componentPropertyReferences = { visible: propKeys.showSecondary };
    // Button label props wired via nested instances - document in description
  }
  root.counterAxisSizingMode = "AUTO";
  return root;
}

var variants = [];
types.forEach(function (t) { sizes.forEach(function (s) { variants.push(build(t, s)); }); });
var set = figma.combineAsVariants(variants, section);
set.name = "Modal / Dialog";
set.layoutMode = "HORIZONTAL"; set.layoutWrap = "WRAP"; set.itemSpacing = 32; set.counterAxisSpacing = 32;
set.paddingTop = 32; set.paddingBottom = 32; set.paddingLeft = 32; set.paddingRight = 32;
set.primaryAxisSizingMode = "AUTO"; set.counterAxisSizingMode = "AUTO"; set.clipsContent = false;
set.x = 0; set.y = 0; set.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; set.cornerRadius = 16;
set.description = "Modal / Dialog — focused tasks & blocking decisions. Type: Default/Confirmation/Danger confirmation. Size: S/M/L. Reuses Button + Icon Button. Toggles: close/footer/secondary. Trap focus + Escape in code. Danger type uses Action button (no Danger button variant).";

function wireSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var keys = { title: key("Title"), body: key("Body"), showClose: key("Show close button"), showFooter: key("Show footer"), showSecondary: key("Show secondary action") };
  cs.children.forEach(function (ch) {
    var title = ch.findOne(function (n) { return n.name === "title"; });
    var bodyText = ch.findOne(function (n) { return n.name === "body-text"; });
    var close = ch.findOne(function (n) { return n.name === "close-button"; });
    var footer = ch.findOne(function (n) { return n.name === "footer"; });
    var secondary = ch.findOne(function (n) { return n.name === "secondary-action"; });
    if (title && keys.title) title.componentPropertyReferences = { characters: keys.title };
    if (bodyText && keys.body) bodyText.componentPropertyReferences = { characters: keys.body };
    if (close && keys.showClose) close.componentPropertyReferences = { visible: keys.showClose };
    if (footer && keys.showFooter) footer.componentPropertyReferences = { visible: keys.showFooter };
    if (secondary && keys.showSecondary) secondary.componentPropertyReferences = { visible: keys.showSecondary };
  });
}
wireSet(set);

return { setId: set.id, variants: set.children.length, sectionId: section.id, btnLabelKey: btnLabelKey };
