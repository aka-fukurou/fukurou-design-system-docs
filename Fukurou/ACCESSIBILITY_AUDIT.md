# Accessibility Audit — Fukurou Design System

**Standard:** WCAG 2.2 Level AA (where applicable to a Figma token/component library)
**Date:** 2026-07-26 (Date Picker addition; WCAG re-run on `tokens.json`)  
**Export used:** `scripts/tokens.json` — **558** color tokens (*live file has **559** color vars*)
**Source of truth:** the live Figma file **Fukurou Design System** (`FNLHeDQrr7JKBj81Qg7L7a`) in the **`Fukurou/`** folder — variables resolved per theme mode via the Figma API.
**Tooling:** [`scripts/audit-wcag.ts`](./scripts/audit-wcag.ts) → [`scripts/audit-results.json`](./scripts/audit-results.json), data in [`scripts/tokens.json`](./scripts/tokens.json).

---

## Latest audit result (2026-07-26)

| Metric | Value |
|--------|------:|
| Contrast pairs | **474** |
| **Non-exempt failures** | **0** |
| Disabled/exempt (FAIL\*) | **20** |
| Decorative (non-counted) | **8** |
| **Audit data source** | `tokens.json` (**558** tokens) + live Date Picker / Calendar token patch **2026-07-26** |
| **Fixes applied this session** | Date Picker + Calendar pairs added; **0** non-exempt failures |

> **Caveat:** `tokens.json` may lag live by **1** color token. Prefer live Figma resolve when shipping critical values.

**Date Picker (2026-07-26):** Public set + Calendar Popover + internal Day Cell / Nav Button. Audited **66** date-picker/calendar pairs — **0** non-exempt failures. Disabled label/day pairs marked **Exempt / Disabled state**. Selected day uses fill + inverse text (not color alone). Focus rings audited vs gap/page/calendar surface.

**Calendar nav revert (2026-07-27):** A same-day refactor that replaced calendar Previous/Next with public **Icon Button** instances was **reverted**; the internal **`.Base / Calendar / Nav Button`** was restored and `color/calendar/nav/icon/*` re-aliased back to `color/text/subtle|default|disabled`. Re-run: nav icon pairs pass both modes — default **7.63:1** (Light) / **11.74:1** (Dark), hover **16.30:1 / 17.49:1**, disabled **4.80:1 / 6.93:1** (passes; would be Exempt / Disabled state regardless). Active nav icons are **not** marked exempt. Focus variant uses the calendar day focus-ring token (≥3:1 both modes). Product code must label the controls **“Previous month”** / **“Next month”**.

**Live Theme confirmation (2026-07-17):** `color/action/primary/default` → neutral (`#000` / `#fff`). Brand red on `color/action/tertiary/default` (Light) and Progress Bar fill (`brand/primary/500`). Jumbo selected border/indicator → success green `#2f9e60`.

**Progress Bar:** On Navigation page `459:2136` (with Pagination). Fill vs track **pass**. Labels **pass**.

**Jumbo Select Button:** **27** live tokens; selected uses success green. Audit pairs still **pass** against export values for jumbo text/borders where present; treat selected green as intentional design until product review.

**Text Field:** Active ≠ Focus Ring. Disabled = **Exempt / Disabled state**.

**Date Range Picker / Multi-Select:** Not present. Not audited as current components.

**Fixes applied (token aliases only — brand primitives unchanged):**

1. **Pagination** — `color/pagination/control/icon/default` and `control/text/default` → `color/text/action` (`#872836` Light · `#e99faa` Dark). Light prev/next icon now **8.42:1** vs page (was **4.36:1**).
2. **Status filled** — `color/status/{tone}/filled/text|icon` → `color/text/inverse` for danger, info, success, warning.
3. **Snackbar** — manual update to **elevated surface** (`surface/elevated`); token aliases for `action/*` and `close/icon/*` aligned for Light-mode contrast (component uses Ghost Button + Icon Button on canvas).
4. **Modal scrim** — `color/surface/overlay` Dark = white @ **0.5** alpha on `#000000` page (**5.32:1** composite); Light = black @ **0.55** (**4.74:1**).
5. **Supporting fixes** — decorative borders, status neutral subtle Dark, text-button default, switch off-track, snackbar close icon, pagination active border marked decorative in audit.

**Remaining exempt disabled items (20 FAIL\*):** action/secondary/ghost/text-button/pagination/switch/jumbo-select-button/date-picker disabled pairs — documented as **Exempt / Disabled state**; do not count toward non-exempt failures.

