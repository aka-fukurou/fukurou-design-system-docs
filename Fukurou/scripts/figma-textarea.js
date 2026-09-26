// use_figma — Textarea component set (Form page)
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

var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
var existing = formPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Textarea"; });
if (existing) existing.remove();

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var bodyMd = figma.getLocalTextStyles().find(function (s) { return s.name === "body/md"; });
var caption = figma.getLocalTextStyles().find(function (s) { return s.name === "caption/md"; });

var radius8 = gv("radius/8");
var borderSm = gv("border/width/sm");
var borderMd = gv("border/width/md");
var spacing2 = gv("spacing/2");
var gapTok = gv("density/textarea/gap");
var padY = gv("density/textarea/padding-y");

var states = ["Default", "Hover", "Focus", "Filled", "Error", "Disabled"];
var sizes = ["Medium", "Large"];
var cfg = {
  Default: { bg: "default", border: "default", label: "default", input: "placeholder", chars: "placeholder" },
  Hover: { bg: "hover", border: "hover", label: "default", input: "placeholder", chars: "placeholder" },
  Focus: { bg: "focus", border: "focus", label: "focus", input: "placeholder", chars: "placeholder", ring: true },
  Filled: { bg: "filled", border: "default", label: "default", input: "value", chars: "value" },
  Error: { bg: "error", border: "error", label: "error", input: "value", chars: "value" },
  Disabled: { bg: "disabled", border: "disabled", label: "disabled", input: "disabled", chars: "placeholder", opacity: 0.6 }
};

