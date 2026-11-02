export const meta = {
  name: 'ekstaz-audit-lean',
  description: 'Lean EKSTAZ site audit (4 auditors), brief literature research (3 agents), and one plan document',
  phases: [
    { title: 'Audit', detail: '4 auditors' },
    { title: 'Research', detail: '3 literature agents' },
    { title: 'Write', detail: 'one plan document' },
  ],
}

const CONTEXT = `Project: EKSTAZ brand site in /home/user/EKSTAZ (static HTML/CSS/JS on Vercel, api/join.js waitlist). Brand: art/garment/sound world, "a state of recognition made tangible"; near-black, crimson, Didone display + mono. Codex just revised the UI. Intended direction: docs/SITE-DIRECTION.md (read it first; also dev/README.md for the local server and checks). READ-ONLY: edit nothing in the repo. Scratch files only in /tmp/claude-0/. Playwright: /opt/node-tools/node_modules/playwright, Chromium /opt/pw-browsers/chromium. Be economical: read only what you need, keep output tight. Cite file:line or viewport for every claim. Only report real, evidenced issues, max 8 per dimension, plus up to 3 strengths.`

const FINDINGS = {
  type: 'object',
  properties: {
    findings: { type: 'array', items: { type: 'object', properties: {
      title: { type: 'string' }, severity: { type: 'string', enum: ['high', 'medium', 'low'] },
      where: { type: 'string' }, evidence: { type: 'string' }, suggestedFix: { type: 'string' } },
      required: ['title', 'severity', 'where', 'evidence', 'suggestedFix'] } },
    strengths: { type: 'array', items: { type: 'string' } },
  },
  required: ['findings', 'strengths'],
}

const DIMS = [
  ['design-mobile', 'Visual design, hierarchy, spacing, contrast and mobile/accessibility basics. Take screenshots at 390x844 and 1440x900 of index, work, magazine and the artwork viewer; check overflow, touch targets, focus visibility, alt text, reduced-motion.'],
  ['brand-copy', 'Fidelity to docs/SITE-DIRECTION.md: invented claims, scarcity/availability language, modified identity assets, number semantics consistency, optional-signup framing, cross-page voice, any leftover "Dubai".'],
  ['function', 'Run the checks in dev/ (journey-checks.mjs, artwork-checks.mjs, carrier-checks.mjs, drive.mjs) and report real failures; test internal links/anchors, waitlist success/error/duplicate states, console errors, vercel.json redirects.'],
  ['journey-seo', 'First-time visitor journey and conversion clarity, front door to work/magazine coherence, plus titles/meta/OG tags and image validity, privacy note near email form, image weights and obvious performance issues.'],
]

const RES = [
  ['identity-perception', 'Brand identity and mystique (Kapferer prism, Aaker personality, art-led fashion labels) plus website perception research (processing fluency, aesthetic-usability, Lindgaard first impressions).'],
  ['emotion-sound', 'Narrative transportation, awe/curiosity (Loewenstein), peak-end rule, scroll storytelling, and sound/motion in branding including autoplay-audio UX evidence and reduced-motion guidance.'],
  ['belonging-conversion', 'Belonging and subculture branding, scarcity/drop-culture evidence and its ethical limits, waitlist/commitment psychology, reactance to pushy CTAs, email-capture privacy trust, trust signals for new cross-border fashion labels.'],
]

const RSCHEMA = { type: 'object', properties: {
  sources: { type: 'array', items: { type: 'object', properties: {
    citation: { type: 'string' }, url: { type: 'string' }, keyFinding: { type: 'string' },
    confidence: { type: 'string', enum: ['strong', 'moderate', 'weak'] } },
    required: ['citation', 'keyFinding', 'confidence'] } },
  principles: { type: 'array', items: { type: 'string' } },
}, required: ['sources', 'principles'] }

phase('Audit')
const [audits, research] = await Promise.all([
  parallel(DIMS.map(([k, p]) => () => agent(`${CONTEXT}\n\nDimension: ${k}. ${p}`, { label: `audit:${k}`, phase: 'Audit', schema: FINDINGS }).then(r => r && { dimension: k, ...r }))),
  parallel(RES.map(([k, q]) => () => agent(`Research (WebSearch/WebFetch). ${q}\nFind 4-6 real citable sources; never invent a citation, include a URL you saw, mark confidence honestly, note weak or contested evidence. Keep it tight.`, { label: `research:${k}`, phase: 'Research', schema: RSCHEMA }))),
])

const a = audits.filter(Boolean), r = research.filter(Boolean)
log(`audits ${a.length}/4, research ${r.length}/3, findings ${a.reduce((n, d) => n + d.findings.length, 0)}`)

phase('Write')
const summary = await agent(`${CONTEXT}\n\nWrite /home/user/EKSTAZ/docs/AUDIT-AND-PLAN.md (only this file; do not commit). Spot-check the 5 highest-severity findings yourself and drop any you cannot reproduce.\nAUDITS: ${JSON.stringify(a)}\nRESEARCH: ${JSON.stringify(r)}\nSections: 1) Summary: what works, top 5 issues 2) Findings by theme, severity-ranked with file/line 3) Site vs literature: per principle, how the site aligns or conflicts, with evidence strength; never overstate weak evidence; keep the brand's deliberate withholding of explanation as valid; respect SITE-DIRECTION (no scarcity claims) 4) Amendment plan: ordered phases, each item with files, effort in concrete units, risk, how to verify, and whether Elton/Harris must decide 5) Open questions 6) Sources with URLs. Tight prose. Return a 8-line summary.`, { label: 'write', phase: 'Write' })

return summary