**Canvas bindings (2026-06-15):** Verified and fixed in live Figma — **10** prev/next arrow vectors in **`Pagination Desktop`** (Size=Small/Medium) and **`Pagination Mobile`** now bind **`color/pagination/control/icon/default`**. All **18** `Pagination Desktop` instances in **`Pagination Examples`** inherit the binding (**24** arrow vectors checked). Disabled examples still use Icon Button `State=Default` (disabled appearance is not variant-swapped); swap to `State=Disabled` + `icon/disabled` if product examples should mirror disabled tokens.

---

## Executive Summary

The system **passes** WCAG 2.2 AA on all **474 audited non-exempt contrast pairs** (0 failures).

- **Text contrast:** All core text/surface and Button label pairs pass in both modes. The previously failing **Ghost button label in Light mode** (4.36:1 page / 4.17:1 hover) has been **fixed** via the `color/text/action` semantic re-alias and now measures **8.42:1 (page) / 8.06:1 (hover)** in Light and ≥7.2:1 in Dark.
- **Action button label** passes but is **marginal** in Light mode (4.55:1) — keep an eye on it.
- **Focus indicators** meet WCAG 2.4.11 with offset focus-ring treatment on Button. **Text Field**, **Search Field**, and **Date Picker** use **`Focus Ring`** boolean (keyboard `:focus-visible`) — ring stroke binds brand focus tokens; pairs vs gap/page pass in audit.
- **Text Field** — label, value, placeholder, helper, and error text pairs **pass 4.5:1** in both modes. **Focus Ring** uses focus tokens in audit (≥3:1 vs gap/page). **Active** state is visual editing — keyboard focus should use **Focus Ring** boolean / `:focus-visible` in product code.
- **Search Field** — label, value, placeholder, helper, error, search icon, control border pairs **pass** in both modes. **Focus Ring** boolean same pattern as Text Field. **Clear button** needs accessible label (**“Clear search”**) when visible in product code.
- **Date Picker** — label, value, placeholder, helper, error, trigger border, calendar icon, focus ring, calendar header/weekday/day text, selected day (inverse on primary fill), today border, day focus ring, and nav icons **pass**. Disabled day/label/nav = **Exempt / Disabled state**. Selected + today are not color-only. Product: visible label or accessible name; associate errors; keyboard open/navigate/select/close; announce selected date.
  - *Docs example note (2026-10-05):* HTML calendar now follows the audited Figma values (circular Selected fill + inverse text, 2px Today outline, 2px focus outline; `aria-selected`, `aria-current="date"`, native `disabled`). Token pairs unchanged — no re-audit needed; Dark day focus-ring color inherits the theme focus stroke (`#fff`) and is **Needs verification** against a Dark Day Cell Focus variant, which is not present in the Figma section.
- **Textarea** — **removed from live file** (2026-06-15); prior audit pairs no longer apply.
- **Pagination** — prev/next use pagination-specific tokens (`color/pagination/control/icon/*` on page). Light default icon **8.42:1** vs page — **PASS** (via `color/text/action`).
- **Status filled surfaces** — `color/status/{tone}/filled/text|icon` alias `color/text/inverse`; all filled pairs pass. Subtle status text unchanged.
- **Target size:** all Button heights are **≥28px ≥ the 24px AA minimum** (SC 2.5.8) in every density. Pass.
- **Decorative borders** (`border/default`, `card/border/default`) are <3:1. They are exempt as decorative dividers, but would fail SC 1.4.11 if ever used as the *sole* boundary of an interactive control (e.g. a future input).
- **Disabled** pairs are below 4.5:1 but **exempt** under SC 1.4.3 (inactive components). They rely on color/opacity only — recommend an additional non-color cue.
- **Typography:** `caption/sm` (11px) is below the 12px readability guideline; `body/sm` line-height is 1.43 (slightly under the 1.5 guideline).

- **Jumbo Select Button** — new selectable-option card (2026-07-11). All label/sub-label/border/icon/indicator/focus pairs **pass** both modes. **Selected** state combines brand border (2px) + subtle brand background + check indicator — **not color alone**. **Focus Visible** is an explicit State variant with the offset ring (2px ring + 2px gap, outside the container, `clipsContent: false`). Product semantics: **radio pattern** for single-select groups, **checkbox pattern** for multi-select, button pattern only for immediate actions. Disabled pairs **Exempt / Disabled state**.
- **Progress Bar** — step/percentage labels pass on page/card; fill vs track passes non-text 3:1; track vs page/card is decorative (subtle track container). Product: `role="progressbar"` + text labels required.

**Verdict (2026-07-26):** **0 non-exempt contrast failures** on **474** audited pairs. Brand primitive **`#D33F55`** unchanged. Date Picker added as a current single-date component; Date Range Picker / Multi-Select Dropdown not created.

---

## Audit Method

What was checked, and how:

