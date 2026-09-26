/**
 * Fukurou Design System Generator — v3
 * ------------------------------------------------------------------
 * Builds a complete, white-label-ready Figma library from a single
 * brand configuration:
 *
 *   Tier 1  Foundation   raw values only — NO intent words in names
 *                        (color/brand/*, color/neutral/*, color/red/*, color/amber/*)
 *   Tier 2  Theme        semantic intent (action / surface / text / border) — theme-aware
 *                        (Light + Dark modes on `2. Theme`), aliases Foundation
 *   Tier 3  Component    component hooks (color/button/*, color/card/*), aliases Theme
 *
 * Supporting mode collections (Figma collection names):
 *   2. Theme     Light / Dark (semantic layer)
 *   2. Density   Comfortable (default) / Compact / Spacious
 *   2. Layout    Mobile / Tablet / Desktop / Wide (responsive reference values)
 *
 * Naming rule: the collection name already states the tier, so the tier word
 * is NOT repeated in variable names (e.g. `color/brand/primary/500`, not
 * `color/primitive/brand/primary/500`).
 *
 * --------------------------------------------------------------------------
 * v3 MIGRATION MAP (old name  ->  new name)
 * --------------------------------------------------------------------------
 *   color/primitive/primary/*    ->  color/brand/primary/*
 *   color/primitive/secondary/*  ->  color/brand/secondary/*
 *   color/primitive/action/*     ->  color/brand/primary/*   (merged: action == brand)
 *   color/primitive/danger/*     ->  color/red/*             (kept primitive-only)
 *   color/primitive/warning/*    ->  color/amber/*           (kept primitive-only)
 *   color/primitive/neutral/*    ->  color/neutral/*
 *   color/semantic/action/primary/*   ->  color/action/primary/*
 *   color/semantic/surface/*     ->  color/surface/*
 *   color/semantic/text/*        ->  color/text/*
 *   color/semantic/border/*      ->  color/border/*
 *   color/component/button/*     ->  color/button/*
 *   color/component/card/*       ->  color/card/*
 *   Button Type = Warning / Danger  ->  REMOVED (red & amber stay primitive-only,
 *                                       reserved for future Alert/Toast/Badge/Banner)
 * --------------------------------------------------------------------------
 *
 * White-label / re-theme: edit BRAND below and re-run.
 * Run via Figma Desktop on an EMPTY file (needs a Professional+ plan for the
 * `2. Density` (3 modes) and `2. Layout` (4 modes) collections).
 */

// ============================================================
// 0. BRAND CONFIGURATION (the only thing you edit to white-label)
// ============================================================
var BRAND = {
  primary: "#D33F55",   // color/brand/primary/500 — brand + primary action
  secondary: "#231F20", // color/brand/secondary/500
  red: "#DC2626",       // color/red/500 — RAW palette, reserved for danger/error (not wired to Button)
  amber: "#D97706",     // color/amber/500 — RAW palette, reserved for warning (not wired to Button)
  headerFont: "Lora",   // display + heading styles
  bodyFont: "Poppins"   // body + caption + button styles
};

// Warm neutral ramp (0 = white, 1000 = black).
var NEUTRAL_HEX = {
  0: "#FFFFFF", 50: "#FAFAF9", 100: "#F5F5F4", 200: "#E7E5E4", 300: "#D6D3D1",
  400: "#A8A29E", 500: "#78716C", 600: "#57534E", 700: "#44403C", 800: "#292524",
  900: "#1C1917", 1000: "#000000"
};

// ============================================================
// 1. COLOR MATH (ramp generation)
// ============================================================
function hexToRgba(hex) {
  var h = hex.replace("#", "");
  return { r: parseInt(h.substring(0, 2), 16) / 255, g: parseInt(h.substring(2, 4), 16) / 255, b: parseInt(h.substring(4, 6), 16) / 255, a: 1 };
}
function tint(c, amt) { return { r: c.r + (1 - c.r) * amt, g: c.g + (1 - c.g) * amt, b: c.b + (1 - c.b) * amt, a: 1 }; }
function shade(c, amt) { return { r: c.r * (1 - amt), g: c.g * (1 - amt), b: c.b * (1 - amt), a: 1 }; }
function buildRamp(baseHex) {
  var b = hexToRgba(baseHex);
  return { 50: tint(b, 0.95), 100: tint(b, 0.86), 200: tint(b, 0.70), 300: tint(b, 0.50), 400: tint(b, 0.26),
    500: b, 600: shade(b, 0.18), 700: shade(b, 0.36), 800: shade(b, 0.52), 900: shade(b, 0.66) };
}

// ============================================================
// 2. VARIABLE HELPERS
// ============================================================
function getOrCreateCollection(name) {
  var ex = figma.variables.getLocalVariableCollections().find(function (c) { return c.name === name; });
  return ex || figma.variables.createVariableCollection(name);
}
function web(name) { return "var(--" + name.replace(/[\s\/]+/g, "-").toLowerCase() + ")"; }
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

// ============================================================
// 3. TIER 1 — FOUNDATION (raw values only; Figma collection: `1. Foundation`)
// ============================================================
function createPrimitives() {
  var col = getOrCreateCollection("1. Foundation");
  col.renameMode(col.modes[0].modeId, "Value");
  var modeId = col.modes[0].modeId;
  var byName = {};
  function color(name, rgba) {
    var v = figma.variables.createVariable(name, col, "COLOR");
    v.setValueForMode(modeId, rgba); v.scopes = []; v.setVariableCodeSyntax("WEB", web(name)); byName[name] = v;
  }
  function float(name, value, scopes) {
    var v = figma.variables.createVariable(name, col, "FLOAT");
    v.setValueForMode(modeId, value); v.scopes = scopes; v.setVariableCodeSyntax("WEB", web(name)); byName[name] = v;
  }
  // Brand ramps — keep the brand identity name; do NOT call the brand color "red".
  var ramps = { "brand/primary": BRAND.primary, "brand/secondary": BRAND.secondary, "red": BRAND.red, "amber": BRAND.amber, "green": "#2F9E60", "blue": "#3F86E0" };
  Object.keys(ramps).forEach(function (name) {
    var r = buildRamp(ramps[name]);
    [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].forEach(function (s) { color("color/" + name + "/" + s, r[s]); });
  });
  [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000].forEach(function (s) { color("color/neutral/" + s, hexToRgba(NEUTRAL_HEX[s])); });
  [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64].forEach(function (s) { float("spacing/" + s, s, ["GAP", "WIDTH_HEIGHT"]); });
  float("spacing/text-button/padding-x", 4, ["WIDTH_HEIGHT", "GAP"]);
  float("spacing/text-button/padding-y", 2, ["WIDTH_HEIGHT", "GAP"]);
  float("spacing/text-button/gap", 4, ["GAP"]);
  [["radius/0", 0], ["radius/4", 4], ["radius/8", 8], ["radius/12", 12], ["radius/16", 16], ["radius/full", 999]].forEach(function (r) { float(r[0], r[1], ["CORNER_RADIUS"]); });
  [["border/width/none", 0], ["border/width/sm", 1], ["border/width/md", 2]].forEach(function (b) { float(b[0], b[1], ["STROKE_FLOAT"]); });
  // Shadow tokens (STRING — CSS box-shadow; apply matching Figma effect styles in design files)
  function str(name, value, desc) {
    var v = figma.variables.createVariable(name, col, "STRING");
    v.setValueForMode(modeId, value); v.scopes = []; v.description = desc || "";
    v.setVariableCodeSyntax("WEB", web(name)); byName[name] = v;
  }
  var ink = "35, 31, 32";
  str("effect/shadow/none", "none", "Figma: Shadow / none");
  str("effect/shadow/50", "0px 1px 2px rgba(" + ink + ", 0.06)", "Figma: Shadow / 50");
  str("effect/shadow/100", "0px 1px 3px rgba(" + ink + ", 0.08), 0px 1px 2px rgba(" + ink + ", 0.04)", "Figma: Shadow / 100");
  str("effect/shadow/200", "0px 4px 8px rgba(" + ink + ", 0.08), 0px 2px 4px rgba(" + ink + ", 0.04)", "Figma: Shadow / 200");
  str("effect/shadow/300", "0px 8px 16px rgba(" + ink + ", 0.10), 0px 4px 8px rgba(" + ink + ", 0.06)", "Figma: Shadow / 300");
  str("effect/shadow/400", "0px 16px 32px rgba(" + ink + ", 0.12), 0px 8px 16px rgba(" + ink + ", 0.08)", "Figma: Shadow / 400");
  str("effect/shadow/500", "0px 24px 48px rgba(" + ink + ", 0.14), 0px 12px 24px rgba(" + ink + ", 0.10)", "Figma: Shadow / 500");
  str("effect/shadow/600", "0px 32px 64px rgba(" + ink + ", 0.18), 0px 16px 32px rgba(" + ink + ", 0.12)", "Figma: Shadow / 600");
  return byName;
}

// ============================================================
// 4. TIER 2 — THEME (semantic intent; Light + Dark; alias -> Foundation)
// ============================================================
function createSemantics(prim) {
  var col = getOrCreateCollection("2. Theme");
  col.renameMode(col.modes[0].modeId, "Light");
  var L = col.modes[0].modeId;
  var D = col.addMode("Dark");
  var byName = {};
  var FILLS = ["ALL_FILLS", "STROKE_COLOR"], TEXT = ["TEXT_FILL"], SURFACE = ["FRAME_FILL", "SHAPE_FILL"], BORDER = ["STROKE_COLOR"];
  var P = function (n) { return prim["color/" + n]; };
  // alias to a Light primitive and a Dark primitive
  function a2(name, lp, dp, scopes) {
    var v = figma.variables.createVariable(name, col, "COLOR");
    v.setValueForMode(L, { type: "VARIABLE_ALIAS", id: P(lp).id });
    v.setValueForMode(D, { type: "VARIABLE_ALIAS", id: P(dp).id });
    v.scopes = scopes; v.setVariableCodeSyntax("WEB", web(name)); byName[name] = v;
  }
  // alias to another semantic token (same value in both modes; it inherits theming)
  function aSem(name, targetName, scopes) {
    var v = figma.variables.createVariable(name, col, "COLOR");
    v.setValueForMode(L, { type: "VARIABLE_ALIAS", id: byName[targetName].id });
    v.setValueForMode(D, { type: "VARIABLE_ALIAS", id: byName[targetName].id });
    v.scopes = scopes; v.setVariableCodeSyntax("WEB", web(name)); byName[name] = v;
  }
  // Action / primary (brand-led)
  a2("color/action/primary/default", "brand/primary/500", "brand/primary/400", FILLS);
  a2("color/action/primary/hover", "brand/primary/600", "brand/primary/300", FILLS);
  a2("color/action/primary/pressed", "brand/primary/700", "brand/primary/200", FILLS);
  a2("color/action/primary/subtle", "brand/primary/50", "brand/primary/900", FILLS);
  a2("color/action/primary/text", "brand/primary/700", "brand/primary/300", TEXT);
  a2("color/action/primary/disabled", "neutral/300", "neutral/700", FILLS);
  // Action / secondary (neutral)
  a2("color/action/secondary/default", "brand/secondary/500", "neutral/100", FILLS);
  a2("color/action/secondary/hover", "brand/secondary/600", "neutral/200", FILLS);
  a2("color/action/secondary/pressed", "brand/secondary/700", "neutral/300", FILLS);
  a2("color/action/secondary/subtle", "brand/secondary/50", "brand/secondary/900", FILLS);
  a2("color/action/secondary/text", "brand/secondary/700", "brand/secondary/300", TEXT);
  a2("color/action/secondary/disabled", "neutral/300", "neutral/700", FILLS);
  // Surface
  a2("color/surface/page", "neutral/50", "neutral/1000", SURFACE);
  a2("color/surface/card", "neutral/0", "neutral/900", SURFACE);
  a2("color/surface/elevated", "neutral/0", "neutral/800", SURFACE);
  a2("color/surface/subtle", "neutral/100", "neutral/800", SURFACE);
  a2("color/surface/inverse", "neutral/900", "neutral/100", SURFACE);
  a2("color/surface/brand", "brand/primary/500", "brand/primary/400", SURFACE);
  // Text
  a2("color/text/default", "brand/secondary/500", "neutral/0", TEXT);
  a2("color/text/subtle", "neutral/600", "neutral/300", TEXT);
  a2("color/text/strong", "neutral/900", "neutral/0", TEXT);
  a2("color/text/inverse", "neutral/0", "brand/secondary/500", TEXT);
  a2("color/text/disabled", "neutral/400", "neutral/600", TEXT);
  // a11y: action-colored TEXT must use the darker/lighter accessible shade, NOT the action
  // background color — keeps Ghost/link text >= 4.5:1 in both Light and Dark.
  aSem("color/text/action", "color/action/primary/text", TEXT);
  // Border
  a2("color/border/default", "neutral/200", "neutral/700", BORDER);
  a2("color/border/subtle", "neutral/100", "neutral/800", BORDER);
  a2("color/border/strong", "neutral/400", "neutral/500", BORDER);
  // Focus ring uses a stronger primary shade than the action fill for visible keyboard focus.
  a2("color/border/focus", "brand/primary/700", "brand/primary/300", BORDER);
  // Status / danger — form validation & status components (not Button types)
  a2("color/status/danger/default", "red/500", "red/400", FILLS);
  a2("color/status/danger/text", "red/700", "red/300", TEXT);
  a2("color/status/danger/subtle", "red/50", "red/900", SURFACE);
  a2("color/status/success/default", "green/500", "green/400", FILLS);
  a2("color/status/success/text", "green/700", "green/300", TEXT);
  a2("color/status/warning/default", "amber/500", "amber/400", FILLS);
  a2("color/status/warning/text", "amber/700", "amber/300", TEXT);
  a2("color/status/info/default", "blue/500", "blue/400", FILLS);
  a2("color/status/info/text", "blue/700", "blue/300", TEXT);
  // Control borders — form fields need stronger boundaries than decorative borders
  a2("color/border/control/default", "neutral/500", "neutral/400", BORDER);
  a2("color/border/control/hover", "neutral/600", "neutral/500", BORDER);
  aSem("color/border/control/focus", "color/border/focus", BORDER);
  aSem("color/border/control/error", "color/status/danger/default", BORDER);
  a2("color/border/control/disabled", "neutral/300", "neutral/700", BORDER);
  // Dark-mode elevation surfaces (shadows alone are insufficient on dark backgrounds)
  a2("color/surface/overlay", "neutral/0", "neutral/800", SURFACE);
  a2("color/surface/floating", "neutral/0", "neutral/700", SURFACE);
  a2("color/border/elevated", "neutral/200", "neutral/600", BORDER);
  // Semantic elevation (STRING aliases → effect/shadow/*; use Elevation/* effect styles in Figma)
  function a2Str(name, primKey) {
    var v = figma.variables.createVariable(name, col, "STRING");
    v.setValueForMode(L, { type: "VARIABLE_ALIAS", id: prim[primKey].id });
    v.setValueForMode(D, { type: "VARIABLE_ALIAS", id: prim[primKey].id });
    v.scopes = []; v.setVariableCodeSyntax("WEB", web(name)); byName[name] = v;
  }
  a2Str("elevation/none", "effect/shadow/none");
  a2Str("elevation/surface", "effect/shadow/50");
  a2Str("elevation/raised", "effect/shadow/100");
  a2Str("elevation/floating", "effect/shadow/200");
  a2Str("elevation/popover", "effect/shadow/300");
  a2Str("elevation/modal", "effect/shadow/400");
  a2Str("elevation/overlay", "effect/shadow/500");
  // NOTE: no danger/warning Button types — red & amber stay primitive-only for buttons.
  return { vars: byName, collection: col, lightId: L, darkId: D };
}

