// use_figma — Pagination examples (Form page)
var page = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(page);
var section = page.findOne(function (n) { return n.type === "SECTION" && n.name === "Component/Pagination"; });
if (!section) return { error: "missing Component/Pagination section" };
var itemSet = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Pagination / Item"; });
var prevSet = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Pagination / Previous"; });
var nextSet = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Pagination / Next"; });
var ellSet = section.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Pagination / Ellipsis"; });
var barComp = section.findOne(function (n) { return n.type === "COMPONENT" && n.name === "Pagination"; });
var old = section.findOne(function (n) { return n.name === "Pagination Component"; });
if (old) old.remove();
if (!itemSet || !prevSet || !nextSet || !ellSet || !barComp) return { error: "missing pagination components" };

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var themeCol = figma.variables.getLocalVariableCollections().find(function (c) { return c.name === "2. Theme"; });
var lightId = themeCol.modes.find(function (m) { return m.name === "Light"; }).modeId;
var darkId = themeCol.modes.find(function (m) { return m.name === "Dark"; }).modeId;
var pageBg = figma.variables.getLocalVariables().find(function (v) { return v.name === "color/surface/page"; });
var gapTok = figma.variables.getLocalVariables().find(function (v) { return v.name === "density/pagination/gap"; });

function boundPaint(v) {
  function rc(x) {
    var g = 0;
    while (x && g++ < 12) {
      var mid = Object.keys(x.valuesByMode)[0];
      var val = x.valuesByMode[mid];
      if (val && val.type === "VARIABLE_ALIAS") x = figma.variables.getVariableById(val.id);
      else return val;
    }
    return { r: 0.96, g: 0.96, b: 0.95 };
  }
  var c = rc(v);
  return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: c.r, g: c.g, b: c.b }, opacity: 1 }, "color", v);
}

function makeSection(name, modeId) {
  var s = figma.createFrame();
  s.name = name;
  s.layoutMode = "VERTICAL";
  s.primaryAxisSizingMode = "AUTO";
  s.counterAxisSizingMode = "AUTO";
  s.itemSpacing = 20;
  s.paddingTop = 28; s.paddingBottom = 28; s.paddingLeft = 28; s.paddingRight = 28;
  s.fills = [boundPaint(pageBg)];
  s.cornerRadius = 12;
  s.setExplicitVariableModeForCollection(themeCol, modeId);
  s.clipsContent = false;
  return s;
}

function inst(set, name) {
  var c = set.children.find(function (ch) { return ch.name === name; });
  return c ? c.createInstance() : null;
}

function rowWith(parent, title, buildFn) {
  var row = figma.createFrame();
  row.name = title;
  row.layoutMode = "VERTICAL";
  row.itemSpacing = 8;
  row.fills = [];
  row.clipsContent = false;
  parent.appendChild(row);
  var cap = figma.createText();
  cap.fontName = { family: "Poppins", style: "SemiBold" };
  cap.characters = title;
  cap.fontSize = 11;
  row.appendChild(cap);
  var content = buildFn();
  if (content) row.appendChild(content);
}

function miniBar(items) {
  var f = figma.createFrame();
  f.name = "pagination-row";
  f.layoutMode = "HORIZONTAL";
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.primaryAxisAlignItems = "CENTER";
  f.counterAxisAlignItems = "CENTER";
  f.setBoundVariable("itemSpacing", gapTok);
  f.fills = [];
  f.clipsContent = false;
  items.forEach(function (node) { if (node) f.appendChild(node); });
  return f;
}

function setPage(instNode, num) {
  if (!instNode) return;
  try { instNode.setProperties({ "Page number": String(num) }); } catch (e) {}
}

var frame = figma.createFrame();
frame.name = "Pagination Component";
frame.layoutMode = "VERTICAL";
frame.primaryAxisSizingMode = "AUTO";
frame.counterAxisSizingMode = "AUTO";
frame.itemSpacing = 28;
frame.paddingTop = 40; frame.paddingBottom = 40; frame.paddingLeft = 40; frame.paddingRight = 40;
frame.fills = [{ type: "SOLID", color: { r: 0.98, g: 0.98, b: 0.97 } }];
frame.clipsContent = false;
section.appendChild(frame);
frame.x = 80;
frame.y = 1320;

