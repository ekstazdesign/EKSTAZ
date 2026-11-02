# Handover log

## 2026-10-09 — Collection access and first campaign drafts (draft branch)

Haris approved product-first navigation and parallel execution. Homepage now offers Collection and Explore immediately, with intact hoodie/tee/cap concept previews before the remaining optional journey. `collection.html` gives each piece a native hash route, query enhancement and clearly unconfirmed fit, construction, price, release, shipping and return answers. Collection, Explore, About and Updates are consistent across four headers. Returning visitors have a separate saved-signal row on narrow layouts to avoid logo overlap.

The supplied concept JPEGs are exact PDF image streams, recorded in `assets/collection/provenance.json`. Original art, identity files, artist readings, API and database schema are unchanged. BRAND and site direction now record Haris's visitor-expression principle alongside the product-first entrance.

`docs/marketing/START-HERE.md` links three ready creative briefs, creator distribution/invitation drafts, exploratory public portfolios, an experiment ledger, economics formulas and six exact HubSpot task drafts. No outreach, posts, CRM writes or spend occurred. Supabase's EKSTAZ project reports ACTIVE_HEALTHY; read-only inspection confirmed waitlist columns id/email/created_at and join_waitlist function. No subscribers were read and no real signup was submitted. Source attribution is not implemented by this change.

Validation: all 211 local page links/assets/fragments resolve, collection source/static preflight 17/17, unique header/DOM routes checked, JS syntax and git diff whitespace checks pass. All five existing browser suites plus the new collection suite were attempted but cannot launch because this environment has no Chromium executable. No browser layout, motion, keyboard, real-device, sound or live signup success is claimed. Required browser suites must pass before merging. A separate static phone preview sends release-update visitors to ekstaz.art and hides its own forms; it does not simulate signups or checkout.

Not sales-ready: physical samples, final specs/price, seller, shipping, returns, stock, checkout and attributable purchase results remain unconfirmed. This branch is for review, not proof of demand. Keep the current production site unchanged until reviewed and required browser checks run.


State, most recent first. Read at the start of a session. Append an entry at the end of each PR: what shipped, what it means for the next session, and anything **not verified**. This is a log, not a doc to rewrite.

## Log

### 2026-10-08 — "A second look" prototype on the site (unlinked)

