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

## Features

- **Foundation / Color** — full live Figma palette docs: brand anchors, Primary/Secondary/Neutral/Amber/Red/Green/Blue ramps with token names + hex + swatches, status mapping, and usage guidance
- **Foundation / Typography** — Lora + Poppins families, all 18 text styles with size/weight/line-height/tracking, specimens, usage + accessibility guidance
- **Figma-matched previews** — sizes, radius, type, and colors aligned to live Figma components / Theme tokens
- **Interactive examples** — real controls for Button, Text Field, Search (clear), Checkbox, Radio, Switch, Dropdown, Date Picker, Jumbo Select, Pagination, Snackbar, Alert, Modal, Tooltip, Progress Bar
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
