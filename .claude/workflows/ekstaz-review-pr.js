export const meta = {
  name: 'ekstaz-review-pr',
  description: 'Review an EKSTAZ change from four lenses (brand, motion and sound, structure and checks, assets) and return a merge or fix-first verdict',
  whenToUse: 'Before asking Haris to merge a larger change. Pass {base: "origin/main"} or a PR number in args.',
  phases: [{ title: 'Review', detail: 'four lenses in parallel' }, { title: 'Verdict', detail: 'one synthesis' }],
}

const BASE = (args && args.base) || 'origin/main'
const CONTEXT = `Project: EKSTAZ site in /home/user/EKSTAZ. Read CLAUDE.md first (brand rules, working rules, known failing check). Review the diff of the current branch against ${BASE} (git diff ${BASE}...HEAD). READ-ONLY: do not edit, commit or push. Scratch files only in the session scratchpad. Cite file:line. Report only real, evidenced issues, at most 8, ranked.`

const FINDINGS = {
  type: 'object',
  properties: {
    findings: { type: 'array', items: { type: 'object', properties: {
      title: { type: 'string' }, severity: { type: 'string', enum: ['blocker', 'major', 'minor'] },
      where: { type: 'string' }, evidence: { type: 'string' }, fix: { type: 'string' } },
      required: ['title', 'severity', 'where', 'evidence', 'fix'] } },
    notChecked: { type: 'array', items: { type: 'string' } },
  },
  required: ['findings', 'notChecked'],
}

const LENSES = [
  ['brand', 'Brand and copy: every user-facing string the diff adds or changes against BRAND.md and docs/SITE-DIRECTION.md. Invented facts, scarcity or hype, forbidden words (Dubai, UAE, The Myriad), signup honesty, cross-page consistency. Elton\'s wish for chaos supersedes tidy rules.'],
  ['motion-sound', 'Motion and sound: particle stages (at least 150 px high, 20 px gap before reading text), reduced motion is a composed still, sound on by default and mutable, ambient paused while an artwork is open, image-load fallbacks, per-frame cost.'],
  ['structure-checks', 'Structure and checks: run the five suites in dev/ against a local server (see CLAUDE.md Commands) and compare every failure with a clean origin/main worktree on another port. Header identical on every page, only signup is a filled red action, selectors the checks rely on still exist.'],
  ['assets', 'Assets: sizes and formats, -sm pairs with srcset, alt text, gallery wiring (unique data-art slugs), docs/ASSET-SOURCES.md updated, nothing recoloured or upscaled, no stray large files or screenshots committed.'],
]

phase('Review')
const reviews = await parallel(LENSES.map(([key, prompt]) => () =>
  agent(`${CONTEXT}\n\nLens: ${key}. ${prompt}`, { label: `review:${key}`, phase: 'Review', schema: FINDINGS }).then(r => r && { lens: key, ...r })))

const done = reviews.filter(Boolean)
log(`${done.length}/${LENSES.length} lenses returned, ${done.reduce((n, r) => n + r.findings.length, 0)} findings`)

phase('Verdict')
return await agent(`${CONTEXT}\n\nYou are the merge gate. From these lens reports, spot-check the two most severe findings yourself, drop any you cannot reproduce, and answer with: VERDICT (merge or fix first), then a ranked list of confirmed fixes (file, assertion), then what was not checked. Be brief.\n\n${JSON.stringify(done)}`, { label: 'verdict', phase: 'Verdict' })
