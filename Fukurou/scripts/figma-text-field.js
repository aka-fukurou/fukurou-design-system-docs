// Reference script for use_figma — Text Field component creation
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

var cardPage = figma.root.children.find(function (p) { return p.name === "Card"; });
await figma.setCurrentPageAsync(cardPage);
var iconSet = cardPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Icon / Placeholder / Star"; });
var icon16 = iconSet.children.find(function (c) { return c.name === "Size=16"; });
var icon20 = iconSet.children.find(function (c) { return c.name === "Size=20"; });

var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
if (!formPage) { formPage = figma.createPage(); formPage.name = "Form"; }
await figma.setCurrentPageAsync(formPage);
var existing = formPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Text Field"; });
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
  Default: { bg: "default", border: "default", label: "default", input: "placeholder", icon: "default", chars: "placeholder" },
  Hover: { bg: "default", border: "hover", label: "default", input: "placeholder", icon: "default", chars: "placeholder" },
  Focus: { bg: "focus", border: "focus", label: "focus", input: "placeholder", icon: "focus", chars: "placeholder", ring: true },
  Filled: { bg: "filled", border: "filled", label: "default", input: "filled", icon: "default", chars: "value" },
  Error: { bg: "error", border: "error", label: "error", input: "filled", icon: "error", chars: "value" },
  Disabled: { bg: "disabled", border: "disabled", label: "disabled", input: "disabled", icon: "disabled", chars: "placeholder", opacity: 0.6 }
};

