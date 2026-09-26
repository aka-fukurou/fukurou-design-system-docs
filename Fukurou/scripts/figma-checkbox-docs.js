// use_figma — Naming docs §17 Checkbox
var namingPage = figma.root.children.find(function (p) { return p.name === "_Naming, Theme, Density & Responsive"; });
await figma.setCurrentPageAsync(namingPage);
var oldSec = namingPage.findOne(function (n) { return n.name === "17 · CHECKBOX"; });
if (oldSec) oldSec.remove();
await figma.loadFontAsync({ family: "Poppins", style: "Regular" });
await figma.loadFontAsync({ family: "Poppins", style: "SemiBold" });
var sec = figma.createFrame();
sec.name = "17 · CHECKBOX";
sec.layoutMode = "VERTICAL"; sec.primaryAxisSizingMode = "AUTO"; sec.counterAxisSizingMode = "FIXED"; sec.resize(720, 10);
sec.itemSpacing = 12; sec.paddingTop = 24; sec.paddingBottom = 24; sec.paddingLeft = 24; sec.paddingRight = 24;
sec.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1 } }]; sec.strokes = [{ type: "SOLID", color: { r: 0.9, g: 0.9, b: 0.88 } }]; sec.strokeWeight = 1;
namingPage.appendChild(sec); sec.x = 80; sec.y = 5800;
function line(text, bold) {
  var t = figma.createText(); t.fontName = { family: "Poppins", style: bold ? "SemiBold" : "Regular" };
  t.characters = text; t.fontSize = bold ? 14 : 12; sec.appendChild(t); t.layoutSizingHorizontal = "FILL"; return t;
}
line("17 · CHECKBOX", true);
line("Component set: Checkbox (indicator + content) — State × Checked × Indeterminate", false);
line("Tokens: color/checkbox/* (background · border · mark · label · description · focus) · density/checkbox/*", false);
line("State: Default · Hover · Focus · Disabled · Error — Checked: True/False — Indeterminate: True/False", false);
line("Checked: brand fill (color/action/primary/default) + checkmark. Indeterminate: brand fill + center bar. Not color alone.", false);
line("Focus: 2px ring + 2px offset (color/checkbox/focus/*) on the control, not clipped.", false);
line("Sizing: control 20px · checkmark 12px · indeterminate bar 10×2 · radius/4 · gap 12px · label body/md · description body/sm.", false);
line("Usage: Checkbox for independent / multiple selections; Radio Selector for mutually exclusive choices.", false);
line("Accessibility: native checkbox inputs; visible label; description supports label; fieldset/legend for groups; text-based group errors.", false);
return { docsSectionId: sec.id };
