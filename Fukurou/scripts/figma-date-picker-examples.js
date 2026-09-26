// DEPRECATED (2026-06-19 removal; re-verified 2026-07-17) — DO NOT RUN.
// Date Picker / Date Range Picker documentation was removed from Fukurou Design System.
// use_figma — Date Picker / Date Range Picker documentation examples
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function resolveColor(variable) {
  var v = variable, g = 0;
  while (v && g++ < 12) {
    var mid = Object.keys(v.valuesByMode)[0];
    var val = v.valuesByMode[mid];
    if (val && val.type === "VARIABLE_ALIAS") v = figma.variables.getVariableById(val.id);
    else return val;
  }
  return { r: 0.5, g: 0.5, b: 0.5, a: 1 };
}
function boundPaint(variable) {
  var c = resolveColor(variable);
  return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: c.r, g: c.g, b: c.b }, opacity: c.a === undefined ? 1 : c.a }, "color", variable);
}

var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var heading = figma.getLocalTextStyles().find(function (s) { return s.name === "heading/sm"; });
var bodyMd = figma.getLocalTextStyles().find(function (s) { return s.name === "body/md"; });

var datePickerSet = formPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Date Picker"; });
var rangeSet = formPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Date Range Picker"; });
var calContSet = formPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === ".Base / Calendar / Container"; });
var daySet = formPage.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === ".Base / Calendar / Day Cell"; });
if (!datePickerSet || !rangeSet || !calContSet) {
  return { error: "Missing component sets", datePickerSet: !!datePickerSet, rangeSet: !!rangeSet, calContSet: !!calContSet };
}

var oldSec = formPage.findOne(function (n) { return n.name === "Component/Date Picker"; });
if (oldSec) oldSec.remove();

var section = figma.createSection();
section.name = "Component/Date Picker";
section.x = 40;
section.y = 3000;
section.resizeWithoutConstraints(3600, 4200);
formPage.appendChild(section);

function title(text, y) {
  var t = figma.createText();
  t.fontName = { family: "Poppins", style: "SemiBold" };
  t.characters = text;
  if (heading) t.textStyleId = heading.id;
  t.fills = [boundPaint(gv("color/text/default"))];
  section.appendChild(t);
  t.x = 40;
  t.y = y;
  return t;
}

function grid(label, y, items, width) {
  title(label, y);
  var frame = figma.createFrame();
  frame.name = label;
  frame.layoutMode = "VERTICAL";
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.resize(width || 720, 10);
  frame.itemSpacing = 16;
  frame.fills = [boundPaint(gv("color/surface/page"))];
  frame.strokes = [boundPaint(gv("color/border/default"))];
  frame.strokeWeight = 1;
  frame.cornerRadius = 12;
  frame.paddingTop = 24;
  frame.paddingBottom = 24;
  frame.paddingLeft = 24;
  frame.paddingRight = 24;
  section.appendChild(frame);
  frame.x = 40;
  frame.y = y + 40;

  items.forEach(function (item) {
    var row = figma.createFrame();
    row.name = item.label;
    row.layoutMode = "HORIZONTAL";
    row.primaryAxisSizingMode = "AUTO";
    row.counterAxisSizingMode = "AUTO";
    row.itemSpacing = 24;
    row.fills = [];
    frame.appendChild(row);
    row.layoutSizingHorizontal = "FILL";

    var cap = figma.createText();
    cap.fontName = { family: "Poppins", style: "Regular" };
    cap.characters = item.label;
    if (bodyMd) cap.textStyleId = bodyMd.id;
    cap.fills = [boundPaint(gv("color/text/subtle"))];
    cap.resize(160, 24);
    row.appendChild(cap);
    cap.layoutSizingHorizontal = "FIXED";

    var inst = item.node.createInstance();
    inst.name = item.label + " instance";
    row.appendChild(inst);
    inst.layoutSizingHorizontal = "HUG";
    if (item.props) {
      try { inst.setProperties(item.props); } catch (e) {}
    }
  });
  return frame;
}

function findVariant(set, match) {
  return set.children.find(function (c) {
    return Object.keys(match).every(function (k) { return c.name.indexOf(k + "=" + match[k]) >= 0; });
  });
}

var dp = {
  default: findVariant(datePickerSet, { State: "Default", Size: "Medium" }),
  hover: findVariant(datePickerSet, { State: "Hover", Size: "Medium" }),
  focus: findVariant(datePickerSet, { State: "Focus", Size: "Medium" }),
  filled: findVariant(datePickerSet, { State: "Filled", Size: "Medium" }),
  error: findVariant(datePickerSet, { State: "Error", Size: "Medium" }),
  disabled: findVariant(datePickerSet, { State: "Disabled", Size: "Medium" }),
  small: findVariant(datePickerSet, { State: "Default", Size: "Small" }),
  medium: findVariant(datePickerSet, { State: "Default", Size: "Medium" })
};

