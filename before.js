// EKSTAZ — Before. Elton's 2019 room: each piece starts as ash and its colour returns
// when it is reached. Without JavaScript, or with reduced motion, it is shown in colour.
(function () {
  'use strict';
  var room = document.getElementById('before');
  if (!room || !('IntersectionObserver' in window)) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var pieces = room.querySelectorAll('.before-room, .before-piece, .before-hands');
  room.classList.add('before-ash');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-lit');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -30% 0px', threshold: .35 });
  pieces.forEach(function (piece) { io.observe(piece); });
})();
