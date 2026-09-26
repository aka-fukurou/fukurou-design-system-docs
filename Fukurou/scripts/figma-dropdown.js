// use_figma — Dropdown trigger, menu option, menu panel
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
    if ("fills" in n) try { n.fills = [paint]; } catch (e) {}
    if ("strokes" in n && n.strokeWeight > 0) try { n.strokes = [paint]; } catch (e) {}
  });
}
function buildIconSet(page, name, makeGlyph, yPos) {
  function variant(size) {
    var c = figma.createComponent(); c.name = "Size=" + size; c.resize(size, size); c.fills = [];
    c.appendChild(makeGlyph(size)); return c;
  }
  var c16 = variant(16), c20 = variant(20);
  page.appendChild(c16); c16.x = 1400; c16.y = yPos;
  page.appendChild(c20); c20.x = 1400; c20.y = yPos + 80;
  var set = figma.combineAsVariants([c16, c20], page);
  set.name = name; set.x = 1380; set.y = yPos - 20;
  return { 16: c16, 20: c20, set: set };
}

var cardsPage = figma.root.children.find(function (p) { return p.name === "Cards"; });
await figma.setCurrentPageAsync(cardsPage);
var starSet = cardsPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Icon / Placeholder / Star"; });
var icon16 = starSet.children.find(function (c) { return c.name === "Size=16"; });
var icon20 = starSet.children.find(function (c) { return c.name === "Size=20"; });

if (!cardsPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Icon / Placeholder / Chevron Down"; })) {
  buildIconSet(cardsPage, "Icon / Placeholder / Chevron Down", function (size) {
    var v = figma.createVector(); v.name = "icon";
    v.vectorPaths = [{ windingRule: "NONZERO", data: "M 3 5 L 8 10 L 13 5" }];
    v.resize(size * 0.75, size * 0.75); v.x = size * 0.125; v.y = size * 0.2;
    v.strokes = [boundPaint(gv("color/text/subtle"))]; v.strokeWeight = Math.max(1.5, size / 10); v.fills = [];
    v.strokeCap = "ROUND"; v.strokeJoin = "ROUND"; return v;
  }, 400);
}
if (!cardsPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Icon / Placeholder / Check"; })) {
  buildIconSet(cardsPage, "Icon / Placeholder / Check", function (size) {
    var v = figma.createVector(); v.name = "icon";
    v.vectorPaths = [{ windingRule: "NONZERO", data: "M 3 8 L 6 11 L 13 4" }];
    v.resize(size * 0.75, size * 0.75); v.x = size * 0.125; v.y = size * 0.125;
    v.strokes = [boundPaint(gv("color/text/action"))]; v.strokeWeight = Math.max(1.5, size / 10); v.fills = [];
    v.strokeCap = "ROUND"; v.strokeJoin = "ROUND"; return v;
  }, 560);
}
var chevronSet = cardsPage.findOne(function (n) { return n.name === "Icon / Placeholder / Chevron Down"; });
var checkSet = cardsPage.findOne(function (n) { return n.name === "Icon / Placeholder / Check"; });
var chevron16 = chevronSet.children.find(function (c) { return c.name === "Size=16"; });
var chevron20 = chevronSet.children.find(function (c) { return c.name === "Size=20"; });
var check16 = checkSet.children.find(function (c) { return c.name === "Size=16"; });

var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
["Dropdown", "Dropdown / Menu / Option", "Dropdown / Menu"].forEach(function (n) {
  var ex = formPage.findOne(function (node) { return (node.type === "COMPONENT_SET" || node.type === "COMPONENT") && node.name === n; });
  if (ex) ex.remove();
});

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var bodySm = figma.getLocalTextStyles().find(function (s) { return s.name === "body/sm"; });
var bodyMd = figma.getLocalTextStyles().find(function (s) { return s.name === "body/md"; });
var caption = figma.getLocalTextStyles().find(function (s) { return s.name === "caption/md"; });
var radius8 = gv("radius/8");
var borderSm = gv("border/width/sm");
var borderMd = gv("border/width/md");
var spacing2 = gv("spacing/2");
var gapTok = gv("density/dropdown/gap");
var menuOptH = gv("density/dropdown-menu/option-height");
var menuPadX = gv("density/dropdown-menu/padding-x");
var popoverStyle = figma.getLocalEffectStyles().find(function (s) { return s.name === "Elevation / Popover"; });

