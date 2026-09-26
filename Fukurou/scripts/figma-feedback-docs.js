// use_figma — Naming docs §18 Notification Button, §19 Snackbar
var namingPage = figma.root.children.find(function (p) { return p.name === "_Naming, Theme, Density & Responsive"; });
await figma.setCurrentPageAsync(namingPage);
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
function makeDoc(name, x, y, lines) {
  var old = namingPage.findOne(function (n) { return n.name === name; });
  if (old) old.remove();
  var sec = figma.createFrame(); sec.name = name; sec.layoutMode = "VERTICAL"; sec.primaryAxisSizingMode = "AUTO"; sec.counterAxisSizingMode = "FIXED"; sec.resize(720, 10);
  sec.itemSpacing = 12; sec.paddingTop = 24; sec.paddingBottom = 24; sec.paddingLeft = 24; sec.paddingRight = 24;
  sec.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]; sec.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.88 } }]; sec.strokeWeight = 1;
  namingPage.appendChild(sec); sec.x = x; sec.y = y;
  lines.forEach(function (l, i) { var t = figma.createText(); t.fontName = { family: "Poppins", style: i === 0 ? "SemiBold" : "Regular" }; t.characters = l; t.fontSize = i === 0 ? 14 : 12; sec.appendChild(t); t.layoutSizingHorizontal = "FILL"; });
  return sec.id;
}
var nb = makeDoc("18 \u00b7 NOTIFICATION BUTTON", 80, 6150, [
  "18 \u00b7 NOTIFICATION BUTTON",
  "Component set: Notification Button \u2014 State \u00d7 Badge. Built on the Icon Button foundation.",
  "Reuses Icon Button: shape, density/icon-button/small/size, color/icon-button/* (background, content, focus). Base Icon Button is NOT modified.",
  "State: Default \u00b7 Hover \u00b7 Pressed \u00b7 Focus \u00b7 Disabled \u2014 Badge: None \u00b7 Dot \u00b7 Count (editable Count text, 99+).",
  "Badge tokens: color/notification-button/badge/* + dot/* \u00b7 density/notification-button/* (dot-size, badge-min-height, badge-padding-x).",
  "Badge: red/600 fill, white count text, surface/page notch border, top-right, overflowing (not clipped). Bell icon fixed.",
  "Accessibility: accessible label in code (\u201CNotifications, 3 unread\u201D); badge not the only signal; visible focus ring."
]);
var sb = makeDoc("19 \u00b7 SNACKBAR", 80, 6520, [
  "19 \u00b7 SNACKBAR",
  "Component set: Snackbar \u2014 Tone variants + Show icon/action/close booleans + editable Message/Action.",
  "Tone: Neutral \u00b7 Success \u00b7 Warning \u00b7 Danger \u00b7 Info. Status tokens: color/status/{success,warning,danger,info}/* (2. Theme).",
  "Tokens: color/snackbar/* (background, border, text, icon, action, close) \u00b7 density/snackbar/* \u00b7 elevation/snackbar/default \u2192 elevation/floating.",
  "Container: fixed dark (color/brand/secondary/500) both themes; tone via colored icon + accent border; radius/12; floating shadow.",
  "Layout: horizontal auto layout, center, hug up to max-width 480; message wraps; action (underlined) + close stay aligned.",
  "Usage: short transient feedback only \u2014 not for persistent/critical alerts. Accessibility: text-based tone, visible focus for action/close."
]);
return { nb: nb, sb: sb };