var tTitle = figma.createText();
tTitle.fontName = { family: "Poppins", style: "SemiBold" };
tTitle.characters = "Pagination Component";
tTitle.fontSize = 20;
frame.appendChild(tTitle);

var intro = figma.createText();
intro.fontName = { family: "Poppins", style: "Regular" };
intro.characters = "Navigate paginated tables, search results, lists, and admin dashboards. Dedicated Pagination / Item subcomponents (not Icon Button). Active page uses primary fill + semibold weight — not color alone. Previous/Next reuse Fukurou text-button interaction patterns.";
intro.fontSize = 14;
frame.appendChild(intro);
intro.layoutSizingHorizontal = "FILL";

var a11y = figma.createText();
a11y.fontName = { family: "Poppins", style: "Regular" };
a11y.characters = "Accessibility: use navigation semantics in code; announce current page; label Previous/Next (e.g. Go to previous page); disabled controls are non-interactive; ellipsis is not focusable unless it opens a page jump; focus ring must not clip; page numbers need labels like Go to page 2.";
a11y.fontSize = 12;
frame.appendChild(a11y);
a11y.layoutSizingHorizontal = "FILL";

[["Light", lightId], ["Dark", darkId]].forEach(function (m) {
  var sec = makeSection(m[0], m[1]);
  frame.appendChild(sec);

  rowWith(sec, "Default pagination", function () {
    return barComp.createInstance();
  });

  rowWith(sec, "Active page", function () {
    var i1 = inst(itemSet, "State=Default, Size=Medium"); setPage(i1, 1);
    var i2 = inst(itemSet, "State=Active, Size=Medium"); setPage(i2, 2);
    var i3 = inst(itemSet, "State=Default, Size=Medium"); setPage(i3, 3);
    var i8 = inst(itemSet, "State=Default, Size=Medium"); setPage(i8, 8);
    return miniBar([
      inst(prevSet, "State=Default, Size=Medium"),
      i1, i2, i3,
      inst(ellSet, "Size=Medium"),
      i8,
      inst(nextSet, "State=Default, Size=Medium")
    ]);
  });

  rowWith(sec, "Hover page item", function () {
    var h = inst(itemSet, "State=Hover, Size=Medium"); setPage(h, 2);
    return miniBar([
      inst(prevSet, "State=Default, Size=Medium"),
      inst(itemSet, "State=Default, Size=Medium"),
      h,
      inst(nextSet, "State=Default, Size=Medium")
    ]);
  });

  rowWith(sec, "Focus page item", function () {
    var f = inst(itemSet, "State=Focus, Size=Medium"); setPage(f, 3);
    return miniBar([
      inst(prevSet, "State=Default, Size=Medium"),
      inst(itemSet, "State=Default, Size=Medium"),
      f,
      inst(nextSet, "State=Default, Size=Medium")
    ]);
  });

  rowWith(sec, "Disabled previous", function () {
    return miniBar([
      inst(prevSet, "State=Disabled, Size=Medium"),
      inst(itemSet, "State=Default, Size=Medium"),
      inst(itemSet, "State=Active, Size=Medium"),
      inst(nextSet, "State=Default, Size=Medium")
    ]);
  });

  rowWith(sec, "Disabled next", function () {
    return miniBar([
      inst(prevSet, "State=Default, Size=Medium"),
      inst(itemSet, "State=Active, Size=Medium"),
      inst(nextSet, "State=Disabled, Size=Medium")
    ]);
  });

  rowWith(sec, "Ellipsis", function () {
    return inst(ellSet, "Size=Medium");
  });

  rowWith(sec, "Small", function () {
    var s1 = inst(itemSet, "State=Default, Size=Small"); setPage(s1, 1);
    var s2 = inst(itemSet, "State=Active, Size=Small"); setPage(s2, 2);
    return miniBar([
      inst(prevSet, "State=Default, Size=Small"),
      s1, s2,
      inst(nextSet, "State=Default, Size=Small")
    ]);
  });

  rowWith(sec, "Medium", function () {
    return barComp.createInstance();
  });
});

return { frameId: frame.id, sectionId: section.id };
