# RCB Website Preview

Working redesign concept for Rockford Consulting & Brokerage, Inc.

**Live preview:** https://rcbco-preview.taipan0319.chatgpt.site

The principal review question is whether the site communicates the outcomes RCB creates—not merely the diligence and effort it applies. See `docs/RCB-Website-Design-Handoff-v1.md` for the full strategy, factual boundaries, copy territories and 3D/motion brief.

This is a dependency-free, responsive one-page website concept for Rockford Consulting & Brokerage.

## Preview

Open `index.html` in a modern browser. For the most reliable local preview, serve this folder with any static web server.

Example:

```sh
python3 -m http.server 4173
```

Then visit `http://localhost:4173`.

## Contents

- `index.html` — page structure, content, metadata and structured business information
- `styles.css` — responsive visual design
- `script.js` — focused-energy canvas animation, motion controls, mobile navigation and reveal effects
- `assets/rcb-mark.svg` — cleaned RCB monogram
- `assets/signal-fallback.svg` — static hero fallback
- `robots.txt` and `sitemap.xml` — basic search-engine files

## Draft notes

- No client names are used.
- Unverified recovery amounts and Moody's attribution are intentionally excluded from public-facing claims.
- The hero honors reduced-motion preferences and supplies a static fallback.
- Before launch, replace draft review language as needed, confirm all historical claims, add an approved Open Graph image, and run Lighthouse tests in the production environment.
