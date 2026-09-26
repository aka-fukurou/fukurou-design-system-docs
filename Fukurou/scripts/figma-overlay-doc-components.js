// use_figma — Tooltip + Modal component sets (_Documentation page)
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
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });

// --- Tooltip ---
var tipSection = page.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Tooltip"; });
if (!tipSection) {
  tipSection = figma.createSection(); tipSection.name = "Component/Tooltip"; page.appendChild(tipSection);
  tipSection.x = 80; tipSection.y = 80; tipSection.resizeWithoutConstraints(900, 700);
}
var tipExisting = tipSection.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Tooltip"; });
if (tipExisting) tipExisting.remove();

var bodySm = figma.getLocalTextStyles().find(function (s) { return s.name === "body/sm"; });
var radius8 = gv("radius/8");
var tipPadX = gv("density/tooltip/padding-x");
var tipPadY = gv("density/tooltip/padding-y");
var effectStyles = figma.getLocalEffectStyles();
var floatEffect = effectStyles.find(function (s) { return /floating/i.test(s.name); }) || effectStyles.find(function (s) { return /popover/i.test(s.name); });
var arrowPaths = { down: "M0 0 L8 0 L4 6 Z", up: "M0 6 L8 6 L4 0 Z", right: "M0 0 L6 4 L0 8 Z", left: "M6 0 L6 8 L0 4 Z" };
var placements = ["Top", "Right", "Bottom", "Left"];

function tipBubble() {
  var b = figma.createFrame(); b.name = "tooltip-container";
  b.layoutMode = "HORIZONTAL"; b.primaryAxisSizingMode = "AUTO"; b.counterAxisSizingMode = "AUTO";
  b.setBoundVariable("paddingLeft", tipPadX); b.setBoundVariable("paddingRight", tipPadX);
  b.setBoundVariable("paddingTop", tipPadY); b.setBoundVariable("paddingBottom", tipPadY);
  b.fills = [boundPaint(gv("color/tooltip/background/default"))];
  b.setBoundVariable("cornerRadius", radius8); b.clipsContent = false;
  if (floatEffect) b.effectStyleId = floatEffect.id;
  var txt = figma.createText(); txt.name = "message"; txt.fontName = { family: "Poppins", style: "Regular" };
  txt.characters = "More information about this option."; if (bodySm) txt.textStyleId = bodySm.id;
  txt.fills = [boundPaint(gv("color/tooltip/text/default"))]; b.appendChild(txt);
  txt.textAutoResize = "WIDTH_AND_HEIGHT"; txt.layoutSizingHorizontal = "HUG";
  return b;
}
function tipArrow(dir) {
  var a = figma.createVector(); a.name = "arrow";
  a.vectorPaths = [{ windingRule: "NONZERO", data: arrowPaths[dir] }];
  a.fills = [boundPaint(gv("color/tooltip/arrow/default"))]; a.strokes = []; a.resize(8, 8);
  return a;
}
function buildTip(placement) {
  var root = figma.createComponent();
  root.name = "Placement=" + placement;
  root.fills = []; root.clipsContent = false;
  var p = placement.toLowerCase();
  root.layoutMode = (p === "top" || p === "bottom") ? "VERTICAL" : "HORIZONTAL";
  root.primaryAxisSizingMode = "AUTO"; root.counterAxisSizingMode = "AUTO";
  root.counterAxisAlignItems = "CENTER"; root.primaryAxisAlignItems = "CENTER"; root.itemSpacing = 0;
  var b = tipBubble();
  var a = tipArrow(p === "top" ? "down" : p === "bottom" ? "up" : p === "left" ? "right" : "left");
  if (p === "top") { root.appendChild(b); root.appendChild(a); }
  else if (p === "bottom") { root.appendChild(a); root.appendChild(b); }
  else if (p === "left") { root.appendChild(b); root.appendChild(a); }
  else { root.appendChild(a); root.appendChild(b); }
  b.layoutSizingHorizontal = "HUG"; b.layoutSizingVertical = "HUG";
  a.layoutSizingHorizontal = "FIXED"; a.layoutSizingVertical = "FIXED";
  if (placement === "Top") {
    var textKey = root.addComponentProperty("Tooltip text", "TEXT", "More information about this option.");
    var arrowKey = root.addComponentProperty("Show arrow", "BOOLEAN", true);
    b.findOne(function (n) { return n.name === "message"; }).componentPropertyReferences = { characters: textKey };
    a.componentPropertyReferences = { visible: arrowKey };
  }
  return root;
}
var tipSet = figma.combineAsVariants(placements.map(buildTip), tipSection);
tipSet.name = "Tooltip";
tipSet.layoutMode = "HORIZONTAL"; tipSet.layoutWrap = "WRAP"; tipSet.itemSpacing = 32; tipSet.counterAxisSpacing = 32;
tipSet.paddingTop = 32; tipSet.paddingBottom = 32; tipSet.paddingLeft = 32; tipSet.paddingRight = 32;
tipSet.primaryAxisSizingMode = "AUTO"; tipSet.counterAxisSizingMode = "AUTO"; tipSet.clipsContent = false;
tipSet.x = 0; tipSet.y = 0; tipSet.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; tipSet.cornerRadius = 16;
tipSet.description = "Tooltip — short contextual help. Placement: Top/Right/Bottom/Left. Show arrow toggle. Inverse surface + text (theme-aware). Keep copy short; not for critical info. Keyboard/screen-reader patterns required in code.";
(function wireTip(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var keys = { text: key("Tooltip text"), showArrow: key("Show arrow") };
  cs.children.forEach(function (ch) {
    var msg = ch.findOne(function (n) { return n.name === "message"; });
    var arr = ch.findOne(function (n) { return n.name === "arrow"; });
    if (msg && keys.text) msg.componentPropertyReferences = { characters: keys.text };
    if (arr && keys.showArrow) arr.componentPropertyReferences = { visible: keys.showArrow };
  });
})(tipSet);

