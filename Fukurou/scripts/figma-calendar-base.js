// DEPRECATED (2026-06-19 removal; re-verified 2026-07-17) — DO NOT RUN.
// Calendar internals were Date Picker-only and removed from Fukurou Design System.
// use_figma — Internal .Base calendar building blocks
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
function chevron(size, dir, token) {
  var g = figma.createVector();
  g.name = dir;
  var cx = size / 2, cy = size / 2, d = size * 0.25;
  var path = dir === "prev"
    ? "M " + (cx + d) + " " + (cy - d) + " L " + (cx - d) + " " + cy + " L " + (cx + d) + " " + (cy + d)
    : "M " + (cx - d) + " " + (cy - d) + " L " + (cx + d) + " " + cy + " L " + (cx - d) + " " + (cy + d);
  g.vectorPaths = [{ windingRule: "NONZERO", data: path }];
  g.strokes = [boundPaint(token)];
  g.strokeWeight = 1.5;
  g.strokeCap = "ROUND";
  g.strokeJoin = "ROUND";
  g.fills = [];
  g.resize(size, size);
  return g;
}

var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
[".Base / Calendar / Day Cell", ".Base / Calendar / Week Row", ".Base / Calendar / Grid", ".Base / Calendar / Header", ".Base / Calendar / Container"].forEach(function (n) {
  formPage.findAll(function (x) {
    return (x.type === "COMPONENT_SET" || x.type === "COMPONENT") && x.name === n;
  }).forEach(function (x) { x.remove(); });
});

await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var bodySm = figma.getLocalTextStyles().find(function (s) { return s.name === "body/sm"; });
var caption = figma.getLocalTextStyles().find(function (s) { return s.name === "caption/md"; });
var radius8 = gv("radius/8");
var radiusFull = gv("radius/full");
var borderSm = gv("border/width/sm");
var borderMd = gv("border/width/md");
var daySize = gv("density/calendar/day-size");
var calGap = gv("density/calendar/gap");
var calPad = gv("density/calendar/padding");
var spacing1 = gv("spacing/1");

var dayStates = [
  { name: "Default", day: "15", bg: "default", text: "default", today: false, ring: false, rL: 8, rR: 8 },
  { name: "Hover", day: "15", bg: "hover", text: "default", today: false, ring: false, rL: 8, rR: 8 },
  { name: "Focus", day: "15", bg: "default", text: "default", today: false, ring: true, rL: 8, rR: 8 },
  { name: "Selected", day: "19", bg: "selected", text: "selected", today: false, ring: false, rL: 8, rR: 8 },
  { name: "Today", day: "19", bg: "today", text: "default", today: true, ring: false, rL: 8, rR: 8 },
  { name: "Disabled", day: "20", bg: "default", text: "disabled", today: false, ring: false, rL: 8, rR: 8, opacity: 0.6 },
  { name: "Outside", day: "31", bg: "default", text: "outside", today: false, ring: false, rL: 8, rR: 8 },
  { name: "Range start", day: "1", bg: "range-start", text: "selected", today: false, ring: false, rL: 8, rR: 0 },
  { name: "Range middle", day: "10", bg: "range-middle", text: "default", today: false, ring: false, rL: 0, rR: 0 },
  { name: "Range end", day: "19", bg: "range-end", text: "selected", today: false, ring: false, rL: 0, rR: 8 }
];