// ============================================================
// 5. TIER 3 — COMPONENT TOKENS (alias -> Theme)
// ============================================================
function createComponentTokens(sem, prim) {
  var col = getOrCreateCollection("3. Component");
  col.renameMode(col.modes[0].modeId, "Value");
  var modeId = col.modes[0].modeId;
  var byName = {};
  var BG = ["FRAME_FILL", "SHAPE_FILL"], TEXT = ["TEXT_FILL"], BORDER = ["STROKE_COLOR"];
  var CONTENT = ["TEXT_FILL", "SHAPE_FILL", "STROKE_COLOR"];
  var ICON = ["SHAPE_FILL", "STROKE_COLOR"];
  var TRANSPARENT = { r: 1, g: 1, b: 1, a: 0 };
  function alias(name, semName, scopes) {
    var v = figma.variables.createVariable(name, col, "COLOR");
    v.setValueForMode(modeId, { type: "VARIABLE_ALIAS", id: sem[semName].id });
    v.scopes = scopes; v.setVariableCodeSyntax("WEB", web(name)); byName[name] = v;
  }
  // alias straight to a Foundation primitive (fixed across themes) — used by Snackbar/Notification Button
  function aliasFoundation(name, primName, scopes) {
    var v = figma.variables.createVariable(name, col, "COLOR");
    v.setValueForMode(modeId, { type: "VARIABLE_ALIAS", id: (prim && prim[primName] ? prim[primName] : sem[primName]).id });
    v.scopes = scopes; v.setVariableCodeSyntax("WEB", web(name)); byName[name] = v;
  }
  function aliasComp(name, compName, scopes) {
    var v = figma.variables.createVariable(name, col, "COLOR");
    v.setValueForMode(modeId, { type: "VARIABLE_ALIAS", id: byName[compName].id });
    v.scopes = scopes; v.setVariableCodeSyntax("WEB", web(name)); byName[name] = v;
  }
  function raw(name, rgba, scopes) {
    var v = figma.variables.createVariable(name, col, "COLOR");
    v.setValueForMode(modeId, rgba); v.scopes = scopes; v.setVariableCodeSyntax("WEB", web(name)); byName[name] = v;
  }
  // Action button
  alias("color/button/action/background/default", "color/action/primary/default", BG);
  alias("color/button/action/background/hover", "color/action/primary/hover", BG);
  alias("color/button/action/background/pressed", "color/action/primary/pressed", BG);
  alias("color/button/action/background/disabled", "color/surface/subtle", BG);
  alias("color/button/action/text/default", "color/text/inverse", TEXT);
  alias("color/button/action/text/disabled", "color/text/disabled", TEXT);
  aliasComp("color/button/action/content/default", "color/button/action/text/default", CONTENT);
  aliasComp("color/button/action/content/hover", "color/button/action/text/default", CONTENT);
  aliasComp("color/button/action/content/pressed", "color/button/action/text/default", CONTENT);
  aliasComp("color/button/action/content/focus", "color/button/action/text/default", CONTENT);
  aliasComp("color/button/action/content/disabled", "color/button/action/text/disabled", CONTENT);
  raw("color/button/action/border/default", TRANSPARENT, BORDER);
  alias("color/button/action/border/focus", "color/border/focus", BORDER);
  // Secondary button
  alias("color/button/secondary/background/default", "color/action/secondary/default", BG);
  alias("color/button/secondary/background/hover", "color/action/secondary/hover", BG);
  alias("color/button/secondary/background/pressed", "color/action/secondary/pressed", BG);
  alias("color/button/secondary/background/disabled", "color/action/secondary/disabled", BG);
  alias("color/button/secondary/text/default", "color/text/inverse", TEXT);
  alias("color/button/secondary/text/disabled", "color/text/disabled", TEXT);
  aliasComp("color/button/secondary/content/default", "color/button/secondary/text/default", CONTENT);
  aliasComp("color/button/secondary/content/hover", "color/button/secondary/text/default", CONTENT);
  aliasComp("color/button/secondary/content/pressed", "color/button/secondary/text/default", CONTENT);
  aliasComp("color/button/secondary/content/focus", "color/button/secondary/text/default", CONTENT);
  aliasComp("color/button/secondary/content/disabled", "color/button/secondary/text/disabled", CONTENT);
  raw("color/button/secondary/border/default", TRANSPARENT, BORDER);
  alias("color/button/secondary/border/focus", "color/border/focus", BORDER);
  // Ghost button — transparent fill + visible secondary-brand stroke (not primary/action)
  raw("color/button/ghost/background/default", TRANSPARENT, BG);
  alias("color/button/ghost/background/hover", "color/surface/subtle", BG);
  alias("color/button/ghost/background/pressed", "color/action/secondary/subtle", BG);
  raw("color/button/ghost/background/disabled", TRANSPARENT, BG);
  alias("color/button/ghost/text/default", "color/action/secondary/text", TEXT);
  alias("color/button/ghost/text/hover", "color/action/secondary/hover", TEXT);
  alias("color/button/ghost/text/pressed", "color/action/secondary/pressed", TEXT);
  alias("color/button/ghost/text/disabled", "color/text/disabled", TEXT);
  aliasComp("color/button/ghost/content/default", "color/button/ghost/text/default", CONTENT);
  aliasComp("color/button/ghost/content/hover", "color/button/ghost/text/hover", CONTENT);
  aliasComp("color/button/ghost/content/pressed", "color/button/ghost/text/pressed", CONTENT);
  aliasComp("color/button/ghost/content/focus", "color/button/ghost/text/default", CONTENT);
  aliasComp("color/button/ghost/content/disabled", "color/button/ghost/text/disabled", CONTENT);
  alias("color/button/ghost/border/default", "color/action/secondary/default", BORDER);
  alias("color/button/ghost/border/hover", "color/action/secondary/hover", BORDER);
  alias("color/button/ghost/border/pressed", "color/action/secondary/pressed", BORDER);
  alias("color/button/ghost/border/focus", "color/border/focus", BORDER);
  alias("color/button/ghost/border/disabled", "color/border/default", BORDER);
  // Shared focus ring + surface gap (offset between button and ring)
  alias("color/button/focus/ring", "color/border/focus", BORDER);
  alias("color/button/focus/gap", "color/surface/page", BG);
  // Text Button — separate text-only component (not a Button Type)
  alias("color/text-button/text/default", "color/text/action", TEXT);
  alias("color/text-button/text/hover", "color/action/primary/text", TEXT);
  alias("color/text-button/text/pressed", "color/action/primary/pressed", TEXT);
  alias("color/text-button/text/disabled", "color/text/disabled", TEXT);
  aliasComp("color/text-button/content/default", "color/text-button/text/default", CONTENT);
  aliasComp("color/text-button/content/hover", "color/text-button/text/hover", CONTENT);
  aliasComp("color/text-button/content/pressed", "color/text-button/text/pressed", CONTENT);
  aliasComp("color/text-button/content/focus", "color/text-button/text/default", CONTENT);
  aliasComp("color/text-button/content/disabled", "color/text-button/text/disabled", CONTENT);
  raw("color/text-button/background/default", TRANSPARENT, BG);
  raw("color/text-button/background/hover", TRANSPARENT, BG);
  raw("color/text-button/background/pressed", TRANSPARENT, BG);
  raw("color/text-button/background/disabled", TRANSPARENT, BG);
  alias("color/text-button/border/focus", "color/border/focus", BORDER);
  // Icon Button — circular compact action (icon-only or number)
  raw("color/icon-button/background/default", TRANSPARENT, BG);
  alias("color/icon-button/background/hover", "color/action/primary/subtle", BG);
  alias("color/icon-button/background/pressed", "color/action/primary/default", BG);
  raw("color/icon-button/background/disabled", TRANSPARENT, BG);
  alias("color/icon-button/content/default", "color/text/action", CONTENT);
  alias("color/icon-button/content/hover", "color/text/action", CONTENT);
  alias("color/icon-button/content/pressed", "color/text/inverse", CONTENT);
  alias("color/icon-button/content/disabled", "color/text/disabled", CONTENT);
  aliasComp("color/icon-button/content/focus", "color/icon-button/content/default", CONTENT);
  alias("color/icon-button/focus/ring", "color/border/focus", BORDER);
  alias("color/icon-button/focus/gap", "color/surface/page", BG);
  raw("color/icon-button/border/default", TRANSPARENT, BORDER);
  // Text Field — single-line form input
  alias("color/text-field/background/default", "color/surface/card", BG);
  alias("color/text-field/background/hover", "color/surface/card", BG);
  alias("color/text-field/background/focus", "color/surface/card", BG);
  aliasComp("color/text-field/background/filled", "color/text-field/background/default", BG);
  aliasComp("color/text-field/background/error", "color/text-field/background/default", BG);
  alias("color/text-field/background/disabled", "color/surface/subtle", BG);
  alias("color/text-field/border/default", "color/border/control/default", BORDER);
  alias("color/text-field/border/hover", "color/border/control/hover", BORDER);
  alias("color/text-field/border/focus", "color/border/control/focus", BORDER);
  aliasComp("color/text-field/border/filled", "color/text-field/border/default", BORDER);
  alias("color/text-field/border/error", "color/border/control/error", BORDER);
  alias("color/text-field/border/disabled", "color/border/control/disabled", BORDER);
  alias("color/text-field/text/default", "color/text/default", TEXT);
  alias("color/text-field/text/placeholder", "color/text/subtle", TEXT);
  aliasComp("color/text-field/text/filled", "color/text-field/text/default", TEXT);
  alias("color/text-field/text/disabled", "color/text/disabled", TEXT);
  alias("color/text-field/label/default", "color/text/default", TEXT);
  aliasComp("color/text-field/label/focus", "color/text-field/label/default", TEXT);
  alias("color/text-field/label/error", "color/status/danger/text", TEXT);
  alias("color/text-field/label/disabled", "color/text/disabled", TEXT);
  alias("color/text-field/helper/default", "color/text/subtle", TEXT);
  alias("color/text-field/helper/disabled", "color/text/disabled", TEXT);
  alias("color/text-field/error/default", "color/status/danger/text", TEXT);
  alias("color/text-field/icon/default", "color/text/subtle", ICON);
  alias("color/text-field/icon/focus", "color/text/default", ICON);
  alias("color/text-field/icon/error", "color/status/danger/default", ICON);
  alias("color/text-field/icon/disabled", "color/text/disabled", ICON);
  alias("color/text-field/focus/ring", "color/border/focus", BORDER);
  alias("color/text-field/focus/gap", "color/surface/page", BG);
  // Search Field — specialized search input (Text Field patterns + search icon + clear)
  alias("color/search-field/background/default", "color/surface/card", BG);
  alias("color/search-field/background/hover", "color/surface/card", BG);
  alias("color/search-field/background/focus", "color/surface/card", BG);
  aliasComp("color/search-field/background/filled", "color/search-field/background/default", BG);
  aliasComp("color/search-field/background/error", "color/search-field/background/default", BG);
  alias("color/search-field/background/disabled", "color/surface/subtle", BG);
  alias("color/search-field/border/default", "color/border/control/default", BORDER);
  alias("color/search-field/border/hover", "color/border/control/hover", BORDER);
  alias("color/search-field/border/focus", "color/border/control/focus", BORDER);
  alias("color/search-field/border/error", "color/border/control/error", BORDER);
  alias("color/search-field/border/disabled", "color/border/control/disabled", BORDER);
  alias("color/search-field/text/value", "color/text/default", TEXT);
  alias("color/search-field/text/placeholder", "color/text/subtle", TEXT);
  alias("color/search-field/text/disabled", "color/text/disabled", TEXT);
  alias("color/search-field/label/default", "color/text/default", TEXT);
  aliasComp("color/search-field/label/focus", "color/search-field/label/default", TEXT);
  alias("color/search-field/label/error", "color/status/danger/text", TEXT);
  alias("color/search-field/label/disabled", "color/text/disabled", TEXT);
  alias("color/search-field/helper/default", "color/text/subtle", TEXT);
  alias("color/search-field/helper/disabled", "color/text/disabled", TEXT);
  alias("color/search-field/error/default", "color/status/danger/text", TEXT);
  alias("color/search-field/icon/default", "color/text/subtle", ICON);
  alias("color/search-field/icon/focus", "color/text/default", ICON);
  alias("color/search-field/icon/error", "color/status/danger/surface", ICON);
  alias("color/search-field/icon/disabled", "color/text/disabled", ICON);
  alias("color/search-field/clear-icon/default", "color/text/subtle", ICON);
  alias("color/search-field/clear-icon/hover", "color/text/default", ICON);
  alias("color/search-field/clear-icon/disabled", "color/text/disabled", ICON);
  alias("color/search-field/focus/ring", "color/border/focus", BORDER);
  alias("color/search-field/focus/gap", "color/surface/page", BG);
  // Dropdown — form select trigger (shares control border + focus patterns with Text Field)
  alias("color/dropdown/background/default", "color/surface/card", BG);
  alias("color/dropdown/background/hover", "color/surface/card", BG);
  alias("color/dropdown/background/focus", "color/surface/card", BG);
  aliasComp("color/dropdown/background/filled", "color/dropdown/background/default", BG);
  aliasComp("color/dropdown/background/error", "color/dropdown/background/default", BG);
  alias("color/dropdown/background/disabled", "color/surface/subtle", BG);
  alias("color/dropdown/border/default", "color/border/control/default", BORDER);
  alias("color/dropdown/border/hover", "color/border/control/hover", BORDER);
  alias("color/dropdown/border/focus", "color/border/control/focus", BORDER);
  alias("color/dropdown/border/error", "color/border/control/error", BORDER);
  alias("color/dropdown/border/disabled", "color/border/control/disabled", BORDER);
  alias("color/dropdown/text/value", "color/text/default", TEXT);
  alias("color/dropdown/text/placeholder", "color/text/subtle", TEXT);
  alias("color/dropdown/text/disabled", "color/text/disabled", TEXT);
  alias("color/dropdown/label/default", "color/text/default", TEXT);
  aliasComp("color/dropdown/label/focus", "color/dropdown/label/default", TEXT);
  alias("color/dropdown/label/error", "color/status/danger/text", TEXT);
  alias("color/dropdown/label/disabled", "color/text/disabled", TEXT);
  alias("color/dropdown/helper/default", "color/text/subtle", TEXT);
  alias("color/dropdown/helper/disabled", "color/text/disabled", TEXT);
  alias("color/dropdown/error/default", "color/status/danger/text", TEXT);
  alias("color/dropdown/icon/default", "color/text/subtle", ICON);
  alias("color/dropdown/icon/focus", "color/text/default", ICON);
  alias("color/dropdown/icon/error", "color/status/danger/default", ICON);
  alias("color/dropdown/icon/disabled", "color/text/disabled", ICON);
  alias("color/dropdown/focus/ring", "color/border/focus", BORDER);
  alias("color/dropdown/focus/gap", "color/surface/page", BG);
  alias("color/dropdown-menu/background/default", "color/surface/elevated", BG);
  alias("color/dropdown-menu/border/default", "color/border/default", BORDER);
  alias("color/dropdown-menu/option/background/default", "color/surface/elevated", BG);
  alias("color/dropdown-menu/option/background/hover", "color/action/primary/subtle", BG);
  alias("color/dropdown-menu/option/background/selected", "color/action/primary/subtle", BG);
  alias("color/dropdown-menu/option/text/default", "color/text/default", TEXT);
  alias("color/dropdown-menu/option/text/selected", "color/text/default", TEXT);
  alias("color/dropdown-menu/option/text/disabled", "color/text/disabled", TEXT);
  alias("color/dropdown-menu/checkmark/default", "color/text/action", ICON);
  // Radio Selector — mutually exclusive form choice
  alias("color/radio/background/default", "color/surface/card", BG);
  alias("color/radio/background/hover", "color/action/primary/subtle", BG);
  aliasComp("color/radio/background/selected", "color/radio/background/default", BG);
  aliasComp("color/radio/background/error", "color/radio/background/default", BG);
  alias("color/radio/background/disabled", "color/surface/subtle", BG);
  alias("color/radio/border/default", "color/border/control/default", BORDER);
  alias("color/radio/border/hover", "color/border/control/hover", BORDER);
  alias("color/radio/border/selected", "color/action/primary/default", BORDER);
  alias("color/radio/border/focus", "color/border/focus", BORDER);
  alias("color/radio/border/disabled", "color/border/control/disabled", BORDER);
  alias("color/radio/border/error", "color/status/danger/default", BORDER);
  alias("color/radio/dot/selected", "color/action/primary/default", BG);
  alias("color/radio/dot/disabled", "color/text/disabled", BG);
  alias("color/radio/label/default", "color/text/default", TEXT);
  alias("color/radio/label/disabled", "color/text/disabled", TEXT);
  alias("color/radio/label/error", "color/status/danger/text", TEXT);
  alias("color/radio/description/default", "color/text/subtle", TEXT);
  alias("color/radio/description/disabled", "color/text/disabled", TEXT);
  aliasComp("color/radio/description/error", "color/radio/description/default", TEXT);
  alias("color/radio/focus/ring", "color/border/focus", BORDER);
  alias("color/radio/focus/gap", "color/surface/page", BG);
  // Checkbox — independent on/off form selection
  alias("color/checkbox/background/default", "color/surface/card", BG);
  alias("color/checkbox/background/hover", "color/action/primary/subtle", BG);
  alias("color/checkbox/background/checked", "color/action/primary/default", BG);
  aliasComp("color/checkbox/background/indeterminate", "color/checkbox/background/checked", BG);
  alias("color/checkbox/background/disabled", "color/surface/subtle", BG);
  aliasComp("color/checkbox/background/error", "color/checkbox/background/default", BG);
  alias("color/checkbox/border/default", "color/border/control/default", BORDER);
  alias("color/checkbox/border/hover", "color/border/control/hover", BORDER);
  alias("color/checkbox/border/checked", "color/action/primary/default", BORDER);
  aliasComp("color/checkbox/border/indeterminate", "color/checkbox/border/checked", BORDER);
  alias("color/checkbox/border/focus", "color/border/focus", BORDER);
  alias("color/checkbox/border/disabled", "color/border/control/disabled", BORDER);
  alias("color/checkbox/border/error", "color/status/danger/default", BORDER);
  alias("color/checkbox/mark/checked", "color/text/inverse", BG);
  aliasComp("color/checkbox/mark/indeterminate", "color/checkbox/mark/checked", BG);
  alias("color/checkbox/mark/disabled", "color/text/disabled", BG);
  alias("color/checkbox/label/default", "color/text/default", TEXT);
  alias("color/checkbox/label/disabled", "color/text/disabled", TEXT);
  alias("color/checkbox/label/error", "color/status/danger/text", TEXT);
  alias("color/checkbox/description/default", "color/text/subtle", TEXT);
  alias("color/checkbox/description/disabled", "color/text/disabled", TEXT);
  aliasComp("color/checkbox/description/error", "color/checkbox/description/default", TEXT);
  alias("color/checkbox/focus/ring", "color/border/focus", BORDER);
  alias("color/checkbox/focus/gap", "color/surface/page", BG);
  // Snackbar — fixed dark container (both themes); tone via icon + accent border
  ["neutral", "success", "warning", "danger", "info"].forEach(function (t) {
    aliasFoundation("color/snackbar/background/" + t, "color/brand/secondary/500", BG);
    aliasFoundation("color/snackbar/text/" + t, "color/neutral/0", TEXT);
  });
  aliasFoundation("color/snackbar/border/neutral", "color/neutral/700", BORDER);
  aliasFoundation("color/snackbar/icon/neutral", "color/neutral/0", ICON);
  ["success", "warning", "danger", "info"].forEach(function (t) {
    alias("color/snackbar/border/" + t, "color/status/" + t + "/default", BORDER);
    alias("color/snackbar/icon/" + t, "color/status/" + t + "/default", ICON);
  });
  aliasFoundation("color/snackbar/action/text/default", "color/neutral/0", TEXT);
  aliasFoundation("color/snackbar/action/text/hover", "color/neutral/200", TEXT);
  aliasFoundation("color/snackbar/action/text/pressed", "color/neutral/300", TEXT);
  aliasFoundation("color/snackbar/close/icon/default", "color/neutral/300", ICON);
  aliasFoundation("color/snackbar/close/icon/hover", "color/neutral/0", ICON);
  // Notification Button — badge/dot (button itself reuses color/icon-button/*)
  aliasFoundation("color/notification-button/badge/background", "color/red/600", BG);
  aliasFoundation("color/notification-button/badge/text", "color/neutral/0", TEXT);
  alias("color/notification-button/badge/border", "color/surface/page", BORDER);
  aliasFoundation("color/notification-button/dot/background", "color/red/600", BG);
  alias("color/notification-button/dot/border", "color/surface/page", BORDER);
  // Card
  alias("color/card/background/default", "color/surface/card", BG);
  alias("color/card/border/default", "color/border/default", BORDER);
  alias("color/card/title", "color/text/default", TEXT);
  alias("color/card/body", "color/text/subtle", TEXT);
  // Elevation (STRING → Theme elevation/*; apply Elevation/* effect styles in Figma)
  function aliasStr(name, semName) {
    var v = figma.variables.createVariable(name, col, "STRING");
    v.setValueForMode(modeId, { type: "VARIABLE_ALIAS", id: sem[semName].id });
    v.scopes = []; v.setVariableCodeSyntax("WEB", web(name)); byName[name] = v;
  }
  aliasStr("elevation/card/default", "elevation/surface");
  aliasStr("elevation/card/hover", "elevation/raised");
  aliasStr("elevation/card/selected", "elevation/floating");
  aliasStr("elevation/button/default", "elevation/none");
  aliasStr("elevation/button/hover", "elevation/none");
  aliasStr("elevation/button/focus", "elevation/none");
  aliasStr("elevation/text-field/default", "elevation/none");
  aliasStr("elevation/text-field/focus", "elevation/none");
  aliasStr("elevation/popover/default", "elevation/popover");
  aliasStr("elevation/modal/default", "elevation/modal");
  aliasStr("elevation/dropdown/default", "elevation/popover");
  aliasStr("elevation/toast/default", "elevation/floating");
  aliasStr("elevation/snackbar/default", "elevation/floating");
  return byName;
}

