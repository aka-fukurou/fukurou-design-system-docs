var INK = { r: 35 / 255, g: 31 / 255, b: 32 / 255 };
function ds(y, blur, a) {
  return { type: "DROP_SHADOW", color: { r: INK.r, g: INK.g, b: INK.b, a: a }, offset: { x: 0, y: y }, radius: blur, spread: 0, visible: true, blendMode: "NORMAL" };
}
var SHADOWS = {
  none: [],
  surface: [ds(1, 2, 0.06)],
  raised: [ds(1, 3, 0.08), ds(1, 2, 0.04)],
  floating: [ds(4, 8, 0.08), ds(2, 4, 0.04)],
  popover: [ds(8, 16, 0.1), ds(4, 8, 0.06)],
  modal: [ds(16, 32, 0.12), ds(8, 16, 0.08)],
  overlay: [ds(24, 48, 0.14), ds(12, 24, 0.1)]
};
var rows = [
  { label: "None", token: "elevation/none", style: "Elevation / None", key: "none" },
  { label: "Surface", token: "elevation/surface", style: "Elevation / Surface", key: "surface" },
  { label: "Raised", token: "elevation/raised", style: "Elevation / Raised", key: "raised" },
  { label: "Floating", token: "elevation/floating", style: "Elevation / Floating", key: "floating" },
  { label: "Popover", token: "elevation/popover", style: "Elevation / Popover", key: "popover" },
  { label: "Modal", token: "elevation/modal", style: "Elevation / Modal", key: "modal" },
  { label: "Overlay", token: "elevation/overlay", style: "Elevation / Overlay", key: "overlay" }
];

var docPage = figma.root.children.find(function (p) { return p.name === "_Documentation"; });
if (!docPage) { docPage = figma.createPage(); docPage.name = "_Documentation"; }
await figma.setCurrentPageAsync(docPage);
var old = docPage.findOne(function (n) { return n.name === "Elevation & Shadow"; });
if (old) old.remove();

await figma.loadFontAsync({ family: "Inter", style: "Regular" });
await figma.loadFontAsync({ family: "Inter", style: "Semi Bold" });

var pageBg = figma.variables.getLocalVariables().find(function (v) { return v.name === "color/surface/page"; });
function boundPaint(v) {
  function resolve(x) {
    var g = 0;
    while (x && g++ < 12) {
      var mid = Object.keys(x.valuesByMode)[0];
      var val = x.valuesByMode[mid];
      if (val && val.type === "VARIABLE_ALIAS") x = figma.variables.getVariableById(val.id);
      else return val;
    }
    return { r: 0.98, g: 0.98, b: 0.97, a: 1 };
  }
  var c = resolve(v);
  return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: c.r, g: c.g, b: c.b }, opacity: 1 }, "color", v);
}

var frame = figma.createFrame();
frame.name = "Elevation & Shadow";
frame.layoutMode = "VERTICAL";
frame.primaryAxisSizingMode = "AUTO";
frame.counterAxisSizingMode = "AUTO";
frame.itemSpacing = 32;
frame.paddingTop = 48; frame.paddingBottom = 48; frame.paddingLeft = 48; frame.paddingRight = 48;
frame.fills = [boundPaint(pageBg)];
docPage.appendChild(frame);
frame.x = 80; frame.y = 80;
frame.resize(900, 100);

function text(content, size, bold) {
  var t = figma.createText();
  t.fontName = { family: "Inter", style: bold ? "Semi Bold" : "Regular" };
  t.fontSize = size;
  t.characters = content;
  t.fills = [{ type: "SOLID", color: { r: 0.12, g: 0.11, b: 0.11 } }];
  frame.appendChild(t);
  t.layoutSizingHorizontal = "FILL";
  return t;
}

text("ELEVATION & SHADOW", 24, true);
text("Inspired by the restrained depth of Vercel, the practical elevation hierarchy of Atlassian, and the tokenized component mapping approach of Polaris — adapted to Fukurou.", 14, false);
text("Use subtle shadows for everyday surfaces. Stronger shadows only for floating UI. In Dark mode, combine shadow with surface elevation color and border contrast.", 13, false);

var grid = figma.createFrame();
grid.name = "Elevation scale";
grid.layoutMode = "VERTICAL";
grid.itemSpacing = 16;
grid.fills = [];
frame.appendChild(grid);
grid.layoutSizingHorizontal = "FILL";

var cardBg = figma.variables.getLocalVariables().find(function (v) { return v.name === "color/surface/card"; });
rows.forEach(function (row) {
  var r = figma.createFrame();
  r.layoutMode = "HORIZONTAL";
  r.primaryAxisSizingMode = "AUTO";
  r.counterAxisSizingMode = "AUTO";
  r.itemSpacing = 24;
  r.counterAxisAlignItems = "CENTER";
  r.fills = [];
  grid.appendChild(r);
  r.layoutSizingHorizontal = "FILL";
  var swatch = figma.createFrame();
  swatch.resize(160, 80);
  swatch.cornerRadius = 12;
  swatch.fills = [boundPaint(cardBg)];
  swatch.effects = SHADOWS[row.key];
  r.appendChild(swatch);
  swatch.layoutSizingHorizontal = "FIXED";
  var col = figma.createFrame();
  col.layoutMode = "VERTICAL";
  col.itemSpacing = 4;
  col.fills = [];
  r.appendChild(col);
  col.layoutSizingHorizontal = "FILL";
  var t1 = figma.createText(); t1.fontName = { family: "Inter", style: "Semi Bold" }; t1.fontSize = 14;
  t1.characters = row.label; t1.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
  col.appendChild(t1);
  var t2 = figma.createText(); t2.fontName = { family: "Inter", style: "Regular" }; t2.fontSize = 12;
  t2.characters = row.token + "  ·  " + row.style;
  t2.fills = [{ type: "SOLID", color: { r: 0.35, g: 0.33, b: 0.33 } }];
  col.appendChild(t2);
});

text("Component mapping", 18, true);
text("Card default → elevation/surface · Card hover → elevation/raised · Dropdown/Popover → elevation/popover · Modal → elevation/modal · Toast → elevation/floating · Button / Text Field / Icon Button → elevation/none", 12, false);
text("Dark mode: shadows alone are insufficient — use color/surface/overlay, color/surface/floating, and color/border/elevated with subtle Shadow styles.", 12, false);
text("Accessibility: do not rely on shadow alone for interactivity; use focus rings, layout, and labels.", 12, false);

return { frameId: frame.id, swatchCount: rows.length };