function buildDayCell(st) {
  var root = figma.createComponent();
  root.name = "State=" + st.name;
  root.layoutMode = "HORIZONTAL";
  root.primaryAxisAlignItems = "CENTER";
  root.counterAxisAlignItems = "CENTER";
  root.primaryAxisSizingMode = "FIXED";
  root.counterAxisSizingMode = "FIXED";
  root.setBoundVariable("width", daySize);
  root.setBoundVariable("height", daySize);
  root.fills = [];
  root.clipsContent = false;

  var bodyWrap = root;
  if (st.ring) {
    var ring = figma.createFrame();
    ring.name = "focus-ring";
    ring.layoutMode = "HORIZONTAL";
    ring.primaryAxisAlignItems = "CENTER";
    ring.counterAxisAlignItems = "CENTER";
    ring.primaryAxisSizingMode = "AUTO";
    ring.counterAxisSizingMode = "AUTO";
    ring.fills = [boundPaint(gv("color/calendar/day/focus/gap"))];
    ring.strokes = [boundPaint(gv("color/calendar/day/focus/ring"))];
    ring.setBoundVariable("strokeWeight", borderMd);
    ring.strokeAlign = "OUTSIDE";
    ring.setBoundVariable("paddingTop", spacing1);
    ring.setBoundVariable("paddingBottom", spacing1);
    ring.setBoundVariable("paddingLeft", spacing1);
    ring.setBoundVariable("paddingRight", spacing1);
    ring.clipsContent = false;
    root.appendChild(ring);
    ring.layoutSizingHorizontal = "HUG";
    ring.layoutSizingVertical = "HUG";
    bodyWrap = ring;
  }

  var cell = figma.createFrame();
  cell.name = "cell-body";
  cell.layoutMode = "HORIZONTAL";
  cell.primaryAxisAlignItems = "CENTER";
  cell.counterAxisAlignItems = "CENTER";
  cell.primaryAxisSizingMode = "FIXED";
  cell.counterAxisSizingMode = "FIXED";
  cell.setBoundVariable("width", daySize);
  cell.setBoundVariable("height", daySize);
  cell.fills = [boundPaint(gv("color/calendar/day/background/" + st.bg))];
  if (st.today) {
    cell.strokes = [boundPaint(gv("color/calendar/day/border/today"))];
    cell.setBoundVariable("strokeWeight", borderSm);
    cell.strokeAlign = "INSIDE";
  }
  cell.topLeftRadius = st.rL;
  cell.topRightRadius = st.rR;
  cell.bottomLeftRadius = st.rL;
  cell.bottomRightRadius = st.rR;
  bodyWrap.appendChild(cell);
  cell.layoutSizingHorizontal = "FIXED";
  cell.layoutSizingVertical = "FIXED";

  var num = figma.createText();
  num.name = "day-number";
  num.fontName = { family: "Poppins", style: "Regular" };
  num.characters = st.day;
  if (bodySm) num.textStyleId = bodySm.id;
  num.fills = [boundPaint(gv("color/calendar/day/text/" + st.text))];
  cell.appendChild(num);
  num.textAutoResize = "WIDTH_AND_HEIGHT";
  num.layoutSizingHorizontal = "HUG";
  num.layoutSizingVertical = "HUG";

  if (st.opacity) root.opacity = st.opacity;
  if (st.name === "Default") {
    var dayProp = root.addComponentProperty("Day", "TEXT", st.day);
    num.componentPropertyReferences = { characters: dayProp };
  }
  return root;
}

var dayVariants = dayStates.map(buildDayCell);
var daySet = figma.combineAsVariants(dayVariants, formPage);
daySet.name = ".Base / Calendar / Day Cell";
daySet.x = 4200;
daySet.y = 200;
daySet.description = "Internal calendar day cell. States include selected, today, range start/middle/end, outside month, disabled. Not for direct use — compose via Calendar Grid.";

var dayDefault = daySet.children.find(function (c) { return c.name.indexOf("Default") >= 0; });

function buildWeekRow() {
  var row = figma.createComponent();
  row.name = "Week Row";
  row.layoutMode = "HORIZONTAL";
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.setBoundVariable("itemSpacing", calGap);
  row.fills = [];
  for (var i = 0; i < 7; i++) {
    var inst = dayDefault.createInstance();
    inst.name = "day-" + (i + 1);
    row.appendChild(inst);
    inst.layoutSizingHorizontal = "FIXED";
    inst.layoutSizingVertical = "FIXED";
  }
  return row;
}
var weekRow = buildWeekRow();
formPage.appendChild(weekRow);
weekRow.x = 4200;
weekRow.y = 900;
weekRow.name = ".Base / Calendar / Week Row";
weekRow.description = "Internal calendar week row — 7 day cell instances.";

