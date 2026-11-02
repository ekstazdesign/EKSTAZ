# EKSTAZ site: audit and amendment plan

Scope: post-Codex UI revision, judged against `docs/SITE-DIRECTION.md`. Audits covered mobile design (390x844, 1440), brand copy, function, and journey/SEO. Spot-check status is marked per finding: **[verified]** I re-read the cited lines; **[reported]** taken from the audit measurements (viewport sizes, pixel measurements) and not re-measured.

## 1. Summary

**What works.** The homepage journey follows the direction: native anchors `#begin` to `#carry`, original Pain and Cross images with width/height, alt and srcset, an explicit "nothing to submit" reflection, and a "study, not a piece on sale" framing (`index.html:57-89`). Return routes are correct (`work.html:71` to `/#reflection`; `magazine.html` to `/#expression`). Function is sound: the drive, carrier (33/33) and journey (82/82) checks pass, `/api/join` behaves correctly for new, repeat, bad and GET requests, and there are no console errors, 4xx requests or horizontal overflow at 390 or 1440. Focus rings and reduced-motion rules exist (`styles.css:28,298`, `signal.css:19,162,174`, `artwork.css:98`). No "Dubai" anywhere; identity assets are unmodified; no scarcity or countdown copy.

**Top 5 issues** (all copy/trust, all verified):
1. "Drop 001" is invented in public copy (`index.html:112`).
2. The public `?n=` preview mints a "CARRIER" card for any number with no preview label (`signal.js:419-421`, `:331`).
3. Number meaning differs between pages: the work-page form lacks the "not a purchase or reservation" line (`work.html:114` vs `index.html:113`).
4. "CARRIER" is an undefined, rank-sounding label on the saved image (`signal.js:331`).
5. Magazine page has no share metadata (`magazine.html:3-10`; canonical only, line 7).

No form or API defects were found. Everything is a text, metadata, or small CSS change.

## 2. Findings by theme (severity-ranked)

### A. Brand copy and SITE-DIRECTION alignment

| # | Sev | Finding | Evidence | Status |
|---|---|---|---|---|
| A1 | High | "including Drop 001" invents a named release. `README.md:107` says Drop 001 has no confirmed pieces, run size, price or date. Direction: no invented edition, no availability claims (`SITE-DIRECTION.md:3, 64-67`). | `index.html:112` | verified |
| A2 | High | `/?n=7` opens the same card as a real signup ("№007 ...", Save/Share/Copy link) with no "preview" wording. The code comment (`signal.js:305,419`) knows it is a preview; the UI does not say so. Direction says a preview is a demonstration, not evidence of registration (`SITE-DIRECTION.md:70-72`). | `signal.js:419-421` | verified |
| A3 | Med | Number semantics inconsistent. Home: "isn't a purchase or a reservation" (`index.html:113`). Work form omits it (`work.html:114`). Success strings differ: "You're in." (`join.js:53`) vs "You're on the list." (`signal.js:409`). | cited lines | verified (join.js:53, work.html:114, index.html:113) |
| A4 | Med | "C A R R I E R" printed on the saved mark, never defined in visible copy, reads as a tier. | `signal.js:331` | verified |
| A5 | Med | "On paper. Toward cloth.", "take form", "carried from paper toward cloth" imply a drawing-to-garment pipeline. Disclaimer ("a study, not a piece on sale", `index.html:89`) is small and below the headline. | `index.html:37,75,82-83` | reported |
| A6 | Low | Availability-flavoured strings: "The list isn't open yet. Try again soon." is an env-missing 503, not a policy (`api/join.js:14`, line number corrected from the audit); "Exploring the work is always open." (`index.html:120`). | cited lines | verified |
| A7 | Low | Reflection copy presumes a feeling: "What stayed with you?" (`work.html:70`, unhedged), `index.html:69,97`. Home hedges with "may"/"can"; the work page does not. | cited lines | work.html:70 verified |
| A8 | Low | "Listen" and "04 Sound" link only to Instagram and YouTube; no original track exists (`ASSET-SOURCES.md:29-32`). | `index.html:101`, `work.html:100-107` | reported |

### B. Journey, trust and SEO

