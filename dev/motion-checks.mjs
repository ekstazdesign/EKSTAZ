// Visible-motion regression checks for the guided homepage and the work ticker.
// Measures the rendered canvas and the composited stage screenshot, so a field
// hidden by CSS or an overlay cannot pass merely because it still draws pixels.
// Usage: node dev/motion-checks.mjs [localBaseUrl] [outDir]
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
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname)) throw new Error('Motion checks require a local server.');
const out = process.argv[3] || '/tmp/ekstaz-motion-shots';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const ids = ['begin', 'encounter', 'reflection', 'form', 'expression', 'carry'];
const errors = [], joins = [];
let checked = 0, failed = 0;
function check(name, ok, detail = '') {
  checked++;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${detail ? ` (${detail})` : ''}`);
}
async function scenario(name, options, run) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
  await context.route('**/api/join', route => {
    joins.push(`${name}: ${route.request().method()}`);
    return route.abort();
  });
  try { await run(page, context); }
  catch (error) {
    check(`${name}: completes`, false, error.message.split('\n')[0]);
    await page.screenshot({ path: `${out}/failure-${name.replace(/[^a-z0-9]/gi, '-')}.png` }).catch(() => {});
  }
  finally { await context.close(); }
}
async function goto(page, path = '/') { await page.goto(base + path, { waitUntil: 'load' }); }
async function ready(page) {
  await page.waitForFunction(() => document.documentElement.classList.contains('signal-ready'));
  await page.evaluate(() => document.fonts.ready);
}
async function chapter(page, id) {
  await page.evaluate(id => {
    const element = document.getElementById(id);
    window.scrollTo({ top: element.getBoundingClientRect().top + scrollY, behavior: 'instant' });
  }, id);
  // Let the particle spring settle after jumping between real DOM chapters.
  await page.waitForTimeout(700);
}
// The same pixel measurement is used for both canvas crops and real screenshots.
// A lit pixel must have a channel above 100; dim remnants of the field do not count.
function analysePixels(data, width, height) {
  let lit = 0, peak = 0, brightness = 0, left = width, right = -1, top = height, bottom = -1;
  for (let i = 0; i < data.length; i += 4) {
    const level = Math.max(data[i], data[i + 1], data[i + 2]);
    peak = Math.max(peak, level);
    if (level <= 100) continue;
    const pixel = i / 4, x = pixel % width, y = Math.floor(pixel / width);
    lit++; brightness += level;
    left = Math.min(left, x); right = Math.max(right, x);
    top = Math.min(top, y); bottom = Math.max(bottom, y);
  }
  return { lit, peak, meanLit: lit ? brightness / lit : 0, spanX: lit ? right - left + 1 : 0,
    spanY: lit ? bottom - top + 1 : 0, width, height };
}
async function canvasStage(page, id) {
  return page.evaluate(({ id, source }) => {
    const analyse = eval(`(${source})`);
    const canvas = document.getElementById('field');
    const box = document.querySelector(`#${id} .j-visual`).getBoundingClientRect();
    const factor = canvas.width / innerWidth;
    const width = Math.floor(box.width * factor), height = Math.floor(box.height * factor);
    const data = canvas.getContext('2d').getImageData(Math.floor(box.left * factor), Math.floor(box.top * factor), width, height).data;
    return analyse(data, width, height);
  }, { id, source: analysePixels.toString() });
}
async function compositedStage(page, id, path) {
  const buffer = await page.locator(`#${id} .j-visual`).screenshot({ path });
  return page.evaluate(async ({ url, source }) => {
    const analyse = eval(`(${source})`);
    const image = new Image(); image.src = url; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
    const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
    return analyse(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height);
  }, { url: `data:image/png;base64,${buffer.toString('base64')}`, source: analysePixels.toString() });
}
const frame = page => page.locator('#field').evaluate(canvas => canvas.toDataURL());
async function readingSafety(page, from, name) {
  await page.evaluate(id => {
    const chapters = Array.from(document.querySelectorAll('.state[data-state]'));
    const chapter = chapters.findIndex(element => element.id === id);
    const top = chapters[chapter].getBoundingClientRect().top + scrollY;
    const end = chapters[chapter + 1].getBoundingClientRect().top + scrollY;
    scrollTo({ top: top + (end - top) * .85, behavior: 'instant' });
  }, from);
  await page.waitForTimeout(700);
  const boxes = await page.locator('.j-visual').evaluateAll(stages => stages.map(stage => {
    const box = stage.getBoundingClientRect();
    return { left: box.left, top: box.top, right: box.right, bottom: box.bottom };
  }));
  const visible = await page.screenshot({ path: `${out}/${name}-${from}-handover.png` });
  await page.locator('#field').evaluate(canvas => { canvas.style.opacity = '0'; });
  const hidden = await page.screenshot();
  await page.locator('#field').evaluate(canvas => { canvas.style.opacity = ''; });
  return page.evaluate(async ({ visible, hidden, boxes }) => {
    async function pixels(url) {
      const image = new Image(); image.src = url; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      const context = canvas.getContext('2d'); context.drawImage(image, 0, 0);
      return { data: context.getImageData(0, 0, canvas.width, canvas.height).data, width: canvas.width };
    }
    const on = await pixels(visible), off = await pixels(hidden);
    let changed = 0, peakDifference = 0;
    for (let i = 0; i < on.data.length; i += 4) {
      const x = i / 4 % on.width, y = Math.floor(i / 4 / on.width);
      // Two pixels allow ordinary rasterization at fractional CSS box boundaries.
      if (boxes.some(box => x >= box.left - 2 && x <= box.right + 2 && y >= box.top - 2 && y <= box.bottom + 2)) continue;
      const difference = Math.max(Math.abs(on.data[i] - off.data[i]), Math.abs(on.data[i + 1] - off.data[i + 1]), Math.abs(on.data[i + 2] - off.data[i + 2]));
      peakDifference = Math.max(peakDifference, difference);
      if (difference > 16) changed++;
    }
    return { changed, peakDifference };
  }, { visible: `data:image/png;base64,${visible.toString('base64')}`, hidden: `data:image/png;base64,${hidden.toString('base64')}`, boxes });
}
// Sound is on by default; it plays once the browser allows audio (usually the first gesture).
async function armedSilent(page) {
  return page.evaluate(() => document.getElementById('sound').getAttribute('aria-pressed') === 'true' &&
    localStorage.getItem('ekstaz-sound') !== 'off');
}
async function soundOnChoice(page) {
  return page.evaluate(() => document.getElementById('sound').getAttribute('aria-pressed') === 'true');
}

