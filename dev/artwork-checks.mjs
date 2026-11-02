// Browser checks for encountering, sharing and returning from individual artworks.
// Uses the local static server only; it never submits a waitlist signup.
// Usage: node dev/artwork-checks.mjs [baseUrl] [outDir]
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
const out = process.argv[3] || '/tmp/ekstaz-artwork-shots';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
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
  try { await run(page, context); }
  catch (error) {
    check(`${name}: completes`, false, error.message.split('\n')[0]);
    await page.screenshot({ path: `${out}/failure-${name.replace(/[^a-z0-9]/gi, '-')}.png` }).catch(() => {});
  }
  finally { await context.close(); }
}
async function goto(page, path = '/work.html') {
  await page.goto(base + path, { waitUntil: 'load' });
}
async function settleForScreenshot(page) {
  await page.evaluate(async () => {
    await Promise.race([document.fonts.ready, new Promise(resolve => setTimeout(resolve, 3000))]);
    const finite = document.getAnimations().filter(animation => animation.effect.getComputedTiming().iterations !== Infinity);
    await Promise.all(finite.map(animation => animation.finished.catch(() => {})));
  });
}
async function opened(page, slug) {
  await page.waitForFunction(() => document.getElementById('viewer')?.open);
  await page.waitForFunction(() => {
    const image = document.getElementById('art-image');
    return image && image.complete && image.naturalWidth > 0;
  });
  if (slug) await page.waitForFunction(s => new URL(location.href).searchParams.get('art') === s, slug);
}
async function closed(page) {
  await page.waitForFunction(() => !document.getElementById('viewer')?.open);
}
async function selectArtwork(page, slug = 'pain') {
  const link = page.locator(`.art-open[data-art="${slug}"]`);
  await link.scrollIntoViewIfNeeded();
  await link.click();
  await opened(page, slug);
  return link;
}
function artSlug(page) { return new URL(page.url()).searchParams.get('art'); }
const canvasFrame = page => page.locator('#field').evaluate(canvas => canvas.toDataURL());

await scenario('gallery history', {}, async page => {
  await goto(page, '/work.html?from=check#work');
  const slugs = await page.locator('.art-open').evaluateAll(links => links.map(a => a.dataset.art));
  check('gallery: unique address for every artwork', slugs.length > 0 && slugs.every(Boolean) && new Set(slugs).size === slugs.length);
  const link = page.locator('.g-item[data-art="pain"]');
  await link.scrollIntoViewIfNeeded();
  await link.focus();
  const startScroll = await page.evaluate(() => scrollY);
  await page.evaluate(() => { window.__artworkVisit = 'same-document'; });
  await link.click();
  await opened(page, 'pain');
  check('viewer: click opens Pain without reloading', await page.evaluate(() => window.__artworkVisit === 'same-document') && artSlug(page) === 'pain');
  check('viewer: full-resolution art and descriptive alternative text', await page.locator('#art-image').evaluate(img => /\/pain\.jpg$/.test(img.src) && img.naturalWidth >= 1000 && img.alt.length > 8));
  check('viewer: named by the artwork title', await page.locator('#viewer').evaluate(dialog => dialog.getAttribute('aria-labelledby')?.split(/\s+/).includes('art-title')) && (await page.locator('#art-title').innerText()) === 'Pain');
  check('viewer: retains unrelated URL parameters', new URL(page.url()).searchParams.get('from') === 'check');
  check('viewer: focus enters the dialog', await page.evaluate(() => document.getElementById('viewer').contains(document.activeElement)));
  await page.keyboard.press('Tab');
  await page.keyboard.press('Shift+Tab');
  check('viewer: keyboard focus remains in dialog', await page.evaluate(() => document.getElementById('viewer').contains(document.activeElement)));
  const frozen = await canvasFrame(page);
  await page.waitForTimeout(160);
  check('viewer: ambient particles rest while artwork is open', frozen === await canvasFrame(page));
  await page.goBack();
  await closed(page);
  check('viewer: browser Back returns to the gallery URL', page.url() === base + '/work.html?from=check#work');
  await page.waitForFunction(() => document.activeElement?.matches('.g-item[data-art="pain"]'), null, { timeout: 1500 });
  await page.waitForTimeout(100); // history restores persisted state after popstate
  const returnedScroll = await page.evaluate(() => scrollY);
  const returnedFocus = await link.evaluate(a => document.activeElement === a);
  check('viewer: Back restores artwork focus and scroll', returnedFocus && Math.abs(returnedScroll - startScroll) < 8, `focus ${returnedFocus}, scroll ${startScroll} → ${returnedScroll}`);
  await page.goForward();
  await opened(page, 'pain');
  check('viewer: browser Forward returns to the same artwork', (await page.locator('#art-title').innerText()) === 'Pain');
  await page.locator('.viewer-close').click();
  await closed(page);
  check('viewer: close returns to prior URL and artwork focus', page.url() === base + '/work.html?from=check#work' && await link.evaluate(a => document.activeElement === a));
});