var propKeys = {};
function build(state, size) {
  var c = cfg[state];
  var heightTok = gv(size === "Small" ? "density/text-field/small/height" : "density/text-field/medium/height");
  var padTok = gv(size === "Small" ? "density/text-field/small/padding-x" : "density/text-field/medium/padding-x");
  var iconComp = size === "Small" ? icon16 : icon20;
  var textStyle = size === "Small" ? bodySm : bodyMd;

  var root = figma.createComponent();
  root.name = "State=" + state + ", Size=" + size;
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "FIXED";
  root.resize(320, 10);
  root.itemSpacing = 6;
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

  var label = figma.createText();
  label.name = "label";
  label.fontName = { family: "Poppins", style: "SemiBold" };
  label.characters = "Email address";
  if (bodySm) label.textStyleId = bodySm.id;
  label.fills = [boundPaint(gv("color/text-field/label/" + c.label))];
  labelRow.appendChild(label);
  label.layoutSizingHorizontal = "HUG";

  var req = figma.createText();
  req.name = "required";
  req.fontName = { family: "Poppins", style: "SemiBold" };
  req.characters = "*";
  req.fills = [boundPaint(gv("color/text-field/label/error"))];
  labelRow.appendChild(req);
  req.layoutSizingHorizontal = "HUG";

  var inputWrap = root;
  var focusRing = null;
  if (c.ring) {
    focusRing = figma.createFrame();
    focusRing.name = "focus-ring";
    focusRing.layoutMode = "HORIZONTAL";
    focusRing.primaryAxisSizingMode = "AUTO";
    focusRing.counterAxisSizingMode = "AUTO";
    focusRing.fills = [boundPaint(gv("color/text-field/focus/gap"))];
    focusRing.strokes = [boundPaint(gv("color/text-field/focus/ring"))];
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
  input.fills = [boundPaint(gv("color/text-field/background/" + c.bg))];
  input.strokes = [boundPaint(gv("color/text-field/border/" + c.border))];
  input.setBoundVariable("strokeWeight", borderSm);
  input.strokeAlign = "INSIDE";
  ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) {
    input.setBoundVariable(k, radius8);
  });
  inputWrap.appendChild(input);
  input.layoutSizingHorizontal = "FILL";

  var lead = iconComp.createInstance();
  lead.name = "leading-icon";
  lead.visible = false;
  input.appendChild(lead);
  lead.layoutSizingHorizontal = "FIXED";
  lead.layoutSizingVertical = "FIXED";
  bindIcon(lead, gv("color/text-field/icon/" + c.icon));

  var placeholderText = figma.createText();
  placeholderText.name = "placeholder-text";
  placeholderText.fontName = { family: "Poppins", style: "Regular" };
  placeholderText.characters = "Enter email address";
  if (textStyle) placeholderText.textStyleId = textStyle.id;
  var phTok = c.input === "disabled" ? "color/text-field/text/disabled" : "color/text-field/text/placeholder";
  placeholderText.fills = [boundPaint(gv(phTok))];
  placeholderText.visible = c.chars === "placeholder";
  input.appendChild(placeholderText);
  placeholderText.layoutSizingHorizontal = "FILL";

  var valueText = figma.createText();
  valueText.name = "value-text";
  valueText.fontName = { family: "Poppins", style: "Regular" };
  valueText.characters = "user@example.com";
  if (textStyle) valueText.textStyleId = textStyle.id;
  var valueTok = c.input === "disabled" ? "color/text-field/text/disabled" : "color/text-field/text/filled";
  valueText.fills = [boundPaint(gv(valueTok))];
  valueText.visible = c.chars === "value";
  input.appendChild(valueText);
  valueText.layoutSizingHorizontal = "FILL";

  var trail = iconComp.createInstance();
  trail.name = "trailing-icon";
  trail.visible = false;
  input.appendChild(trail);
  trail.layoutSizingHorizontal = "FIXED";
  trail.layoutSizingVertical = "FIXED";
  bindIcon(trail, gv("color/text-field/icon/" + c.icon));

  var helper = figma.createText();
  helper.name = "helper";
  helper.fontName = { family: "Poppins", style: "Regular" };
  helper.characters = "We will use this to contact you about your account.";
  if (caption) helper.textStyleId = caption.id;
  helper.fills = [boundPaint(gv("color/text-field/helper/default"))];
  helper.visible = false;
  root.appendChild(helper);
  helper.layoutSizingHorizontal = "FILL";

  var error = figma.createText();
  error.name = "error";
  error.fontName = { family: "Poppins", style: "Regular" };
  error.characters = "Enter a valid email address.";
  if (caption) error.textStyleId = caption.id;
  error.fills = [boundPaint(gv("color/text-field/error/default"))];
  error.visible = false;
  root.appendChild(error);
  error.layoutSizingHorizontal = "FILL";

  if (c.opacity) root.opacity = c.opacity;

  if (state === "Default" && size === "Small") {
    propKeys.label = root.addComponentProperty("Label", "TEXT", "Email address");
    propKeys.placeholder = root.addComponentProperty("Placeholder", "TEXT", "Enter email address");
    propKeys.value = root.addComponentProperty("Value", "TEXT", "user@example.com");
    propKeys.helper = root.addComponentProperty("Helper", "TEXT", "We will use this to contact you about your account.");
    propKeys.errorText = root.addComponentProperty("Error", "TEXT", "Enter a valid email address.");
    propKeys.showLabel = root.addComponentProperty("Show label", "BOOLEAN", true);
    propKeys.showHelper = root.addComponentProperty("Show helper text", "BOOLEAN", false);
    propKeys.showError = root.addComponentProperty("Show error text", "BOOLEAN", false);
    propKeys.required = root.addComponentProperty("Required", "BOOLEAN", false);
    propKeys.showLead = root.addComponentProperty("Show leading icon", "BOOLEAN", false);
    propKeys.showTrail = root.addComponentProperty("Show trailing icon", "BOOLEAN", false);
    propKeys.leadSwap = root.addComponentProperty("Leading icon", "INSTANCE_SWAP", icon16.id);
    propKeys.trailSwap = root.addComponentProperty("Trailing icon", "INSTANCE_SWAP", icon16.id);
    label.componentPropertyReferences = { characters: propKeys.label, visible: propKeys.showLabel };
    req.componentPropertyReferences = { visible: propKeys.required };
    helper.componentPropertyReferences = { characters: propKeys.helper, visible: propKeys.showHelper };
    error.componentPropertyReferences = { characters: propKeys.errorText, visible: propKeys.showError };
    lead.componentPropertyReferences = { visible: propKeys.showLead, mainComponent: propKeys.leadSwap };
    trail.componentPropertyReferences = { visible: propKeys.showTrail, mainComponent: propKeys.trailSwap };
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
set.name = "Text Field";
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
set.x = 80;
set.y = 80;
set.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }];
set.cornerRadius = 16;
set.description = "Text Field — single-line input. States: Default/Hover/Focus/Filled/Error/Disabled. Sizes: Small/Medium. Label, helper, error, required, and icon toggles. Theme via color/text-field/* tokens. Focus: offset ring.";

return { setId: set.id, variantCount: set.children.length, propKeys: propKeys };