var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function buildGrid() {
  var grid = figma.createComponent();
  grid.name = "Grid";
  grid.layoutMode = "VERTICAL";
  grid.primaryAxisSizingMode = "AUTO";
  grid.counterAxisSizingMode = "AUTO";
  grid.setBoundVariable("itemSpacing", calGap);
  grid.fills = [];

  var weekHeader = figma.createFrame();
  weekHeader.name = "weekday-row";
  weekHeader.layoutMode = "HORIZONTAL";
  weekHeader.primaryAxisSizingMode = "AUTO";
  weekHeader.counterAxisSizingMode = "AUTO";
  weekHeader.setBoundVariable("itemSpacing", calGap);
  weekHeader.fills = [];
  grid.appendChild(weekHeader);
  weekHeader.layoutSizingHorizontal = "FILL";

  weekdays.forEach(function (wd) {
    var cell = figma.createFrame();
    cell.name = wd.toLowerCase();
    cell.layoutMode = "HORIZONTAL";
    cell.primaryAxisAlignItems = "CENTER";
    cell.counterAxisAlignItems = "CENTER";
    cell.primaryAxisSizingMode = "FIXED";
    cell.counterAxisSizingMode = "FIXED";
    cell.setBoundVariable("width", daySize);
    cell.setBoundVariable("height", daySize);
    cell.fills = [];
    weekHeader.appendChild(cell);
    cell.layoutSizingHorizontal = "FIXED";
    var t = figma.createText();
    t.fontName = { family: "Poppins", style: "Regular" };
    t.characters = wd;
    if (caption) t.textStyleId = caption.id;
    t.fills = [boundPaint(gv("color/calendar/week/text/default"))];
    cell.appendChild(t);
    t.textAutoResize = "WIDTH_AND_HEIGHT";
  });

  var weekRowComp = weekRow;
  for (var r = 0; r < 6; r++) {
    var wr = weekRowComp.createInstance();
    wr.name = "week-" + (r + 1);
    grid.appendChild(wr);
    wr.layoutSizingHorizontal = "FILL";
  }
  return grid;
}
var gridComp = buildGrid();
formPage.appendChild(gridComp);
gridComp.x = 4200;
gridComp.y = 1100;
gridComp.name = ".Base / Calendar / Grid";
gridComp.description = "Internal calendar month grid with weekday header and 6 week rows.";

function buildHeader() {
  var hdr = figma.createComponent();
  hdr.name = "Header";
  hdr.layoutMode = "HORIZONTAL";
  hdr.primaryAxisAlignItems = "CENTER";
  hdr.counterAxisAlignItems = "CENTER";
  hdr.primaryAxisSizingMode = "FIXED";
  hdr.counterAxisSizingMode = "AUTO";
  hdr.resize(280, 36);
  hdr.itemSpacing = 8;
  hdr.fills = [];

  function navBtn(name) {
    var btn = figma.createFrame();
    btn.name = name;
    btn.layoutMode = "HORIZONTAL";
    btn.primaryAxisAlignItems = "CENTER";
    btn.counterAxisAlignItems = "CENTER";
    btn.resize(32, 32);
    btn.cornerRadius = 8;
    btn.fills = [];
    btn.appendChild(chevron(16, name === "prev-month" ? "prev" : "next", gv("color/calendar/nav/icon/default")));
    return btn;
  }
  var prev = navBtn("prev-month");
  hdr.appendChild(prev);
  prev.layoutSizingHorizontal = "FIXED";
  var label = figma.createText();
  label.name = "month-year";
  label.fontName = { family: "Poppins", style: "SemiBold" };
  label.characters = "June 2026";
  if (bodySm) label.textStyleId = bodySm.id;
  label.fills = [boundPaint(gv("color/calendar/header/text/default"))];
  hdr.appendChild(label);
  label.layoutSizingHorizontal = "FILL";
  label.textAlignHorizontal = "CENTER";
  var next = navBtn("next-month");
  hdr.appendChild(next);
  next.layoutSizingHorizontal = "FIXED";
  var monthProp = hdr.addComponentProperty("Month year", "TEXT", "June 2026");
  label.componentPropertyReferences = { characters: monthProp };
  return hdr;
}
var headerComp = buildHeader();
formPage.appendChild(headerComp);
headerComp.x = 4200;
headerComp.y = 1700;
headerComp.name = ".Base / Calendar / Header";
headerComp.description = "Internal calendar month header with prev/next navigation.";

