export const meta = {
  name: 'ekstaz-audit-and-plan',
  description: 'Audit the EKSTAZ site across dimensions, verify findings, research branding/psychology literature, then write an amendment plan',
  phases: [
    { title: 'Audit', detail: 'one auditor per dimension' },
    { title: 'Verify', detail: 'skeptic per finding' },
    { title: 'Research', detail: 'branding and psychology literature' },
    { title: 'Synthesize', detail: 'compare site to literature, write plan' },
  ],
}

const CONTEXT = `Project: EKSTAZ brand site in /home/user/EKSTAZ (static HTML/CSS/JS on Vercel, api/join.js waitlist). Brand: Elton's art/garment/sound world; "a state of recognition made tangible"; near-black, crimson, Didone display + mono. Codex just revised the UI (guided journey on index.html, work.html, magazine.html, artwork viewer). Intended direction is in docs/SITE-DIRECTION.md, docs/verification.md, README.md, dev/README.md - read those first. READ-ONLY: do not edit, commit or push any site file. Local server and Playwright checks: see dev/README.md (use a unique port per agent if the server supports it; Playwright at /opt/node-tools/node_modules/playwright with Chromium at /opt/pw-browsers/chromium). Put any scratch files in /tmp/claude-0/ only. Be concrete: cite file:line, viewport, or URL for every claim.`

const FINDINGS = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          title: { type: 'string' },
          severity: { type: 'string', enum: ['high', 'medium', 'low'] },
          where: { type: 'string' },
          evidence: { type: 'string' },
          expected: { type: 'string' },
          suggestedFix: { type: 'string' },
        },
        required: ['title', 'severity', 'where', 'evidence', 'expected', 'suggestedFix'],
      },
    },
    strengths: { type: 'array', items: { type: 'string' } },
  },
  required: ['findings', 'strengths'],
}

const VERDICT = {
  type: 'object',
  properties: {
    real: { type: 'boolean' },
    reason: { type: 'string' },
    adjustedSeverity: { type: 'string', enum: ['high', 'medium', 'low'] },
  },
  required: ['real', 'reason'],
}

const DIMENSIONS = [
  { key: 'brand-direction', prompt: 'Audit brand/copy fidelity: compare every page against docs/SITE-DIRECTION.md rules (no invented claims, no scarcity/availability claims, identity assets unmodified, factual magazine context, number semantics consistent across pages, no "Dubai", signup framed as optional). Also check cross-page voice and terminology consistency.' },
  { key: 'visual-design', prompt: 'Audit visual design with real screenshots at 390x844, 768x1024 and 1440x900 for index, work, magazine, and the artwork viewer: hierarchy, type scale, spacing, contrast, crop/overflow, consistency between pages, whether the work is allowed to lead, and polish gaps.' },
  { key: 'mobile-a11y', prompt: 'Audit mobile usability and accessibility: touch targets, safe areas, horizontal scroll, focus order/visibility, dialog/viewer keyboard handling and focus trap, alt text, landmarks, heading order, ARIA, colour contrast (compute it), prefers-reduced-motion behaviour, no-JS fallback.' },
  { key: 'motion-audio-perf', prompt: 'Audit motion, sound and performance: canvas cost and pausing rules, drone autoplay handling and mute persistence, page transitions, image weights/formats/lazy-loading/dimensions, layout shift, request count, font loading, long tasks. Measure where feasible with Playwright.' },
  { key: 'functional', prompt: 'Audit function: run every check in dev/ (drive.mjs, journey-checks.mjs, artwork-checks.mjs, carrier-checks.mjs) and report real failures; click through all internal links and anchors, the waitlist flow incl. error/duplicate states, ?n= preview behaviour, vercel.json redirects, api/join.js validation and abuse resistance, console errors.' },
  { key: 'journey-conversion', prompt: 'Audit the visitor journey and conversion as a first-time visitor and as a returning one: does the path from encounter to reflection to optional signup make sense, where does momentum or clarity drop, are calls to action discoverable but not pushy, is the transition front door to work/magazine coherent, what is confusing or missing.' },
  { key: 'seo-share-trust', prompt: 'Audit discoverability and trust: titles, meta/OG/Twitter tags and og image validity, canonical, favicon/touch icons, robots/sitemap, structured data, social-share preview text, privacy/data-handling statement near the email form, legal/commercial claims, domain/redirect hygiene (apex vs www).' },
]

const RESEARCH = [
  { key: 'identity', q: 'Brand identity and meaning: Kapferer identity prism, Aaker brand personality, brand archetypes critiques, semiotics of luxury/art/streetwear brands, how art-led labels (e.g. Maison Margiela, Rick Owens, Acne Studios, Comme des Garcons, Off-White, Kanye/Yeezy) sustain mystique without explanation.' },
  { key: 'perception', q: 'Perception psychology of websites: processing fluency, aesthetic-usability effect, visual complexity and first-impression research (Lindgaard 50ms, Tractinsky), dark-mode/high-contrast legibility, typography and perceived credibility.' },
  { key: 'narrative-emotion', q: 'Narrative transportation, peak-end rule, awe and aesthetic emotion, curiosity gap (Loewenstein), and scroll-driven storytelling effectiveness; what research says about guiding without forcing a feeling.' },
  { key: 'sound-motion', q: 'Sound and motion in branding: sonic branding, ambient audio effects on dwell time and mood, autoplay audio backlash/UX evidence, motion and attention/cognitive load, vestibular/reduced-motion guidance (WCAG 2.2).' },
  { key: 'community-conversion', q: 'Belonging and conversion: self-determination theory, social identity and tribe/subculture branding, scarcity/exclusivity and drop culture evidence (and its ethical limits), waitlist/commitment-consistency psychology, reactance to pushy CTAs, micro-commitment, privacy-trust in email capture.' },
  { key: 'streetwear-commerce', q: 'Fashion/art e-commerce practice: pre-launch and drop landing pages, storytelling vs product clarity, trust signals for new labels, cross-border selling trust (shipping/returns/payment), mobile commerce benchmarks; evidence from industry and academic sources.' },
]