// ============================================================
// 6. DENSITY collection (Comfortable default / Compact / Spacious)
// ============================================================
function createDensity() {
  var col = getOrCreateCollection("2. Density");
  col.renameMode(col.modes[0].modeId, "Comfortable");
  var Comfortable = col.modes[0].modeId, Compact = col.addMode("Compact"), Spacious = col.addMode("Spacious");
  var byName = {};
  function f(name, vals, scopes) {
    var v = figma.variables.createVariable(name, col, "FLOAT");
    v.setValueForMode(Comfortable, vals[0]); v.setValueForMode(Compact, vals[1]); v.setValueForMode(Spacious, vals[2]);
    v.scopes = scopes; v.setVariableCodeSyntax("WEB", web(name)); byName[name] = v;
  }
  var HW = ["WIDTH_HEIGHT"], GAP = ["GAP"], PAD = ["WIDTH_HEIGHT", "GAP"];
  f("density/button/small/height", [32, 28, 36], HW);
  f("density/button/medium/height", [40, 36, 44], HW);
  f("density/button/large/height", [48, 44, 52], HW);
  f("density/button/small/padding-x", [12, 10, 16], PAD);
  f("density/button/medium/padding-x", [16, 14, 20], PAD);
  f("density/button/large/padding-x", [20, 18, 24], PAD);
  f("density/button/gap", [8, 6, 10], GAP);
  f("density/icon-button/small/size", [32, 28, 36], HW);
  f("density/card/padding", [24, 16, 32], PAD);
  f("density/card/gap", [16, 12, 20], GAP);
  f("density/form/input/height", [40, 32, 48], HW);
  f("density/form/input/padding-x", [12, 10, 16], PAD);
  f("density/form/input/gap", [8, 6, 10], GAP);
  f("density/text-field/small/height", [40, 36, 44], HW);
  f("density/text-field/medium/height", [48, 44, 52], HW);
  f("density/text-field/small/padding-x", [12, 10, 14], PAD);
  f("density/text-field/medium/padding-x", [16, 14, 18], PAD);
  f("density/text-field/gap", [8, 6, 10], GAP);
  f("density/dropdown/small/height", [40, 36, 44], HW);
  f("density/dropdown/medium/height", [48, 44, 52], HW);
  f("density/dropdown/small/padding-x", [12, 10, 14], PAD);
  f("density/dropdown/medium/padding-x", [16, 14, 18], PAD);
  f("density/dropdown/gap", [8, 6, 10], GAP);
  f("density/dropdown-menu/option-height", [40, 36, 44], HW);
  f("density/dropdown-menu/padding-x", [12, 10, 14], PAD);
  f("density/radio/control-size", [20, 18, 22], HW);
  f("density/radio/dot-size", [8, 7, 9], HW);
  f("density/radio/gap", [12, 10, 14], GAP);
  f("density/checkbox/control-size", [20, 18, 22], HW);
  f("density/checkbox/mark-size", [12, 11, 13], HW);
  f("density/checkbox/indeterminate-width", [10, 9, 11], HW);
  f("density/checkbox/gap", [12, 10, 14], GAP);
  f("density/notification-button/dot-size", [8, 8, 10], HW);
  f("density/notification-button/badge-min-height", [16, 16, 18], HW);
  f("density/notification-button/badge-padding-x", [6, 5, 7], HW);
  f("density/snackbar/padding-x", [16, 14, 18], HW);
  f("density/snackbar/padding-y", [12, 10, 14], HW);
  f("density/snackbar/gap", [12, 10, 14], GAP);
  return byName;
}