var propKeys = {};
function build(state, size) {
  var c = cfg[state];
  var minHTok = gv(size === "Medium" ? "density/textarea/medium/min-height" : "density/textarea/large/min-height");
  var padTok = gv(size === "Medium" ? "density/textarea/medium/padding-x" : "density/textarea/large/padding-x");

  var root = figma.createComponent();
  root.name = "State=" + state + ", Size=" + size;
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "FIXED";
  root.resize(320, 10);
  root.itemSpacing = 6;
  root.fills = [];
  root.clipsContent = false;

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
  label.characters = "Additional notes";
  if (bodyMd) label.textStyleId = bodyMd.id;
  label.fills = [boundPaint(gv("color/textarea/label/" + c.label))];
  labelRow.appendChild(label);
  label.layoutSizingHorizontal = "HUG";

  var req = figma.createText();
  req.name = "required";
  req.fontName = { family: "Poppins", style: "SemiBold" };
  req.characters = "*";
  req.fills = [boundPaint(gv("color/textarea/label/error"))];
  labelRow.appendChild(req);
  req.layoutSizingHorizontal = "HUG";

  var inputWrap = root;
  if (c.ring) {
    var focusRing = figma.createFrame();
    focusRing.name = "focus-ring";
    focusRing.layoutMode = "VERTICAL";
    focusRing.primaryAxisSizingMode = "AUTO";
    focusRing.counterAxisSizingMode = "AUTO";
    focusRing.fills = [boundPaint(gv("color/textarea/focus/gap"))];
    focusRing.strokes = [boundPaint(gv("color/textarea/focus/ring"))];
    focusRing.setBoundVariable("strokeWeight", borderMd);
    focusRing.strokeAlign = "OUTSIDE";
    focusRing.setBoundVariable("paddingTop", spacing2);
    focusRing.setBoundVariable("paddingBottom", spacing2);
    focusRing.setBoundVariable("paddingLeft", spacing2);
    focusRing.setBoundVariable("paddingRight", spacing2);
    ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) {
      focusRing.setBoundVariable(k, radius8);
    });
    focusRing.clipsContent = false;
    root.appendChild(focusRing);
    focusRing.layoutSizingHorizontal = "FILL";
    inputWrap = focusRing;
  }

  var input = figma.createFrame();
  input.name = "textarea-container";
  input.layoutMode = "VERTICAL";
  input.primaryAxisSizingMode = "AUTO";
  input.counterAxisSizingMode = "FIXED";
  input.counterAxisAlignItems = "MIN";
  input.primaryAxisAlignItems = "MIN";
  input.setBoundVariable("minHeight", minHTok);
  input.setBoundVariable("paddingLeft", padTok);
  input.setBoundVariable("paddingRight", padTok);
  input.setBoundVariable("paddingTop", padY);
  input.setBoundVariable("paddingBottom", padY);
  input.setBoundVariable("itemSpacing", gapTok);
  input.fills = [boundPaint(gv("color/textarea/background/" + c.bg))];
  input.strokes = [boundPaint(gv("color/textarea/border/" + c.border))];
  input.setBoundVariable("strokeWeight", borderSm);
  input.strokeAlign = "INSIDE";
  ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) {
    input.setBoundVariable(k, radius8);
  });
  inputWrap.appendChild(input);
  input.layoutSizingHorizontal = "FILL";

  var placeholderText = figma.createText();
  placeholderText.name = "placeholder-text";
  placeholderText.fontName = { family: "Poppins", style: "Regular" };
  placeholderText.characters = "Enter your message";
  if (bodyMd) placeholderText.textStyleId = bodyMd.id;
  var phTok = c.input === "disabled" ? "color/textarea/text/disabled" : "color/textarea/text/placeholder";
  placeholderText.fills = [boundPaint(gv(phTok))];
  placeholderText.visible = c.chars === "placeholder";
  placeholderText.textAlignVertical = "TOP";
  input.appendChild(placeholderText);
  placeholderText.layoutSizingHorizontal = "FILL";

  var valueText = figma.createText();
  valueText.name = "value-text";
  valueText.fontName = { family: "Poppins", style: "Regular" };
  valueText.characters = "I'd like to add more details here.";
  if (bodyMd) valueText.textStyleId = bodyMd.id;
  var valueTok = c.input === "disabled" ? "color/textarea/text/disabled" : "color/textarea/text/value";
  valueText.fills = [boundPaint(gv(valueTok))];
  valueText.visible = c.chars === "value";
  valueText.textAlignVertical = "TOP";
  input.appendChild(valueText);
  valueText.layoutSizingHorizontal = "FILL";

  var helper = figma.createText();
  helper.name = "helper";
  helper.fontName = { family: "Poppins", style: "Regular" };
  helper.characters = "Keep your response clear and specific.";
  if (caption) helper.textStyleId = caption.id;
  helper.fills = [boundPaint(gv(state === "Disabled" ? "color/textarea/helper/disabled" : "color/textarea/helper/default"))];
  helper.visible = false;
  root.appendChild(helper);
  helper.layoutSizingHorizontal = "FILL";

  var error = figma.createText();
  error.name = "error";
  error.fontName = { family: "Poppins", style: "Regular" };
  error.characters = "Please enter a valid response.";
  if (caption) error.textStyleId = caption.id;
  error.fills = [boundPaint(gv("color/textarea/error/default"))];
  error.visible = false;
  root.appendChild(error);
  error.layoutSizingHorizontal = "FILL";

  var charCount = figma.createText();
  charCount.name = "character-count";
  charCount.fontName = { family: "Poppins", style: "Regular" };
  charCount.characters = "0 / 500";
  if (caption) charCount.textStyleId = caption.id;
  charCount.fills = [boundPaint(gv(state === "Disabled" ? "color/textarea/character-count/disabled" : "color/textarea/character-count/default"))];
  charCount.visible = false;
  charCount.textAlignHorizontal = "RIGHT";
  root.appendChild(charCount);
  charCount.layoutSizingHorizontal = "FILL";

  if (c.opacity) root.opacity = c.opacity;

  if (state === "Default" && size === "Medium") {
    propKeys.label = root.addComponentProperty("Label", "TEXT", "Additional notes");
    propKeys.placeholder = root.addComponentProperty("Placeholder", "TEXT", "Enter your message");
    propKeys.value = root.addComponentProperty("Value", "TEXT", "I'd like to add more details here.");
    propKeys.helper = root.addComponentProperty("Helper", "TEXT", "Keep your response clear and specific.");
    propKeys.errorText = root.addComponentProperty("Error", "TEXT", "Please enter a valid response.");
    propKeys.charCount = root.addComponentProperty("Character count", "TEXT", "0 / 500");
    propKeys.showLabel = root.addComponentProperty("Show label", "BOOLEAN", true);
    propKeys.showHelper = root.addComponentProperty("Show helper text", "BOOLEAN", false);
    propKeys.showError = root.addComponentProperty("Show error text", "BOOLEAN", false);
    propKeys.showCharCount = root.addComponentProperty("Show character count", "BOOLEAN", false);
    propKeys.required = root.addComponentProperty("Required", "BOOLEAN", false);
    label.componentPropertyReferences = { characters: propKeys.label, visible: propKeys.showLabel };
    req.componentPropertyReferences = { visible: propKeys.required };
    helper.componentPropertyReferences = { characters: propKeys.helper, visible: propKeys.showHelper };
    error.componentPropertyReferences = { characters: propKeys.errorText, visible: propKeys.showError };
    charCount.componentPropertyReferences = { characters: propKeys.charCount, visible: propKeys.showCharCount };
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
set.name = "Textarea";
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
set.y = 900;
set.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }];
set.cornerRadius = 16;
set.clipsContent = false;
set.description = "Textarea — multi-line input for notes, comments, and longer responses. States: Default/Hover/Focus/Filled/Error/Disabled. Sizes: Medium/Large. Label, helper, error, required, and character count toggles. Theme via color/textarea/* tokens. Focus: offset ring. Hidden support text collapses.";

return { setId: set.id, variantCount: set.children.length, propKeys: propKeys };