var states = ["Default", "Hover", "Focus", "Filled", "Error", "Disabled"];
var sizes = ["Small", "Medium"];
var cfg = {
  Default: { bg: "default", border: "default", label: "default", icon: "default", chars: "placeholder" },
  Hover: { bg: "default", border: "hover", label: "default", icon: "default", chars: "placeholder" },
  Focus: { bg: "focus", border: "focus", label: "focus", icon: "focus", chars: "placeholder", ring: true },
  Filled: { bg: "filled", border: "default", label: "default", icon: "default", chars: "value" },
  Error: { bg: "error", border: "error", label: "error", icon: "error", chars: "value" },
  Disabled: { bg: "disabled", border: "disabled", label: "disabled", icon: "disabled", chars: "placeholder", opacity: 0.6, input: "disabled" }
};

var propKeys = {};
function buildTrigger(state, size) {
  var c = cfg[state];
  var heightTok = gv(size === "Small" ? "density/dropdown/small/height" : "density/dropdown/medium/height");
  var padTok = gv(size === "Small" ? "density/dropdown/small/padding-x" : "density/dropdown/medium/padding-x");
  var chevronComp = size === "Small" ? chevron16 : chevron20;
  var textStyle = size === "Small" ? bodySm : bodyMd;
  var root = figma.createComponent();
  root.name = "State=" + state + ", Size=" + size;
  root.layoutMode = "VERTICAL"; root.primaryAxisSizingMode = "AUTO"; root.counterAxisSizingMode = "FIXED";
  root.resize(320, 10); root.setBoundVariable("itemSpacing", spacing2); root.fills = [];
  var labelRow = figma.createFrame();
  labelRow.name = "label-row"; labelRow.layoutMode = "HORIZONTAL"; labelRow.primaryAxisSizingMode = "AUTO"; labelRow.counterAxisSizingMode = "AUTO";
  labelRow.itemSpacing = 4; labelRow.fills = []; root.appendChild(labelRow); labelRow.layoutSizingHorizontal = "FILL";
  var label = figma.createText(); label.name = "label"; label.fontName = { family: "Poppins", style: "SemiBold" };
  label.characters = "Filing status"; if (bodySm) label.textStyleId = bodySm.id;
  label.fills = [boundPaint(gv("color/dropdown/label/" + c.label))]; labelRow.appendChild(label);
  label.textAutoResize = "WIDTH_AND_HEIGHT"; label.layoutSizingHorizontal = "HUG";
  var req = figma.createText(); req.name = "required"; req.fontName = { family: "Poppins", style: "SemiBold" };
  req.characters = "*"; req.fills = [boundPaint(gv("color/dropdown/label/error"))]; labelRow.appendChild(req);
  req.textAutoResize = "WIDTH_AND_HEIGHT"; req.layoutSizingHorizontal = "HUG"; req.visible = false;
  var triggerWrap = root;
  if (c.ring) {
    var focusRing = figma.createFrame();
    focusRing.name = "focus-ring"; focusRing.layoutMode = "HORIZONTAL"; focusRing.primaryAxisSizingMode = "AUTO"; focusRing.counterAxisSizingMode = "AUTO";
    focusRing.fills = [boundPaint(gv("color/dropdown/focus/gap"))]; focusRing.strokes = [boundPaint(gv("color/dropdown/focus/ring"))];
    focusRing.setBoundVariable("strokeWeight", borderMd); focusRing.strokeAlign = "OUTSIDE";
    ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"].forEach(function (p) { focusRing.setBoundVariable(p, spacing2); });
    ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { focusRing.setBoundVariable(k, radius8); });
    root.appendChild(focusRing); focusRing.layoutSizingHorizontal = "FILL"; triggerWrap = focusRing;
  }
  var trigger = figma.createFrame();
  trigger.name = "select-trigger"; trigger.layoutMode = "HORIZONTAL"; trigger.primaryAxisSizingMode = "FIXED"; trigger.counterAxisSizingMode = "FIXED";
  trigger.counterAxisAlignItems = "CENTER"; trigger.primaryAxisAlignItems = "CENTER";
  trigger.setBoundVariable("height", heightTok); trigger.setBoundVariable("paddingLeft", padTok); trigger.setBoundVariable("paddingRight", padTok);
  trigger.setBoundVariable("itemSpacing", gapTok);
  trigger.fills = [boundPaint(gv("color/dropdown/background/" + c.bg))];
  trigger.strokes = [boundPaint(gv("color/dropdown/border/" + c.border))];
  trigger.setBoundVariable("strokeWeight", borderSm); trigger.strokeAlign = "INSIDE";
  ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { trigger.setBoundVariable(k, radius8); });
  triggerWrap.appendChild(trigger); trigger.layoutSizingHorizontal = "FILL";
  var lead = icon16.createInstance(); lead.name = "leading-icon"; lead.visible = false; trigger.appendChild(lead);
  lead.layoutSizingHorizontal = "FIXED"; lead.layoutSizingVertical = "FIXED"; bindIcon(lead, gv("color/dropdown/icon/" + c.icon));
  var ph = figma.createText(); ph.name = "placeholder-text"; ph.fontName = { family: "Poppins", style: "Regular" };
  ph.characters = "Select an option"; if (textStyle) ph.textStyleId = textStyle.id;
  ph.fills = [boundPaint(gv(c.input === "disabled" ? "color/dropdown/text/disabled" : "color/dropdown/text/placeholder"))];
  ph.visible = c.chars === "placeholder"; trigger.appendChild(ph);
  ph.textAutoResize = "HEIGHT"; ph.layoutSizingHorizontal = "FILL";
  var val = figma.createText(); val.name = "value-text"; val.fontName = { family: "Poppins", style: "Regular" };
  val.characters = "Single"; if (textStyle) val.textStyleId = textStyle.id;
  val.fills = [boundPaint(gv(c.input === "disabled" ? "color/dropdown/text/disabled" : "color/dropdown/text/value"))];
  val.visible = c.chars === "value"; trigger.appendChild(val);
  val.textAutoResize = "HEIGHT"; val.layoutSizingHorizontal = "FILL";
  var chev = chevronComp.createInstance(); chev.name = "chevron-icon"; trigger.appendChild(chev);
  chev.layoutSizingHorizontal = "FIXED"; chev.layoutSizingVertical = "FIXED"; bindIcon(chev, gv("color/dropdown/icon/" + c.icon));
  var support = figma.createFrame();
  support.name = "support-text"; support.layoutMode = "VERTICAL"; support.primaryAxisSizingMode = "AUTO"; support.counterAxisSizingMode = "AUTO";
  support.itemSpacing = 4; support.fills = []; root.appendChild(support); support.layoutSizingHorizontal = "FILL";
  var helper = figma.createText(); helper.name = "helper"; helper.fontName = { family: "Poppins", style: "Regular" };
  helper.characters = "Choose the option that best matches your tax situation."; if (caption) helper.textStyleId = caption.id;
  helper.fills = [boundPaint(gv("color/dropdown/helper/default"))]; helper.visible = false; support.appendChild(helper);
  helper.textAutoResize = "HEIGHT"; helper.layoutSizingHorizontal = "FILL";
  var errT = figma.createText(); errT.name = "error"; errT.fontName = { family: "Poppins", style: "Regular" };
  errT.characters = "Select a filing status to continue."; if (caption) errT.textStyleId = caption.id;
  errT.fills = [boundPaint(gv("color/dropdown/error/default"))]; errT.visible = state === "Error"; support.appendChild(errT);
  errT.textAutoResize = "HEIGHT"; errT.layoutSizingHorizontal = "FILL";
  if (c.opacity) root.opacity = c.opacity;
  if (state === "Default" && size === "Small") {
    propKeys.label = root.addComponentProperty("Label", "TEXT", "Filing status");
    propKeys.placeholder = root.addComponentProperty("Placeholder", "TEXT", "Select an option");
    propKeys.value = root.addComponentProperty("Value", "TEXT", "Single");
    propKeys.helper = root.addComponentProperty("Helper", "TEXT", "Choose the option that best matches your tax situation.");
    propKeys.errorText = root.addComponentProperty("Error", "TEXT", "Select a filing status to continue.");
    propKeys.showLabel = root.addComponentProperty("Show label", "BOOLEAN", true);
    propKeys.showHelper = root.addComponentProperty("Show helper text", "BOOLEAN", false);
    propKeys.showError = root.addComponentProperty("Show error text", "BOOLEAN", false);
    propKeys.required = root.addComponentProperty("Required", "BOOLEAN", false);
    propKeys.showLead = root.addComponentProperty("Show leading icon", "BOOLEAN", false);
    propKeys.leadSwap = root.addComponentProperty("Leading icon", "INSTANCE_SWAP", icon16.id);
    label.componentPropertyReferences = { characters: propKeys.label, visible: propKeys.showLabel };
    req.componentPropertyReferences = { visible: propKeys.required };
    helper.componentPropertyReferences = { characters: propKeys.helper };
    errT.componentPropertyReferences = { characters: propKeys.errorText };
    lead.componentPropertyReferences = { visible: propKeys.showLead, mainComponent: propKeys.leadSwap };
    ph.componentPropertyReferences = { characters: propKeys.placeholder };
    val.componentPropertyReferences = { characters: propKeys.value };
  }
  return root;
}

