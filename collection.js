// Native hash routes work without JavaScript. Also accept query-only piece links.
(function () {
  'use strict';
  var piece = new URLSearchParams(location.search).get('piece');
  if (!location.hash && /^(hoodie|tee|cap)$/.test(piece || '')) {
    location.replace(location.pathname + location.search + '#' + piece);
  }
}());