// ============================================================
// 7. LAYOUT collection (Mobile / Tablet / Desktop / Wide)
// ============================================================
function createLayout() {
  var col = getOrCreateCollection("2. Layout");
  col.renameMode(col.modes[0].modeId, "Mobile");
  var Mobile = col.modes[0].modeId, Tablet = col.addMode("Tablet"), Desktop = col.addMode("Desktop"), Wide = col.addMode("Wide");
  function f(name, vals, scopes) {
    var v = figma.variables.createVariable(name, col, "FLOAT");
    v.setValueForMode(Mobile, vals[0]); v.setValueForMode(Tablet, vals[1]); v.setValueForMode(Desktop, vals[2]); v.setValueForMode(Wide, vals[3]);
    v.scopes = scopes; v.setVariableCodeSyntax("WEB", web(name));
  }
  var REF = [], SIZE = ["WIDTH_HEIGHT"], SPACE = ["GAP", "WIDTH_HEIGHT"];
  f("layout/breakpoint/min-width", [0, 768, 1024, 1440], REF);
  f("layout/grid/columns", [4, 8, 12, 12], REF);
  f("layout/grid/gutter", [16, 24, 24, 32], SPACE);
  f("layout/grid/margin", [16, 32, 48, 64], SPACE);
  f("layout/container/max-width", [0, 720, 1120, 1280], SIZE); // 0 = fluid / 100%
  f("layout/section/padding-x", [16, 32, 48, 64], SPACE);
  f("layout/section/padding-y", [32, 48, 64, 80], SPACE);
}

// ============================================================
// 8. TYPOGRAPHY — text styles
// ============================================================
function createTextStyles() {
  var H = BRAND.headerFont, B = BRAND.bodyFont;
  var specs = [
    ["display/lg", H, "SemiBold", 56, 64], ["display/md", H, "SemiBold", 48, 56],
    ["heading/xl", H, "SemiBold", 40, 48], ["heading/lg", H, "SemiBold", 32, 40],
    ["heading/md", H, "SemiBold", 24, 32], ["heading/sm", H, "SemiBold", 20, 28],
    ["body/lg", B, "Regular", 18, 28], ["body/md", B, "Regular", 16, 24], ["body/sm", B, "Regular", 14, 20],
    ["caption/md", B, "Regular", 12, 16], ["caption/sm", B, "Regular", 12, 16], ["button/md", B, "SemiBold", 14, 20],
    ["typography/text-button/sm", B, "Regular", 14, 20], ["typography/text-button/md", B, "SemiBold", 14, 20], ["typography/text-button/lg", B, "Regular", 18, 28]
  ];
  var underlineSpecs = [
    ["typography/text-button/sm/underline", B, "Regular", 14, 20],
    ["typography/text-button/md/underline", B, "SemiBold", 14, 20],
    ["typography/text-button/lg/underline", B, "Regular", 18, 28]
  ];
  var fonts = [{ family: H, style: "SemiBold" }, { family: B, style: "Regular" }, { family: B, style: "SemiBold" }];
  return Promise.all(fonts.map(function (f) { return figma.loadFontAsync(f); })).then(function () {
    var existing = figma.getLocalTextStyles();
    specs.forEach(function (s) {
      var ts = existing.find(function (e) { return e.name === s[0]; }) || figma.createTextStyle();
      ts.name = s[0]; ts.fontName = { family: s[1], style: s[2] }; ts.fontSize = s[3]; ts.lineHeight = { unit: "PIXELS", value: s[4] };
      ts.textDecoration = "NONE";
    });
    underlineSpecs.forEach(function (s) {
      var ts = existing.find(function (e) { return e.name === s[0]; }) || figma.createTextStyle();
      ts.name = s[0]; ts.fontName = { family: s[1], style: s[2] }; ts.fontSize = s[3]; ts.lineHeight = { unit: "PIXELS", value: s[4] };
      ts.textDecoration = "UNDERLINE";
    });
  });
}

// ============================================================
// 8b. ICON PLACEHOLDERS — swappable icon component set
// ============================================================
function ensureIconPlaceholderSet(comp) {
  if (comp.__iconBySize) return comp.__iconBySize;
  var sem = comp.__sem;
  var page = figma.root.children.find(function (p) { return p.name === "Cards" || p.name === "Card"; });
  if (!page) { page = figma.createPage(); page.name = "Card"; }
  var existing = page.findOne(function (n) {
    return n.type === "COMPONENT_SET" && (n.name === "Icon / Placeholder / Star" || n.name === "Icon / Placeholder");
  });
  if (existing) {
    if (existing.name === "Icon / Placeholder") existing.name = "Icon / Placeholder / Star";
    existing.children.forEach(function (ch) {
      var icon = ch.findOne(function (n) { return n.name === "icon" || n.type === "STAR" || n.type === "VECTOR"; });
      if (icon && icon.name !== "icon") icon.name = "icon";
    });
    var map = {};
    existing.children.forEach(function (ch) { map[parseInt(ch.name.split("=")[1], 10)] = ch; });
    comp.__iconBySize = map;
    ensureExtraIcons(page, sem);
    return map;
  }
  comp.__iconBySize = buildIconSet(page, sem, "Star", function (size) {
    var star = figma.createStar(); star.name = "icon"; star.pointCount = 5; star.innerRadius = 0.45;
    var starSize = Math.round(size * 0.833); star.resize(starSize, starSize);
    star.x = (size - starSize) / 2; star.y = (size - starSize) / 2;
    star.fills = [boundPaint(sem["color/text/subtle"])]; return star;
  });
  ensureExtraIcons(page, sem);
  return comp.__iconBySize;
}

function buildIconSet(page, sem, label, makeGlyph) {
  function variant(size) {
    var c = figma.createComponent(); c.name = "Size=" + size; c.resize(size, size); c.fills = [];
    var glyph = makeGlyph(size); c.appendChild(glyph); return c;
  }
  var c16 = variant(16), c20 = variant(20), c24 = variant(24);
  page.appendChild(c16); c16.x = 1200; c16.y = 80;
  page.appendChild(c20); c20.x = 1200; c20.y = 160;
  page.appendChild(c24); c24.x = 1200; c24.y = 0;
  var set = figma.combineAsVariants([c16, c20, c24], page);
  set.name = "Icon / Placeholder / " + label; set.x = 1180; set.y = label === "Star" ? -20 : (label === "Arrow Right" ? 120 : 260);
  return { 16: c16, 20: c20, 24: c24 };
}

function ensureExtraIcons(page, sem) {
  if (!page.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Icon / Placeholder / Arrow Right"; })) {
    buildIconSet(page, sem, "Arrow Right", function (size) {
      var v = figma.createVector(); v.name = "icon"; v.vectorPaths = [{ windingRule: "NONZERO", data: "M 4 8 L 11 8 M 11 8 L 8 5 M 11 8 L 8 11" }];
      v.resize(size * 0.75, size * 0.75); v.x = size * 0.125; v.y = size * 0.125;
      v.strokes = [boundPaint(sem["color/text/subtle"])]; v.strokeWeight = Math.max(1.5, size / 12); v.fills = [];
      return v;
    });
  }
  if (!page.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Icon / Placeholder / Plus"; })) {
    buildIconSet(page, sem, "Plus", function (size) {
      var v = figma.createVector(); v.name = "icon";
      v.vectorPaths = [{ windingRule: "NONZERO", data: "M " + (size / 2) + " " + (size * 0.25) + " L " + (size / 2) + " " + (size * 0.75) + " M " + (size * 0.25) + " " + (size / 2) + " L " + (size * 0.75) + " " + (size / 2) }];
      v.resize(size, size); v.strokes = [boundPaint(sem["color/text/subtle"])]; v.strokeWeight = Math.max(1.5, size / 8); v.fills = [];
      return v;
    });
  }
  if (!page.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Icon / Placeholder / Chevron Down"; })) {
    buildIconSet(page, sem, "Chevron Down", function (size) {
      var v = figma.createVector(); v.name = "icon"; v.vectorPaths = [{ windingRule: "NONZERO", data: "M 3 5 L 8 10 L 13 5" }];
      v.resize(size * 0.75, size * 0.75); v.x = size * 0.125; v.y = size * 0.2;
      v.strokes = [boundPaint(sem["color/text/subtle"])]; v.strokeWeight = Math.max(1.5, size / 10); v.fills = [];
      v.strokeCap = "ROUND"; v.strokeJoin = "ROUND"; return v;
    });
  }
  if (!page.findOne(function (n) { return n.type === "COMPONENT_SET" && n.name === "Icon / Placeholder / Check"; })) {
    buildIconSet(page, sem, "Check", function (size) {
      var v = figma.createVector(); v.name = "icon"; v.vectorPaths = [{ windingRule: "NONZERO", data: "M 3 8 L 6 11 L 13 4" }];
      v.resize(size * 0.75, size * 0.75); v.x = size * 0.125; v.y = size * 0.125;
      v.strokes = [boundPaint(sem["color/text/action"])]; v.strokeWeight = Math.max(1.5, size / 10); v.fills = [];
      v.strokeCap = "ROUND"; v.strokeJoin = "ROUND"; return v;
    });
  }
}

function bindContentPaint(node, contentVar) {
  var paint = boundPaint(contentVar);
  try {
    if ("fills" in node) node.fills = [paint];
    if ("strokes" in node && node.strokeWeight > 0) node.strokes = [paint];
  } catch (e) {}
}

function applyContentColorFromLabel(ch, contentVar) {
  var labelIdx = -1;
  for (var i = 0; i < ch.children.length; i++) { if (ch.children[i].name === "label") { labelIdx = i; break; } }
  if (labelIdx < 0) return;
  var label = ch.children[labelIdx];
  bindContentPaint(label, contentVar);
  [[ch.children[labelIdx - 1], "icon-left"], [ch.children[labelIdx + 1], "icon-right"]].forEach(function (pair) {
    var node = pair[0], slotName = pair[1];
    if (!node || node.type !== "INSTANCE") return;
    node.name = slotName;
    node.findAll(function (n) { return ("fills" in n || "strokes" in n) && n.type !== "INSTANCE"; }).forEach(function (n) {
      bindContentPaint(n, contentVar);
    });
  });
}