var triggerVariants = [];
states.forEach(function (state) { sizes.forEach(function (size) { triggerVariants.push(buildTrigger(state, size)); }); });
var dropdownSet = figma.combineAsVariants(triggerVariants, formPage);
dropdownSet.name = "Dropdown";
dropdownSet.layoutMode = "HORIZONTAL"; dropdownSet.layoutWrap = "WRAP"; dropdownSet.itemSpacing = 24; dropdownSet.counterAxisSpacing = 24;
dropdownSet.paddingTop = 32; dropdownSet.paddingBottom = 32; dropdownSet.paddingLeft = 32; dropdownSet.paddingRight = 32;
dropdownSet.primaryAxisSizingMode = "AUTO"; dropdownSet.counterAxisSizingMode = "AUTO";
dropdownSet.x = 80; dropdownSet.y = 900;
dropdownSet.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; dropdownSet.cornerRadius = 16;
dropdownSet.description = "Dropdown — select trigger. States: Default/Hover/Focus/Filled/Error/Disabled. Sizes: Small/Medium. Shares form-control tokens with Text Field family. Focus: offset ring. Chevron always visible.";

function wireDropdownSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  function parseState(name) { var p = {}; name.split(", ").forEach(function (s) { var kv = s.split("="); p[kv[0]] = kv[1]; }); return p.State; }
  var keys = {
    label: key("Label"), placeholder: key("Placeholder"), value: key("Value"), helper: key("Helper"), errorText: key("Error"),
    showLabel: key("Show label"), showHelper: key("Show helper"), showError: key("Show error text"), required: key("Required"),
    showLead: key("Show leading icon"), leadSwap: key("Leading icon")
  };
  cs.children.forEach(function (ch) {
    var state = parseState(ch.name);
    var label = ch.findOne(function (n) { return n.name === "label"; });
    var req = ch.findOne(function (n) { return n.name === "required"; });
    var helper = ch.findOne(function (n) { return n.name === "helper"; });
    var err = ch.findOne(function (n) { return n.name === "error"; });
    var lead = ch.findOne(function (n) { return n.name === "leading-icon"; });
    var ph = ch.findOne(function (n) { return n.name === "placeholder-text"; });
    var val = ch.findOne(function (n) { return n.name === "value-text"; });
    if (label && keys.label) label.componentPropertyReferences = { characters: keys.label, visible: keys.showLabel };
    if (req && keys.required) req.componentPropertyReferences = { visible: keys.required };
    if (ph && keys.placeholder) ph.componentPropertyReferences = { characters: keys.placeholder };
    if (val && keys.value) val.componentPropertyReferences = { characters: keys.value };
    if (lead && keys.showLead) lead.componentPropertyReferences = { visible: keys.showLead, mainComponent: keys.leadSwap };
    if (helper && keys.helper) {
      helper.componentPropertyReferences = { characters: keys.helper };
      if (state === "Error") helper.visible = false;
      else { helper.componentPropertyReferences.visible = keys.showHelper; helper.visible = false; }
    }
    if (err && keys.errorText) {
      err.componentPropertyReferences = { characters: keys.errorText };
      if (state === "Error") err.visible = true;
      else { err.componentPropertyReferences.visible = keys.showError; err.visible = false; }
    }
  });
}
wireDropdownSet(dropdownSet);

