export const meta = {
  name: 'ekstaz-launch-research',
  description: 'Research the open business questions for selling EKSTAZ outside the UAE and write options and questions for a professional, with sources',
  whenToUse: 'When Haris wants to move on STATUS D9 (entity, payments, shipping, regulator, marks rights). Costs about 5 agents. Not legal advice.',
  phases: [{ title: 'Research', detail: 'one agent per topic' }, { title: 'Write', detail: 'one options document' }],
}

const CONTEXT = `Context: EKSTAZ is an art, sound and garment brand run by Haris and Elton. The plan is to run e-commerce outside the UAE; a London first run of about 25 pieces is only a hypothesis; drop details are undecided. This is research for the owners, not legal, tax or financial advice. Use WebSearch and WebFetch (or Firecrawl tools via ToolSearch). Only cite sources you actually opened, with URL and the date you saw them; mark confidence. Say plainly when you could not find something.`

const TOPICS = [
  ['entity', 'Legal entity and tax options for a UAE-based founder selling physical goods online to customers elsewhere (for example a UK company, a UAE free-zone company, other jurisdictions): setup cost, time, ongoing obligations, what a bank and payment provider will ask for.'],
  ['payments', 'Payment providers and storefront platforms that work for a small fashion label whose owners are UAE residents: availability by company country, fees, payout rules, chargeback and risk, and what each needs from the business.'],
  ['fulfilment', 'Making and shipping small runs: UK and EU print-on-demand and cut-and-sew options for embroidery and screen print, minimums, lead times, quality signals, returns, and duties and customs for shipping abroad.'],
  ['regulatory', 'Questions to put to a UAE adviser about selling goods to customers outside the UAE: trade or e-commerce licensing, social-media advertiser rules, and anything that changes if the sales entity is abroad. Frame the questions; do not answer them as law.'],
  ['marks', 'Rights to use third-party names, logos or imagery in apparel (parody, homage, licensing, trademark risk) and what evidence a small brand should keep; plus how to check and register EKSTAZ itself as a mark. Frame questions for a trademark attorney.'],
]

const SCHEMA = {
  type: 'object',
  properties: {
    options: { type: 'array', items: { type: 'object', properties: {
      name: { type: 'string' }, summary: { type: 'string' }, costs: { type: 'string' }, risks: { type: 'string' }, blocks: { type: 'string' } },
      required: ['name', 'summary', 'risks'] } },
    sources: { type: 'array', items: { type: 'object', properties: {
      citation: { type: 'string' }, url: { type: 'string' }, confidence: { type: 'string', enum: ['strong', 'moderate', 'weak'] } },
      required: ['citation', 'confidence'] } },
    questionsForProfessional: { type: 'array', items: { type: 'string' } },
    gaps: { type: 'array', items: { type: 'string' } },
  },
  required: ['options', 'sources', 'questionsForProfessional', 'gaps'],
}

phase('Research')
const research = await parallel(TOPICS.map(([key, q]) => () =>
  agent(`${CONTEXT}\n\nTopic: ${key}. ${q}\nGive 2 to 4 options with trade-offs, recommendation first, and the best three questions to ask a professional.`, { label: `research:${key}`, phase: 'Research', schema: SCHEMA }).then(r => r && { topic: key, ...r })))

const done = research.filter(Boolean)
log(`${done.length}/${TOPICS.length} topics returned`)

phase('Write')
return await agent(`${CONTEXT}\n\nWrite /home/user/EKSTAZ/docs/LAUNCH-OPTIONS.md (only this file; do not commit). Sections: 1) What is decided versus assumed 2) Per topic: options table, recommendation, confidence, sources with URLs 3) A combined path that fits together (entity, payments, fulfilment) and what the site would need to show (shipping and returns copy, privacy policy, payment badges), noting that nothing may be stated on the site until Haris confirms 4) The questions to bring to a lawyer or adviser, grouped by professional 5) Gaps and what was not verified. Never present research as a decision. Do not state prices, dates or availability for the drop. Return a 6-line summary.\n\n${JSON.stringify(done)}`, { label: 'write', phase: 'Write' })