// --- Modal ---
var modalSection = page.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Modal Dialog"; });
if (!modalSection) {
  modalSection = figma.createSection(); modalSection.name = "Component/Modal Dialog"; page.appendChild(modalSection);
  modalSection.x = tipSection.x; modalSection.y = tipSection.y + 900;
  modalSection.resizeWithoutConstraints(1400, 1600);
}
var modalExisting = modalSection.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Modal / Dialog"; });
if (modalExisting) modalExisting.remove();

var buttonsPage = figma.root.children.find(function (p) { return p.name === "Buttons"; });
var btnSet = buttonsPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Button"; });
var iconSet = buttonsPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Icon Button"; });
var btnPrimary = btnSet.children.find(function (c) { return c.name === "Type=Action, Size=Medium, State=Default"; });
var btnSecondary = btnSet.children.find(function (c) { return c.name === "Type=Secondary, Size=Medium, State=Default"; });
var iconClose = iconSet.children.find(function (c) { return c.name === "Content=Icon, State=Default"; });
var btnLabelKey = Object.keys(btnSet.componentPropertyDefinitions).find(function (k) { return k.indexOf("Label") === 0; });
var headingMd = figma.getLocalTextStyles().find(function (s) { return s.name === "heading/md"; });
var bodyMd = figma.getLocalTextStyles().find(function (s) { return s.name === "body/md"; });
var radius12 = gv("radius/12");
var pad = gv("density/modal/padding");
var gap = gv("density/modal/gap");
var widthMap = { Small: gv("density/modal/width-sm"), Medium: gv("density/modal/width-md"), Large: gv("density/modal/width-lg") };
var modalEffect = effectStyles.find(function (s) { return /modal/i.test(s.name); }) || effectStyles.find(function (s) { return /popover/i.test(s.name); });

function buildModal(type, size) {
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
  if (btnLabelKey) {
    var p = {}; p[btnLabelKey] = type.indexOf("Danger") >= 0 ? "Delete" : "Continue"; try { primary.setProperties(p); } catch (e) {}
    p[btnLabelKey] = "Cancel"; try { secondary.setProperties(p); } catch (e) {}
  }

  if (type === "Default" && size === "Medium") {
    var pk = {
      title: root.addComponentProperty("Title", "TEXT", "Confirm changes"),
      body: root.addComponentProperty("Body", "TEXT", "Are you sure you want to continue?"),
      showClose: root.addComponentProperty("Show close button", "BOOLEAN", true),
      showFooter: root.addComponentProperty("Show footer", "BOOLEAN", true),
      showSecondary: root.addComponentProperty("Show secondary action", "BOOLEAN", true)
    };
    title.componentPropertyReferences = { characters: pk.title };
    bodyText.componentPropertyReferences = { characters: pk.body };
    close.componentPropertyReferences = { visible: pk.showClose };
    footer.componentPropertyReferences = { visible: pk.showFooter };
    secondary.componentPropertyReferences = { visible: pk.showSecondary };
  }
  root.counterAxisSizingMode = "AUTO";
  return root;
}
var modalVariants = [];
["Default", "Confirmation", "Danger confirmation"].forEach(function (t) {
  ["Small", "Medium", "Large"].forEach(function (s) { modalVariants.push(buildModal(t, s)); });
});
var modalSet = figma.combineAsVariants(modalVariants, modalSection);
modalSet.name = "Modal / Dialog";
modalSet.layoutMode = "HORIZONTAL"; modalSet.layoutWrap = "WRAP"; modalSet.itemSpacing = 32; modalSet.counterAxisSpacing = 32;
modalSet.paddingTop = 32; modalSet.paddingBottom = 32; modalSet.paddingLeft = 32; modalSet.paddingRight = 32;
modalSet.primaryAxisSizingMode = "AUTO"; modalSet.counterAxisSizingMode = "AUTO"; modalSet.clipsContent = false;
modalSet.x = 0; modalSet.y = 0; modalSet.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; modalSet.cornerRadius = 16;
modalSet.description = "Modal / Dialog — focused tasks & blocking decisions. Type: Default/Confirmation/Danger confirmation. Size: S/M/L. Reuses Button + Icon Button. Toggles: close/footer/secondary. Trap focus + Escape in code. Danger type uses Action button (no Danger button variant).";
(function wireModal(cs) {
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
})(modalSet);

return { tooltipId: tipSet.id, tooltipVariants: tipSet.children.length, modalId: modalSet.id, modalVariants: modalSet.children.length };
