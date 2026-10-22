# Every Other Saturday (EOS)

Dom's Chelsea matchday log. A single-page React app, bundled with esbuild into one
`app.js`, served as a static site on Netlify and installed to the iPhone Home Screen.

## Layout
- `src/MatchdayLog.tsx` — the whole app
- `src/main.jsx` — mounts the app and registers the offline service worker
- `public/` — copied into the site unchanged: `index.html`, `sw.js`, manifest, icons
- `build.mjs` — `npm run build` writes the site to `dist/`

## Branches
- `main` — what the live site runs. Starts as an exact rebuild of the deployed v2.4.
- `develop` — work in progress; the test site deploys from here.

## Data safety — read before changing anything
- Everything is stored **on the phone**, under the site's address:
  localStorage key `cfc:matchday:v2`, and IndexedDB `same-again-photos` for photos.
- Never rename that key or the database, and never move the live site to a new address.
  Either would make existing data invisible to the app.
- Export a backup (Settings → Export) before each release.
- Netlify keeps every deploy, so rolling back is one click in the Deploys tab.

## Baseline check
The v2.4 rebuild was compared against the deployed v2.4 `app.js` in a headless browser:
every tab in every season (30 screens) renders identical text, with no errors.
