# Website verification

## Animation restoration — 7 October 2026

All **299 local checks passed**: 20 site, 72 artwork, 33 carrier, 82 journey and
92 visible-motion checks. The restored particle field is measured in composited
screenshots, so hidden or dimmed effects cannot pass through raw canvas data alone.

The motion suite covers all six shapes at 390×844 and 1440×1000, arrival noise
resolving into the wordmark, silent waveform/ring movement, bright stage pixels,
separation from the header and reading content, and all ten chapter handovers.
It also checks smooth native chapter scrolling, reduced motion, no-JS stage collapse
and the restored work ticker. Visual space is reserved before the initial native
fragment scroll so direct artwork links remain accurate as the particle assets load.

The same particles morph inside the incoming visual stage. Browser Back/Forward
uses immediate native reading-position restoration; ordinary chapter links retain
smooth scrolling. The no-JS gallery check observes the native hash scroll before
measuring reachability. Original identity/art assets remain unchanged.

Screenshots: `/tmp/ekstaz-restored-motion-ship`,
`/tmp/ekstaz-restored-journey-ship`, `/tmp/ekstaz-restored-artwork-final`,
`/tmp/ekstaz-restored-carrier` and `/tmp/ekstaz-restored-smoke`.
Motion checks made **zero signup attempts**; all other signup checks used the
local fake backend or intercepted responses. Real-device Safari remains untested.

## Previous guided journey — PR #13, 7 October 2026

Verified locally with Node v24.19.0 and Chromium 151.0.7922.173.

| Suite | Passing checks |
| --- | ---: |
| `dev/drive.mjs` | 20 |
| `dev/artwork-checks.mjs` | 72 |
| `dev/carrier-checks.mjs` | 33 |
| `dev/journey-checks.mjs` | 82 |
| **Total** | **207** |

All suites passed against the local fake backend. Carrier and journey suites intercept
signup responses. No production waitlist numbers were consumed.

The new journey checks cover native section anchors, readable headings and orientation,
keyboard focus, original-art checkpoints, browser Back/Forward, direct artwork links,
optional release updates, and the work/magazine routes back into reflection and expression.
Reflection has no answer input or response collection; browsing never submits a signup.

Layouts and original images were reviewed at 360, 390, 768 and 1440 pixels. The suite
also checks 200% text enlargement and a short landscape viewport at 844×390. Artwork
checkpoint links advance after reaching an image, including when the full figure cannot
fit inside a short viewport. The hidden skip link stays out of view until focused.
Reduced motion freezes the field, while native anchors and original images remain
usable with JavaScript disabled. Signup is disabled until its JavaScript handler loads.

JavaScript syntax checks and `git diff --check` passed. Original identity and artwork
assets are unchanged. Fresh screenshots are in `/tmp/ekstaz-final-journey-shots`,
`/tmp/ekstaz-final-artwork-shots`, `/tmp/ekstaz-final-carrier-shots` and
`/tmp/ekstaz-final-smoke-shots` in the verification workspace.

Verification uses headless Chromium. Real-device Safari and operating-system share
sheets remain untested; native sharing branches use browser API stubs. These checks
establish functional navigation and layout, not a guaranteed emotional response.

## Previous artwork release — PR #12

Verified locally on 7 October 2026 with Node v24.19.0 and Chromium 151.0.7922.173.

`dev/artwork-checks.mjs`: **72/72 checks passed**. This suite does not submit waitlist forms.

The existing `dev/drive.mjs` regression suite also passed all 20 checks, using the
local fake waitlist service. `dev/carrier-checks.mjs` passed all 33 checks with
intercepted signup responses. Total: **125 passing checks**, without production signups.

All 66 original binary assets matched the repository’s Git blob hashes. JavaScript
syntax checks and `git diff --check` passed.

Run a local server in one terminal:

```sh
env -u SUPABASE_URL -u SUPABASE_ANON_KEY node dev/serve.mjs 8080
```

Run the artwork checks in another:

```sh
PLAYWRIGHT_MODULE=/opt/codex/runtimes/cua/lib/node_modules/playwright CHROMIUM=/usr/bin/chromium node dev/artwork-checks.mjs http://localhost:8080 /tmp/ekstaz-artwork-shots
```

The script also accepts locally installed Playwright and its Chromium browser when those environment variables are omitted. Both URL and screenshot directory are optional.

The passing journeys cover:

- Opening artwork without reloading, direct artwork links, and invalid addresses.
- Browser Back/Forward, URL preservation, gallery focus and scroll restoration, Escape, and repeated close activation.
- Previous/Next buttons, arrow keys, fit/detail controls, and keyboard use while viewing details.
- Cross ↔ garment-study links and the Cross motif’s link to its existing magazine page.
- Native sharing, cancelled sharing, clipboard copying, and selectable-link fallback when copying is denied.
- Failed-image guidance and recovery by opening the next piece.
- Phone, tablet and desktop layouts at 360, 390, 768 and 1440 pixels, with square and portrait artworks and reachable controls.
- Still ambient rendering while artwork is open, and reduced-motion rendering after closing.
- Sound remaining off until explicitly enabled, persistence into the magazine, and mute persistence on return.
- Unique element IDs, correct Sound navigation, and usable original-art links with JavaScript disabled.
- No uncaught JavaScript errors throughout the journeys.

Screenshots were reviewed at phone, tablet and desktop sizes. The gallery heading is visible below the header; original artwork and controls fit their viewports; Cross’s garment and archive connections are clear. Detail mode shows a scrollable crop with a way to return to the whole image.

Useful captures in the screenshot directory:

- `phone-pain.png`, `desktop-pain.png`: focused artwork.
- `phone-cross.png`, `desktop-cross.png`: drawing, garment-study connection and archive motif.
- `phone-pain-detail.png`: enlarged detail view.
- `small-phone-gallery.png`: gallery anchor landing below the header.
- `tablet-pain.png`: tablet portrait layout.

Verification used headless Chromium. Real-device Safari and native operating-system share sheets were not tested; sharing branches were exercised with browser API stubs.
