// use_figma — Search Field layout fix + property wiring
function parseState(name) {
  var p = {};
  name.split(", ").forEach(function (s) { var kv = s.split("="); p[kv[0]] = kv[1]; });
  return p.State;
}

var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
var set = formPage.findOne(function (n) { return n.name === "Search Field"; });
if (!set) return { error: "Search Field set not found" };

var spacing2 = figma.variables.getLocalVariables().find(function (v) { return v.name === "spacing/2"; });

function key(prefix) {
  return Object.keys(set.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; });
}
var keys = {
  label: key("Label"), placeholder: key("Placeholder"), value: key("Value"), helper: key("Helper"), errorText: key("Error"),
  showLabel: key("Show label"), showHelper: key("Show helper"), showError: key("Show error text"), showClear: key("Show clear button")
};

set.children.forEach(function (ch) {
  var state = parseState(ch.name);
  var label = ch.findOne(function (n) { return n.name === "label"; });
  var helper = ch.findOne(function (n) { return n.name === "helper"; });
  var err = ch.findOne(function (n) { return n.name === "error"; });
  var clearBtn = ch.findOne(function (n) { return n.name === "clear-button"; });
  var ph = ch.findOne(function (n) { return n.name === "placeholder-text"; });
  var val = ch.findOne(function (n) { return n.name === "value-text"; });
  var labelRow = ch.findOne(function (n) { return n.name === "label-row"; });

  if (labelRow) {
    labelRow.counterAxisSizingMode = "AUTO";
    labelRow.layoutSizingVertical = "HUG";
  }
  if (spacing2) ch.setBoundVariable("itemSpacing", spacing2);

  if (label && keys.label) label.componentPropertyReferences = { characters: keys.label, visible: keys.showLabel };
  if (ph && keys.placeholder) ph.componentPropertyReferences = { characters: keys.placeholder };
  if (val && keys.value) val.componentPropertyReferences = { characters: keys.value };
  if (clearBtn && keys.showClear) clearBtn.componentPropertyReferences = { visible: keys.showClear };

  if (helper && keys.helper) {
    if (state === "Error") {
      helper.visible = false;
      helper.componentPropertyReferences = { characters: keys.helper };
    } else {
      helper.componentPropertyReferences = { characters: keys.helper, visible: keys.showHelper };
      helper.visible = false;
    }
  }
  if (err && keys.errorText) {
    if (state === "Error") {
      err.visible = true;
      err.componentPropertyReferences = { characters: keys.errorText };
    } else {
      err.visible = false;
      err.componentPropertyReferences = { characters: keys.errorText, visible: keys.showError };
    }
  }

  if (state === "Filled" && clearBtn) clearBtn.visible = true;
});

return { setId: set.id, keys: keys, variantCount: set.children.length };
