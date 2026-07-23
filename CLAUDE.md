# RCB Website (www.rcbco.com)

Static site for Rockford Consulting & Brokerage, deployed to GitHub Pages via
`.github/workflows/pages.yml` on every push to `main`.

## Layout

- `/` (root) — live site. Opens with the dark health hero ("What if your health plan
  actually made people healthier?" + breathing/heartbeat animation); the split-flap
  letter board lives at section 03 ("The RCB difference") with the challenge headline.
- `/classic/` — archived earlier design (threads animation), noindexed, keep for comparison
- `/v2/` — redirect stub to `/` (old preview link), do not delete
- `public/preview.html` + `public/styles.css`/`script.js` — mirror of the root site;
  keep in sync after root changes, but `public/preview.html` keeps its noindex meta tag
- `app/`, `next.config.mjs`, `package.json`, etc. — unused Next.js scaffolding; leave alone

## Copy style — owner preferences (always apply)

- **Oxford comma, always** ("excellence, ethics, and education")
- **No em dashes (—) anywhere in site copy.** Rewrite with periods, commas, or colons.
- No AI-telltale vocabulary (delve, seamless, robust, landscape, leverage).
- Serif is Newsreader (via Google Fonts, `--serif` CSS variable); body is Inter;
  letter board uses IBM Plex Mono.
- Logo renders at 74px in the header (62px mobile), 84px in the footer. Keep it prominent.
- The founder section is a present-tense tribute, NOT a memorial. Do not add death
  dates or "in memoriam" framing.

## Deployment

- **At DNS cutover:** switch the two og:image/twitter:image URLs in index.html
  from taipan0319-byte.github.io/RCB-website-preview/... to https://www.rcbco.com/assets/og-card.png.

- Custom domain www.rcbco.com is configured in Pages settings; `CNAME` file in repo.
- Email for rcbco.com is Microsoft 365 and rides on GoDaddy DNS records (MX/SPF).
  Nothing in this repo affects it; never advise editing those records except per the
  IT cutover instructions.
- Keep `noindex` on `/classic/` and `public/preview.html`; the root site is indexable.
