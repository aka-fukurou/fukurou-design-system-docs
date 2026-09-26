/**
 * audit-wcag.ts — Fukurou Design System WCAG 2.2 AA contrast audit
 * ------------------------------------------------------------------
 * Reads resolved token colors (scripts/tokens.json — exported from the live
 * Figma file Fukurou Design System, key FNLHeDQrr7JKBj81Qg7L7a) with all
 * theme mode), computes WCAG relative-luminance contrast ratios for the key
 * color pairs, prints pass/fail, and writes scripts/audit-results.json.
 *
 * Run:  npx tsx scripts/audit-wcag.ts      (or: npx ts-node scripts/audit-wcag.ts)
 * Node fallback (no TS runner): rename logic into a .mjs, or `npx tsx` which
 * needs no config. Output is also written to scripts/audit-results.json.
 *
 * Thresholds (WCAG 2.2):
 *   normal text   1.4.3  >= 4.5:1
 *   large text    1.4.3  >= 3:1   (>=18.66px, or >=14pt/18.66px bold)
 *   non-text UI   1.4.11 >= 3:1   (component boundaries, focus indicators)
 * Disabled/inactive controls are EXEMPT from 1.4.3 (reported for awareness).
 */

import * as fs from "fs";
import * as path from "path";

type Mode = "light" | "dark";
type Kind = "normal" | "large" | "nontext";

interface TokenVal { light: string; lightA: number; dark: string; darkA: number; }
interface Tokens { tokens: Record<string, TokenVal>; }

const data: Tokens = JSON.parse(fs.readFileSync(path.join(__dirname, "tokens.json"), "utf8"));
const T = data.tokens;

// ---- color math ----
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function srgbToLin(c8: number): number {
  const c = c8 / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
}
// composite a (possibly translucent) foreground hex over an opaque backdrop hex
function over(fg: string, fgA: number, bg: string): string {
  if (fgA >= 1) return fg;
  const [fr, fgc, fb] = hexToRgb(fg), [br, bgc, bb] = hexToRgb(bg);
  const mix = (f: number, b: number) => Math.round(f * fgA + b * (1 - fgA));
  const h = (n: number) => ("0" + n.toString(16)).slice(-2);
  return "#" + h(mix(fr, br)) + h(mix(fgc, bgc)) + h(mix(fb, bb));
}
function contrast(fgHex: string, bgHex: string): number {
  const L1 = luminance(fgHex), L2 = luminance(bgHex);
  const [hi, lo] = L1 >= L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}
const threshold = (k: Kind) => (k === "normal" ? 4.5 : 3.0);