- **Shipped (Haris: "merge it ... I'll try it on the actual website"):** `second-look/` (served at `https://ekstaz.art/second-look/`). Haris's prototype, revision 3: his first screen ("What catches your eye first?" with four choices) kept, the choice carried through to the writing screen and the saved image; plus the clearer bridge sentence, "Need a way in?", one line is enough, and a shorter saved image. Its files use root-absolute paths so the page works at both `/second-look` and `/second-look/`. It reuses the site's own `falling.jpg`, header wordmark copy, favicon and `drone.js` (identical files). Elton's words are the exact text from `readings.js`.
- **Not linked** from any page, **`noindex,nofollow`**, not in `sitemap.xml`. Words stay in the page; no analytics, no uploads.
- **Brand note:** follows the 2026-10-08 brand line (the visitor's own expression; no meaning assigned to their choices).
- **Checks:** journey 82/82, motion 92/92, carrier 33/33, drive clean, artwork 70/71 (the known timeout). The page itself: walked through at 390 px, no failed requests, no script errors, image generated.
- **Not verified:** a real phone; saving or sharing the image on a device; sound; whether it helps real people (test with five people who say art isn't their thing). **Elton has not been asked whether his Falling words may be a prompt for visitors.**

### 2026-10-08 — Brand distinction recorded (refined)

- **Recorded in `CLAUDE.md` (Haris's refined wording):** EKSTAZ is about expression of the self in pursuit and spirit of ecstasy; its experiences help people explore their own capacity to notice, feel, choose and express. Elton's work can introduce that world without being required in every experience. Design rules added: do not assign meaning to visitors' choices; effort is not depth. Prompted by the review of the "A second look" prototype and three storyboards (kept outside the repo).

### 2026-10-08 — First-sale path (D9)

- **Added:** `docs/FIRST-SALE.md`, the shortest honest path to one paid order abroad with no capital: a merchant-of-record shop (Fourthwall) with embroidered hoodies and caps, no setup or monthly fee, no minimum. Checked on the official help pages: the UAE is not on Fourthwall's blocked list and is on Stripe's supported list. `docs/LAUNCH-OPTIONS.md` updated, and its stale "Elton's job" text removed (neither of us has a job).
- **Gaps (not decided, not verified):** per-piece numbering is not possible on print on demand (D8 stays open); the UAE licence question needs the adviser's answer before the first payout; sample price, shipping to the UAE and embroidery quality of the wordmark are unchecked; no real account was opened.
- **Next for Haris:** open a free shop, read two base costs, book the adviser call.

### 2026-10-08 — Smaller header logo (audit item 5.1)

- **Shipped (Haris: yes):** `assets/wordmark-crimson-sm.png` (540 px wide, 31 KB) is a scaled copy of the supplied wordmark (110 KB, 2246 px), used only in the header of the home, work and magazine pages. The original is untouched and still used in the footer and by the front-door particle code (`signal.js`). Same image, not redrawn or recoloured.
- **Checks:** journey 82/82, motion 92/92, carrier 33/33, drive clean, artwork 72/72 this run (the known `JavaScript disabled` timeout passed once; unexplained, so do not rely on it). Header logo inspected at 3x density.
- **Not verified:** the speed gain on a real phone (not measured).

### 2026-10-08 — Audit Phase 4 (part): tap targets and small text

- **Shipped:** every button and link on the magazine page is now at least 44 px wide and tall at 390 and 360 px (measured; before, six were smaller). The PDF link, the header wordmark link, Work, Print and the previous and next arrows were fixed; disabled buttons are less faint. Smallest text raised: viewer status and reading note to 12 px, section labels to 12 px, 9 to 10 px labels to 10 or 11 px (items 4.1 to 4.3 of `docs/AUDIT-AND-PLAN.md`).
- **Left alone:** inline links inside sentences (Instagram handle, archive link) are exempt from tap-size rules; uppercase button labels stay at 10 to 11 px; 4.5 (work hero) and 4.6 (wordmark behind the hero text) are Elton's calls.
- **Checks:** journey 82/82, motion 92/92, carrier 33/33, drive clean, artwork 70/71 (the known `JavaScript disabled` timeout). Magazine screenshot at 390 px inspected.
- **Not verified:** a real phone.

### 2026-10-08 — Share image without the tagline

- **Changed (Haris: "Change"):** `assets/og.jpg` no longer carries "A new strain of exotic hype design. Don't fit in." It is rebuilt from the supplied wordmark and star only (scaled and composited, not redrawn), on black with grain. Alt text updated on all three pages.
- **Not verified:** how the card looks in a real share preview; Elton has not seen it. The old image is in git history (`assets/og.jpg` before this commit) if he wants it back.

### 2026-10-08 — Audit Phase 3: share metadata, robots, sitemap

- **Shipped:** the magazine page now has Open Graph and Twitter card tags, theme colour and touch icon, and a title in the same pattern as the other pages ("EKSTAZ — December 2021 magazine"). Home and work pages gained image width, height and alt text and a Twitter image. New `robots.txt` and `sitemap.xml` (three pages). Items 3.1 to 3.3 of `docs/AUDIT-AND-PLAN.md`.
- **Checks:** journey 82/82, motion 92/92, carrier 33/33, drive clean, artwork 70/71 (the known `JavaScript disabled` timeout).
- **Flag for Haris and Elton:** the share image (`assets/og.jpg`) reads "A new strain of exotic hype design. Don't fit in." Brand rule 1 says no hype; this is Elton's own line on his own card, so I left it. Their call.
- **Not verified:** how the cards look in a real share preview (needs the deployed URL in a card validator).

### 2026-10-08 — Crown keeps its earlier text

- **Changed:** Crown Vic had no text in Elton's file; at Haris's request it shows its earlier text again (restored word for word from `98efe78`). It does not mention AI. Replace it when Elton writes one.

### 2026-10-08 — Elton's own texts replace the AI readings

- **Changed:** `readings.js` now holds Elton's amended texts, word for word, for 14 pieces (Crown has none yet, so the viewer hides the block). The note saying an AI read the work is removed from `work.html`; the site mentions AI nowhere (Haris: "No mention of AI must be there"). `CLAUDE.md` rule 3 rewritten to match.
- **Decided (Haris, 2026-10-08): keep the gallery titles.** Elton's headings in his text file (Imagine In Peace, Blinding, J is J, Elton 1a and others) are not used as titles.
- **Phone:** Haris checked the longer texts on his phone, 2026-10-08: fine.

### 2026-10-08 — Letter and star variants: exploration, one final

- **Recorded:** the changing letters and star in Elton's renders are deliberate exploration, not AI error. Variation is welcome on the path to expression; once finalized, one variant is the only one in production. Rule 4 in `CLAUDE.md` now says this; the asset catalog row is updated.
- **Next:** when Elton finalizes, add the final files to `assets/` (via `process-assets`) and replace the supplied ones.

### 2026-10-08 — Elton's Edition 01 renders catalogued

- **Recorded:** Elton's AI renders for Edition 01 "The Drive In" (ten stills, three videos) in `docs/ASSET-CATALOG.md`, third batch. Concept renders, not product; the AI redrew the wordmark and star, so the real files must be used on garments and the site. Files are not in the repo. The sleeve text "E11 / 02:00" is an AI error, and "The Drive In" names the launch day, not a drive-in theme (Haris).
- **Open:** whether any letter variant is intended (Elton). D8 and D10 gate any site use.
- **Not verified:** the videos were checked as still frames only.

### 2026-10-08 — December 2019: the room before, ash to letters

- **Shipped (PR #26):** Elton's December 2019 exhibition on the site, in the four ways he chose. (1) Front door arrival: particles rise as grey ash and settle into the letters, warming to red (`signal.js`; reduced motion shows the letters at once). (2) Work page section `05 — Before` (`#before`): the installation photo, then seven paintings in his hanging order at their sizes relative to one another, each starting as ash and taking its colour when reached (`before.js`, `styles.css`). (3) His line about Guilty beside both signups. (4) The wax hands, Of God and Man, close the room before the signup. A fifth home path, Return, links to the room.
- **Rules kept:** titles, media, sizes and order only from his `ARTWORK TEXTS.docx`; no AI readings in the room; no links claimed between 2019 pieces and current ones; his texts for the suicide-themed pieces are not used. Sources in `docs/ASSET-SOURCES.md`.
- **Checks:** journey 82/82, motion 92/92, carrier 33/33, drive clean, artwork 70/71 (the known `JavaScript disabled` timeout). Phone and desktop screenshots inspected.
- **Not verified:** the ash arrival on a real phone (speed and feel); Elton has not seen the room's wording.

### 2026-10-07 — Second batch of Elton material catalogued (docs only)

- **Catalogued, nothing added to the site:** three PDFs (*The Legend of EKSTAZ*, *The Drive In*, *Process Portfolio May*) and the Drive folder `139uTAYOQiTTQPPEH46_3AiN_H_n2hbKk` (Elton's December 2019 exhibition with his own artwork texts, older portfolios, and a folder of another artist's work that must never be used). See `docs/ASSET-CATALOG.md`, second batch.
- **Raised:** D14 (the Legend plan positions EKSTAZ as a Dubai brand, against rule 6) and D15 (whether to show the 2019 work and Elton's statements). None of the 15 gallery pieces appears in this batch, so the readings stand.
- **Corrected:** the entry below says its change was not pushed; it merged as PR #24 and is live. STATUS updated to match.
- **Decided (Haris, same day):** "Elty" is Elton. Ignore the Legend's Dubai positioning (D14). The 2019 exhibition documents a reform and resurrection of EKSTAZ and must be reflected in artistically meaningful ways (D15; concept open).
- **Added:** `docs/LAUNCH-OPTIONS.md`, low-capital routes to sell abroad without UAE commerce (D9). Research, not legal advice; key eligibility points unverified.
- **Not verified:** any supplier figure in the Legend (most are marked GUESS).

### 2026-10-07 — Shorter, image-grounded artwork readings (prepared locally; push and draft PR blocked)

- **Prepared, not live:** completed the recovered research report at `reports/Art meaning and AI readings.md` and revised all 15 paragraphs in `readings.js` to 53–64 words. The readings retain image-led metaphors while removing invented scenes, emotional sequences and visual errors. The existing “A reading” label and AI disclosure remain unchanged; these are interpretations, not Elton's statements.
- **Corrected:** related alt text in `index.html` and `work.html`, and “bar logo” to the source's “box logo” in the hoodie annotation. Direct inspection confirms that Kenosha and Before thee share the same core figure composition. Magazine page 10 contains that red composition and historical explanatory prose; `docs/ASSET-SOURCES.md` now records this without claiming authorship, chronology or a red-to-white emotional sequel. No assets were added.
- **Checks:** drive 21/21, journey 82/82, motion 92/92, artwork 72/72, carrier 33/33: **300/300**. A clean `origin/main` at `2d652360` returned 298/299, solely its known `JavaScript disabled: completes` timeout. No repository tests were changed; this task does not claim to fix that baseline failure. Focused viewer QA passed **206/206**: all 15 phone deep links at 390×844 and two desktop cases, exact text/title/image/disclosure, reading ends reachable by scrolling, Next and Close. Phone and desktop screenshots were inspected.
- **Research limit:** fresh external source retrieval returned proxy CONNECT 403. The report labels external literature as recovered evidence and omits uncertain claims; the artwork and archive checks were completed locally.
- **Repository access blocker:** the seven-file change is committed locally as `c1d76f2` on `codex/art-readings-research`. Git credentials used by this machine authenticate as `motivatedc-creator`; push returned HTTPS 403 denying that identity permission to `Happy-Harris/EKSTAZ`. Authenticated repository metadata confirms read access (`pull: true`) but no write access (`push: false`). Existing credentials work for reads; this execution identity needs repository **Write** access before retrying the push and opening a draft PR to `main`. No remote task branch or PR was created.
- **Not verified:** Haris or Elton's agreement with these readings; real-phone touch, scroll and audio; Safari; the live Supabase waitlist; the login-protected Vercel preview or production deployment. The change is local, not pushed or live. Next: grant repository Write access to the GitHub identity used by this machine; Haris and Elton can review the revised interpretations meanwhile.

### 2026-10-07 — A reading for every artwork

- **Shipped:** `readings.js` holds a paragraph of interpretation for each of the 15 pieces (Ares, Kenosha, Pain and the rest, plus the hoodie study). The viewer shows it under "A reading", with the note: "Elton chose not to explain his work. He invited an AI to read it instead. This is one way to see it; yours counts as much." Haris asked for this on Elton's behalf (2026-10-07); `CLAUDE.md` rule 3 records the exception.
- **How they were written:** from looking at each image at full size. They describe what is visible and what it might mean; no dates, intent or backstory are claimed. Kenosha and Before thee are read as a pair because they are visibly the same drawing.
- **Not verified:** Elton has not read them. On a desktop viewer, a long reading may need scrolling in the side panel.

### 2026-10-07 — Glitch, Ares, archive tee, a shorter front door

- **Shipped:** Elton's own Pain glitch frames flicker once over Pain when the Encounter chapter comes into view (`journey.js`, `signal.css`, `assets/art/glitch/`), and the work page letters glitch once after they land; both are off under reduced motion. The helmeted bust is titled Ares (slug `feel-it` unchanged). The garment section shows one archive T-shirt photo, captioned as an earlier draft, not for sale (not in the viewer, so viewer navigation is unchanged). The front door is shorter with the stages untouched: tighter chapter padding and text rhythm, a smaller letter band, a capped encounter image, side-by-side studies on phones, and two columns of paths on desktop.
- **Heights:** desktop 7,200 to 6,250 px; phone 7,770 to 6,690 px. Going further means cutting copy.
- **Decided:** Elty portrait left out; *Packaging Emotions* (a cigarette-packaging study) and *Beyond the Octagon* (a UFC PR campaign by Elton) are not EKSTAZ material.
- **Checks:** journey 82/82, motion 92/92, carrier 33/33, drive clean, artwork 70/71 (pre-existing).
- **Not verified:** the glitch timing on a real phone; how the shorter rhythm reads to Haris and Elton.

### 2026-10-07 — Full-resolution artwork and the true cross emblem

- **Shipped:** eleven gallery pieces and the hoodie study replaced with higher-resolution copies from Elton's archive (up to 2,000 px on the longest side; before, 1,200 to 1,600): Kenosha, Falling, Field, Imagine, LSD, Pain, Ribcage, Before thee, Don't fit in, Red, Hoodie study. Each was matched to the image already on the site by similarity (0.997 or better, same aspect), so it is the same work, not a different edit. `assets/marks/cross.png` is now Elton's transparent 6,000 px emblem.
- **Corrected:** Field had been flattened onto white when first added; it is now on black, as on Elton's Creation page.
- **Not replaced:** Crown, Cross drawing, Hands, Feel it, magazine cover, Strain (no larger or no identical source). See `docs/ASSET-SOURCES.md`.
- **Checks:** journey 82/82, motion 92/92, carrier 33/33, drive clean, artwork 70/71 (the pre-existing failure).
- **Not verified:** how the heavier images feel on a slow phone connection (the largest is 700 KB; total added is small because the art is line work).

### 2026-10-07 — Asset archive catalogued (docs only)

- **Received:** `EKSTAZ WEBSITE ASSETS.zip` from Elton (539 MB, 230 files). Downloaded and unpacked in a scratch folder; nothing was added to the site. `docs/ASSET-CATALOG.md` records every folder, name clues, flags and a suggested order of use.
- **Findings:** original works at 3,000 to 8,000 px (the site serves 1,200 to 1,600); a glitch and colour-shift series; a 6,000 px transparent cross emblem; Elton's letters and star sources (already in use); six T-shirt photos; the Whips set (held back); lookbooks including a Myriad deck that must not be used.
- **Not done:** no asset processed or wired in; the archive's PDFs (Packaging Emotions, Beyond the Octagon) were not read.
- **Follow-up for Elton:** set the Drive zip back to Restricted (STATUS D12).

### 2026-10-07 — Agents, skills, workflows and session memory (PR #18)

- **Shipped:** `CLAUDE.md` and `AGENTS.md` (rules for Claude and Codex), `docs/STATUS.md` (the map) and this log; nine subagents in `.claude/agents/`; skills `resume-ekstaz`, `ship-ekstaz`, `process-assets`; workflows `ekstaz-audit-lean`, `ekstaz-audit-full`, `ekstaz-review-pr`, `ekstaz-launch-research`; `dev/prep-assets.py`; `dev/cloud-setup.sh`; a SessionStart hook that prints the top of this log.
- **Modelled on** the LockD repo (`Happy-Harris/LockD`): one rulebook, one status map, one handover log, small single-purpose subagents.
- **Not verified:** the SessionStart hook format and whether the cloud setup script can run the `claude` command; the two new workflows have a syntax check only, not a run.

### 2026-10-07 — Act on the website review (PR #17)

- **Shipped:** one header on every page (Work, Print, Listen, Updates, sound toggle), sound toggle outlined so only the signup is a filled red action, space reserved for the sticky bar, Kenosha beside the headline on desktop, one letter band instead of two, chapters sized to content, canonical tags, a redundant first-screen paragraph and a few hedges removed.
- **Not done:** page length is still about 7,200 px (decision D1); the small-phone (375×667) first screen still has Begin partly under the bar because stages must stay at least 150 px.
- **Checks:** journey 82/82, motion 92/92, carrier 33/33, drive clean, artwork 70/71 (pre-existing).

### 2026-10-07 — Elton's letters, cross and star in the signal (PR #16)

- **Shipped:** particles form Elton's custom letters (Enter), the ornate cross emblem cross-stitched (Form) and his star (Stay close); scroll-driven letter bands; letters land above the work page title; five new works (Kenosha, Feel it, Red, Field, Falling); sound on by default again, with the sound checks updated to that policy.
- **Assets added:** `assets/letters/{e,k,s,t,a,z}.png`, `assets/marks/{cross,star}.png`, `assets/art/{kenosha,feel-it,red,field,falling}[-sm].jpg`.
- **Not verified:** sound on a real phone; Feel it is only 810 px wide at source.

### 2026-10-07 — Audit and plan (PR #14)

- `docs/AUDIT-AND-PLAN.md`: audit of the Codex UI, comparison with branding and psychology literature, phased amendment plan. Top issues found: invented "Drop 001" copy, `?n=` preview without a label, no "not a purchase" line on the work-page form, undefined "CARRIER" label, no share metadata on the magazine. Check which are fixed before repeating work.

### 2026-10-07 — Codex UI work (PRs #12, #13, #15)

- Codex rebuilt the artwork viewer, the guided journey, the sticky progress controls, and restored prominent particle stages. It switched sound to off by default (later reverted by PR #16) and wrote `docs/SITE-DIRECTION.md`, `docs/verification.md`, `docs/FIGMA-UI-SOURCES.md` and the `dev/*-checks.mjs` suites.

### Earlier (summary)

- The site began as a static Vercel site with a Supabase waitlist (`api/join.js`). A competing redesign (PR #4) merged while another was being built, which taught the sync-first rule. The Signal page (particle field, drone, numbered marks) became the front door; the old homepage became `work.html`; sound and page fades were shared across pages.
- Business context: the plan is to sell outside the UAE; a London first run of about 25 pieces was a hypothesis. Nothing is decided (D9).
