# asynqpg-landing

Landing page for [asynqpg](https://github.com/yakser/asynqpg) – a distributed task queue for Go, backed by Postgres.

## Stack

- **Astro 5** with TypeScript (strict)
- Static output, deployable to GitHub Pages / Vercel / Netlify / Cloudflare Pages
- IBM Plex Sans + Mono via Google Fonts
- Design tokens with `oklch()` colors and a light/dark theme toggle (persisted to `localStorage`)

Why Astro: a static, content-heavy landing page benefits from Astro's zero-JS-by-default model. The whole page ships as a single HTML + CSS bundle plus a few small interactive scripts (theme toggle, code-block tabs, scroll-spy on the anchor nav).

## Develop

```sh
npm install
npm run dev      # http://127.0.0.1:4321/asynqpg/
npm run build    # outputs ./dist
npm run preview  # serve the production build locally
npm run check    # astro check (TS + .astro diagnostics)
```

## Deploy

The site is configured with `base: "/asynqpg"` for GitHub Pages under `username.github.io/asynqpg/`. To deploy elsewhere, edit `site` and `base` in `astro.config.mjs`.

## Layout

```
src/
├── layouts/Layout.astro       # <html>, head, theme pre-hydration script
├── pages/index.astro          # composition of all sections
├── components/
│   ├── Masthead.astro         # sticky header + GitHub CTA + theme toggle
│   ├── AnchorNav.astro        # sticky in-page nav with scroll-spy
│   ├── Hero.astro             # display headline, CTAs, badges, stats
│   ├── Features.astro         # 9-card capability grid
│   ├── Quickstart.astro       # 4-step list + tabbed code block w/ copy
│   ├── Architecture.astro     # ASCII lifecycle + packages table
│   ├── Dashboard.astro        # mock browser frame w/ status chips
│   ├── Observability.astro    # OpenTelemetry metrics table
│   ├── Footer.astro
│   ├── BrandMark.astro
│   ├── GitHubIcon.astro
│   ├── StarIcon.astro
│   └── ThemeToggle.astro
├── lib/
│   └── github.ts                 # build-time fetch of star count, latest release, license
└── styles/
    ├── tokens.css             # design tokens (colors, type, spacing)
    └── global.css             # all component styles
```