// ---- pair definitions: [foreground token, background token, kind, opts] ----
interface Opts { disabled?: boolean; decorative?: boolean; note?: string; }
const PAIRS: Array<[string, string, Kind, Opts?]> = [
  // Button: Action
  ["color/button/action/text/default", "color/button/action/background/default", "normal"],
  ["color/button/action/text/default", "color/button/action/background/hover", "normal"],
  ["color/button/action/text/default", "color/button/action/background/pressed", "normal"],
  ["color/button/action/text/disabled", "color/button/action/background/disabled", "normal", { disabled: true }],
  // Button: Secondary
  ["color/button/secondary/text/default", "color/button/secondary/background/default", "normal"],
  ["color/button/secondary/text/default", "color/button/secondary/background/hover", "normal"],
  ["color/button/secondary/text/default", "color/button/secondary/background/pressed", "normal"],
  ["color/button/secondary/text/disabled", "color/button/secondary/background/disabled", "normal", { disabled: true }],
  // Button: Ghost (transparent bg -> evaluated against the visible surface behind it)
  ["color/button/ghost/text/default", "color/surface/page", "normal", { note: "ghost on page" }],
  ["color/button/ghost/text/default", "color/surface/card", "normal", { note: "ghost on card" }],
  ["color/button/ghost/text/default", "color/button/ghost/background/hover", "normal", { note: "ghost hover" }],
  ["color/button/ghost/text/default", "color/button/ghost/background/pressed", "normal", { note: "ghost pressed" }],
  ["color/button/ghost/border/default", "color/surface/page", "nontext", { note: "ghost stroke vs page" }],
  ["color/button/ghost/border/default", "color/surface/card", "nontext", { note: "ghost stroke vs card" }],
  ["color/button/ghost/text/disabled", "color/surface/page", "normal", { disabled: true, note: "ghost disabled on page" }],
  // Text Button (separate component — evaluated against visible surface / state backgrounds)
  ["color/text-button/text/default", "color/surface/page", "normal", { note: "text button on page" }],
  ["color/text-button/text/default", "color/surface/card", "normal", { note: "text button on card" }],
  ["color/text-button/text/default", "color/text-button/background/hover", "normal", { note: "text button hover bg (skipped if transparent — see audit script)" }],
  ["color/text-button/text/disabled", "color/surface/page", "normal", { disabled: true, note: "text button disabled" }],
  ["color/text-button/border/focus", "color/surface/page", "nontext", { note: "text button focus vs page" }],
  // Card
  ["color/card/title", "color/card/background/default", "normal"],
  ["color/card/body", "color/card/background/default", "normal"],
  ["color/card/border/default", "color/card/background/default", "nontext"],
  // Global semantic
  ["color/text/default", "color/surface/page", "normal"],
  ["color/text/subtle", "color/surface/page", "normal"],
  ["color/text/default", "color/surface/card", "normal"],
  ["color/text/subtle", "color/surface/card", "normal"],
  ["color/border/default", "color/surface/page", "nontext"],
  ["color/border/focus", "color/surface/page", "nontext", { note: "focus indicator vs page" }],
  ["color/border/focus", "color/surface/card", "nontext", { note: "focus indicator vs card" }],
  ["color/button/focus/ring", "color/button/focus/gap", "nontext", { note: "focus ring vs surface gap (Button offset treatment)" }],
  ["color/button/focus/ring", "color/surface/page", "nontext", { note: "focus ring vs page (outer edge)" }],
  // Text Field
  ["color/text-field/label/default", "color/surface/page", "normal", { note: "text field label on page" }],
  ["color/text-field/text/filled", "color/text-field/background/default", "normal"],
  ["color/text-field/text/placeholder", "color/text-field/background/default", "normal"],
  ["color/text-field/helper/default", "color/surface/page", "normal", { note: "helper on page" }],
  ["color/text-field/error/default", "color/surface/page", "normal", { note: "error message on page" }],
  ["color/text-field/border/default", "color/text-field/background/default", "nontext"],
  ["color/text-field/border/hover", "color/text-field/background/default", "nontext"],
  ["color/text-field/border/focus", "color/text-field/background/default", "nontext"],
  ["color/text-field/border/error", "color/text-field/background/default", "nontext"],
  ["color/text-field/focus/ring", "color/text-field/focus/gap", "nontext", { note: "text field focus ring vs gap" }],
  ["color/text-field/focus/ring", "color/surface/page", "nontext", { note: "text field focus ring vs page" }],
  ["color/text-field/text/disabled", "color/text-field/background/disabled", "normal", { disabled: true }],
  ["color/text-field/label/disabled", "color/surface/page", "normal", { disabled: true, note: "disabled label on page" }],
  // Search Field
  ["color/search-field/label/default", "color/surface/page", "normal", { note: "search field label on page" }],
  ["color/search-field/text/value", "color/search-field/background/default", "normal"],
  ["color/search-field/text/placeholder", "color/search-field/background/default", "normal"],
  ["color/search-field/helper/default", "color/surface/page", "normal", { note: "search field helper on page" }],
  ["color/search-field/error/default", "color/surface/page", "normal", { note: "search field error on page" }],
  ["color/search-field/border/default", "color/search-field/background/default", "nontext"],
  ["color/search-field/border/hover", "color/search-field/background/default", "nontext"],
  ["color/search-field/border/focus", "color/search-field/background/default", "nontext"],
  ["color/search-field/border/error", "color/search-field/background/default", "nontext"],
  ["color/search-field/focus/ring", "color/search-field/focus/gap", "nontext", { note: "search field focus ring vs gap" }],
  ["color/search-field/focus/ring", "color/surface/page", "nontext", { note: "search field focus ring vs page" }],
  ["color/search-field/text/disabled", "color/search-field/background/disabled", "normal", { disabled: true }],
  ["color/search-field/label/disabled", "color/surface/page", "normal", { disabled: true, note: "disabled search label on page" }],
  ["color/search-field/icon/default", "color/search-field/background/default", "nontext", { note: "search icon vs input bg" }],
  ["color/search-field/clear-icon/default", "color/search-field/background/default", "nontext", { note: "clear icon vs input bg" }],
  // Date Picker
  ["color/date-picker/label/default", "color/surface/page", "normal", { note: "date picker label on page" }],
  ["color/date-picker/text/value", "color/date-picker/background/default", "normal"],
  ["color/date-picker/text/placeholder", "color/date-picker/background/default", "normal"],
  ["color/date-picker/helper/default", "color/surface/page", "normal", { note: "date picker helper on page" }],
  ["color/date-picker/error/default", "color/surface/page", "normal", { note: "date picker error on page" }],
  ["color/date-picker/label/error", "color/surface/page", "normal", { note: "date picker error label on page" }],
  ["color/date-picker/border/default", "color/date-picker/background/default", "nontext"],
  ["color/date-picker/border/hover", "color/date-picker/background/default", "nontext"],
  ["color/date-picker/border/active", "color/date-picker/background/default", "nontext"],
  ["color/date-picker/border/focus-visible", "color/date-picker/background/default", "nontext"],
  ["color/date-picker/border/error", "color/date-picker/background/default", "nontext"],
  ["color/date-picker/focus/ring", "color/date-picker/focus/gap", "nontext", { note: "date picker focus ring vs gap" }],
  ["color/date-picker/focus/ring", "color/surface/page", "nontext", { note: "date picker focus ring vs page" }],
  ["color/date-picker/icon/default", "color/date-picker/background/default", "nontext", { note: "calendar icon vs input bg" }],
  ["color/date-picker/icon/active", "color/date-picker/background/active", "nontext"],
  ["color/date-picker/text/disabled", "color/date-picker/background/disabled", "normal", { disabled: true }],
  ["color/date-picker/label/disabled", "color/surface/page", "normal", { disabled: true, note: "disabled date picker label" }],
  ["color/date-picker/icon/disabled", "color/date-picker/background/disabled", "nontext", { disabled: true }],
  // Calendar popover
  ["color/calendar/header/text/default", "color/calendar/background/default", "normal"],
  ["color/calendar/week/text/default", "color/calendar/background/default", "normal"],
  ["color/calendar/day/text/default", "color/calendar/day/background/default", "normal"],
  ["color/calendar/day/text/outside", "color/calendar/day/background/default", "normal"],
  ["color/calendar/day/text/selected", "color/calendar/day/background/selected", "normal"],
  ["color/calendar/day/text/today", "color/calendar/day/background/today", "normal"],
  ["color/calendar/day/text/disabled", "color/calendar/day/background/disabled", "normal", { disabled: true }],
  ["color/calendar/border/default", "color/calendar/background/default", "nontext"],
  ["color/calendar/day/border/today", "color/calendar/day/background/today", "nontext", { note: "today indicator border" }],
  ["color/calendar/day/background/selected", "color/calendar/background/default", "nontext", { note: "selected day fill vs calendar surface" }],
  ["color/calendar/day/focus/ring", "color/calendar/day/focus/gap", "nontext", { note: "day focus ring vs gap" }],
  ["color/calendar/day/focus/ring", "color/calendar/background/default", "nontext", { note: "day focus ring vs calendar bg" }],
  ["color/calendar/nav/icon/default", "color/calendar/background/default", "nontext"],
  ["color/calendar/nav/icon/hover", "color/calendar/background/default", "nontext"],
  ["color/calendar/nav/icon/disabled", "color/calendar/background/default", "nontext", { disabled: true }],
  // Jumbo Select Button
  ["color/jumbo-select-button/label/default", "color/jumbo-select-button/background/default", "normal"],
  ["color/jumbo-select-button/label/default", "color/jumbo-select-button/background/hover", "normal", { note: "jumbo label on hover bg" }],
  ["color/jumbo-select-button/label/default", "color/jumbo-select-button/background/pressed", "normal", { note: "jumbo label on pressed bg" }],
  ["color/jumbo-select-button/label/selected", "color/jumbo-select-button/background/selected", "normal"],
  ["color/jumbo-select-button/sub-label/default", "color/jumbo-select-button/background/default", "normal"],
  ["color/jumbo-select-button/sub-label/selected", "color/jumbo-select-button/background/selected", "normal"],
  ["color/jumbo-select-button/border/default", "color/jumbo-select-button/background/default", "nontext"],
  ["color/jumbo-select-button/border/hover", "color/jumbo-select-button/background/hover", "nontext"],
  ["color/jumbo-select-button/border/pressed", "color/jumbo-select-button/background/pressed", "nontext"],
  ["color/jumbo-select-button/border/selected", "color/jumbo-select-button/background/selected", "nontext"],
  ["color/jumbo-select-button/border/selected", "color/surface/page", "nontext", { note: "selected border vs page" }],
  ["color/jumbo-select-button/icon/default", "color/jumbo-select-button/background/default", "nontext"],
  ["color/jumbo-select-button/icon/selected", "color/jumbo-select-button/background/selected", "nontext"],
  ["color/jumbo-select-button/indicator/icon", "color/jumbo-select-button/indicator/background", "nontext", { note: "check vs indicator circle" }],
  ["color/jumbo-select-button/indicator/background", "color/jumbo-select-button/background/selected", "nontext", { note: "indicator vs selected bg" }],
  ["color/jumbo-select-button/focus/ring", "color/jumbo-select-button/focus/gap", "nontext", { note: "jumbo focus ring vs gap" }],
  ["color/jumbo-select-button/focus/ring", "color/surface/page", "nontext", { note: "jumbo focus ring vs page" }],
  ["color/jumbo-select-button/label/disabled", "color/jumbo-select-button/background/disabled", "normal", { disabled: true }],
  ["color/jumbo-select-button/sub-label/disabled", "color/jumbo-select-button/background/disabled", "normal", { disabled: true }],
  ["color/jumbo-select-button/border/disabled", "color/jumbo-select-button/background/disabled", "nontext", { disabled: true }],
  // Dropdown
  ["color/dropdown/label/default", "color/surface/page", "normal", { note: "dropdown label on page" }],
  ["color/dropdown/text/value", "color/dropdown/background/default", "normal"],
  ["color/dropdown/text/placeholder", "color/dropdown/background/default", "normal"],
  ["color/dropdown/helper/default", "color/surface/page", "normal", { note: "dropdown helper on page" }],
  ["color/dropdown/error/default", "color/surface/page", "normal", { note: "dropdown error on page" }],
  ["color/dropdown/border/default", "color/dropdown/background/default", "nontext"],
  ["color/dropdown/border/hover", "color/dropdown/background/default", "nontext"],
  ["color/dropdown/border/focus", "color/dropdown/background/default", "nontext"],
  ["color/dropdown/border/error", "color/dropdown/background/default", "nontext"],
  ["color/dropdown/focus/ring", "color/dropdown/focus/gap", "nontext", { note: "dropdown focus ring vs gap" }],
  ["color/dropdown/focus/ring", "color/surface/page", "nontext", { note: "dropdown focus ring vs page" }],
  ["color/dropdown/text/disabled", "color/dropdown/background/disabled", "normal", { disabled: true }],
  ["color/dropdown-menu/option/text/default", "color/dropdown-menu/option/background/default", "normal"],
  ["color/dropdown-menu/option/text/selected", "color/dropdown-menu/option/background/selected", "normal"],
  ["color/dropdown-menu/option/text/disabled", "color/dropdown-menu/option/background/default", "normal", { disabled: true }],
  ["color/dropdown-menu/border/default", "color/dropdown-menu/background/default", "nontext"],
  // Radio Selector
  ["color/radio/label/default", "color/surface/page", "normal", { note: "radio label on page" }],
  ["color/radio/description/default", "color/surface/page", "normal", { note: "radio description on page" }],
  ["color/radio/border/default", "color/radio/background/default", "nontext"],
  ["color/radio/border/hover", "color/radio/background/hover", "nontext"],
  ["color/radio/border/selected", "color/radio/background/default", "nontext"],
  ["color/radio/border/focus", "color/radio/background/default", "nontext"],
  ["color/radio/border/error", "color/radio/background/error", "nontext"],
  ["color/radio/dot/selected", "color/radio/background/default", "nontext", { note: "selected dot vs radio bg" }],
  ["color/radio/focus/ring", "color/radio/focus/gap", "nontext", { note: "radio focus ring vs gap" }],
  ["color/radio/focus/ring", "color/surface/page", "nontext", { note: "radio focus ring vs page" }],
  ["color/radio/label/disabled", "color/surface/page", "normal", { disabled: true, note: "disabled radio label" }],
  ["color/radio/description/disabled", "color/surface/page", "normal", { disabled: true, note: "disabled radio description" }],
  // Checkbox
  ["color/checkbox/label/default", "color/surface/page", "normal", { note: "checkbox label on page" }],
  ["color/checkbox/description/default", "color/surface/page", "normal", { note: "checkbox description on page" }],
  ["color/checkbox/label/error", "color/surface/page", "normal", { note: "checkbox error label on page" }],
  ["color/checkbox/border/default", "color/checkbox/background/default", "nontext"],
  ["color/checkbox/border/hover", "color/checkbox/background/hover", "nontext"],
  ["color/checkbox/border/checked", "color/checkbox/background/default", "nontext"],
  ["color/checkbox/border/focus", "color/checkbox/background/default", "nontext"],
  ["color/checkbox/border/error", "color/checkbox/background/error", "nontext"],
  ["color/checkbox/mark/checked", "color/checkbox/background/checked", "nontext", { note: "checkmark vs filled box" }],
  ["color/checkbox/mark/indeterminate", "color/checkbox/background/indeterminate", "nontext", { note: "indeterminate mark vs filled box" }],
  ["color/checkbox/focus/ring", "color/checkbox/focus/gap", "nontext", { note: "checkbox focus ring vs gap" }],
  ["color/checkbox/focus/ring", "color/surface/page", "nontext", { note: "checkbox focus ring vs page" }],
  ["color/checkbox/label/disabled", "color/surface/page", "normal", { disabled: true, note: "disabled checkbox label" }],
  ["color/checkbox/description/disabled", "color/surface/page", "normal", { disabled: true, note: "disabled checkbox description" }],
  ["color/checkbox/mark/disabled", "color/checkbox/background/disabled", "nontext", { disabled: true, note: "disabled checkbox mark" }],
  // Snackbar (fixed dark container both themes)
  ["color/snackbar/text/neutral", "color/snackbar/background/neutral", "normal", { note: "snackbar message on container" }],
  ["color/snackbar/action/text/default", "color/snackbar/background/neutral", "normal", { note: "snackbar action default" }],
  ["color/snackbar/action/text/hover", "color/snackbar/background/neutral", "normal", { note: "snackbar action hover" }],
  ["color/snackbar/action/text/pressed", "color/snackbar/background/neutral", "normal", { note: "snackbar action pressed" }],
  ["color/snackbar/close/icon/default", "color/snackbar/background/neutral", "nontext", { note: "snackbar dismiss icon" }],
  ["color/snackbar/close/icon/hover", "color/snackbar/background/neutral", "nontext", { note: "snackbar dismiss icon hover" }],
  ["color/snackbar/icon/neutral", "color/snackbar/background/neutral", "nontext", { note: "snackbar neutral icon" }],
  ["color/snackbar/icon/success", "color/snackbar/background/success", "nontext", { note: "snackbar success icon" }],
  ["color/snackbar/icon/warning", "color/snackbar/background/warning", "nontext", { note: "snackbar warning icon" }],
  ["color/snackbar/icon/danger", "color/snackbar/background/danger", "nontext", { note: "snackbar danger icon" }],
  ["color/snackbar/icon/info", "color/snackbar/background/info", "nontext", { note: "snackbar info icon" }],
  ["color/snackbar/border/success", "color/snackbar/background/success", "nontext", { note: "snackbar success accent border" }],
  ["color/snackbar/border/warning", "color/snackbar/background/warning", "nontext", { note: "snackbar warning accent border" }],
  ["color/snackbar/border/danger", "color/snackbar/background/danger", "nontext", { note: "snackbar danger accent border" }],
  ["color/snackbar/border/info", "color/snackbar/background/info", "nontext", { note: "snackbar info accent border" }],
  // Notification Button badge
  ["color/notification-button/badge/text", "color/notification-button/badge/background", "normal", { note: "badge count text on badge" }],
  ["color/notification-button/badge/background", "color/surface/page", "nontext", { note: "badge vs page" }],
  ["color/notification-button/dot/background", "color/surface/page", "nontext", { note: "dot vs page" }],
  // Alert / Banner
  ["color/alert/title/neutral", "color/alert/background/neutral", "normal", { note: "alert neutral title" }],
  ["color/alert/message/neutral", "color/alert/background/neutral", "normal", { note: "alert neutral message" }],
  ["color/alert/title/info", "color/alert/background/info", "normal", { note: "alert info title" }],
  ["color/alert/title/success", "color/alert/background/success", "normal", { note: "alert success title" }],
  ["color/alert/title/warning", "color/alert/background/warning", "normal", { note: "alert warning title" }],
  ["color/alert/title/danger", "color/alert/background/danger", "normal", { note: "alert danger title" }],
  ["color/alert/icon/danger", "color/alert/background/danger", "nontext", { note: "alert danger icon" }],
  ["color/alert/border/warning", "color/alert/background/warning", "nontext", { note: "alert warning border" }],
  ["color/alert/action/text/default", "color/alert/background/neutral", "normal", { note: "alert action link" }],
  ["color/alert/close/icon/default", "color/alert/background/neutral", "nontext", { note: "alert close icon" }],
  // Tooltip
  ["color/tooltip/text/default", "color/tooltip/background/default", "normal", { note: "tooltip text on surface" }],
  ["color/tooltip/arrow/default", "color/tooltip/background/default", "nontext", { decorative: true, note: "tooltip arrow (same surface — non-semantic)" }],
  // Progress Bar
  ["color/progress-bar/label/default", "color/surface/page", "normal", { note: "progress bar step label on page" }],
  ["color/progress-bar/label/default", "color/surface/card", "normal", { note: "progress bar step label on card" }],
  ["color/progress-bar/value/default", "color/surface/page", "normal", { note: "progress bar percentage on page" }],
  ["color/progress-bar/value/default", "color/surface/card", "normal", { note: "progress bar percentage on card" }],
  ["color/progress-bar/fill/background/default", "color/progress-bar/track/background/default", "nontext", { note: "progress fill vs track" }],
  ["color/progress-bar/fill/background/complete", "color/progress-bar/track/background/default", "nontext", { note: "progress fill complete vs track" }],
  ["color/progress-bar/track/background/default", "color/surface/page", "nontext", { decorative: true, note: "progress track vs page (subtle container; fill + labels convey progress)" }],
  ["color/progress-bar/track/background/default", "color/surface/card", "nontext", { decorative: true, note: "progress track vs card (subtle container; fill + labels convey progress)" }],
  // Modal / Dialog
  ["color/modal/title/default", "color/modal/background/default", "normal", { note: "modal title" }],
  ["color/modal/body/default", "color/modal/background/default", "normal", { note: "modal body" }],
  ["color/modal/border/default", "color/modal/background/default", "nontext", { note: "modal border" }],
  ["color/modal/overlay/background", "color/surface/page", "nontext", { note: "modal overlay vs page (product scrim)" }],
  // Toggle / Switch
  ["color/switch/label/default", "color/surface/page", "normal", { note: "switch label on page" }],
  ["color/switch/description/default", "color/surface/page", "normal", { note: "switch description on page" }],
  ["color/switch/thumb/default", "color/switch/track/off/default", "nontext", { note: "switch thumb off track" }],
  ["color/switch/thumb/on", "color/switch/track/on/default", "nontext", { note: "switch thumb on track" }],
  ["color/switch/focus/ring", "color/switch/focus/gap", "nontext", { note: "switch focus ring vs gap" }],
  ["color/switch/focus/ring", "color/surface/page", "nontext", { note: "switch focus ring vs page" }],
  ["color/switch/label/disabled", "color/surface/page", "normal", { disabled: true, note: "disabled switch label" }],
  ["color/switch/thumb/disabled", "color/switch/track/disabled", "nontext", { disabled: true, note: "disabled switch thumb" }],
  // Pagination
  ["color/pagination/item/text/default", "color/pagination/item/background/default", "normal", { note: "pagination page item default" }],
  ["color/pagination/item/text/hover", "color/pagination/item/background/hover", "normal", { note: "pagination page item hover" }],
  ["color/pagination/item/text/active", "color/pagination/item/background/active", "normal", { note: "pagination active page (primary fill)" }],
  ["color/pagination/item/text/disabled", "color/pagination/item/background/disabled", "normal", { disabled: true, note: "disabled page item" }],
  ["color/pagination/control/icon/default", "color/surface/page", "normal", { note: "pagination prev/next icon on page" }],
  ["color/pagination/control/icon/disabled", "color/surface/page", "normal", { disabled: true, note: "disabled pagination prev/next icon" }],
  ["color/pagination/control/text/default", "color/surface/page", "normal", { note: "pagination previous/next on page" }],
  ["color/pagination/control/text/disabled", "color/surface/page", "normal", { disabled: true, note: "disabled previous/next" }],
  ["color/pagination/ellipsis/text/default", "color/surface/page", "normal", { note: "pagination ellipsis" }],
  ["color/pagination/item/border/default", "color/pagination/item/background/default", "nontext", { note: "pagination item border (decorative)" }],
  ["color/pagination/item/border/active", "color/pagination/item/background/active", "nontext", { decorative: true, note: "pagination active border (fill-identified)" }],
  ["color/pagination/focus/ring", "color/pagination/focus/gap", "nontext", { note: "pagination focus ring vs gap" }],
  ["color/pagination/focus/ring", "color/surface/page", "nontext", { note: "pagination focus ring vs page" }],
  // Icon Button (global hover/pressed/focus; page default audited via pagination/control/icon)
  ["color/icon-button/content/hover", "color/icon-button/background/hover", "normal", { note: "icon button hover icon on hover fill" }],
  ["color/icon-button/content/pressed", "color/icon-button/background/pressed", "normal", { note: "icon button pressed icon on pressed fill" }],
  ["color/icon-button/focus/ring", "color/icon-button/focus/gap", "nontext", { note: "icon button focus ring vs gap" }],
  ["color/icon-button/focus/ring", "color/surface/page", "nontext", { note: "icon button focus ring vs page" }],
  // Status — subtle (text) + filled surface (filled/text + filled/icon)
  ["color/status/danger/text", "color/status/danger/subtle", "normal", { note: "status danger text on subtle" }],
  ["color/status/danger/filled/text", "color/status/danger/surface", "normal", { note: "status danger filled text on surface" }],
  ["color/status/danger/filled/icon", "color/status/danger/surface", "normal", { note: "status danger filled icon on surface" }],
  ["color/status/info/text", "color/status/info/subtle", "normal", { note: "status info text on subtle" }],
  ["color/status/info/filled/text", "color/status/info/surface", "normal", { note: "status info filled text on surface" }],
  ["color/status/info/filled/icon", "color/status/info/surface", "normal", { note: "status info filled icon on surface" }],
  ["color/status/success/text", "color/status/success/subtle", "normal", { note: "status success text on subtle" }],
  ["color/status/success/filled/text", "color/status/success/surface", "normal", { note: "status success filled text on surface" }],
  ["color/status/success/filled/icon", "color/status/success/surface", "normal", { note: "status success filled icon on surface" }],
  ["color/status/warning/text", "color/status/warning/subtle", "normal", { note: "status warning text on subtle" }],
  ["color/status/warning/filled/text", "color/status/warning/surface", "normal", { note: "status warning filled text on surface" }],
  ["color/status/warning/filled/icon", "color/status/warning/surface", "normal", { note: "status warning filled icon on surface" }],
  ["color/status/neutral/text", "color/status/neutral/subtle", "normal", { note: "status neutral text on subtle" }],
  ["color/status/neutral/text", "color/status/neutral/surface", "normal", { note: "status neutral text on surface" }],
  ["color/status/neutral/text-inverse", "color/status/neutral/surface-inverse", "normal", { note: "status neutral inverse on surface-inverse" }],
];

