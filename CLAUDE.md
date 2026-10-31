# EKSTAZ — project guide

Read this before changing anything. Then [docs/STATUS.md](docs/STATUS.md) (the map: what is live, what is open, what needs a human decision) and the top of [docs/HANDOVER.md](docs/HANDOVER.md) (what shipped, most recent first). Then run `git fetch origin` and read `git log --oneline -10 origin/main`: other agents (Codex) and people push to `main` between your sessions.

## What EKSTAZ is

An art, sound and garment world by **Elton** (maker) and **Haris** (builds the site and the business). [BRAND.md](BRAND.md) is the locked October 2026 brand core: *EKSTAZ is a state of recognition made tangible.* The offer is a way to carry a signal (expression, reinforcement, discovery). The site at **ekstaz.art** is another way to encounter the work and carry its signal. Test every change against that line.

**The brand is EKSTAZ, not one person's work (Haris, 2026-10-08).** EKSTAZ is about expression of the self in pursuit and spirit of ecstasy. Its experiences should help people explore their own capacity to notice, feel, choose and express. Elton's work can introduce that world without becoming a requirement for every experience; that leaves room for Haris, Elton, visitors and future contributors. Rule 3 below protects his work (never altered, explained or credited wrongly). When designing for visitors: do not assign meaning to their choices, and do not equate effort with depth.

## Brand rules (strong defaults)

1. **Never** reshape the work to win a bigger audience, explain it into slogans to make it easier to sell, or manufacture hype. No fake scarcity, countdowns, "only N left", rank claims, or logo flexing.
2. **Elton's chaos wins.** The brand core is a guide, not a cage. If Elton wants EKSTAZ louder, stranger or less tidy, that supersedes a tidy rule here (Haris, 2026-10-07). Ask Haris when a choice is genuinely Elton's call.
3. **The work leads when presented.** EKSTAZ creates room for self-expression, as clarified in BRAND.md by Haris (2026-10-09). Elton’s work introduces the world without being required in every experience. Garments are reachable immediately and the art journey is optional. Original artwork keeps its proportions and colours. Do not invent titles, dates, editions, stages, statements or connections between pieces. Use only what the source material says (`docs/ASSET-SOURCES.md`).
   - **Each piece's text is Elton's own** (`readings.js`, shown in the viewer under "A reading"), from his amended texts (Haris, 2026-10-08). Use his words exactly; do not edit, extend or write new ones. **No mention of AI anywhere on the site.** Crown keeps its earlier text until Elton supplies one (Haris, 2026-10-08). A new piece gets text only when Elton supplies it.
4. **Identity assets are immutable.** The wordmark, E mark, icons and Elton's custom letters (`assets/letters/`) are used as supplied: no recolouring, outlining, redrawing or font substitutes. Generated marks and particle renderings are website experiments, never logos. Elton may explore variants of the letters and star (Haris, 2026-10-08); a variant replaces a supplied file only when he finalizes it, and then it is the only one used.
5. **Signup is optional and honest.** An email gets release updates, an arrival number and a mark. The number records arrival; it is not a rank, a reservation or a guarantee of a garment. The `?n=` preview is a demo, not proof of registration.
6. **No Dubai in copy.** The plan is to sell outside the UAE. Do not add the UAE, Dubai or The Myriad to site copy. The 2021 slides that mention The Myriad are visual reference only.
7. **Slides and old decks are visual reference only.** The brand core wins on words.

## Where things live

| Path | What |
|---|---|
| `index.html`, `signal.css`, `signal.js`, `journey.js` | Front door: collection preview and six-chapter guided journey, particle states, numbered marks, signup |
| `collection.html`, `collection.css`, `collection.js`, `assets/collection/` | Hoodie, tee and cap concept previews; final product details unconfirmed |
| `site-nav.css` | Shared Collection, Explore, About and Updates navigation, visible on narrow screens |
| `work.html`, `styles.css`, `artwork.css`, `viewer.js`, `join.js` | The work: gallery, artwork viewer, garment study, print, sound, signup |
| `magazine.html`, `magazine.css`, `magazine.js` | December 2021 magazine reader (17 pages) |
| `drone.js`, `ambient.js` | Shared sound (on by default, starts at first touch), ambient field, reveals, page fades |
| `api/join.js` | Vercel Function: validates an email, calls Supabase RPC `join_waitlist(p_email)`, returns `{number, existing}` |
| `assets/art/`, `assets/letters/`, `assets/marks/`, `assets/publications/` | Artwork (`x.jpg` up to 2000 px and `x-sm.jpg` 640 px), Elton's letters (transparent PNG), cross and star marks, magazine PDF |
| `dev/` | Local server with a fake Supabase and the browser check suites (`dev/README.md`) |
| `docs/` | `SITE-DIRECTION.md` (design rules), `AUDIT-AND-PLAN.md`, `ASSET-SOURCES.md`, `verification.md`, `FIGMA-UI-SOURCES.md`, `STATUS.md`, `HANDOVER.md` |
| `.claude/agents/`, `.claude/skills/`, `.claude/workflows/` | Subagents, skills and named workflows (below) |

