// Browser checks for keeping and returning to a carrier's signal.
// Signup responses are intercepted in the browser; no waitlist service is contacted.
// Usage: node dev/carrier-checks.mjs [localBaseUrl] [outDir]
import { createRequire } from 'node:module';
import fs from 'node:fs';
const require = createRequire(import.meta.url);
function loadPlaywright() {
  for (const id of [process.env.PLAYWRIGHT_MODULE, 'playwright', '/opt/node-tools/node_modules/playwright'].filter(Boolean)) {
    try { return require(id); } catch {}
  }
  throw new Error('Playwright not found. Install playwright or set PLAYWRIGHT_MODULE.');
}
const { chromium } = loadPlaywright();
const executablePath = process.env.CHROMIUM || (fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);
const base = process.argv[2] || 'http://localhost:8080';
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname)) throw new Error('Carrier checks require a local server.');
const out = process.argv[3] || '/tmp/ekstaz-carrier-shots';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const errors = [];
let checked = 0, failed = 0;
function check(name, ok, extra = '') {
  checked++;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ` (${extra})` : ''}`);
}
async function scenario(name, run, options = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
  const page = await context.newPage();
  page.on('pageerror', error => {
    errors.push(`${name}: ${error.name}: ${error.message}`);
  });
  // Unexpected requests cannot consume production numbers even if a link changes.
  await page.route('**/api/join', route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'No signup response was configured for this check.' }) }));
  try { await run(page, context); }
  catch (error) { check(`${name}: completes`, false, error.message.split('\n')[0]); }
  finally { await context.close(); }
}
async function goto(page, path = '/') { await page.goto(base + path, { waitUntil: 'load' }); }
async function openCard(page) { await page.waitForFunction(() => document.getElementById('card')?.open); }
const storedNumber = page => page.evaluate(() => localStorage.getItem('ekstaz-carrier-number'));
const frame = page => page.locator('#field').evaluate(canvas => canvas.toDataURL());
async function signupResponse(page, data) {
  await page.route('**/api/join', route => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) }));
}
async function submit(page, email = 'carrier-check@example.com') {
  await page.locator('#email').fill(email);
  await page.locator('#join input[name="consent"]').check();
  await page.locator('#join button').click();
}

await scenario('signup recovery', async page => {
  await signupResponse(page, { number: 41, existing: false });
  await goto(page);
  check('carrier: first visitor has no return link', await page.locator('#return-mark').isHidden());
  await submit(page);
  await openCard(page);
  check('carrier: signup remembers its real returned number', await storedNumber(page) === '41');
  check('carrier: signup exposes a return link to the same mark', await page.locator('#return-mark').getAttribute('href') === '/?n=41');
  const storage = await page.evaluate(() => Object.fromEntries(Object.entries(localStorage)));
  check('carrier: browser storage contains no signup email', !JSON.stringify(storage).includes('carrier-check@example.com'));
  const download = await Promise.all([page.waitForEvent('download'), page.locator('#save').click()]);
  check('carrier: mark image remains downloadable', download[0].suggestedFilename() === 'ekstaz-signal-041.png');
  await page.locator('#close').click();
  await page.locator('.s-nav a[href="work.html"]').click();
  await page.waitForURL('**/work.html');
  check('carrier: work page restores the saved mark link', await page.locator('#return-mark').isVisible() && await page.locator('#return-mark').getAttribute('href') === '/?n=41');
  await page.locator('#return-mark').click();
  await page.waitForURL('**/?n=41');
  await openCard(page);
  check('carrier: return link reopens the saved mark', /№041/.test(await page.locator('#card-note').innerText()));
  await goto(page, '/?n=7');
  await openCard(page);
  check('carrier: a shared preview opens its own number', /№007/.test(await page.locator('#card-note').innerText()));
  check('carrier: a shared preview never overwrites the signup number', await storedNumber(page) === '41' && await page.locator('#return-mark').getAttribute('href') === '/?n=41');
  await goto(page, '/work.html');
  await signupResponse(page, { number: 42, existing: true });
  await submit(page, 'returning@example.com');
  await page.waitForFunction(() => /№042/.test(document.getElementById('join-status').textContent));
  check('carrier: successful work signup updates recovery', await storedNumber(page) === '42' && await page.locator('#return-mark').getAttribute('href') === '/?n=42');
  await signupResponse(page, { number: Number.MAX_SAFE_INTEGER + 1, existing: false });
  await submit(page);
  await page.waitForFunction(() => /could not be retrieved/.test(document.getElementById('join-status').textContent));
  check('carrier: unsafe API number cannot replace saved identity', await storedNumber(page) === '42');
});

await scenario('preview validation', async (page, context) => {
  await context.addInitScript(() => localStorage.setItem('ekstaz-carrier-number', '-1'));
  await goto(page, '/?n=7');
  await openCard(page);
  check('carrier: preview without signup does not create recovery', await storedNumber(page) === '-1' && await page.locator('#return-mark').isHidden());
  await goto(page, '/?n=9007199254740992');
  check('carrier: unsafe preview number leaves the page usable', await page.locator('#card').evaluate(card => !card.open));
});

await scenario('clipboard link', async (page, context) => {
  await context.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
    writeText(text) { window.__copiedMark = text; return Promise.resolve(); }
  } }));
  await goto(page, '/?n=7');
  await openCard(page);
  await page.locator('#copy-mark-link').click();
  await page.waitForFunction(() => Boolean(window.__copiedMark));
  const copied = new URL(await page.evaluate(() => window.__copiedMark));
  check('carrier: copied link opens the same mark', copied.origin === new URL(base).origin && copied.pathname === '/' && copied.search === '?n=7');
  check('carrier: copied-link feedback is announced', /copied/.test(await page.locator('#card-note').innerText()) && await page.locator('#card-note').getAttribute('role') === 'status');
});

await scenario('manual link', async (page, context) => {
  await context.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
    writeText() { return Promise.reject(new Error('Clipboard denied')); }
  } }));
  await goto(page, '/?n=7');
  await openCard(page);
  await page.locator('#copy-mark-link').click();
  const input = page.locator('#mark-link');
  await input.waitFor({ state: 'visible' });
  check('carrier: denied clipboard exposes a selectable mark URL', new URL(await input.inputValue()).search === '?n=7' && await input.evaluate(input => document.activeElement === input && input.selectionStart === 0 && input.selectionEnd === input.value.length));
  check('carrier: manual copying guidance is announced', /Select and copy/.test(await page.locator('#card-note').innerText()));
});

await scenario('native image sharing', async (page, context) => {
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: data => data.files?.length === 1 && data.files[0] instanceof File && data.files[0].size > 0 });
    Object.defineProperty(navigator, 'share', { configurable: true, value: data => {
      window.__sharedMark = { filename: data.files[0].name, type: data.files[0].type, active: navigator.userActivation.isActive };
      return window.__failShare ? Promise.reject(new DOMException('Permission denied', 'NotAllowedError')) : Promise.resolve();
    } });
  });
  await goto(page, '/?n=7');
  await openCard(page);
  await page.locator('#share').waitFor({ state: 'visible' });
  await page.locator('#share').click();
  await page.waitForFunction(() => Boolean(window.__sharedMark));
  const shared = await page.evaluate(() => window.__sharedMark);
  check('carrier: native sharing receives the prepared image', shared.filename === 'ekstaz-signal-007.png' && shared.type === 'image/png');
  check('carrier: native sharing retains click activation', shared.active);
  await page.evaluate(() => { window.__failShare = true; });
  await page.locator('#share').click();
  await page.waitForFunction(() => /Sharing could not open/.test(document.getElementById('card-note').textContent));
  check('carrier: share failure explains the save/link alternatives', /Save your image or copy/.test(await page.locator('#card-note').innerText()));
});

await scenario('unsupported image sharing', async (page, context) => {
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'canShare', { configurable: true, value: () => false });
    Object.defineProperty(navigator, 'share', { configurable: true, value: () => Promise.resolve() });
  });
  await goto(page, '/?n=7');
  await openCard(page);
  check('carrier: Share stays hidden when this image is unsupported', await page.locator('#share').isHidden());
});

await scenario('small phone recovery controls', async (page, context) => {
  await context.addInitScript(() => localStorage.setItem('ekstaz-carrier-number', '41'));
  for (const path of ['/', '/work.html']) {
    await goto(page, path);
    check(`small phone ${path}: recovered link has no horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    const controls = path === '/' ? '.s-bar a, .s-bar button' : '.bar a, .bar button';
    check(`small phone ${path}: top controls have 44px touch targets`, await page.locator(controls).evaluateAll(elements => elements.filter(element => !element.hidden && element.getBoundingClientRect().width > 0).every(element => {
      const box = element.getBoundingClientRect();
      return box.width >= 44 && box.height >= 44 && box.left >= 0 && box.right <= innerWidth + 1;
    })));
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${out}/${path === '/' ? 'signal' : 'work'}-return-360.png` });
  }
}, { viewport: { width: 360, height: 740 }, isMobile: true, hasTouch: true });

await scenario('reduced motion and card pause', async page => {
  await goto(page);
  await page.waitForFunction(() => {
    const canvas = document.getElementById('field'), data = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
    return data.some((value, index) => index % 4 === 0 && value > 120);
  });
  await page.locator('a[href="#reflection"]').first().click();
  await page.waitForTimeout(120);
  const sound = await frame(page);
  await page.waitForTimeout(180);
  check('reduced motion: waveform remains still between scrolls', sound === await frame(page));
  await page.locator('a[href="#expression"]').first().click();
  await page.waitForTimeout(120);
  const world = await frame(page);
  await page.waitForTimeout(180);
  check('reduced motion: carrier rings remain still between scrolls', world === await frame(page));
  check('reduced motion: scrolling still reveals the next physical state', world !== sound);
  await page.evaluate(() => document.documentElement.classList.add('leaving'));
  check('reduced motion: leaving fade is disabled', await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement, '::after');
    return style.animationName === 'none' && parseFloat(style.transitionDuration) === 0 && Number(style.opacity) === 0;
  }));
  await page.evaluate(() => document.documentElement.classList.remove('leaving'));
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(120);
  const moving = await frame(page);
  await page.waitForTimeout(180);
  check('motion preference: animation resumes when enabled', moving !== await frame(page));
  await signupResponse(page, { number: 41, existing: false });
  await submit(page);
  await openCard(page);
  const paused = await frame(page);
  await page.waitForTimeout(180);
  check('carrier: signal field rests while mark card is open', paused === await frame(page));
  await page.locator('#close').click();
  await page.waitForTimeout(100);
  check('carrier: signal field resumes after card closes', paused !== await frame(page));
}, { reducedMotion: 'reduce' });

check('all carrier journeys run without uncaught application JavaScript errors', errors.length === 0, errors.join(' | '));
await browser.close();
console.log(`${checked - failed}/${checked} checks passed; screenshots in ${out}`);
process.exit(failed ? 1 : 0);
