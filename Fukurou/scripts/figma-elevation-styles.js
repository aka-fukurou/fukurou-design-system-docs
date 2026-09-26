var INK = { r: 35 / 255, g: 31 / 255, b: 32 / 255 };
function ds(y, blur, a, spread) {
  return {
    type: "DROP_SHADOW",
    color: { r: INK.r, g: INK.g, b: INK.b, a: a },
    offset: { x: 0, y: y },
    radius: blur,
    spread: spread || 0,
    visible: true,
    blendMode: "NORMAL"
  };
}
var SHADOWS = {
  none: [],
  50: [ds(1, 2, 0.06)],
  100: [ds(1, 3, 0.08), ds(1, 2, 0.04)],
  200: [ds(4, 8, 0.08), ds(2, 4, 0.04)],
  300: [ds(8, 16, 0.1), ds(4, 8, 0.06)],
  400: [ds(16, 32, 0.12), ds(8, 16, 0.08)],
  500: [ds(24, 48, 0.14), ds(12, 24, 0.1)],
  600: [ds(32, 64, 0.18), ds(16, 32, 0.12)]
};
var semantic = {
  "Elevation / None": "none",
  "Elevation / Surface": 50,
  "Elevation / Raised": 100,
  "Elevation / Floating": 200,
  "Elevation / Popover": 300,
  "Elevation / Modal": 400,
  "Elevation / Overlay": 500
};
var existing = figma.getLocalEffectStyles();
function upsert(name, effects) {
  var s = existing.find(function (e) { return e.name === name; });
  if (!s) s = figma.createEffectStyle();
  s.name = name;
  s.effects = effects;
  return s.id;
}
var ids = [];
["none", 50, 100, 200, 300, 400, 500, 600].forEach(function (k) {
  ids.push(upsert("Shadow / " + k, SHADOWS[k]));
});
Object.keys(semantic).forEach(function (name) {
  ids.push(upsert(name, SHADOWS[semantic[name]]));
});
return { styleCount: ids.length, names: figma.getLocalEffectStyles().map(function (s) { return s.name; }) };