await scenario('artwork navigation', {}, async page => {
  await goto(page, '/work.html#work');
  await selectArtwork(page, 'pain');
  await page.locator('#art-next').click();
  await opened(page, 'hoodie-study');
  check('viewer: Next reaches the garment drawing', artSlug(page) === 'hoodie-study' && (await page.locator('#art-title').innerText()) === 'Hoodie study');
  await page.keyboard.press('ArrowRight');
  await opened(page, 'imagine');
  check('viewer: Right arrow wraps to the first artwork', artSlug(page) === 'imagine');
  await page.keyboard.press('ArrowLeft');
  await opened(page, 'hoodie-study');
  check('viewer: Left arrow returns to the previous artwork', artSlug(page) === 'hoodie-study');
  await page.locator('#art-prev').click();
  await opened(page, 'pain');
  check('viewer: Previous button changes image and address together', await page.locator('#art-image').evaluate(img => /\/pain\.jpg$/.test(img.src)) && artSlug(page) === 'pain');
  await page.locator('#art-detail').click();
  check('viewer: detail toggle exposes pressed state', await page.locator('#art-detail').getAttribute('aria-pressed') === 'true');
  await page.keyboard.press('ArrowLeft');
  check('viewer: arrow keys explore detail without changing the artwork', artSlug(page) === 'pain');
  await settleForScreenshot(page);
  await page.screenshot({ path: `${out}/phone-pain-detail.png` });
  await page.locator('#art-detail').click();
  check('viewer: fit mode can be restored', await page.locator('#art-detail').getAttribute('aria-pressed') === 'false');
  await page.goBack();
  await closed(page);
  check('viewer: one Back closes after browsing several artworks', !new URL(page.url()).searchParams.has('art'));
  await selectArtwork(page, 'pain');
  await page.keyboard.press('Escape');
  await closed(page);
  check('viewer: Escape returns to gallery', !new URL(page.url()).searchParams.has('art'));
});

await scenario('direct artwork links', {}, async page => {
  await goto(page, '/work.html?art=pain');
  await opened(page, 'pain');
  check('viewer: shared Pain URL opens the named artwork', (await page.locator('#art-title').innerText()) === 'Pain');
  await page.locator('.viewer-close').click();
  await closed(page);
  check('viewer: closing a direct link reaches the gallery', new URL(page.url()).hash === '#work' && !new URL(page.url()).searchParams.has('art'));
  await goto(page, '/work.html?art=missing-artwork');
  check('viewer: unknown artwork address keeps the gallery usable', await page.locator('#viewer').evaluate(dialog => !dialog.open) && await page.locator('.g-item').count() > 0);
  await selectArtwork(page, 'imagine');
  check('viewer: valid artwork still opens after an unknown address', (await page.locator('#art-title').innerText()) === 'Imagine');
});

await scenario('repeated close activation', {}, async page => {
  await goto(page, '/work.html#work');
  await selectArtwork(page, 'pain');
  await page.locator('.viewer-close').evaluate(button => { button.click(); button.click(); });
  await closed(page);
  check('viewer: repeated close activation returns once to gallery', page.url() === base + '/work.html#work');
});

await scenario('image failure recovery', {}, async (page, context) => {
  await context.route('**/assets/art/pain.jpg', route => route.abort());
  await goto(page, '/work.html?art=pain');
  await page.waitForFunction(() => document.getElementById('viewer').open && /couldn.t load/.test(document.getElementById('art-load').textContent));
  check('viewer: failed artwork image gives readable recovery guidance', await page.locator('#art-load').isVisible() && await page.locator('#art-detail').isDisabled());
  await page.locator('#art-next').click();
  await opened(page, 'hoodie-study');
  check('viewer: another piece recovers from an image failure', await page.locator('#art-detail').isEnabled() && !(await page.locator('#art-load').isVisible()));
});

await scenario('related work', {}, async page => {
  await goto(page, '/work.html?art=cross');
  await opened(page, 'cross');
  await page.locator('#art-related').click();
  await opened(page, 'hoodie-study');
  check('related work: Cross leads to the garment drawing without a page reload', (await page.locator('#art-title').innerText()) === 'Hoodie study');
  await page.locator('#art-related').click();
  await opened(page, 'cross');
  check('related work: garment drawing links back to Cross', (await page.locator('#art-title').innerText()) === 'Cross');
  const archive = page.locator('#art-archive');
  check('related work: Cross points to its existing magazine motif', new URL(await archive.getAttribute('href'), base).searchParams.get('page') === '12');
  await archive.click();
  await page.waitForURL('**/magazine.html?page=12');
  await page.waitForFunction(() => /Page 12 of 17/.test(document.getElementById('page-status').textContent));
  check('related work: archive link opens the corresponding magazine page', /page=12/.test(page.url()));
});

