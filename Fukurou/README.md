# Fukurou Design System

> **Source of truth:** The live Figma file **[Fukurou Design System](https://www.figma.com/design/FNLHeDQrr7JKBj81Qg7L7a/Fukurou-Design-System)** in the **`Fukurou/`** folder. Read [`CURRENT_FIGMA_STATE.md`](./CURRENT_FIGMA_STATE.md) before making future updates.

An enterprise-ready Figma design system library built on a scalable
**3-tier variable/token architecture** (Foundation → Theme → Component), plus **Density** and **Layout** supporting collections.

- **Live Figma file:** [Fukurou Design System](https://www.figma.com/design/FNLHeDQrr7JKBj81Qg7L7a/Fukurou-Design-System)
- **Local project folder:** `Fukurou/` (plugin, scripts, audits, and docs live here)
- **Figma file key:** `FNLHeDQrr7JKBj81Qg7L7a`
- **Brand foundations:** Primary `#D33F55` · Secondary `#231F20` · Headings **Lora** · Body **Poppins**

The library in the file above was generated programmatically. The same generator
lives in [`plugin/`](./plugin) so you can reproduce or re-theme the system from scratch.

> **v3 — token-name cleanup.** Token names were simplified so a collection never repeats
> its tier in each variable name, intent words were removed from primitives, and Warning/Danger
> were removed from the Button. See [**v3 — Token naming migration**](#v3--token-naming-migration).

---

## What's inside the Figma file

| Page | Contents |
|------|----------|
| **Cover** | Title hero, brand colors and font pairing |
| **Foundations** | Color ramps · typography · elevation · loose brand collage |
| **Buttons** | `Button` · `Text Button` · `Icon Button` · **`Notification Button`** · examples |
| **Form** | **`Text Field`** · **`Search Field`** · **`Date Picker`** · Dropdown · Radio · Checkbox · Toggle · **`Jumbo Select Button`** |
| **Navigation** | **Pagination** + **Progress Bar** sections (single page `459:2136`) — see `CURRENT_FIGMA_STATE.md` |
| **Cards** | `Card` · **`Icon / Placeholder / Search`** · **`.Base/ Icon / Placeholder / Star`** · examples |
| **Notifications** | **`Snackbar`** · **`Alert / Banner`** · **`Tooltip`** |
| **Modals** | **`Modal / Dialog`** · Overlay · examples |
| **`_Documentation`** | 3-tier explainer · Overlay docs |
| **Naming, Theme, Density & Responsive** | Naming docs · Preview Light/Dark |

**Variables:** **679** total (live **2026-07-26**) · **559** color vars · audited export **558** in `tokens.json` across **5 collections** — `1. Foundation`, `2. Theme` (Light/Dark),
`3. Component` (**428**), `2. Density` (**59**), `2. Layout`. **Theme note:** `color/action/primary/*` resolves to **neutral** (black/white); brand red is on **`color/action/tertiary/*`** and Progress Bar fill. **Not in live file / not current:** Textarea, Tabs, Tag/Chip, Multi-Select Dropdown, **Date Range Picker**. **Date Picker** is a current Form component (single date only).
**Effect styles:** 15. **Text styles:** 18 (Lora headers · Poppins body).
**WCAG (2026-07-26):** **474** pairs · **0** non-exempt failures · **20** exempt disabled · **8** decorative.

---

## Files in this folder

All Fukurou Design System source files live in **`Fukurou/`**:

```
Fukurou/
  README.md                 ← you are here
  CURRENT_FIGMA_STATE.md    ← **live Figma snapshot** (read before making changes)
  ACCESSIBILITY_AUDIT.md    ← WCAG 2.2 AA audit report
  SAFE_WCAG_FIX_PLAN.md     ← exact fixes (applied + recommended)
  docs/                     ← HTML documentation site (also published to GitHub Pages — see docs/README.md)
  plugin/
    manifest.json           ← Figma plugin manifest
    code.js                 ← the full, commented generator (variables, styles, components, docs)
  scripts/
    audit-wcag.ts           ← contrast audit script (WCAG relative luminance)
    tokens.json             ← resolved token colors exported from Figma
    audit-results.json      ← generated pass/fail output
```

> Markdown files in the repository root one level up (`../token-map.md`,
> `../design-system-architecture.md`, etc.) are legacy migration planning docs from the
> earlier migration project — **not** the live Fukurou Design System source of truth.

## HTML documentation website

- **Local:** `npx --yes serve Fukurou/docs -l 4175` or open [`docs/index.html`](./docs/index.html)
- **Live:** [https://aka-fukurou.github.io/fukurou-design-system-docs/](https://aka-fukurou.github.io/fukurou-design-system-docs/)
- **Deploy:** GitHub Actions workflow [`.github/workflows/deploy-docs.yml`](../.github/workflows/deploy-docs.yml) publishes `Fukurou/docs` on every push to `main`. No build step.

---

## How to run the plugin

The generator is a standard Figma development plugin.

**For incremental updates:** Open the live file **Fukurou Design System** (`FNLHeDQrr7JKBj81Qg7L7a`) and prefer the `scripts/figma-*.js` one-off scripts or targeted edits — do not run the full generator on the live file unless rebuilding from scratch.

**For a fresh rebuild:** Use an empty design file (requires **Professional+** for 3-mode Density and 4-mode Layout collections).

1. Open **Figma Desktop**.
2. Open **Fukurou Design System** (or create a blank file for a full regen).
3. **Menu → Plugins → Development → Import plugin from manifest…**
4. Select `Fukurou/plugin/manifest.json` from this repo.
5. **Menu → Plugins → Development → Fukurou Design System Generator.**

The plugin creates all variables, text styles, components, and documentation,
then closes itself. Run it on a **fresh** file to avoid duplicate names.

---

## Accessibility (WCAG 2.2 AA)

The system targets **WCAG 2.2 Level AA**. A full report lives in
[`ACCESSIBILITY_AUDIT.md`](./ACCESSIBILITY_AUDIT.md); applied and recommended fixes are in
[`SAFE_WCAG_FIX_PLAN.md`](./SAFE_WCAG_FIX_PLAN.md).

**WCAG target:** the Fukurou Design System targets **WCAG 2.2 AA** where applicable to tokens
and components.

**Status (2026-06-19):** **352** contrast pairs · **0 non-exempt failures** · **15** exempt disabled · **4** decorative.

### Color contrast

- **Normal text** should meet at least **4.5:1**.
- **Large text and non-text UI indicators** (boundaries, focus rings) should meet at least **3:1**.
- **Adjust Theme tokens before Component tokens** whenever possible — fix the intent once and
  every component inherits it.
- **Do not change Foundation brand colors** unless absolutely necessary (`brand/primary/500` =
  `#D33F55`, `brand/secondary/500` = `#231F20` are fixed).
- On surfaces use `text/default` or `text/subtle` (both ≥7:1); on solid Action/Secondary fills use
  `text/inverse` (the Button tokens already do this).

### Ghost button fix (accessible action-text token)

The Ghost label is driven entirely through the token chain — **never hard-coded**:

```
color/button/ghost/text/default
  → color/text/action
  → color/action/primary/text     (Light #872836 / Dark #E99FAA)
```

`color/text/action` is the **accessible action-text token** and must **not** point directly at
`color/action/primary/default` (the action *background* color, `#D33F55`), which only reaches
~4.4:1 as text on light surfaces. Pointing it at `color/action/primary/text` (a darker brand
shade in Light, lighter in Dark) clears 4.5:1 in **both** modes without any component override.

### Button focus treatment

Focus variants use an **offset focus ring** (similar to accessible double-ring patterns):

```
button-body (fill + label + icons)
  → 2px surface gap (color/button/focus/gap)
  → 2px brand focus stroke outside (color/button/focus/ring)
```

| Token | Maps to | Purpose |
|-------|---------|---------|
| `color/button/focus/ring` | `color/border/focus` → `brand/primary/700` (Light) · `primary/300` (Dark) | Strong red focus stroke — **not** `primary/500` |
| `color/button/focus/gap` | `color/surface/page` | Visible gap between button fill and ring |

- Ring sits **outside** the button shape (`strokeAlign: OUTSIDE`), with **2px padding** on the `focus-ring` wrapper.
- **`button-body`** keeps normal padding, height, label, and icon layout — the ring does not push content out of alignment.
- Focus is intentionally **more visible** than hover or pressed.
- **Text Button** keeps its own simpler 2px focus ring (unchanged).
- **HTML docs (2026-10-05):** the Button example implements this ring on `:focus-visible` as `box-shadow: 0 0 0 2px gap, 0 0 0 4px ring` with `outline: none`, so keyboard focus shows the gap + ring outside the pill in Light and Dark. Live `color/border/focus` currently resolves to `#d33f55` (Light) / `#ffffff` (Dark) — see the 2026-10-05 verification note under **Button → Focus** in `ACCESSIBILITY_AUDIT.md`.

Do not rely on color alone for focus in product UI — this treatment adds separation via the surface gap.

### Compact density guidance

- **Compact Small Button (28px)** meets the WCAG 2.2 AA minimum target size of **24px**.
- For primary touch targets, prefer **40px or larger**.
- Avoid using Compact Small Button for important mobile or touch-heavy actions.
- Density changes spacing/heights only — **font sizes never shrink**, so labels stay readable.

### Disabled state guidance

- Disabled components are **exempt** from standard text-contrast requirements.
- **Do not rely only on color** to communicate the disabled state.
- In product, pair disabled styling with proper behavior: the `disabled` attribute,
  `aria-disabled` where appropriate, blocked interaction, and `not-allowed` cursor feedback.

### Border guidance

- `color/border/default` and `color/card/border/default` are **decorative** borders (<3:1).
- **Do not** use a decorative border as the *only* boundary for an interactive control.
- Future form controls should introduce a stronger, dedicated **control border** token set:
  `color/border/control/default`, `color/border/control/hover`, `color/border/control/focus`,
  `color/border/control/error`. *These are not added yet* — the system currently has no
  form/input components, so they should be created alongside the first input component.

### Re-running the audit

```bash
cd Fukurou
# Refresh tokens from live Figma (use_figma + scripts/figma-export-tokens.js → scripts/save-tokens-export.mjs)
npx tsx scripts/audit-wcag.ts      # prints pass/fail, writes scripts/audit-results.json
```

`scripts/tokens.json` holds the **resolved** Light/Dark hex for every audited token (exported
from the live Figma file with all aliases resolved). If you re-theme or restructure tokens,
refresh that export, then re-run the script.

---

## The 3-tier token system

Fukurou uses a **3-tier token architecture**:

1. **Foundation** — raw values. Example: brand color, neutral color, spacing, radius.
2. **Theme** — semantic design decisions. Example: action, surface, text, border.
3. **Component** — component-specific decisions. Example: button background, text-button content, card border.

**Supporting collections:** `2. Density` · `2. Layout`

Foundation is the primitive/raw-value layer. Theme is the semantic/theme-aware layer.

Every visual value flows through three layers. Components only ever bind to **Tier 3**,
which aliases **Theme**, which aliases **Foundation**. Only Foundation holds raw values.

```
Tier 3  color/button/action/background/default   (`3. Component`)
            ↓ aliases to
Tier 2  color/action/primary/default             (`2. Theme` — Light / Dark)
            ↓ aliases to
Tier 1  color/brand/primary/500                  (`1. Foundation`)
            ↓ value
        #D33F55
```

**Naming rule:** the collection already names the tier, so the tier word is **not** repeated
in variable names. Foundation values never use intent words (no `action` / `danger` / `warning` in
Tier 1 — those are decisions, not raw values).

### Tier 1 — Foundation (`1. Foundation`) — raw values only
Context-free values. Hidden from variable pickers so designers reach for Theme tokens.

- `color/brand/primary/50…900` — generated ramp, `500` = `#D33F55`
- `color/brand/secondary/50…900` — generated ramp, `500` = `#231F20`
- `color/neutral/0…1000` — warm-gray UI scale (`0` = white, `1000` = black)
- `color/red/50…900` — raw red ramp (`500` = `#DC2626`) — **reserved** for future danger/error
- `color/amber/50…900` — raw amber ramp (`500` = `#D97706`) — **reserved** for future warning
- `spacing/0…64`, `radius/0…full`, `border/width/none|sm|md`

Ramps are generated by tinting (toward white) for `50–400` and shading (toward black)
for `600–900`, with the brand/base value pinned at `500`.

### Tier 2 — Theme (`2. Theme`) — intent, theme-aware (Light / Dark)
Intent-based tokens that **alias** Foundation values. This collection carries the **Light** and
**Dark** modes; each token resolves to a different Foundation value per mode.

- `color/action/primary/{default,hover,pressed,subtle,text,disabled}`
- `color/action/secondary/{default,hover,pressed,subtle,text,disabled}`
- `color/surface/{page,card,elevated,subtle,inverse,brand}`
- `color/text/{default,subtle,strong,inverse,disabled,action}`
- `color/border/{default,subtle,strong,focus}`

> There are **no danger/warning Theme tokens yet** — by design. Red and amber stay Foundation-only
> until a component actually needs them (see below).

### Tier 3 — Component tokens (`3. Component`)
Component-specific hooks that **alias** Theme tokens:

- `color/button/{action,secondary,ghost}/{background,text,border}/…`
- `color/button/focus/ring`
- `color/button/focus/gap`
- `color/icon-button/{background,content,focus}/*`
- `color/text-field/{background,border,text,label,helper,error,icon,focus}/*`
- `color/dropdown/*` · `color/dropdown-menu/*`
- `color/radio/*`
- `elevation/{card,button,text-field,popover,modal,dropdown,toast}/*`
- `color/card/{background,border,title,body}`
- `color/card/{background,border,title,body}`

Components also bind to **`2. Density`** (Comfortable/Compact/Spacious)
and **`2. Layout`** (Mobile/Tablet/Desktop/Wide).

Every variable also carries **WEB code syntax** (`var(--…)`) for Dev Mode and code hand-off.

### Naming rules
- Slash `/` separates hierarchy: `color/button/action/background/default`.
- Dash `-` only inside a single segment: `density/button/medium/padding-x`.
- Don't repeat the tier word — the collection name already provides it.
- Keep Foundation values free of intent words (`action`, `danger`, `warning`, `success`, `info`).

---

## v3 — Token naming migration

Names were cleaned up **non-destructively**: variables were *renamed* (Figma keeps the
variable ID, so every alias and component binding survived automatically), and only truly
unreferenced tokens were deleted after their consumers were migrated.

| Old | New | Notes |
|-----|-----|-------|
| `color/primitive/primary/*` | `color/brand/primary/*` | brand identity |
| `color/primitive/secondary/*` | `color/brand/secondary/*` | |
| `color/primitive/action/*` | `color/brand/primary/*` | **merged** — action == brand |
| `color/primitive/danger/*` | `color/red/*` | raw palette, kept for future |
| `color/primitive/warning/*` | `color/amber/*` | raw palette, kept for future |
| `color/primitive/neutral/*` | `color/neutral/*` | dropped `primitive/` |
| `color/semantic/action/primary/*` | `color/action/primary/*` | dropped `semantic/` |
| `color/semantic/surface/*` | `color/surface/*` | |
| `color/semantic/text/*` | `color/text/*` | |
| `color/semantic/border/*` | `color/border/*` | |
| `color/component/button/*` | `color/button/*` | dropped `component/` |
| `color/component/card/*` | `color/card/*` | |
| Button `Type = Warning` | **removed** | amber stays primitive-only |
| Button `Type = Danger` | **removed** | red stays primitive-only |

Also removed (safely, after migrating consumers): the flat `color/semantic/action|warning|danger/*`
v2 intents, the `warning`/`danger` button component tokens, the merged `action` primitive ramp,
and the unused legacy `button/primary/*` component tokens.

### Why Warning & Danger are primitive-only right now

- **Action** is the only filled brand intent the Button needs; **Secondary** and **Ghost**
  cover lower-emphasis actions. Limiting the Button to three types keeps the variant matrix
  small (3 × 3 × 5 = 45) and avoids variants nobody uses.
- **Red** and **Amber** remain available as raw primitives. When you build **Alert, Toast,
  Badge, Banner** or **form validation**, add `danger` / `warning` *semantic* tokens (both
  modes) that alias `color/red/*` / `color/amber/*`, then component tokens for those parts —
  exactly like `action`. Don't wire red/amber straight into components.

---

## Theme modes (Light / Dark)

Light and Dark live as **modes on the `2. Theme` collection** (the theme/semantic layer). Only
semantic tokens change between modes — components never override colors themselves.

```
color/button/action/background/default
        ↓ aliases to
color/action/primary/default     ← swaps value between Light and Dark
        ↓ aliases to
color/brand/primary/500 (Light)  ·  color/brand/primary/400 (Dark)
        ↓ value
        #D33F55
```

To switch a frame's theme in Figma: select the frame → right panel → **Variable modes →
Light / Dark** (`setExplicitVariableModeForCollection` in code). Every nested component
re-themes automatically. The **Naming, Theme, Density & Responsive** page has a live Light vs
Dark preview built from the same Action/Secondary/Ghost instances.

> Design note: Figma modes are per-collection, so Light/Dark sit on the semantic tier itself
> rather than a separate "Theme" collection — keeping the semantic layer the single source of
> truth and preserving the clean 3-tier model.

---

## Density modes (Compact / Comfortable / Spacious)

The `2. Density` collection drives component `height`, `padding-x` and `gap`. Button and Card
bind their sizing to it.

| Mode | Use it for |
|------|-----------|
| **Comfortable** (default) | The standard product experience |
| **Compact** | Data-heavy / enterprise UIs — tables, dashboards, dense forms |
| **Spacious** | Marketing, onboarding, mobile-first and touch-heavy UIs |

Switch the **`2. Density`** mode on a frame to retune spacing without editing any component.
Comfortable is the default so existing layouts keep their current look.

---

## Responsive Layout modes (Mobile / Tablet / Desktop / Wide)

The `2. Layout` collection stores responsive reference values: `breakpoint/min-width`,
`grid/columns`, `grid/gutter`, `grid/margin`, `container/max-width`, `section/padding-x`,
`section/padding-y`.

**Figma does not switch layouts by viewport width automatically.** Designers pick the correct
Layout mode on a frame; developers map the same values in code (media/container queries).
`container/max-width` is a number — **Mobile uses `0` as a documented sentinel meaning
"100% / fluid"**, because Figma variables can't store percentages.

---

## Card content options

The `Card` is a single flexible component set — one **Media** variant plus boolean/text/swap
properties, so there is no variant explosion. The **outer card** owns the background, border,
radius and clipping (padding `0`); a padded **content container** (bound to `density/card/padding`
and `density/card/gap`) holds the icon, text and footer.

### Component properties

| Property | Type | Default | Notes |
|----------|------|---------|-------|
| `Media` | Variant | `None` | `None` / `Image` / `Icon` — mutually exclusive |
| `Show title` | Boolean | `true` | Collapses the title and its spacing |
| `Show body` | Boolean | `true` | Collapses the body and its spacing |
| `Show footer` | Boolean | `true` | Collapses the footer (nested ghost button) |
| `Title` | Text | `Card title` | |
| `Body` | Text | `Use this card to group related content and actions.` | |
| `Icon` | Instance swap | `Icon / Placeholder / Star` | Only meaningful when `Media = Icon` |

### Media options

- **`None`** — simple content card (no top media area).
- **`Image`** — for editorial, product, marketing or feature cards. The image area **intentionally
  removes top/left/right padding** so it bleeds flush to the card edges; it respects the card's
  top corner radius via the outer clip. Placeholder: fill `color/surface/subtle`, height `160px`,
  top corners `radius/12`, bottom corners `0`. The content below keeps normal card padding.
- **`Icon`** — for feature summaries, empty states, onboarding or service highlights. A `48×48`
  icon container (`color/action/primary/subtle`, `radius/12`) holds a `24×24` glyph
  (`color/text/action`) **inside** the normal content padding, so it reads as part of the content.
- **Never use Image and Icon together** — the `Media` variant enforces this.

### Text visibility

- `Show title` / `Show body` turn each text layer on/off. Auto-layout **collapses the spacing
  automatically** — no awkward empty gaps. Supported: Title+Body, Title only, Body only, and
  (with media/footer present) neither.
- Avoid hiding **both** title and body unless the card still carries meaning via media, icon or footer.

```
Image Card                         Icon Card
Card (bg, border, radius, clip)    Card (bg, border, radius, clip)
 → Image area (flush, no padding)   → Content area (normal padding)
 → Content area (normal padding)       → Icon
    → optional Title                    → optional Title
    → optional Body                     → optional Body
    → optional Footer                   → optional Footer
```

### Accessibility notes (cards)

- **Images:** provide real **alt text** in product; use **empty alt** for purely decorative images.
- **Icons:** give informational icons an accessible label or supporting text — **don't rely on the
  icon alone** to convey meaning.
- If the **title is hidden**, ensure context still comes from body, image, icon or footer; if the
  **body is hidden**, make the title descriptive.
- Maintain proper **heading order** when the card title maps to a heading on a product page.
- If a card becomes fully clickable in the future, give it a **visible focus state**. This update
  does **not** make the whole card clickable.

---

## Button hierarchy

The **`Button`** set keeps three **Type** variants only: **Action**, **Secondary**, **Ghost**.
**Text Button** is a **separate component** — not a Button Type.

> **Rule:** Action Button = filled primary brand action · Ghost Button = outlined secondary brand action · Text Button = action that visually behaves like text

### Action Button

Filled button for the **highest-priority** action. No visible default stroke.

Examples: Save, Continue, Submit, Get started

Tokens: `color/button/action/background/*` → `color/action/primary/*` · text → `color/text/inverse`

### Secondary Button

Lower-emphasis **filled neutral** button for secondary actions. No visible default stroke.

Examples: Preview, Duplicate, Add another

Tokens: `color/button/secondary/background/*` → `color/action/secondary/*` · text → `color/text/inverse`

### Ghost Button

**Transparent background + visible stroke + normal Button padding/height.** Uses the
**secondary brand color** for text and border — not the primary/action pink. Still reads as a
button — lower emphasis than filled buttons, higher than text-only.

Examples: Learn more, View details, Export, Add another (secondary CTA beside Action)

```
color/button/ghost/background/default  → transparent
color/button/ghost/text/default        → color/action/secondary/text
                                         → color/brand/secondary/700 (Light)
                                         → color/brand/secondary/300 (Dark)
color/button/ghost/border/default      → color/action/secondary/default
                                         → color/brand/secondary/500 (Light)
                                         → neutral/100 (Dark — lighter for contrast)
```

Hover/pressed update fill (`surface/subtle`, `action/secondary/subtle`) and text/border via
`color/button/ghost/background/*`, `text/*`, and `border/*` tokens. Focus ring stays
`color/border/focus` (primary brand — unchanged).

### Icon swapping in Buttons

`icon-left` and `icon-right` are **component instances** of `Icon / Placeholder / Star` (not plain frames). *Live file currently has only the **Star** placeholder set (Size=16/20/24); Arrow Right and Plus sets are not present — previous value not confirmed.*

| Property | Type | Purpose |
|----------|------|---------|
| **Show left icon** | Boolean | Show/hide left icon — spacing collapses when off |
| **Show right icon** | Boolean | Show/hide right icon — spacing collapses when off |
| **Left icon** | Instance swap | Replace left placeholder with any icon component |
| **Right icon** | Instance swap | Replace right placeholder with any icon component |

Icon placeholder sizes: **16px** (Small Button) · **20px** (Medium) · **24px** (Large). Each normalized Fukurou icon uses an internal vector layer named **`icon`**.

### Button Icon Color

Button **content color** controls both label and icon color.

**Rule:** `label color = left icon color = right icon color`

| Button type | Content tokens (use these in Button components) |
|-------------|--------------------------------------------------|
| Action | `color/button/action/content/*` (default, hover, pressed, focus, disabled) |
| Secondary | `color/button/secondary/content/*` |
| Ghost | `color/button/ghost/content/*` |
| Text Button | `color/text-button/content/*` |

- **Content tokens alias** the existing `text/*` tokens (e.g. `color/button/action/content/default` → `color/button/action/text/default`). Legacy `text/*` tokens are **preserved** for compatibility.
- **Scopes:** content tokens include `TEXT_FILL`, `SHAPE_FILL`, and `STROKE_COLOR` so they appear when binding label text, vector fills, and stroke-based icons.
- **Local Fukurou icons** (`Icon / Placeholder / Star` only in current live file) inherit Button content color reliably via instance overrides.
- **External library icons** may not inherit Fukurou variables if the source icon uses hard-coded fills, locked internals, or incompatible layer structure.

**If a swapped external icon turns black or does not inherit the Button color:**

1. Duplicate or import the external icon into the Fukurou icon library.
2. Normalize the vector layer name to **`icon`**.
3. Remove hard-coded fills/strokes.
4. Bind the vector fill/stroke to the correct Button **content** token.
5. Use that normalized local icon component in Button instance swaps.

Do not replace icon slots with plain frames — frames cannot be swapped from the instance panel.

**Layout:** Button width **hugs contents** (expands with label text). Height is fixed per size via density tokens. Label and icons sit in horizontal auto-layout; hidden icons collapse spacing. Labels are single-line by default.

### Text Button (separate component)

**No background, no stroke, minimal visual padding** (`spacing/text-button/padding-x/y`).
**Separate from Button** — not a Button Type variant.

**Per-state content fill tokens** (each variant binds independently — only `Label` characters are shared):

| State | Content fill token | Typography | Underline |
|-------|-------------------|------------|-----------|
| Default | `color/text-button/content/default` | `typography/text-button/[size]` | No |
| Hover | `color/text-button/content/hover` | same size specs | **Yes** |
| Pressed | `color/text-button/content/pressed` | `typography/text-button/[size]` | No |
| Focus | `color/text-button/content/focus` | `typography/text-button/[size]` | No (2px focus ring) |
| Disabled | `color/text-button/content/disabled` | `typography/text-button/[size]` | No |

Legacy `color/text-button/text/*` tokens remain for compatibility. Icons use the same **content** token as the label.

Hover background stays **transparent** (no `surface/subtle` fill).

| Size | Font | Size / LH |
|------|------|-----------|
| Small | Poppins Regular | 14 / 20 |
| Medium | Poppins SemiBold | 14 / 20 |
| Large | Poppins Regular | 18 / 28 |

Underline styles also exist in the library as `typography/text-button/[size]/underline`. Hover underline is applied **directly on the label layer** per variant (variant sets can sync `textStyleId` across states if applied at set level).

Examples: Cancel, Back, Edit, Remove, inline “Learn more”

> Ghost Button = button shape without fill · Text Button = text action without container · **Icon Button** = circular icon-only or number-only compact action

Component tokens: `color/text-button/text/*`, `color/text-button/background/*` → transparent, `color/text-button/border/focus`, `spacing/text-button/*`

### Icon Button

**Icon Button** is a **circular compact action button** — separate from the main `Button` set.

Available in **one size only: Small (32×32px circle, 16px icon)**. Icon Button is intended for compact UI actions, toolbar actions, badges, compact controls, and small circular action targets — not full-width or touch-primary CTAs.

| Property | Values |
|----------|--------|
| **Content** | Icon (instance swap) · Number (editable text, default `"01"`) |
| **State** | Default · Hover · Pressed · Focus · Disabled |

| State | Background | Content |
|-------|------------|---------|
| Default | transparent | `color/text/action` |
| Hover | `action/primary/subtle` | `color/text/action` |
| Pressed | `action/primary/default` | `color/text/inverse` |
| Focus | transparent + **offset ring** | `content/focus` |
| Disabled | transparent · opacity 0.6 | `color/text/disabled` |

Component tokens: `color/icon-button/background/*`, `color/icon-button/content/*`, `color/icon-button/focus/ring`, `color/icon-button/focus/gap`

**Size token:** `density/icon-button/small/size` (32×32 Comfortable · 28 Compact · 36 Spacious)

**Theme:** Light/Dark via `2. Theme` mode on parent frames — no duplicate components.

**Examples:** `Icon Button / Examples` on the Button page (Light + Dark demo grids).

### Text Field

**Text Field** is a **single-line text input** for forms — inspired by friendly rounded tax-product form fields, adapted to the Fukurou brand (not a copy).

| Property | Values |
|----------|--------|
| **State** | Default · Hover · **Active** · Filled · Error · **Error Active** · Disabled |
| **Size** | Small (40px height) · Medium (48px height) — default **Small** |
| **Show label** · **Helper Text** · **Error Text** · **Required** · **Leading Icon** · **Trailing Icon** · **Helper Icon** · **Focus Ring** | boolean |
| **Change Helper / Leading / Trailing Icon** | instance swap |

**Anatomy:** `label-row` → `input-container` (`focus ring` absolute rectangle + `left` frame with icons/text/`active group` caret + trailing icon + cancel **Icon Button** in Active) → `helper` frame (icon + text) → `error` frame.

**Focus vs Active:**

- **Active** / **Error Active** = editing/interaction states (clicked, tapped, typing) — caret via **`active group`** + **`Cursor`**; cancel Icon Button visible.
- **Focus Ring** boolean = keyboard-visible focus indicator (`:focus-visible` in product code) — separate from Active.
- There is **no** separate **Focus** state variant and **no Show caret** property (*manual model*).

**Layout:** Outer frame hugs content. Show label = false collapses label row (Small Default: 64px → 40px). Helper Text toggles helper frame. On **Error** / **Error Active**, error text is forced visible (Error Text may not hide it — see `CURRENT_FIGMA_STATE.md`).

**Tokens:** `color/text-field/*` · `density/text-field/*` · live focus ring stroke binds **`color/border/focus`** (*`color/text-field/focus/ring|gap` exist but are unused on canvas*).

**Examples:** **`Text Field Examples`** on the **Form** page (`255:772`).

**Accessibility:** Visible label or accessible name; placeholder is not a label; error message is text (not color alone); use **Focus Ring** / `:focus-visible` for keyboard focus; Active/editing ≠ Focus Visible; disabled state is **Exempt / Disabled state**.

> **Baseline for future Cursor work:** live **Text Field** (`241:244`) + `CURRENT_FIGMA_STATE.md` Text Field section (**2026-07-17**). Do **not** rebuild or revert manual Text Field edits.

### Search Field

**Search Field** is a **specialized form control** for search queries and filtering — table search, page-level search, filter search, list search, and dashboard/settings search. Built on **Text Field** patterns with search-specific anatomy. **State model matches Text Field** (2026-06-15 live inspection).

| Property | Values |
|----------|--------|
| **State** | Default · Hover · **Active** · Filled · Error · **Error Active** · Disabled |
| **Size** | Small (40px input height) · Medium (48px input height) |
| **Show label** · **Helper Text** · **Focus Ring** · **Show icon** | boolean |
| **Helper Icon** | instance swap |

**Anatomy:** `label-row` → `input-container` (`search-icon` + placeholder/value + `clear-button` + `focus ring` rectangle) → `helper` frame (icon + text) → `error` frame.

**Focus vs Active** (same model as Text Field):

- **Active** / **Error Active** = editing/interaction states.
- **Focus Ring** boolean = keyboard-visible focus indicator (`:focus-visible` in product code) — separate from Active.
- There is **no** separate **Focus** state variant (*removed in manual edit*).

**Search icon:** Always visible in the input. Live instance **24×24** on both sizes (*verify against design intent*).

**Clear button:** **Active** / **Error Active** show cancel **Icon Button**. **Filled** / **Error** have **no clear layer** in the current live file (*manual change — see `CURRENT_FIGMA_STATE.md`*). Product code should still expose a labeled clear control when a value is present.

**Layout:** Show label = false collapses label row (64px → 40px). Helper Text toggles helper frame. Error text appears on **Error** / **Error Active** states only (no Error Text boolean).

| State | Notes |
|-------|-------|
| Default | Search icon + placeholder |
| Hover | Stronger border |
| Active | Value visible, placeholder hidden |
| Filled | Value visible · **no clear layer in live Figma** |
| Error / Error Active | Error frame visible · **Error Active** shows cancel **Icon Button** |
| Disabled | Muted — non-interactive |

**Tokens:** `color/search-field/*` · helper/error reuse **`color/text-field/helper/*`** and **`color/text-field/error/*`** on live set · **`density/text-field/*`** · focus ring stroke → **`color/border/focus`**

**Documentation:** In-section Light/Dark example grid inside **`Component/Seach Field`** on the **Form** page (typo in live section name).

**Accessibility:** Visible label or accessible name required; placeholder is not a label; search icon is decorative; associate error text programmatically in code; use **Focus Ring** / `:focus-visible` for keyboard focus; use `type="search"` when appropriate; clear button needs accessible label when shown.

### Date Picker

**Date Picker** is a **single-date form control** for appointment, due, birth, start, scheduled, and report dates. Aligns with Text Field / Search Field / Dropdown. **Not** a Date Range Picker.

| Property | Values |
|----------|--------|
| **State** | Default · Hover · Active · Filled · Error · Error Active · Disabled |
| **Size** | Small (~40px) · Medium (~48px) |
| **Show label** · **Required** · **Helper Text** · **Error Text** · **Show calendar icon** · **Focus Ring** | boolean |
| **Text** | Label · Placeholder · Selected date · Helper text · Error text |

**Anatomy:** label row → trigger (placeholder/value + calendar icon) → helper/error. **Calendar Popover** is a separate open-state surface (header, weekdays, day grid, Today/Clear) so closed triggers hug content.

**Internal / supporting:** `.Base / Calendar / Day Cell` · `.Base / Calendar / Nav Button` · `Calendar Popover`. Calendar Previous/Next controls use the internal calendar-specific nav button (visually inspired by Icon Button, but **not** a public Icon Button instance — a 2026-07-27 attempt to reuse Icon Button directly was reverted). Product code should label them `Previous month` / `Next month`.

**Tokens:** `color/date-picker/*` · `color/calendar/*` · `elevation/calendar/default` · `density/calendar/*`

**Documentation:** Figma section **`Component/Date Picker`** (Light + Dark examples) · HTML docs interactive example. The docs calendar popover is anchored to the trigger and opens about **2px** below it (corrected 2026-10-05; Light/Dark verified).

**Docs example reconciliation (2026-10-05):** HTML calendar now matches Figma Day Cell + Calendar Popover — 36px **circular** cells (`radius/full`), circular Hover (`#fafaf9` / `#000`) and Selected (`#d33f55` + white / `#fff` + `#231f20`) fills, **Today** 2px outline (`#000` / `#fff`), 2px focus outline, Disabled/Outside text tokens, popover `#fff` / `#1c1917` with `elevation/Popover` shadow, 16px Regular month label, 12px two-letter weekdays, no footer divider. Figma file unchanged.

**Accessibility:** Visible label or accessible name; placeholder/icon are not labels; Focus Visible unclipped; keyboard open/navigate/select/close; disabled dates exempt for contrast; announce selected date in product code.

### Textarea

> **Not in live Figma file (2026-06-15).** Component, tokens, and examples were removed after a prior session. Local scripts remain for reference — always inspect the live file before re-running.

### Selector / Dropdown

**Selector / Dropdown** is a **single-select form control** — aligned with **Text Field** / **Search Field** form patterns (not a copy).

| Piece | Details |
|-------|---------|
| **Selector / Dropdown** | **14 variants** — Default · Hover · **Active** · Filled · Error · **Error Active** · Disabled × Small · Medium |
| **`.Base/ Dropdown / Menu / Option`** | Default · Hover · Selected · Disabled — **internal** |
| **Selector / Dropdown / Menu** | Elevated panel (`Elevation / Popover`) |

**Properties:** Show label · **Helper Text** · Required · Show leading icon · Leading icon · **Helper Icon** · **Change Helper Icon** · **Focus Ring** — **no Focus state variant**; **no editable TEXT props** on live set.

**Anatomy:** `label-row` → `select-trigger` (leading icon, placeholder/value, chevron, **focus ring**) → **`Helper`** / **`Error`** frames

**Focus vs Active:** **Focus Ring** boolean = keyboard `:focus-visible`; **Active** = interaction/menu-open appearance — separate concepts.

**Tokens:** `color/dropdown/*` · `color/dropdown-menu/*` · `color/border/control/*` · `density/dropdown/*` · `elevation/dropdown/default`

**Default copy:** Filing status · Select an option · Single · tax-style option list in menu demo

**Accessibility:** Visible label; error text below trigger; focus ring (not shadow alone); correct select/listbox semantics in product code; chevron/checkmark need accessible names in implementation

**Examples:** `Dropdown Selector Examples` on **Form** page

**Scripts:** `scripts/figma-dropdown-tokens.js` · `figma-dropdown.js` · `figma-dropdown-examples.js`

### Radio Selector → **Selector / Radio Button**

**Selector / Radio Button** is for **mutually exclusive choices** when all options should be visible — aligned with Text Field and Selector / Dropdown form patterns.

| Property | Values |
|----------|--------|
| **State** (VARIANT) | Default · Hover · Focus · Disabled · Error |
| **Selected** (VARIANT) | True · False |
| **Label**, **Description** (TEXT) | Individual / filing helper copy |
| **Show description** (BOOLEAN) | Collapses description when false |

**Anatomy:** `radio-indicator` (20px circle + 8px selected dot) + `content` (label + description)

**Tokens:** `color/radio/*` · `density/radio/*` · focus ring via `color/radio/focus/*`

**Selected state:** Brand border + inner dot — not color alone

**When to use:** Small visible option sets · use **Dropdown** for long lists

**Accessibility:** Native radio or ARIA `radiogroup` + group label/legend; focus ring required; disabled exempt from full contrast

**Examples:** `Radio Selector Examples` on **Form** page (includes **Filing type** radio group)

**Scripts:** `scripts/figma-radio-tokens.js` · `figma-radio.js`

### Checkbox

**Checkbox** → live name **`Selector / Checkbox`** — for **independent selections**. Use **Selector / Radio Button** for mutually exclusive choices.

| Property | Values |
|----------|--------|
| **State** (VARIANT) | Default · Hover · Focus · Disabled · Error |
| **Checked** (VARIANT) | True · False |
| **Indeterminate** (VARIANT) | True · False |
| **Label**, **Description** (TEXT) | "I agree to the terms" / preferences helper copy |
| **Show description** (BOOLEAN) | Collapses description when false |
| **Show content** (BOOLEAN) | Collapses label + description when false — *live default: true* |

**Anatomy:** `checkbox-indicator` (20px rounded box + 12px checkmark / 10×2 indeterminate bar) + `content` (label + description)

**Tokens:** `color/checkbox/*` · `density/checkbox/*` · focus ring via `color/checkbox/focus/*`

**Checked / indeterminate state:** Brand fill + visible mark (checkmark or center bar) — not color alone

**When to use:** Independent / multiple selections · confirmations · on/off toggles in a visible list

**Accessibility:** Native `<input type="checkbox">` with associated label (set `indeterminate` via JS); group in `<fieldset>`/`<legend>`; strong 2px offset focus ring; group errors as text; disabled exempt from full contrast

**Examples:** `Checkbox Examples` on **Form** page (includes **Income sources** checkbox group, Light + Dark)

**Scripts:** `scripts/figma-checkbox-tokens.js` · `figma-checkbox.js` · `figma-checkbox-examples.js` · `figma-checkbox-docs.js`

### Jumbo Select Button

**Jumbo Select Button** is a **large selectable option card** — for choosing a plan, account type, payment method, workflow option, or filing type from a small set of visually important options. It **represents a selectable option, not an action** — that is what distinguishes it from Button.

| Property | Values |
|----------|--------|
| **State** | Default · Hover · Pressed · **Focus Visible** · **Selected** · **Selected Hover** · Disabled |
| **Size** | Small (56px) · Medium (72px, default) · Large (**104px** live) |
| **Show icon** · **Show sub label** · **Show selected indicator** | boolean (hidden layers collapse) |
| **Label** / **Sub label** | text — defaults `Individual` / `Best for filing your own return.` |
| **Icon** | instance swap — verify default in live file |

**Anatomy:** outer focus-ring host (2px padding, not clipped) → `container` (card-style, `radius/12`) → `icon-container` (20/24/32px; **Large:** optional `icon/background` subtle chip) → `text-container` → `indicator` (check circle on Selected).

**Focus Visible vs Selected:** **Focus Visible** = keyboard `:focus-visible` offset ring outside container. **Selected** = choice state — border + background + **check indicator** (not color alone; live styling may use success-green indicator — verify in Figma).

**Tokens:** **27** `color/jumbo-select-button/*` in live file (export may lag).

**Accessibility:** Radio/checkbox semantics as appropriate. Disabled = **Exempt / Disabled state**. WCAG: **408 pairs · 0 non-exempt failures** (2026-07-13).

**Examples:** **`Component/Jumbo Select Button`** section — user matrix in **`Checkbox Examples`**; legacy Light/Dark frames on Form page root.

### Notification Button

**Notification Button** is a **specialized icon-only button** for notification entry points — a header bell, alerts center, inbox indicator, or activity feed. It is **built on the Icon Button foundation** (reusing its shape, size, states, focus ring, and `color/icon-button/*` tokens) and adds a badge layer — without polluting the base Icon Button.

| Property | Values |
|----------|--------|
| **State** (VARIANT) | Default · Hover · Pressed · Focus · Disabled |
| **Badge** (VARIANT) | None · Dot · Count |
| **Count** (TEXT) | Editable, default `3`, supports `99+` |

**Anatomy:** Icon Button structure (`button-body` + bell `icon`) + absolutely-positioned `badge-dot` **or** `badge-count` pinned top-right (overflowing, not clipped)

**Tokens:** `color/notification-button/badge/*` + `dot/*` · `density/notification-button/*` (dot-size, badge-min-height, badge-padding-x) — the button reuses `color/icon-button/*` and `density/icon-button/small/size`

**Badge:** red (`red/600`) fill, white count text (6.65:1), `surface/page` "notch" border, full radius. The **bell icon is fixed** (drawn vector) to keep state colors reliable.

**When to use:** Notification/alert entry points where unread/new activity must be signalled.

**Accessibility:** Provide an accessible label that includes the count (`aria-label="Notifications, 3 unread"`); the badge must **not** be the only signal of critical info; keep the focus ring visible.

**Examples:** `Notification Button Component` frame on **Notifications** page (No badge · Dot · Count · 99+ · Focus · Disabled, Light + Dark)

**Scripts:** `scripts/figma-notification-button.js` · `figma-notification-button-examples.js` · tokens in `figma-feedback-tokens.js`

### Snackbar

**Snackbar** is **short, temporary feedback** after a user or system action ("Changes saved.", "Link copied."). It is lightweight and dismissible — **not** a replacement for persistent or critical alerts.

| Property | Values |
|----------|--------|
| **Tone** (VARIANT) | Neutral · Success · Warning · Danger · Info |
| **Show icon / Show action / Show close** (BOOLEAN) | Live defaults: **true, true, true** |
| **Message** (TEXT) | Default `"Changes saved."` |

**Anatomy:** horizontal auto-layout → **`left`** frame (optional `leading-icon` · `message` · optional **Ghost Button** action) · optional **Icon Button** close. Hugs content.

**Visual direction:** **Theme-aware elevated surface** (`color/surface/elevated` via `color/snackbar/background/*`) — **not** a fixed dark bar. Tone via **colored leading icon + accent border**. `radius/12`, floating elevation.

**Tokens:** `color/snackbar/*` · `density/snackbar/*` · `elevation/snackbar/default` → `elevation/floating`.

**When to use:** Transient confirmations and lightweight errors. For persistent/critical messaging use an inline alert/banner instead.

**Accessibility (2026-06-15 audit):** All **30** snackbar token pairs pass (0 non-exempt failures). Message, action, close, icons, and borders pass in Light and Dark on elevated surface. In product: visible focus on action/close, accessible dismiss label, adjustable auto-dismiss.

**Examples:** **`Component/Snackbar`** section on **Notifications** page (18 instances — tones, toggles, long message)

**Scripts:** `scripts/figma-snackbar.js` · `figma-snackbar-examples.js` · `figma-feedback-tokens.js` · `figma-feedback-docs.js` *(generator scripts may predate manual Snackbar update — live Figma is source of truth)*

### Alert / Banner

**Alert / Banner** is for **persistent system messages** (informational notices, success confirmations, warnings, errors). Unlike Snackbar, it stays visible until resolved or dismissed.

| Property | Values |
|----------|--------|
| **Tone** (VARIANT) | Neutral · Info · Success · Warning · Danger |
| **Show icon / Show title / Show action / Show close** (BOOLEAN) | Toggle optional elements |
| **Title / Message / Action** (TEXT) | Editable copy |

**Visual:** Subtle tone backgrounds + visible border · tone icon · `radius/12` · auto-layout (short and long messages).

**Tokens:** `color/alert/*` · `density/alert/*` · Theme **`color/status/{success,warning,info}/subtle`** added for subtle fills.

**When to use:** Page-level or inline persistent notices. **Not** temporary feedback (use Snackbar).

**Accessibility:** Meaning via text + icons (not color alone); warning/danger include icons; dismiss needs an accessible label; use `role="alert"` for critical messages in code. WCAG text pairs for all tones **pass** in both themes (audit 2026-06-15).

**Examples:** `Alert Banner Component` on **Notifications** page (Light + Dark)

**Scripts:** `figma-alert.js` · `figma-alert-examples.js` · `figma-overlay-tokens.js`

### Tooltip

Short **contextual help** for icons and controls — not for critical information or long content.

| Property | Values |
|----------|--------|
| **Placement** (VARIANT) | Top · Right · Bottom · Left |
| **Show arrow** (BOOLEAN) | Optional caret |
| **Tooltip text** (TEXT) | Editable |

**Visual:** Inverse surface + inverse text (theme-aware) · compact padding · floating elevation.

**Tokens:** `color/tooltip/*` · `density/tooltip/*` · `elevation/tooltip/default`

**Accessibility:** Keep copy short; support keyboard/screen-reader patterns in code; ensure trigger focus is visible. Tooltip text **passes** contrast on inverse surface (Light 16.30:1 · Dark 12.07:1).

**Examples:** On **Notifications** page (component set only — dedicated example frame **not in live file**; *previous `_Documentation` frame removed*)

**Scripts:** `figma-tooltip.js` · `figma-overlay-tokens.js`

### Progress Bar

**Progress Bar** communicates **completion progress** for onboarding, forms, checkout, uploads, and dashboard tasks — where the user is, how much is done, and how much remains.

| Property | Values |
|----------|--------|
| **value** (VARIANT) | 0% · 20% · 50% · 75% · 100% — *lowercase axis* |
| **size** (VARIANT) | small · medium · large — *lowercase options* |
| **Show step label / Show percentage label** (BOOLEAN) | Toggle either label |
| **Step label / Percentage label** (TEXT) | Editable (defaults e.g. `Step 1 of 5` · `20% complete`) |

**Anatomy:** Header row (step label left · percentage right) + rounded track with brand fill segment. Auto-layout · fill width varies by value variant · **0%** hides fill.

**Tokens:** `color/progress-bar/track/background/default` → `surface/subtle` · `color/progress-bar/fill/background/*` → `brand/primary/500` · `color/progress-bar/label/default` → `text/default` · `color/progress-bar/value/default` → `text/subtle`

**Accessibility:** Do **not** rely on color alone — keep percentage (and/or step) text visible when progress matters. In code use `role="progressbar"` with `aria-valuenow` / `aria-valuemin` / `aria-valuemax` and an accessible name. Label and value text **pass** WCAG 4.5:1; fill vs track **pass** 3:1 non-text (Light **4.17:1** · Dark **3.33:1**).

**Examples:** **`Progress Bar Component`** on the **Navigation** page (`459:2136`) alongside Pagination.

**Scripts:** `scripts/figma-progress-bar.js` · `figma-progress-bar-examples.js`

### Modal / Dialog

**Blocking focused tasks** — confirmations, short forms, important decisions. Not for simple temporary feedback.

| Property | Values |
|----------|--------|
| **Type** (VARIANT) | Default · Confirmation · Danger confirmation |
| **Size** (VARIANT) | Small · Medium · Large |
| **Show close / Show footer / Show secondary** (BOOLEAN) | Optional chrome |
| **Title / Body** (TEXT) | Editable |

**Anatomy:** Header · body · footer with **Button** + **Icon Button** instances (no duplicated button logic).

**Tokens:** `color/modal/*` · `density/modal/*` · `elevation/modal/default`

**Accessibility:** Trap focus · accessible title · Escape to close · labeled close button · inert background. Title/body text **pass** on modal surface. Modal border and overlay token pairs **fail** non-text 3:1 in audit (same class as Card border — use product scrim opacity for overlay).

**Examples:** **`Modals`** page (component set + WIP instances — dedicated example frame **not in live file**)

**Scripts:** `figma-modal.js` · `figma-overlay-tokens.js`

### Toggle / Switch

**Binary on/off** settings and preferences — not for form submission or single-choice lists (use Checkbox or Radio Selector).

| Property | Values |
|----------|--------|
| **State** (VARIANT) | Default · Hover · Focus · Disabled |
| **Checked** (VARIANT) | True · False |
| **Show description** (BOOLEAN) | Optional helper text |
| **Label / Description** (TEXT) | Editable |

**Visual:** Off = neutral track · On = primary brand track · Focus = 2px brand ring + 2px gap (not clipped).

**Tokens:** `color/switch/*` · `density/switch/*`

**Accessibility:** Visible label required; state not by color alone (thumb position + label); native switch semantics in code. Label/description **pass**. Off-state thumb vs track **passes** non-text 3:1 (Light **4.80:1** · Dark **6.93:1** — audit 2026-06-19).

**Examples:** `Toggle Switch` frame on **Form** page (Light + Dark)

**Scripts:** `figma-switch.js` · `figma-switch-examples.js` · `figma-overlay-tokens.js`

### Pagination

Navigate paginated tables, search results, lists, and dashboards. **Public composed bar:** **`Pagination Desktop`** on the **Navigation** page. Page cells are internal **`.Base / Pagination / Item`** sets. Previous/next controls are **`Icon Button`** instances (not dedicated pagination text buttons).

| Component | Role |
|-----------|------|
| **`Pagination Desktop`** | **Size** (Small · Medium) · **`Show Jumper`** boolean — composed bar |
| **`.Base / Pagination / Item`** | **internal** — State × Size · **Page number** text |
| **`.Base / Pagination / Ellipsis`** | **internal** — Size only |
| **`Pagination Mobile`** | **Instance** on Navigation — jumper row (Text Field + Icon Buttons) when Show Jumper = true |

**Live layout:** Sets on **Navigation** · **`Component/Pagination`**. Examples on **Navigation** · **`Pagination Examples`**.

**Visual (live):** Page items = pill/circle · Active = primary fill + **Regular** 14px · Prev/next = **Icon Button** · Optional jumper column (`Go to` + page input).

**Tokens:** `color/pagination/*` · `density/pagination/*` — prev/next may use **`color/icon-button/*`** in practice (**needs verification**).

**Accessibility:** Use navigation semantics; `aria-current="page"`; label icon buttons for prev/next/jumper. Pagination control icon/text pairs **pass** in Light and Dark (audit **2026-06-19** — see **`ACCESSIBILITY_AUDIT.md`**).

**Scripts (historical — do not re-run to overwrite manual Figma edits):** `figma-pagination-tokens.js` · `figma-pagination.js` · `figma-pagination-examples.js`

### Elevation & Shadow

Inspired by the restrained depth of **Vercel**, the practical elevation hierarchy of **Atlassian**, and the tokenized component mapping approach of **Polaris** — adapted to Fukurou (not copied).

| Tier | Tokens |
|------|--------|
| **Foundation** | `effect/shadow/none`, `50`–`600` — STRING CSS values (ink `#231F20`) |
| **Theme** | `elevation/none`, `surface`, `raised`, `floating`, `popover`, `modal`, `overlay` |
| **Component** | `elevation/card/*`, `elevation/button/*`, `elevation/text-field/*`, `elevation/popover/default`, etc. |

**Figma effect styles:** `Shadow / *` (raw scale) · `Elevation / *` (semantic) — apply these in design files.

**Dark mode:** Combine subtle shadows with `color/surface/overlay`, `color/surface/floating`, and `color/border/elevated`.

| Component | Elevation |
|-----------|-----------|
| Card default | `elevation/surface` |
| Card hover | `elevation/raised` |
| Dropdown / Popover | `elevation/popover` |
| Modal | `elevation/modal` |
| Toast / Snackbar | `elevation/floating` |
| Button / Text Field / Icon Button / Notification Button | `elevation/none` |

**Usage:** Subtle shadows for everyday surfaces; stronger shadows only for floating UI. Do not use shadow as decoration. Focus uses rings, not elevation.

**Limitation:** Figma Plugin API cannot create `EFFECT`-type variables — STRING tokens + effect styles are the dual-layer approach.

**Examples:** `Foundations / Elevation and Shadow` frame on the **Foundations** page.

### Accessibility (buttons)

- **Ghost** keeps normal Button sizing and padding (Density heights ≥ 24px AA minimum).
- **Icon Button** Small (32px) meets WCAG 2.5.8 minimum target size (24px); use padding or hit-area expansion in product for touch-primary actions.
- **Text Button** looks compact in Figma — in product, preserve a **minimum 24px hit target**
  (prefer **40–44px** for touch). Do not rely on color alone for hover/pressed/focus/disabled.
- Disabled text contrast is WCAG-exempt but often hard to read — don't use disabled Text Button
  for important information.

See the **Button / Hierarchy Examples** and **`Icon Button / Examples`** frames on the Button page.

---

## Mapping tokens to code (CSS variables / design tokens)

Every variable carries a **WEB code syntax** of the form `var(--<name-with-dashes>)`, so the
Figma name maps 1:1 to a CSS custom property:

```css
/* Tier 1 (raw) */
--color-brand-primary-500: #D33F55;
--color-red-500: #DC2626;     /* reserved */
--color-amber-500: #D97706;   /* reserved */

/* Tier 2 (theme-aware) — emit one block per theme */
:root,[data-theme="light"]{ --color-action-primary-default: var(--color-brand-primary-500); }
[data-theme="dark"]       { --color-action-primary-default: var(--color-brand-primary-400); }

/* Tier 3 (component) */
--color-button-action-background-default: var(--color-action-primary-default);

/* Density — emit one block per density */
[data-density="comfortable"]{ --density-button-medium-height: 40px; }
[data-density="compact"]    { --density-button-medium-height: 36px; }

/* Layout — emit per breakpoint via media queries */
@media (min-width:1024px){ :root{ --layout-grid-columns: 12; --layout-container-max-width: 1120px; } }
```

Theme = a `data-theme` attribute (or `prefers-color-scheme`); Density = a `data-density`
attribute; Layout = media queries keyed off `layout/breakpoint/min-width`. A token tool
(Tokens Studio, Style Dictionary) can export these collections/modes automatically.

---

## How to re-theme / white-label later

Because components depend only on tokens, re-branding never touches a component.

**In Figma (fastest):** open `1. Foundation`, change `color/brand/primary/500` and
`color/brand/secondary/500` (optionally regenerate the `50–400` / `600–900` steps), and
everything updates.

**With the generator (regenerates full ramps):** edit `BRAND` at the top of
[`plugin/code.js`](./plugin/code.js) and run on a fresh file:

```js
var BRAND = {
  primary: "#0E7C66",   // color/brand/primary/500
  secondary: "#1B1B2F", // color/brand/secondary/500
  red: "#DC2626",       // color/red/500 (reserved)
  amber: "#D97706",     // color/amber/500 (reserved)
  headerFont: "Lora",
  bodyFont: "Poppins"
};
```

---

## How to extend the system

### Add a status family (success / info — or activate red/amber)
1. **Foundation ramp** — `color/green/50…900` and `color/blue/50…900` are complete in **`1. Foundation`**
   (red & amber already exist). The green and blue ramps were audited 2026-06-15; missing `200` and `800` steps were added by interpolating between `100↔300` and `700↔900`.
2. **Theme family (both modes on `2. Theme`)** — add `color/danger/{default,hover,pressed,subtle,text}`
   aliasing `color/red/*`: Light → `500/600/700/50/700`, Dark → `400/300/200/900/300`.
3. **Component tokens** — add the parts the component needs, e.g.
   `color/alert/danger/{background,border,text}` aliasing the new Theme tokens.
4. **Build the component** binding only to those component tokens.

### Add another Button type
Add the type to the arrays in `createButton`, and add matching `color/button/<type>/*`
component tokens that alias the relevant Theme tokens. Keep colors in tokens — never hardcode.

### General rules
- Bind **every** visual property (fills, strokes, padding, gap, radius, stroke width) to tokens.
- Use component **properties** (`TEXT`, `BOOLEAN`, `INSTANCE_SWAP`) for content/options instead
  of extra variants; cap the variant matrix at ~30–45.

---

## Implementation notes

- Renaming a Figma variable preserves its ID, so the v3 migration kept all aliases and
  component bindings intact — only unreferenced tokens were deleted, after consumers moved.
- Colors are stored as RGBA in `0–1` range; cross-collection aliasing connects the tiers.
- Variable **scopes** are set on every token (primitives hidden; semantics/components scoped
  to fills / text / strokes / spacing / radius) to keep property pickers clean.
- The generator bakes each bound paint's resolved color into its literal fallback, so
  swatches and components always render the correct color even before the variable resolves.
