function parseState(name) {
  var p = {};
  name.split(", ").forEach(function (s) { var kv = s.split("="); p[kv[0]] = kv[1]; });
  return p.State;
}

var formPage = figma.root.children.find(function (p) { return p.name === "Form"; });
await figma.setCurrentPageAsync(formPage);
var set = formPage.findOne(function (n) { return n.name === "Text Field"; });
var spacing2 = figma.variables.getLocalVariables().find(function (v) { return v.name === "spacing/2"; });

set.children.forEach(function (ch) {
  var helper = ch.findOne(function (n) { return n.name === "helper"; });
  var error = ch.findOne(function (n) { return n.name === "error"; });
  if (!helper || !error) return;

  var support = ch.findOne(function (n) { return n.name === "support-text"; });
  if (!support) {
    support = figma.createFrame();
    support.name = "support-text";
    support.layoutMode = "VERTICAL";
    support.primaryAxisSizingMode = "AUTO";
    support.counterAxisSizingMode = "AUTO";
    support.fills = [];
    support.itemSpacing = 4;
    ch.appendChild(support);
    support.layoutSizingHorizontal = "FILL";
  }
  if (helper.parent !== support) support.appendChild(helper);
  if (error.parent !== support) support.appendChild(error);

  [helper, error].forEach(function (t) {
    t.textAutoResize = "HEIGHT";
    t.layoutSizingHorizontal = "FILL";
    t.layoutSizingVertical = "HUG";
  });

  var labelRow = ch.findOne(function (n) { return n.name === "label-row"; });
  if (labelRow) {
    labelRow.counterAxisSizingMode = "AUTO";
    labelRow.layoutSizingVertical = "HUG";
    labelRow.children.forEach(function (t) {
      if (t.type === "TEXT") {
        t.textAutoResize = "WIDTH_AND_HEIGHT";
        t.layoutSizingHorizontal = "HUG";
        t.layoutSizingVertical = "HUG";
      }
    });
  }

  var val = ch.findOne(function (n) { return n.name === "value-text"; });
  if (val) {
    val.textAutoResize = "HEIGHT";
    val.layoutSizingHorizontal = "FILL";
    val.layoutSizingVertical = "HUG";
  }

  if (spacing2) ch.setBoundVariable("itemSpacing", spacing2);
});

function key(prefix) {
  return Object.keys(set.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; });
}
var keys = {
  label: key("Label"), placeholder: key("Placeholder"), value: key("Value"), helper: key("Helper"), errorText: key("Error"),
  showLabel: key("Show label"), showHelper: key("Show helper"), showError: key("Show error text"), required: key("Required"),
  showLead: key("Show leading icon"), showTrail: key("Show trailing icon"), leadSwap: key("Leading icon"), trailSwap: key("Trailing icon")
};

set.children.forEach(function (ch) {
  var state = parseState(ch.name);
  var label = ch.findOne(function (n) { return n.name === "label"; });
  var req = ch.findOne(function (n) { return n.name === "required"; });
  var helper = ch.findOne(function (n) { return n.name === "helper"; });
  var err = ch.findOne(function (n) { return n.name === "error"; });
  var lead = ch.findOne(function (n) { return n.name === "leading-icon"; });
  var trail = ch.findOne(function (n) { return n.name === "trailing-icon"; });
  var ph = ch.findOne(function (n) { return n.name === "placeholder-text"; });
  var val = ch.findOne(function (n) { return n.name === "value-text"; });

  if (label && keys.label) label.componentPropertyReferences = { characters: keys.label, visible: keys.showLabel };
  if (req && keys.required) req.componentPropertyReferences = { visible: keys.required };
  if (ph && keys.placeholder) ph.componentPropertyReferences = { characters: keys.placeholder };
  if (val && keys.value) val.componentPropertyReferences = { characters: keys.value };
  if (lead && keys.showLead) lead.componentPropertyReferences = { visible: keys.showLead, mainComponent: keys.leadSwap };
  if (trail && keys.showTrail) trail.componentPropertyReferences = { visible: keys.showTrail, mainComponent: keys.trailSwap };

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
});

var def = set.children.find(function (c) { return c.name === "State=Default, Size=Medium"; });
def.setProperties({ "Show helper text": true });
var helperOn = def.findOne(function (n) { return n.name === "helper"; });
var errOn = def.findOne(function (n) { return n.name === "error"; });

return {
  setId: set.id,
  defaultWithHelper: {
    rootH: def.height,
    children: def.children.map(function (c) {
      return { name: c.name, y: c.y, h: c.height, visible: c.visible };
    }),
    helperY: helperOn.y,
    helperVisible: helperOn.visible,
    errorVisible: errOn.visible
  }
};