await scenario('copy artwork link', {}, async (page, context) => {
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText(text) { window.__copiedArt = text; return Promise.resolve(); }
    } });
  });
  await goto(page, '/work.html?source=test#work');
  await selectArtwork(page, 'pain');
  await page.locator('#art-share').click();
  await page.waitForFunction(() => Boolean(window.__copiedArt));
  const copied = await page.evaluate(() => window.__copiedArt);
  const copiedURL = new URL(copied);
  check('share: clipboard receives a direct artwork address', copiedURL.pathname === '/work.html' && copiedURL.searchParams.get('art') === 'pain');
  check('share: copy success is announced', /copied/i.test(await page.locator('#art-status').innerText()) && await page.locator('#art-status').getAttribute('aria-live') === 'polite');
});

await scenario('native artwork share', {}, async (page, context) => {
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: data => {
      window.__sharedArt = data; return Promise.resolve();
    } });
  });
  await goto(page, '/work.html?art=pain');
  await opened(page, 'pain');
  await page.locator('#art-share').click();
  await page.waitForFunction(() => Boolean(window.__sharedArt));
  const shared = await page.evaluate(() => window.__sharedArt);
  check('share: native share receives artwork title and direct URL', /pain/i.test(shared.title) && new URL(shared.url).searchParams.get('art') === 'pain');
});

await scenario('cancel native share', {}, async (page, context) => {
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: () => Promise.reject(new DOMException('Sharing cancelled', 'AbortError')) });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText() { window.__copiedAfterCancel = true; return Promise.resolve(); }
    } });
  });
  await goto(page, '/work.html?art=pain');
  await opened(page, 'pain');
  await page.locator('#art-share').click();
  await page.waitForTimeout(50);
  check('share: dismissing native share keeps artwork open without copying', artSlug(page) === 'pain' && await page.locator('#viewer').evaluate(dialog => dialog.open) && !(await page.evaluate(() => window.__copiedAfterCancel)));
});

await scenario('manual artwork link', {}, async (page, context) => {
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText() { return Promise.reject(new Error('Clipboard denied')); }
    } });
  });
  await goto(page, '/work.html?art=pain');
  await opened(page, 'pain');
  await page.locator('#art-share').click();
  const manual = page.locator('#art-link');
  await manual.waitFor({ state: 'visible' });
  const value = await manual.inputValue();
  check('share: denied clipboard exposes a selectable direct URL', new URL(value).searchParams.get('art') === 'pain' && await manual.evaluate(input => document.activeElement === input && input.selectionStart === 0 && input.selectionEnd === input.value.length));
  await manual.press('ArrowLeft');
  check('viewer: editing/selecting a link does not navigate artworks', artSlug(page) === 'pain');
  check('share: manual copying guidance is announced', /copy|select/i.test(await page.locator('#art-status').innerText()));
});