function appendIconInstance(parent, slotName, iconComp, contentVar, visible) {
  var inst = iconComp.createInstance();
  inst.name = slotName; inst.visible = visible;
  inst.layoutSizingHorizontal = "FIXED"; inst.layoutSizingVertical = "FIXED";
  parent.appendChild(inst);
  inst.mainComponent = iconComp;
  inst.findAll(function (n) { return ("fills" in n || "strokes" in n) && n.type !== "INSTANCE"; }).forEach(function (n) {
    bindContentPaint(n, contentVar);
  });
  return inst;
}

function applyIconButtonContent(ch, contentVar) {
  var num = ch.findOne(function (n) { return n.name === "number"; });
  if (num) bindContentPaint(num, contentVar);
  var icon = ch.findOne(function (n) { return n.name === "icon" && n.type === "INSTANCE"; });
  if (icon) {
    icon.findAll(function (n) { return ("fills" in n || "strokes" in n) && n.type !== "INSTANCE"; }).forEach(function (n) {
      bindContentPaint(n, contentVar);
    });
  }
}

function wireIconButtonSet(cs, icons, getContentVar) {
  var numberKey = Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf("Number") === 0; });
  var iconKey = Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf("Icon") === 0; });
  var iconComp = icons[16];
  cs.children.forEach(function (ch) {
    var p = {}; ch.name.split(", ").forEach(function (s) { var kv = s.split("="); p[kv[0]] = kv[1]; });
    if (p.Content === "Number") {
      var n = ch.findOne(function (x) { return x.name === "number"; });
      if (n && numberKey) n.componentPropertyReferences = { characters: numberKey };
    }
    if (p.Content === "Icon") {
      var ic = ch.findOne(function (x) { return x.name === "icon" && x.type === "INSTANCE"; }) || ch.findOne(function (x) { return x.type === "INSTANCE"; });
      if (ic && iconKey) {
        ic.name = "icon";
        ic.componentPropertyReferences = { mainComponent: iconKey };
        if (iconComp) ic.mainComponent = iconComp;
      }
    }
    if (getContentVar) applyIconButtonContent(ch, getContentVar(p));
  });
}

function wireIconSlots(cs, labelKey, icons, getTextVar) {
  var showLeft = Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf("Show left") === 0; });
  var showRight = Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf("Show right") === 0; });
  var defaultIcon = icons[20] || icons[24] || icons[16];
  var leftSwap = cs.addComponentProperty("Left icon", "INSTANCE_SWAP", defaultIcon.id);
  var rightSwap = cs.addComponentProperty("Right icon", "INSTANCE_SWAP", defaultIcon.id);
  var sizeMap = { Small: 16, Medium: 20, Large: 24 };
  cs.children.forEach(function (ch) {
    var p = {}; ch.name.split(", ").forEach(function (s) { var kv = s.split("="); p[kv[0]] = kv[1]; });
    var iconComp = icons[sizeMap[p.Size] || 20];
    var l = ch.findOne(function (n) { return n.name === "icon-left" || (n.type === "INSTANCE" && ch.children.indexOf(n) < ch.children.findIndex(function (x) { return x.name === "label"; })); });
    var r = ch.findOne(function (n) { return n.name === "icon-right" || (n.type === "INSTANCE" && ch.children.indexOf(n) > ch.children.findIndex(function (x) { return x.name === "label"; })); });
    var lbl = ch.findOne(function (n) { return n.name === "label"; });
    if (lbl && labelKey) lbl.componentPropertyReferences = { characters: labelKey };
    if (l) {
      l.componentPropertyReferences = { visible: showLeft, mainComponent: leftSwap };
      if (iconComp) l.mainComponent = iconComp;
      l.name = "icon-left";
    }
    if (r) {
      r.componentPropertyReferences = { visible: showRight, mainComponent: rightSwap };
      if (iconComp) r.mainComponent = iconComp;
      r.name = "icon-right";
    }
    if (getTextVar) applyContentColorFromLabel(ch, getTextVar(p));
  });
}

// ============================================================
// 9. BUTTON component set — 3 types x 3 sizes x 5 states (Action / Secondary / Ghost)
// ============================================================
function createButton(comp, density, prim) {
  ensureIconPlaceholderSet(comp);
  var icons = comp.__iconBySize;
  var iconSize = { Small: icons[16], Medium: icons[20], Large: icons[24] };
  var page = figma.createPage(); page.name = "Button";
  var dH = { Small: "density/button/small/height", Medium: "density/button/medium/height", Large: "density/button/large/height" };
  var dP = { Small: "density/button/small/padding-x", Medium: "density/button/medium/padding-x", Large: "density/button/large/padding-x" };
  function bg(type, state) {
    var t = type.toLowerCase();
    var s = { Default: "default", Hover: "hover", Pressed: "pressed", Focus: "default", Disabled: "disabled" }[state];
    return comp["color/button/" + t + "/background/" + s];
  }
  function contentTok(type, state) {
    var t = type.toLowerCase();
    if (state === "Disabled") return comp["color/button/" + t + "/content/disabled"];
    if (t === "ghost") {
      var gs = { Default: "default", Hover: "hover", Pressed: "pressed", Focus: "focus" }[state];
      return comp["color/button/ghost/content/" + gs];
    }
    var cs = { Default: "default", Hover: "hover", Pressed: "pressed", Focus: "focus" }[state];
    return comp["color/button/" + t + "/content/" + cs];
  }
  function borderTok(type, state) {
    var t = type.toLowerCase();
    var s = { Default: "default", Hover: "hover", Pressed: "pressed", Focus: "focus", Disabled: "disabled" }[state];
    return comp["color/button/" + t + "/border/" + s];
  }
  return figma.loadFontAsync({ family: BRAND.bodyFont, style: "SemiBold" }).then(function () {
    var buttonStyle = figma.getLocalTextStyles().find(function (s) { return s.name === "button/md"; });
    var variants = [];
    ["Action", "Secondary", "Ghost"].forEach(function (type) {
      ["Small", "Medium", "Large"].forEach(function (size) {
        ["Default", "Hover", "Pressed", "Focus", "Disabled"].forEach(function (state) {
          var c = figma.createComponent();
          c.name = "Type=" + type + ", Size=" + size + ", State=" + state;
          var body = c, focusRing = null;
          if (state === "Focus") {
            c.layoutMode = "HORIZONTAL"; c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "AUTO";
            c.counterAxisAlignItems = "CENTER"; c.primaryAxisAlignItems = "CENTER";
            c.clipsContent = false; c.fills = [];
            focusRing = figma.createFrame();
            focusRing.name = "focus-ring";
            focusRing.layoutMode = "HORIZONTAL"; focusRing.primaryAxisSizingMode = "AUTO"; focusRing.counterAxisSizingMode = "AUTO";
            focusRing.counterAxisAlignItems = "CENTER"; focusRing.primaryAxisAlignItems = "CENTER";
            focusRing.clipsContent = false;
            focusRing.fills = [boundPaint(comp["color/button/focus/gap"])];
            focusRing.strokes = [boundPaint(comp["color/button/focus/ring"])];
            focusRing.setBoundVariable("strokeWeight", comp.__borderMd);
            focusRing.strokeAlign = "OUTSIDE";
            focusRing.setBoundVariable("paddingTop", prim["spacing/2"]);
            focusRing.setBoundVariable("paddingBottom", prim["spacing/2"]);
            focusRing.setBoundVariable("paddingLeft", prim["spacing/2"]);
            focusRing.setBoundVariable("paddingRight", prim["spacing/2"]);
            ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { focusRing.setBoundVariable(k, comp.__radiusFull); });
            body = figma.createFrame();
            body.name = "button-body";
            focusRing.appendChild(body);
            c.appendChild(focusRing);
            focusRing.layoutSizingHorizontal = "HUG"; focusRing.layoutSizingVertical = "HUG";
          }
          body.layoutMode = "HORIZONTAL"; body.primaryAxisSizingMode = "AUTO"; body.counterAxisSizingMode = "FIXED";
          body.counterAxisAlignItems = "CENTER"; body.primaryAxisAlignItems = "CENTER";
          body.clipsContent = false; body.layoutWrap = "NO_WRAP";
          body.setBoundVariable("height", density[dH[size]]);
          body.setBoundVariable("paddingLeft", density[dP[size]]);
          body.setBoundVariable("paddingRight", density[dP[size]]);
          body.setBoundVariable("itemSpacing", density["density/button/gap"]);
          ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { body.setBoundVariable(k, comp.__radius8); });
          body.fills = [boundPaint(bg(type, state))];
          var tv = contentTok(type, state);
          appendIconInstance(body, "icon-left", iconSize[size], tv, false);
          var label = figma.createText();
          label.name = "label"; label.fontName = { family: BRAND.bodyFont, style: "SemiBold" }; label.characters = "Button";
          if (buttonStyle) label.textStyleId = buttonStyle.id;
          label.fills = [boundPaint(tv)]; body.appendChild(label);
          label.layoutSizingHorizontal = "HUG"; label.layoutSizingVertical = "HUG";
          label.textAutoResize = "WIDTH_AND_HEIGHT"; label.textTruncation = "DISABLED";
          appendIconInstance(body, "icon-right", iconSize[size], tv, false);
          if (state === "Focus" && type === "Ghost") {
            body.strokes = [boundPaint(borderTok(type, "Default"))];
            body.setBoundVariable("strokeWeight", comp.__borderSm);
            body.strokeAlign = "INSIDE";
          } else if (type === "Ghost" && state !== "Focus") {
            body.strokes = [boundPaint(borderTok(type, state))];
            body.setBoundVariable("strokeWeight", comp.__borderSm);
            body.strokeAlign = "INSIDE";
          }
          if (state === "Focus") { body.layoutSizingHorizontal = "HUG"; body.layoutSizingVertical = "HUG"; }
          c.opacity = state === "Disabled" ? 0.6 : 1;
          variants.push(c);
        });
      });
    });
    var cs = figma.combineAsVariants(variants, page); cs.name = "Button";
    var COL = ["Default", "Hover", "Pressed", "Focus", "Disabled"];
    var rowH = { Small: 32, Medium: 40, Large: 48 }, pad = 48, gap = 28, colW = 200, map = {};
    cs.children.forEach(function (ch) { var p = {}; ch.name.split(", ").forEach(function (s) { var kv = s.split("="); p[kv[0]] = kv[1]; }); map[p.Type + "|" + p.Size + "|" + p.State] = ch; });
    var rows = []; ["Action", "Secondary", "Ghost"].forEach(function (t) { ["Small", "Medium", "Large"].forEach(function (s) { rows.push([t, s]); }); });
    var py = pad;
    rows.forEach(function (r) { for (var ci = 0; ci < COL.length; ci++) { var ch = map[r[0] + "|" + r[1] + "|" + COL[ci]]; if (ch) { ch.x = pad + ci * (colW + gap); ch.y = py; } } py += rowH[r[1]] + gap; });
    cs.resizeWithoutConstraints(pad * 2 + COL.length * colW + (COL.length - 1) * gap, py - gap + pad);
    cs.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; cs.cornerRadius = 16; cs.x = 200; cs.y = 120;
    var labelKey = cs.addComponentProperty("Label", "TEXT", "Button");
    cs.addComponentProperty("Show left icon", "BOOLEAN", false);
    cs.addComponentProperty("Show right icon", "BOOLEAN", false);
    cs.children.forEach(function (ch) {
      var l = ch.findOne(function (n) { return n.name === "label"; }); if (l) l.componentPropertyReferences = { characters: labelKey };
    });
    wireIconSlots(cs, labelKey, icons, function (p) { return contentTok(p.Type, p.State); });
    cs.description = "Button — 3 types x 3 sizes x 5 states. Focus: focus-ring wrapper (2px gap + 2px OUTSIDE ring). Content: color/button/[type]/content/[state] on label + icons.";
    return { set: cs, labelKey: labelKey };
  });
}

