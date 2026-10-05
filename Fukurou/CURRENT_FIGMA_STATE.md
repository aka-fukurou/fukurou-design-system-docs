# Current Figma State — Fukurou Design System

**Last audit:** 2026-07-27 (Calendar nav Icon Button change reverted + WCAG re-run)  
**Design system name:** Fukurou Design System  
**Figma URL:** [Fukurou Design System](https://www.figma.com/design/FNLHeDQrr7JKBj81Qg7L7a/Fukurou-Design-System)  
**Figma file key:** `FNLHeDQrr7JKBj81Qg7L7a`  
**Source of truth:** **Live Figma file** — always inspect before editing code or docs.

> **Rule for future Cursor work:** Read this file + inspect the live file. Do **not** assume `plugin/code.js`, `README.md`, or prior chat state reflects production. Do **not** revert manual Figma edits unless explicitly asked.

### HTML documentation site (`docs/`)

Static site at [`docs/index.html`](./docs/index.html) — **not** a rebuild of the Figma library.

| Capability | Status |
|---|---|
| Figma-matched component previews | Yes — sized/styled from live measurements + Theme tokens |
| Interactive examples | Yes — buttons, fields, search clear, checkbox/radio/switch, dropdown, **date picker**, jumbo, pagination, snackbar, alert, modal, tooltip, progress |
| Light / Dark theme toggle | Yes — `data-theme` on `<html>`, CSS variables from live Theme Light/Dark, persisted in `localStorage` |
| Foundation / Color docs | Yes — brand + full Foundation ramps (neutral/amber/red/green/blue) with token names, hex, swatches, and usage guidance (*updated to match live Figma `Foundations / Color` `22:2`*) |
| Foundation / Typography docs | Yes — font families, 18 text styles with size/weight/line-height/tracking, specimens, usage + a11y guidance (*updated to match live Figma `Foundations / Typography` `23:2`*) |
| Not shown as current | Textarea · Tabs · Tag/Chip · Multi-Select Dropdown · **Date Range Picker** |

**Note:** HTML docs Date Picker example (2026-10-05) — the calendar popover was opening below the helper text. It is now anchored to the trigger with about a **2px** gap. Light/Dark verified. Published to GitHub Pages. Figma components and tokens were not changed.

**Note:** HTML docs Date Picker calendar reconciled with Figma (2026-10-05) — inspected `.Base / Calendar / Day Cell` (`743:1955`), `Calendar Popover` (`743:1973`), and the Light/Dark open examples (`770:5180`, `770:5325`). Day cells were square (`radius/4`) with a black Selected fill and a 1px Today border tied to the real date; they now use `radius/full` circles, `color/calendar/day/background/selected` (`#d33f55` Light / `#fff` Dark), Hover `#fafaf9` / `#000`, Today 2px `#000` / `#fff` outline, 2px focus outline, popover `#fff` / `#1c1917` + `elevation/Popover`. Demo Today is fixed to **Jul 26, 2026** (Disabled Jul 28, Unavailable Jun 30) to mirror the Figma example. Day cells use `aria-selected` + `aria-current="date"`. Figma file unchanged.

**Note:** Foundation / Color documentation was updated to more closely match the live Figma Foundation color section, including brand colors, palette ramps, token names, swatches, and usage guidance.

**Note:** Foundation / Typography documentation was updated to more closely match the live Figma Typography section, including font families, type scale, style names, specimen previews, and usage guidance.

Open locally: `open Fukurou/docs/index.html` or `npx --yes serve Fukurou/docs -l 4175` (see [`docs/README.md`](./docs/README.md)).

**Live docs URL:** [https://aka-fukurou.github.io/fukurou-design-system-docs/](https://aka-fukurou.github.io/fukurou-design-system-docs/) — published from `Fukurou/docs` via GitHub Actions. The local server is optional.

---

### Current File Location and Name

| | |
|---|---|
| **Current folder/project** | **`Fukurou/`** (local path: `/Users/tuanle/Projects/figma-token-migration/Fukurou/`) |
| **Current Figma file name** | **Fukurou Design System** |
| **Source of truth** | The live Figma file named **Fukurou Design System** inside the **`Fukurou`** folder |

> Future Cursor updates should target this file and should **not** create or update old template files unless explicitly instructed.

**Do not refer to this file as:** 3-Tier Design System Template · Design System Template · Figma Library Template

**Former names (deprecated):** Any prior template/library naming — superseded by **Fukurou Design System**.

**Note:** The Figma Plugin API may still return `figma.root.name` as `Document`; the official user-facing file title is **Fukurou Design System**.

---

## Overview

Enterprise design system with a **3-tier token model** (Foundation → Theme → Component), **Light/Dark** theme modes on `2. Theme`, plus **`2. Density`** and **`2. Layout`** supporting collections, **18 typography text styles**, **15 effect styles**, **20 public component sets**, **6 internal `.Base` sets**, **1** internal cursor component, **1** Calendar Popover supporting component, and **1 pagination mobile** standalone.

| Asset | Count / status |
|-------|----------------|
| Pages | **10** (single **`Navigation`** page holds Pagination + Progress Bar) |
| Variable collections | **5** (names preserved — see below) |
| Variables (total, all types) | **679** (live scan **2026-07-26**) — COLOR **559** · FLOAT **90** · STRING **30** |
| Color variables (audited export) | **558** in `tokens.json` (*Date Picker / Calendar patched*; live **559**) |
| Text styles | **18** (headers **Lora**, body/UI **Poppins**) |
| **Effect styles** | **15** (`shadow/*` lowercase · `elevation/*` **PascalCase**) |
| **Public component sets** | **20** — prior 19 + **`Date Picker`** |
| **Internal `.Base` sets** | **6** — prior 4 + **`.Base / Calendar / Day Cell`** · **`.Base / Calendar / Nav Button`** (*restored 2026-07-27, id `761:2392`*) |
| **Standalone components (non-set)** | **`Selector / Dropdown / Menu`** · **`Modal / Dialog/Overlay`** · **`.Base/Cursor/Line`** · **`Pagination Mobile`** · **`Calendar Popover`** |
| **Not in live file** | **Textarea**, **Tabs**, **Tag / Chip**, **Multi-Select Dropdown**, **Date Range Picker**, dedicated **Pagination / Previous** / **Pagination / Next** sets |
| **Broken variable aliases** | **0** (live scan **2026-07-17**) |
| **Brand primary / secondary** | **`#D33F55`** / **`#231F20`** ✓ (Foundation primitives unchanged) |

---

## Recent Manual Updates Detected

**2026-07-27 — Calendar nav Icon Button change REVERTED (Cursor session):**

| Area | Change |
|------|--------|
| **Reverted** | Earlier same-day refactor that used public **Icon Button** instances (chevron icon swaps) for calendar Previous/Next did not work well — reverted |
| **Restored nav** | Internal **`.Base / Calendar / Nav Button`** set rebuilt (`761:2392`, replaces deleted `743:1972`) — Direction (Previous/Next) × State (Default/Hover/Focus/Disabled), 32×32, glyph chevron `icon`, calendar-specific |
| **Calendar Popover header** | Prev/Next controls are `.Base / Calendar / Nav Button` instances; month label fills and centers; header 276×32; popover still hugs (308×344) |
| **Tokens restored** | `color/calendar/nav/icon/default → color/text/subtle` · `hover → color/text/default` · `disabled → color/text/disabled` (Icon Button aliases removed) |
| **Chevron icon components** | `.Base / Icon / Chevron / Left|Right` deleted (unused after revert) |
| **Icon Button** | Public component untouched throughout; **no longer referenced** by calendar navigation |
| **WCAG** | Re-run: **474** pairs · **0** non-exempt failures · nav default **7.63:1** (L) / **11.74:1** (D) |
| **A11y** | Product code must label controls `Previous month` / `Next month` |
| **Preserved** | Date Picker set (`745:2136`, 14 variants, inside `Component/Date Picker` section) · Calendar Popover · Day Cell · docs examples · all unrelated components |

**2026-07-26 — Date Picker added (focused component addition):**

| Area | Change |
|------|--------|
| **Date Picker** | Public set **`745:2136`** — **14** variants (7 states × Small/Medium). States: Default · Hover · Active · Filled · Error · Error Active · Disabled. **Focus Ring** boolean (Text Field model). |
| **Calendar Popover** | Supporting component **`743:1973`** (~308×344) — month header, weekdays, day grid, Today/Clear. Separate from closed trigger. |
| **Internal calendar** | **`.Base / Calendar / Day Cell`** (`743:1955`, 7 states) · **`.Base / Calendar / Nav Button`** (*rebuilt `761:2392`*) |
| **Figma docs** | Section **`Component/Date Picker`** (`745:2579`) with Light + Dark examples |
| **Tokens** | `color/date-picker/*` · `color/calendar/*` · `elevation/calendar/default` · `density/calendar/*` in **`3. Component`** / Density |
| **HTML docs** | Date Picker in nav/index + interactive calendar example (Light/Dark) |
| **WCAG** | **474** pairs · **0** non-exempt failures · **20** exempt disabled · **8** decorative |
| **Not created** | Date Range Picker · Multi-Select Dropdown · Warning/Danger Button variants |
| **Preserved** | Collection names · brand primitives · existing form/button/feedback components |

**2026-07-17 — Docs site audit vs live Figma (re-inspection):**

| Area | Detected change |
|------|-----------------|
| **Navigation pages consolidated** | Only **one** `Navigation` page remains (`459:2136`) with sections **`Component/Pagination`** + **`Component/Progress Bar`**. Former page `699:765` **no longer exists**. Page count **10** (was 11). |
| **HTML docs CSS corrections** | Aligned `border/subtle`, ghost Button fill, field stroke weights, required asterisk `#8d1818`, placeholders to subtle text, Card/Modal borders to `border/default`, Alert Info fill `#eef4fd`, Jumbo selected 2px stroke |

**2026-07-17 — Full-file inspection (earlier session):**

| Area | Detected change |
|------|-----------------|
| **Duplicate `Navigation` pages** | ~~**Two** pages named **`Navigation`**: `699:765` holds **Progress Bar**; `459:2136` holds **Pagination**~~ — **superseded**: consolidated onto `459:2136` (see above) |
| **Progress Bar relocated** | Set `680:3649` + section **`Component/Progress Bar`** now on Navigation page **`459:2136`** (with Pagination) |
| **Progress Bar variant axes** | Renamed to lowercase **`value`** / **`size`** with options `0%/20%/50%/75%/100%` × `small/medium/large` (variant names like `value=20%, size=medium`) |
| **Theme action remap (confirmed)** | **`color/action/primary/default`** → **`neutral/1000`** Light `#000000` / **`neutral/0`** Dark `#ffffff`. Brand red lives on **`color/action/tertiary/default`** → **`brand/primary/500`** Light `#d33f55` |
| **Jumbo selected styling (confirmed)** | **`indicator/background`** → **`status/success/surface`** (`#2f9e60`); **`border/selected`** → **`snackbar/border/success`** (`#2f9e60`); **`icon/background`** → **`surface/subtle`** |
| **Foundations loose art** | **~37** loose rectangles/text (**`Group 1`**, brand hex labels) on Foundations page — exploratory brand ramp collage; not tokenized |
| **`_Documentation` content** | Page has **`Documentation / 3-Tier System`** + **`Overlay Components / Documentation`** (*not empty*) |
| **Internal caret** | **`.Base/Cursor/Line`** (`585:3427`) on Form / Text Field section |
| **Variable totals** | **627** vars · Foundation **104** · Theme **81** · Component **379** · Density **56** · Layout **7** · **0** broken aliases |
| **Forbidden / not current** | Multi-Select Dropdown · **Date Range Picker** · Textarea · Tabs · Tag/Chip — **still absent** ✓ (Date Picker is now current) |

**2026-07-13 — Jumbo Select Button manual redesign (detected in live file; previous Cursor build not overwritten):**

| Area | Detected change |
|------|-----------------|
| **Docs section layout** | **`Component/Jumbo Select Button`** (`656:2081`) contains **`Group 7`** + **`Checkbox Examples`** frame (*frame name may be stale*) |
| **Property IDs** | **`Label#668:0`** · **`Sub label#668:22`** |
| **Large height** | Container **~104px** |
| **Token count** | **27** `color/jumbo-select-button/*` (includes **`icon/background`**) |

**2026-07-11 — Jumbo Select Button added (Cursor session):** public set **`653:1899`**.

*Earlier 2026-06-15 form-control Active + Focus Ring model still accurate for Text Field / Search Field / Dropdown.*

---

| Page | ID | Top-level contents |
|------|-----|-------------------|
| **Cover** | `0:1` | Title hero |
| **Foundations** | `6:2` | **`Foundations / Color`** · **Typography** · **Elevation and Shadow** · loose brand-ramp collage (**`Group 1`**, etc.) |
| **Buttons** | `6:3` | **`Buttons`** section — Button · Text Button · Icon Button · **`Component/Notification Button`** + examples |
| **Cards** | `6:4` | **`.Base/ Icon / Placeholder / Star`** · **`Component/Card`** · **`Icon / Placeholder / Search`** · **`Card Examples`** |
| **Form** | `241:85` | Text Field · Dropdown · Radio · Checkbox · Toggle · Search Field · Jumbo Select Button · **`Component/Date Picker`** (+ Calendar); **`.Base/Cursor/Line`** |
| **Notifications** | `389:2681` | Snackbar · Alert Banner · Tooltip (+ demo wrappers) — **Progress Bar no longer here** |
| **Navigation** | `459:2136` | **`Component/Pagination`** · **`Component/Progress Bar`** · Desktop/Mobile · `.Base` items · examples |
| **Modals** | `417:7494` | **`Component/Modal Dialog`** · Modal / Dialog · Overlay · **`Modal Dialog Component`** |
| **`_Documentation`** | `6:5` | **`Documentation / 3-Tier System`** · **`Overlay Components / Documentation`** |
| **_Naming, Theme, Density & Responsive** | `41:2` | Naming docs · Preview Light/Dark |

---

## Current component inventory (live)

| Component set | Page | Variants | Key properties |
|---------------|------|--------:|----------------|
| **Button** | Buttons | 45 | Type (Action/Secondary/Ghost) · Size · State · Label · icon toggles/swap — **single set** (`452:2113`) |
| **Text Button** | Buttons | 15 | Size · State · Label · icon toggles/swap — **single set** (`452:2338`) |
| **Icon Button** | Buttons | 10 | Content (Icon/Number) · State · Icon swap · Number text — **single set** (`452:2407`) |
| **Notification Button** | Buttons | 15 | State · Badge (None/Dot/Count) · Count text |
| **Text Field** | Form | **14** | State · Size · Show label · Helper Text · Error Text · Required · Leading/Trailing Icon · Helper Icon · **Focus Ring** · icon swaps |
| **Search Field** | Form (`Component/Seach Field`) | **14** | State · Size · Show label · **Helper Text** · **Focus Ring** · **Show icon** · Helper Icon swap (*aligned with Text Field — 2026-06-15*) |
| **Date Picker** | Form (`Component/Date Picker`) | **14** | State · Size · Show label · Required · Helper Text · Error Text · Show calendar icon · **Focus Ring** · text props — **added 2026-07-26** (`745:2136`) |
| **`.Base / Calendar / Day Cell`** | Form | **7** | State (Default/Hover/Focus/Selected/Today/Disabled/Outside) — **internal** |
| **`.Base / Calendar / Nav Button`** | Form | **8** | Direction × State — **internal** (`761:2392`, restored 2026-07-27) |
| **Selector / Dropdown** | Form | **14** | State · Size · Show label · **Helper Text** · Required · Show leading icon · Leading icon · **Helper Icon** · **Change Helper Icon** · **Focus Ring** (*Text Field–aligned model*) |
| **`.Base/ Dropdown / Menu / Option`** | Form | 4 | Option text · State — **internal** |
| **Selector / Radio Button** | Form | 10 | State · Selected · Label · Description · Show description |
| **Selector / Checkbox** | Form | 15 | State · Checked · Indeterminate · Label · Description · Show description · **Show content** |
| **Selector / Toggle / Switch** | Form | 8 | State · Checked · Label · Description · Show description · **Show content** |
| **Jumbo Select Button** | Form (`Component/Jumbo Select Button`) | **21** | State (7, incl. **Focus Visible**, **Selected**, **Selected Hover**) · Size (Small/Medium/Large) · Show icon · Show sub label · Show selected indicator · Label · Sub label · Icon swap — **added 2026-07-11** |
| **Pagination Desktop** | Navigation (`459:2136`) | 2 | **Size** (Small/Medium) · **`Show Jumper#475:13`** (BOOLEAN, default false) |
| **`.Base / Pagination / Item`** | Navigation (`459:2136`) | 10 | State × Size · **Page number** (TEXT) — **internal** |
| **`.Base / Pagination / Ellipsis`** | Navigation (`459:2136`) | 2 | Size — **internal** |
| **`Pagination Mobile`** | Navigation (`459:2136`) | 1 | **Standalone component** (not a set) — jumper row when **`Show Jumper`** enabled |
| **Progress Bar** | Navigation (`459:2136`) | **15** | **`value`** (0/20/50/75/100%) · **`size`** (small/medium/large) · Show step/percentage label · Step/Percentage TEXT |
| **Snackbar** | Notifications | 5 | Tone · Message · Show icon/action/close |
| **Alert / Banner** | Notifications | 5 | Tone · Title · Message · Show icon/title/action/close |
| **Tooltip** | Notifications | 4 | Placement · Tooltip text · Show arrow |
| **Modal / Dialog** | Modals | 9 | Type · Size · Title · Body · Show close/footer/secondary |
| **Card** | Cards | 6 | **Media** × **Status** (Default/Hover) · Title · Body · Show title/body/footer · Icon swap |
| **`.Base/ Icon / Placeholder / Star`** | Cards | 3 | Size=16/20/24 — **internal** |
| **Icon / Placeholder / Search** | Cards | 2 | Size=16/20 — **public** icon set |

**Not present:** Textarea · Tabs · Tag/Chip · Multi-Select Dropdown · **Date Range Picker** · dedicated **Pagination / Previous** / **Pagination / Next** sets

**Duplicate sets on Buttons page:** **Resolved** — one set each (`452:2113`, `452:2338`, `452:2407`).

### Public vs internal / atomic model

| Kind | Examples | Guidance |
|------|----------|----------|
| **Public sets** | Button, Text Field, Progress Bar, etc. | Publish for consumers |
| **Internal `.Base` sets** | Star placeholder, Dropdown Option, Pagination Item/Ellipsis | Nested by public components; prefer keep unpublished |
| **Standalone helpers** | Dropdown Menu panel, Modal Overlay, Cursor Line, Pagination Mobile | Supporting pieces — Cursor Line / Overlay typically internal |

---

## Current Variable Collection Names

> **Preserved as manually renamed in Figma.** Do not rename back to `Primitive`, `Semantic`, or unnumbered `Density` / `Layout`.

| Figma collection | Modes | Variables | Role |
|------------------|-------|----------:|------|
| **`1. Foundation`** | Value | **104** | Raw values (brand/neutral/red/amber/green/blue ramps, spacing, radius, border width, **`effect/shadow/*`**) |
| **`2. Theme`** | Light, Dark | **81** | Semantic colors (surface, text, border, action, status) + **`elevation/*`** — **primary action = neutral**; brand accent on **tertiary** |
| **`3. Component`** | Value | **428** | Component color aliases (incl. Date Picker / Calendar · jumbo · progress-bar · elevation string aliases) |
| **`2. Density`** | Comfortable, Compact, Spacious | **59** | Density sizing/spacing for components (incl. `density/calendar/*`) |
| **`2. Layout`** | Mobile, Tablet, Desktop, Wide | **7** | Responsive layout reference values |

### 1. Foundation

**Purpose:** Raw foundation values such as brand colors, neutral colors, spacing, radius, typography-related values, and other primitive design values.

**Formerly referred to as:** Primitive / `1. Primitives`

### 2. Theme

**Purpose:** Theme-aware semantic values such as action, surface, text, border, and Light/Dark mode values.

**Formerly referred to as:** Semantic / `2. Semantic`

### 3. Component

**Purpose:** Component-specific tokens for Button, Text Button, Card, and other components.

**Formerly referred to as:** Component / `3. Component` *(name unchanged; numbering preserved)*

### 2. Density

**Purpose:** Density-related sizing and spacing modes such as Compact, Comfortable, and Spacious.

**Formerly referred to as:** `Density` *(unnumbered)*

### 2. Layout

**Purpose:** Responsive layout values such as grid, breakpoint, gutter, margin, container width, and section padding.

**Formerly referred to as:** `Layout` *(unnumbered)*

**Architecture (conceptual):** Foundation = raw values · Theme = semantic decisions · Component = component hooks · Density + Layout = product scale and responsive behavior.

**Duplicate check (2026-06-11):** Live file has **5 collections only** — no legacy `1. Primitives` or `2. Semantic` collections present.

---

## Variable collections (detail)

### `1. Foundation` — mode: **Value** (103 variables)

**Live token groups (2026-06-15):** brand 20 · neutral 12 · red/amber/green/blue 10 each · spacing 15 · radius 6 · border 2 · effect/shadow 7

**Naming pattern:** raw scales only — no intent words in names.

| Group | Examples |
|-------|----------|
| Brand | `color/brand/primary/*`, `color/brand/secondary/*` (50–900) |
| Neutral | `color/neutral/*` |
| Status ramps (primitive-only) | `color/red/*`, `color/amber/*`, **`color/green/*`**, **`color/blue/*`** (each 50–900) |
| Spacing | `spacing/0` … `spacing/64`, `spacing/text-button/*` |
| Radius | `radius/0`, `radius/4`, `radius/8`, `radius/12`, `radius/16`, `radius/full` |
| Border width | `border/width/none`, `border/width/sm`, `border/width/md` |
| **Shadow (STRING)** | **`effect/shadow/none`**, **`50`–`600`** — CSS `box-shadow` values (ink base `#231F20`) |

> **Figma limitation:** Plugin API does not support `EFFECT`-type variables. Shadow **effect styles** (`Shadow / *`, `Elevation / *`) are the Figma application layer; STRING tokens export to code via `--effect-shadow-*` / `--elevation-*`.

---

### `2. Theme` — modes: **Light**, **Dark** (81 variables)

**Live token groups (2026-06-15):** action 36 (primary/secondary/tertiary/**inverse** × 6 states each) · status 37 (danger/success/warning/info/neutral — each with **subtle/surface/text/text-inverse** variants) · border 15 (default/subtle/strong/focus/elevated + **border/status/***) · surface 8 · text 6 · elevation 7

**Naming pattern:** intent-based — `color/action/*`, `color/surface/*`, `color/text/*`, `color/border/*`

| Group | Purpose |
|-------|---------|
| `color/action/primary/*` | Primary brand actions (default, hover, pressed, subtle, text, disabled) |
| `color/action/secondary/*` | Secondary brand actions (same states) |
| **`color/action/tertiary/*`** | Tertiary actions (default, hover, pressed, subtle, text, disabled) |
| **`color/action/inverse/*`** | **Inverse actions (default, hover, pressed, subtle, text, disabled) — *new in live file; previous mapping not confirmed*** |
| `color/surface/*` | page, card, elevated, inverse, subtle, brand, overlay, floating |
| `color/text/*` | default, strong, subtle, inverse, disabled, action |
| `color/border/*` | default, subtle, strong, focus, elevated |
| `color/border/control/*` | default, hover, focus, error, disabled — form control boundaries |
| **`color/border/status/*`** | **neutral, success, warning, danger, blue** — *new status border tokens* |
| **`color/status/*`** | **Expanded per-tone tokens** — each tone has `subtle`, `surface`, `text`, `text-inverse` (+ neutral `surface-inverse`). **Old `color/status/{tone}/default` tokens removed.** |
| **`elevation/*`** | none, surface, raised, floating, popover, modal, overlay → alias `effect/shadow/*` |

**Elevation aliases (live):** **`effect/shadow/none`** restored in **`1. Foundation`** (`VariableID:485:2`, value `"none"`) · **`elevation/none`** in **`2. Theme`** re-aliased Light/Dark → `effect/shadow/none` · **0 broken elevation chains** (repaired **2026-06-15**).

**Dark-mode elevation surfaces:** `color/surface/overlay` · `color/surface/floating` · `color/border/elevated` — unchanged intent.

---

### `3. Component` — mode: **Value** (347 variables — 333 color + 14 elevation strings)

**Naming pattern:** `color/{component}/{part}/{role}/{state}`

| Component group | Token prefix |
|-----------------|--------------|
| Button (Action) | `color/button/action/*` — includes **`content/*`** (label + icon) and legacy **`text/*`** |
| Button (Secondary) | `color/button/secondary/*` — includes **`content/*`** and legacy **`text/*`** |
| Button (Ghost) | `color/button/ghost/*` — includes **`content/*`** and legacy **`text/*`** |
| Button (shared focus) | `color/button/focus/ring`, `color/button/focus/gap` |
| Text Button | `color/text-button/*` — includes **`content/*`** (label + icon) and legacy **`text/*`** |
| Icon Button | `color/icon-button/*` — **`background/*`**, **`content/*`**, **`focus/ring`**, **`focus/gap`** |
| Text Field | `color/text-field/*` — **`background/*`**, **`border/*`**, **`text/*`**, **`label/*`**, **`helper/*`**, **`error/*`**, **`icon/*`**, **`focus/ring`**, **`focus/gap`** |
| Search Field | `color/search-field/*` — same structure as Text Field plus **`clear-icon/*`** |
| **Textarea** | **Not in live file** — `color/textarea/*` tokens **removed** (*scripts may still exist locally*) |
| **Dropdown** | **`color/dropdown/*`** · **`color/dropdown-menu/*`** — reuses **`color/border/control/*`** |
| **Radio Selector** | **`color/radio/*`** — control border, dot, label, description, focus |
| **Checkbox** | **`color/checkbox/*`** — background, border, mark (checkmark/indeterminate), label, description, focus |
| **Notification Button** | **`color/notification-button/*`** — `badge/{background,text,border}`, `dot/{background,border}` (button reuses `color/icon-button/*`) |
| **Snackbar** | **`color/snackbar/*`** — per tone |
| **Alert / Banner** | **`color/alert/*`** — background/border/title/message/icon/action/close per tone |
| **Tooltip** | **`color/tooltip/*`** · `elevation/tooltip/default` |
| **Modal / Dialog** | **`color/modal/*`** |
| **Toggle / Switch** | **`color/switch/*`** |
| **Pagination** | `color/pagination/*` |
| Card | `color/card/*` |
| **Elevation** | **`elevation/{card,button,text-field,popover,modal,dropdown,toast,snackbar,tooltip}/*`** → Theme `elevation/*` — includes **`elevation/card/hover`**, **`elevation/card/selected`** (*new*) |

**Content token scopes:** `TEXT_FILL` + `SHAPE_FILL` + `STROKE_COLOR` (legacy `text/*` tokens remain `TEXT_FILL` only).

---

### `2. Density` — modes: **Comfortable**, **Compact**, **Spacious** (56 variables)

| Token | Comfortable | Compact | Spacious |
|-------|------------:|--------:|---------:|
| `density/button/small/height` | 32 | **28** | *(see file)* |
| `density/button/medium/height` | 40 | **36** | *(see file)* |
| `density/button/large/height` | 48 | **44** | *(see file)* |

Also: button padding-x per size, `density/button/gap`, **`density/icon-button/small/size`**, **`density/text-field/{small,medium}/*`**, **`density/dropdown/*`**, **`density/radio/*`**, **`density/checkbox/*`**, **`density/notification-button/*`**, **`density/snackbar/*`**, **`density/alert/*`**, **`density/tooltip/*`**, **`density/modal/*`**, **`density/switch/*`**, **`density/pagination/*`**, card padding/gap, legacy `density/form/input/*`. **No `density/textarea/*` in live file.**

| Icon Button size | Comfortable | Compact | Spacious |
|------------------|------------:|--------:|---------:|
| `density/icon-button/small/size` | 32 | 28 | 36 |

| Text Field size | Comfortable | Compact | Spacious |
|-----------------|------------:|--------:|---------:|
| `density/text-field/small/height` | 40 | 36 | 44 |
| `density/text-field/medium/height` | 48 | 44 | 52 |
| `density/text-field/small/padding-x` | 12 | 10 | 14 |
| `density/text-field/medium/padding-x` | 16 | 14 | 18 |
| `density/text-field/gap` | 8 | 6 | 10 |

> **Removed (2026-06-11):** `density/icon-button/medium/size` and `density/icon-button/large/size` — Icon Button is Small-only.

Compact Small height **28px** ≥ 24px WCAG minimum target size.

---

### `2. Layout` — modes: **Mobile**, **Tablet**, **Desktop**, **Wide** (7 variables)

`layout/breakpoint/min-width`, `layout/container/max-width`, `layout/grid/columns`, `layout/grid/gutter`, `layout/grid/margin`, `layout/section/padding-x`, `layout/section/padding-y`

---

## Typography styles (18)

| Style | Font | Size / LH | Decoration |
|-------|------|-----------|------------|
| `display/lg`, `display/md` | Lora SemiBold | 56/64, 48/56 | None |
| `heading/xl` … `heading/sm` | Lora SemiBold | 20–40 | None |
| `body/lg`, `body/md`, `body/sm` | Poppins Regular | 18/28, 16/24, 14/20 | None |
| `caption/md`, `caption/sm` | Poppins Regular | **both 12/16** (published styles) | None — *Foundations frame label for `caption/sm` still says “11 / 16”; treat published style as source of truth* |
| `button/md` | Poppins SemiBold | 14/20 | None |
| `text-button/sm`, `text-button/md`, `text-button/lg` | Poppins Regular or SemiBold | 14/20 or 18/28 | None |
| `text-button/underline/sm`, `text-button/underline/md`, `text-button/underline/lg` | Poppins Regular or SemiBold | 14/20 or 18/28 | Underline style names in library |

Text Button variants apply typography **directly on the label layer** per size/state. Underline styles exist in the library; hover uses `textDecoration: UNDERLINE` on the label (not via shared `textStyleId` — variant sets can sync styles if applied at set level).

**Color styles:** 0 · **Effect styles:** 15 (live names: `shadow/none` … `shadow/600`, `elevation/None` … `elevation/Overlay`)

---

## Component inventory

### Button (`452:2113`)

**Location:** `Buttons` section on Button page  
**Description (live):** Action (filled primary), Secondary (filled neutral), Ghost (transparent + secondary-brand stroke + normal padding). Text-only actions use separate Text Button.

| Property | Values |
|----------|--------|
| **Type** (VARIANT) | Action, Secondary, Ghost — **no Warning, Danger, or Text** |
| **Size** (VARIANT) | Small, Medium, Large |
| **State** (VARIANT) | Default, Hover, Pressed, Focus, Disabled |
| **Label** (TEXT) | default `"Button"` |
| **Show left icon / Show right icon** (BOOLEAN) | default `false` |
| **Left icon / Right icon** (INSTANCE_SWAP) | default `Icon / Placeholder / Star` · swappable |

**Layout (auto-layout):**

| Property | Value |
|----------|-------|
| Direction | Horizontal |
| Width | **Hug contents** (`primaryAxisSizingMode: AUTO`) |
| Height | **Fixed** via density token per size |
| Label | Hug contents · single-line (`WIDTH_AND_HEIGHT`) |
| Icons | Fixed size (16 / 20 / 24 px) · hidden icons collapse spacing |
| **Content color** | **label = icon-left = icon-right** via `color/button/[type]/content/[state]` (TEXT_FILL + SHAPE_FILL + STROKE_COLOR scopes) |
| Structure | `icon-left` · `label` · `icon-right` |

**Layer structure (all 45 variants):** `icon-left` (instance) · `label` (text) · `icon-right` (instance)

**Variants:** 45 (3 × 3 × 5)

| Type | Default fill | Default stroke | Label style | Text tokens |
|------|-------------|----------------|-------------|-------------|
| **Action** | Primary brand fill | None | `button/md` | inverse |
| **Secondary** | Secondary neutral fill | None | `button/md` | inverse |
| **Ghost** | Transparent (`opacity: 0`) | **Visible** 1px secondary | `button/md` | `color/button/ghost/text/*` → secondary |
| **Focus** (all types) | Default fill inside `button-body` | **Offset focus ring** — see below | `button/md` | `content/focus` |
| **Disabled** (all) | — | Ghost keeps stroke | `button/md` | disabled tokens · `opacity: 0.6` |

**Focus variant structure (9 variants):**

```
[Component root — hug, no fill/stroke]
  └── focus-ring
        fill: color/button/focus/gap (2px padding = surface gap)
        stroke: color/button/focus/ring (2px OUTSIDE)
        └── button-body
              fill + padding + label + icons (same as Default)
              Ghost: keeps default ghost border on body (not confused with focus ring)
```

**Focus tokens:**

| Token | Alias chain |
|-------|-------------|
| `color/button/focus/ring` | → `color/border/focus` → `brand/primary/700` (Light) · `primary/300` (Dark) |
| `color/button/focus/gap` | → `color/surface/page` |

**Root cause (2026-06-11):** Focus ring was a 2px OUTSIDE stroke on the same layer as the red Action fill, using `color/border/focus` = `primary/500` (1.00:1 at inner edge). Fix: offset wrapper + stronger focus shade + surface gap token.

Ghost Default (Medium) bindings confirmed: `ghost/background/default`, `ghost/border/default`, `ghost/content/default`.

**Root cause (2026-06-11 content token fix):** `color/button/*/text/*` tokens were scoped **TEXT_FILL only**, so they did not appear in the variable picker when selecting vector/shape fills on swapped external icons. External library icons with hard-coded fills also ignored instance overrides. Fix: added `color/button/[type]/content/[state]` tokens (alias → text tokens) with **TEXT_FILL + SHAPE_FILL + STROKE_COLOR** scopes; rebound all Button variants to content tokens.

---

### Text Button (`452:2338`)

**Location:** `Buttons` section — **separate component set**, not a Button Type  
**Description (live):** Per-variant text fill tokens. Hover underline on label. Transparent backgrounds. Focus = 2px ring.

| Property | Values |
|----------|--------|
| **Size** (VARIANT) | Small, Medium, Large |
| **State** (VARIANT) | Default, Hover, Pressed, Focus, Disabled |
| **Label** (TEXT) | default `"Text Button"` — **characters only** in `componentPropertyReferences` (fill is per-variant) |
| **Show left icon / Show right icon** (BOOLEAN) | default `false` |
| **Left icon / Right icon** (INSTANCE_SWAP) | swappable `Icon / Placeholder / Star` instances |

**Layer structure:** `icon-left` (instance) · `label` · `icon-right` (instance)

**Variants:** 15 (3 × 5) — each has its **own label node** (15 unique label layers)

| State | Label fill token | Typography (direct on label) | Underline |
|-------|------------------|-------------------------------|-----------|
| Default | `color/text-button/content/default` | sm / md / lg by size | No |
| **Hover** | `color/text-button/content/hover` | sm / md / lg by size | **Yes** |
| Pressed | `color/text-button/content/pressed` | sm / md / lg by size | No |
| Focus | `color/text-button/content/focus` | sm / md / lg by size | No (2px ring) |
| Disabled | `color/text-button/content/disabled` | sm / md / lg by size · opacity 0.6 | No |

| Size | Font | Size / LH |
|------|------|-----------|
| Small | Poppins Regular | 14 / 20 |
| Medium | Poppins SemiBold | 14 / 20 |
| Large | Poppins Regular | 18 / 28 |

**Background (all states):** transparent via `color/text-button/background/*`

**Content color:** label + icon glyph fills/strokes use `color/text-button/content/[state]` (same scopes as Button content tokens). Legacy `color/text-button/text/*` tokens preserved.

**Root cause (2026-06-11 fix):** `Size=Small, State=Default` was incorrectly bound to `color/text-button/text/disabled`. Rebound each variant independently; only `characters` exposed via Label property. Content tokens added 2026-06-11 for icon vector fill picker support.

**Extra node:** loose `Text Button` **instance** on Button page (`137:29`)

---

### Icon Button (`452:2407`)

**Location:** Button page (`216:359`) · **`Icon Button / Examples`** demo frame (`228:249`)  
**Description (live):** Circular compact action — icon-only or number-only. **Small size only (32×32px).** Theme-aware via `color/icon-button/*` tokens. Focus uses offset ring wrapper (same pattern as Button).

| Property | Values |
|----------|--------|
| **Content** (VARIANT) | Icon, Number |
| **State** (VARIANT) | Default, Hover, Pressed, Focus, Disabled |
| **Icon** (INSTANCE_SWAP) | default `Icon / Placeholder / Star` Size=16 · swappable |
| **Number** (TEXT) | default `"01"` — Number content only |

**Variants:** 10 (2 × 5) — no Size property

**Why Small only:** Icon Button is intended for compact UI actions, toolbar actions, badges, compact controls, and small circular action targets.

**Layer structure:**

| Content | Non-focus | Focus |
|---------|-----------|-------|
| **Icon** | `button-body` → `icon` (instance) | `focus-ring` → `button-body` → `icon` |
| **Number** | `button-body` → `number` (text) | `focus-ring` → `button-body` → `number` |

| State | Background token | Content token |
|-------|------------------|---------------|
| Default | `color/icon-button/background/default` (transparent) | `color/icon-button/content/default` → `color/text/action` |
| Hover | `color/icon-button/background/hover` → `action/primary/subtle` | `color/icon-button/content/hover` |
| Pressed | `color/icon-button/background/pressed` → `action/primary/default` | `color/icon-button/content/pressed` → `color/text/inverse` |
| Focus | `background/default` inside body + offset ring | `color/icon-button/content/focus` |
| Disabled | transparent · `opacity: 0.6` | `color/icon-button/content/disabled` |

**Focus tokens:** `color/icon-button/focus/ring` → `color/border/focus` · `color/icon-button/focus/gap` → `color/surface/page`

**Size token:** `density/icon-button/small/size` on `2. Density` (32 / 28 / 36 by density mode)

**Removed tokens:** `density/icon-button/medium/size`, `density/icon-button/large/size`

**Examples frame:** Light + Dark sections with Small-size instances in a 5×2 grid (states × Icon/Number), each section bound to Theme Light/Dark mode.

---

### Text Field (`241:244`)

> **Historical note:** Date Picker was removed on 2026-06-19, then **re-added 2026-07-26** as a current single-date component. **Date Range Picker remains not current** and must not be created unless explicitly requested.

**Location:** Form page · section **`Component/Textfield`** · set **`Text Field`** (`241:244`) · **`Text Field Examples`** demo frame (`255:772`)  
**Description (live, 2026-07-17):** States Default/Hover/Active/Filled/Error/Error Active/Disabled · Focus Ring boolean · no Focus variant · no Show caret property. Theme via `color/text-field/*`; focus ring stroke uses **`color/border/focus`**.

| Property | Values / IDs (live) |
|----------|---------------------|
| **State** (VARIANT) | **Default**, **Hover**, **Active**, **Filled**, **Error**, **Error Active**, **Disabled** — *no Focus variant* |
| **Size** (VARIANT) | Small (40px input), Medium (48px input) — **default Size = Small** |
| **Show label** (BOOLEAN) | `Show label#241:18` → **`label-row`** visibility |
| **Helper Text** (BOOLEAN) | `Helper Text#241:19` → **`helper`** frame visibility |
| **Error Text** (BOOLEAN) | `Error Text#241:20` → **`error`** frame visibility (*bound on non-Error states only — see Issues*) |
| **Required** (BOOLEAN) | `Required#241:21` → **`required`** asterisk |
| **Leading Icon** / **Trailing Icon** (BOOLEAN) | `Leading Icon#241:22` · `Trailing Icon#241:23` |
| **Helper Icon** (BOOLEAN) | `Helper Icon#482:16` |
| **Focus Ring** (BOOLEAN) | `Focus Ring#586:0` → **`focus ring`** rectangle — **keyboard focus visible** |
| **Change Helper Icon** / **Change Leading Icon** / **Change Trailing Icon** (INSTANCE_SWAP) | `Change Helper Icon#584:0` · `Change Leading Icon#586:17` · `Change Trailing Icon#586:32` |

**No editable TEXT properties** on live set (*Label/Placeholder/Value/Helper/Error text props removed in manual edit — previous value from prior docs*).  
**No Show caret boolean** — caret is baked into **Active** / **Error Active** via **`active group`** + **`Cursor`** line.

**Variants:** **14** (7 states × 2 sizes)

**Anatomy (live auto-layout, 2026-07-17):**

```
Text Field (VERTICAL, primaryAxis AUTO/HUG, counter FIXED width, clipsContent: false, gap spacing/4)
├── label-row (HORIZONTAL, FILL × HUG) — Show label
│   ├── label (TEXT)
│   └── required (TEXT) — Required
├── input-container (HORIZONTAL, FILL × FIXED height, clipsContent: false)
│   ├── focus ring (RECTANGLE, ABSOLUTE, x/y −2, stroke OUTSIDE) — Focus Ring
│   ├── left (HORIZONTAL, FILL)
│   │   ├── leading-icon (INSTANCE) — Leading Icon + Change Leading Icon
│   │   ├── placeholder-text | value-text  (or active group in Active states)
│   │   └── active group (Active / Error Active) → value-text + Cursor LINE
│   ├── trailing-icon (INSTANCE) — Trailing Icon + Change Trailing Icon
│   └── Icon Button (cancel) — visible in Active / Error Active
├── helper (HORIZONTAL) — Helper Text → icon + helper text
└── error (VERTICAL) — Error Text (when bound) → error text
```

**Focus vs Active vs Focus Visible (live model — do not collapse these):**

| Concept | Live implementation |
|---------|---------------------|
| **Active / editing** | **State=Active** — clicked/tapped/typing · thicker border (`border/width/md` + `border/hover`) · **`active group`** + caret · cancel **Icon Button** |
| **Error while editing** | **State=Error Active** — error border + cancel + caret · error frame visible |
| **Keyboard focus visible** | **`Focus Ring`** boolean — absolute offset ring; stroke **`color/border/focus`**; **not** a State=Focus variant |
| **WCAG note** | Product: use **`:focus-visible`** for the ring; **Active** ≠ keyboard focus alone |

**Layout behavior (live heights, label on, helper/error off):**

| State · Size | Height |
|--------------|--------|
| Default/Hover/Active/Filled/Disabled · Small | **64px** |
| Default/Hover/Active/Filled/Disabled · Medium | **72px** |
| Error / Error Active · Small | **84px** |
| Error / Error Active · Medium | **92px** |

Outer frame **hugs** content (`primaryAxisSizingMode: AUTO`). **`label-row`**, **`helper`**, and **`error`** use boolean visibility — hidden rows do not add phantom space in default configs. Focus ring does not increase outer height (absolute inside input; root + input **`clipsContent: false`**).

**State-driven visibility (live):**

| State | placeholder | value / caret | error frame | cancel Icon Button |
|-------|-------------|---------------|-------------|--------------------|
| Default / Hover | visible | hidden | hidden | hidden |
| Active | hidden | **active group + Cursor** | hidden | **visible** |
| Filled | hidden | value visible | hidden | hidden |
| Error | hidden | value visible | **visible (forced)** | hidden |
| Error Active | hidden | value + Cursor | **visible (forced)** | **visible** |
| Disabled | placeholder or disabled text | — | hidden | hidden |

**Token bindings used on live set (2026-07-17):**

| Group | Bound tokens |
|-------|--------------|
| Background | `background/default`, `hover`, `filled`, `disabled` |
| Border | `border/default`, `hover`, `filled`, `error`, `disabled` |
| Text | `text/placeholder`, `filled`, `disabled` |
| Label | `label/default`, `error`, `disabled` |
| Helper | `helper/default`, `disabled` |
| Error | `error/default` |
| Icon | `icon/default`, `error`, `disabled` |
| Focus ring (canvas) | **`color/border/focus`** on ring stroke (*not* `color/text-field/focus/ring`) |
| Density / geometry | `density/text-field/{small,medium}/height|padding-x` · `spacing/4|8` · `radius/8|10` · `border/width/sm|md` |

**Exist but unused on live canvas bindings:** `background/error`, `background/focus`, `border/focus`, `text/default`, `label/focus`, `icon/focus`, `focus/ring`, `focus/gap` — *may be for product code or legacy; previous intent not confirmed*. Elevation vars `elevation/text-field/default|focus` also exist.

**Light/Dark:** Theme via **`2. Theme`**; component tokens alias through Theme → Foundation.

### Recent Text Field Manual Updates Detected

Detected in current live file; previous value not confirmed unless noted.

| Change | Notes |
|--------|-------|
| **State axis expanded** | **Active** + **Error Active** added; separate **Focus** variant removed (*previous docs had Focus*) |
| **Focus Ring boolean** | **`Focus Ring#586:0`** — absolute rectangle inside input, keyboard-visible focus |
| **Caret / editing chrome** | **`active group`** + **`Cursor`** LINE in Active / Error Active — no Show caret property |
| **Cancel Icon Button** | Nested **Icon Button** visible only in Active / Error Active |
| **Anatomy restructure** | `left` sub-frame · helper horizontal with icon · root vertical hug |
| **Property renames** | **Helper Text** / **Error Text** (not Show helper/error text) |
| **TEXT props removed** | No Label/Placeholder/Value/Helper/Error TEXT component properties |
| **Icon instance swaps** | Change Helper / Leading / Trailing Icon |
| **Active border treatment** | Active uses **`border/hover`** + **`border/width/md`** (not a dedicated active border token) |
| **Error frame forced on Error states** | Error / Error Active variants show error frame with **no** `Error Text` property reference — toggle may not hide it on those variants |
| **Examples frame** | **`Text Field Examples`** (`255:772`) |
| **Description** | Live set description documents Active vs Focus Ring model |

### Text Field Issues to Review

| Issue | Severity | Notes |
|-------|----------|-------|
| **Error Text unbound on Error / Error Active** | Medium | Error frame `visible: true` with empty `componentPropertyReferences` on Error variants — **Error Text** may not hide error text when State is Error |
| **Unused text-field focus tokens** | Low | `color/text-field/focus/ring|gap` unused; canvas ring uses **`color/border/focus`** |
| **`background/error` unused** | Low | Error states bind **`background/filled`**, not `background/error` |
| **No TEXT component properties** | Medium | Editing copy requires opening variants |
| **Error + Focus Ring combo** | Medium | Combinable via boolean, but no dedicated doc example for Error + Focus Ring |
| **Icon Button presence varies by variant** | Low | Some non-Active Medium variants lack cancel Icon Button node (`cancelVisible: null`) — *detected 2026-07-17; previous value not confirmed* |
| **Error Active Small missing `active group`** | Low | Small Error Active has Cursor but `active group` frame absent — anatomy inconsistency vs Medium |
| **Focus ring parent clipping** | Watch | Currently OK (`clipsContent: false`); do not enable clipping on `input-container` or root |

---

### Search Field (`528:1443`)

**Location:** Form page · section **`Component/Seach Field`** (`534:3856`) — *typo in live section name*  
**Description (live):** Matches Text Field state model — Active · Error Active · Focus Ring boolean · no Focus variant.

| Property | Values |
|----------|--------|
| **State** (VARIANT) | **Default**, **Hover**, **Active**, **Filled**, **Error**, **Error Active**, **Disabled** (*no separate **Focus** variant — previous docs had Focus*) |
| **Size** (VARIANT) | Small (40px input), Medium (48px input) |
| **Show label** (BOOLEAN) | Binds **`label-row`** visibility — **`Show label#528:14`** |
| **Helper Text** (BOOLEAN) | Binds **`helper`** frame visibility — **`Helper Text#528:15`** (*renamed from Show helper text*) |
| **Focus Ring** (BOOLEAN) | Binds **`focus ring`** rectangle inside **`input-container`** — **`Focus Ring#586:47`** — keyboard focus visible |
| **Show icon** (BOOLEAN) | Binds helper-row **`icon`** visibility — **`Show icon#586:71`** |
| **Helper Icon** (INSTANCE_SWAP) | Swappable helper icon — **`Helper Icon#586:60`** |

**No editable TEXT properties** · **No Error Text boolean** · **No Show clear button boolean** (*removed in manual edit — previous value from prior docs*).

**Variants:** **14** (7 states × 2 sizes) — *was 12 (6 × 2) in prior docs*

**Layer structure (manual restructure — aligned with Text Field):**

| Part | Structure |
|------|-----------|
| Label row | `label-row` → `label` — **`label-row.visible`** → Show label |
| Input | `input-container` (horizontal, **`clipsContent: false`**) → `search-icon` · `placeholder-text` · `value-text` · `clear-button` · `focus ring` (RECTANGLE, Focus Ring boolean) |
| Helper | `helper` frame (horizontal) → `icon` + `helper` text — **`helper.visible`** → Helper Text |
| Error | `error` frame → `error` text — **state-driven** (Error / Error Active variants; no boolean toggle) |

**Focus vs Active (live model — same as Text Field):**

| Concept | Live implementation |
|---------|---------------------|
| **Active / editing** | **State=Active** — placeholder hidden, value visible |
| **Error while editing** | **State=Error Active** — error frame visible + value visible |
| **Keyboard focus visible** | **`Focus Ring`** boolean toggles offset ring rectangle inside input |
| **WCAG note** | Product code: **`:focus-visible`** ring separate from **Active** editing state |

**Search icon:** Always visible in input. Live instance size **24×24** on both Small and Medium (*previous docs: 16px / 20px — changed or instance scale differs; previous value not confirmed*).

**Clear button:** **`clear-button`** layer exists on Default/Hover/Disabled (**hidden**). **Filled** and **Error** variants have **no clear layer** in live file (*manual change detected 2026-06-15 — previous fix reverted*). **Active** / **Error Active** use visible **Icon Button** (cancel).

**Layout behavior (live tests — Small):**

| Configuration | Height |
|---------------|--------|
| Default + label | **64px** |
| Show label = false | **40px** (label row collapses) |
| Helper Text = true | **84px** |
| Error variant | **84px** (error frame visible) |
| Focus Ring = true | **64px** (ring visible; `input-container` does not clip) |

**State-driven visibility (live tests):**

| State | placeholder | value | error frame | clear affordance |
|-------|-------------|-------|-------------|------------------|
| Default | visible | hidden | hidden | hidden |
| Active | hidden | visible | hidden | **Icon Button (cancel)** visible |
| Filled | hidden | visible | hidden | **none** (*clear layer absent*) |
| Error | hidden | visible | **visible** | **none** (*clear layer absent*) |
| Error Active | hidden | visible | **visible** | **Icon Button (cancel)** visible |

**Token bindings (live scan):**

| Group | Tokens bound on live set |
|-------|--------------------------|
| Background | `color/search-field/background/default`, `hover`, `filled`, `error`, `disabled` |
| Border | `color/search-field/border/default`, `hover`, `error`, `disabled` |
| Text | `color/search-field/text/placeholder`, `value`, `disabled` |
| Label | `color/search-field/label/default`, `error`, `disabled` |
| Helper | `color/text-field/helper/default`, `disabled` (*reuses text-field helper tokens*) |
| Error | `color/text-field/error/default` (*reuses text-field error token*) |
| Icons | `color/search-field/icon/default` · `color/search-field/clear-icon/default` |
| Focus ring | Stroke → `color/border/focus` on **`focus ring`** rectangle |
| Density / layout | `density/text-field/small/*`, `medium/*`, `gap` · `density/icon-button/small/size` · `radius/*` · `spacing/*` |

**Unused in live bindings (*tokens exist in `tokens.json`*):** `color/search-field/background/focus`, `border/focus`, `label/focus`, `icon/focus`, `icon/error`, `clear-icon/hover`, `clear-icon/disabled`, `helper/default` (search-field-specific), `error/default`, `focus/ring`, `focus/gap` — *previous binding not confirmed*

**Light/Dark:** Theme via **`2. Theme`** explicit mode; search-field + shared text-field helper/error aliases resolve per mode.

**Documentation:** In-section Light/Dark example grid inside **`Component/Seach Field`**. Prior standalone **`Search Field / Examples`** frame removed.

**Accessibility (component description):** Updated to Active + Focus Ring model. Clear affordance inconsistent in live file — see **Possible Issues to Review**.

### Recent Search Field Manual Updates Detected

| Change | Notes |
|--------|-------|
| **State axis aligned with Text Field** | **Active** + **Error Active** added; **Focus** variant removed (*previous: Default/Hover/**Focus**/Filled/Error/Disabled*) |
| **Variant count** | **14** (7 × 2) — *was 12 in prior docs* |
| **Focus Ring boolean** | **`Focus Ring#586:47`** — rectangle inside `input-container`; replaces external **`focus-ring`** wrapper (*previous anatomy*) |
| **Helper restructure** | **`helper`** frame (not `helper-text` wrapper); **`Helper Text#528:15`** property rename |
| **Helper icon controls** | **`Show icon#586:71`** boolean + **`Helper Icon#586:60`** instance swap |
| **Error visibility** | **State-driven only** — no **Error Text** boolean; **`error`** frame width **244px** vs component **428px** (*layout inconsistency — flag*) |
| **Clear button** | **Filled/Error** — no clear layer; **Active/Error Active** — Icon Button; Default/Hover/Disabled — hidden **`clear-button`** (*detected in current live file*) |
| **Search icon size** | **24×24** on Small and Medium in live file — *previous docs: 16/20; previous value not confirmed* |
| **Text properties removed** | No Label/Placeholder/Value/Helper/Error TEXT props (*previous value from prior docs*) |
| **Component description updated** | Figma description aligned to Active + Focus Ring model (2026-06-15) |

---

### Jumbo Select Button (`653:1899`) — added 2026-07-11 · manually updated 2026-07-13

**Location:** Form page · section **`Component/Jumbo Select Button`** (`656:2081`) · component set inside **`Group 7`**  
**Docs:** user-built matrix in **`Checkbox Examples`** frame (within section) · legacy **`Jumbo Select Button / Light`** (`656:1689`) / **`/ Dark`** (`656:1885`) on Form page root  
**Purpose:** Large selectable option card — choose a plan, account type, payment method, workflow option, or filing type. **Represents a selectable option, not an action** (different from Button).

| Property | Values |
|----------|--------|
| **State** (VARIANT) | **Default**, **Hover**, **Pressed**, **Focus Visible**, **Selected**, **Selected Hover**, **Disabled** |
| **Size** (VARIANT) | Small (56px) · Medium (72px, default) · **Large (104px live — 96px min-height target)** |
| **Show icon** (BOOLEAN) | **`Show icon#653:0`** → `icon-container` visibility (collapses) |
| **Show sub label** (BOOLEAN) | **`Show sub label#653:22`** → `sub-label` visibility (collapses) |
| **Show selected indicator** (BOOLEAN) | **`Show selected indicator#653:44`** → `indicator` visibility on **Selected** variants |
| **Label** (TEXT) | **`Label#668:0`** — default `Individual` |
| **Sub label** (TEXT) | **`Sub label#668:22`** — default `Best for filing your own return.` |
| **Icon** (INSTANCE_SWAP) | **`Icon#653:110`** — default icon instance (*may be notifications bell — verify in live file*) |

**Variants:** **21** (7 states × 3 sizes)

**Anatomy:** outer component (2px padding, `clipsContent: false`, focus ring host) → `container` (horizontal auto layout, min-height per size, `radius/12`, fill + stroke tokens) → `icon-container` (fixed 20/24/32; **Large only:** optional subtle fill via **`color/jumbo-select-button/icon/background`**) → `text-container` (vertical, FILL width: `label` + `sub-label`) → `indicator` (circle + check vector; visible on Selected/Selected Hover).

**Sizes:**

| Size | Height (live) | Icon | Padding x / y | Gap | Label | Sub label |
|------|---------------|------|----------------|-----|-------|-----------|
| Small | 56px | 20px | `spacing/16` / `spacing/8` | `spacing/12` | Poppins Medium 14 | Poppins Regular 12 |
| Medium | 72px | 24px | `spacing/20` / `spacing/12` | `spacing/16` | Poppins Medium 16 | Poppins Regular 14 |
| Large | **104px** | 32px | `spacing/24` / `spacing/20` | `spacing/20` | Poppins SemiBold 18 | Poppins Regular 16 |

**Focus Visible:** explicit **State variant** — outer frame carries 2px `color/jumbo-select-button/focus/ring` stroke (OUTSIDE) + `focus/gap` fill in the 2px padding; ring is outside the container and not clipped.

**Selected (live — may differ from 2026-07-11 build):** selected background + 2px selected border + **check indicator** — not color alone. Prior live inspection suggests indicator may use **success green** (`color/status/success/surface`) and selected border may follow remapped **`color/action/primary/*`** — **verify after token re-export**.

**Tokens:** **27** `color/jumbo-select-button/*` aliases in **`3. Component`** (background ×6 · border ×6 · label ×3 · sub-label ×3 · icon ×5 incl. **`icon/background`** · indicator ×2 · focus ×2).

**Light/Dark:** tokens resolve per Theme mode. **WCAG:** audit below reflects **`tokens.json` export (2026-07-12)** — may not match live aliases until re-exported.

**Accessibility:** selectable option, not an action. Product semantics: **radio** (single-select), **checkbox** (multi-select). Selected must not rely on color alone (border + indicator). Disabled contrast **Exempt / Disabled state**.

### Recent Jumbo Select Button manual updates

| Change | Notes |
|--------|-------|
| Docs restructure | Section contains **`Group 7`** + **`Checkbox Examples`**; legacy Light/Dark frames orphaned on Form page |
| **`icon/background` token** | Large icon-container subtle chip only |
| Large height | **104px** container (typography-driven) |
| Property ID regeneration | **`Label#668:0`** / **`Sub label#668:22`** |
| Possible visual redesign | Green selected indicator · neutral/black selected border — **uncertain; verify live** |

---

### Textarea

**Status:** **Not present in live file** (2026-06-15 inspection). Component set, example frame, and `color/textarea/*` / `density/textarea/*` tokens were **removed** since prior project docs. Local scripts (`figma-textarea.js`, etc.) may still exist — do not assume they match Figma.

---

### Selector / Dropdown (`303:709`)

**Location:** Form page · section **`Component/Dropdown Selector`** · **`Dropdown Selector Examples`** (`309:665`)  
**Related (internal / panel):** **`.Base/ Dropdown / Menu / Option`** (`303:726`) · **`Selector / Dropdown / Menu`** (`303:727` — standalone panel component)

| Property | Values |
|----------|--------|
| **State** (VARIANT) | **Default**, **Hover**, **Active**, **Filled**, **Error**, **Error Active**, **Disabled** (*no **Focus** variant — aligned with Text Field*) |
| **Size** (VARIANT) | Small (40px trigger), Medium (48px trigger) |
| **Show label** (BOOLEAN) | **`Show label#303:16`** → `label-row` visibility |
| **Helper Text** (BOOLEAN) | **`Helper Text#303:17`** → **`Helper`** frame visibility |
| **Required** (BOOLEAN) | **`Required#303:19`** → required asterisk |
| **Show leading icon** / **Leading icon** | Boolean + instance swap |
| **Helper Icon** (BOOLEAN) | **`Helper Icon#596:0`** → helper row icon visibility |
| **Change Helper Icon** (INSTANCE_SWAP) | **`Change Helper Icon#596:13`** |
| **Focus Ring** (BOOLEAN) | **`Focus Ring#596:26`** → `focus ring` rectangle inside **`select-trigger`** |

**No editable TEXT properties** on live set (*Placeholder/Label/Value/Error text props not exposed — previous value from prior docs*).

**Variants:** **14** (7 states × 2 sizes) — *was 12 with Focus in prior docs*

**Layer structure (manual restructure — Text Field pattern):**

| Part | Structure |
|------|-----------|
| Label row | `label-row` → `label` + `required` |
| Trigger | `select-trigger` → `leading-icon` · `placeholder-text` · `value-text` · `chevron-icon` · **`focus ring`** (RECTANGLE) |
| Helper | **`Helper`** frame → `icon` + `text` — **`Helper Text`** boolean |
| Error | **`Error`** frame → `icon` + `text` — **state-driven** (Error / Error Active; no boolean) |

**Focus vs Active:**

| Concept | Live implementation |
|---------|---------------------|
| **Active** | Menu-open / interaction appearance (*placeholder still visible in inspected Default Active variant — needs verification*) |
| **Error Active** | Error frame visible while interacting |
| **Keyboard focus visible** | **`Focus Ring`** boolean on trigger — not a Focus variant |

**Menu option states:** Default · Hover · Selected · Disabled (**.Base/ Dropdown / Menu / Option**)

**Menu panel:** `Selector / Dropdown / Menu` · `Elevation / Popover` · width matches trigger in examples

**Tokens:** `color/dropdown/*` · `color/dropdown-menu/*` · `density/dropdown/*` · reuses `color/border/control/*` · `elevation/dropdown/default`

### Recent Selector / Dropdown Manual Updates Detected

| Change | Notes |
|--------|-------|
| **State axis expanded** | **Active** + **Error Active**; **Focus** removed (*previous: Default/Hover/**Focus**/Filled/Error/Disabled*) |
| **Focus Ring boolean** | Inside **`select-trigger`** — same pattern as Text Field |
| **Helper/Error frames** | Capitalized **`Helper`** / **`Error`** layers; **`Helper Text`** property rename |
| **Placeholder TEXT prop removed** | Copy edited per variant only (*detected in current live file*) |
| **Empty component description** | Set description blank on canvas — consider updating when editing |

---

### Radio Selector → **Selector / Radio Button** (`313:796`)

**Location:** Form page · **`Component/Radio Selector`** section · **`Radio Selector / Examples`** (`314:845`)

| Property | Values |
|----------|--------|
| **State** (VARIANT) | Default, Hover, Focus, Disabled, Error |
| **Selected** (VARIANT) | True, False |
| **Label**, **Description** (TEXT) | Individual / filing helper copy |
| **Show description** (BOOLEAN) | default true |

**Variants:** 10 (5 states × 2 selected)

**Anatomy:** `radio-indicator` (20px circle, 8px dot) + `content` (label + description) · gap `density/radio/gap` (12px)

**Focus:** Offset ring on indicator (`color/radio/focus/ring` + gap) — Focus state only

**Tokens:** 21 `color/radio/*` · 3 `density/radio/*`

**Examples:** State grid + **Filing type** radio group (selected, unselected, disabled, focused options) · Light/Dark sections

**Naming docs:** §16 frames **not present** in current `_Naming` page — *previous value not confirmed*

---

### Checkbox → **Selector / Checkbox** (`365:1031`)

**Location:** Form page · **`Component/Checkbox`** section (`365:907`) · **`Checkbox / Examples`** (`366:1019`)

| Property | Values |
|----------|--------|
| **State** (VARIANT) | Default, Hover, Focus, Disabled, Error |
| **Checked** (VARIANT) | True, False |
| **Indeterminate** (VARIANT) | True, False |
| **Label**, **Description** (TEXT) | "I agree to the terms" / preferences helper copy |
| **Show description** (BOOLEAN) | default true |
| **Show content** (BOOLEAN) | default true — *new property detected in current file; previous value not confirmed* |

**Variants:** 15 (5 states × {unchecked, checked, indeterminate})

**Anatomy:** `checkbox-indicator` (20px rounded box, `radius/4`) + `checkmark` (12px vector) / `indeterminate-mark` (10×2 bar) + `content` (label + description) · gap `density/checkbox/gap` (12px)

**Checked/indeterminate:** Brand fill (`color/checkbox/background/checked`) + visible mark (`color/checkbox/mark/*`) — not color alone

**Focus:** Offset 2px ring on indicator (`color/checkbox/focus/ring` + gap) — Focus state only, not clipped

**Tokens:** 24 `color/checkbox/*` · 4 `density/checkbox/*`

**Examples:** State grid (12 cases) + **Income sources** checkbox group (checked / unchecked / indeterminate / disabled options) · Light/Dark sections

**Naming docs:** §17 frames **not present** in current `_Naming` page — *previous value not confirmed*

---

### Notification Button

**Location:** **`Notifications`** page · **`Component/Notification Button`** section · **`Notification Button`** component set · **`Notification Button Component`** example frame (Light/Dark sections inside)

| Property | Values |
|----------|--------|
| **State** (VARIANT) | Default, Hover, Pressed, Focus, Disabled |
| **Badge** (VARIANT) | None, Dot, Count |
| **Count** (TEXT) | default `3`, supports `99+` |

**Variants:** 15 (5 states × {None, Dot, Count})

**Built on Icon Button:** reuses `color/icon-button/*` and `density/icon-button/small/size`. Base Icon Button unchanged. Bell icon is a fixed drawn vector.

**Tokens:** 5 `color/notification-button/*` · 3 `density/notification-button/*`

**Examples:** No badge · Dot · Count · 99+ · Focus · Disabled — inside **`Notification Button Component`** frame (Light/Dark)

**Naming docs:** §18 frames **not present** in current `_Naming` page — *previous value not confirmed*

---

### Snackbar

**Location:** **`Notifications`** page · **`Component/Snackbar`** section · **`Snackbar`** component set (`392:38`)

| Property | Values |
|----------|--------|
| **Tone** (VARIANT) | Neutral, Success, Warning, Danger, Info |
| **Show icon / Show action / Show close** (BOOLEAN) | defaults: **true, true, true** |
| **Message** (TEXT) | default `"Changes saved."` |

**Variants:** 5 tone variants + boolean/text properties (no separate Action TEXT property — action uses nested **Ghost Button** instance)

**Anatomy (live):**

```
Snackbar (horizontal auto-layout, HUG)
├── left (horizontal, gap 12)
│   ├── leading-icon (optional, material icon instance)
│   ├── message (TEXT, wraps)
│   └── Button (optional, Ghost · Small · Default — label "Undo")
└── Icon Button (optional close, material close icon)
```

**Visual direction (2026 manual update):** Theme-aware **elevated surface** container (`color/snackbar/background/*` → `color/surface/elevated`: **Light `#ffffff`** · **Dark `#292524`**). Tone via **leading icon + accent border** (not colored fill). Message uses `color/snackbar/text/*` → `color/text/default`. Action is a **Ghost Button** with label bound to `color/snackbar/action/text/default`. Close **Icon Button** vector bound to `color/snackbar/close/icon/default`.

**Tokens:** 25 `color/snackbar/*` · 3 `density/snackbar/*` · `elevation/snackbar/default`

| Token group | Alias / resolved (Light · Dark) | Used on canvas? |
|-------------|----------------------------------|-----------------|
| `background/*` | → `surface/elevated` · `#ffffff` / `#292524` | ✅ container fill |
| `border/*` | Foundation tone ramps (`green/500`, etc.) | ✅ stroke |
| `text/*` | → `text/default` · `#231f20` / `#ffffff` | ✅ message |
| `icon/*` | tone ramps; neutral → `status/neutral/surface-inverse` | ✅ leading icon |
| `action/text/*` | → `text/action`, `text-button/text/hover/pressed` | ✅ Ghost Button label → `snackbar/action/text/default` |
| `close/icon/*` | → `text/subtle`, `text/default` | ✅ Icon Button Vector → `snackbar/close/icon/default` |

**Examples:** **18** instances inside **`Component/Snackbar`** section — 5 tones (Light + Dark duplicate sets) · icon/action/close toggles · long-message wrap demo

### Recent Snackbar Manual Updates Detected

Detected in current live file; previous value not confirmed unless noted:

| Change | Notes |
|--------|--------|
| Container background | **Fixed dark bar** (`brand/secondary/500`) → **theme-aware elevated surface** (`surface/elevated`) |
| Message text tokens | **Fixed white** (`neutral/0`) → **theme text** (`text/default`) |
| Action control | **Ghost Button Small** — label bound to `color/snackbar/action/text/default` |
| Close control | **Icon Button** — close **Vector** bound to `color/snackbar/close/icon/default` |
| **Show close** default | Prior docs said `false`; live default is **`true`** |
| **Action** TEXT property | Removed; action label edited on nested Button instance |
| Structure | Added **`left`** sub-frame grouping icon + message + action |
| Component description | Updated — elevated surface wording (no "fixed dark container") |
| Canvas token bindings (2026-06-15) | Action label → `snackbar/action/text/default`; close Vector → `snackbar/close/icon/default` (all 5 tone variants) |

**Token alias fix applied (2026-06-15):** `snackbar/action/text/*` and `snackbar/close/icon/*` aliases updated for elevated-surface contrast. **Canvas bindings aligned 2026-06-15** via `figma-snackbar-canvas-bind.js`.

### Snackbar Issues to Review

| Issue | Severity | Notes |
|-------|----------|-------|
| Ghost action on elevated bar | Low | Ghost Button stroke + text on white snackbar Light — passes audit; confirm visual intent matches design. |
| Focus ring for action/close | Product | Icon Button / Ghost Button focus rings not in snackbar-specific audit — enforce in code (`aria-label` on dismiss, visible focus). |
| `figma-feedback-tokens.js` | Docs | Generator script still documents fixed dark bar — update when regenerating, not during this inspection. |

**Naming docs:** §19 frames **not present** in current `_Naming` page — *previous value not confirmed*

---

### Alert / Banner

**Location:** **`Notifications`** page · **`Component/Alert Banner`** section · **`Alert / Banner`** component set · **`Alert Banner Component`** example frame (Light/Dark)

| Property | Values |
|----------|--------|
| **Tone** (VARIANT) | Neutral, Info, Success, Warning, Danger |
| **Show icon / Show title / Show action / Show close** (BOOLEAN) | defaults: true |
| **Title** (TEXT) | default "Update available" |
| **Message** (TEXT) | default "A new version is ready to install." |
| **Action** (TEXT) | default "Review" |

**Variants:** 5 (one per tone) + boolean/text properties on Neutral variant

**Visual:** Subtle tone backgrounds (`color/status/*/subtle` + neutral surface) · visible border · tone icon · `radius/12` · auto-layout

**Tokens:** `color/alert/*` · `density/alert/*`

**When to use:** Persistent system messages. **Not** temporary feedback (use Snackbar).

**Examples:** All tones · message-only · with action · with close · long message — **`Alert Banner Component`** (Light/Dark)

**Scripts:** `figma-alert.js` · `figma-alert-examples.js` · tokens in `figma-overlay-tokens.js`

---

### Tooltip

**Location:** **`Notifications`** page · **`Component/Tooltip`** section · **`Tooltip`** component set (`435:19`) · **No dedicated example frame** in live file (*`Tooltip Component` removed from `_Documentation` — previous value not confirmed*)

| Property | Values |
|----------|--------|
| **Placement** (VARIANT) | Top, Right, Bottom, Left |
| **Show arrow** (BOOLEAN) | default true |
| **Tooltip text** (TEXT) | default "More information about this option." |

**Visual:** Inverse surface (`color/surface/inverse`) + inverse text · theme-aware · floating elevation · optional caret

**Tokens:** `color/tooltip/*` · `density/tooltip/*` · `elevation/tooltip/default` → `elevation/floating`

**Scripts:** `figma-tooltip.js` · `figma-overlay-examples.js` · `figma-overlay-tokens.js`

---

### Progress Bar

**Location:** **`Navigation`** page (`459:2136`) · **`Component/Progress Bar`** section · **`Progress Bar`** component set (`680:3649`) · **`Progress Bar Component`** example frame (Light/Dark)

> Relocated from Notifications; former dedicated Navigation page `699:765` was removed — Pagination and Progress Bar now share **`459:2136`**.

| Property | Values |
|----------|--------|
| **value** (VARIANT) | 0%, 20%, 50%, 75%, 100% — *lowercase axis name* |
| **size** (VARIANT) | small · medium · large — *lowercase options* |
| **Show step label / Show percentage label** (BOOLEAN) | defaults: **true** |
| **Step label** (TEXT) | default `"Step 1 of 5"` |
| **Percentage label** (TEXT) | default `"20% complete"` |

**Variants:** **15** (5 values × 3 sizes) — names like `value=20%, size=medium`

**Anatomy (live):**

```
Progress Bar (vertical auto-layout, FILL width)
├── header-row (horizontal, space-between)
│   ├── step-label (Poppins, token: progress-bar/label/default)
│   └── value-label (Poppins, token: progress-bar/value/default)
└── track (rounded, clip content, token: progress-bar/track/background/default)
    └── fill (rounded, width by Value variant, token: progress-bar/fill/*)
```

**Visual:** Step label left · percentage right · fully rounded track · brand fill (`#D33F55` via `color/brand/primary/500`). **0%** variant hides fill (`visible: false`). Track uses `color/surface/subtle`.

**Tokens (5 in `3. Component`):**

| Token | Alias target | Resolved (Light · Dark) |
|-------|--------------|-------------------------|
| `color/progress-bar/track/background/default` | `color/surface/subtle` | `#f5f5f4` / `#292524` |
| `color/progress-bar/fill/background/default` | `color/brand/primary/500` | `#d33f55` / `#d33f55` |
| `color/progress-bar/fill/background/complete` | `color/brand/primary/500` | `#d33f55` / `#d33f55` |
| `color/progress-bar/label/default` | `color/text/default` | `#231f20` / `#ffffff` |
| `color/progress-bar/value/default` | `color/text/subtle` | `#57534e` / `#d6d3d1` |

> **Note:** Fill aliases **`brand/primary/500`** (not remapped `action/primary/default`) so the bar reads as Fukurou brand red while meeting fill-vs-track contrast (**4.17:1** Light · **3.33:1** Dark).

**Accessibility:** Progress must be communicated with **text labels**, not color alone. In product code use `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, and an accessible name. Keep percentage visible when progress matters.

**WCAG (2026-07-13):** Label/value text **pass** on page and card (both modes). Fill vs track **pass** non-text 3:1. Track vs page/card is **decorative** in audit (subtle container; fill + labels convey progress).

**Examples:** **`Progress Bar Component`** frame — Small/Medium/Large @ 20% · 0/50/75/100% · without step or percentage label · Light + Dark

**Scripts:** `figma-progress-bar.js` · `figma-progress-bar-examples.js`

---

### Modal / Dialog

**Location:** **`Modals`** page · **`Component/Modal Dialog`** section · **`Modal / Dialog`** component set (`436:322`) · loose **`Overlay`** + **`Modal / Dialog`** instances on page · **No `Modal Dialog Component` example frame** (*removed from `_Documentation` — previous value not confirmed*)

| Property | Values |
|----------|--------|
| **Type** (VARIANT) | Default, Confirmation, Danger confirmation |
| **Size** (VARIANT) | Small, Medium, Large |
| **Show close button / Show footer / Show secondary action** (BOOLEAN) | on Default·Medium |
| **Title / Body** (TEXT) | editable |

**Anatomy:** header (title + Icon Button close) · body · footer (Secondary + Action Button instances)

**Tokens:** `color/modal/*` · `density/modal/*` · reuses `elevation/modal/default`

**Note:** Danger confirmation uses **Action** Button (no Danger button variant). Overlay token `color/modal/overlay/background` aliases `color/surface/overlay` — product code should apply scrim opacity.

**Scripts:** `figma-modal.js` · `figma-overlay-examples.js` · `figma-overlay-tokens.js`

---

### Toggle / Switch → **Selector / Toggle / Switch** (`433:1330`)

**Location:** **`Form`** page · **`Component/Toggle Switch`** · example frame named **`Toggle Switch`** (`417:6170`) — *not `Toggle Switch Examples`*

| Property | Values |
|----------|--------|
| **State** (VARIANT) | Default, Hover, Focus, Disabled |
| **Checked** (VARIANT) | True, False |
| **Show description** (BOOLEAN) | default true |
| **Label / Description** (TEXT) | editable |

**Visual:** Off = neutral track · On = `color/action/primary` track · Focus = 2px brand ring + 2px gap

**Tokens:** `color/switch/*` · `density/switch/*`

**Scripts:** `figma-switch.js` · `figma-switch-examples.js` · `figma-overlay-tokens.js`

---

### Pagination

**Component sets location:** **Navigation** page · **`Component/Pagination`** section (`463:3593`)

**Examples location:** **Navigation** page · **`Pagination Examples`** frame (`463:3619`) — Light/Dark rows inside section.

| Set / component | Variants | Properties / notes |
|-----------------|----------|-------------------|
| **`.Base / Pagination / Item`** | 10 | **internal** · State = Default · Hover · Active · Focus · Disabled · Size = Small · Medium · **Page number** (TEXT) |
| **`.Base / Pagination / Ellipsis`** | 2 | **internal** · Size = Small · Medium · text `…` |
| **`Pagination Desktop`** | 2 | **public** · **Size** = Small · Medium · **`Show Jumper#475:13`** (BOOLEAN) |
| **`Pagination Mobile`** | 1 | **standalone COMPONENT** (not a set) · jumper row used when Show Jumper = true |

**Composed bar (`Pagination Desktop` · Size=Small, live):**

| Region | Contents |
|--------|----------|
| **Left** (HORIZONTAL) | **Icon Button** (prev) · page item instances · **Active** item · more items · **Ellipsis** · last page · **Icon Button** (next) |
| **Right** (HORIZONTAL, gap 32 from Left) | `"Go to"` label · **`Pagination Mobile`** instance (Text Field + Icon Buttons + `"of 120"` copy) — visible when **Show Jumper** enabled |

**Architecture change (detected):** Previous/Next are **`Icon Button`** instances — **not** dedicated `Pagination / Previous` / `Pagination / Next` sets. Page items remain **`.Base / Pagination / Item`** internal sets.

**Sizes (live measurements · Size=Small):**

| Part | Size |
|------|------|
| Page item (`.Base`) | 32×32 |
| Icon Button prev/next | 32×32 |
| Desktop bar outer | 272×36 (Left 272×32 + Right jumper column) |
| Pagination Mobile | 187×44 |

**Active item typography (verified live):** Poppins **Regular** 14px — component set description still claims **semibold** (**stale**).

**Token bindings:** `color/pagination/item/*` · `color/pagination/control/*` · `color/pagination/ellipsis/*` · `color/pagination/focus/*` — **24** tokens. Prev/next arrow **Vector** fills bind **`color/pagination/control/icon/default`** on **`Pagination Desktop`** + **`Pagination Mobile`** (verified **2026-06-15**; examples inherit).

**Density:** `density/pagination/*` (4 tokens) — fixed px in live components; density binding **needs verification**.

**Scripts (historical — do not re-run to overwrite manual edits):** `figma-pagination-tokens.js` · `figma-pagination.js` · `figma-pagination-examples.js`

### Recent Pagination Manual Updates Detected

Inspected live file **2026-06-15** vs prior project docs.

| Change | Previous (documented) | Live (detected) |
|--------|----------------------|-----------------|
| **Page name** | **Navigations** | **`Navigation`** (singular) |
| **Public composed bar** | **`Pagination`** set | **`Pagination Desktop`** + **`Show Jumper`** boolean |
| **Previous / Next** | Dedicated **`Pagination / Previous`** / **`Next`** sets | **`Icon Button`** instances inside **`Pagination Desktop`** — dedicated sets **removed** |
| **Page items** | Public **`Pagination / Item`** | **`.Base / Pagination / Item`** (internal naming) |
| **Ellipsis** | Public **`Pagination / Ellipsis`** | **`.Base / Pagination / Ellipsis`** (internal) |
| **Jumper** | Not present | **`Pagination Mobile`** standalone component + **Right** column (`Go to` + Text Field) |
| **Examples frame** | **Form** · `Pagination Component` | **Navigation** · **`Pagination Examples`** |
| **Active typography** | Regular (semibold removed) | Still **Regular** — but set **description** still says semibold (**stale**) |
| **Bar layout** | Single row gap 8 | **Left** row + **Right** jumper column · **32px** gap between regions |

### Pagination Issues to Review

| Issue | Severity | Notes |
|-------|----------|-------|
| **Stale component description** | Docs | **`.Base / Pagination / Item`** description still claims semibold active weight — live Active uses **Regular**. |
| **Active state may rely on color only** | Accessibility | Confirm WCAG **1.4.1** in product (`aria-current="page"` required). |
| **Pagination control WCAG** | Accessibility | ✅ Fixed **2026-06-15** — `pagination/control/icon/default` → `text/action`; Light **8.42:1** |
| **Density tokens vs fixed px** | Tokens | `density/pagination/*` exist; components use fixed sizes — **needs verification**. |
| **Show Jumper default false** | Product | Jumper UI hidden by default in **`Pagination Desktop`**. |

---

### Icon / Placeholder library (internal)

**Location:** Cards page — **internal `.Base` set** (not public-facing)

| Component set | Variants | Notes |
|---------------|----------|-------|
| **`.Base/ Icon / Placeholder / Star`** | Size=16, 20, 24 | `icon` (star vector) · used as instance-swap default on Button, Text Field, etc. |

> **Naming convention:** Internal/atomic sets use **`.Base/`** or **`.Base /`** prefix. Public components reference these via instance swap — do not publish `.Base` sets to client libraries without review.

> **Detected in current file; previous value not confirmed:** README and prior audits referenced public **`Icon / Placeholder / Star`** and additional icon sets (**Arrow Right**, **Plus**, **Chevron Down**, **Check**) — only **`.Base/ Icon / Placeholder / Star`** remains.

Default placeholder fill/stroke: `color/text/subtle`. Button/Text Button instances override glyph to match **content token** per state via instance overrides.

**External icon limitation:** Swapped icons from external libraries may keep hard-coded fills or locked internals. Normalize into this library before use in Buttons (see README § Button Icon Color).

---

### Card (`87:12`)

**Location:** Cards page · **`Component/Card`** section

| Property | Values |
|----------|--------|
| **Media** (VARIANT) | None, Image, Icon |
| **Status** (VARIANT) | **Default, Hover** — *new variant axis detected; previous value not confirmed* |
| **Show title / Show body / Show footer** (BOOLEAN) | default `true` |
| **Title**, **Body** (TEXT) | editable |
| **Icon** (INSTANCE_SWAP) | default **`.Base/ Icon / Placeholder / Star`** Size=24 |

**Variants:** 6 (3 Media × 2 Status — booleans avoid variant explosion)

| Media | Layout behavior (live) |
|-------|------------------------|
| **None** | Content frame with 24px padding; title, body, footer |
| **Image** | Image frame **flush** top/left/right (`x:0`, `y:0`, full card width, height 160); card root padding 0; content below with 24px padding |
| **Icon** | Large icon inside content area with normal 24px padding |

Footer uses nested **Ghost Button** instance (“Learn more”).  
Card set description is **empty** in the live file.

**Supporting assets:** `Icon / Placeholder / *` component sets · `Card / Examples` frame

---

## Internal / Atomic Components

Public-facing library components may nest **hidden/internal** building blocks. Detected via **`.Base/`** and **`.Base /`** naming (Figma Plugin API cannot reliably read publish/hide flags).

| Internal set | Page | Role |
|--------------|------|------|
| **`.Base/ Icon / Placeholder / Star`** | Cards | Default star icon for instance swaps |
| **`.Base/ Dropdown / Menu / Option`** | Form | Menu row primitive for Selector / Dropdown |
| **`.Base / Pagination / Item`** | Navigation | Page number cell (all interactive states) |
| **`.Base / Pagination / Ellipsis`** | Navigation | Non-interactive ellipsis |

**Standalone internal helper:** **`Pagination Mobile`** — jumper UI (Text Field + Icon Buttons); nested inside **`Pagination Desktop`** when **Show Jumper** = true.

**Standalone components (non-set, public or panel):**

| Component | Page | Role |
|-----------|------|------|
| **`Icon / Placeholder / Search`** | Cards | Public search icon set (Size variants) for Search Field |
| **`Selector / Dropdown / Menu`** | Form | Dropdown panel (uses `.Base` options) |
| **`Modal / Dialog/Overlay`** | Modals | Scrim overlay for Modal / Dialog |

**Publishing note:** Figma Plugin API cannot read library publish/hide flags reliably. Treat **`.Base/*`** as internal; ship **`Selector / Dropdown`**, **`Text Field`**, **`Button`**, etc. to consumers.

---

## Documentation frames

**Foundations page (live):**

| Frame | Purpose |
|-------|---------|
| **`Foundations / Color`** | Brand, neutral, red, amber, green, blue ramps (50–900) |
| **`Foundations / Typography`** | Type scale |
| **`Foundations / Elevation and Shadow`** | Elevation scale + shadow guidance |

**`_Documentation` page (live — repopulated):**

| Frame | Purpose |
|-------|---------|
| **`Documentation / 3-Tier System`** | Tier 1/2/3 explainer · alias chain example · benefits |
| **`Overlay Components / Documentation`** | Alert, Tooltip, Modal, Switch usage notes (*some location references stale — Tooltip now on Notifications*) |

**`_Naming, Theme, Density & Responsive` page (live):** **`Docs / Naming, Theme, Density & Responsive`** · **`Preview / Light`** · **`Preview / Dark`**

**Example / demo frames (live names):**

| Frame | Page |
|-------|------|
| **`Text Field Examples`** | Form |
| **`Dropdown Selector Examples`** | Form |
| **`Radio Selector Examples`** | Form |
| **`Checkbox Examples`** | Form |
| **`Toggle Switch`** | Form |
| **`Pagination Examples`** | **Navigation** |
| **`Card Examples`** | Cards |
| **`Notification Button Component`** | Buttons |
| **`Modal Dialog Component`** | Modals |
| Snackbar / Alert / Tooltip demos | Notifications (inside section **` `** wrapper frames — no `Snackbar Component` named frame) |
| **`Preview / Light`** · **`Preview / Dark`** | `_Naming, Theme, Density & Responsive` |

---

## Token architecture audit (3-tier model)

| Tier | Intended role | Live status |
|------|---------------|-------------|
| **Foundation** | Raw values only | ✅ Brand/neutral/spacing/radius scales in `1. Foundation` |
| **Theme** | Semantic intent (action, surface, text, border) | ✅ Light/Dark modes in `2. Theme` |
| **Component** | Component-specific aliases | ✅ Button, Text Button, Icon Button, Text Field, Dropdown, Radio Selector, Checkbox, **Snackbar**, **Notification Button**, **Pagination**, Card tokens present |

### Findings (document only — not auto-fixed)

| Finding | Severity | Notes |
|---------|----------|-------|
| Transparent component colors use **raw alpha-0 fills** instead of semantic aliases | Low | `color/text-button/background/*`, `color/button/ghost/background/default` — intentional for transparency |
| Action/Secondary **border/default** are hardcoded transparent | Low | By design (no default stroke on filled buttons) |
| No duplicate variable names detected | — | **551** variables across collections |
| ~~**7 broken elevation aliases**~~ | ✅ Fixed | Restored **`effect/shadow/none`** in Foundation; **`elevation/none`** re-aliased in Theme |
| Theme **status token restructure** | Info | Old `color/status/{tone}/default` removed; expanded subtle/surface/text tokens — **re-export `tokens.json` + re-run WCAG audit** |

---

## Recent Manual Updates Detected

### Live file update (2026-06-19 — Date Picker removal)

| Area | Change |
|------|--------|
| **Date Picker removed** | Set **`561:2226`** deleted |
| **Date Range Picker removed** | Set **`561:2938`** deleted |
| **Documentation removed** | Example frames + orphan labels removed; **`Component/Date Picker`** section cleared |
| **Calendar internals removed** | All **`.Base / Calendar/*`** components removed (Date Picker-only) |
| **Tokens removed** | **54** variables: `color/date-picker/*`, `color/calendar/*`, `elevation/calendar/default`, `elevation/date-picker/default`, `density/calendar/*` |
| **WCAG re-baseline** | **352 pairs · 0 non-exempt failures** · **479** color tokens |

> Date Picker and Date Range Picker are **not** current available components.

### Live file update (2026-06-19 — Text Field manual edit)

| Area | Change |
|------|--------|
| **Text Field states** | **Active**, **Error Active** added; **Focus** variant removed |
| **Focus Ring boolean** | Keyboard focus visible via **`Focus Ring#586:0`** |
| **Anatomy** | `left` frame + inline `focus ring` rectangle; helper frame with icon |
| **Properties** | Helper Text / Error Text booleans; text props removed (*see Text Field section*) |

### Live file update (2026-06-19 — Date Picker addition — removed same day)

*Historical — components and tokens listed here were subsequently removed.*

| Area | Detected change |
|------|-----------------|
| **Date Picker** | New public set **`561:2226`** — 12 variants (6 states × 2 sizes) · full text/boolean props |
| **Date Range Picker** | New public set **`561:2938`** — 36 variants (6 × 2 × 3 range display) |
| **Calendar internals** | **5** `.Base / Calendar/*` components (Day Cell 10 states, Week Row, Grid, Header, Container) |
| **Documentation** | **`Component/Date Picker`** section **`562:2860`** with Light/Dark grids + calendar open examples |
| **Tokens** | **+49** color tokens (`color/date-picker/*`, `color/calendar/*`) + **3** density + **2** elevation string aliases → **528** color audited |
| **WCAG audit** | **404 pairs · 0 non-exempt failures · 16 exempt disabled** |

---

### Live file re-inspection (2026-06-15 — Text Field + Search Field manual edits)

Both form inputs now share the same **state + focus model**. Prior Search Field docs (Focus variant, `helper-text` wrappers, external `focus-ring`) are **outdated**.

| Area | Detected change |
|------|-----------------|
| **Search Field state axis** | **Active** + **Error Active** added; **Focus** variant removed — **14** variants (7 × 2) |
| **Search Field Focus Ring** | **`Focus Ring#586:47`** boolean — rectangle inside `input-container` (same as Text Field) |
| **Search Field properties** | **`Helper Text#528:15`**, **`Show icon#586:71`**, **`Helper Icon#586:60`** swap — no Error Text / clear toggles |
| **Search Field anatomy** | **`helper`** + **`error`** frames (Text Field pattern); external **`focus-ring`** wrapper removed |
| **Search Field clear button** | **Fixed 2026-06-15** — visible on Filled/Error; Active uses Icon Button |
| **Text Field cancel affordance** | **Icon Button** instance visible in **Active** / **Error Active** (*detected in current live file*) |
| **Examples frame** | **`Text Field Examples`** (`255:772`) |
| **Search Field section** | **`Component/Seach Field`** on Form page (*typo*) with in-section Light/Dark grid |
| **Search Field / Examples removed** | Standalone frame **`528:3366`** no longer in file |

---

### Live file re-inspection (2026-06-15)

Compared live Figma file to prior **`CURRENT_FIGMA_STATE.md`** / **`README.md`**. Major manual changes detected.

| Area | Detected change |
|------|-----------------|
| **Variables** | **530 → 550** total · Theme **61 → 81** · Component **280 → 304** · Density **52 → 56** |
| **Theme status tokens** | Restructured — **`color/status/*`** now uses subtle/surface/text/text-inverse per tone + **`color/border/status/*`** + **`color/action/inverse/*`** · old **`/default`** status tokens **removed** |
| **Broken aliases** | ~~7 elevation~~ **Fixed 2026-06-15** — restored `effect/shadow/none`, re-aliased `elevation/none` |
| **Page rename** | **`Navigations` → `Navigation`** |
| **Form control renames** | **`Dropdown` → `Selector / Dropdown`** · **`Radio Selector` → `Selector / Radio Button`** · **`Checkbox` → `Selector / Checkbox`** · **`Toggle / Switch` → `Selector / Toggle / Switch`** |
| **Pagination refactor** | Public **`Pagination Desktop`** + **`Pagination Mobile`** · internal **`.Base / Pagination / Item`** · **`.Base / Pagination / Ellipsis`** · prev/next = **Icon Button** instances · **`Show Jumper`** boolean · examples → **`Pagination Examples`** on **Navigation** |
| **Icon library** | **`Icon / Placeholder / Star` → `.Base/ Icon / Placeholder / Star`** (internal) |
| **Menu option** | **`Dropdown / Menu / Option` → `.Base/ Dropdown / Menu / Option`** (internal) |
| **Duplicate button sets** | **Removed** — single Button / Text Button / Icon Button sets (`452:2113` / `452:2338` / `452:2407`) |
| **Card** | New **`Status`** variant axis (Default · Hover) — **6** variants |
| **Text Field** | New booleans **`Full Package#475:0`**, **`Field One#482:16`** |
| **`_Documentation`** | **Repopulated** — 3-tier system docs + overlay component notes |
| **Modal examples** | **`Modal Dialog Component`** example frame added on **Modals** |
| **Snackbar / Alert / Tooltip examples** | Demo content inside section wrapper frames (unnamed **` `**) — prior named **`Snackbar Component`** frame **not present** |
| **Multi-Select Dropdown** | Still **not present** ✓ |
| **Brand primary** | **`#D33F55`** unchanged ✓ |
| **Brand secondary (500)** | **`#231F20`** unchanged ✓ |

---

### Prior audit note (2026-06-15 — superseded sections above)

*The following reflected the file before the latest manual edits; kept for history only.*

Summary of changes **detected in the current live file** compared to prior project documentation. Where prior values are unknown, marked *previous value not confirmed*.

| Area | Detected change |
|------|-----------------|
| **Textarea removed** | **`Textarea`** component set, **`Textarea / Examples`**, and all **`color/textarea/*`** / **`density/textarea/*`** tokens **not in live file**. |
| **Pagination relocated to Navigations** | Sets moved from **Form** → **`Navigations`** page (`Component/Pagination` `463:3593`). Examples stay on **Form** (`Pagination Component`). **`Pagination`** is now a **Size** variant set (Small/Medium); bar ends with page **`99`**; page items use **pill radius (999)**; **Active** item is **Regular** weight (semibold removed). *Previous Form location `462:1261` not confirmed in live file.* |
| **Pagination restored** | Item/Previous/Next/Ellipsis sets · composed **`Pagination`** bar · **`Pagination Component`** examples · **`color/pagination/*`** tokens. *(See row above for post-restore manual edits.)* |
| **New `Modals` page** | **`Modal / Dialog`** set on **`Modals`** · WIP: **`gergsergserg`** text, **`Overlay`** + **`Modal / Dialog`** instances. |
| **Tooltip relocated** | **`Tooltip`** set on **`Notifications`** page (was **`_Documentation`**). |
| **`_Documentation` cleared** | **0 top-level nodes** — overlay/pagination doc frames removed. |
| **Notification Button** | Set + **`Notification Button Component`** example on **`Buttons`** page. |
| **Duplicate button sets** | **Two copies** each of Button / Text Button / Icon Button on Buttons page — *needs verification*. |
| **Dropdown** | **No `Helper` text property** on live set (*previous value not confirmed*). |
| **Checkbox / Switch** | **`Show content`** boolean on both (default `true`). |
| **Variables** | **530** total · **0 broken aliases** · brand **`#D33F55`** / **`#231F20`** unchanged. |
| **Effect styles** | Elevation uses **PascalCase** (`elevation/Surface`, …). |
| **Multi-Select Dropdown** | Still **not present**. |
| **Tabs / Tag·Chip** | **Not present** as components. |

---

## Possible Issues to Review

### File structure / organization

| Issue | Severity | Notes |
|-------|----------|-------|
| **Navigation page consolidated** | Resolved | Pagination + Progress Bar both on `459:2136`; former `699:765` removed (*2026-07-17 re-audit*) |
| **Foundations loose collage** | Low | ~37 loose rectangles/text for brand ramp exploration — not tokenized; leave unless asked to clean |
| **Section typos** | Low | **`Component/Seach Field`**, **`Component/Textfield`** naming |
| **Jumbo docs frame name** | Low | Jumbo examples frame still named **`Checkbox Examples`** |
| **`tokens.json` drift** | Medium | Export **510** vs live **511** color vars — full re-export recommended |

### Theme / tokens

| Issue | Severity | Notes |
|-------|----------|-------|
| **Action primary = neutral** | Info | Confirmed: primary action black/white; brand red on **tertiary**. Document for product teams — Buttons use remapped action tokens |
| **Jumbo selected = green** | Info | Selected border/indicator use success green (`#2f9e60`), not brand red — intentional? Flag for design review |
| **Progress fill bypasses Theme** | Low | Fill aliases Foundation **`brand/primary/500`** directly (works; not Theme-aware for dark brand variants) |

### Date Picker / Date Range Picker removal

| Issue | Status |
|-------|--------|
| **Date Picker** | **Current** — re-added **2026-07-26** (`745:2136`) |
| Date Range Picker / range calendar | **Not current** — do not create unless requested |
| Date/calendar tokens (single date) | **Present** — `color/date-picker/*` · `color/calendar/*` |
| Multi-Select Dropdown | **Absent** ✓ |
| Generator scripts | **Deprecated historical scripts remain — do not re-run blindly** |

### Text Field issues to review

| Issue | Severity | Notes |
|-------|----------|-------|
| **Error Text unbound on Error / Error Active** | Medium | Error frame forced visible without `Error Text#241:20` ref on Error variants |
| **Unused text-field focus tokens** | Low | Canvas ring uses **`color/border/focus`**; `color/text-field/focus/ring|gap` unused |
| **`background/error` unused** | Low | Error states use **`background/filled`** |
| **No editable text props** | Medium | Copy changes require editing variants |
| **Error + Focus Ring combo** | Medium | Combinable via boolean; no dedicated doc example |
| **Icon Button / active group inconsistency** | Low | Some variants missing cancel node or `active group` |
| **Focus ring clipping** | Watch | Currently OK (`clipsContent: false`) |

### Selector / Dropdown issues to review

| Issue | Severity | Notes |
|-------|----------|-------|
| **Empty component description** | Low | Live set description is blank |
| **Active variant content** | Medium | **Active** still shows **placeholder** not **value** in inspected variant — verify menu-open intent |
| **No editable text props** | Medium | Placeholder/value/error copy requires variant edits |
| **Error frame visibility** | Low | State-driven only — no Error Text boolean (matches Search Field) |
| **Capitalized Helper/Error layers** | Low | **`Helper`** / **`Error`** vs lowercase on Text Field — naming inconsistency only |

### Search Field issues to review

| Issue | Severity | Notes |
|-------|----------|-------|
| **No clear affordance in Filled/Error** | **High** | **Filled** and **Error** variants lack **`clear-button`** layer — only **Active/Error Active** show Icon Button cancel |
| **Hidden clear-button on Default** | Medium | **`clear-button`** present but hidden on Default/Hover/Disabled — may confuse consumers |
| **Error frame width mismatch** | Medium | **`error`** frame **244px** wide inside **428px** component |
| **Focus ring inside input** | Low | **`focus ring`** RECT inside `input-container`; **`clipsContent: false`** |
| **No editable text props** | Medium | Copy changes require editing variants |
| **Search icon size** | Low | **24×24** on Small and Medium — verify against density intent |
| **Section name typo** | Low | **`Component/Seach Field`** |
| **Helper/error token mix** | Low | Reuses **`color/text-field/helper/*`** and **`error/*`** |

### Search Field issues to review (resolved)

| Issue | Status |
|-------|--------|
| **State model docs stale in Figma** | **Resolved 2026-06-15** |
| **Focus ring clipping (external wrapper)** | **Resolved** — ring inside input |
| **Helper/error collapse** | **Resolved** in layout tests |

### Other issues

| Issue | Severity | Notes |
|-------|----------|-------|
| **Search Field section typo** | Low | Live section named **`Component/Seach Field`** — consider renaming to **`Component/Search Field`** when editing |
| **Search Field missing boolean toggles** | ~~Medium~~ **Resolved** | Clear visibility state-driven (Filled/Error vs Active/Error Active) |
| **Search Field missing text properties** | Medium | Label/placeholder/value/helper/error are no longer editable component properties |
| **Search Field focus ring clipping** | ~~Low~~ **Resolved** | External **`focus-ring`** wrapper removed; ring is inside `input-container` with **`clipsContent: false`** |
| **Search Field hidden wrapper heights** | ~~Low~~ **Resolved** | **`helper`** / **`error`** frames collapse when hidden in layout tests |
| **Section vs loose Search Field placement** | Low | Set inside section; scripts targeting **`Search Field / Examples`** at page root will not find it |
| **7 broken elevation aliases** | ~~High~~ **Fixed 2026-06-15** | Restored `effect/shadow/none` + re-aliased `elevation/none` |
| **Theme status token migration** | Medium | Components may still reference old status paths — **needs verification** after alias audit |
| **Pagination architecture vs WCAG audit** | Resolved | Prev/next use pagination tokens; audit passes |
| **Stale `.Base / Pagination / Item` description** | Low | Claims semibold active weight; live uses Regular |
| **`_Documentation` overlay copy** | Low | Still references Tooltip on `_Documentation` — live Tooltip is on **Notifications** |
| **Selector / Dropdown missing text props** | Medium | No editable placeholder/value/error TEXT props — aligned with Text Field pattern |
| **`tokens.json` drift** | **Medium** | Live file **511** color vars · export **510** tokens (**2026-07-13** patch includes **progress-bar**); jumbo **`icon/background`** and other drift may remain — full re-export recommended |
| **Jumbo docs frame name** | Low | **`Checkbox Examples`** inside Jumbo section — may contain stale Checkbox spec copy |
| **Jumbo legacy Light/Dark frames** | Low | **`656:1689`** / **`656:1885`** on Form page root — redundant with new matrix? |
| **Jumbo Large height** | Low | **104px** live vs **96px** documented target |
| **Jumbo icon/background coverage** | Low | Token bound on **Large** only — Small/Medium have no icon-container fill |
| **Possible Theme `action/primary` remap** | **High** | Prior inspection suggests neutral remap — impacts Button + Jumbo selected border — **verify in Figma** |
| **Jumbo selected indicator color** | Medium | Prior inspection suggests **success green** indicator — re-audit after re-export |
| **Card Status=Hover** | Low | New variant axis — confirm elevation/token bindings for hover state |
| **Multi-Select Dropdown** | — | **Not recreated** ✓ |

---

### Green and blue Foundation ramps completed (2026-06-15)

**Live state:** Added missing `color/green/200`, `color/green/800`, `color/blue/200`, and `color/blue/800` to **`1. Foundation`**. Values interpolated between existing neighbors (200 between 100↔300, 800 between 700↔900). Green and blue ramps now include complete **50–900** scales. **`Foundations / Color`** swatches for Green and Blue now bind to the correct variables (200/800 previously pointed at `color/red/*`). Status aliases (`color/status/success/*` → green, `color/status/info/*` → blue) unchanged — no repairs needed.

---

### Detected change: Text Button per-state fill bindings fixed (2026-06-11)

**Live state:** Each variant label binds its own fill token. Hover has underline. Small/Default no longer uses disabled token.

**Likely impact:** State colors and hover affordance now work independently; Label property still syncs text only.

**Recommended follow-up:** Avoid editing Text Button fill at component-set level in Figma UI (use per-variant overrides).

---

### Detected change: Loose Text Button instance on Button page

**Live state:** Instance `137:29` placed at page level outside the component set.

**Likely impact:** Possible QA/preview artifact; not harmful but may confuse library consumers.

**Recommended follow-up:** Move into examples frame or delete if accidental — **only when asked**.

---

### Detected change: Button page `Buttons` section layout

**Live state:** Button + Text Button sets nested in `Buttons` section (`113:126`).

**Likely impact:** Generator places sets directly on page — re-running plugin may duplicate or misplace.

**Recommended follow-up:** Never full-regenerate without backup; use targeted edits.

---

### Detected change: Documentation page cleared

**Live state:** `Documentation` page has 0 nodes; content on Naming page.

**Likely impact:** Generator would recreate a separate docs page.

**Recommended follow-up:** Preserve empty Documentation page unless user asks to populate.

---

### Detected change: Button set description updated

**Live state:** Ghost described as secondary-brand stroke; Text Button called out as separate.

**Likely impact:** Docs aligned with intended hierarchy.

**Recommended follow-up:** None.

---

## Known risks / mismatches

| Risk | Figma (live) | Code / docs | Action |
|------|--------------|-------------|--------|
| **Text Button fill at set level** | Per-variant bindings restored | Documented | Avoid editing fill on whole set in Figma UI |
| **Text Button hover underline** | ✅ on label layer | README + plugin synced | Aligned |
| **Text style via textStyleId** | Direct typography on labels | Library styles exist for reference | Variant sets can sync textStyleId — use direct props |
| **Button page layout** | `Buttons` section | Generator: flat page | Mismatch |
| **Documentation page** | Empty | Generator: populated page | Intentional manual |
| **File display name** | **Fukurou Design System** (UI) · API may report `Document` | Docs aligned | ✅ Renamed from template |
| **Card set description** | Empty | README documents behavior | Minor |
| **Focus ring vs Action fill** | ~~1.00:1 (edge)~~ → **8.42 / 10.00** ring vs gap | ✅ Fixed | Offset `focus-ring` wrapper |
| **Decorative borders** | <3:1 vs surfaces | Documented exempt | By design |

---

## WCAG quick audit (2026-06-15 — live re-export)

**Script:** `cd Fukurou && npx tsx scripts/audit-wcag.ts`  
**Last run:** 2026-06-19 on **`tokens.json` re-export (479 color tokens)** — **0 non-exempt failures** · **15 exempt (FAIL\*)** · **4 decorative** · **352 pairs**

> **2026-06-19:** Date Picker / Date Range Picker **removed** — 54 tokens deleted, audit back to **352 pairs · 0 non-exempt failures.**

| Area | Result |
|------|--------|
| Action / Secondary button text | ✅ Pass (Action Light marginal ~4.55:1) |
| Ghost text + stroke | ✅ Pass Light & Dark |
| Text Button text (default) on page/card | ✅ 8.42 / 10.0 Light page |
| Pagination prev/next icon (Light default) | ✅ **8.42:1** (was 4.36:1) |
| Status filled text/icon on surface | ✅ Pass (inverse tokens) |
| Snackbar text/icon/action/close (Dark) | ✅ Pass on elevated surface |
| Snackbar elevated surface re-baseline | ✅ 30/30 pairs pass after token alias fix |
| Modal overlay vs page (Dark) | ✅ **5.32:1** composite |
| Focus ring vs gap / page | ✅ **8.42–10.00:1** |
| Disabled pairs | FAIL\* — exempt / inactive |

See [`ACCESSIBILITY_AUDIT.md`](./ACCESSIBILITY_AUDIT.md) — Dropdown pairs added; trigger/control/focus pass; disabled exempt.

---

## Do-not-revert checklist

Preserve unless explicitly asked to change:

- [ ] `Buttons` **section** layout on Button page
- [ ] Ghost **secondary-brand** stroke + text (not primary pink)
- [ ] Text Button as **separate** component set (not a Button Type)
- [ ] Text Button **per-state fill tokens** (default/hover/pressed/disabled per variant)
- [ ] Text Button hover **underline on label** + transparent background
- [ ] Text Button size typography (sm/md/lg direct on label)
- [ ] Card **Media** variants (None / Image / Icon) + boolean toggles
- [ ] Image variant **flush** top/left/right layout
- [ ] Docs sections 01–16 on Naming page
- [ ] **`Elevation & Shadow`** frame on `_Documentation` page
- [ ] No Warning/Danger Button types
- [ ] Brand primitive hex values (`#D33F55`, `#231F20`)

---

## Code sync reference

| File | Role |
|------|------|
| `plugin/code.js` | Generator — may **diverge** from live file after manual edits |
| `scripts/tokens.json` | Exported resolved colors |
| `scripts/audit-wcag.ts` | Contrast audit |
| `README.md` | Human docs — verify against this file before trusting |
| `ACCESSIBILITY_AUDIT.md` | WCAG report |
| `SAFE_WCAG_FIX_PLAN.md` | Applied + recommended fixes |
