// DEPRECATED (2026-06-19 removal; re-verified 2026-07-17) — DO NOT RUN.
// Date Picker / Date Range Picker / Calendar were removed from Fukurou Design System.
// use_figma — Date Range Picker component set
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
function calendarIcon(size, tokenName) {
  var wrap = figma.createFrame();
  wrap.name = "calendar-icon";
  wrap.resize(size, size);
  wrap.fills = [];
  var token = gv(tokenName);
  var w = size * 0.875, h = size * 0.8;
  var body = figma.createRectangle();
  body.resize(w, h);
  body.x = (size - w) / 2;
  body.y = size * 0.12;
  body.cornerRadius = 2;
  body.fills = [];
  body.strokes = [boundPaint(token)];
  body.strokeWeight = 1.5;
  wrap.appendChild(body);
  var bar = figma.createRectangle();
  bar.resize(w, size * 0.22);
  bar.x = (size - w) / 2;
  bar.y = size * 0.12;
  bar.topLeftRadius = 2;
  bar.topRightRadius = 2;
  bar.fills = [boundPaint(token)];
  wrap.appendChild(bar);
  return wrap;
}

var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
var old = formPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Date Range Picker"; });
if (old) old.remove();

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
var ranges = ["Empty", "Start selected", "Full range selected"];
var cfg = {
  Default: { bg: "default", border: "default", label: "default", icon: "default", ring: false },
  Hover: { bg: "default", border: "hover", label: "default", icon: "default", ring: false },
  Focus: { bg: "focus", border: "focus", label: "focus", icon: "focus", ring: true },
  Filled: { bg: "filled", border: "default", label: "default", icon: "default", ring: false },
  Error: { bg: "error", border: "error", label: "error", icon: "error", ring: false },
  Disabled: { bg: "disabled", border: "disabled", label: "disabled", icon: "disabled", ring: false, opacity: 0.6 }
};
var rangeCopy = {
  Empty: { mode: "placeholder", text: "Start date – End date" },
  "Start selected": { mode: "value", text: "Jun 1, 2026 – End date" },
  "Full range selected": { mode: "value", text: "Jun 1, 2026 – Jun 19, 2026" }
};

