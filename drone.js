// EKSTAZ drone: one sound shared by every page, plus soft page-to-page transitions.
// Sound is on by default: armed on load, it starts at the first touch (browsers require one).
// Turning it off is remembered across pages.
// Leaving for another EKSTAZ page fades sound and screen to ink first.
(function () {
  'use strict';
  var btn = document.getElementById('sound'), cue = document.getElementById('cue');
  var page = document.documentElement.getAttribute('data-drone') || 'signal'; // 'signal' or 'quiet'
  var LEVEL = page === 'quiet' ? .045 : .07;
  var muted = false, a = null; // on by default; a saved 'off' is respected
  try { muted = localStorage.getItem('ekstaz-sound') === 'off'; } catch (e) {}
  var api = window.EKSTAZ_DRONE = { analyser: null, data: null, tone: function () {} };

  function build() {
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    var ac = new AC(), gain = ac.createGain(), filter = ac.createBiquadFilter(), lfo = ac.createOscillator(), lfoGain = ac.createGain();
    filter.type = 'lowpass'; filter.frequency.value = page === 'quiet' ? 190 : 260; filter.Q.value = 7;
    lfo.frequency.value = .07; lfoGain.gain.value = page === 'quiet' ? 90 : 140; lfo.connect(lfoGain).connect(filter.frequency); lfo.start();
    [55, 55.35, 82.4].forEach(function (hz, j) {
      var o = ac.createOscillator(); o.type = j === 2 ? 'triangle' : 'sawtooth'; o.frequency.value = hz; o.connect(filter); o.start();
    });
    var an = ac.createAnalyser(); an.fftSize = 512;
    filter.connect(gain); gain.connect(an); an.connect(ac.destination); gain.gain.value = 0;
    api.analyser = an; api.data = new Uint8Array(an.fftSize);
    // 0..1 → filter brightness; the signal page opens it up as you scroll
    api.tone = function (x) { filter.frequency.setTargetAtTime(200 + x * 300, ac.currentTime, .3); };
    return { ac: ac, gain: gain };
  }
  function running() { return a && a.ac.state === 'running'; }
  function paint() {
    if (btn) { btn.setAttribute('aria-pressed', String(!muted)); btn.textContent = muted ? 'Sound off' : 'Sound on'; }
    if (cue) cue.textContent = !muted && !running() ? 'Touch to tune in · Scroll' : 'Scroll';
  }
  function apply() {
    if (!a && !muted) a = build();
    if (a) {
      if (!muted) a.ac.resume().then(paint, paint);
      a.gain.gain.setTargetAtTime(muted ? 0 : LEVEL, a.ac.currentTime, .8); // slow swell in, never a jump
    }
    paint();
  }
  var events = ['pointerdown', 'touchend', 'keydown'];
  function firstTouch(e) {
    if (e.target.closest && e.target.closest('#sound')) return;
    if (!muted) apply();
    if (running()) events.forEach(function (t) { removeEventListener(t, firstTouch, true); });
  }
  events.forEach(function (t) { addEventListener(t, firstTouch, true); });
  if (btn) btn.addEventListener('click', function () {
    muted = !muted;
    try { localStorage.setItem('ekstaz-sound', muted ? 'off' : 'on'); } catch (e) {}
    apply();
  });
  apply();

  // ---- leaving: fade sound + screen to ink, then go ----
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a[href]');
    if (!link || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (link.target === '_blank' || link.hasAttribute('download')) return;
    var url = new URL(link.href, location.href);
    if (url.origin !== location.origin || /\.(pdf|png|jpe?g|webp)$/i.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.search === location.search) return; // same-page anchor
    e.preventDefault();
    if (a) a.gain.gain.setTargetAtTime(0, a.ac.currentTime, .12);
    document.documentElement.classList.add('leaving');
    setTimeout(function () { location.href = url.href; }, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420);
  });
  // back/forward from the cache: undo the fade
  addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    document.documentElement.classList.remove('leaving');
    if (a && !muted) a.gain.gain.setTargetAtTime(LEVEL, a.ac.currentTime, .8);
    paint();
  });
})();
