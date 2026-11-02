// Orientation follows the actual content, never the distance of a presumed viewport.
// Native anchors keep the full journey readable and navigable without JavaScript.
(function () {
  'use strict';
  var sections = Array.from(document.querySelectorAll('.state[id]'));
  var progress = document.getElementById('journey-progress');
  var position = document.getElementById('journey-position');
  var next = document.getElementById('journey-next');
  if (!sections.length || !progress || !position || !next) return;
  var names = ['Enter EKSTAZ', 'Encounter', 'Reflection', 'Form', 'Expression', 'Stay close'];
  var pending = false;
  var clickedHash = '';
  function update() {
    pending = false;
    // Use a reading line below the header; short viewports and enlarged type still work.
    var bar = document.querySelector('.s-bar');
    var line = (bar ? bar.getBoundingClientRect().bottom : 80) + Math.min(100, innerHeight * .12);
    var current = 0;
    sections.forEach(function (section, index) {
      if (section.getBoundingClientRect().top <= line) current = index;
    });
    position.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(sections.length).padStart(2, '0') + ' · ' + names[current];
    var following = (current + 1) % sections.length;
    next.href = '#' + sections[following].id;
    next.textContent = current === sections.length - 1 ? 'Back to the beginning ↑' : 'Next: ' + names[following] + ' ↓';
    // Lead through the original images before the next chapter, including long phone layouts.
    var stop = Array.from(sections[current].querySelectorAll('[data-journey-stop]')).find(function (figure) {
      var box = figure.getBoundingClientRect();
      return box.bottom > innerHeight - progress.offsetHeight - 20 && box.top > line + 2;
    });
    if (stop) {
      next.href = '#' + stop.id;
      next.textContent = stop.dataset.journeyStop + ' ↓';
    }
    document.querySelectorAll('.j-map a').forEach(function (link) {
      if (link.hash === '#' + sections[current].id) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
    });
  }
  function schedule() {
    if (!pending) { pending = true; requestAnimationFrame(update); }
  }
  // Move keyboard focus with same-page navigation, while retaining native history and scrolling.
  document.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href^="#"]');
    if (!link || event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    clickedHash = link.hash;
    document.documentElement.classList.remove('history-navigation');
    var target = document.getElementById(link.hash.slice(1));
    if (target && target.hasAttribute('tabindex')) target.focus({ preventScroll: true });
  });
  // Letter bands drift sideways as they pass through the viewport.
  var bands = Array.from(document.querySelectorAll('[data-band]'));
  var still = matchMedia('(prefers-reduced-motion: reduce)');
  function slideBands() {
    if (still.matches) return;
    bands.forEach(function (band) {
      var box = band.getBoundingClientRect();
      if (box.bottom < -200 || box.top > innerHeight + 200) return;
      var pass = (innerHeight - box.top) / (innerHeight + box.height); // 0 entering → 1 leaving
      var dir = Number(band.dataset.band) || 1;
      band.firstElementChild.style.setProperty('--band-x', (dir > 0 ? -pass : pass - 1) * innerWidth * .9 + 'px');
    });
  }
  addEventListener('scroll', function () { requestAnimationFrame(slideBands); }, { passive: true });
  slideBands();
  // Pain glitches once, with Elton's own colour-shift frames, the first time it comes into view.
  var glitchy = document.querySelector('.j-glitchable');
  if (glitchy && 'IntersectionObserver' in window && !still.matches) {
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        seen.disconnect();
        glitchy.classList.add('glitching');
        setTimeout(function () { glitchy.classList.remove('glitching'); }, 800);
      });
    }, { threshold: .5 });
    seen.observe(glitchy);
  }
  addEventListener('scroll', schedule, { passive: true });
  addEventListener('resize', schedule);
  addEventListener('hashchange', schedule);
  // Browser Back/Forward restores the saved reading position immediately; a
  // pending smooth anchor scroll must not compete with that native restoration.
  addEventListener('popstate', function () {
    // Native fragment clicks also emit popstate in Chromium. Keep those smooth;
    // only history traversal needs immediate restoration.
    if (location.hash !== clickedHash) document.documentElement.classList.add('history-navigation');
    clickedHash = '';
    schedule();
  });
  addEventListener('pageshow', schedule);
  if (typeof ResizeObserver === 'function') new ResizeObserver(schedule).observe(document.getElementById('journey'));
  progress.hidden = false;
  update();
})();