var propKeys = {};
function build(state, size, rangeDisplay) {
  var c = cfg[state];
  var rc = rangeCopy[rangeDisplay];
  var heightTok = gv(size === "Small" ? "density/text-field/small/height" : "density/text-field/medium/height");
  var padTok = gv(size === "Small" ? "density/text-field/small/padding-x" : "density/text-field/medium/padding-x");
  var iconSize = size === "Small" ? 16 : 20;
  var textStyle = size === "Small" ? bodySm : bodyMd;
  var showValue = rc.mode === "value" && (state === "Filled" || state === "Error" || rangeDisplay !== "Empty");
  if (state === "Default" || state === "Hover" || state === "Focus" || state === "Disabled") {
    showValue = rc.mode === "value" && rangeDisplay !== "Empty";
  }

  var root = figma.createComponent();
  root.name = "State=" + state + ", Size=" + size + ", Range display=" + rangeDisplay;
  root.layoutMode = "VERTICAL";
  root.primaryAxisSizingMode = "AUTO";
  root.counterAxisSizingMode = "FIXED";
  root.resize(360, 10);
  root.setBoundVariable("itemSpacing", spacing2);
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
  label.characters = "Date range";
  if (bodySm) label.textStyleId = bodySm.id;
  label.fills = [boundPaint(gv("color/date-picker/label/" + c.label))];
  labelRow.appendChild(label);
  label.textAutoResize = "WIDTH_AND_HEIGHT";

  var req = figma.createText();
  req.name = "required";
  req.characters = "*";
  req.fontName = { family: "Poppins", style: "SemiBold" };
  req.fills = [boundPaint(gv("color/date-picker/label/error"))];
  labelRow.appendChild(req);

  var inputWrap = root;
  if (c.ring) {
    var focusRing = figma.createFrame();
    focusRing.name = "focus-ring";
    focusRing.layoutMode = "HORIZONTAL";
    focusRing.primaryAxisSizingMode = "AUTO";
    focusRing.counterAxisSizingMode = "AUTO";
    focusRing.fills = [boundPaint(gv("color/date-picker/focus/gap"))];
    focusRing.strokes = [boundPaint(gv("color/date-picker/focus/ring"))];
    focusRing.setBoundVariable("strokeWeight", borderMd);
    focusRing.strokeAlign = "OUTSIDE";
    focusRing.setBoundVariable("paddingTop", spacing2);
    focusRing.setBoundVariable("paddingBottom", spacing2);
    focusRing.setBoundVariable("paddingLeft", spacing2);
    focusRing.setBoundVariable("paddingRight", spacing2);
    focusRing.clipsContent = false;
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
  input.setBoundVariable("height", heightTok);
  input.setBoundVariable("paddingLeft", padTok);
  input.setBoundVariable("paddingRight", padTok);
  input.setBoundVariable("itemSpacing", gapTok);
  input.fills = [boundPaint(gv("color/date-picker/background/" + c.bg))];
  input.strokes = [boundPaint(gv("color/date-picker/border/" + c.border))];
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
  placeholderText.characters = "Start date – End date";
  if (textStyle) placeholderText.textStyleId = textStyle.id;
  var phTok = state === "Disabled" ? "color/date-picker/text/disabled" : "color/date-picker/text/placeholder";
  placeholderText.fills = [boundPaint(gv(phTok))];
  placeholderText.visible = !showValue;
  input.appendChild(placeholderText);
  placeholderText.textAutoResize = "HEIGHT";
  placeholderText.layoutSizingHorizontal = "FILL";

  var valueText = figma.createText();
  valueText.name = "range-value-text";
  valueText.fontName = { family: "Poppins", style: "Regular" };
  valueText.characters = rc.text;
  if (textStyle) valueText.textStyleId = textStyle.id;
  var valueTok = state === "Disabled" ? "color/date-picker/text/disabled" : "color/date-picker/text/value";
  valueText.fills = [boundPaint(gv(valueTok))];
  valueText.visible = showValue;
  input.appendChild(valueText);
  valueText.textAutoResize = "HEIGHT";
  valueText.layoutSizingHorizontal = "FILL";

  var calIcon = calendarIcon(iconSize, "color/date-picker/icon/" + c.icon);
  input.appendChild(calIcon);
  calIcon.layoutSizingHorizontal = "FIXED";

  var helperWrap = figma.createFrame();
  helperWrap.name = "helper-text";
  helperWrap.layoutMode = "VERTICAL";
  helperWrap.primaryAxisSizingMode = "AUTO";
  helperWrap.fills = [];
  root.appendChild(helperWrap);
  helperWrap.layoutSizingHorizontal = "FILL";
  helperWrap.visible = false;
  var helper = figma.createText();
  helper.name = "helper";
  helper.characters = "Choose a start and end date.";
  helper.fontName = { family: "Poppins", style: "Regular" };
  if (caption) helper.textStyleId = caption.id;
  helper.fills = [boundPaint(gv("color/date-picker/helper/default"))];
  helperWrap.appendChild(helper);
  helper.textAutoResize = "HEIGHT";
  helper.layoutSizingHorizontal = "FILL";

  var errorWrap = figma.createFrame();
  errorWrap.name = "error-text";
  errorWrap.layoutMode = "VERTICAL";
  errorWrap.primaryAxisSizingMode = "AUTO";
  errorWrap.fills = [];
  root.appendChild(errorWrap);
  errorWrap.layoutSizingHorizontal = "FILL";
  errorWrap.visible = state === "Error";
  var error = figma.createText();
  error.name = "error";
  error.characters = "Select a valid date range.";
  error.fontName = { family: "Poppins", style: "Regular" };
  if (caption) error.textStyleId = caption.id;
  error.fills = [boundPaint(gv("color/date-picker/error/default"))];
  errorWrap.appendChild(error);
  error.textAutoResize = "HEIGHT";
  error.layoutSizingHorizontal = "FILL";

  if (c.opacity) root.opacity = c.opacity;

  if (state === "Default" && size === "Small" && rangeDisplay === "Empty") {
    propKeys.label = root.addComponentProperty("Label", "TEXT", "Date range");
    propKeys.placeholder = root.addComponentProperty("Placeholder", "TEXT", "Start date – End date");
    propKeys.rangeValue = root.addComponentProperty("Range value", "TEXT", "Jun 1, 2026 – Jun 19, 2026");
    propKeys.start = root.addComponentProperty("Start date", "TEXT", "Jun 1, 2026");
    propKeys.end = root.addComponentProperty("End date", "TEXT", "Jun 19, 2026");
    propKeys.helper = root.addComponentProperty("Helper", "TEXT", "Choose a start and end date.");
    propKeys.errorText = root.addComponentProperty("Error", "TEXT", "Select a valid date range.");
    propKeys.showLabel = root.addComponentProperty("Show label", "BOOLEAN", true);
    propKeys.required = root.addComponentProperty("Required", "BOOLEAN", false);
    propKeys.showHelper = root.addComponentProperty("Show helper text", "BOOLEAN", false);
    propKeys.showError = root.addComponentProperty("Show error text", "BOOLEAN", false);
    propKeys.showIcon = root.addComponentProperty("Show calendar icon", "BOOLEAN", true);
    label.componentPropertyReferences = { characters: propKeys.label };
    labelRow.componentPropertyReferences = { visible: propKeys.showLabel };
    req.componentPropertyReferences = { visible: propKeys.required };
    helper.componentPropertyReferences = { characters: propKeys.helper };
    helperWrap.componentPropertyReferences = { visible: propKeys.showHelper };
    error.componentPropertyReferences = { characters: propKeys.errorText };
    errorWrap.componentPropertyReferences = { visible: propKeys.showError };
    calIcon.componentPropertyReferences = { visible: propKeys.showIcon };
    placeholderText.componentPropertyReferences = { characters: propKeys.placeholder };
    valueText.componentPropertyReferences = { characters: propKeys.rangeValue };
  }

  return root;
}

var variants = [];
states.forEach(function (state) {
  sizes.forEach(function (size) {
    ranges.forEach(function (rangeDisplay) {
      variants.push(build(state, size, rangeDisplay));
    });
  });
});
var set = figma.combineAsVariants(variants, formPage);
set.name = "Date Range Picker";
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
set.x = 900;
set.y = 3200;
set.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }];
set.cornerRadius = 16;
set.description = "Date Range Picker — form control for selecting a start and end date. States × Sizes × Range display (Empty / Start selected / Full range selected). Reuses color/date-picker/* trigger tokens. Calendar range popover shown in separate examples. Accessibility: identify start/end in product code; announce active endpoint; range start/middle/end must not rely on color alone; keyboard navigation for both dates; explain invalid ranges in error text.";

return { setId: set.id, variantCount: set.children.length, propKeys: propKeys };
