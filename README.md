# Fukurou Design System

Local workspace for the **Fukurou Design System** Figma library notes, tokens, and HTML documentation site.

- **Source of truth:** the live Figma file [Fukurou Design System](https://www.figma.com/design/FNLHeDQrr7JKBj81Qg7L7a/Fukurou-Design-System)
- **Docs source:** [`Fukurou/docs/`](./Fukurou/docs/)
- **Project notes:** [`Fukurou/README.md`](./Fukurou/README.md)
- **Live docs URL:** [https://aka-fukurou.github.io/fukurou-design-system-docs/](https://aka-fukurou.github.io/fukurou-design-system-docs/)

The local server at `http://localhost:4175` is optional. The published GitHub Pages site stays available without it.

## Run locally

No install or build step. The site is static HTML, CSS, and JS.

```bash
npx --yes serve Fukurou/docs -l 4175
```

Then open `http://localhost:4175`.

You can also open `Fukurou/docs/index.html` directly in a browser.

## Deploy to GitHub Pages

The site is published from `Fukurou/docs` by [`.github/workflows/deploy-docs.yml`](./.github/workflows/deploy-docs.yml).

1. Push to `main` (or run the workflow manually from the **Actions** tab).
2. Confirm GitHub Pages is set to **GitHub Actions**:
   - Repo **Settings → Pages**
   - **Build and deployment → Source:** GitHub Actions
3. Open the Pages URL after the workflow finishes.

Expected URL:

`https://aka-fukurou.github.io/fukurou-design-system-docs/`
