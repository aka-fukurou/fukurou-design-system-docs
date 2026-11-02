# Fukurou docs site

Static HTML documentation for the **Fukurou Design System**.

## Live site

**Live docs URL:** [https://aka-fukurou.github.io/fukurou-design-system-docs/](https://aka-fukurou.github.io/fukurou-design-system-docs/)

The local server is not required for ongoing access. Pushes to `main` publish this folder through [`.github/workflows/deploy-docs.yml`](../../.github/workflows/deploy-docs.yml).

## Open locally

No build step. This folder is already the published site.

```bash
open Fukurou/docs/index.html
# or serve:
npx --yes serve Fukurou/docs -l 4175
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | Documentation page + interactive component examples |
| `styles.css` | Layout, Light/Dark Theme CSS variables, Figma-matched preview styles |
| `script.js` | Theme toggle (`localStorage`), sidebar nav, component interactions |
| `assets/logo_B.png` | Fukurou owl logo (sidebar brand mark) |
| `favicon-*.png`, `favicon.ico`, `apple-touch-icon.png` | Browser tab and home-screen icons |

## Features

- **Foundation / Color** — full live Figma palette docs: brand anchors, Primary/Secondary/Neutral/Amber/Red/Green/Blue ramps with token names + hex + swatches, status mapping, and usage guidance
- **Foundation / Typography** — Lora + Poppins families, all 18 text styles with size/weight/line-height/tracking, specimens, usage + accessibility guidance. The Type scale was redesigned (2026-10-05) from a cramped 8-column table into grouped specimen rows (preview beside a compact metadata list) with role-specific short preview strings; values re-checked against the live Figma text styles and preserved (the two `text-button/underline/lg|sm` rows now correctly show SemiBold); stacks on narrow viewports; Light/Dark verified
- **Foundation / Elevation & Shadow** — added 2026-10-05 from the live `Foundations / Elevation and Shadow` frame (`255:1944`): seven `elevation/*` levels (None · Surface · Raised · Floating · Popover · Modal · Overlay) with 160×80 preview cards, token + effect-style + `effect/shadow/*` primitive names, exact CSS shadow strings (`--elevation-*` variables), component-mapping table, Dark-mode companion colours (`surface/floating`, `surface/elevated`, `border/elevated`, `surface/overlay`) with a floating-panel demo, usage + accessibility guidance; same shadow values in both themes per Figma; responsive grid
- **Figma-matched previews** — sizes, radius, type, and colors aligned to live Figma components / Theme tokens
- **Interactive examples** — real controls for Button, Text Field, Search (clear), Checkbox, Radio, Switch, Dropdown, Date Picker, Jumbo Select, Pagination, Snackbar, Alert, Modal, Tooltip, Progress Bar
- **Date Picker popover** — calendar dropdown is anchored to the trigger and sits about `2px` below it in Light and Dark (2026-10-05)
- **Date Picker calendar states** — reconciled with Figma `.Base / Calendar / Day Cell` + `Calendar Popover` (2026-10-05): 36px circular day cells, circular Hover/Selected fills, 2px Today outline, 2px focus outline, `color/calendar/*` values as CSS variables for Light and Dark. Demo dates fixed to the Figma example (Today Jul 26 · Disabled Jul 28 · Unavailable Jun 30).
- **Button states** — reconciled with the Figma `Button` set (2026-10-05): Action/Secondary/Ghost Default · Hover · Pressed · Focus · Disabled use `color/button/*` values resolved for Light and Dark; Ghost is transparent with a 2px stroke; Disabled is 60% opacity; keyboard focus (`:focus-visible`) shows the 2px gap + 2px ring outside the pill; static Focus and icon examples included
- **Text Button + Icon Button states** — reconciled with the Figma `Text Button` and `Icon Button` sets (2026-10-05): Text Button is text-only, Poppins SemiBold 600 in every state (14/20 · 16/20 · 18/28, re-audited 2026-10-05), underline on hover, `color/text-button/content/*` Light/Dark values, plain 2px outside focus stroke, 60% disabled, S/M/L sizes; Icon Button uses `color/icon-button/*` (tertiary content, subtle hover fill, solid pressed fill with inverse content), offset focus ring, 60% disabled, `aria-label` on every example
- **Notification Button** — reconciled with the Figma `Notification Button` set (2026-10-05): 20px filled bell on the Icon Button body, 8px dot at the body's top-right and a 16px count pill (Poppins Regular 12/16, 6px padding, 99+) at top −2, both with a 2px outside page-coloured stroke via `box-shadow` so layout never shifts; `--color-notif-*` variables for Light and Dark; None · Dot · Count · 99+ · Focus · Disabled examples with count-bearing `aria-label`s; Disabled keeps full opacity per Figma
- **Text Field** — reconciled with the Figma `Text Field` set (2026-10-05): `--color-text-field-*` Light/Dark values already matched live tokens; examples now cover Default · Hover · Focus Ring · Filled · Error · Error Active · Disabled · Small · Leading · Trailing · Required · No label · Helper · Helper without icon; Active stays 2px `border/hover` + cancel, Focus Visible is `:focus-visible` 2px ring + 2px page gap; Disabled is 60% opacity (Exempt); helper uses an info icon; Error Active Medium value is 16/24; computed padding is 16px Medium / 12px Small; inner input no longer stacks a second `:focus-visible` ring (shell owns Focus Visible)
- **Card** — reconciled with the Figma `Component/Card` set (2026-10-05): `--color-card-*` variables for background, border, title, body, media and icon (Light/Dark), `elevation/Surface` default and `elevation/Raised` hover shadows, flush 160px image media, 48px icon container inside the padded content, `heading/sm` title and `body/md` body; Default · Image · Icon · Title only · Body only · Image + title examples with the footer action as a real Small Text Button and decorative media/icon marked `aria-hidden`
- **Readability pass (2026-10-08)** — dense token / state / accessibility paragraphs converted to `.doc-note` grouped lists (Button family, Card, Text Field, Date Picker, and shorter Search / Jumbo / Tooltip / Progress notes). Meaning preserved; component behaviour unchanged.
- **Doc-note typography (2026-10-13)** — boxed `.doc-note` sections keep the same layout and grouping; body, bullets, and titles use Fukurou **caption/md** via `--font-size-caption` / `--line-height-caption` (12px / 16px). Main section copy and component previews unchanged. Light/Dark and responsive behaviour checked.
- **Interactive preview spacing (2026-10-13)** — `.preview-row--spacious` and Button / Text Button / Icon Button / Card preview rows use `--space-16` (64px) column gap on desktop, `--space-8` (32px) below 768px. Text Field and other dense layouts keep the default `--space-3` row gap. Focus rings remain visible (`overflow: visible` on compact-control panels).
- **Notification Button preview labels (2026-11-02)** — Interactive preview uses `.preview-specimen` stacks with Figma-matched captions (No badge · Dot · Count · Count 99+ · Focus · Disabled) **below** each button; caption/md regular + `--color-text-subtle`. Button variants unchanged.
- **Dropdown (2026-11-02)** — reconciled with Figma `Component/Dropdown Selector` (`309:634`): `--color-dropdown-*` / `--color-dropdown-menu-*` Light/Dark variables from `color/dropdown/*` and `color/dropdown-menu/*`; Medium 48/16 and Small 40/12 trigger, 24px `expand_more` chevron that flips when open, 2px `border/hover` Active/open border (padding compensates), keyboard-only `:focus-visible` ring (2px ring + 2px gap), menu 2px below the trigger with 4px padding, 1px `dropdown-menu/border/default`, radius 8 and `elevation/Floating`, 40px options with a 24px trailing checkmark on the right of the selected row; trigger chevron stays trailing (16px inset, 8px gap from value). Interactive preview uses the shared two-column `.tf-state-list` (Default · Filled · Error + message · Disabled · Required · Helper text with lock icon · Leading icon · Small). Custom listbox keyboard model: Enter / Space / ↑ ↓ open, arrows + Home / End move `aria-activedescendant`, Enter / Space select, Escape and Tab close, outside click closes, disabled trigger never opens. Dark option hover fill mirrors the selected fill (not bound in the live set — needs verification).
- **Date Picker (2026-11-02)** — comprehensive reconciliation with Figma `Component/Date Picker` (`745:2579`): `--color-date-picker-*` Light/Dark variables from `color/date-picker/*` (hover `#57534e`, active `#000`, error `#dc2626`, disabled tokens, `icon/active` when open) and the full `--color-calendar-*` set (header, weekday, day default/hover/selected/today/disabled text, nav icon, footer). Trigger Medium 48/16 and Small 40/12 with the 24px `calendar_today` icon, 2px `border/active` open state (padding compensates), keyboard-only `:focus-visible` ring; Calendar Popover 308 wide, 16 padding, 12 gap, radius 12, `elevation/Popover`, 2px below the trigger, flips above when the viewport has no room. Header uses the internal `.Base / Calendar / Nav Button` (32px, radius 4, 16px `arrow_back_ios_new` / `arrow_forward_ios`, inset focus ring); days are a `<table role="grid">` of 36px circular cells with 4px gaps, Today = 2px outline, Selected = fill + inverse text (offset ring when focused). Interactive preview uses the two-column `.tf-state-list`: Default · Selected date · Calendar open (in-flow, mirrors the Figma July 2026 composite) · Error + message · Disabled · Required · Without calendar icon · Small · Calendar day states strip. APG Date Picker Dialog keyboard model: Enter / Space / ↑ ↓ open and focus the selected day or today, arrows move by day/week, Home / End, Page Up / Down (+Shift for year), Enter / Space select and close, Escape closes and restores focus, Tab cycles inside the dialog, outside click closes; `aria-live` month heading, full-date `aria-label` on cells, `aria-selected` / `aria-disabled` / `aria-current`. Script config via `data-datepicker-selected|view|today|min|max|disabled|unavailable|static`. Doc-note adds Anatomy (12 parts), Tokens with values, field / calendar state behavior, keyboard, accessibility, usage guidelines, and implementation notes. Needs verification: Dark `icon/error`; Figma Error Active composite overlaps the message.
- **Date Picker calendar day states (2026-11-02, later)** — re-synced with the updated Figma `.Base / Calendar / Day Cell` (`743:1955`): `State=Outside` is now `State=Unavailable` — `day/text/disabled` plus the `body/sm-slash` strike-through, no separate outside-month colour. Unavailable = out of the min/max range or in an adjacent month (`aria-disabled`, struck through, not selectable); Disabled = an individually blocked date (muted, no strike). Removed `--color-calendar-day-text-outside`; added `data-datepicker-min` / `data-datepicker-max`; the "Calendar open" example now mirrors the Figma composite with earliest date Jul 14 (Jun 28 … Jul 13 and Aug 1 struck through, Jul 28 Disabled); the day-state strip's last cell is labelled Unavailable. Playwright 80/80 in Light and Dark.
- **Search Field preview (2026-11-02, refined)** — Two-column `.tf-state-list` with four rows: Default · Filled · Error + message · Disabled. Clear control reuses Text Field `.fk-field__cancel`; native search cancel suppressed in CSS. Active / Focus Visible / Error + active remain live on interaction (not separate gallery rows).
- **Text Field preview (2026-11-02, simplified)** — Same two-column `.tf-state-list` as Search Field (`--space-16` / `--space-8`). Gallery rows: Default · Filled · Error + message · Disabled · Leading · Trailing · Required · No label · Helper with/without icon (lock glyph). Active · Focus Visible · Error Active are interaction-driven, not separate rows; keyboard ring via `:focus-visible` + `data-focus-modality` in `script.js`.
- **Foundation audit (2026-10-08)** — docs chrome typography mapped to the Figma type scale (heading xl/lg/sm, body lg/md/sm, caption); spacing and radius use `--space-*` / `--radius-card|control`; chrome borders use `--color-docs-border` (`border/elevated`); `--shadow-*` aliases `--elevation-*` in Light and Dark. Component example behaviour unchanged.
- **Light / Dark theme toggle** — `data-theme="light|dark"` on `<html>`, defaults to Light, persists in `localStorage`
- **Not current** — Textarea, Tabs, Tag/Chip, Multi-Select Dropdown, and Date Range Picker are listed as absent (not demoed as current)

## Source references

Content is derived from:

- Live Figma file **Fukurou Design System** (`FNLHeDQrr7JKBj81Qg7L7a`)
- `CURRENT_FIGMA_STATE.md`
- `README.md`
- `ACCESSIBILITY_AUDIT.md`

The **live Figma file** remains the source of truth. This site does **not** rebuild or modify Figma components. Update this site when the public component list or token architecture changes.

## GitHub Pages

This is a static site (`index.html`, `styles.css`, `script.js`). There is no Vite app and no `npm run build`.

| Item | Value |
|---|---|
| Source folder | `Fukurou/docs/` |
| Build command | None |
| Output folder | `Fukurou/docs/` (same files) |
| Local preview | `npx --yes serve Fukurou/docs -l 4175` |
| Workflow | `.github/workflows/deploy-docs.yml` |
| Pages source | **GitHub Actions** (Settings → Pages) |

Enable Pages once per repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**. Then push to `main` or run the workflow from the Actions tab.
