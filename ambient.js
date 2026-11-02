// Ambient layer for the inner pages. It rests while artwork is open, the page is hidden,
// or reduced motion is requested; the work remains the centre of the experience.
(function () {
  'use strict';
  var motion = matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motion.matches;

  // reveal sections as they enter
  var items = document.querySelectorAll('[data-reveal]');
  var io;
  function updateReveals() {
    if (io) io.disconnect();
    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.remove('pre'); el.classList.add('in'); });
      return;
    }
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    items.forEach(function (el) {
      if (!el.classList.contains('in')) { el.classList.add('pre'); io.observe(el); }
    });
  }
  updateReveals();

  var canvas = document.getElementById('field');
  if (!canvas) return;
  var ctx = canvas.getContext('2d'), W = 0, H = 0, DPR = 1, N = innerWidth < 760 ? 500 : 1000;
  if (!ctx) return;
  var x = new Float32Array(N), y = new Float32Array(N), v = new Float32Array(N), ph = new Float32Array(N), red = new Uint8Array(N);
  var rings = [];
  var viewer = document.getElementById('viewer');
  var frameId = null, lastFrame = 0, time = 0, lastY = scrollY, drift = 0;
  function seed() {
    for (var i = 0; i < N; i++) { x[i] = Math.random() * W; y[i] = Math.random() * H; v[i] = .08 + Math.random() * .35; ph[i] = Math.random() * 6.28; red[i] = Math.random() < .55 ? 1 : 0; }
    rings = []; for (var r = 0; r < (W < 760 ? 7 : 14); r++) rings.push([Math.random(), Math.random(), 4 + Math.random() * 10, Math.random() * 6.28]);
  }
  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR); seed();
    syncRendering();
  }
  function suspended() { return document.hidden || (viewer && viewer.open); }
  function draw(t, step) {
    var D = window.EKSTAZ_DRONE, level = 0;
    if (!reduced && D && D.analyser) {
      D.analyser.getByteTimeDomainData(D.data);
      for (var k = 0; k < D.data.length; k += 16) level += Math.abs(D.data[k] - 128);
      level = Math.min(1, level / (D.data.length / 16) / 40);
    }
    if (step) {
      drift += ((scrollY - lastY) * .25 - drift) * .1;
      lastY = scrollY; // scrolling stirs the field only when animation is enabled
    }
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);
    var base = .32 + level * .5;
    for (var i = 0; i < N; i++) {
      if (step) { y[i] -= (v[i] + drift * v[i]) * step; x[i] += Math.sin(t * .4 + ph[i]) * .15 * step; }
      if (y[i] < -4) { y[i] = H + 4; x[i] = Math.random() * W; } else if (y[i] > H + 4) { y[i] = -4; }
      ctx.globalAlpha = base * (.4 + .6 * Math.abs(Math.sin(t * .8 + ph[i])));
      ctx.fillStyle = red[i] ? '#df0500' : '#f1e9e3';
      ctx.fillRect(x[i], y[i], 1.4, 1.4);
    }
    ctx.globalAlpha = .35 + level * .4; ctx.strokeStyle = '#df0500'; ctx.lineWidth = 1;
    rings.forEach(function (r) {
      var cx = r[0] * W, cy = r[1] * H, a = t * .3 + r[3];
      ctx.beginPath(); ctx.arc(cx, cy, r[2], a, a + 4.6); ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    frameId = null;
    if (reduced || suspended()) { lastFrame = 0; return; }
    // Keep phase continuous across pauses; a background tab must not jump on return.
    var elapsed = lastFrame ? Math.min(now - lastFrame, 50) : 0;
    lastFrame = now;
    time += elapsed / 1000;
    draw(time, elapsed / (1000 / 60));
    frameId = requestAnimationFrame(frame);
  }
  function syncRendering() {
    if (frameId !== null) { cancelAnimationFrame(frameId); frameId = null; }
    lastFrame = 0; lastY = scrollY; drift = 0;
    if (suspended()) return;
    if (reduced) {
      // One still frame: particle positions, opacity and ring angles all stay fixed.
      draw(time, 0);
    } else {
      frameId = requestAnimationFrame(frame);
    }
  }
  function updateMotion() {
    reduced = motion.matches;
    updateReveals();
    syncRendering();
  }
  if (motion.addEventListener) motion.addEventListener('change', updateMotion);
  else motion.addListener(updateMotion);
  document.addEventListener('visibilitychange', syncRendering);
  if (viewer) {
    new MutationObserver(syncRendering).observe(viewer, { attributes: true, attributeFilter: ['open'] });
    viewer.addEventListener('close', syncRendering);
  }
  addEventListener('resize', resize);
  resize();
})();
