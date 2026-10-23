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

## Notifications (nudges + milestones)
- **Nudges** come from `netlify/functions/eos-nudges.mts`, which runs every 5 minutes on the
  live site. It asks the database what's due (`eos_take_due_nudges()`, in
  `supabase/eos_002_notifications.sql`) and pushes to the phones that switched them on:
  - prediction: 2 hours before kick-off, if no call has been entered (needs a kick-off time);
  - after the whistle: 24 hours after a game marked Going or Was there, if nothing is written.
  Each nudge only ever goes once. The server works from what the Roost sync last sent.
- **Milestones** are worked out in the app (`seasonMilestones`). A new one shows a toast and,
  if allowed, a copy in the notification centre. Never rename a milestone key.
- Netlify variables:
  - both sites: `EOS_VAPID_PUBLIC_KEY` (public; the app uses it to subscribe);
  - live site only: `EOS_VAPID_PRIVATE_KEY` and `SUPABASE_SERVICE_ROLE_KEY` (both secret).
    Without these the scheduled job does nothing, which keeps the test site quiet.

## Releasing
1. Work lands on `develop` → the test site (eos-test) rebuilds.
2. Check it on the phone, then merge `develop` into `main` → the live site rebuilds.
3. Installed phones pick up a release on the next launch or two (the service worker
   serves the cached copy first, then refreshes it).

## Baseline check
The v2.4 rebuild was compared against the deployed v2.4 `app.js` in a headless browser:
every tab in every season (30 screens) renders identical text, with no errors.
