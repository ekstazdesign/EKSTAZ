// Original artwork, direct links, and a quiet place to look closer.
(function () {
  'use strict';
  var dlg = document.getElementById('viewer');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var links = Array.from(document.querySelectorAll('.art-open[data-art]'));
  var works = links.map(function (link) {
    var thumb = link.querySelector('img');
    return { slug: link.dataset.art, title: link.dataset.title, medium: link.dataset.medium,
      src: link.dataset.full, alt: thumb ? thumb.alt : '', link: link };
  });
  if (!works.length) return;
  var img = document.getElementById('art-image'), stage = document.getElementById('art-stage');
  var title = document.getElementById('art-title'), medium = document.getElementById('art-medium');
  var detail = document.getElementById('art-detail'), status = document.getElementById('art-status');
  var load = document.getElementById('art-load'), manual = document.getElementById('art-link');
  var related = document.getElementById('art-related');
  var closeBtn = dlg.querySelector('.viewer-close');
  var current = -1, opener = null, scrollBefore = 0, overflowBefore = '', pushed = false, closing = false;
  var baseTitle = document.title, request = 0;
  var relationships = {
    'before-thee': { href: 'magazine.html?page=10', image: 'assets/publications/page-10-sm.webp', label: 'December 2021', title: 'An earlier study →' },
    cross: { slug: 'hoodie-study', image: 'assets/art/blueprint-sm.jpg', label: 'Another study', title: 'The garment drawing →' },
    'hoodie-study': { slug: 'cross', image: 'assets/art/cross-sm.jpg', label: 'The cross', title: 'A drawing →' }
  };

  function indexForURL() {
    var slug = new URL(location.href).searchParams.get('art');
    return works.findIndex(function (work) { return work.slug === slug; });
  }
  function artworkURL(slug) {
    var url = new URL(location.href); url.searchParams.set('art', slug); url.hash = '';
    return url;
  }
  function announce(text) { status.textContent = text; }
  function fit() {
    stage.classList.remove('is-detail'); img.style.width = '';
    detail.setAttribute('aria-pressed', 'false'); detail.textContent = 'Look closer';
    stage.scrollTo(0, 0);
  }
  function show(index, fromLink) {
    if (index < 0 || index >= works.length) return;
    var opening = !dlg.open;
    if (opening) {
      opener = fromLink || works[index].link;
      scrollBefore = scrollY; overflowBefore = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    current = index; var work = works[index], token = ++request;
    fit(); manual.hidden = true; announce('');
    title.textContent = work.title; medium.textContent = work.medium;
    var reading = document.getElementById('art-reading'), text = (window.EKSTAZ_READINGS || {})[work.slug];
    if (reading) { reading.hidden = !text; document.getElementById('art-reading-text').textContent = text || ''; }
    document.getElementById('art-count').textContent = String(index + 1).padStart(2, '0') + ' / ' + String(works.length).padStart(2, '0');
    document.getElementById('art-position').textContent = String(index + 1).padStart(2, '0') + ' / ' + String(works.length).padStart(2, '0');
    document.title = work.title + ' — EKSTAZ';
    stage.classList.add('is-loading'); stage.setAttribute('aria-busy', 'true');
    detail.disabled = true; load.hidden = false; load.textContent = 'Loading the image…';
    img.onload = function () {
      if (token !== request) return;
      stage.classList.remove('is-loading'); stage.setAttribute('aria-busy', 'false');
      detail.disabled = false; load.hidden = true;
    };
    img.onerror = function () {
      if (token !== request) return;
      stage.setAttribute('aria-busy', 'false'); load.textContent = 'The image couldn’t load. Open another piece or try again.';
    };
    img.alt = work.alt; img.src = work.src;
    var r = relationships[work.slug];
    related.hidden = !r;
    if (r) {
      related.href = r.slug ? artworkURL(r.slug).href : r.href;
      related.dataset.art = r.slug || '';
      document.getElementById('art-related-image').src = r.image;
      document.getElementById('art-related-label').textContent = r.label;
      document.getElementById('art-related-title').textContent = r.title;
    } else {
      related.removeAttribute('href'); related.dataset.art = '';
      document.getElementById('art-related-image').removeAttribute('src');
    }
    document.getElementById('art-archive').hidden = work.slug !== 'cross';
    if (opening) { dlg.showModal(); closeBtn.focus({ preventScroll: true }); }
  }
  function navigate(index) {
    index = (index + works.length) % works.length;
    history.replaceState(history.state, '', artworkURL(works[index].slug));
    show(index);
  }
  function hide() {
    if (!dlg.open) return;
    dlg.close(); ++request; img.onload = img.onerror = null; img.removeAttribute('src');
    document.getElementById('art-related-image').removeAttribute('src');
    document.body.style.overflow = overflowBefore; document.title = baseTitle;
    fit();
    // History restores its own focus and scroll after popstate. Restore our opener
    // once that traversal has settled, so Back behaves like the Close control.
    var returnTo = opener, returnY = scrollBefore, restoreScroll = pushed;
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      if (dlg.open) return;
      if (restoreScroll) scrollTo({ top: returnY, behavior: 'instant' });
      else if (returnTo) returnTo.scrollIntoView({ block: 'center', behavior: 'instant' });
      if (returnTo && returnTo.isConnected) returnTo.focus({ preventScroll: true });
    }); });
  }
  function close() {
    if (!dlg.open || closing) return;
    if (pushed) { closing = true; history.back(); }
    else {
      var url = new URL(location.href); url.searchParams.delete('art'); url.hash = 'work';
      history.replaceState(history.state, '', url); hide();
    }
  }
  links.forEach(function (link, index) {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      if (dlg.open) { navigate(index); return; }
      history.pushState(history.state, '', artworkURL(works[index].slug)); pushed = true;
      show(index, link);
    });
  });
  closeBtn.addEventListener('click', close);
  dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
  document.getElementById('art-prev').addEventListener('click', function () { navigate(current - 1); });
  document.getElementById('art-next').addEventListener('click', function () { navigate(current + 1); });
  related.addEventListener('click', function (e) {
    var slug = related.dataset.art;
    if (!slug || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var index = works.findIndex(function (work) { return work.slug === slug; });
    if (index < 0) return;
    e.preventDefault(); navigate(index);
  });
  dlg.addEventListener('keydown', function (e) {
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable || stage.classList.contains('is-detail')) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault(); navigate(current + (e.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  detail.addEventListener('click', function () {
    if (stage.classList.contains('is-detail')) { fit(); return; }
    stage.classList.add('is-detail');
    img.style.width = Math.max(img.naturalWidth, stage.clientWidth * 1.8) + 'px';
    detail.setAttribute('aria-pressed', 'true'); detail.textContent = 'View whole';
    stage.scrollTo((stage.scrollWidth - stage.clientWidth) / 2, (stage.scrollHeight - stage.clientHeight) / 2);
    stage.focus({ preventScroll: true });
    announce('Scroll the image to explore its details.');
  });
  document.getElementById('art-share').addEventListener('click', function () {
    var url = artworkURL(works[current].slug).href, data = { title: works[current].title + ' — EKSTAZ', url: url };
    manual.hidden = true; announce('');
    if (typeof navigator.share === 'function') {
      navigator.share(data).then(function () { announce('Shared.'); }).catch(function (err) {
        if (err.name !== 'AbortError') fallback(url);
      });
    } else fallback(url);
  });
  function fallback(url) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(url).then(function () { announce('Link copied.'); }).catch(function () { manualLink(url); });
    } else manualLink(url);
  }
  function manualLink(url) {
    manual.value = url; manual.hidden = false; manual.focus(); manual.select();
    announce('Copy this link to share the piece.');
  }
  addEventListener('popstate', function () {
    closing = false;
    var index = indexForURL();
    if (index >= 0) { show(index); }
    else hide();
  });
  var initial = indexForURL();
  if (initial >= 0) show(initial);
})();