- **Tokens** — all Foundation, Theme, and Component color variables were read from the live Figma file and **resolved through the full alias chain** (Component → Theme → Foundation) **per theme mode**. Resolved hex values are in `scripts/tokens.json`.
- **Color pairs** — the pairs in §4 of the brief plus focus-indicator pairs were scored with the **WCAG relative-luminance** formula (sRGB → linear, `L = 0.2126R + 0.7152G + 0.0722B`, ratio `(L1+0.05)/(L2+0.05)`). Translucent foregrounds (Ghost transparent backgrounds) are composited over the visible surface first.
- **Component variants** — Button (Action/Secondary/Ghost × Small/Medium/Large × Default/Hover/Pressed/Focus/Disabled) and Card, including the actual focus stroke weight/align read from the file.
- **Light/Dark themes** — every pair scored in both modes.
- **Density modes** — Compact/Comfortable/Spacious button heights checked against the 24px target-size minimum.
- **Responsive variables** — Layout spacing reviewed for cramped-target risk.
- **Typography styles** — font size and line-height of all **18** text styles in the live file.

Not relying on visual judgement: ratios are computed numerically (see the script output).

**Limitation:** there are no local token *source* files (the system is generated into Figma), so values were exported from the live file. `scripts/tokens.json` is that export; re-run the dump if the file changes (see README → Accessibility → "Re-running the audit").

---

## Findings Table

| Area | Component/Token | Mode | Issue | WCAG | Severity | Recommendation |
|------|-----------------|------|-------|------|----------|----------------|
| Contrast | `button/ghost/text/default` on `surface/page` | Light | ~~4.36:1~~ → **8.42:1** | 1.4.3 | ✅ Fixed | Re-aliased `text/action` → `action/primary/text` (applied) |
| Contrast | `button/ghost/text/default` on `ghost/background/hover` | Light | ~~4.17:1~~ → **8.06:1** | 1.4.3 | ✅ Fixed | Same re-alias (applied) |
| Typography | `caption/sm` | All | ~~11px~~ → **12px** | readability | ✅ Fixed | Bumped to 12px / 16px line-height (applied) |
| Contrast | `button/action/text/default` on `action/background/default` | Light | 4.55:1 (marginal pass) | 1.4.3 | Low | Watch; prefer hover/pressed shades for dense text-on-brand |
| Focus | `border/focus` vs `button/action/background/*` | Both | ~~Ring same hue as fill (1.00:1)~~ → **offset gap treatment** | 2.4.11 | ✅ Fixed | `focus-ring` wrapper + `color/button/focus/gap`; ring aliases `brand/primary/700` / `300` |
| Focus | `border/focus` vs `button/secondary/background/default` | Dark | ~~2.84:1 at edge~~ → **offset gap** | 2.4.11 | ✅ Fixed | Same offset wrapper |
| Non-text | `text-field/border/default` on field bg | Both | **4.80 / 6.93 ≥ 3** | 1.4.11 | ✅ Pass | Control border uses `neutral/500` Light · `neutral/400` Dark |
| Non-text | `text-field/focus/ring` vs `text-field/focus/gap` | Both | **8.42 / 10.00 ≥ 3** | 2.4.11 | ✅ Pass | Offset focus ring (applied with Text Field) |
| Contrast | `text-field/error/default` on `surface/page` | Both | **8.83 / 9.13 ≥ 4.5** | 1.4.3 | ✅ Pass | Error message — not color alone when shown |
| Contrast | `search-field/label/default` on `surface/page` | Both | **≥ 4.5** | 1.4.3 | ✅ Pass | Search field label |
| Contrast | `search-field/text/value` on field bg | Both | **≥ 4.5** | 1.4.3 | ✅ Pass | Filled search value |
| Contrast | `search-field/text/placeholder` on field bg | Both | **≥ 4.5** | 1.4.3 | ✅ Pass | Placeholder (not a label) |
| Contrast | `search-field/error/default` on `surface/page` | Both | **≥ 4.5** | 1.4.3 | ✅ Pass | Error message |
| Non-text | `search-field/border/default` on field bg | Both | **≥ 3** | 1.4.11 | ✅ Pass | Same control border mapping as Text Field |
| Non-text | `search-field/focus/ring` vs gap | Both | **8.42 / 10.00 ≥ 3** | 2.4.11 | ✅ Pass | Offset focus ring |
| Non-text | `search-field/icon/default` on field bg | Both | **≥ 3** | 1.4.11 | ✅ Pass | Decorative search icon |
| Non-text | `search-field/clear-icon/default` on field bg | Both | **≥ 3** | 1.4.11 | ✅ Pass | Clear control — needs accessible name in code |
| Non-text | `card/border/default` on `card/background/default` | Both | 1.26 / 1.70 < 3 | 1.4.11 | Low | Decorative — OK as-is; use `border/strong`+ only if it becomes a required boundary |
| Non-text | `border/default` on `surface/page` | Both | 1.20 / 2.04 < 3 | 1.4.11 | Low | Decorative divider — exempt; Text Field uses `border/control/*` instead |
| Color-only | Disabled Button | Both | State shown by opacity/color only | 1.4.1 | Medium | Add a non-color cue in usage (icon, `aria-disabled`, cursor) |
| Disabled (exempt) | `button/*/text/disabled` on `*/background/disabled` | Both | 1.35–2.75:1 | 1.4.3 (exempt) | Low | Acceptable per exception; don't rely on disabled text being readable |
| Typography | `body/sm` | All | line-height 1.43 < 1.5 | 1.4.12 | Low | Raise line-height toward 1.5 if used for paragraphs |
| Target size | Compact Small Button (28px) | Compact | ≥24px (pass) but tight for touch | 2.5.8 pass / 2.5.5 AAA | Low | Use ≥40px for primary touch targets |