for (const [name, viewport] of [['phone', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 1000 }]]) {
  await scenario(name, { viewport }, async page => {
    await goto(page);
    await page.waitForFunction(() => document.documentElement.classList.contains('signal-ready'));
    const noise = await canvasStage(page, 'begin');
    await page.waitForTimeout(2400);
    await ready(page);
    const word = await canvasStage(page, 'begin');
    check(`${name}: arrival noise resolves into a broad, compact wordmark`,
      noise.spanY > word.spanY * 1.15 && word.spanX > word.width * .8 && word.spanX / word.spanY > 5,
      `noise ${noise.spanY}px high; wordmark ${word.spanX}×${word.spanY}px`);
    check(`${name}: sound is on by default`, await armedSilent(page));
    for (const id of ids) {
      await chapter(page, id);
      const layout = await page.locator(`#${id}`).evaluate(section => {
        const stage = section.querySelector('.j-visual').getBoundingClientRect();
        const reading = section.querySelector('.s-text').getBoundingClientRect();
        const bar = document.querySelector('.s-bar').getBoundingClientRect();
        const footer = document.getElementById('journey-progress').getBoundingClientRect();
        return { top: stage.top, bottom: stage.bottom, height: stage.height, readingTop: reading.top,
          headerBottom: bar.bottom, footerTop: footer.top, width: stage.width };
      });
      check(`${name} ${id}: the particle stage is visible between page controls`,
        layout.top >= layout.headerBottom && layout.bottom < layout.footerTop && layout.height >= 150);
      check(`${name} ${id}: animation and reading have separate space`, layout.readingTop >= layout.bottom + 20,
        `${Math.round(layout.readingTop - layout.bottom)}px gap`);
      const drawn = await canvasStage(page, id);
      const shown = await compositedStage(page, id, `${out}/${name}-${id}-stage.png`);
      // Pain retains its original dark crimson pixels; the other shapes use bright red/bone.
      const minimumMean = id === 'encounter' ? 110 : 120;
      check(`${name} ${id}: composited particles remain bright and numerous`,
        shown.peak >= 130 && shown.meanLit >= minimumMean && shown.lit > shown.width * shown.height * .002 &&
        shown.peak >= drawn.peak * .9 && shown.lit >= drawn.lit * .7,
        `${shown.lit} lit pixels; peak ${shown.peak}; mean ${Math.round(shown.meanLit)}; canvas peak ${drawn.peak}`);
      const broad = ['begin', 'reflection', 'expression'].includes(id);
      const minimumWidth = broad ? shown.width * .8 : shown.height * .45;
      check(`${name} ${id}: the shape spans its intended stage`, shown.spanX > minimumWidth && shown.spanY > 25,
        `${shown.spanX}×${shown.spanY}px across ${shown.width}×${shown.height}px stage`);
      if (['reflection', 'expression'].includes(id)) {
        const before = await frame(page);
        await page.waitForTimeout(500);
        check(`${name} ${id}: the waveform or carrier rings move with or without audio`,
          before !== await frame(page));
      }
      await page.screenshot({ path: `${out}/${name}-${id}.png` });
    }
    for (const from of ids.slice(0, -1)) {
      const safety = await readingSafety(page, from, name);
      check(`${name} ${from}: morphing particles stay out of reading space`, safety.changed <= 8,
        `${safety.changed} bright differing pixels outside visual stages`);
    }
    await chapter(page, 'begin');
    await page.evaluate(() => {
      const start = scrollY, destination = document.getElementById('encounter').offsetTop;
      window.__sawSmoothJourney = false;
      function observe() {
        if (scrollY > start + 10 && scrollY < destination - 10) window.__sawSmoothJourney = true;
        if (Math.abs(scrollY - destination) <= 2) removeEventListener('scroll', observe);
      }
      addEventListener('scroll', observe, { passive: true });
    });
    await page.locator('#journey-next').click();
    await page.waitForURL('**/#encounter');
    await page.waitForFunction(() => Math.abs(scrollY - document.getElementById('encounter').offsetTop) <= 2);
    check(`${name}: the ordinary Next link scrolls through intermediate animation positions`,
      await page.evaluate(() => window.__sawSmoothJourney));
    check(`${name}: motion creates no horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  });
}

await scenario('reduced motion', { reducedMotion: 'reduce' }, async page => {
  await goto(page); await ready(page);
  let previous = null;
  for (const id of ids) {
    await chapter(page, id);
    const still = await frame(page);
    const shown = await compositedStage(page, id, `${out}/reduced-${id}-stage.png`);
    await page.waitForTimeout(450);
    check(`reduced motion ${id}: a visible complete shape remains still`, still === await frame(page) && shown.peak >= 130 && shown.lit > 200);
    if (previous !== null) check(`reduced motion ${id}: the chapter changes the shape without requiring animation`, previous !== still);
    previous = still;
  }
  await chapter(page, 'reflection');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(700);
  const moving = await frame(page);
  await page.waitForTimeout(450);
  check('motion preference: changing the preference resumes the waveform', moving !== await frame(page));
  check('motion preference: changing motion leaves the sound choice alone', await soundOnChoice(page));
});

await scenario('no JavaScript', { javaScriptEnabled: false }, async page => {
  await goto(page);
  const stages = await page.locator('.j-visual').evaluateAll(elements => elements.map(element => element.getBoundingClientRect().height));
  check('no JavaScript: six particle stages collapse without leaving empty visual panels', stages.length === 6 && stages.every(height => height === 0));
  check('no JavaScript: the introduction and direct artwork path remain visible', await page.locator('#begin h1').isVisible() && await page.locator('a[href="work.html"]').first().isVisible());
  check('no JavaScript: email submission stays disabled', await page.locator('#join button[type="submit"]').isDisabled());
  await page.screenshot({ path: `${out}/no-js-arrival.png` });
});

for (const reduce of [false, true]) {
  await scenario(reduce ? 'work reduced motion' : 'work motion', { reducedMotion: reduce ? 'reduce' : 'no-preference' }, async page => {
    await goto(page, '/work.html');
    await page.locator('.ticker').scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    const track = page.locator('.ticker-track');
    const before = await track.evaluate(element => ({ transform: getComputedStyle(element).transform, animation: getComputedStyle(element).animationName }));
    await page.waitForTimeout(450);
    const after = await track.evaluate(element => ({ transform: getComputedStyle(element).transform, animation: getComputedStyle(element).animationName }));
    check(`work ${reduce ? 'reduced' : 'normal'}: the restored ticker ${reduce ? 'stays still' : 'moves'}`,
      reduce ? before.animation === 'none' && before.transform === after.transform : before.animation === 'tick' && before.transform !== after.transform);
    check(`work ${reduce ? 'reduced' : 'normal'}: ticker text and sound choice remain accessible`, await page.locator('.ticker').isVisible() && await soundOnChoice(page));
    await page.screenshot({ path: `${out}/work-${reduce ? 'reduced' : 'motion'}.png` });
  });
}

check('motion checks: no browser errors', errors.length === 0, errors.join('; '));
check('motion checks: no signup attempts', joins.length === 0, `${joins.length} attempts`);
await browser.close();
console.log(`${checked - failed}/${checked} checks passed; screenshots in ${out}`);
if (failed) process.exitCode = 1;