var dr = {
  empty: findVariant(rangeSet, { State: "Default", Size: "Medium", "Range display": "Empty" }),
  start: findVariant(rangeSet, { State: "Filled", Size: "Medium", "Range display": "Start selected" }),
  full: findVariant(rangeSet, { State: "Filled", Size: "Medium", "Range display": "Full range selected" }),
  error: findVariant(rangeSet, { State: "Error", Size: "Medium", "Range display": "Full range selected" }),
  disabled: findVariant(rangeSet, { State: "Disabled", Size: "Medium", "Range display": "Empty" }),
  small: findVariant(rangeSet, { State: "Default", Size: "Small", "Range display": "Empty" }),
  medium: findVariant(rangeSet, { State: "Default", Size: "Medium", "Range display": "Empty" })
};

datePickerSet.x = 80;
datePickerSet.y = 120;
datePickerSet.parent = section;

rangeSet.x = 1200;
rangeSet.y = 120;
rangeSet.parent = section;

title("Date Picker", 40);
title("Date Range Picker", 1160);

grid("Date Picker / Light", 220, [
  { label: "Default", node: dp.default },
  { label: "Hover", node: dp.hover },
  { label: "Focus", node: dp.focus },
  { label: "Filled", node: dp.filled },
  { label: "Error", node: dp.error },
  { label: "Disabled", node: dp.disabled },
  { label: "With label", node: dp.default, props: { "Show label": true } },
  { label: "Without label", node: dp.default, props: { "Show label": false } },
  { label: "With helper text", node: dp.default, props: { "Show helper text": true } },
  { label: "Small", node: dp.small },
  { label: "Medium", node: dp.medium }
], 720);

grid("Date Picker / Dark", 220, [
  { label: "Default", node: dp.default },
  { label: "Filled", node: dp.filled },
  { label: "Error", node: dp.error }
], 720).x = 800;

grid("Date Range Picker / Light", 900, [
  { label: "Default empty", node: dr.empty },
  { label: "Start selected", node: dr.start },
  { label: "Full range", node: dr.full },
  { label: "Error", node: dr.error },
  { label: "Disabled", node: dr.disabled },
  { label: "With label", node: dr.empty, props: { "Show label": true } },
  { label: "Without label", node: dr.empty, props: { "Show label": false } },
  { label: "With helper", node: dr.empty, props: { "Show helper text": true } },
  { label: "Small", node: dr.small },
  { label: "Medium", node: dr.medium }
], 720);

grid("Date Range Picker / Dark", 900, [
  { label: "Empty", node: dr.empty },
  { label: "Full range", node: dr.full },
  { label: "Error", node: dr.error }
], 720).x = 800;

var calFooter = calContSet.children.find(function (c) { return c.name.indexOf("Footer=Yes") >= 0; }) || calContSet.children[0];
var calOpen = figma.createFrame();
calOpen.name = "Calendar open examples";
calOpen.layoutMode = "HORIZONTAL";
calOpen.itemSpacing = 32;
calOpen.primaryAxisSizingMode = "AUTO";
calOpen.counterAxisSizingMode = "AUTO";
calOpen.fills = [];
section.appendChild(calOpen);
calOpen.x = 40;
calOpen.y = 1700;

var calSingle = calFooter.createInstance();
calSingle.name = "Date Picker calendar open";
section.appendChild(calSingle);
calSingle.x = 40;
calSingle.y = 1700;

var calRange = calFooter.createInstance();
calRange.name = "Date Range calendar open";
section.appendChild(calRange);
calRange.x = 360;
calRange.y = 1700;

title("Calendar popover examples", 1640);

if (daySet) {
  var dayDemo = figma.createFrame();
  dayDemo.name = "Day cell states";
  dayDemo.layoutMode = "HORIZONTAL";
  dayDemo.layoutWrap = "WRAP";
  dayDemo.itemSpacing = 8;
  dayDemo.counterAxisSpacing = 8;
  dayDemo.primaryAxisSizingMode = "AUTO";
  dayDemo.counterAxisSizingMode = "AUTO";
  dayDemo.fills = [];
  section.appendChild(dayDemo);
  dayDemo.x = 40;
  dayDemo.y = 2100;
  ["Default", "Hover", "Focus", "Selected", "Today", "Disabled", "Outside", "Range start", "Range middle", "Range end"].forEach(function (st) {
    var comp = daySet.children.find(function (c) { return c.name.indexOf("State=" + st) >= 0; });
    if (comp) {
      var inst = comp.createInstance();
      inst.name = st;
      dayDemo.appendChild(inst);
    }
  });
  title("Calendar day cell states", 2040);
}

return {
  sectionId: section.id,
  datePickerSetId: datePickerSet.id,
  rangeSetId: rangeSet.id,
  createdNodeIds: [section.id, calSingle.id, calRange.id]
};