---

## Contrast Matrix

Normal text needs ≥4.5:1, large text/non-text needs ≥3:1. `*` = WCAG-exempt (disabled).

| Foreground | Background | Light | Dark | Pass | Replacement if failing |
|-----------|-----------|------:|-----:|------|------------------------|
| `button/action/text/default` | `button/action/background/default` | 4.55 | 5.27 | ✅ | — (marginal in Light) |
| `button/action/text/default` | `button/action/background/hover` | 6.26 | 7.77 | ✅ | — |
| `button/action/text/default` | `button/action/background/pressed` | 8.80 | 10.58 | ✅ | — |
| `button/action/text/disabled` | `button/action/background/disabled` | 2.31* | 1.99* | exempt | — |
| `button/secondary/text/default` | `button/secondary/background/default` | 16.30 | 14.94 | ✅ | — |
| `button/secondary/text/default` | `button/secondary/background/hover` | 17.41 | 12.98 | ✅ | — |
| `button/secondary/text/default` | `button/secondary/background/pressed` | 18.35 | 10.94 | ✅ | — |
| `button/secondary/text/disabled` | `button/secondary/background/disabled` | 1.69* | 1.35* | exempt | — |
| `button/ghost/text/default` | `surface/page` | 8.42 | 10.00 | ✅ | fixed (was 4.36 Light) |
| `button/ghost/text/default` | `surface/card` | 8.80 | 8.33 | ✅ | fixed |
| `button/ghost/text/default` | `ghost/background/hover` | 8.06 | 7.23 | ✅ | fixed (was 4.17 Light) |
| `button/ghost/text/disabled` | `surface/page` | 2.41* | 2.75* | exempt | — |
| `card/title` | `card/background/default` | 16.30 | 17.49 | ✅ | — |
| `card/body` | `card/background/default` | 7.63 | 11.74 | ✅ | — |
| `card/border/default` (non-text) | `card/background/default` | **1.26** | **1.70** | ❌ | `border/strong`+ (decorative → low) |
| `text/default` | `surface/page` | 15.61 | 21.00 | ✅ | — |
| `text/subtle` | `surface/page` | 7.30 | 14.10 | ✅ | — |
| `text/default` | `surface/card` | 16.30 | 17.49 | ✅ | — |
| `text/subtle` | `surface/card` | 7.63 | 11.74 | ✅ | — |
| `border/default` (non-text) | `surface/page` | **1.20** | **2.04** | ❌ | darker neutral if a required boundary |
| `border/focus` (non-text) | `surface/page` | 8.42 | 10.00 | ✅ | stronger primary/700 · primary/300 shade |
| `border/focus` (non-text) | `surface/card` | 8.80 | 8.33 | ✅ | — |
| `button/focus/ring` (non-text) | `button/focus/gap` | 8.42 | 10.00 | ✅ | offset gap between fill and ring |
| `button/focus/ring` (non-text) | `surface/page` | 8.42 | 10.00 | ✅ | outer focus edge vs page |

---

## Component Findings

### Button
- **Action** — label passes in both modes (Light 4.55 marginal; hover/pressed strong). Dark mode correctly flips the label to ink (`text/inverse` → secondary) on the lighter pink fill.
- **Secondary** — excellent contrast everywhere (10–18:1).
### Ghost button (secondary brand — updated)

- **Ghost** — transparent fill + **secondary-brand stroke and text** (no longer primary/action
  pink). Text passes at **17.57 / 6.53** (Light/Dark page) via `action/secondary/text`. Default
  stroke aliases `color/action/secondary/default` (**15.61 / 19.25** vs page/card) — passes as a
  button boundary. Dark mode uses lighter secondary aliases (`neutral/100` border,
  `brand/secondary/300` text) — theme-aware via Theme tokens, not hard-coded.