interface Row { fg: string; bg: string; kind: Kind; mode: Mode; ratio: number; required: number; pass: boolean; disabled: boolean; decorative?: boolean; note?: string; }
const results: Row[] = [];

for (const [fg, bg, kind, opts] of PAIRS) {
  for (const mode of ["light", "dark"] as Mode[]) {
    const fgv = T[fg], bgv = T[bg];
    if (!fgv || !bgv) { console.warn("missing token", fg, bg); continue; }
    const bgHex = mode === "light" ? bgv.light : bgv.dark;
    const bgA = mode === "light" ? bgv.lightA : bgv.darkA;
    if (bgA !== undefined && bgA < 1) continue; // transparent component bg — contrast is against the surface behind it (audited separately)
    const fgRaw = mode === "light" ? fgv.light : fgv.dark;
    const fgA = mode === "light" ? fgv.lightA : fgv.darkA;
    const fgHex = over(fgRaw, fgA, bgHex);
    const ratio = Math.round(contrast(fgHex, bgHex) * 100) / 100;
    const required = threshold(kind);
    results.push({ fg, bg, kind, mode, ratio, required, pass: ratio >= required, disabled: !!(opts && opts.disabled), decorative: !!(opts && opts.decorative), note: opts && opts.note });
  }
}

// ---- print ----
let failN = 0, exemptFail = 0, decorativeN = 0;
console.log("\nFukurou Design System — WCAG 2.2 AA contrast audit\n" + "=".repeat(60));
for (const r of results) {
  const status = r.pass ? "PASS" : (r.disabled ? "FAIL*" : r.decorative ? "DECOR" : "FAIL");
  if (!r.pass) {
    if (r.disabled) exemptFail++;
    else if (r.decorative) decorativeN++;
    else failN++;
  }
  const tag = `${r.kind}(>=${r.required})`.padEnd(14);
  console.log(`${status.padEnd(6)} ${r.ratio.toFixed(2).padStart(6)}:1  ${tag} [${r.mode}] ${r.fg.replace("color/", "")}  ON  ${r.bg.replace("color/", "")}${r.note ? "  (" + r.note + ")" : ""}`);
}
console.log("=".repeat(60));
console.log(`Non-exempt failures: ${failN}   |   Disabled/exempt failures (FAIL*): ${exemptFail}   |   Decorative (non-counted): ${decorativeN}   |   Total pairs: ${results.length}`);

fs.writeFileSync(path.join(__dirname, "audit-results.json"), JSON.stringify({ generatedAt: new Date().toISOString(), thresholds: { normal: 4.5, large: 3, nontext: 3 }, results }, null, 2));
console.log("\nWrote scripts/audit-results.json\n");