| # | Sev | Finding | Evidence | Status |
|---|---|---|---|---|
| B1 | Med | No privacy/data-use line beside either form; emails go to Supabase (`api/join.js`). No removal route stated. | `index.html:112-120`, `work.html:114-122` | reported (grep) |
| B2 | Med | `magazine.html` lacks og:*, twitter:card, theme-color, apple-touch-icon; title pattern differs ("December 2021 magazine — EKSTAZ"). | `magazine.html:3-10` | verified (no og/canonical other than line 7) |
| B3 | Low | `index.html`/`work.html` have no canonical; og:image lacks alt/size; no twitter:image; no robots.txt or sitemap.xml. | `index.html:3-16`, `work.html:3-16` | reported |
| B4 | Low | Deep-linked `work.html?art=slug` shares generic metadata (title changes client-side only, `viewer.js:54`). Acceptable known limit unless per-piece pages are wanted. | `viewer.js:20,54,84` | reported |
| B5 | Low | `assets/wordmark-crimson.png` is 2246x400 (110 KB) shown at 135x24, eager on every page. A resized derivative is possible without altering the original. | `index.html:27` | reported |
| B6 | Low | `work.html:20` preloads `strain-lg.jpg` (1600px) with no imagesrcset, so phones fetch an extra large image. Google Fonts CSS is render-blocking. | `work.html:20,40` | reported |

### C. Mobile design (390x844 unless stated)

| # | Sev | Finding | Evidence | Status |
|---|---|---|---|---|
| C1 | Med | Magazine prev/next measure 41x48, below 44px width; disabled arrow at opacity .35. | `magazine.css:11-12` (min-height 48, padding 0 16px, no min-width) | verified in CSS; width reported |
| C2 | Med | Magazine "Open the PDF edition" link 198x17; back link wraps to two lines. | `magazine.css:8`, `magazine.html:16` | reported |
| C3 | Med | Sub-13px labels: 10px step numbers, 11px status text inside `role=status`, 12px notes. | `signal.css:50,69,127`, `artwork.css:49,59` | reported |
| C4 | Low | "December 2021 archive" link is 20px tall (`display:inline` override). | `signal.css:61,86` | reported |
| C5 | Low | Hero map's last item (y~772) touches the sticky bar (y~783). | `signal.css:67-69,92`, 390x844 | reported |
| C6 | Low | Ambient particle wordmark sits behind hero body text (y~300-340). Direction: atmosphere must not compete with content. | index hero, 390x844 | reported |
| C7 | Low | Work hero pushes the first gallery row mostly below the fold (tile bottom 882 vs 844); two stacked CTAs. Direction: the work page serves browsing. | `work.html` hero, 390x844 | reported |

### D. Function

| # | Sev | Finding | Evidence | Status |
|---|---|---|---|---|
| D1 | Low | `artwork-checks` fails 1 of 72 (no-JS gallery link not fully in viewport at load; bottom 882 vs 844). Passes once the hash scroll settles. The suite is red; either the check or the layout is wrong. Same root as C7. | `dev/artwork-checks.mjs:334` | reported (3 of 3 runs) |
| D2 | Low | `vercel.json:2-3` redirects `/signal.html` to `/`; the dev server does not apply it and no check covers it. Possibly dead config. | `dev/serve.mjs` | reported |

## 3. Site vs literature

Evidence strength is as stated in the research summaries. Where a source is weak or an extrapolation, I say so. The brand's deliberate withholding of explanation is treated as valid: nothing below argues for adding explanatory copy about the work. Per `SITE-DIRECTION.md`, no scarcity, countdown or availability claims are recommended.

