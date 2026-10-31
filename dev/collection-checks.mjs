// Collection preview checks: local only, no signup submissions.
// Usage: node dev/collection-checks.mjs [baseUrl] [outDir]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
function loadPlaywright() {
  for (const id of [process.env.PLAYWRIGHT_MODULE, 'playwright', '/opt/node-tools/node_modules/playwright', process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES && `${process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES}/playwright`].filter(Boolean)) {
    try { return require(id); } catch {}
  }
  throw new Error('Playwright not found. Set PLAYWRIGHT_MODULE to the installed package.');
}
const { chromium } = loadPlaywright();
const executablePath = process.env.CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const base = process.argv[2] || 'http://localhost:8080';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname)) throw new Error('Collection checks require a local server.');
const out = process.argv[3] || '/tmp/ekstaz-collection-shots';
fs.mkdirSync(out, { recursive: true });
let failed = 0, total = 0;
const check = (name, ok, extra = '') => { total++; if (!ok) failed++; console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${extra}`); };
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const errors = [], requests = [];
const pieces = ['hoodie', 'tee', 'cap'];
try {
  for (const width of [320, 390, 1440]) {
    for (const javaScriptEnabled of [true, false]) {
      const name = `${width}px ${javaScriptEnabled ? 'JS' : 'no-JS'}`;
      const context = await browser.newContext({ viewport: { width, height: width === 1440 ? 900 : 844 }, javaScriptEnabled, reducedMotion: 'reduce' });
      await context.route('**/api/join', async route => { requests.push(route.request().url()); await route.abort(); });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
      page.on('response', response => { if (new URL(response.url()).origin === new URL(base).origin && response.status() >= 400) errors.push(`${name}: ${response.status()} ${response.url()}`); });
      await page.goto(`${base}/collection.html`, { waitUntil: 'load' });
      check(`${name}: collection heading`, await page.locator('h1').innerText() === 'The Drive In');
      check(`${name}: no sideways scroll`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      check(`${name}: correct navigation`, await page.locator('.site-nav a').evaluateAll(links => JSON.stringify(links.map(link => [link.textContent.trim(), link.getAttribute('href')])) === JSON.stringify([['Collection','collection.html'],['Explore','work.html'],['About','collection.html#about'],['Updates','/#carry']])));
      for (const piece of pieces) {
        await page.locator(`.piece-nav a[href="collection.html?piece=${piece}#${piece}"]`).click();
        await page.waitForURL(`**/collection.html?piece=${piece}#${piece}`);
        await page.waitForFunction(id => { const rect = document.getElementById(id).getBoundingClientRect(); return rect.top >= 0 && rect.top < innerHeight / 2; }, piece);
        check(`${name}: ${piece} native deep link positions product`, await page.locator(`#${piece}`).isVisible());
        await page.locator(`#${piece} img`).scrollIntoViewIfNeeded();
        await page.waitForFunction(id => { const img = document.querySelector(`#${id} img`); return img.complete && img.naturalWidth > 0; }, piece);
        check(`${name}: ${piece} image loaded with descriptive alt`, (await page.locator(`#${piece} img`).getAttribute('alt')).length > 30);
        check(`${name}: ${piece} concept disclosed beside image`, /Concept (visualization|drawing), not a finished/.test(await page.locator(`#${piece} figcaption`).innerText()));
        check(`${name}: ${piece} preview and price honest`, /Not for sale/.test(await page.locator(`#${piece} .piece-status`).innerText()) && /confirmed/.test(await page.locator(`#${piece} .price-note`).innerText()));
        const summaries = page.locator(`#${piece} summary`);
        check(`${name}: ${piece} six product answers`, await summaries.count() === 6);
        for (let index = 0; index < 6; index++) {
          const summary = summaries.nth(index);
          await summary.focus();
          await page.keyboard.press('Enter');
          check(`${name}: ${piece} ${await summary.innerText()} opens with keyboard`, await summary.evaluate(element => element.parentElement.open));
          const text = await summary.locator('..').locator('p').innerText();
          check(`${name}: ${piece} answer is unconfirmed`, /being confirmed|not been confirmed|no confirmed release date/.test(text));
          await page.keyboard.press('Enter');
        }
        await page.locator(`#${piece}`).scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${out}/${width}-${javaScriptEnabled ? 'js' : 'no-js'}-${piece}.png` });
      }
      const visibleCopy = await page.locator('main').innerText();
      check(`${name}: no sales controls`, await page.locator('form, select, input, button:not(#sound), [href*="checkout"], [href*="cart"]').count() === 0);
      check(`${name}: no unsupported specs or scarcity`, !/330\s?gsm|260\s?gsm|only \d+|limited to|sold out|\b025\b|countdown/i.test(visibleCopy));
      check(`${name}: updates explained as not a reservation`, await page.locator('.updates-note').evaluateAll(notes => notes.length >= 3 && notes.every(note => /not a reservation|not a purchase or a reservation/.test(note.textContent))));
      check(`${name}: updates route remains existing signup`, await page.locator('.updates-link').evaluateAll(links => links.length === 4 && links.every(link => link.getAttribute('href') === '/#carry')));
      if (javaScriptEnabled) {
        await page.goto(`${base}/collection.html?piece=tee`, { waitUntil: 'load' });
        await page.waitForURL('**/collection.html?piece=tee#tee');
        check(`${name}: query-only product link enhances to native anchor`, true);
      } else {
        check(`${name}: inactive sound control hidden without JavaScript`, !(await page.locator('#sound').isVisible()));
      }
      await context.close();
    }
  }
  check('No signup submitted', requests.length === 0);
  check('No JS errors or failed local requests', errors.length === 0, errors.join(' | '));
} finally {
  await browser.close();
}
console.log(`${total - failed}/${total} passed; screenshots in ${out}`);
process.exit(failed ? 1 : 0);
