# Safe WCAG Fix Plan — Fukurou Design System

Derived from [`ACCESSIBILITY_AUDIT.md`](./ACCESSIBILITY_AUDIT.md). Each item lists the exact
change, why it's safe, and its status. "Applied" items are low-risk, clearly improve WCAG
compliance, and do **not** alter architecture, add Button types, or hard-code colors.

Guard rails honored: brand `#D33F55` / `#231F20` unchanged · no Warning/Danger button variants ·
red & amber stay Foundation-only · Light/Dark, Density and Layout preserved · aliases used everywhere.

> **Re-audit confirmed (after applying FIX-1/FIX-2):** Ghost text now passes 4.5:1 in Light
> (8.42 page / 8.06 hover) and Dark (≥7.2). Non-exempt failures 9 → 7, no new failures, brand
> primitives untouched. See [`ACCESSIBILITY_AUDIT.md` → Re-audit Results](./ACCESSIBILITY_AUDIT.md#re-audit-results-after-safe-fixes).

---

## ✅ Applied (safe, low-risk)

### FIX-1 — Ghost / action text contrast (the one real AA failure)
**Change (semantic re-alias):**
```
color/text/action :  alias  color/action/primary/default   →   color/action/primary/text
   Light:  #D33F55  →  #872836   (brand/primary/700)
   Dark:   #DE7181  →  #E99FAA   (brand/primary/300)
```
- `color/button/ghost/text/default` already aliases `color/text/action`, so the Ghost label
  updates automatically; the Action **fill** tokens are untouched (still `#D33F55`).
- **Result:** Ghost label Light ≈ 8.4:1 (page) / 8.8:1 (card); Dark stays ≥7:1. All pass 4.5:1.
- **Safe because:** only the *link/ghost text* color changes (to a darker brand shade); no fills,
  no brand primitives, no components restructured. `text/action` is the only consumer.

### FIX-2 — Caption readability
**Change:** text style `caption/sm` font size **11px → 12px** (line-height 16 unchanged).
- **Safe because:** purely a readability bump on the smallest caption; no layout/token impact.

### FIX-4 — Text Field control border contrast (2026-06-11)
**Change (Theme semantic re-alias):**
```
color/border/control/default :
   Light:  neutral/400  →  neutral/500
   Dark:   neutral/600  →  neutral/400
```
- Text Field `border/default` aliases this token; default field boundary now passes **3:1 non-text** (4.80 Light / 6.93 Dark).
- **Safe because:** only affects control-border semantics; decorative `border/default` and Card borders unchanged. No Button types added.

### FIX-5 — WCAG contrast campaign (2026-06-15) — **30 → 0 non-exempt failures**

Applied in live Figma via `scripts/figma-wcag-contrast-fix.js` + `scripts/figma-final-wcag-fix.js`:

| Fix | Tokens | Result |
|-----|--------|--------|
| Pagination prev/next icon/text | `pagination/control/icon|text/default` → `text/action` | Light **8.42:1** (was 4.36:1) |
| Status filled text/icon | `status/{tone}/filled/text|icon` → `text/inverse` | All filled pairs pass |
| Snackbar fixed dark bar | text/action/close/icon/border → Foundation (`neutral/0`, `green/400`, etc.) | Dark-mode snackbar pairs pass |
| Modal scrim Dark | `surface/overlay` Dark = white @ 0.5 alpha | **5.32:1** vs `#000000` page |
| Decorative borders | `border/default` → `neutral/500` / `neutral/400` | Card/dropdown borders pass |
| Switch off-track | `switch/track/off/default` → `border/control/default` | Thumb vs track passes |
| Text Button default | `text-button/text/default` → `text/action` | Pass on page/card |

**Audit after fixes:** **474 pairs · 0 non-exempt failures · 20 FAIL\* (disabled) · 8 decorative** — re-run **2026-07-26** against `tokens.json` (**558** tokens, Date Picker / Calendar patched). Live file **559** color vars · **0** broken aliases. Full re-export still recommended when practical.

### FIX-6 — Snackbar elevated surface token aliases (2026-06-15)

After manual Snackbar update (`background/*` → `surface/elevated`), orphaned `snackbar/action/text/*` and `snackbar/close/icon/*` aliases still pointed at fixed-dark-bar values (white on white in Light). Updated aliases only — **component not rebuilt**:

| Token | Alias |
|-------|--------|
| `snackbar/action/text/default` | `text/action` |
| `snackbar/action/text/hover` | `text-button/text/hover` |
| `snackbar/action/text/pressed` | `text-button/text/pressed` |
| `snackbar/close/icon/default` | `text/subtle` |
| `snackbar/close/icon/hover` | `text/default` |

Canvas still uses Ghost Button + Icon Button with `action/secondary` on close — flagged in **`CURRENT_FIGMA_STATE.md` → Snackbar Issues to Review**.

---

## 📋 Recommended (NOT auto-applied — needs review / component work)

### REC-1 — Focus ring offset  *(Medium)*
Add a **2px offset** (gap of the surface color) between the button and its 2px focus ring so the
indicator never overlaps a same-hue fill (fixes Action edge = 1.00:1, Secondary-Dark = 2.84:1).
- **Why not auto-applied:** a *themed* offset needs an extra ring/offset element bound to the
  surface token on every Focus variant — a component change beyond a pure token edit. The current
  ring already meets the AA minimum (≥3:1 vs the page it sits on), so this is an enhancement.
- **How:** wrap the button content with an outer "focus" frame, OR add an inner 2px stroke of
  `surface/page`/`surface/card` beneath the existing `border/focus` stroke (OUTSIDE align).

### REC-2 — Disabled non-color cue  *(Medium)*
Disabled is shown via 0.6 opacity + muted color only. In product, also expose `aria-disabled`,
a `not-allowed` cursor, and/or an icon so the state isn't color-only (SC 1.4.1). Disabled
contrast itself is WCAG-exempt, so no token change is required.

### REC-3 — Perceivable boundaries for future inputs  *(Low)*
`border/default` and `border/strong` are <3:1 on the Light page (decorative-OK today). When
adding inputs/checkboxes where the border is the only identifier, introduce a darker neutral
(~`neutral/500` `#78716C` ≈ 4.4:1) as the boundary token.

### REC-4 — body/sm line-height  *(Low)*
If `body/sm` (14/20 = 1.43) is used for multi-line paragraphs, raise line-height toward 1.5
(e.g. 21–22px). Left as-is for now since it's mainly used for short strings.

### REC-5 — Touch-target guidance  *(Low)*
All buttons meet the 24px AA minimum; document that Compact Small (28px) is fine for pointer/dense
UIs but ≥40px is recommended for primary touch targets.

### 2026-06-15 — Snackbar + Notification Button
No new safe fixes required. Both components were designed token-first to pass on creation:
- **Snackbar** uses a fixed dark container with white text/action (16.30:1) and tone icons/borders ≥3.38:1; all pairs pass in both themes.
- **Notification Button** count text passes 6.65:1 on the badge; badge/dot pass ≥3.16:1 vs page; the button itself reuses already-passing Icon Button tokens.
Audit baseline unchanged: **6 non-exempt failures, 26 FAIL\* (exempt), 208 pairs.** Outstanding product-code items (not token fixes): accessible label with unread count for Notification Button; visible focus + accessible name for Snackbar action/close; adjustable auto-dismiss timing.

### 2026-06-15 — Live re-inspection (manual Figma edits — documentation only)

**Detected since last doc sync:**

| Change | WCAG impact |
|--------|-------------|
| Variables **530 → 550**; Theme status tokens restructured | **Re-export `tokens.json` + re-run audit** before claiming pass/fail |
| **7 broken elevation aliases** (`elevation/button/*`, `elevation/text-field/*` → missing target) | **Fixed 2026-06-15** — restored `effect/shadow/none`, re-aliased `elevation/none` |
| Pagination prev/next → **Icon Button** instances | `pagination/control/*` audit pairs may be **stale** — **needs verification** |
| Page **`Navigations` → `Navigation`**; examples **`Pagination Examples`** on Navigation | Docs/scripts paths only |
| **`Pagination Desktop`** + **`Show Jumper`** + **`Pagination Mobile`** | Product semantics for jumper field — label in code |

**Do not rebuild pagination** to restore old Previous/Next text-button subcomponents unless explicitly asked.

---

### 2026-06-15 — Pagination restored to live file

**Pagination re-added:** 24 × `color/pagination/*` + 4 × `density/pagination/*` tokens; subcomponents Item/Previous/Next/Ellipsis + composed **`Pagination`** bar + **`Pagination Component`** examples. Audit baseline: **31 non-exempt failures, 12 FAIL\* (exempt), 276 pairs** (includes pagination + prior overlay/form items).

### 2026-06-15 — Pagination manual edits (documentation only — not “fixed”)

**Detected in live Figma (inspection, not re-audit):**

| Change | Impact on WCAG plan |
|--------|---------------------|
| Sets moved **Form → Navigations** | No token change; update docs/scripts paths before any regen |
| **`Pagination`** bar is **Size** variant set (Small/Medium) | Examples may instance bar set, not loose components |
| Active item **Regular** weight (semibold removed) | **FIX-O5** rationale outdated — active page may rely on color/fill only in Figma; enforce `aria-current="page"` in code |
| Page items **pill radius (999)** | Visual only |
| Live alias: `control/background/hover` → `item/background/hover` | **Done 2026-06-18** — `tokens.json` re-export verified |
| Example frame doc text still mentions semibold | Update Figma doc frame manually if desired (out of scope for token fixes) |

**Textarea** remains absent from live Figma — no `color/textarea/*` pairs in current audit.

---

## 🔶 Recommended follow-ups (overlay components — not applied)

### FIX-O1 — Switch off-state thumb vs track (non-text 3:1)
**Issue:** `color/switch/thumb/default` (surface/card white) on `color/switch/track/off/default` (border/default gray) = **1.26:1 Light / 1.70:1 Dark**.

**Safe options (pick one):**
- Add **1px thumb border** using `color/border/control/default` in the Switch component (Figma + code).
- Or alias off-track to a **slightly darker** theme token (e.g. `color/border/strong`) — verify label context still reads calm.

### FIX-O2 — Modal scrim in product code
**Status:** ✅ **Fixed in tokens (2026-06-15).** `color/surface/overlay` Dark uses white @ 0.5 alpha — composite **5.32:1** vs dark page. Light uses black @ 0.55 (**4.74:1**). Product may still apply additional opacity; token carries alpha for audit.

### FIX-O4 — Pagination default item border (optional)
**Issue:** `color/pagination/item/border/default` on `pagination/item/background/default` = **1.20:1 Light / 2.04:1 Dark** (aliases decorative `border/default`).

**Safe options:** Accept as lightweight default page item (border is subtle divider, not sole control boundary). Or alias item border to `color/border/control/hover` if product requires strict 3:1 on all interactive boundaries.

### FIX-O5 — Pagination active border (no change recommended)
**Issue:** Active item border aliases same token as active fill (1.00:1). **Live file (2026-06-15):** active page identified by **primary fill + inverse text** only (**Regular** weight — semibold removed manually). Border remains redundant. **Product code must use `aria-current="page"`** — do not claim non-color-only identification from Figma typography.