- **Text Button** (separate component) — per-state fill tokens restored; hover underline on label layer.
- **Disabled** — all types rely on a 0.6 opacity + muted color; contrast is low but exempt. Add a non-color cue.
- **Focus** — Focus variants use a **`focus-ring` wrapper**: 2px `color/button/focus/gap` (surface) + 2px OUTSIDE `color/button/focus/ring` (`brand/primary/700` Light · `primary/300` Dark). Ring vs gap passes **8.42 / 10.00** (Light/Dark). Content (`button-body`) layout unchanged; ring sits outside the fill.
- **Target size** — Small/Medium/Large = 32/40/48 (Comfortable), 28/36/44 (Compact), 36/44/52 (Spacious). All ≥24px (AA pass). Compact Small (28) is tight for touch.

### Card
- Title (16.3/17.5) and body (7.6/11.7) pass comfortably in both modes.
- `card/border/default` is a faint hairline (1.26/1.70) — decorative; acceptable since the card is identified by its fill/content, not its border.
- Card footer action is a Ghost Medium button (40px) — meets target size; inherits the Ghost light-contrast fix.

### Typography
- Sizes: body 16/14, headings 20–56, button label 14 (SemiBold). All readable.
- `caption/sm` = 11px → below the 12px guideline.
- Line-heights mostly ≥1.5; `body/sm` and `button/md` are 1.43 (acceptable for short strings, slightly tight for paragraphs).
- Density does **not** change font size (only spacing), so labels do **not** shrink in Compact — good.

### Theme modes
- Light and Dark are driven entirely by semantic tokens. Both modes were scored; Dark generally has *higher* contrast. The only mode-specific failure is Ghost text in **Light**.

### Density modes
- Compact reduces heights to 28/36/44 — still ≥24px. Compact spacing (gap 6, card padding 16) is tight but readable. No contrast impact.