function buildContainer(showFooter) {
  var cont = figma.createComponent();
  cont.name = showFooter ? "Footer=Yes" : "Footer=No";
  cont.layoutMode = "VERTICAL";
  cont.primaryAxisSizingMode = "AUTO";
  cont.counterAxisSizingMode = "AUTO";
  cont.setBoundVariable("paddingTop", calPad);
  cont.setBoundVariable("paddingBottom", calPad);
  cont.setBoundVariable("paddingLeft", calPad);
  cont.setBoundVariable("paddingRight", calPad);
  cont.setBoundVariable("itemSpacing", calGap);
  cont.fills = [boundPaint(gv("color/calendar/background/default"))];
  cont.strokes = [boundPaint(gv("color/calendar/border/default"))];
  cont.setBoundVariable("strokeWeight", borderSm);
  cont.strokeAlign = "INSIDE";
  cont.setBoundVariable("topLeftRadius", radius8);
  cont.setBoundVariable("topRightRadius", radius8);
  cont.setBoundVariable("bottomLeftRadius", radius8);
  cont.setBoundVariable("bottomRightRadius", radius8);
  cont.clipsContent = false;

  var hdrInst = headerComp.createInstance();
  hdrInst.name = "header";
  cont.appendChild(hdrInst);
  hdrInst.layoutSizingHorizontal = "FILL";

  var gridInst = gridComp.createInstance();
  gridInst.name = "grid";
  cont.appendChild(gridInst);
  gridInst.layoutSizingHorizontal = "HUG";

  if (showFooter) {
    var footer = figma.createFrame();
    footer.name = "footer";
    footer.layoutMode = "HORIZONTAL";
    footer.primaryAxisSizingMode = "AUTO";
    footer.counterAxisSizingMode = "AUTO";
    footer.itemSpacing = 16;
    footer.fills = [];
    cont.appendChild(footer);
    footer.layoutSizingHorizontal = "FILL";
    ["Today", "Clear"].forEach(function (lbl) {
      var t = figma.createText();
      t.name = lbl.toLowerCase();
      t.fontName = { family: "Poppins", style: "SemiBold" };
      t.characters = lbl;
      if (caption) t.textStyleId = caption.id;
      t.fills = [boundPaint(gv("color/calendar/footer/text/default"))];
      footer.appendChild(t);
      t.textAutoResize = "WIDTH_AND_HEIGHT";
    });
  }
  return cont;
}
var contNo = buildContainer(false);
var contYes = buildContainer(true);
formPage.appendChild(contNo);
contNo.x = 4200;
contNo.y = 1900;
formPage.appendChild(contYes);
contYes.x = 4550;
contYes.y = 1900;
var contSet = figma.combineAsVariants([contNo, contYes], formPage);
contSet.name = ".Base / Calendar / Container";
contSet.x = 4180;
contSet.y = 1880;
contSet.description = "Internal calendar popover container. Footer=Yes adds Today and Clear actions. Range picker examples may add Apply in product code.";

return {
  createdNodeIds: [daySet.id, weekRow.id, gridComp.id, headerComp.id, contSet.id],
  dayCellVariants: daySet.children.length
};
