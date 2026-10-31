# EKSTAZ — where the project stands

**This file is the map.** A new agent or person reads it after `CLAUDE.md`, then the top few entries of `docs/HANDOVER.md`. Keep the tables current in the same PR that changes a status.

_Last updated: 2026-10-09: collection access and marketing execution pack are prepared on `codex/collection-and-launch-20261009`; not merged. Browser verification blocked by missing Chromium. Existing production state below is unchanged._

## Prepared for review

- Product-first homepage and four-route navigation, plus hoodie/tee/cap concept collection with direct links.
- Campaign briefs, captions, creator research/outreach drafts, economics and HubSpot task drafts: `docs/marketing/START-HERE.md`.
- Static source/route checks passed; browser suites cannot launch in this environment. No outreach, CRM writes or ad spend. No confirmed checkout offer.
- Separate phone preview keeps signups on the existing main site. See latest HANDOVER entry for limitations.

## 1. What is live on ekstaz.art

| Area | State | Notes |
|---|---|---|
| Front door (`/`) | Live | Six chapters: Enter, Encounter (Pain), Reflection, Form (Cross + hoodie study), Expression, Stay close. Particle field forms Elton's custom EKSTAZ letters, Pain, a waveform, the stitched cross emblem, scattered rings, Elton's star. One diagonal letter band between Enter and Encounter. Sticky journey bar. |
| The work (`/work.html`) | Live (room `#before` in PR #26) | Gallery of 14 pieces plus the hoodie study, full-screen viewer with shareable `?art=` addresses, garment, print, sound and signup sections. Letters land one by one above the title. |
| Artwork texts (`readings.js`) | Live | All pieces now carry Elton's own amended texts (Haris, 2026-10-08); the AI readings and the AI note are removed, and the site mentions AI nowhere. Crown keeps its earlier text until Elton writes one (Haris). Gallery titles stay as they are (Haris, 2026-10-08); his headings are not used as titles. |
| Magazine (`/magazine.html`) | Live | December 2021 archive, 17 pages, PDF link. |
| Header | Live | One header on every page: Work, Print, Listen, Updates, sound toggle. |
| Sound | Live | On by default (starts at first touch), mute remembered in `localStorage['ekstaz-sound']`. |
| Waitlist | Live | `POST /api/join` → Supabase RPC `join_waitlist`. Returns an arrival number and a generated mark. Not tested end to end since the redesign beyond the fake server. |
| Shop | **Not built** | Planned. The funnel has a "Funnel CTA" component with an "Email now" and a "Shop later" version in Figma; the site shows email only. |

Figma board: [EKSTAZ — Journey & Motion](https://www.figma.com/design/qJF8MBiUSYMJDpRdnZOQQL) (storyboard of the six chapters, the funnel, and the brand-core check). Codex's UI reference board is linked from `docs/FIGMA-UI-SOURCES.md`.

## 2. Checks

Art-readings branch (PR #24, merged): drive 21/21, journey 82/82, motion 92/92, artwork 72/72, carrier 33/33 (**300/300**). Focused viewer QA **206/206**: all 15 phone deep links at 390×844 plus two desktop cases; exact text/title/image/disclosure, complete readings reachable by scrolling, Next and Close. Phone and desktop screenshots inspected.

Clean `origin/main` at `2d652360`: **298/299**, with only the known artwork `JavaScript disabled: completes` timeout (70/71 artwork). No repository tests were changed, and the current branch's passing run does not establish a fix for that baseline failure. Not covered: real-phone audio, touch and scroll feel; the live waitlist against the real database; Safari; the Vercel preview or production deployment of this branch.

The research report distinguishes directly checked local images/archive text from recovered external literature. Fresh external source retrieval was blocked by proxy CONNECT 403; it does not claim a new full-text review.

## 3. Needs a human decision (do not decide these yourself)

| # | Decision | Owner | Context |
|---|---|---|---|
| D1 | ~~Page length~~ **Decided (Haris, 2026-10-07): keep the stages, trim around them.** Now about 6,250 px desktop and 6,690 px phone (was 7,200 and 7,770). Further cuts mean cutting copy. | Haris | |
| D2 | Title for the 落下 drawing ("Falling" is a working title). **Ares decided** (Haris, 2026-10-07): the helmeted bust is "Ares" (slug stays `feel-it` so shared links keep working). | Elton | `assets/art/falling.jpg` |
| D3 | The hero source of `pain.jpg`: a review measured 487 px; the file is 1,200 px. Which page showed 487? | Haris | May be a different small copy being served. |
| D4 | Instagram handle `@ekstaz.ae` has a UAE suffix while the plan is to sell outside the UAE. | Haris | Link in the footer of `index.html`. |
| D5 | Does the 2021 magazine stay linked from the home page? It names public figures (pp. 13 to 14) and sits one click from the front door. | Haris and Elton | The Cross link lands on page 12. |
| D6 | "carrier": is it an intended word? It labels the saved mark. | Elton | Audit finding. |
| D7 | Privacy and data-use wording near the email form, and real removal terms. | Haris (and a lawyer) | |
| D8 | Drop 001 details: pieces, run size, price, date. Nothing may be stated until confirmed. | Elton and Haris | The signup copy currently says "release updates, including Drop 001". |
| D9 | Business set-up for selling outside the UAE: entity, payments, shipping, regulator risk, third-party marks. | Haris | See `launch-planner` and the `ekstaz-launch-research` workflow. **2026-10-08: first-sale path in `docs/FIRST-SALE.md`.** |
| D10 | Whips (cars) page, Music player or track. Garment photos now exist (six T-shirt photos in the archive): confirm what the shirt is before showing it. | Elton | "Whips stays in the closet for now" (Haris). |
| D11 | Still pending from Elton: the name of his custom typeface and the source file of the diagonal EKSTAZ pattern. The big upload arrived: see `docs/ASSET-CATALOG.md`. | Elton | |
| D12 | ~~Drive zip sharing~~ **Done**: set back to Restricted (Haris, 2026-10-07). | Elton | |
| D14 | ~~The Legend plan vs the site's rules~~ **Decided (Haris, 2026-10-07):** ignore all Dubai/UAE positioning in the Legend; it was Elton weighing in before catching up on the reforms. "Elty" is Elton's pet name. No UAE commerce (no capital for a trade licence); workaround options for selling abroad are in `docs/LAUNCH-OPTIONS.md` (D9). | Haris | |
| D15 | **Decided (Haris, 2026-10-07):** the December 2019 exhibition documents a reform and resurrection of EKSTAZ; Elton loves all four concepts. Built: ash-to-letters arrival (front door), the room beneath (work page `#before`, ash to colour), Elton's Guilty line at both signups, the wax hands closing the room. Suicide-themed texts stay off the site. | Haris and Elton | `docs/ASSET-SOURCES.md` |
| D13 | **Decided (Haris, 2026-10-07):** glitch series used (Pain at the encounter, the work page title); T-shirt shown as an archive draft; Elty portrait left out for now; the two lookbook PDFs are not EKSTAZ material (a cigarette-packaging study and a UFC PR campaign) and stay out. | Haris | |

## 4. Next likely work (in order)

0. **Haris and Elton read the 15 readings** on the live viewer and flag any that miss; then decide D14 (the Legend plan vs the no-Dubai rule) before any Edition 01 copy is written.
1. Haris checks the live site on a phone (sound, scroll, bottom bar) and reports what feels off.
2. Continue the remaining applicable `docs/AUDIT-AND-PLAN.md` phases (see HANDOVER); D1 is already decided, as recorded above.
3. Use the archive (`docs/ASSET-CATALOG.md`): run `/process-assets` on the works Haris and Elton choose (D13), update `docs/ASSET-SOURCES.md`, add to the gallery.
4. Design the Shop-later state of the funnel once the commerce decisions (D9) are made.
5. Diagonal EKSTAZ type pattern as a scroll-driven motion, from Elton's source if supplied.

## 5. Open pull requests

- None open at the session check; the earlier asset-catalog PR has merged.
- PR #24 (`codex/art-readings-research`) merged; the push blocker described in its HANDOVER entry was resolved.

## 6. Who touches this repo

Haris (owner, merges), Elton (maker, supplies artwork), Claude Code in cloud sessions, and Codex (opens PRs from `codex/*` branches). Codex has merged large UI changes between Claude sessions: always fetch first.