| Principle (source, strength) | Site alignment | Conflict / note |
|---|---|---|
| First impressions form in about 50 ms (Lindgaard 2006; strong, but static screenshots, measures appeal only) | First screen is deliberate: near-black ground, crimson, Didone. | C6: particle texture under body text may dilute the first read. Low-cost check only. |
| Processing fluency raises liking (Reber 2004; strong as theory; context-dependent) | Native anchors, clear hierarchy, 44px targets on the homepage and viewer. | C1-C4 are fluency leaks on the magazine page. Mystique should sit in content, not in friction (design inference, not a sourced finding). |
| Aesthetic-usability (Tractinsky 2000; moderate; ATM layouts, perceived not measured usability) | Polished visuals earn tolerance. | Tolerance does not cover a trust gap; B1 and A3 are not offset by aesthetics. |
| Brand personality: Sophistication/Excitement (Aaker 1997; strong but US mainstream brands, weak cross-cultural replication) | Tone is restrained, which fits Sophistication. | Use as a vocabulary check only. |
| Kapferer prism as coherence checklist (weak: a secondary blog, not the text) | Cross-page consistency is the real gap: A3, A4, B2. | Planning aid, not evidence. Cite the book before relying on it. |
| Narrative transportation (Green & Brock 2000; strong for text, analogy for web) | One continuous world; native sections. | Anything breaking immersion (A1's invented release, A4's "carrier" tier) works against it. |
| Curiosity as information gap (Loewenstein 1994; strong as theory) | Withholding is the brand's device and supports curiosity. | Keep the gap about the work. Do not manufacture a gap with an unnamed "Drop 001" (A1). |
| Peak-end (Fredrickson & Kahneman 1993; moderate; film clips, contested for web) | The close is the saved mark and signup. | A2/A4 weaken that ending if the card reads as a rank or an unlabelled preview. Treat as hypothesis. |
| Opt-in sound; handle blocked autoplay (Chrome docs; moderate, vendor guidance) | Sound toggle exists and is keyboard-focusable. | No conflict found. I did not verify default-silent behaviour. |
| Reduced motion (WCAG 2.3.3, AAA; strong as normative) | Media queries present in three stylesheets; direction requires freezing. | The audit confirmed rules exist, not that every effect is covered. |
| Optimal distinctiveness (Brewer 1991; moderate) | "A state of recognition" frames a small in-group. | Nothing to change. |
| Scarcity raises value (Lynn 1991; moderate, dated, backfires when fake) | Site makes no scarcity claims. | Consistent with SITE-DIRECTION. A1 comes closest to implying a scheduled drop. |
| Foot-in-the-door (Freedman & Fraser 1966; Burger 1999; moderate, can reverse) | Signup is a low-cost optional first step. | Not a guaranteed lever; do not tune the form for conversion on this evidence. |
| Reactance to forceful language (Rains 2013; moderate; health messages, citation link not opened) | CTAs are soft and "optional" throughout. | A7: the unhedged "What stayed with you?" is mildly presumptive. |
| Privacy valuation is context-dependent (Acquisti 2013; weak, not read) | No data-use line. | B1 stands on plain UX and legal practice, not on this paper. |

Evidence gaps (do not assert): no rigorous study ties web design to "mystique" or scarcity-led luxury; nothing sourced on awe, scroll-storytelling conversion, brand sound effect sizes, cross-border trust signals, or drop-culture ethics.

## 4. Amendment plan

Effort in concrete units (one person; "ed" = one small edit of a few lines). "Decide" marks owners: **E** = Elton, **H** = Harris (or Haris, as spelled in `SITE-DIRECTION.md:4`).

### Phase 1: remove unverified claims (copy only, ~8 ed, 45 min)
| Item | Files | Risk | Verify | Decide |
|---|---|---|---|---|
| 1.1 Cut "including Drop 001" (A1) | `index.html:112` | Low | `grep -rn "Drop 001" *.html` returns none | H/E to confirm |
| 1.2 Label `?n=` previews (A2): note says "Preview of a mark, not a confirmed signup"; keep off the PNG or add a small line | `signal.js:419-421`, openCard note around `:409-421` | Low-Med: touches card flow | `node dev/carrier-checks.mjs` stays 33/33 (update any text assertions); manual `/?n=7` | H/E on wording |
| 1.3 Replace "CARRIER" with "ARRIVAL №nnn" or drop it (A4) | `signal.js:331` | Low (image text). Check canvas layout | carrier-checks; view saved PNG | E (it is a brand word) |
| 1.4 Neutral errors, drop "always open" (A6) | `api/join.js:14`, `index.html:120` | Low | `curl -X POST /api/join` with env unset | no |
| 1.5 Hedge `work.html:70` (A7) | `work.html:70` | Low | read | no |

### Phase 2: consistent number and trust copy (~6 ed, 1 h)
| Item | Files | Risk | Verify | Decide |
|---|---|---|---|---|
| 2.1 One sentence on the number, both forms (A3). "Arrival" and "not a purchase, reservation or rank" | `work.html:114`, `index.html:113` | Low | grep both pages | H on wording |
| 2.2 One success string; remove "You're in." | `join.js:53` | Low | drive.mjs, carrier-checks | no |
| 2.3 Privacy line under both forms (B1). Link a page only if one exists | `index.html:~120`, `work.html:~122` | Med: states how data is used | read vs `api/join.js` and Supabase config | **H/E must supply the actual policy and removal route** |
| 2.4 Soften garment headline; move disclaimer next to it (A5) | `index.html:37,75,82-89` | Low-Med: headline is brand voice | read | **E decides copy** |
| 2.5 Relabel Listen/Sound to Follow (A8) | `index.html:101`, `work.html:100-107` | Low | read | E: or keep if a track is coming |

### Phase 3: metadata (~1.5 h)
| Item | Files | Risk | Verify | Decide |
|---|---|---|---|---|
| 3.1 Magazine og/twitter/theme-color/apple-touch-icon; unify title pattern (B2) | `magazine.html:3-10` | Low | view-source; a card validator after deploy | no |
| 3.2 Canonicals, og:image alt/width/height, twitter:image (B3) | `index.html`, `work.html` | Low | view-source | no |
| 3.3 robots.txt, sitemap.xml (3 URLs) (B3) | repo root | Low | fetch after deploy | no |