// ============================================================
// 9b. TEXT BUTTON — separate text-only component (NOT a Button Type)
// ============================================================
// Ghost Button = button shape without fill (stroke + normal padding).
// Text Button = action that visually behaves like text (no bg/stroke, minimal padding).
function createTextButton(comp, prim) {
  ensureIconPlaceholderSet(comp);
  var icons = comp.__iconBySize;
  var iconSize = { Small: icons[16], Medium: icons[20], Large: icons[24] };
  var page = figma.root.children.find(function (p) { return p.name === "Button"; });
  if (!page) { page = figma.createPage(); page.name = "Button"; }
  function contentTok(state) {
    return comp["color/text-button/content/" + (state === "Disabled" ? "disabled" : state === "Hover" ? "hover" : state === "Pressed" ? "pressed" : state === "Focus" ? "focus" : "default")];
  }
  function bgTok(state) {
    var s = { Default: "default", Hover: "hover", Pressed: "pressed", Focus: "default", Disabled: "disabled" }[state];
    return comp["color/text-button/background/" + s];
  }
  var fontFor = {
    Small: { family: BRAND.bodyFont, style: "Regular", size: 14, lh: 20, baseStyle: "typography/text-button/sm", hoverStyle: "typography/text-button/sm/underline" },
    Medium: { family: BRAND.bodyFont, style: "SemiBold", size: 14, lh: 20, baseStyle: "typography/text-button/md", hoverStyle: "typography/text-button/md/underline" },
    Large: { family: BRAND.bodyFont, style: "Regular", size: 18, lh: 28, baseStyle: "typography/text-button/lg", hoverStyle: "typography/text-button/lg/underline" }
  };
  return figma.loadFontAsync({ family: BRAND.bodyFont, style: "SemiBold" }).then(function () {
    return figma.loadFontAsync({ family: BRAND.bodyFont, style: "Regular" });
  }).then(function () {
    var styles = figma.getLocalTextStyles();
    var S = function (n) { return styles.find(function (s) { return s.name === n; }); };
    var variants = [];
    ["Small", "Medium", "Large"].forEach(function (size) {
      ["Default", "Hover", "Pressed", "Focus", "Disabled"].forEach(function (state) {
        var c = figma.createComponent();
        c.name = "Size=" + size + ", State=" + state;
        c.layoutMode = "HORIZONTAL"; c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "AUTO";
        c.counterAxisAlignItems = "CENTER"; c.primaryAxisAlignItems = "CENTER";
        c.setBoundVariable("paddingLeft", prim["spacing/text-button/padding-x"]);
        c.setBoundVariable("paddingRight", prim["spacing/text-button/padding-x"]);
        c.setBoundVariable("paddingTop", prim["spacing/text-button/padding-y"]);
        c.setBoundVariable("paddingBottom", prim["spacing/text-button/padding-y"]);
        c.setBoundVariable("itemSpacing", prim["spacing/text-button/gap"]);
        c.fills = [boundPaint(bgTok(state))];
        var tv = contentTok(state);
        appendIconInstance(c, "icon-left", iconSize[size], tv, false);
        var label = figma.createText(); label.name = "label";
        var ff = fontFor[size];
        label.fontName = { family: ff.family, style: ff.style };
        label.fontSize = ff.size;
        label.lineHeight = { unit: "PIXELS", value: ff.lh };
        label.letterSpacing = { unit: "PERCENT", value: 0 };
        if (S(ff.baseStyle)) label.textStyleId = S(ff.baseStyle).id;
        label.characters = "Text Button";
        label.fills = [boundPaint(tv)];
        if (state === "Hover") label.textDecoration = "UNDERLINE";
        c.appendChild(label); label.layoutSizingHorizontal = "HUG"; label.layoutSizingVertical = "HUG";
        appendIconInstance(c, "icon-right", iconSize[size], tv, false);
        if (state === "Focus") {
          c.strokes = [boundPaint(comp["color/text-button/border/focus"])];
          c.setBoundVariable("strokeWeight", comp.__borderMd);
          c.strokeAlign = "OUTSIDE";
        }
        c.opacity = state === "Disabled" ? 0.6 : 1;
        variants.push(c);
      });
    });
    var cs = figma.combineAsVariants(variants, page); cs.name = "Text Button";
    cs.layoutMode = "HORIZONTAL"; cs.itemSpacing = 24; cs.paddingTop = 32; cs.paddingBottom = 32; cs.paddingLeft = 32; cs.paddingRight = 32;
    cs.primaryAxisSizingMode = "AUTO"; cs.counterAxisSizingMode = "AUTO"; cs.x = 80; cs.y = 900;
    var labelKey = cs.addComponentProperty("Label", "TEXT", "Text Button");
    cs.addComponentProperty("Show left icon", "BOOLEAN", false);
    cs.addComponentProperty("Show right icon", "BOOLEAN", false);
    wireIconSlots(cs, labelKey, icons, function (p) { return contentTok(p.State); });
    cs.description = "Text Button — separate from Button (not a Button Type). Per-variant text fills. Hover underline on label. icon-left/icon-right swappable. Button content color: label fill = icon fill.";
    return { set: cs, labelKey: labelKey };
  });
}

// ============================================================
// 9c. ICON BUTTON — circular compact action (icon or number)
// ============================================================
function createIconButton(comp, density, prim) {
  ensureIconPlaceholderSet(comp);
  var icons = comp.__iconBySize;
  var iconComp = icons[16];
  var page = figma.root.children.find(function (p) { return p.name === "Button"; });
  if (!page) { page = figma.createPage(); page.name = "Button"; }
  var sizeTok = "density/icon-button/small/size";
  function bgTok(state) {
    return comp["color/icon-button/background/" + ({ Default: "default", Hover: "hover", Pressed: "pressed", Focus: "default", Disabled: "disabled" }[state])];
  }
  function contentTok(state) {
    return comp["color/icon-button/content/" + ({ Default: "default", Hover: "hover", Pressed: "pressed", Focus: "focus", Disabled: "disabled" }[state])];
  }
  return figma.loadFontAsync({ family: BRAND.bodyFont, style: "SemiBold" }).then(function () {
    var variants = [];
    ["Icon", "Number"].forEach(function (content) {
      ["Default", "Hover", "Pressed", "Focus", "Disabled"].forEach(function (state) {
          var c = figma.createComponent();
          c.name = "Content=" + content + ", State=" + state;
          var focusRing = null;
          var body = figma.createFrame();
          body.name = "button-body";
          if (state === "Focus") {
            c.layoutMode = "HORIZONTAL"; c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "AUTO";
            c.counterAxisAlignItems = "CENTER"; c.primaryAxisAlignItems = "CENTER"; c.clipsContent = false; c.fills = [];
            focusRing = figma.createFrame();
            focusRing.name = "focus-ring";
            focusRing.layoutMode = "HORIZONTAL"; focusRing.primaryAxisSizingMode = "AUTO"; focusRing.counterAxisSizingMode = "AUTO";
            focusRing.counterAxisAlignItems = "CENTER"; focusRing.primaryAxisAlignItems = "CENTER"; focusRing.clipsContent = false;
            focusRing.fills = [boundPaint(comp["color/icon-button/focus/gap"])];
            focusRing.strokes = [boundPaint(comp["color/icon-button/focus/ring"])];
            focusRing.setBoundVariable("strokeWeight", comp.__borderMd);
            focusRing.strokeAlign = "OUTSIDE";
            focusRing.setBoundVariable("paddingTop", prim["spacing/2"]);
            focusRing.setBoundVariable("paddingBottom", prim["spacing/2"]);
            focusRing.setBoundVariable("paddingLeft", prim["spacing/2"]);
            focusRing.setBoundVariable("paddingRight", prim["spacing/2"]);
            ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { focusRing.setBoundVariable(k, comp.__radiusFull); });
            focusRing.appendChild(body);
            c.appendChild(focusRing);
            focusRing.layoutSizingHorizontal = "HUG"; focusRing.layoutSizingVertical = "HUG";
          } else {
            c.layoutMode = "HORIZONTAL"; c.primaryAxisSizingMode = "AUTO"; c.counterAxisSizingMode = "AUTO";
            c.counterAxisAlignItems = "CENTER"; c.primaryAxisAlignItems = "CENTER"; c.clipsContent = false; c.fills = [];
            c.appendChild(body);
            body.layoutSizingHorizontal = "FIXED"; body.layoutSizingVertical = "FIXED";
          }
          body.layoutMode = "HORIZONTAL"; body.primaryAxisSizingMode = "FIXED"; body.counterAxisSizingMode = "FIXED";
          body.primaryAxisAlignItems = "CENTER"; body.counterAxisAlignItems = "CENTER"; body.clipsContent = false;
          body.setBoundVariable("width", density[sizeTok]);
          body.setBoundVariable("height", density[sizeTok]);
          ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { body.setBoundVariable(k, comp.__radiusFull); });
          body.fills = [boundPaint(bgTok(state))];
          var cv = contentTok(state);
          if (content === "Icon") {
            appendIconInstance(body, "icon", iconComp, cv, true);
          } else {
            var num = figma.createText();
            num.name = "number"; num.fontName = { family: BRAND.bodyFont, style: "SemiBold" };
            num.fontSize = 12; num.characters = "01"; num.fills = [boundPaint(cv)];
            num.textAlignHorizontal = "CENTER"; body.appendChild(num);
            num.layoutSizingHorizontal = "HUG"; num.layoutSizingVertical = "HUG";
          }
          if (state === "Focus") { body.layoutSizingHorizontal = "HUG"; body.layoutSizingVertical = "HUG"; }
          c.opacity = state === "Disabled" ? 0.6 : 1;
          variants.push(c);
      });
    });
    var cs = figma.combineAsVariants(variants, page);
    cs.name = "Icon Button";
    cs.layoutMode = "HORIZONTAL"; cs.layoutWrap = "WRAP"; cs.itemSpacing = 20; cs.counterAxisSpacing = 20;
    cs.paddingTop = 32; cs.paddingBottom = 32; cs.paddingLeft = 32; cs.paddingRight = 32;
    cs.primaryAxisSizingMode = "AUTO"; cs.counterAxisSizingMode = "AUTO"; cs.x = 224; cs.y = 2100;
    cs.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; cs.cornerRadius = 16;
    cs.addComponentProperty("Number", "TEXT", "01");
    cs.addComponentProperty("Icon", "INSTANCE_SWAP", iconComp.id);
    wireIconButtonSet(cs, icons, function (p) { return contentTok(p.State); });
    cs.description = "Icon Button — Small (32px) only. Content: Icon (swappable) or Number. States: Default/Hover/Pressed/Focus/Disabled. Theme via color/icon-button/* tokens. Focus: offset ring.";
    return { set: cs };
  });
}

// ============================================================
// 9d. TEXT FIELD — single-line form input
// ============================================================
function wireTextFieldSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  function parseState(name) {
    var p = {}; name.split(", ").forEach(function (s) { var kv = s.split("="); p[kv[0]] = kv[1]; }); return p.State;
  }
  var keys = {
    label: key("Label"), placeholder: key("Placeholder"), value: key("Value"), helper: key("Helper"), errorText: key("Error"),
    showLabel: key("Show label"), showHelper: key("Show helper"), showError: key("Show error text"), required: key("Required"),
    showLead: key("Show leading icon"), showTrail: key("Show trailing icon"), leadSwap: key("Leading icon"), trailSwap: key("Trailing icon")
  };
  cs.children.forEach(function (ch) {
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
      helper.componentPropertyReferences = { characters: keys.helper };
      if (state === "Error") helper.visible = false;
      else { helper.componentPropertyReferences.visible = keys.showHelper; helper.visible = false; }
    }
    if (err && keys.errorText) {
      err.componentPropertyReferences = { characters: keys.errorText };
      if (state === "Error") err.visible = true;
      else { err.componentPropertyReferences.visible = keys.showError; err.visible = false; }
    }
  });
}

