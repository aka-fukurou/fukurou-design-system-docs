// use_figma — Remove Multi-Select Dropdown from Fukurou Design System
function matchMultiSelectName(name) {
  if (!name) return false;
  var n = name.toLowerCase();
  return n.indexOf("multi-select") >= 0 || n.indexOf("multi select") >= 0 || n.indexOf("multiselect") >= 0 || name.indexOf("17 · MULTI-SELECT") === 0;
}
function topLevelMatches(page) {
  var nodes = page.findAll(function (n) { return matchMultiSelectName(n.name); });
  return nodes.filter(function (node) {
    var p = node.parent;
    while (p && p.type !== "PAGE") {
      if (matchMultiSelectName(p.name)) return false;
      p = p.parent;
    }
    return true;
  });
}
function isMultiSelectToken(name) {
  return name.indexOf("color/multi-select") === 0 || name.indexOf("elevation/multi-select") === 0 || name.indexOf("density/multi-select") === 0;
}

var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
var removedNodes = [];
topLevelMatches(formPage).forEach(function (node) {
  removedNodes.push({ page: "Form", id: node.id, name: node.name, type: node.type });
  node.remove();
});

var namingPage = figma.root.children.find(function (p) { return p.name === "_Naming, Theme, Density & Responsive"; });
// Note: single page switch per call — run naming + token removal as separate MCP calls if needed.
var removedTokens = [];
figma.variables.getLocalVariables().filter(function (v) { return isMultiSelectToken(v.name); }).forEach(function (v) {
  removedTokens.push(v.name);
  v.remove();
});

return { removedNodes: removedNodes, removedTokenCount: removedTokens.length, removedTokens: removedTokens };