### Responsive layout variables
- Mobile margins/padding (16px) and section padding are reasonable; no target-size or readability risk introduced by layout values. Layout values are reference-only (Figma doesn't switch by viewport).

---

## Recommended Token Changes

**1. Ghost / action text color (the one real AA failure)**

```
Current:  color/text/action  → color/action/primary/default   (#D33F55 Light)
          (color/button/ghost/text/default → color/text/action)

Issue:    Ghost label fails 4.5:1 in Light (4.36 on page, 4.17 on hover).

Recommended: re-alias color/text/action → color/action/primary/text
             (Light #872836 / Dark #E99FAA)
Result:   Ghost text becomes ~8.4:1 (Light page) and stays ≥7:1 (Dark). All pass.
```
Prefer the **semantic** re-alias (above) over a component-token change, since `text/action`
exists precisely to be the accessible "action-colored text" token.

**2. Required boundaries (only when added later)**
```
For any future control whose boundary is the only identifier (inputs, checkboxes),
use a neutral darker than border/strong: border/strong (#A8A29E) is only 2.28:1 on the
Light page. Use ~neutral/500 (#78716C ≈ 4.37:1) for a perceivable boundary.
```

---

## Recommended Component Changes

- **Focus offset** — keep the 2px ring, add a **2px offset** (a gap of the surface color between button and ring) so the indicator never overlaps a same-colored fill. Fixes the Action (1.00) and Secondary-Dark (2.84) edge cases. *(Requires adding a themed ring/offset element — left as a documented change, not auto-applied, to avoid restructuring components.)*
- **Disabled non-color cue** — opacity alone communicates disabled by appearance; in product usage pair it with `aria-disabled`, `not-allowed` cursor, or an icon so meaning isn't color-only.
- **`caption/sm` 11px → 12px** — small, safe readability bump.
- **Touch guidance** — document that Compact Small (28px) meets the 24px minimum but ≥40px is recommended for primary touch targets.

---

## Implementation Plan (priority order)

1. **Critical contrast failures** — _(none system-wide)_; fix the **Ghost light-mode text** (token re-alias). ✅ safe, apply now.
2. **Focus visibility** — add focus offset (documented; implement after review).
3. **Target size** — none required (all ≥24px); add usage guidance.
4. **Typography readability** — `caption/sm` → 12px. ✅ safe, apply now.
5. **Documentation** — add an Accessibility section to README + the Figma docs. ✅ apply now.

See [`SAFE_WCAG_FIX_PLAN.md`](./SAFE_WCAG_FIX_PLAN.md) for the exact changes and which were applied.

---

## Re-audit Results (after safe fixes)

Re-ran `scripts/audit-wcag.ts` against the refreshed token export (post-fix live values).

| Metric | Before | After |
|--------|-------:|------:|
| Ghost text on page (Light) | 4.36 ❌ | **8.42 ✅** |
| Ghost text on hover (Light) | 4.17 ❌ | **8.06 ✅** |
| Ghost text on card (Light) | 4.55 ✅ | 8.80 ✅ |
| Ghost text (Dark, all) | 4.90–6.78 | 7.23–10.00 ✅ |
| `caption/sm` | 11px | **12px** |
| Non-exempt contrast failures | 9 | **7** |

**Confirmed:**
- ✅ Ghost button text passes 4.5:1 in **Light** (and Dark) on page, card and hover.
- ✅ No new contrast failures introduced — all previously-passing pairs are unchanged (brand
  primitives and Action/Secondary tokens were not touched).
- ✅ `color/brand/primary/500` (`#D33F55`) and `color/action/primary/default` are unchanged.

**Remaining (by design — not regressions):**
- Decorative hairlines `border/default` (1.20/2.04) and `card/border/default` (1.26/1.70) — exempt
  unless used as a control boundary (see Border guidance in README).
- Focus ring vs **Action** fill (1.00) and **Secondary**-Dark (2.84) — addressed by the documented
  2px focus **offset** recommendation (REC-1), intentionally not auto-applied this pass.
- Disabled text pairs — WCAG-exempt.

### Button hierarchy re-audit (Ghost secondary brand)

After switching Ghost to **secondary-brand** text and stroke:

| Pair | Light | Dark | Pass |
|------|------:|-----:|------|
| Ghost text on page | 17.57 | 6.53 | ✅ |
| Ghost stroke vs page | 15.61 | 19.25 | ✅ |
| Ghost stroke vs card | 16.30 | 16.03 | ✅ |
| Ghost text on hover bg | 16.82 | 4.72 | ✅ |

Ghost uses `color/action/secondary/text` and `color/action/secondary/default` (theme-aware:
`brand/secondary/*` in Light, lighter values in Dark). No new non-exempt failures.

---

## Elevation & shadow (usability)

Shadow tokens and effect styles communicate **layer hierarchy**, not interactivity or state alone.

| Guideline | Rationale |
|-----------|-----------|
| Do not rely on shadow alone for affordance | Hover/focus/disabled need color, border, label, or ring — not elevation change alone |
| Focus states use visible focus rings | Buttons, Icon Buttons, and Text Fields map to `elevation/none`; focus uses `focus/ring` tokens |
| Disabled states are not “lower elevation” | Disabled styling uses dedicated color tokens, not shadow reduction |
| Critical hierarchy uses layout + labels | Spacing, typography, and borders support structure when shadows are subtle or invisible (Dark) |
| Overlays need clear separation | Combine `elevation/modal` or `elevation/overlay` with `color/surface/overlay` and `color/border/elevated` in Dark |

**Dark mode:** Test elevation visually — shadows alone are insufficient; elevated surfaces should read lighter than the page with optional border contrast.

See **`Foundations / Elevation and Shadow`** on the Foundations page — *naming docs §14 not present in current live file*.

---

## Dropdown (WCAG audit 2026-06-11)

Added contrast pairs for **`color/dropdown/*`** and **`color/dropdown-menu/*`**.

| Area | Result |
|------|--------|
| Label, value, placeholder, helper, error on page | ✅ Pass Light & Dark |
| Control borders (default/hover/focus/error) vs field bg | ✅ Pass |
| Focus ring vs gap / page | ✅ 8.42–10.00:1 |
| Menu option text (default/selected) vs option bg | ✅ Pass |
| Disabled trigger/option text | FAIL* (WCAG-exempt) |
| Menu container border vs menu bg | FAIL decorative hairline (1.26 Light / 1.48 Dark) — same class as `card/border/default`; not a control boundary |

**Product guidance:** Implement keyboard navigation (Arrow keys, Enter, Escape), aria-expanded on trigger, aria-selected on options, and accessible names for chevron/checkmark icons.

---

## Radio Selector (WCAG audit 2026-06-11)

| Area | Result |
|------|--------|
| Label + description on page | ✅ Pass Light & Dark |
| Radio borders (default/hover/selected/focus/error) | ✅ Pass ≥3:1 |
| Selected dot vs radio background | ✅ Pass (3.84–4.55:1) |
| Focus ring vs gap / page | ✅ 8.42–10.00:1 |
| Disabled label/description | FAIL* (WCAG-exempt) |

**Product guidance:** Use native `<input type="radio">` or `role="radiogroup"` with `role="radio"` + `aria-checked`. Group label via `<fieldset>`/`<legend>`. Selected state uses dot + border, not color alone.

## Checkbox (WCAG audit 2026-06-15)

| Area | Result |
|------|--------|
| Label + description on page | ✅ Pass Light & Dark (7.30–21.00:1) |
| Error label on page | ✅ Pass (8.83–9.13:1) |
| Checkbox borders (default/hover/checked/focus/error) | ✅ Pass ≥3:1 (3.05–8.80:1) |
| Checkmark vs filled box | ✅ Pass (3.58–4.55:1) |
| Indeterminate mark vs filled box | ✅ Pass (3.58–4.55:1) |
| Focus ring vs gap / page | ✅ Pass (8.42–10.00:1) |
| Disabled label/description/mark | FAIL* (WCAG-exempt) |

Audit totals after Checkbox: **6 non-exempt failures (unchanged baseline), 26 disabled/exempt (FAIL*), 174 pairs.** No regressions to existing components.

**Product guidance:** Use native `<input type="checkbox">` with a programmatically associated `<label>`; set `indeterminate` via JS (not an HTML attribute). Group related checkboxes in a `<fieldset>`/`<legend>`. Checked/indeterminate states use a visible mark (checkmark / center bar), not color alone. Group-level validation errors must be conveyed as text, not color alone.

## Snackbar (WCAG audit — live re-baseline 2026-06-15)

**Container:** `color/snackbar/background/*` → `color/surface/elevated` (**Light `#ffffff`** · **Dark `#292524`**). Message/icon/border tokens are theme-aware or tone-specific.

**Canvas note:** Action **Ghost Button** label and close **Icon Button** Vector are bound to `color/snackbar/action/text/default` and `color/snackbar/close/icon/default` respectively (all tone variants). Audit pairs match live canvas bindings.

| Area | Light | Dark |
|------|-------|------|
| Message text vs container | ✅ 16.30:1 | ✅ 15.17:1 |
| Action text default/hover/pressed vs container | ✅ 8.80 / 6.26 / 8.80 | ✅ 7.23 / 12.08 / 10.18 |
| Close icon default/hover vs container | ✅ 7.63 / 16.30 (non-text) | ✅ 10.18 / 15.17 |
| Tone icons (all) vs container | ✅ ≥3.14:1 | ✅ ≥3.14:1 |
| Tone accent borders (all) vs container | ✅ ≥3.19:1 | ✅ ≥3.14:1 |

**Fixes applied (token aliases only — component unchanged):**

| Token | New alias | Reason |
|-------|-----------|--------|
| `snackbar/action/text/default` | `text/action` | Was `neutral/0` (1:1 on white elevated) |
| `snackbar/action/text/hover` | `text-button/text/hover` | Same |
| `snackbar/action/text/pressed` | `text-button/text/pressed` | Same |
| `snackbar/close/icon/default` | `text/subtle` | Was `neutral/300` (1.49:1 on white) |
| `snackbar/close/icon/hover` | `text/default` | Was `neutral/0` (1:1 on white) |

### Snackbar Issues to Review

- **Product:** Focus indicators and accessible names for action/close remain code responsibilities.

**Product guidance:** Snackbar tone is conveyed by **icon + text**, not color alone. Don't use Snackbar for persistent/critical alerts (use an inline alert/banner). Action and close controls need a **visible focus indicator** in product code; the close button needs an accessible name (e.g. "Dismiss"). Auto-dismiss timing should be adjustable/pausable (SC 2.2.1).

## Notification Button (WCAG audit 2026-06-15)

Built on the **Icon Button** foundation — the button container, bell icon, states, and focus ring reuse `color/icon-button/*`, already audited under Icon Button. Only the badge/dot were added.

| Area | Result |
|------|--------|
| Count text vs badge background | ✅ Pass (6.65:1, both modes) |
| Badge background vs page | ✅ Pass ≥3:1 (3.16–6.37:1, non-text) |
| Dot vs page | ✅ Pass ≥3:1 (3.16–6.37:1, non-text) |
| Bell icon / focus ring (via Icon Button) | ✅ Pass (see Icon Button) |

Audit totals after Snackbar + Notification Button: **6 non-exempt failures (unchanged baseline), 26 disabled/exempt (FAIL*), 208 pairs.** No regressions to existing components.

## Overlay components — Alert, Tooltip, Modal, Switch (WCAG audit 2026-06-15)

Re-ran `scripts/audit-wcag.ts` after merging **55** new overlay tokens into `scripts/tokens.json`. **256 pairs** total.

### Alert / Banner

| Area | Result |
|------|--------|
| Title/message (all tones) vs subtle backgrounds | ✅ Pass ≥4.5:1 (both modes) |
| Tone icons/borders vs backgrounds | ✅ Pass ≥3:1 |
| Action link + close icon vs neutral background | ✅ Pass |

### Tooltip

| Area | Result |
|------|--------|
| Text vs inverse surface | ✅ Pass (Light 16.30:1 · Dark 12.07:1) |
| Arrow vs background | ⚠️ Fail 1:1 (arrow matches fill — acceptable; not a separate UI control) |

### Modal / Dialog

| Area | Result |
|------|--------|
| Title + body vs modal surface | ✅ Pass ≥4.5:1 |
| Border vs modal surface | ⚠️ Fail 1.26 Light / 1.70 Dark (same class as Card border — subtle separator) |
| Overlay token vs page | ⚠️ Fail 1.04 Light / 1.38 Dark — **`color/surface/overlay` is not a scrim**; apply opacity in product code |

### Toggle / Switch

| Area | Result |
|------|--------|
| Label + description vs page | ✅ Pass |
| Focus ring vs gap / page | ✅ Pass ≥3:1 |
| Thumb on **on** track | ✅ Pass ≥3:1 |
| Thumb on **off** track | ✅ Pass Light **4.80:1** · Dark **6.93:1** (≥3:1) |
| Disabled thumb vs track | FAIL* (exempt) |

**Audit totals (2026-07-11):** **392 pairs · 0 non-exempt failures · 19 FAIL\* (disabled/exempt) · 4 decorative.** Alert **text** pairs pass.

**Product guidance:** Alert — use text + icons; `role="alert"` for critical messages; label dismiss control. Tooltip — short copy only; keyboard/screen-reader disclosure in code. Modal — trap focus; labeled close; scrim via rgba in code. Switch — visible label; native switch semantics; consider thumb border or stronger off-track for 3:1 thumb/track contrast.

**Product guidance:** Provide an accessible label that includes the count (e.g. `aria-label="Notifications, 3 unread"`); the badge/dot must **not** be the only signal of critical information; keep the focus ring visible. A surface-colored "notch" border separates the badge from the button against the page.

## Pagination (WCAG audit — verified 2026-06-19)

**Live Figma:** Pagination prev/next use **`color/pagination/control/icon/*`** (aliases `color/text/action` — not global Icon Button default pink). Audit totals: **392 pairs**, **0 non-exempt failures**, **19 disabled/exempt (FAIL*)**, **4 decorative**.

| Area | Result |
|------|--------|
| Page item text — default / hover (Light & Dark) | ✅ Pass ≥4.5:1 |
| Page item text — **active** (primary fill) | ✅ Pass (Light **4.55:1** — marginal; Dark 5.27:1) |
| Page item text — disabled | FAIL* (exempt) |
| **`pagination/control/icon/default`** vs page | ✅ Pass Light **8.42:1** · Dark **10.00:1** |
| **`pagination/control/text/default`** vs page | ✅ Pass Light **8.42:1** · Dark **10.00:1** |
| Control hover / focus | ✅ Pass |
| Ellipsis text vs page | ✅ Pass |
| Item border default (non-text) | ✅ Pass ≥3:1 |
| Item border active vs primary fill | DECOR (fill-identified — non-counted) |
| Focus ring vs gap / page | ✅ Pass ≥3:1 |

**Product guidance:** Use `<nav aria-label="Pagination">` (or equivalent). Mark the current page with `aria-current="page"`. Label Previous/Next (`aria-label="Go to previous page"` / `"Go to next page"`). Disabled controls must be `aria-disabled="true"` or native `disabled`.

## Status tokens (WCAG audit — verified 2026-06-15)

Theme status restructure: **`subtle` / `surface` / `text` / `text-inverse`** + component **`filled/text|icon`** aliases per tone.

| Pairing | Result |
|---------|--------|
| **`text` on `subtle`** | ✅ Pass all tones Light & Dark |
| **`filled/text` on `surface`** | ✅ Pass all tones (aliases `color/text/inverse`) |
| **`filled/icon` on `surface`** | ✅ Pass all tones |
| **neutral `text` on `surface`** | ✅ Pass |
| **neutral `text-inverse` on `surface-inverse`** | ✅ Pass |

**Product guidance:** On filled status chips/badges/alerts, bind **`color/status/{tone}/filled/text|icon`** (or `text-inverse`). On subtle backgrounds, bind **`text`**. Do not use subtle `text` on filled `surface` tokens.

---

## Possible Issues to Review

Layout and component-property issues from live inspection (**2026-06-19**) — **not fixed** in this pass (manual Figma edits preserved). Full list in [`CURRENT_FIGMA_STATE.md`](./CURRENT_FIGMA_STATE.md) § Possible Issues to Review.

| Issue | WCAG / a11y relevance |
|-------|------------------------|
| **Text Field Focus Ring vs Active** | **Active** = editing; **Focus Ring** boolean = keyboard focus — document separately in product code |
| **Text Field stale canvas description** | ~~Resolved 2026-06-15~~ — Figma description updated |
| **Search Field Focus Ring vs Active** | Same model as Text Field — **Focus Ring** boolean, not Focus variant |
| **Search Field clear affordance in Filled** | **Filled/Error** variants have no clear control in live Figma — product must expose labeled clear when value present |
| **Selector / Dropdown Focus Ring vs Active** | Aligned to Text Field model — **Focus Ring** boolean on trigger |
| **Search Field error frame width** | Error text frame narrower than component — verify reading order and association in product |

**Fixes applied this inspection:** None (audit **0 non-exempt failures** on current token export).
