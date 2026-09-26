// use_figma — Bind Snackbar action label + close icon to snackbar tokens; update description
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function boundPaint(v) {
  return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", v);
}

var actionTok = gv("color/snackbar/action/text/default");
var closeTok = gv("color/snackbar/close/icon/default");
if (!actionTok || !closeTok) return { error: "missing snackbar action/close tokens" };

var notifPage = figma.root.children.find(function (p) { return p.name === "Notifications"; });
await figma.setCurrentPageAsync(notifPage);

var snackSet = figma.currentPage.findOne(function (n) { return n.name === "Snackbar" && n.type === "COMPONENT_SET"; });
if (!snackSet) return { error: "Snackbar component set not found" };

var mutatedNodeIds = [];
var bindings = [];

async function bindVariant(variant) {
  var btn = variant.findOne(function (n) { return n.type === "INSTANCE" && n.name === "Button"; });
  if (btn) {
    var label = btn.findOne(function (n) { return n.type === "TEXT" && n.name === "label"; });
    if (label) {
      var segs = label.getStyledTextSegments(["fontName"]);
      for (var i = 0; i < segs.length; i++) await figma.loadFontAsync(segs[i].fontName);
      label.fills = [boundPaint(actionTok)];
      mutatedNodeIds.push(label.id);
      bindings.push({ variant: variant.name, layer: "action/label", token: actionTok.name });
    }
  }
  var closeBtn = variant.findOne(function (n) { return n.type === "INSTANCE" && n.name === "Icon Button"; });
  if (closeBtn) {
    var vec = closeBtn.findOne(function (n) { return n.type === "VECTOR" && n.name === "Vector"; });
    if (vec && vec.fills && vec.fills.length) {
      vec.fills = [boundPaint(closeTok)];
      mutatedNodeIds.push(vec.id);
      bindings.push({ variant: variant.name, layer: "close/Vector", token: closeTok.name });
    }
  }
}

for (var v = 0; v < snackSet.children.length; v++) {
  await bindVariant(snackSet.children[v]);
}

snackSet.description =
  "Snackbar — short temporary feedback. Tone: Neutral/Success/Warning/Danger/Info. Toggles: Show icon/action/close. Editable Message on nested Ghost Button label. Theme-aware elevated container (surface/elevated); tone via leading icon + accent border. Action uses snackbar/action/text/*; close uses snackbar/close/icon/*.";

return { bindings: bindings, mutatedNodeIds: mutatedNodeIds, descriptionUpdated: true };
