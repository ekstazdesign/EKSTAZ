// Browser checks for the guided homepage: encounter, reflect, explore and optional updates.
// Requests to the signup endpoint are intercepted; no waitlist service is contacted.
// Usage: node dev/journey-checks.mjs [localBaseUrl] [outDir]
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
if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname)) throw new Error('Journey checks require a local server.');
const out = process.argv[3] || '/tmp/ekstaz-journey-shots';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const ids = ['begin', 'encounter', 'reflection', 'form', 'expression', 'carry'];
const errors = [];
let checked = 0, failed = 0;
function check(name, ok, extra = '') {
  checked++;
  if (!ok) failed++;
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${extra ? ` (${extra})` : ''}`);
}
async function scenario(name, options, run) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  page.on('pageerror', error => errors.push(`${name}: ${error.message}`));
  const joins = [];
  await context.route('**/api/join', route => {
    joins.push({ method: route.request().method(), body: route.request().postData() });
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ number: 73, existing: false }) });
  });
  try { await run(page, context, joins); }
  catch (error) {
    check(`${name}: completes`, false, error.message.split('\n')[0]);
    await page.screenshot({ path: `${out}/failure-${name.replace(/[^a-z0-9]/gi, '-')}.png` }).catch(() => {});
  }
  finally { await context.close(); }
}
async function goto(page, path = '/') { await page.goto(base + path, { waitUntil: 'load' }); }
async function settled(page) {
  await page.evaluate(async () => {
    await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 2500))]);
    const finite = document.getAnimations().filter(animation => animation.effect.getComputedTiming().iterations !== Infinity);
    await Promise.all(finite.map(animation => animation.finished.catch(() => {})));
  });
}
function heading(page, id) { return page.locator(`#${id} h1, #${id} h2`).first(); }
async function headingVisible(page, id) {
  await page.waitForFunction(stage => {
    const heading = document.querySelector(`#${stage} h1, #${stage} h2`);
    if (!heading) return false;
    const box = heading.getBoundingClientRect();
    const bar = document.querySelector('.s-bar')?.getBoundingClientRect();
    return box.top >= (bar?.bottom || 0) - 2 && box.top < innerHeight && box.bottom <= innerHeight + 1;
  }, id);
}
async function atStep(page, index) {
  await page.waitForFunction(step => {
    const position = document.getElementById('journey-position');
    return position && Number(position.textContent.match(/\d+/)?.[0]) === step;
  }, index + 1);
}
async function anchorTo(page, id) {
  await page.locator(`a[href="#${id}"]`).first().click();
  await page.waitForURL(`**/#${id}`);
  await headingVisible(page, id);
  await atStep(page, ids.indexOf(id));
}
const fieldFrame = page => page.locator('#field').evaluate(canvas => canvas.toDataURL());
const storage = page => page.evaluate(() => ({ local: Object.fromEntries(Object.entries(localStorage)), session: Object.fromEntries(Object.entries(sessionStorage)) }));
async function loadAllImages(page) {
  await page.locator('.state img').evaluateAll(async images => {
    await Promise.all(images.map(image => {
      if (image.complete) return Promise.resolve();
      image.loading = 'eager';
      return new Promise(resolve => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', resolve, { once: true }); });
    }));
  });
  return page.locator('.state img').evaluateAll(images => images.length > 0 && images.every(image => image.naturalWidth > 0));
}

await scenario('guided navigation', {}, async (page, context, joins) => {
  await goto(page);
  await settled(page);
  check('journey: six chapters follow the intended order', JSON.stringify(await page.locator('.state[data-state]').evaluateAll(sections => sections.map(section => section.id))) === JSON.stringify(ids));
  check('journey: arrival explains the creative practice', await heading(page, 'begin').count() === 1 && /art|drawings?|clothing|garments?|sound|music|design/i.test(await page.locator('#begin').innerText()));
  check('journey: progress is visible and starts at the first chapter', await page.locator('#journey-progress').isVisible());
  await atStep(page, 0);
  await page.evaluate(() => { window.__journeyVisit = 'same-document'; });
  const before = await storage(page);
  for (let index = 0; index < ids.length - 1; index++) {
    const from = ids[index], to = ids[index + 1];
    const stops = await page.locator(`#${from} [data-journey-stop]`).evaluateAll(figures => figures.map(figure => figure.id));
    const seenStops = new Set();
    while (true) {
      const target = new URL(await page.locator('#journey-next').getAttribute('href'), page.url()).hash.slice(1);
      if (!stops.includes(target) || seenStops.has(target)) break;
      await page.locator('#journey-next').click();
      await page.waitForURL(`**/#${target}`);
      await page.waitForFunction(stop => {
        const art = document.getElementById(stop).getBoundingClientRect();
        const bar = document.querySelector('.s-bar').getBoundingClientRect();
        const footer = document.getElementById('journey-progress').getBoundingClientRect();
        return art.top >= bar.bottom && art.bottom <= footer.top + 1;
      }, target);
      await page.waitForFunction(stop => document.getElementById('journey-next').hash !== '#' + stop, target);
      seenStops.add(target);
      check(`journey: guidance shows ${target} before the next chapter`, true);
    }
    const next = page.locator(`#${from} .j-next`).first();
    check(`journey ${from}: next link names the actual next chapter`, new URL(await next.getAttribute('href'), page.url()).hash === '#' + to);
    await next.click();
    await page.waitForURL(`**/#${to}`);
    await headingVisible(page, to);
    await atStep(page, index + 1);
    check(`journey ${to}: real anchor reveals its heading and position`, await page.evaluate(() => window.__journeyVisit === 'same-document'));
  }
  check('journey: reflection collects no answers', await page.locator('#reflection input, #reflection textarea, #reflection select, #reflection form').count() === 0);
  check('journey: browsing/reflection saves no visitor responses', JSON.stringify(await storage(page)) === JSON.stringify(before));
  check('journey: all chapters can be encountered without signup', joins.length === 0 && await page.locator('#card').evaluate(card => !card.open));
  await page.goBack();
  await page.waitForURL('**/#expression');
  await atStep(page, 4);
  check('journey: Back restores the previous chapter and progress', new URL(page.url()).hash === '#expression');
  await page.goForward();
  await page.waitForURL('**/#carry');
  await atStep(page, 5);
  check('journey: Forward restores the updates chapter and progress', new URL(page.url()).hash === '#carry');
  await page.locator('#reflection').evaluate(section => section.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await atStep(page, 2);
  check('journey: natural scrolling updates progress independently of the URL', new URL(page.url()).hash === '#carry');
  check('journey: progress offers the correct next chapter', new URL(await page.locator('#journey-next').getAttribute('href'), page.url()).hash === '#form');
});

await scenario('direct access to work', {}, async page => {
  await goto(page);
  const link = page.locator('.s-nav a[href="work.html"]');
  check('journey: the work is available immediately', await link.isVisible());
  await link.click();
  await page.waitForURL('**/work.html');
  check('journey: opening work has no registration gate', await page.locator('.gallery .g-item').count() > 0);
});

await scenario('work connections', {}, async page => {
  for (const [section, slug] of [['encounter', 'pain'], ['form', 'cross'], ['form', 'hoodie-study']]) {
    await goto(page, '/#' + section);
    const link = page.locator(`#${section} a[href="work.html?art=${slug}"]`).first();
    await link.click();
    await page.waitForURL(`**/work.html?art=${slug}`);
    await page.waitForFunction(() => document.getElementById('viewer')?.open && document.getElementById('art-image')?.naturalWidth > 0);
    check(`journey: ${section} links into ${slug}'s original artwork`, new URL(page.url()).searchParams.get('art') === slug && await page.locator('#art-title').innerText() !== 'The work');
  }
});

await scenario('optional release updates', {}, async (page, context, joins) => {
  await goto(page);
  await anchorTo(page, 'carry');
  const button = page.locator('#join button[type="submit"]');
  check('updates: signup names release updates explicitly', /get release updates/i.test(await button.innerText()));
  check('updates: signup becomes available after its handler loads', await button.isEnabled());
  await page.locator('#email').fill('journey-check@example.com');
  check('updates: entering an email does not send it', joins.length === 0);
  check('updates: consent box starts unticked', !(await page.locator('#join input[name="consent"]').isChecked()));
  await page.locator('#join input[name="consent"]').check();
  await button.click();
  await page.waitForFunction(() => document.getElementById('card').open);
  const payload = JSON.parse(joins[0]?.body || '{}');
  check('updates: explicit signup sends only email, consent and the honeypot', joins.length === 1 && joins[0].method === 'POST' && payload.email === 'journey-check@example.com' && payload.consent === true && Object.keys(payload).every(key => ['email', 'consent', 'website'].includes(key)));
  check('updates: successful signup confirms the list and opens its numbered mark', /on the list/i.test(await page.locator('#join-status').innerText()) && /№073/.test(await page.locator('#card-note').innerText()));
});

for (const [name, width, height] of [['small-phone', 360, 740], ['phone', 390, 844], ['tablet', 768, 1024], ['desktop', 1440, 900]]) {
  await scenario(name, { viewport: { width, height }, isMobile: width < 768, hasTouch: width < 768 }, async page => {
    await goto(page);
    await settled(page);
    check(`${name}: every original image loads`, await loadAllImages(page));
    check(`${name}: journey has no horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    check(`${name}: primary controls have usable touch targets`, await page.locator('.s-bar a, .s-bar button, .j-next, #journey-next').evaluateAll(elements => elements.filter(element => !element.hidden && element.getBoundingClientRect().width > 0).every(element => {
      const box = element.getBoundingClientRect();
      return box.width >= 44 && box.height >= 44 && box.left >= 0 && box.right <= innerWidth + 1;
    })));
    await page.screenshot({ path: `${out}/${name}-begin.png` });
    for (const id of ['encounter', 'reflection', 'form', 'carry']) {
      await anchorTo(page, id);
      check(`${name} ${id}: heading clears the fixed header`, await heading(page, id).isVisible());
      await page.screenshot({ path: `${out}/${name}-${id}.png` });
    }
  });
}

for (const [chapter, stop] of [['encounter', 'encounter-art'], ['form', 'cross-study'], ['form', 'hoodie-study']]) {
  await scenario('short landscape ' + stop, { viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true }, async page => {
    await goto(page, '/#' + stop);
    await settled(page);
    await atStep(page, ids.indexOf(chapter));
    await page.waitForFunction(id => {
      const art = document.getElementById(id).getBoundingClientRect();
      const bar = document.querySelector('.s-bar').getBoundingClientRect();
      return art.top >= bar.bottom - 2 && art.top < innerHeight - document.getElementById('journey-progress').offsetHeight;
    }, stop);
    await page.waitForFunction(id => document.getElementById('journey-next').hash !== '#' + id, stop);
    const next = new URL(await page.locator('#journey-next').getAttribute('href'), page.url()).hash;
    check(`short landscape ${stop}: reached artwork does not repeat its own checkpoint`, next !== '#' + stop && next.length > 1);
    await page.screenshot({ path: `${out}/landscape-${stop}.png` });
    await page.locator('#journey-next').click();
    await page.waitForURL(`**/${next}`);
    check(`short landscape ${stop}: next link advances the journey`, new URL(page.url()).hash === next && new URL(page.url()).hash !== '#' + stop);
  });
}

await scenario('enlarged text', {}, async page => {
  await goto(page);
  // Approximate 200% text-only zoom without scaling images, controls or the viewport.
  await page.locator('body *').evaluateAll(elements => {
    const sizes = elements.map(element => parseFloat(getComputedStyle(element).fontSize));
    elements.forEach((element, index) => { element.style.fontSize = sizes[index] * 2 + 'px'; });
    dispatchEvent(new Event('resize'));
  });
  await page.waitForTimeout(200);
  check('200% text: content does not overflow horizontally', await page.locator('main h1, main h2, main p, main figure, .s-bar, #journey-progress').evaluateAll(elements => elements.every(element => {
    const box = element.getBoundingClientRect();
    return box.left >= 0 && box.right <= innerWidth + 1 && element.scrollWidth <= element.clientWidth + 2;
  })));
  check('200% text: chapters grow without overlapping', await page.locator('.state').evaluateAll(sections => sections.every((section, index) => !index || sections[index - 1].getBoundingClientRect().bottom <= section.getBoundingClientRect().top + 1)));
  await page.locator('#reflection').evaluate(section => section.scrollIntoView({ block: 'start', behavior: 'instant' }));
  await atStep(page, 2);
  const position = await page.evaluate(() => window.__ekstazSignal.progress());
  check('200% text: renderer follows actual chapter positions', Math.abs(position - 2) < .2, `progress ${position.toFixed(2)}`);
  await page.screenshot({ path: `${out}/phone-text-200.png` });
});

await scenario('reduced motion', { reducedMotion: 'reduce' }, async page => {
  await goto(page);
  await page.waitForFunction(() => {
    const canvas = document.getElementById('field');
    return canvas?.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data.some((value, index) => index % 4 === 0 && value > 120);
  });
  await anchorTo(page, 'reflection');
  await page.waitForTimeout(120);
  const reflection = await fieldFrame(page);
  await page.waitForTimeout(160);
  check('reduced motion: reflection background remains still', reflection === await fieldFrame(page));
  await anchorTo(page, 'expression');
  await page.waitForTimeout(120);
  const expression = await fieldFrame(page);
  await page.waitForTimeout(160);
  check('reduced motion: expression background remains still', expression === await fieldFrame(page));
  check('reduced motion: actual chapter anchors still change physical states', expression !== reflection);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(180);
  const moving = await fieldFrame(page);
  await page.waitForTimeout(180);
  check('motion preference: normal background animation resumes', moving !== await fieldFrame(page));
});

await scenario('JavaScript disabled', { javaScriptEnabled: false }, async (page, context, joins) => {
  await goto(page);
  check('no JavaScript: all six chapters have readable headings', await page.locator('.state').evaluateAll(sections => sections.length === 6 && sections.every(section => {
    const heading = section.querySelector('h1, h2');
    return heading?.textContent.trim() && getComputedStyle(heading).visibility === 'visible' && getComputedStyle(heading).display !== 'none' && Number(getComputedStyle(heading).opacity) > 0;
  })));
  check('no JavaScript: navigation remains ordinary links', await page.locator('.j-next, .j-map a').evaluateAll(links => links.length >= 5 && links.every(link => link.tagName === 'A' && /^#\w/.test(link.getAttribute('href') || ''))));
  check('no JavaScript: progress enhancement stays hidden', await page.locator('#journey-progress').isHidden());
  check('no JavaScript: signup is disabled with a useful explanation', await page.locator('#join button[type="submit"]').isDisabled() && /JavaScript/i.test(await page.locator('noscript').innerText()));
  check('no JavaScript: signup uses POST instead of exposing email in a query', (await page.locator('#join').getAttribute('method'))?.toLowerCase() === 'post');
  await page.locator('#email').fill('no-script-check@example.com');
  await page.locator('#email').press('Enter');
  check('no JavaScript: Enter cannot send signup or expose an email', joins.length === 0 && !page.url().includes('no-script-check'));
  const next = page.locator('#begin .j-next').first();
  await next.evaluate(link => link.scrollIntoView({ block: 'center', behavior: 'instant' }));
  const box = await next.boundingBox();
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForURL('**/#encounter');
  check('no JavaScript: the first real anchor still reaches the artwork chapter', new URL(page.url()).hash === '#encounter');
  await page.screenshot({ path: `${out}/phone-no-js.png` });
});

check('all guided journeys run without uncaught JavaScript errors', errors.length === 0, errors.join(' | '));
await browser.close();
console.log(`${checked - failed}/${checked} checks passed; screenshots in ${out}`);
process.exit(failed ? 1 : 0);