var optStates = ["Default", "Hover", "Selected", "Disabled"];
var optCfg = {
  Default: { bg: "default", text: "default", check: false },
  Hover: { bg: "hover", text: "default", check: false },
  Selected: { bg: "selected", text: "selected", check: true },
  Disabled: { bg: "default", text: "disabled", check: false }
};
var optPropKeys = {};
function buildOption(state) {
  var c = optCfg[state];
  var row = figma.createComponent();
  row.name = "State=" + state;
  row.layoutMode = "HORIZONTAL"; row.primaryAxisSizingMode = "FIXED"; row.counterAxisSizingMode = "FIXED";
  row.counterAxisAlignItems = "CENTER"; row.primaryAxisAlignItems = "CENTER";
  row.resize(280, 40); row.setBoundVariable("height", menuOptH);
  row.setBoundVariable("paddingLeft", menuPadX); row.setBoundVariable("paddingRight", menuPadX);
  row.setBoundVariable("itemSpacing", gapTok);
  row.fills = [boundPaint(gv("color/dropdown-menu/option/background/" + c.bg))];
  var check = check16.createInstance(); check.name = "checkmark"; check.visible = c.check; row.appendChild(check);
  check.layoutSizingHorizontal = "FIXED"; check.layoutSizingVertical = "FIXED";
  bindIcon(check, gv("color/dropdown-menu/checkmark/default"));
  var txt = figma.createText(); txt.name = "option-text"; txt.fontName = { family: "Poppins", style: "Regular" };
  txt.characters = "Single"; if (bodyMd) txt.textStyleId = bodyMd.id;
  txt.fills = [boundPaint(gv("color/dropdown-menu/option/text/" + c.text))]; row.appendChild(txt);
  txt.textAutoResize = "HEIGHT"; txt.layoutSizingHorizontal = "FILL";
  if (state === "Default") {
    optPropKeys.text = row.addComponentProperty("Option", "TEXT", "Single");
    optPropKeys.selected = row.addComponentProperty("Selected", "BOOLEAN", false);
    optPropKeys.disabled = row.addComponentProperty("Disabled", "BOOLEAN", false);
    optPropKeys.showCheck = row.addComponentProperty("Show checkmark", "BOOLEAN", false);
    txt.componentPropertyReferences = { characters: optPropKeys.text };
    check.componentPropertyReferences = { visible: optPropKeys.showCheck };
  }
  return row;
}
var optVariants = optStates.map(buildOption);
var optionSet = figma.combineAsVariants(optVariants, formPage);
optionSet.name = "Dropdown / Menu / Option";
optionSet.layoutMode = "HORIZONTAL"; optionSet.itemSpacing = 16; optionSet.paddingTop = 24; optionSet.paddingBottom = 24;
optionSet.paddingLeft = 24; optionSet.paddingRight = 24; optionSet.primaryAxisSizingMode = "AUTO"; optionSet.counterAxisSizingMode = "AUTO";
optionSet.x = 80; optionSet.y = 1600;
optionSet.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; optionSet.cornerRadius = 16;