function createTextField(comp, density, prim) {
  ensureIconPlaceholderSet(comp);
  var icons = comp.__iconBySize;
  var page = figma.root.children.find(function (p) { return p.name === "Form"; });
  if (!page) { page = figma.createPage(); page.name = "Form"; }
  var cfg = {
    Default: { bg: "default", border: "default", label: "default", icon: "default", chars: "placeholder" },
    Hover: { bg: "default", border: "hover", label: "default", icon: "default", chars: "placeholder" },
    Focus: { bg: "focus", border: "focus", label: "focus", icon: "focus", chars: "placeholder", ring: true },
    Filled: { bg: "filled", border: "filled", label: "default", icon: "default", chars: "value" },
    Error: { bg: "error", border: "error", label: "error", icon: "error", chars: "value" },
    Disabled: { bg: "disabled", border: "disabled", label: "disabled", icon: "disabled", chars: "placeholder", opacity: 0.6, input: "disabled" }
  };
  return Promise.all([
    figma.loadFontAsync({ family: BRAND.bodyFont, style: "Regular" }),
    figma.loadFontAsync({ family: BRAND.bodyFont, style: "SemiBold" })
  ]).then(function () {
    var styles = figma.getLocalTextStyles();
    var S = function (n) { return styles.find(function (s) { return s.name === n; }); };
    var propKeys = {};
    function build(state, size) {
      var c = cfg[state];
      var heightTok = density[size === "Small" ? "density/text-field/small/height" : "density/text-field/medium/height"];
      var padTok = density[size === "Small" ? "density/text-field/small/padding-x" : "density/text-field/medium/padding-x"];
      var iconComp = icons[size === "Small" ? 16 : 20];
      var textStyle = size === "Small" ? S("body/sm") : S("body/md");
      var root = figma.createComponent();
      root.name = "State=" + state + ", Size=" + size;
      root.layoutMode = "VERTICAL"; root.primaryAxisSizingMode = "AUTO"; root.counterAxisSizingMode = "FIXED";
      root.resize(320, 10); root.setBoundVariable("itemSpacing", prim["spacing/2"]); root.fills = [];
      var labelRow = figma.createFrame();
      labelRow.name = "label-row"; labelRow.layoutMode = "HORIZONTAL"; labelRow.primaryAxisSizingMode = "AUTO"; labelRow.counterAxisSizingMode = "AUTO";
      labelRow.itemSpacing = 4; labelRow.fills = []; root.appendChild(labelRow); labelRow.layoutSizingHorizontal = "FILL"; labelRow.layoutSizingVertical = "HUG";
      var label = figma.createText(); label.name = "label"; label.fontName = { family: BRAND.bodyFont, style: "SemiBold" };
      label.characters = "Email address"; if (S("body/sm")) label.textStyleId = S("body/sm").id;
      label.fills = [boundPaint(comp["color/text-field/label/" + c.label])]; labelRow.appendChild(label);
      label.textAutoResize = "WIDTH_AND_HEIGHT"; label.layoutSizingHorizontal = "HUG"; label.layoutSizingVertical = "HUG";
      var req = figma.createText(); req.name = "required"; req.fontName = { family: BRAND.bodyFont, style: "SemiBold" };
      req.characters = "*"; req.fills = [boundPaint(comp["color/text-field/label/error"])]; labelRow.appendChild(req);
      req.textAutoResize = "WIDTH_AND_HEIGHT"; req.layoutSizingHorizontal = "HUG"; req.layoutSizingVertical = "HUG";
      var inputWrap = root;
      if (c.ring) {
        var focusRing = figma.createFrame();
        focusRing.name = "focus-ring"; focusRing.layoutMode = "HORIZONTAL"; focusRing.primaryAxisSizingMode = "AUTO"; focusRing.counterAxisSizingMode = "AUTO";
        focusRing.fills = [boundPaint(comp["color/text-field/focus/gap"])]; focusRing.strokes = [boundPaint(comp["color/text-field/focus/ring"])];
        focusRing.setBoundVariable("strokeWeight", comp.__borderMd); focusRing.strokeAlign = "OUTSIDE";
        ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"].forEach(function (p) { focusRing.setBoundVariable(p, prim["spacing/2"]); });
        ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { focusRing.setBoundVariable(k, comp.__radius8); });
        root.appendChild(focusRing); focusRing.layoutSizingHorizontal = "FILL"; inputWrap = focusRing;
      }
      var input = figma.createFrame();
      input.name = "input-container"; input.layoutMode = "HORIZONTAL"; input.primaryAxisSizingMode = "FIXED"; input.counterAxisSizingMode = "FIXED";
      input.counterAxisAlignItems = "CENTER"; input.primaryAxisAlignItems = "CENTER";
      input.setBoundVariable("height", heightTok); input.setBoundVariable("paddingLeft", padTok); input.setBoundVariable("paddingRight", padTok);
      input.setBoundVariable("itemSpacing", density["density/text-field/gap"]);
      input.fills = [boundPaint(comp["color/text-field/background/" + c.bg])];
      input.strokes = [boundPaint(comp["color/text-field/border/" + c.border])];
      input.setBoundVariable("strokeWeight", comp.__borderSm); input.strokeAlign = "INSIDE";
      ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { input.setBoundVariable(k, comp.__radius8); });
      inputWrap.appendChild(input); input.layoutSizingHorizontal = "FILL";
      var lead = appendIconInstance(input, "leading-icon", iconComp, comp["color/text-field/icon/" + c.icon], false);
      var ph = figma.createText(); ph.name = "placeholder-text"; ph.fontName = { family: BRAND.bodyFont, style: "Regular" };
      ph.characters = "Enter email address"; if (textStyle) ph.textStyleId = textStyle.id;
      ph.fills = [boundPaint(comp[c.input === "disabled" ? "color/text-field/text/disabled" : "color/text-field/text/placeholder"])];
      ph.visible = c.chars === "placeholder"; input.appendChild(ph);
      ph.textAutoResize = "HEIGHT"; ph.layoutPositioning = "AUTO"; ph.layoutSizingHorizontal = "FILL"; ph.layoutSizingVertical = "HUG";
      var val = figma.createText(); val.name = "value-text"; val.fontName = { family: BRAND.bodyFont, style: "Regular" };
      val.characters = "user@example.com"; if (textStyle) val.textStyleId = textStyle.id;
      val.fills = [boundPaint(comp[c.input === "disabled" ? "color/text-field/text/disabled" : "color/text-field/text/filled"])];
      val.visible = c.chars === "value"; input.appendChild(val);
      val.textAutoResize = "HEIGHT"; val.layoutPositioning = "AUTO"; val.layoutSizingHorizontal = "FILL"; val.layoutSizingVertical = "HUG";
      appendIconInstance(input, "trailing-icon", iconComp, comp["color/text-field/icon/" + c.icon], false);
      var support = figma.createFrame();
      support.name = "support-text"; support.layoutMode = "VERTICAL"; support.primaryAxisSizingMode = "AUTO"; support.counterAxisSizingMode = "AUTO";
      support.itemSpacing = 4; support.fills = []; root.appendChild(support); support.layoutSizingHorizontal = "FILL";
      var helper = figma.createText(); helper.name = "helper"; helper.fontName = { family: BRAND.bodyFont, style: "Regular" };
      helper.characters = "We will use this to contact you about your account."; if (S("caption/md")) helper.textStyleId = S("caption/md").id;
      helper.fills = [boundPaint(comp["color/text-field/helper/default"])]; helper.visible = false; support.appendChild(helper);
      helper.textAutoResize = "HEIGHT"; helper.layoutPositioning = "AUTO"; helper.layoutSizingHorizontal = "FILL"; helper.layoutSizingVertical = "HUG";
      var errT = figma.createText(); errT.name = "error"; errT.fontName = { family: BRAND.bodyFont, style: "Regular" };
      errT.characters = "Enter a valid email address."; if (S("caption/md")) errT.textStyleId = S("caption/md").id;
      errT.fills = [boundPaint(comp["color/text-field/error/default"])]; errT.visible = state === "Error"; support.appendChild(errT);
      errT.textAutoResize = "HEIGHT"; errT.layoutPositioning = "AUTO"; errT.layoutSizingHorizontal = "FILL"; errT.layoutSizingVertical = "HUG";
      if (c.opacity) root.opacity = c.opacity;
      if (state === "Default" && size === "Small") {
        propKeys.label = root.addComponentProperty("Label", "TEXT", "Email address");
        propKeys.placeholder = root.addComponentProperty("Placeholder", "TEXT", "Enter email address");
        propKeys.value = root.addComponentProperty("Value", "TEXT", "user@example.com");
        propKeys.helper = root.addComponentProperty("Helper", "TEXT", "We will use this to contact you about your account.");
        propKeys.errorText = root.addComponentProperty("Error", "TEXT", "Enter a valid email address.");
        propKeys.showLabel = root.addComponentProperty("Show label", "BOOLEAN", true);
        propKeys.showHelper = root.addComponentProperty("Show helper text", "BOOLEAN", false);
        propKeys.showError = root.addComponentProperty("Show error text", "BOOLEAN", false);
        propKeys.required = root.addComponentProperty("Required", "BOOLEAN", false);
        propKeys.showLead = root.addComponentProperty("Show leading icon", "BOOLEAN", false);
        propKeys.showTrail = root.addComponentProperty("Show trailing icon", "BOOLEAN", false);
        propKeys.leadSwap = root.addComponentProperty("Leading icon", "INSTANCE_SWAP", icons[16].id);
        propKeys.trailSwap = root.addComponentProperty("Trailing icon", "INSTANCE_SWAP", icons[16].id);
        label.componentPropertyReferences = { characters: propKeys.label, visible: propKeys.showLabel };
        req.componentPropertyReferences = { visible: propKeys.required };
        helper.componentPropertyReferences = { characters: propKeys.helper };
        errT.componentPropertyReferences = { characters: propKeys.errorText };
        lead.componentPropertyReferences = { visible: propKeys.showLead, mainComponent: propKeys.leadSwap };
        input.findOne(function (n) { return n.name === "trailing-icon"; }).componentPropertyReferences = { visible: propKeys.showTrail, mainComponent: propKeys.trailSwap };
        ph.componentPropertyReferences = { characters: propKeys.placeholder };
        val.componentPropertyReferences = { characters: propKeys.value };
      }
      return root;
    }
    var variants = [];
    ["Default", "Hover", "Focus", "Filled", "Error", "Disabled"].forEach(function (state) {
      ["Small", "Medium"].forEach(function (size) { variants.push(build(state, size)); });
    });
    var cs = figma.combineAsVariants(variants, page);
    cs.name = "Text Field";
    cs.layoutMode = "HORIZONTAL"; cs.layoutWrap = "WRAP"; cs.itemSpacing = 24; cs.counterAxisSpacing = 24;
    cs.paddingTop = 32; cs.paddingBottom = 32; cs.paddingLeft = 32; cs.paddingRight = 32;
    cs.primaryAxisSizingMode = "AUTO"; cs.counterAxisSizingMode = "AUTO"; cs.x = 80; cs.y = 80;
    cs.fills = [{ type: "SOLID", color: { r: 0.96, g: 0.96, b: 0.95 } }]; cs.cornerRadius = 16;
    wireTextFieldSet(cs);
    cs.description = "Text Field — single-line input. States: Default/Hover/Focus/Filled/Error/Disabled. Sizes: Small/Medium. Label, helper, error, required, and icon toggles. Theme via color/text-field/* tokens. Focus: offset ring.";
    return { set: cs };
  });
}

function wireDropdownSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  function parseState(name) { var p = {}; name.split(", ").forEach(function (s) { var kv = s.split("="); p[kv[0]] = kv[1]; }); return p.State; }
  var keys = {
    label: key("Label"), placeholder: key("Placeholder"), value: key("Value"), helper: key("Helper"), errorText: key("Error"),
    showLabel: key("Show label"), showHelper: key("Show helper"), showError: key("Show error text"), required: key("Required"),
    showLead: key("Show leading icon"), leadSwap: key("Leading icon")
  };
  cs.children.forEach(function (ch) {
    var state = parseState(ch.name);
    var label = ch.findOne(function (n) { return n.name === "label"; });
    var req = ch.findOne(function (n) { return n.name === "required"; });
    var helper = ch.findOne(function (n) { return n.name === "helper"; });
    var err = ch.findOne(function (n) { return n.name === "error"; });
    var lead = ch.findOne(function (n) { return n.name === "leading-icon"; });
    var ph = ch.findOne(function (n) { return n.name === "placeholder-text"; });
    var val = ch.findOne(function (n) { return n.name === "value-text"; });
    if (label && keys.label) label.componentPropertyReferences = { characters: keys.label, visible: keys.showLabel };
    if (req && keys.required) req.componentPropertyReferences = { visible: keys.required };
    if (ph && keys.placeholder) ph.componentPropertyReferences = { characters: keys.placeholder };
    if (val && keys.value) val.componentPropertyReferences = { characters: keys.value };
    if (lead && keys.showLead) lead.componentPropertyReferences = { visible: keys.showLead, mainComponent: keys.leadSwap };
    if (helper && keys.helper) {
      helper.componentPropertyReferences = { characters: keys.helper };
      if (state === "Error") helper.visible = false;
      else { helper.componentPropertyReferences.visible = keys.showHelper; helper.visible = false; }
    }
    if (err && keys.errorText) {
      err.componentPropertyReferences = { characters: keys.errorText };
      if (state === "Error") err.visible = true;
      else { err.componentPropertyReferences.visible = keys.showError; err.visible = false; }
    }
  });
}

// Dropdown component builder — full canvas generation: scripts/figma-dropdown.js (live file source of truth after manual edits)
function createDropdown(comp, density, prim) {
  return Promise.resolve({ note: "Use scripts/figma-dropdown.js for live Dropdown / Menu components" });
}

function wireRadioSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var keys = { label: key("Label"), desc: key("Description"), showDesc: key("Show description") };
  cs.children.forEach(function (ch) {
    var label = ch.findOne(function (n) { return n.name === "label"; });
    var desc = ch.findOne(function (n) { return n.name === "description"; });
    if (label && keys.label) label.componentPropertyReferences = { characters: keys.label };
    if (desc && keys.desc) desc.componentPropertyReferences = { characters: keys.desc, visible: keys.showDesc };
  });
}

function createRadioSelector(comp, density, prim) {
  return Promise.resolve({ note: "Use scripts/figma-radio.js for live Radio Selector components" });
}

function wireCheckboxSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var keys = { label: key("Label"), desc: key("Description"), showDesc: key("Show description") };
  cs.children.forEach(function (ch) {
    var label = ch.findOne(function (n) { return n.name === "label"; });
    var desc = ch.findOne(function (n) { return n.name === "description"; });
    if (label && keys.label) label.componentPropertyReferences = { characters: keys.label };
    if (desc && keys.desc) desc.componentPropertyReferences = { characters: keys.desc, visible: keys.showDesc };
  });
}

