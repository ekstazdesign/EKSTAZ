# Local dev and checks

EKSTAZ is a static HTML/CSS/JS site (no build step) plus one Vercel Function, `api/join.js`, that stores waitlist signups in Supabase. Locally, `serve.mjs` stands in for Vercel (static files + the real `api/join.js` + an in-process fake of the Supabase `join_waitlist` RPC), and the browser suites drive it in headless Chromium and save screenshots. All commands run from the repo root.

## Prerequisites

- Node 24, matching the deployed runtime. The site and `serve.mjs` need no application dependencies or build.
- Browser checks need Playwright and Chromium. `drive.mjs` looks for `$PLAYWRIGHT_MODULE`, then `playwright` on the normal Node path, then `/opt/node-tools/node_modules/playwright`. For the browser it uses `$CHROMIUM`, then `/opt/pw-browsers/chromium` if present, then Playwright's own download. Set the environment variables when using another installed location.
- On a fresh machine: `npm install --no-save --package-lock=false playwright` followed by `npx playwright install chromium`.

## Run the checks

Start the server in one terminal. Unsetting the Supabase variables ensures signup checks use the fake backend:

```bash
env -u SUPABASE_URL -u SUPABASE_ANON_KEY node dev/serve.mjs 8080
```

Run the suites in another terminal, then stop the server with Ctrl-C:

```bash
node dev/drive.mjs http://localhost:8080 /tmp/ekstaz-shots
node dev/artwork-checks.mjs http://localhost:8080 /tmp/ekstaz-artwork-shots
node dev/carrier-checks.mjs http://localhost:8080 /tmp/ekstaz-carrier-shots
node dev/journey-checks.mjs http://localhost:8080 /tmp/ekstaz-journey-shots
node dev/motion-checks.mjs http://localhost:8080 /tmp/ekstaz-motion-shots
```

All five suites accept `[baseUrl] [outDir]`. Never run `drive.mjs` against production or a hosted preview connected to the real waitlist: it submits signup forms. Carrier and journey checks intercept signup responses and require a local URL.

`motion-checks.mjs` measures visible particle brightness and spread in real composited screenshots, checks that chapter handovers stay clear of reading content, and covers arrival noise, waveform/ring movement, reduced motion, no-JS stage collapse and the moving work-page strip. It blocks and counts any signup attempt and requires a local URL.

`journey-checks.mjs` covers the guided homepage and its style requirements: ordered content sections, visible original-art checkpoints on mobile, native-anchor navigation, optional reflection and continuation, and the routes back from work and magazine. The journey is readable without JavaScript. Its canvas follows DOM section positions; sound begins off and reduced motion remains supported.

`drive.mjs` prints one `PASS`/`FAIL` line per check and exits 1 if anything failed. It covers:

- front door (`/`): the particle field draws, no sideways scroll at phone and desktop, signup opens the personal mark card, `/?n=7` previews a mark (screenshots `door-*.png`)
- work page (`/work.html`) at phone (390), small phone (360) and desktop (1440): no sideways scroll, every image loads, top-of-page and full-page screenshots
- gallery: tapping an artwork opens the full-size viewer, the close button closes it
- waitlist form: bad email rejected in the browser; a new email gets a number; the same email again says "already on the list"
- magazine reader: Next goes to page 2, `?page=17` deep link disables Next
- no uncaught JS errors or console errors

Screenshots land in the output dir (`/tmp/ekstaz-shots/`): `phone-top.png`, `phone-full.png`, `small-*`, `desktop-*`, `viewer-open.png`, `form-success.png`, `magazine-p17.png`. Open them; a green run with a broken-looking page is still a failure.

To poke the API without a browser:

```bash
curl -s -X POST localhost:8080/api/join -H 'content-type: application/json' -d '{"email":"curl@example.com"}'
# -> {"number":N,"existing":false}   (N = signups so far on this server run, +1)
curl -s -X POST localhost:8080/api/join -d '{"email":"nope"}'
# -> {"error":"That email doesn’t look right."}
```

To drive one-off things (a new section, a different width), copy the `open()` helper from `drive.mjs` rather than starting from scratch.

## Run it by hand

`env -u SUPABASE_URL -u SUPABASE_ANON_KEY node dev/serve.mjs 8080`, then open `http://localhost:8080` in a browser. Ctrl-C stops it.

## Test

The browser suites check site regressions, artwork journeys, carrier recovery and the guided homepage. Review their screenshots as well as their reported results. With the Supabase variables unset, the local fake numbers emails from 1 and forgets them when the server stops.

The restored animation passed all 299 local checks on 7 October 2026: 92 visible-motion checks plus the existing 207.

The previous guided journey release, PR #13, passed all 207 local checks on 7 October 2026: 20 site checks, 72 artwork checks, 33 carrier checks and 82 journey checks.

The previous artwork release, PR #12, passed 125 local checks and 19 live browser checks on 7 October 2026. Those historical counts precede the guided homepage journey; see [verification notes](../docs/verification.md) for that release’s coverage and limitations.

## Gotchas

- **Unset Supabase variables for local checks.** `serve.mjs` only starts the fake when `SUPABASE_URL` is unset. If you export `SUPABASE_URL`/`SUPABASE_ANON_KEY`, test signups use that configured backend and can take real numbers.
- **The fake server remembers emails until restart.** `drive.mjs` uses `smoke-<timestamp>@example.com` so reruns don't hit "already on the list". Use the same trick in any new check.
- **Google Fonts may not load** in a locked-down container; the page falls back to system serif/mono and still passes. `drive.mjs` ignores font-request errors for that reason. Compare fonts against the live site, not a local screenshot.
- **The viewer `<img>` has no `src` until opened.** Image-load checks must skip `<img>` without a `src` attribute, or they report a false failure.
- **Stop the foreground server with Ctrl-C.** If it was started separately in the background, identify its listening process before stopping it. Avoid broad `pkill -f`.
- **`drive.mjs` args are `[baseUrl] [outDir]`, in that order.** Passing only a path makes Playwright try to navigate to it and crash with "Cannot navigate to invalid URL".

## Troubleshooting

- **`curl` to `localhost:8080` prints `000` or nothing**: the server isn't up (or was stopped). Check the server terminal's output and restart it.
- **`page.goto: Cannot navigate to invalid URL`**: wrong argument order to `drive.mjs` (see Gotchas).
