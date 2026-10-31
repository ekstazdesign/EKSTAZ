# EKSTAZ

EKSTAZ by Elton and Haris. This repository is the single home of the EKSTAZ website: Haris's ekstaz.art site (the journey, the work viewer, the magazine reader, the collection and signup) combined with Elton's pages from his own build (About, Whips, the playlists, the extra print files and drawings, and the sale-free Edition 01 notice).

> The site's address is changing: ekstaz.art is offline. Links and canonical tags below still say ekstaz.art until the new domain is set.

## Previous README (ekstaz.art)

EKSTAZ is a state of recognition made tangible: one creative world in garments, image, design and sound. The website is another way to encounter that work and carry its signal.

**Live:** [ekstaz.art](https://ekstaz.art/) · [The work](https://ekstaz.art/work.html) · [Cross](https://ekstaz.art/work.html?art=cross)

Static HTML, CSS and JavaScript, with no frontend build step. A Vercel Function handles waitlist signups through Supabase.

## The experience

- **Front door:** a guided journey moves from the introduction (`#begin`) to Pain’s original image (`#encounter`), a quiet reflection (`#reflection`), Cross and its hoodie study (`#form`), optional ways to continue (`#expression`), and release updates (`#carry`). Each chapter opens with a dedicated visual stage above its reading content, so the moving signal and the readable journey both have space. Original artwork remains visible at the encounter and form checkpoints.
- **Living signal:** the full-strength particle field resolves from noise into the wordmark, then changes through Pain’s image, a moving waveform, the stitched E, scattered rings and a star mark as visitors scroll. The visual states remain part of the encounter, with clear text and next steps below them.
- **Reflection and expression:** the reflection is an optional question, with no response input or collection. Visitors can look at the work, carry a mark, listen or read without declaring a feeling or joining the list. Recognition and acceptance are never signup conditions, and the journey leaves each work’s interpretation open.
- **Orientation:** sticky progress links point to the actual content sections, including the artwork checkpoints. The canvas follows those sections rather than assuming a fixed viewport height. Native anchors and readable images preserve the journey without JavaScript.
- **The work:** the outlined moving transmission strip, ambient particles, artwork arrival and section reveals carry the atmosphere into browsing. Original artworks open in a still, full-screen viewer with fit/detail zoom, Previous/Next controls, keyboard navigation, shareable addresses, and browser Back/Forward with focus and scroll restoration. Without JavaScript, gallery links open the original image files.
- **Connections:** Cross links to the hoodie study, whose notes call for an embroidered red cross, and to its ornate motif in magazine page 12. Before thee links to an earlier figure study on page 10. These are documented source relationships, not claims of finished garments.
- **The archive:** the December 2021 magazine remains a dated, 17-page reader with page links, zoom and its original PDF.
- **Carry:** optional release-update signup returns an arrival number and a generated mark that can be saved or shared. A successful signup remembers only the number on that browser; “Your signal” reopens it. Public `?n=` previews do not overwrite that stored number or authenticate registration. A number records arrival; it does not guarantee a garment or a particular experience.
- **Sound and motion:** sound starts off and is enabled deliberately; its preference carries between pages. Navigation fades through ink. Ambient rendering pauses while artwork or the mark card is open, and reduced motion freezes the fields and removes animated transitions.

Useful direct links:

| Address | Opens |
| --- | --- |
| `/#reflection` | The quiet, optional reflection after encountering Pain |
| `/#expression` | Choices to look, carry, listen or read |
| `/work.html?art=cross` | Cross, with garment-study and archive connections |
| `/work.html?art=pain` | Pain’s original image |
| `/work.html?art=hoodie-study` | The garment drawing |
| `/magazine.html?page=12` | Magazine page 12 |
| `/?n=7` | Mark №007 without signing up |

`/signal.html` redirects to the front door at `/`. Artwork sharing uses the native share sheet where supported, then clipboard copying or a selectable link. Mark cards provide image saving, supported native file sharing and a copyable return link.

## For agents and new sessions

[CLAUDE.md](CLAUDE.md) is the rulebook (Codex reads [AGENTS.md](AGENTS.md), which points to it). [docs/STATUS.md](docs/STATUS.md) is the map and the list of open decisions, and [docs/HANDOVER.md](docs/HANDOVER.md) records what each change shipped. Subagents, skills and named workflows live in `.claude/`; start a session with `/resume-ekstaz`.

## Source files

| Files | Purpose |
| --- | --- |
| `index.html`, `signal.css`, `signal.js`, `journey.js` | Guided front door, section progress, particle states, signup and numbered marks |
| `work.html`, `styles.css`, `artwork.css`, `viewer.js` | Gallery, focused artwork viewer, garment, print, sound and waitlist |
| `drone.js` | Shared ambient drone, remembered sound preference and navigation fade |
| `ambient.js` | Inner-page particles, section reveals and rendering pause/reduced motion |
| `join.js` | Work-page signup and browser-local carrier return link |
| `api/join.js` | Vercel signup function; Supabase `waitlist` table and `join_waitlist` RPC |
| `magazine.html`, `magazine.css`, `magazine.js` | Dated archive reader |
| `assets/publications/` | Original PDF and responsive WebP page renders |
| `assets/art/` | Original artwork and `-sm` thumbnails |
| `assets/` | Approved wordmark, E, icons, grain and share image |
| `dev/` | Local server and browser checks |

## Brand and source guidance

[BRAND.md](BRAND.md) is the locked October 2026 brand core. [Site direction](docs/SITE-DIRECTION.md) records the treatment of artwork, identity marks, motion and carrier numbers. [Asset sources](docs/ASSET-SOURCES.md) records the verified connections and supplied Drive material.

Keep the original artwork and identity assets intact. Show new relationships, studio material or recordings only when their source establishes the context. The generated carrier marks are website experiments, not replacement identity marks.

## Run locally

Use Node 24, matching the deployed runtime. The static site and local server need no application dependencies or build step. Browser checks require Playwright and Chromium; use an existing installation or install them locally:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
```

Start the server from the repository root:

```sh
env -u SUPABASE_URL -u SUPABASE_ANON_KEY node dev/serve.mjs 8080
```

Open `http://localhost:8080`. Unsetting those variables ensures the server uses its in-memory fake Supabase service; signup numbers reset when the server stops. If `SUPABASE_URL` is set, the server uses that configured backend instead.

## Checks and verification

With the local server running, use another terminal:

```sh
node dev/drive.mjs http://localhost:8080 /tmp/ekstaz-site-shots
node dev/artwork-checks.mjs http://localhost:8080 /tmp/ekstaz-artwork-shots
node dev/carrier-checks.mjs http://localhost:8080 /tmp/ekstaz-carrier-shots
node dev/journey-checks.mjs http://localhost:8080 /tmp/ekstaz-journey-shots
node dev/motion-checks.mjs http://localhost:8080 /tmp/ekstaz-motion-shots
```

All five accept `[baseUrl] [outDir]`, report failures through their exit code and save screenshots. Journey checks cover the guided homepage. Motion checks measure real composited screenshots as well as canvas pixels, including brightness, stage size and reading-space protection during morphs. Set `PLAYWRIGHT_MODULE` and `CHROMIUM` if using an installation outside the normal lookup paths. See [local development instructions](dev/README.md) for setup details.

The original `drive.mjs` submits signup forms: run it against the local fake backend. Carrier and journey checks intercept signup responses; motion checks block and count any signup attempt. Those three suites require a local URL. Production and hosted previews use the real waitlist.

**Animation restoration verified 7 October 2026:** all 299 local checks passed — the existing 207 checks plus 92 visible-motion checks. All six particle states are visible in composited phone and desktop screenshots, handovers stay clear of reading content, waveform/rings animate silently, reduced motion freezes the shapes, and the work-page strip moves again. See [Figma component sources](docs/FIGMA-UI-SOURCES.md) for the interface references.

**Previous guided journey release, PR #13, verified 7 October 2026:** all 207 local checks passed — 20 existing site checks, 72 artwork checks, 33 carrier checks and 82 journey checks. The new coverage includes original-art checkpoints, optional reflection and signup, native anchors, keyboard focus, Back/Forward, 200% text enlargement, landscape layouts and a readable JavaScript-disabled journey.

**Previous artwork release, PR #12, verified 7 October 2026:** all 125 local checks passed — 20 existing site checks, 72 artwork checks and 33 carrier checks — followed by 19 live browser checks. These counts describe that release, before the guided homepage journey. Phone, tablet and desktop layouts were reviewed in Chromium at 360, 390, 768 and 1440 pixels. All 66 original binary assets matched their Git blob hashes. No production signup attempts were made during verification.

Coverage includes artwork links, browsing, detail zoom, Back/Forward and focus restoration, image-load recovery, sharing fallbacks, carrier recovery, sound preferences, reduced motion and JavaScript-disabled gallery links. Real-device Safari and operating-system share sheets remain untested; native sharing branches were checked with browser API stubs. See [verification notes](docs/verification.md).

## Deployment

The existing Vercel project is `ekstaz` in the `Harr-Elty` team, connected to this repository. `main` deploys production at `ekstaz.art`; feature branches create previews. The artwork release shipped in [PR #12](https://github.com/Happy-Harris/EKSTAZ/pull/12).

Use the **Other** framework preset, with no frontend build or output-directory settings. The signup function needs these environment variables in Production and Preview:

- `SUPABASE_URL` — Supabase project URL.
- `SUPABASE_ANON_KEY` — Supabase anon/publishable key.

Without them, static pages still work and signup reports that the list is not open. Preview signups take real waitlist numbers when connected to the existing Supabase backend; use `/?n=` to inspect a mark without signing up.

## Remaining material

Drop 001 still needs confirmed pieces, run size, price, date and garment photographs. An identified original EKSTAZ production track can replace or accompany the ambient drone when supplied. Additional Drive photographs and proposals need reliable context before being presented as public work.