function createCheckbox(comp, density, prim) {
  return Promise.resolve({ note: "Use scripts/figma-checkbox.js for live Checkbox components" });
}

function wireNotificationButtonSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var k = key("Count");
  cs.children.forEach(function (ch) {
    var cnt = ch.findOne(function (n) { return n.name === "count"; });
    if (cnt && k) cnt.componentPropertyReferences = { characters: k };
  });
}

function createNotificationButton(comp, density, prim) {
  // Specialized icon button built on the Icon Button foundation (reuses color/icon-button/* + structure).
  return Promise.resolve({ note: "Use scripts/figma-notification-button.js for the live Notification Button component" });
}

function wireSnackbarSet(cs) {
  function key(prefix) { return Object.keys(cs.componentPropertyDefinitions).find(function (k) { return k.indexOf(prefix) === 0; }); }
  var keys = { msg: key("Message"), action: key("Action"), showIcon: key("Show icon"), showAction: key("Show action"), showClose: key("Show close") };
  cs.children.forEach(function (ch) {
    var msg = ch.findOne(function (n) { return n.name === "message"; });
    var action = ch.findOne(function (n) { return n.name === "action"; });
    var icon = ch.findOne(function (n) { return n.name === "leading-icon"; });
    var close = ch.findOne(function (n) { return n.name === "close"; });
    if (msg && keys.msg) msg.componentPropertyReferences = { characters: keys.msg };
    if (action && keys.action) action.componentPropertyReferences = { characters: keys.action, visible: keys.showAction };
    if (icon && keys.showIcon) icon.componentPropertyReferences = { visible: keys.showIcon };
    if (close && keys.showClose) close.componentPropertyReferences = { visible: keys.showClose };
  });
}

function createSnackbar(comp, density, prim) {
  return Promise.resolve({ note: "Use scripts/figma-snackbar.js for the live Snackbar component" });
}

// ============================================================
// 10. CARD component (density-bound)
// ============================================================
// CARD STRUCTURE (media + text toggles)
// -------------------------------------
// One flexible component SET — no variant explosion:
//   • Media VARIANT property: None / Image / Icon (mutually exclusive by design).
//   • BOOLEAN props: Show title / Show body / Show footer — auto-layout collapses spacing.
//   • TEXT props: Title / Body. INSTANCE_SWAP prop: Icon (Media=Icon only).
// Layout contract:
//   Card (outer)  -> OWNS background, border, radius, CLIPPING; padding = 0
//     [Image only] image area  -> FILL width, flush to edges (no padding), top radius clipped
//     content      -> normal Density padding/gap; holds:
//       [Icon only] icon area  -> 48x48 inside the padding (not flush)
//       title / body (toggle)  -> collapse cleanly when hidden
//       footer (ghost button)
function createCard(comp, density, buttonResult) {
  var page = figma.createPage(); page.name = "Card";
  var H = BRAND.headerFont, B = BRAND.bodyFont, sem = comp.__sem;
  return Promise.all([
    figma.loadFontAsync({ family: H, style: "SemiBold" }), figma.loadFontAsync({ family: B, style: "Regular" }), figma.loadFontAsync({ family: B, style: "SemiBold" })
  ]).then(function () {
    var styles = figma.getLocalTextStyles(); var S = function (n) { return styles.find(function (s) { return s.name === n; }); };

    // Reusable icon set for Card Media=Icon and Button icon slots (24x24 default for card).
    ensureIconPlaceholderSet(comp);
    var iconComp = comp.__iconBySize[24];

    // Base card: outer (no padding, clips) + padded content with title/body/footer + shared props.
    function buildBase(name) {
      var card = figma.createComponent(); card.name = name;
      card.layoutMode = "VERTICAL"; card.primaryAxisSizingMode = "AUTO"; card.counterAxisSizingMode = "FIXED"; card.resize(340, 200);
      card.paddingTop = 0; card.paddingBottom = 0; card.paddingLeft = 0; card.paddingRight = 0; card.itemSpacing = 0;
      card.clipsContent = true; // so media bleeds flush but is clipped to the card's rounded corners
      ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { card.setBoundVariable(k, comp.__radius12); });
      card.fills = [boundPaint(comp["color/card/background/default"])];
      card.strokes = [boundPaint(comp["color/card/border/default"])];
      card.setBoundVariable("strokeWeight", comp.__borderSm); card.strokeAlign = "INSIDE";
      // Content container holds the normal Density padding/gap (the outer card has none).
      var content = figma.createFrame(); content.name = "content"; content.layoutMode = "VERTICAL"; content.fills = [];
      content.primaryAxisSizingMode = "AUTO"; content.counterAxisSizingMode = "FIXED";
      card.appendChild(content); content.layoutSizingHorizontal = "FILL";
      ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight"].forEach(function (p) { content.setBoundVariable(p, density["density/card/padding"]); });
      content.setBoundVariable("itemSpacing", density["density/card/gap"]);
      var title = figma.createText(); title.name = "title"; title.fontName = { family: H, style: "SemiBold" }; title.characters = "Card title";
      if (S("heading/sm")) title.textStyleId = S("heading/sm").id;
      title.fills = [boundPaint(comp["color/card/title"])]; content.appendChild(title); title.layoutSizingHorizontal = "FILL";
      var body = figma.createText(); body.name = "body"; body.fontName = { family: B, style: "Regular" }; body.characters = "Use this card to group related content and actions.";
      if (S("body/md")) body.textStyleId = S("body/md").id;
      body.fills = [boundPaint(comp["color/card/body"])]; content.appendChild(body); body.layoutSizingHorizontal = "FILL"; body.textAutoResize = "HEIGHT";
      var footer = figma.createFrame(); footer.name = "footer"; footer.layoutMode = "HORIZONTAL"; footer.fills = [];
      footer.primaryAxisSizingMode = "FIXED"; footer.counterAxisSizingMode = "AUTO"; footer.setBoundVariable("itemSpacing", density["density/button/gap"]);
      content.appendChild(footer); footer.layoutSizingHorizontal = "FILL";
      var ghostMed = buttonResult.set.children.find(function (c) { return c.name === "Type=Ghost, Size=Medium, State=Default"; });
      if (ghostMed) { var inst = ghostMed.createInstance(); inst.name = "footer-button"; footer.appendChild(inst); inst.layoutSizingHorizontal = "HUG"; try { var pp = {}; pp[buttonResult.labelKey] = "Learn more"; inst.setProperties(pp); } catch (e) {} }
      // Shared component properties (merge by name when combined into the set).
      var titleKey = card.addComponentProperty("Title", "TEXT", "Card title");
      var bodyKey = card.addComponentProperty("Body", "TEXT", "Use this card to group related content and actions.");
      var showTitle = card.addComponentProperty("Show title", "BOOLEAN", true); // toggles title.visible -> spacing collapses
      var showBody = card.addComponentProperty("Show body", "BOOLEAN", true);   // toggles body.visible -> spacing collapses
      var footerKey = card.addComponentProperty("Show footer", "BOOLEAN", true);
      title.componentPropertyReferences = { characters: titleKey, visible: showTitle };
      body.componentPropertyReferences = { characters: bodyKey, visible: showBody };
      footer.componentPropertyReferences = { visible: footerKey };
      return { card: card, content: content };
    }

    // Media = None
    var none = buildBase("Media=None");

    // Media = Image — flush image area above the content (no top/side padding; clipped to top radius).
    var imageB = buildBase("Media=Image");
    var img = figma.createFrame(); img.name = "image"; imageB.card.insertChild(0, img);
    img.fills = [boundPaint(sem["color/surface/subtle"])];
    img.layoutSizingHorizontal = "FILL"; img.layoutSizingVertical = "FIXED"; img.resize(img.width, 160);
    img.setBoundVariable("topLeftRadius", comp.__radius12); img.setBoundVariable("topRightRadius", comp.__radius12);
    img.bottomLeftRadius = 0; img.bottomRightRadius = 0;

    // Media = Icon — 48x48 container INSIDE the content padding (not flush to the edge).
    var iconB = buildBase("Media=Icon");
    var iconArea = figma.createFrame(); iconArea.name = "icon"; iconB.content.insertChild(0, iconArea);
    iconArea.layoutSizingHorizontal = "FIXED"; iconArea.layoutSizingVertical = "FIXED"; iconArea.resize(48, 48);
    iconArea.fills = [boundPaint(sem["color/action/primary/subtle"])];
    ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"].forEach(function (k) { iconArea.setBoundVariable(k, comp.__radius12); });
    var iconInst = iconComp.createInstance(); iconArea.appendChild(iconInst); iconInst.x = 12; iconInst.y = 12;
    var iconKey = iconB.card.addComponentProperty("Icon", "INSTANCE_SWAP", iconComp.id);
    iconInst.componentPropertyReferences = { mainComponent: iconKey };

    // Combine the three into ONE flexible Card set with a Media variant property.
    var set = figma.combineAsVariants([none.card, imageB.card, iconB.card], page);
    set.name = "Card";
    set.layoutMode = "HORIZONTAL"; set.itemSpacing = 40; set.counterAxisAlignItems = "MIN";
    set.paddingTop = 40; set.paddingBottom = 40; set.paddingLeft = 40; set.paddingRight = 40;
    set.primaryAxisSizingMode = "AUTO"; set.counterAxisSizingMode = "AUTO"; set.x = 80; set.y = 80;
    set.description = "Card — flexible content container. Media: None/Image/Icon + Show title/body/footer toggles. Outer owns bg/border/radius/clip; padded content holds icon, text & footer. Colors -> color/card/* & semantics (theme-aware); spacing -> Density.";
    return set;
  });
}

// ============================================================
// 10b. EFFECT STYLES — shadow / elevation (Figma application layer)
// ============================================================
function createEffectStyles() {
  var INK = { r: 35 / 255, g: 31 / 255, b: 32 / 255 };
  function ds(y, blur, a) {
    return { type: "DROP_SHADOW", color: { r: INK.r, g: INK.g, b: INK.b, a: a }, offset: { x: 0, y: y }, radius: blur, spread: 0, visible: true, blendMode: "NORMAL" };
  }
  var SHADOWS = {
    none: [], 50: [ds(1, 2, 0.06)],
    100: [ds(1, 3, 0.08), ds(1, 2, 0.04)], 200: [ds(4, 8, 0.08), ds(2, 4, 0.04)],
    300: [ds(8, 16, 0.1), ds(4, 8, 0.06)], 400: [ds(16, 32, 0.12), ds(8, 16, 0.08)],
    500: [ds(24, 48, 0.14), ds(12, 24, 0.1)], 600: [ds(32, 64, 0.18), ds(16, 32, 0.12)]
  };
  var semantic = { "Elevation / None": "none", "Elevation / Surface": 50, "Elevation / Raised": 100, "Elevation / Floating": 200, "Elevation / Popover": 300, "Elevation / Modal": 400, "Elevation / Overlay": 500 };
  var existing = figma.getLocalEffectStyles();
  function upsert(name, effects) {
    var s = existing.find(function (e) { return e.name === name; }) || figma.createEffectStyle();
    s.name = name; s.effects = effects;
  }
  Object.keys(SHADOWS).forEach(function (k) { upsert("Shadow / " + k, SHADOWS[k]); });
  Object.keys(semantic).forEach(function (name) { upsert(name, SHADOWS[semantic[name]]); });
}

// ============================================================
// 11. RUN
// ============================================================
function main() {
  var prim = createPrimitives();
  var semR = createSemantics(prim);
  var comp = createComponentTokens(semR.vars, prim);
  comp.__radius4 = prim["radius/4"]; comp.__radius8 = prim["radius/8"]; comp.__radius12 = prim["radius/12"]; comp.__radiusFull = prim["radius/full"];
  comp.__borderSm = prim["border/width/sm"]; comp.__borderMd = prim["border/width/md"];
  comp.__sem = semR.vars; // semantic vars the Card needs directly (surface/subtle, action/primary/subtle, text/action)
  var density = createDensity();
  createLayout();
  return createTextStyles()
    .then(function () { createEffectStyles(); })
    .then(function () { return createButton(comp, density, prim); })
    .then(function (buttonResult) { return createTextButton(comp, prim).then(function () { return buttonResult; }); })
    .then(function (buttonResult) { return createIconButton(comp, density, prim).then(function () { return buttonResult; }); })
    .then(function (buttonResult) { return createTextField(comp, density, prim).then(function () { return buttonResult; }); })
    .then(function (buttonResult) { return createCard(comp, density, buttonResult); })
    .then(function () { figma.closePlugin("Fukurou Design System (v3) generated."); })
    .catch(function (err) { figma.closePlugin("Error: " + (err && err.message ? err.message : String(err))); });
}

main();