### Phase 4: mobile polish (~3 h incl. re-measure)
| Item | Files | Risk | Verify | Decide |
|---|---|---|---|---|
| 4.1 `min-width:44px` on `.reader-controls .btn`; disabled opacity about .5 (C1) | `magazine.css:11-12` | Low | Playwright: bounding boxes at 390 and 360 | no |
| 4.2 44px height for PDF link; fix back-label wrap (C2) | `magazine.css:8`, `magazine.html:16` | Low | measure at 390 | no |
| 4.3 Raise status/step text to 12-13px (C3) | `signal.css:50,69,127`, `artwork.css:49,59` | Med: may shift layout | screenshots 390, 360, 1440 | no |
| 4.4 Fix 20px link (C4), map/bar spacing (C5) | `signal.css:61,86,67-69,92` | Low | measure | no |
| 4.5 Work hero tighter; Garment study as text link (C7), and fix check D1 | `work.html`, `artwork.css`, `dev/artwork-checks.mjs:334` | Med: layout | artwork-checks 72/72; screenshot 390x844 | E on hero look |
| 4.6 Particle wordmark mask or opacity behind hero text (C6) | `signal.js:146`, `signal.css` | Med: it is the signature effect | screenshots; E's eye test | **E decides** |

### Phase 5: optional performance and infrastructure (~2 h)
- 5.1 Header wordmark derivative about 540px (original untouched). Files: new asset, `index.html:27`, `work.html:28`, `magazine.html:14`. Risk: low, but identity assets are immutable, so keep the original for the footer. Decision: E/H must approve a derivative.
- 5.2 Fix or drop `strain-lg` preload (`work.html:20`). Verify by checking the Network panel at 390.
- 5.3 `serve.mjs` applies `vercel.json` redirects plus one check (D2), or confirm on a Vercel preview.
- 5.4 Per-piece share metadata (B4): only if sharing individual pieces matters. Needs an edge function or static pages; about 1 day; skip by default.

## 5. Open questions

1. Is "Drop 001" a confirmed release? If so, what may be said publicly? (README:107 says no.)
2. Is "carrier" an intended brand term? If so, define it on the page; otherwise replace it.
3. What is the real data-use policy, sender address and removal route for signups?
4. Is there a confirmed access policy tied to the number? Until then it stays "arrival only".
5. Is a particle wordmark behind hero text an intended signature, or acceptable to mask?
6. Is an original EKSTAZ production track coming? That decides the Listen/Sound labels.
7. Unverified by me: pixel measurements in C1-C7, the sub-13px sizes, and D1/D2 (reported by the audits only).

## 6. Sources

- Lindgaard et al. (2006), Behaviour & Information Technology 25(2): https://www.tandfonline.com/doi/abs/10.1080/01449290500330448
- Reber, Schwarz & Winkielman (2004): https://pubmed.ncbi.nlm.nih.gov/15582859/
- Tractinsky, Katz & Ikar (2000): https://academic.oup.com/iwc/article-abstract/13/2/127/898608
- Aaker (1997): https://journals.sagepub.com/doi/10.1177/002224379703400304
- Kapferer prism, secondary summary (weak): https://howbrandsarebuilt.com/the-brand-identity-prism-and-how-it-works/
- Green & Brock (2000): https://pubmed.ncbi.nlm.nih.gov/11079236/
- Loewenstein (1994): https://www.cmu.edu/dietrich/sds/docs/loewenstein/PsychofCuriosity.pdf
- Fredrickson & Kahneman (1993): https://pubmed.ncbi.nlm.nih.gov/8355141/
- WCAG 2.2, SC 2.3.3: https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html
- Chrome autoplay policy: https://developer.chrome.com/blog/autoplay
- Brewer (1991): https://citedrive.com/en/discovery/the-social-self-on-being-the-same-and-different-at-the-same-time/
- Lynn (1991): https://ecommons.cornell.edu/entities/publication/167c0da3-fa55-44ad-be11-f258914ee9a3
- Freedman & Fraser (1966): https://pubmed.ncbi.nlm.nih.gov/5969145/
- Burger (1999), secondary host: https://cbsm.com/articles/32623-the-foot-in-the-door-compliance-procedure-a-multiple-process-analysis-and-review
- Rains (2013): https://pmc.ncbi.nlm.nih.gov/articles/PMC4675534/ (link not opened to confirm)
- Acquisti, John & Loewenstein (2013): https://chicagounbound.uchicago.edu/jls/vol42/iss2/1 (not read)
