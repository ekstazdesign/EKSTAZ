// EKSTAZ — Signal. One field of particles takes a different physical state per section:
// wordmark (signal, arriving as ash), artwork (image), waveform (sound), stitched cross emblem (garment),
// scattered carriers (world), and a star mark (carry). DOM chapters set their order.
// The waitlist number seeds a unique mark the visitor can save.
(function () {
  'use strict';

  var canvas = document.getElementById('field');
  var ctx = canvas.getContext('2d');
  var motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motionQuery.matches;
  var frameRequest = 0;
  var N = innerWidth < 760 ? 2200 : 4200;
  var W = 0, H = 0, DPR = 1;
  var sections = Array.from(document.querySelectorAll('.state[data-state]'));
  var stateNames = ['signal', 'sound', 'garment', 'image', 'world', 'carry'];
  var stateOrder = sections.map(function (section) { return stateNames.indexOf(section.dataset.state); });
  var stages = sections.map(function (section) { return section.querySelector('[data-signal-stage]'); });
  var S = sections.length; // journey chapters; visual states can appear in a different order
  var px = new Float32Array(N), py = new Float32Array(N);
  var jitter = new Float32Array(N); // per-particle random, stable
  var targets = []; // static targets per state: Float32Array(N*2) or null if computed per frame
  var colors = []; // per state: Float32Array(N*3)
  var bounds = []; // natural shape bounds, fitted into each chapter's visible stage
  var started = performance.now();
  var images = {};
  var waveData = null;

  for (var i = 0; i < N; i++) { jitter[i] = Math.random(); px[i] = Math.random() * innerWidth; py[i] = Math.random() * innerHeight; }

  // ---------- helpers ----------
  function rng(seed) { // mulberry32
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function load(src) {
    return new Promise(function (ok) {
      var im = new Image(); im.onload = function () { ok(im); }; im.onerror = function () { ok(null); }; im.src = src;
    });
  }
  // Pick N points from candidate list [x,y,...]; returns Float32Array(N*2)
  function pick(cand, seed) {
    var out = new Float32Array(N * 2), r = rng(seed), n = cand.length / 2;
    for (var i = 0; i < N; i++) {
      if (!n) { out[i * 2] = W / 2; out[i * 2 + 1] = H / 2; continue; }
      var k = (r() * n) | 0;
      out[i * 2] = cand[k * 2] + (r() - .5) * 1.2;
      out[i * 2 + 1] = cand[k * 2 + 1] + (r() - .5) * 1.2;
    }
    return out;
  }
  // Sample an image into a box. mode 'alpha' keeps opaque pixels; 'luma' keeps bright ones and their colour.
  function sampleImage(img, bx, by, bw, bh, mode, step) {
    var c = document.createElement('canvas'); c.width = Math.max(1, Math.round(bw)); c.height = Math.max(1, Math.round(bh));
    var g = c.getContext('2d', { willReadFrequently: true });
    g.drawImage(img, 0, 0, c.width, c.height);
    var d = g.getImageData(0, 0, c.width, c.height).data, pts = [], cols = [];
    for (var y = 0; y < c.height; y += step) for (var x = 0; x < c.width; x += step) {
      var o = (y * c.width + x) * 4, keep;
      if (mode === 'alpha') keep = d[o + 3] > 140;
      else keep = Math.max(d[o], d[o + 1], d[o + 2]) > 95;
      if (keep) { pts.push(bx + x, by + y); cols.push(d[o], d[o + 1], d[o + 2]); }
    }
    return { pts: pts, cols: cols };
  }
  function fit(iw, ih, maxW, maxH) { var s = Math.min(maxW / iw, maxH / ih); return [iw * s, ih * s]; }

  // ---------- the mark: joined-ball star, seeded ----------
  // Returns geometry in unit space (-1..1): lines [x1,y1,x2,y2,w], balls [x,y,r,hollow]
  function sigil(seed) {
    var r = rng(seed * 2654435761 + 7), k = [5, 6, 7, 8][(r() * 4) | 0];
    var mirror = r() < .55, lines = [], balls = [];
    var r0 = .14 + r() * .12, steps = 2 + ((r() * 3) | 0), arm = [[r0, 0]];
    var rad = r0, ang = 0;
    for (var s = 0; s < steps; s++) {
      rad += (.95 - r0) / steps * (.7 + r() * .5);
      ang += (r() - .5) * (Math.PI / k) * 1.1;
      arm.push([Math.min(rad, .9), ang]);
    }
    var branchAt = 1 + ((r() * (arm.length - 1)) | 0), branchAng = (r() < .5 ? -1 : 1) * (Math.PI / k) * (.4 + r() * .4);
    var endR = .05 + r() * .045, midR = .018 + r() * .02, w = .016 + r() * .012, hollowEnd = r() < .6;
    var copies = mirror ? [1, -1] : [1];
    for (var c = 0; c < k; c++) {
      var base = c * 2 * Math.PI / k - Math.PI / 2;
      copies.forEach(function (m) {
        var prev = null;
        arm.forEach(function (p, idx) {
          var a = base + m * p[1], x = Math.cos(a) * p[0], y = Math.sin(a) * p[0];
          if (prev) lines.push([prev[0], prev[1], x, y, w]);
          if (idx === arm.length - 1) balls.push([x, y, endR, hollowEnd]);
          else if (idx > 0) balls.push([x, y, midR, false]);
          if (idx === branchAt) {
            var ba = a + m * branchAng, br = p[0] + .16, bx = Math.cos(ba) * br, by = Math.sin(ba) * br;
            lines.push([x, y, bx, by, w * .8]); balls.push([bx, by, midR * 1.3, false]);
          }
          prev = [x, y];
        });
      });
    }
    // centre ring + dot
    for (var j = 0; j < 48; j++) {
      var a1 = j / 48 * Math.PI * 2, a2 = (j + 1) / 48 * Math.PI * 2;
      lines.push([Math.cos(a1) * r0, Math.sin(a1) * r0, Math.cos(a2) * r0, Math.sin(a2) * r0, w * .9]);
    }
    balls.push([0, 0, r0 * .38, true]);
    return { lines: lines, balls: balls };
  }
  function sigilPoints(geo, cx, cy, scale) {
    var pts = [];
    geo.lines.forEach(function (l) {
      var len = Math.hypot(l[2] - l[0], l[3] - l[1]) * scale, n = Math.max(2, len / 2);
      for (var t = 0; t <= n; t++) { var f = t / n; pts.push(cx + (l[0] + (l[2] - l[0]) * f) * scale, cy + (l[1] + (l[3] - l[1]) * f) * scale); }
    });
    geo.balls.forEach(function (b) {
      var rr = b[2] * scale, n = Math.max(8, rr * rr / 3);
      for (var t = 0; t < n; t++) {
        var a = t * 2.39996, d = Math.sqrt(t / n) * rr;
        if (b[3] && d < rr * .45) continue;
        pts.push(cx + b[0] * scale + Math.cos(a) * d, cy + b[1] * scale + Math.sin(a) * d);
      }
    });
    return pts;
  }
  function drawSigil(g, geo, cx, cy, scale, ink, red) {
    g.strokeStyle = red; g.fillStyle = red; g.lineCap = 'round';
    geo.lines.forEach(function (l) {
      g.lineWidth = l[4] * scale; g.beginPath(); g.moveTo(cx + l[0] * scale, cy + l[1] * scale); g.lineTo(cx + l[2] * scale, cy + l[3] * scale); g.stroke();
    });
    geo.balls.forEach(function (b) {
      g.fillStyle = red; g.beginPath(); g.arc(cx + b[0] * scale, cy + b[1] * scale, b[2] * scale, 0, Math.PI * 2); g.fill();
      if (b[3]) { g.fillStyle = ink; g.beginPath(); g.arc(cx + b[0] * scale, cy + b[1] * scale, b[2] * scale * .42, 0, Math.PI * 2); g.fill(); }
    });
  }

  // ---------- targets ----------
  function solid(rgb) { var c = new Float32Array(N * 3); for (var i = 0; i < N; i++) { c[i * 3] = rgb[0]; c[i * 3 + 1] = rgb[1]; c[i * 3 + 2] = rgb[2]; } return c; }
  function mixed(a, b, share) { var c = new Float32Array(N * 3); for (var i = 0; i < N; i++) { var s = jitter[i] < share ? b : a; c[i * 3] = s[0]; c[i * 3 + 1] = s[1]; c[i * 3 + 2] = s[2]; } return c; }
  var RED = [223, 5, 0], BONE = [241, 233, 227], EMBER = [255, 59, 47];
  var mid = function () { return H * (W < 760 ? .38 : .42); };

  function build() {
    var cy = mid(), box = Math.min(W * .86, 980);
    // 0 signal: the wordmark
    if (images.word) { // Elton's own EKSTAZ letters, set side by side
      var s0 = fit(images.word.width, images.word.height, box, H * .26);
      targets[0] = pick(sampleImage(images.word, (W - s0[0]) / 2, cy - s0[1] / 2, s0[0], s0[1], 'alpha', 2).pts, 1);
    }
    colors[0] = mixed(RED, EMBER, .25);
    // 1 sound: computed per frame
    targets[1] = null; colors[1] = mixed(BONE, RED, .35);
    // 2 garment: the ornate cross emblem, cross-stitched on a grid
    if (images.e) {
      var s2 = fit(images.e.width, images.e.height, W * .6, H * .46), cell = Math.max(7, Math.round(s2[1] / 34));
      var raw = sampleImage(images.e, 0, 0, s2[0], s2[1], 'alpha', cell).pts, st = [], ox = (W - s2[0]) / 2, oy = cy - s2[1] / 2;
      for (var k = 0; k < raw.length; k += 2) {
        for (var t = 0; t <= 6; t++) {
          var f = t / 6 * cell * .8;
          st.push(ox + raw[k] + f, oy + raw[k + 1] + f, ox + raw[k] + cell * .8 - f, oy + raw[k + 1] + f);
        }
      }
      targets[2] = pick(st, 3);
    }
    colors[2] = mixed(BONE, RED, .12);
    // 3 image: an artwork, in its own colours
    if (images.art) {
      var s3 = fit(images.art.width, images.art.height, W * .82, H * .5);
      var sm = sampleImage(images.art, (W - s3[0]) / 2, cy - s3[1] / 2, s3[0], s3[1], 'luma', 2);
      var r3 = rng(4), n3 = sm.pts.length / 2, t3 = new Float32Array(N * 2), c3 = new Float32Array(N * 3);
      for (var i3 = 0; i3 < N; i3++) {
        var q = n3 ? (r3() * n3) | 0 : 0;
        t3[i3 * 2] = sm.pts[q * 2] || W / 2; t3[i3 * 2 + 1] = sm.pts[q * 2 + 1] || cy;
        c3[i3 * 3] = sm.cols[q * 3] || 223; c3[i3 * 3 + 1] = sm.cols[q * 3 + 1] || 5; c3[i3 * 3 + 2] = sm.cols[q * 3 + 2] || 0;
      }
      targets[3] = t3; colors[3] = c3;
    } else { colors[3] = solid(RED); }
    // 4 world: computed per frame (drifting clusters)
    targets[4] = null; colors[4] = mixed(RED, BONE, .3);
    // 5 carry: Elton's star; the generated mark stands in if it fails to load
    if (images.star) {
      var s5 = fit(images.star.width, images.star.height, Math.min(W * .8, 620), H * .5);
      targets[5] = pick(sampleImage(images.star, (W - s5[0]) / 2, cy - s5[1] / 2, s5[0], s5[1], 'alpha', 2).pts, 5);
    } else {
      var scale = Math.min(W * .4, H * .26);
      targets[5] = pick(sigilPoints(sigil(0), W / 2, cy, scale), 5);
    }
    colors[5] = mixed(RED, EMBER, .2);
    for (var z = 0; z < S; z++) if (targets[z] === undefined) targets[z] = pick([W / 2, cy], z);
    targets.forEach(function (points, state) {
      if (!points) return;
      var left = Infinity, top = Infinity, right = -Infinity, bottom = -Infinity;
      for (var j = 0; j < points.length; j += 2) {
        left = Math.min(left, points[j]); right = Math.max(right, points[j]);
        top = Math.min(top, points[j + 1]); bottom = Math.max(bottom, points[j + 1]);
      }
      bounds[state] = [left, top, Math.max(1, right - left), Math.max(1, bottom - top)];
    });
    bounds[1] = [W * .06, cy - H * .09, W * .88, H * .18];
    bounds[4] = [0, 0, W, H];
  }

  var clusters = (function () { var r = rng(42), c = []; for (var i = 0; i < 46; i++) c.push([.06 + r() * .88, .1 + r() * .78, 5 + r() * 12, r() * 6.28]); return c; })();
  var tmp = [0, 0];
  function target(state, i, t) {
    if (state === 1) { // waveform: three strands across the screen
      var x = (i / N), strand = i % 3, cy = mid(), amp = H * .07;
      var y = Math.sin(x * 14 + t * 1.6 + strand * 2.1) * .55 + Math.sin(x * 37 - t * 2.3) * .25 + Math.sin(x * 5 + t * .7) * .2;
      if (waveData) { var v = (waveData[(x * (waveData.length - 1)) | 0] - 128) / 128; y = y * .4 + v * 2.2; }
      tmp[0] = W * (.06 + x * .88); tmp[1] = cy + y * amp * (1 - strand * .25) + (jitter[i] - .5) * 4;
      return tmp;
    }
    if (state === 4) { // carriers: small rotating rings scattered through the world
      var c = clusters[i % clusters.length], a = jitter[i] * 6.28 + t * (.25 + c[3] * .05);
      tmp[0] = c[0] * W + Math.cos(a) * c[2] * (W < 760 ? .8 : 1.2); tmp[1] = c[1] * H + Math.sin(a) * c[2] * (W < 760 ? .8 : 1.2);
      return tmp;
    }
    var T = targets[state]; tmp[0] = T[i * 2]; tmp[1] = T[i * 2 + 1]; return tmp;
  }

  // ---------- frame ----------
  function progress() {
    var y = scrollY;
    var p = 0;
    for (var index = 0; index < sections.length; index++) {
      var top = sections[index].getBoundingClientRect().top + y;
      var next = sections[index + 1];
      if (y >= top) {
        var end = next ? next.getBoundingClientRect().top + y : top + sections[index].offsetHeight;
        p = index + Math.max(0, Math.min(1, (y - top) / Math.max(1, end - top)));
      }
    }
    return Math.max(0, Math.min(S - 1, p));
  }
  function ease(f) { return f < .5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2; }
  // The field remains a single particle system. Its full-strength shapes occupy the
  // chapter's reserved visual space rather than competing with the reading below.
  function fitStage(state, box) {
    var shape = bounds[state];
    var scale = Math.min(box.width * .94 / shape[2], box.height * .9 / shape[3]);
    return { box: box, scale: scale, x: box.left + box.width / 2 - (shape[0] + shape[2] / 2) * scale,
      y: box.top + box.height / 2 - (shape[1] + shape[3] / 2) * scale };
  }
  function stageLayout(chapter) {
    return fitStage(stateOrder[chapter], stages[chapter].getBoundingClientRect());
  }
  function placePoint(state, i, t, layout) {
    var point = target(state, i, t);
    if (state === 4) {
      // Spread carriers across the stage, retaining visible circular rings.
      var c = clusters[i % clusters.length], angle = jitter[i] * 6.28 + t * (.25 + c[3] * .05);
      var radius = c[2] * (W < 760 ? .8 : 1.2);
      tmp[0] = layout.box.left + c[0] * layout.box.width + Math.cos(angle) * radius;
      tmp[1] = layout.box.top + c[1] * layout.box.height + Math.sin(angle) * radius;
    } else {
      tmp[0] = point[0] * layout.scale + layout.x;
      tmp[1] = point[1] * layout.scale + layout.y;
    }
    return tmp;
  }
  var ready = false;
  function requestFrame() {
    if (!frameRequest && !document.hidden && !(card && card.open)) frameRequest = requestAnimationFrame(frame);
  }
  function stopFrame() {
    if (frameRequest) cancelAnimationFrame(frameRequest);
    frameRequest = 0;
  }
  function frame(now) {
    frameRequest = 0;
    if (document.hidden || (card && card.open)) return;
    var t = reduced ? 0 : (now - started) / 1000;
    var D = window.EKSTAZ_DRONE;
    if (!reduced && D && D.analyser) { D.analyser.getByteTimeDomainData(D.data); waveData = D.data; } else waveData = null;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.fillStyle = reduced ? '#060404' : 'rgba(6,4,4,.3)';
    ctx.fillRect(0, 0, W, H);
    if (!ready) return;
    var p = progress(), chapter = Math.floor(p), following = Math.min(chapter + 1, S - 1);
    var a = stateOrder[chapter], b = stateOrder[following];
    var layoutA = stageLayout(chapter), layoutB = stageLayout(following);
    // Hold a complete shape while its chapter is read. Morph only at the handover.
    var f = ease(Math.max(0, Math.min(1, (p - chapter - .6) / .4)));
    // Morph within the incoming stage instead of sending the shape through the
    // reading gap. The same particles retain their colour and spring motion.
    var placedA = f > 0 ? fitStage(a, layoutB.box) : layoutA;
    var region = { left: layoutA.box.left, top: layoutA.box.top, width: layoutA.box.width, height: layoutA.box.height };
    if (f > 0) {
      region.left += (layoutB.box.left - region.left) * f;
      region.top += (layoutB.box.top - region.top) * f;
      region.width += (layoutB.box.width - region.width) * f;
      region.height += (layoutB.box.height - region.height) * f;
    }
    // A handover can cross a long reading section. Only paint inside the actual
    // visual stages, so no intermediate shape runs across copy or artwork.
    ctx.save(); ctx.beginPath();
    ctx.rect(layoutA.box.left, layoutA.box.top, layoutA.box.width, layoutA.box.height);
    if (following !== chapter) ctx.rect(layoutB.box.left, layoutB.box.top, layoutB.box.width, layoutB.box.height);
    ctx.clip();
    // Arrival: ash rises through the stage and settles into the letters, warming to red
    // (Elton's 2019 work used ash and fire). Reduced motion shows the letters at once.
    var ash = reduced ? 0 : Math.max(0, Math.min(1, 1 - (t - .3) / 1.7));
    var ca = colors[a], cb = colors[b], k = reduced ? 1 : .11, size = W < 760 ? 1.5 : 1.7;
    for (var i = 0; i < N; i++) {
      var ta = placePoint(a, i, t, placedA), ax = ta[0], ay = ta[1];
      var tb = placePoint(b, i, t, layoutB), tx = ax + (tb[0] - ax) * f, ty = ay + (tb[1] - ay) * f;
      var settle = jitter[i] * .9 + .12, warm = ash > 0 ? Math.max(0, Math.min(1, (settle - ash) / .12)) : 1;
      if (ash > settle) {
        var rise = (t * (24 + jitter[i] * 46) + jitter[i] * region.height * 3) % region.height;
        px[i] = tx + Math.sin(t * 1.6 + i) * (6 + jitter[i] * 14);
        py[i] = region.top + region.height - rise;
      } else { px[i] += (tx - px[i]) * k; py[i] += (ty - py[i]) * k; }
      var o = i * 3, grey = 118 + jitter[i] * 74;
      var r = ca[o] + (cb[o] - ca[o]) * f, g = ca[o + 1] + (cb[o + 1] - ca[o + 1]) * f, bl = ca[o + 2] + (cb[o + 2] - ca[o + 2]) * f;
      if (warm < 1) { r = grey + (r - grey) * warm; g = grey * .95 + (g - grey * .95) * warm; bl = grey * .9 + (bl - grey * .9) * warm; }
      ctx.fillStyle = 'rgb(' + (r | 0) + ',' + (g | 0) + ',' + (bl | 0) + ')';
      ctx.fillRect(px[i], py[i], size, size);
    }
    ctx.restore();
    if (!reduced) requestFrame();
  }

  function resize() {
    DPR = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    if (images.word) build();
    requestFrame();
  }
  var rt; addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 150); });

  function lettersImage(imgs) { // one canvas holding the six letters at a shared height
    if (imgs.some(function (im) { return !im; })) return null;
    var h = 240, gap = 26, w = 0;
    var sizes = imgs.map(function (im) { var iw = im.width * h / im.height; w += iw; return iw; });
    var c = document.createElement('canvas'); c.width = Math.ceil(w + gap * (imgs.length - 1)); c.height = h;
    var g = c.getContext('2d'), x = 0;
    imgs.forEach(function (im, k) { g.drawImage(im, x, 0, sizes[k], h); x += sizes[k] + gap; });
    return c;
  }
  var letterSrc = ['e', 'k', 's', 't', 'a', 'z'].map(function (l) { return load('assets/letters/' + l + '.png'); });
  Promise.all([Promise.all(letterSrc), load('assets/wordmark-crimson.png'), load('assets/marks/cross.png'), load('assets/mark-e.png'), load('assets/art/pain-sm.jpg'), load('assets/marks/star.png')]).then(function (r) {
    images.word = lettersImage(r[0]) || r[1]; images.e = r[2] || r[3]; images.art = r[4]; images.star = r[5];
    document.documentElement.classList.add('signal-staged');
    document.documentElement.classList.add('signal-ready');
    resize(); build(); ready = true; requestFrame();
  });
  resize();
  requestFrame();
  function motionChanged() { reduced = motionQuery.matches; requestFrame(); }
  if (motionQuery.addEventListener) motionQuery.addEventListener('change', motionChanged);
  else if (motionQuery.addListener) motionQuery.addListener(motionChanged);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopFrame(); else requestFrame();
  });

  // ---------- sound: drone.js owns it; the field reads its waveform and opens the tone with scroll ----------
  addEventListener('scroll', function () {
    var D = window.EKSTAZ_DRONE; if (D) D.tone(progress() / (S - 1));
    if (reduced) requestFrame();
  }, { passive: true });

  // ---------- carry: join + personal mark ----------
  var form = document.getElementById('join'), status = document.getElementById('join-status');
  var card = document.getElementById('card'), sig = document.getElementById('sigil'), current = 0;
  var returnMark = document.getElementById('return-mark');
  var cardNote = document.getElementById('card-note'), markLink = document.getElementById('mark-link');
  var carrierKey = 'ekstaz-carrier-number';
  var shareFile = null, cardVersion = 0;

  function carrierNumber(value) {
    if (typeof value !== 'number' && (typeof value !== 'string' || !/^\d+$/.test(value))) return 0;
    var n = Number(value);
    return Number.isSafeInteger(n) && n > 0 ? n : 0;
  }
  function updateReturnMark(n) {
    if (!returnMark) return;
    returnMark.hidden = !n;
    if (n) returnMark.href = '/?n=' + n;
  }
  function rememberCarrier(n) {
    try { localStorage.setItem(carrierKey, String(n)); } catch (e) {}
    updateReturnMark(n);
  }
  // Only a successful signup records a carrier number. Shared mark links are previews.
  try { updateReturnMark(carrierNumber(localStorage.getItem(carrierKey))); } catch (e) {}

  function note(message) { if (cardNote) cardNote.textContent = message; }
  function markURL() {
    var url = new URL('/', location.href);
    url.searchParams.set('n', String(current));
    return url.href;
  }
  var grain = null; load('assets/grain.png').then(function (im) { grain = im; });

  function renderCard(n) {
    current = n;
    var version = ++cardVersion;
    shareFile = null; shareBtn.hidden = true;
    if (markLink) { markLink.hidden = true; markLink.value = markURL(); }
    note('№' + String(n).padStart(3, '0') + ' · Save your image or keep its link.');
    sig.setAttribute('aria-label', 'EKSTAZ signal mark №' + String(n).padStart(3, '0'));
    var g = sig.getContext('2d'), w = sig.width, h = sig.height, ink = '#060404';
    g.fillStyle = ink; g.fillRect(0, 0, w, h);
    if (grain) { g.globalAlpha = .5; g.fillStyle = g.createPattern(grain, 'repeat'); g.fillRect(0, 0, w, h); g.globalAlpha = 1; }
    drawSigil(g, sigil(n), w / 2, 560, 400, ink, '#df0500');
    g.fillStyle = '#f1e9e3'; g.textAlign = 'center';
    g.font = '800 132px "Bodoni Moda", Georgia, serif';
    g.fillText('№' + String(n).padStart(3, '0'), w / 2, 1140);
    g.font = '700 26px "Space Mono", monospace'; g.fillStyle = '#b9aaa3';
    g.fillText('E K S T A Z   ·   C A R R I E R', w / 2, 1200);
    g.fillStyle = '#ff3b2f'; g.fillText('ekstaz.art', w / 2, 1290);
    // Prepare the file before the click: awaiting toBlob in the click can lose
    // the user activation required by mobile sharing.
    if (navigator.share && navigator.canShare && typeof File === 'function') {
      blob().then(function (b) {
        if (!b || version !== cardVersion) return;
        var file = new File([b], fileName(n), { type: 'image/png' });
        try {
          if (navigator.canShare({ files: [file] })) {
            shareFile = file; shareBtn.hidden = false;
          }
        } catch (e) {}
      });
    }
  }
  function openCard(n) {
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
      renderCard(n);
      if (!card.open) card.showModal();
      stopFrame();
    });
  }
  function blob() { return new Promise(function (ok) { sig.toBlob(ok, 'image/png'); }); }
  var fileName = function (n) { return 'ekstaz-signal-' + String(n || current).padStart(3, '0') + '.png'; };
  document.getElementById('save').addEventListener('click', function () {
    var name = fileName();
    (shareFile ? Promise.resolve(shareFile) : blob()).then(function (b) {
      if (!b) { note('The image could not be saved. Keep its link instead.'); return; }
      var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name;
      a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      note('Your image is ready to save.');
    }).catch(function () { note('The image could not be saved. Keep its link instead.'); });
  });
  var shareBtn = document.getElementById('share');
  shareBtn.hidden = true;
  function shareFailure(error) {
    if (!error || error.name !== 'AbortError') note('Sharing could not open. Save your image or copy its link.');
  }
  shareBtn.addEventListener('click', function () {
    if (!shareFile || !navigator.share) return;
    try {
      navigator.share({ files: [shareFile], text: 'ekstaz.art' }).then(function () {
        note('Your signal has been shared.');
      }, shareFailure);
    } catch (error) { shareFailure(error); }
  });
  var copyBtn = document.getElementById('copy-mark-link');
  function showMarkLink() {
    if (markLink) {
      markLink.value = markURL(); markLink.hidden = false;
      markLink.focus(); markLink.select();
    }
    note('Select and copy your signal link.');
  }
  if (copyBtn) copyBtn.addEventListener('click', function () {
    if (!current) return;
    if (!navigator.clipboard || !navigator.clipboard.writeText) { showMarkLink(); return; }
    try {
      navigator.clipboard.writeText(markURL()).then(function () {
        note('Your signal link is copied.');
      }, showMarkLink);
    } catch (e) { showMarkLink(); }
  });
  document.getElementById('close').addEventListener('click', function () { card.close(); });
  card.addEventListener('close', requestFrame);

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { status.textContent = 'That email doesn’t look right.'; return; }
    if (!form.consent.checked) { status.textContent = 'Tick the box to agree to updates first.'; return; }
    var btn = form.querySelector('button'); btn.disabled = true; status.textContent = 'Joining the list…';
    fetch('/api/join', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email, consent: true, website: form.website.value }) })
      .then(function (res) { return res.json().catch(function () { return {}; }).then(function (d) { if (!res.ok) throw new Error(d.error || 'Something went wrong. Try again.'); return d; }); })
      .then(function (d) {
        var n = carrierNumber(d.number);
        if (!n) throw new Error('Your number could not be retrieved. Try again in a minute.');
        rememberCarrier(n);
        status.textContent = (d.existing ? 'You’re already on the list. ' : 'You’re on the list. ') + 'Your number is №' + String(n).padStart(3, '0') + '.';
        form.reset(); openCard(n);
      })
      .catch(function (err) { status.textContent = err.message || 'Couldn’t reach the list. Try again in a minute.'; })
      .finally(function () { btn.disabled = false; });
  });

  // Enable only after the submit handler is installed: no-JS visitors never send a GET email.
  form.querySelector('button[type="submit"]').disabled = false;

  // Preview a mark without signing up: /?n=7
  var qn = carrierNumber(new URLSearchParams(location.search).get('n'));
  if (qn) openCard(qn);

  window.__ekstazSignal = { sigil: sigil, progress: progress, states: S };
})();