Static HTML, CSS and JavaScript on Vercel, **no build step**. Vercel project `ekstaz` (team `harr-elty`); production is `main`. Supabase project `meiqrxtftcmpwjedleil`, table `waitlist`. Every pull request gets a Vercel preview behind login.

## Commands

```bash
env -u SUPABASE_URL -u SUPABASE_ANON_KEY node dev/serve.mjs 8080 &     # local site, fake Supabase
node dev/drive.mjs        http://localhost:8080 /tmp/shots   # smoke test + screenshots
node dev/journey-checks.mjs http://localhost:8080 /tmp/shots-j   # chapters, controls, signup
node dev/motion-checks.mjs  http://localhost:8080 /tmp/shots-m   # particles, stages, reduced motion, sound
node dev/artwork-checks.mjs http://localhost:8080 /tmp/shots-a   # gallery, viewer, share, sound, no-JS
node dev/carrier-checks.mjs http://localhost:8080 /tmp/shots-c   # numbered marks and cards
```

Playwright is at `/opt/node-tools/node_modules/playwright` and Chromium at `/opt/pw-browsers/chromium` in the cloud image. Never run `playwright install`. `.claude/skills/run-ekstaz` has the full recipe.

**Known failing checks (they fail on `main` too, not yours):** artwork `JavaScript disabled: completes` (a timeout). Everything else is expected green: journey 82/82, motion 92/92, carrier 33/33, drive clean, artwork 70/71. If anything else fails, it is yours until you prove otherwise by running the same suite on a clean `origin/main` worktree.

## How work lands

- **Sync first.** `git fetch origin`, branch from the latest `origin/main`, and re-check before opening a PR. A competing redesign once merged while another was being built and the work was thrown away.
- Work on the branch the session assigns. Push with `git push -u origin <branch>`; on a network error retry with 2, 4, 8, 16 s back-off. GitHub has had outages (500 on push, merge and API): wait and retry, do not bypass.
- Open a **draft** PR to `main`, subscribe to its activity, and keep it small and single-purpose. State in the body what was **not** verified.
- Run the five suites before pushing a change that touches pages, CSS or scripts, and compare failures with a clean `origin/main`. Never skip, delete or loosen a test to go green; update a test only when the rule it encodes has deliberately changed, and say so in the PR.
- Update `docs/HANDOVER.md` (newest first) and the tables in `docs/STATUS.md` in the same PR.
- Never force-push `main`. Never merge a PR the human did not ask you to merge. Ask before deleting a feature.
- Keep secrets and keys out of the repo (it can be public). The Supabase anon key lives only in Vercel environment variables.
- Do not commit scratch files, screenshots of private data, or the contents of `dev/` output folders.

## Working rules learned the hard way

- **Reduced motion is a composed still, not a dead page.** Every chapter keeps a designed final frame; only movement is removed.
- **Browsers need a tap before audio.** Sound is on by default (armed on load, starts at the first touch), and a saved "off" is respected. Do not claim audio works on a phone until it has been checked on a phone.
- **Stages keep their size.** The motion checks require each particle stage to be at least 150 px high with a gap before the reading text. Shrinking them for page length fails the checks; page length is a design decision for Haris and Elton.
- **Header links**: the home page's `a[href="#carry"]` must stay unique to the in-page links (the journey checks click the first match). The header's Updates link is `/#carry` for this reason.
- **A hidden first match breaks tests.** Selectors like `a[href="work.html"]` and `.bar-nav a[href="#productions"]` and the class `reader-back` are used by the checks; keep them.
- **Image sizes:** artwork `x.jpg` up to 2000 px, `x-sm.jpg` 640 px with `srcset`. Cut red-on-black marks to transparent with `dev/prep-assets.py` (see the `process-assets` skill). Do not upscale.
- **Do not trust a green headless run for feel.** Real-phone sound, touch and scroll feel are unverified until Haris checks the preview.

## Subagents

`.claude/agents/`: `brand-guardian` (copy and claims against BRAND.md), `motion-director` (particles, journey motion, sound, reduced motion), `journey-funnel` (chapters, one-ask rule, email now and shop later), `asset-steward` (artwork, letters, marks, sources), `waitlist-api` (api/join.js, Supabase, number semantics, privacy), `e2e-qa` (suites, baseline comparison, screenshots), `handover-scribe` (HANDOVER, STATUS, PR hygiene), `verify-gate` (merge gate), `launch-planner` (business decisions: entity, payments, shipping, regulator, marks rights). Delegate by area; `handover-scribe`, then `verify-gate`, run last.

## Skills and workflows

- `/resume-ekstaz`: start of a session. Rebuilds context from the repo and reports state, open decisions and the next action.
- `/ship-ekstaz`: pre-push checks, PR, preview, merge on request, and a poll of ekstaz.art to confirm the deploy.
- `/process-assets`: turn Elton's supplied files into site-ready art, letters and marks.
- `/run-ekstaz`: run the site and the suites.
- Workflows (run only when Haris asks for one): `ekstaz-audit-lean`, `ekstaz-audit-full`, `ekstaz-review-pr`, `ekstaz-launch-research`.

## Style for the person you work with

Haris has ADHD and reads on a phone. Lead with the next action, number multi-step work, give concrete time estimates, and end with one thing doable in two minutes. Plain words; say what was **not** verified. Do not narrate tool use.