var menu = figma.createComponent();
menu.name = "Dropdown / Menu";
menu.layoutMode = "VERTICAL"; menu.primaryAxisSizingMode = "AUTO"; menu.counterAxisSizingMode = "FIXED";
menu.resize(320, 10); menu.itemSpacing = 0; menu.paddingTop = 4; menu.paddingBottom = 4;
menu.fills = [boundPaint(gv("color/dropdown-menu/background/default"))];
menu.strokes = [boundPaint(gv("color/dropdown-menu/border/default"))];
menu.setBoundVariable("strokeWeight", borderSm); menu.strokeAlign = "INSIDE";
["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { menu.setBoundVariable(k, radius8); });
if (popoverStyle) menu.effectStyleId = popoverStyle.id;
formPage.appendChild(menu); menu.x = 80; menu.y = 2100; menu.layoutSizingHorizontal = "FIXED";
var options = ["Single", "Married filing jointly", "Married filing separately", "Head of household", "Qualifying surviving spouse"];
options.forEach(function (label, i) {
  var st = i === 0 ? "Selected" : (i === 4 ? "Disabled" : "Default");
  var inst = optionSet.children.find(function (c) { return c.name === "State=" + st; }).createInstance();
  inst.name = "option-" + (i + 1); menu.appendChild(inst); inst.layoutSizingHorizontal = "FILL";
  try {
    var pp = { Option: label };
    if (st === "Selected") pp["Show checkmark"] = true;
    inst.setProperties(pp);
  } catch (e) {}
});
menu.description = "Dropdown menu panel — elevated popover with option rows. Apply Elevation / Popover. Width matches trigger in examples.";

return {
  dropdownSetId: dropdownSet.id,
  dropdownVariants: dropdownSet.children.length,
  optionSetId: optionSet.id,
  menuId: menu.id,
  propKeys: propKeys,
  optPropKeys: optPropKeys
};
