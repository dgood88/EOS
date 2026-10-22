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

## Roost sync (Going / Want to go → The Roost calendar)
- `src/sync.js` pushes upcoming fixtures to Supabase (project "The Goodacres") after
  each change, on open, and when the app comes back online. Additive only: EOS never
  reads anything back, and a failed push is retried quietly.
- Turn it on per phone in **Settings → The Roost** (same login + 6-digit code as The Roost).
- Needs two Netlify environment variables (public values, copy them from The Roost's
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY`):
  `EOS_SUPABASE_URL` and `EOS_SUPABASE_ANON_KEY`. Without them the panel just doesn't show.
- Database: run `supabase/eos_001_fixture_sync.sql` once in the Supabase SQL editor.
  The Roost reads with `select * from eos_partner_fixtures()` — Going and Want to go only,
  for you and your Roost partner.

## Releasing
1. Work lands on `develop` → the test site (eos-test) rebuilds.
2. Check it on the phone, then merge `develop` into `main` → the live site rebuilds.
3. Installed phones pick up a release on the next launch or two (the service worker
   serves the cached copy first, then refreshes it).

## Baseline check
The v2.4 rebuild was compared against the deployed v2.4 `app.js` in a headless browser:
every tab in every season (30 screens) renders identical text, with no errors.