for (const [name, width, height] of [['small-phone', 360, 740], ['phone', 390, 844], ['tablet', 768, 1024], ['desktop', 1440, 900]]) {
  await scenario(name, { viewport: { width, height }, isMobile: width < 768, hasTouch: width < 768 }, async page => {
    await goto(page, '/work.html#work');
    check(`${name}: gallery has no horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await settleForScreenshot(page);
    await page.screenshot({ path: `${out}/${name}-gallery.png` });
    await selectArtwork(page, 'pain');
    check(`${name}: artwork view has no horizontal overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    check(`${name}: viewer controls stay within the screen`, await page.locator('#viewer button').evaluateAll(buttons => buttons.every(button => {
      const rect = button.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.left >= 0 && rect.top >= 0 && rect.right <= innerWidth + 1 && rect.bottom <= innerHeight + 1;
    })));
    check(`${name}: fit mode shows the entire artwork`, await page.locator('#art-image').evaluate(image => {
      const rect = image.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.bottom <= innerHeight + 1 && rect.left >= 0 && rect.right <= innerWidth + 1;
    }));
    await page.screenshot({ path: `${out}/${name}-pain.png` });
    await page.locator('#art-next').click();
    await opened(page, 'hoodie-study');
    await page.locator('#art-next').click();
    await opened(page, 'imagine');
    check(`${name}: portrait artwork also fits the screen`, await page.locator('#art-image').evaluate(image => {
      const rect = image.getBoundingClientRect();
      return rect.top >= 0 && rect.bottom <= innerHeight + 1 && rect.left >= 0 && rect.right <= innerWidth + 1;
    }));
    await page.screenshot({ path: `${out}/${name}-imagine.png` });
    await page.locator('#art-prev').click();
    await opened(page, 'hoodie-study');
    await page.locator('#art-related').click();
    await opened(page, 'cross');
    await page.screenshot({ path: `${out}/${name}-cross.png` });
  });
}

await scenario('sound choice and navigation', { viewport: { width: 1440, height: 900 } }, async page => {
  await goto(page);
  const duplicateIDs = await page.locator('[id]').evaluateAll(elements => {
    const ids = elements.map(element => element.id);
    return ids.filter((id, index) => ids.indexOf(id) !== index);
  });
  check('work: all element IDs are unique', duplicateIDs.length === 0, duplicateIDs.join(', '));
  await page.locator('.work-lead').click();
  await page.waitForFunction(() => window.EKSTAZ_DRONE.analyser !== null);
  check('sound: on by default, starting at the first ordinary gesture', await page.locator('#sound').getAttribute('aria-pressed') === 'true');
  await page.locator('.bar-nav a[href="#productions"]').click();
  await page.waitForFunction(() => { const top = document.getElementById('productions').getBoundingClientRect().top; return top >= 0 && top < innerHeight; });
  check('work: Sound navigation reaches the productions section', new URL(page.url()).hash === '#productions' && await page.locator('#productions').evaluate(section => section.tagName === 'SECTION' && section.getBoundingClientRect().top >= 0 && section.getBoundingClientRect().top < innerHeight));
  await page.locator('#sound').click();
  check('sound: muting is remembered', await page.locator('#sound').getAttribute('aria-pressed') === 'false' && await page.evaluate(() => localStorage.getItem('ekstaz-sound') === 'off'));
  await page.locator('a[href="magazine.html"]').click();
  await page.waitForURL('**/magazine.html');
  check('sound: muted choice carries into the magazine', await page.locator('#sound').getAttribute('aria-pressed') === 'false');
  await page.locator('#sound').click();
  await page.locator('.reader-back').click();
  await page.waitForURL('**/work.html#print');
  await page.locator('.mag-copy .sec-title').click();
  check('sound: turning it back on in the magazine carries to the work page', await page.locator('#sound').getAttribute('aria-pressed') === 'true' && await page.evaluate(() => localStorage.getItem('ekstaz-sound') === 'on'));
});

await scenario('reduced motion', { reducedMotion: 'reduce' }, async page => {
  await goto(page, '/work.html#work');
  const before = await canvasFrame(page);
  await page.waitForTimeout(180);
  check('reduced motion: ambient frame remains still', before === await canvasFrame(page));
  await selectArtwork(page, 'pain');
  check('reduced motion: viewer controls and image have no animation', await page.locator('#viewer, #viewer *').evaluateAll(elements => elements.every(element => {
    const style = getComputedStyle(element);
    return style.animationName === 'none' && style.transitionDuration.split(',').every(duration => parseFloat(duration) === 0);
  })));
  await page.locator('.viewer-close').click();
  await closed(page);
  const after = await canvasFrame(page);
  await page.waitForTimeout(180);
  check('reduced motion: ambient stays still after viewer closes', after === await canvasFrame(page));
});

await scenario('JavaScript disabled', { javaScriptEnabled: false }, async page => {
  await goto(page, '/work.html#work');
  const anchors = page.locator('a.g-item');
  check('no JavaScript: gallery artworks are usable links', await anchors.count() > 0 && await anchors.evaluateAll(links => links.every(a => /\.(jpg|png|webp)(?:[?#]|$)/.test(a.getAttribute('href') || ''))));
  // Use a real pointer click: Chromium's JS-disabled context does not reliably service
  // the utility-world animation frames used by locator.click's stability check.
  // The native fragment scroll can still be moving after load; observe its result.
  await page.waitForFunction(() => {
    const box = document.querySelector('a.g-item')?.getBoundingClientRect();
    return box && box.top >= 0 && box.bottom <= innerHeight;
  }, null, { polling: 50, timeout: 5000 });
  const box = await anchors.first().boundingBox();
  check('no JavaScript: gallery link is visibly reachable', Boolean(box) && box.y >= 0 && box.y + box.height <= 844 && box.width > 0);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForURL('**/assets/art/imagine.jpg');
  check('no JavaScript: artwork link opens original image', /\/assets\/art\/[^/]+\.(jpg|png|webp)$/.test(new URL(page.url()).pathname) && await page.locator('img').evaluate(img => img.complete && img.naturalWidth > 0));
});

check('all artwork journeys run without uncaught JavaScript errors', errors.length === 0, errors.join(' | '));
await browser.close();
console.log(`${checked - failed}/${checked} checks passed; screenshots in ${out}`);
process.exit(failed ? 1 : 0);