const RESEARCH_SCHEMA = {
  type: 'object',
  properties: {
    topic: { type: 'string' },
    sources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          citation: { type: 'string' },
          url: { type: 'string' },
          keyFinding: { type: 'string' },
          confidence: { type: 'string', enum: ['strong', 'moderate', 'weak'] },
          caveat: { type: 'string' },
        },
        required: ['citation', 'keyFinding', 'confidence'],
      },
    },
    principles: { type: 'array', items: { type: 'string' } },
    contested: { type: 'array', items: { type: 'string' } },
  },
  required: ['topic', 'sources', 'principles', 'contested'],
}

phase('Audit')
const audited = await pipeline(
  DIMENSIONS,
  d => agent(`${CONTEXT}\n\nYour dimension: ${d.key}. ${d.prompt}\nReturn real, specific findings only (no padding), plus genuine strengths worth preserving.`, { label: `audit:${d.key}`, phase: 'Audit', schema: FINDINGS }),
  (res, d) => {
    if (!res) return null
    const toCheck = res.findings
    log(`${d.key}: ${toCheck.length} findings, ${res.strengths.length} strengths`)
    return parallel(toCheck.map(f => () =>
      agent(`${CONTEXT}\n\nSkeptically verify this audit finding. Re-check the evidence yourself in the code or browser; default to real=false if you cannot reproduce or it contradicts docs/SITE-DIRECTION.md intent.\n\n${JSON.stringify(f)}`, { label: `verify:${d.key}`, phase: 'Verify', schema: VERDICT })
        .then(v => ({ ...f, dimension: d.key, verdict: v }))
    )).then(fs => ({ dimension: d.key, strengths: res.strengths, findings: fs.filter(Boolean) }))
  }
)

const research = await parallel(RESEARCH.map(r => () =>
  agent(`Research task (use WebSearch/WebFetch, and Firecrawl tools via ToolSearch if helpful). Topic area: ${r.q}\n\nFind 5-8 real, citable sources (peer-reviewed papers, books, reputable industry studies). Never invent a citation: include a URL you actually opened or saw in results, and mark confidence honestly. Note where findings are contested, replicated poorly, or weak (e.g. small samples). Extract principles applicable to a small art-led fashion/sound label's website.`, { label: `research:${r.key}`, phase: 'Research', schema: RESEARCH_SCHEMA })
))

const dims = audited.filter(Boolean)
const confirmed = dims.flatMap(d => d.findings.filter(f => f.verdict && f.verdict.real))
const rejected = dims.flatMap(d => d.findings.filter(f => f.verdict && !f.verdict.real))
log(`confirmed ${confirmed.length}, rejected ${rejected.length}, research topics ${research.filter(Boolean).length}/${RESEARCH.length}`)

phase('Synthesize')
const strengths = dims.flatMap(d => d.strengths)
const analysis = await agent(`${CONTEXT}\n\nYou are the synthesizer. Write the file /home/user/EKSTAZ/docs/AUDIT-AND-PLAN.md (create only this one file; do not touch anything else; do not commit).\n\nInputs (JSON):\nCONFIRMED FINDINGS: ${JSON.stringify(confirmed)}\nREJECTED (for transparency): ${JSON.stringify(rejected.map(r => ({ title: r.title, reason: r.verdict.reason })))}\nSTRENGTHS: ${JSON.stringify(strengths)}\nRESEARCH: ${JSON.stringify(research.filter(Boolean))}\n\nStructure: 1) Summary (what is working, top 5 issues) 2) Confirmed findings grouped by theme, severity-ranked, with file/line 3) Site vs literature comparison: for each research principle, how the site currently aligns or conflicts, with evidence strength and caveats (never overstate weak evidence; keep the brand's deliberate withholding of explanation as a valid strategy, and respect SITE-DIRECTION rules such as no scarcity claims) 4) Amendment plan: ordered phases, each item with files, effort (concrete units), risk, how to verify, and dependencies; mark which need Elton/Haris decisions 5) Open questions 6) Source list with URLs and confidence. Keep each section tight. Then return a 10-line summary of the plan.`, { label: 'synthesize', phase: 'Synthesize' })

const critic = await agent(`${CONTEXT}\n\nCompleteness critic. Read /home/user/EKSTAZ/docs/AUDIT-AND-PLAN.md. List what is missing or overclaimed: unaudited areas, findings lacking evidence, plan items that contradict docs/SITE-DIRECTION.md, research claims stated more strongly than the sources support, citations without URLs. Return a short bullet list only; do not edit files.`, { label: 'critic', phase: 'Synthesize' })

return { summary: analysis, criticNotes: critic, counts: { confirmed: confirmed.length, rejected: rejected.length, research: research.filter(Boolean).length } }
