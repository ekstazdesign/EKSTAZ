// Drives the running site in headless Chromium: layout at phone + desktop widths, gallery viewer,
// waitlist form, magazine reader. Prints PASS/FAIL lines, saves screenshots, exits 1 on any FAIL.
// Usage: node dev/drive.mjs [baseUrl] [outDir]    (default http://localhost:8080 /tmp/ekstaz-shots)
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
// Playwright: $PLAYWRIGHT_MODULE, else `npm i playwright` in the cwd/parents, else the container's global copy.
function loadPlaywright() {
  for (const id of [process.env.PLAYWRIGHT_MODULE, 'playwright', '/opt/node-tools/node_modules/playwright'].filter(Boolean)) {
    try { return require(id); } catch {}
  }
  throw new Error('Playwright not found. Run `npm i playwright && npx playwright install chromium`, or set PLAYWRIGHT_MODULE.');
}
const { chromium } = loadPlaywright();
// Browser: $CHROMIUM, else the container's pre-installed one, else Playwright's own download.
const executablePath = process.env.CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const base = process.argv[2] || 'http://localhost:8080';
const out = process.argv[3] || '/tmp/ekstaz-shots';
fs.mkdirSync(out, { recursive: true });
let failed = 0;
const email = `smoke-${Date.now()}@example.com`; // unique per run: the server remembers emails
const check = (name, ok, extra = '') => { if (!ok) failed++; console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${extra}`); };

const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const errors = [];
async function open(name, viewport, mobile, url = '/work.html') {
  const page = await (await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile })).newPage();
  page.on('pageerror', e => errors.push(`${name}: ${e.message}`));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.g|ERR_(NAME|INTERNET|CONNECTION|TUNNEL|CERT)/.test(m.text())) errors.push(`${name}: ${m.text()}`); });
  await page.goto(base + url, { waitUntil: 'load' });
  return page;
}

for (const [name, vp, mobile] of [['phone', { width: 390, height: 844 }, true], ['small', { width: 360, height: 740 }, true], ['desktop', { width: 1440, height: 900 }, false]]) {
  const page = await open(name, vp, mobile);
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); });
  const sw = await page.evaluate(() => document.documentElement.scrollWidth);
  check(`${name}: no sideways scroll`, sw <= vp.width, `(scrollWidth ${sw})`);
  const broken = await page.evaluate(() => [...document.images].filter(i => i.getAttribute('src') && i.complete && !i.naturalWidth).map(i => i.src));
  check(`${name}: all images load`, broken.length === 0, broken.join(' '));
  await page.screenshot({ path: `${out}/${name}-top.png` });
  await page.screenshot({ path: `${out}/${name}-full.png`, fullPage: true });
  await page.context().close();
}

// gallery viewer
let page = await open('viewer', { width: 390, height: 844 }, true);
await page.locator('.g-item').first().scrollIntoViewIfNeeded();
await page.locator('.g-item').first().click();
check('gallery: tap opens full-size viewer', await page.evaluate(() => document.getElementById('viewer').open));
await page.waitForFunction(() => document.querySelector('#viewer img').naturalWidth > 0);
await page.screenshot({ path: `${out}/viewer-open.png` });
await page.locator('.viewer-close').click();
check('gallery: close button closes it', await page.evaluate(() => !document.getElementById('viewer').open));
await page.context().close();

// waitlist form (needs /api/join: serve.mjs provides it)
page = await open('form', { width: 390, height: 844 }, true);
const status = () => page.locator('#join-status').innerText();
await page.locator('#email').scrollIntoViewIfNeeded();
await page.fill('#email', 'not-an-email'); await page.click('#join button');
check('form: bad email is rejected client-side', /doesn.t look right/.test(await status()), await status());
await page.fill('#email', email); await page.click('#join button');
check('form: signup without consent is blocked', /Tick the box/.test(await status()), await status());
await page.check('#join input[name="consent"]'); await page.click('#join button');
await page.waitForFunction(() => /№\d+/.test(document.getElementById('join-status').textContent));
check('form: first signup gets a number', /You.re in/.test(await status()), await status());
await page.screenshot({ path: `${out}/form-success.png` });
await page.fill('#email', email); await page.check('#join input[name="consent"]'); await page.click('#join button');
await page.waitForFunction(() => /already/.test(document.getElementById('join-status').textContent));
check('form: repeat email says already on the list', true, await status());
await page.context().close();

// magazine reader
page = await open('magazine', { width: 390, height: 844 }, true, '/magazine.html');
await page.waitForFunction(() => !document.querySelector('.reader-controls').hidden);
await page.click('#next');
await page.waitForFunction(() => /Page 2 of 17/.test(document.getElementById('page-status').textContent));
check('magazine: next goes to page 2', /page=2/.test(page.url()), page.url());
await page.goto(base + '/magazine.html?page=17');
await page.waitForFunction(() => document.getElementById('next').disabled);
check('magazine: ?page=17 deep link, next disabled on last page', true);
await page.screenshot({ path: `${out}/magazine-p17.png` });
await page.context().close();

// front door (index.html): particle field, states scrub with scroll, signup -> personal mark
for (const [name, vp, mobile] of [['door-phone', { width: 390, height: 844 }, true], ['door-desktop', { width: 1440, height: 900 }, false]]) {
  const p = await open(name, vp, mobile, '/');
  await p.waitForTimeout(2600); // arrival static resolves into the wordmark
  const lit = await p.evaluate(() => { const c = document.getElementById('field'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] > 120) n++; return n; });
  check(`${name}: particle field is drawing`, lit > 200, `(${lit} lit samples)`);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  check(`${name}: no sideways scroll`, sw <= vp.width, `(scrollWidth ${sw})`);
  await p.screenshot({ path: `${out}/${name}-0.png` });
  await p.locator('a[href="#carry"]').first().click(); await p.waitForTimeout(1800);
  await p.screenshot({ path: `${out}/${name}-carry.png` });
  if (mobile) {
    await p.fill('#email', email.replace('smoke', 'door')); await p.check('#join input[name="consent"]'); await p.click('#join button');
    await p.waitForFunction(() => document.getElementById('card').open, null, { timeout: 8000 });
    check('door: signup opens the personal mark card', /on the list/i.test(await p.locator('#join-status').innerText()), await p.locator('#join-status').innerText());
    await p.waitForTimeout(400); await p.screenshot({ path: `${out}/door-mark.png` });
  }
  await p.context().close();
}
let mk = await open('mark', { width: 390, height: 844 }, true, '/?n=7');
await mk.waitForFunction(() => document.getElementById('card').open);
check('door: /?n=7 previews mark №007 without signing up', true);
await mk.context().close();

check('no JS errors / failed requests', errors.length === 0, errors.join(' | '));
await browser.close();
console.log(`screenshots in ${out}`);
process.exit(failed ? 1 : 0);

