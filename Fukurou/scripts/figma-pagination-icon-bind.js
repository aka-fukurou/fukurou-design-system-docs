// use_figma — Bind Pagination prev/next arrow icons to color/pagination/control/icon/*
function gv(n) { return figma.variables.getLocalVariables().find(function (v) { return v.name === n; }); }
function boundPaint(v) {
  return figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", v);
}

var tokens = {
  default: gv("color/pagination/control/icon/default"),
  hover: gv("color/pagination/control/icon/hover"),
  disabled: gv("color/pagination/control/icon/disabled"),
};
if (!tokens.default) return { error: "missing color/pagination/control/icon/default" };

var navPage = figma.root.children.find(function (p) { return p.name === "Navigation"; });
await figma.setCurrentPageAsync(navPage || figma.root.children[0]);

function tokenForIconButton(ib) {
  var vn = ib.mainComponent ? ib.mainComponent.name : "";
  if (/State=Disabled/i.test(vn)) return tokens.disabled;
  if (/State=Hover/i.test(vn)) return tokens.hover;
  return tokens.default;
}

function isPaginationArrowVector(node) {
  if (node.type !== "VECTOR") return false;
  var p = node.parent;
  while (p) {
    if (/arrow_back|arrow_forward|chevron/i.test(p.name)) return true;
    if (p.name === "Icon Button") return true;
    p = p.parent;
  }
  return false;
}

function isInsideTextField(node) {
  var p = node.parent;
  while (p) {
    if (/text field/i.test(p.name)) return true;
    p = p.parent;
  }
  return false;
}

function bindPaginationIconButtons(root) {
  var mutated = [];
  var iconButtons = root.findAll(function (n) {
    return n.type === "INSTANCE" && n.name === "Icon Button";
  });
  iconButtons.forEach(function (ib) {
    var tok = tokenForIconButton(ib);
    if (!tok) return;
    ib.findAll(function (n) {
      return n.type === "VECTOR" && isPaginationArrowVector(n) && !isInsideTextField(n);
    }).forEach(function (vec) {
      if (!vec.fills || !vec.fills.length) return;
      vec.fills = [boundPaint(tok)];
      mutated.push({ id: vec.id, token: tok.name, ibState: ib.mainComponent ? ib.mainComponent.name : "" });
    });
  });
  return mutated;
}

var mutatedNodeIds = [];
var targets = [];

figma.currentPage.findAll(function (n) {
  return (n.type === "COMPONENT_SET" || n.type === "COMPONENT") &&
    (/^Pagination Desktop$/i.test(n.name) || /^Pagination Mobile$/i.test(n.name));
}).forEach(function (root) {
  targets.push(root.name);
  if (root.type === "COMPONENT_SET") {
    root.children.forEach(function (variant) {
      bindPaginationIconButtons(variant).forEach(function (m) { mutatedNodeIds.push(m); });
    });
  } else {
    bindPaginationIconButtons(root).forEach(function (m) { mutatedNodeIds.push(m); });
  }
});

return {
  targets: targets,
  count: mutatedNodeIds.length,
  bindings: mutatedNodeIds,
  mutatedNodeIds: mutatedNodeIds.map(function (m) { return m.id; }),
};
