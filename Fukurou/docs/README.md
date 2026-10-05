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
- **Foundation / Typography** — Lora + Poppins families, all 18 text styles with size/weight/line-height/tracking, specimens, usage + accessibility guidance
- **Figma-matched previews** — sizes, radius, type, and colors aligned to live Figma components / Theme tokens
- **Interactive examples** — real controls for Button, Text Field, Search (clear), Checkbox, Radio, Switch, Dropdown, Date Picker, Jumbo Select, Pagination, Snackbar, Alert, Modal, Tooltip, Progress Bar
- **Date Picker popover** — calendar dropdown is anchored to the trigger and sits about `2px` below it in Light and Dark (2026-10-05)
- **Date Picker calendar states** — reconciled with Figma `.Base / Calendar / Day Cell` + `Calendar Popover` (2026-10-05): 36px circular day cells, circular Hover/Selected fills, 2px Today outline, 2px focus outline, `color/calendar/*` values as CSS variables for Light and Dark. Demo dates fixed to the Figma example (Today Jul 26 · Disabled Jul 28 · Unavailable Jun 30).
- **Button states** — reconciled with the Figma `Button` set (2026-10-05): Action/Secondary/Ghost Default · Hover · Pressed · Focus · Disabled use `color/button/*` values resolved for Light and Dark; Ghost is transparent with a 2px stroke; Disabled is 60% opacity; keyboard focus (`:focus-visible`) shows the 2px gap + 2px ring outside the pill; static Focus and icon examples included
- **Text Button + Icon Button states** — reconciled with the Figma `Text Button` and `Icon Button` sets (2026-10-05): Text Button is text-only with underline on hover, `color/text-button/content/*` Light/Dark values, plain 2px outside focus stroke, 60% disabled, S/M/L sizes; Icon Button uses `color/icon-button/*` (tertiary content, subtle hover fill, solid pressed fill with inverse content), offset focus ring, 60% disabled, `aria-label` on every example
- **Notification Button** — reconciled with the Figma `Notification Button` set (2026-10-05): 20px filled bell on the Icon Button body, 8px dot at the body's top-right and a 16px count pill (Poppins Regular 12/16, 6px padding, 99+) at top −2, both with a 2px outside page-coloured stroke via `box-shadow` so layout never shifts; `--color-notif-*` variables for Light and Dark; None · Dot · Count · 99+ · Focus · Disabled examples with count-bearing `aria-label`s; Disabled keeps full opacity per Figma
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
