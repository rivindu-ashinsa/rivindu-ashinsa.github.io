# Rivindu Ashinsa — Atlas

Professional portfolio as a **file-based studio desk**: each channel is its own folder, and every card is driven from JSON. GitHub Pages serves it as a static site.

Live: [rivindu-ashinsa.github.io](https://rivindu-ashinsa.github.io/)

## Architecture

```
data/                 content (edit here)
  site.json           identity, nav, socials
  updates.json        latest updates
  linkedin.json       public notes
  apps.json           shipped apps
  suggested.json      recommended tools
  learning.json       deep-learning journal
  projects.json       case files
  studio.json         profile, education, stack
  credentials.json    certificates & achievements

css/                  design tokens → layout → components → pages
js/
  app.js              boot
  core/               paths, data loader, chrome, images, SEO schema
  modules/            theme, nav, command palette
  pages/              one renderer per channel

updates/  linkedin/  apps/  suggested/  learning/
work/     studio/    credentials/  contact/
```

The homepage (`index.html`) is the desk: latest updates first, then LinkedIn, apps, suggested tools, and the learning log. Dedicated pages hold the full archive.

## Features

- Command palette: `Ctrl+K` / `Cmd+K`
- Light / dark theme (saved locally)
- Project and toolbox filters
- Image lightbox on Cognivus system shots
- Contact form (Formspree)
- Image SEO: width/height, descriptive alt, lazy-loading, ImageObject JSON-LD, image sitemap
- PWA manifest and custom 404

## Local preview

Serve the folder over HTTP (ES modules and `fetch` of JSON will not run from `file://`):

```bash
python -m http.server 8000
```

Open http://localhost:8000

## Editing content

Change the matching file in `data/`. Examples:

- New update → `data/updates.json`
- New LinkedIn note → `data/linkedin.json` (replace `href` with the real post URL when you have one)
- New app → `data/apps.json`
- Learning entry → `data/learning.json`

Then refresh. After adding images, regenerate the sitemap:

```bash
python scripts/_gen_sitemap.py
```

## License

MIT License — Copyright (c) Rivindu Ashinsa
