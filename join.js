// Waitlist form: posts to /api/join and shows the visitor's number.
(function () {
  var form = document.getElementById('join');
  var status = document.getElementById('join-status');
  var returnMark = document.getElementById('return-mark');
  var carrierKey = 'ekstaz-carrier-number';

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
  try { updateReturnMark(carrierNumber(localStorage.getItem(carrierKey))); } catch (e) {}
  if (!form || !status) return;

  function say(text, ok) {
    status.textContent = text;
    status.className = 'join-status ' + (ok ? 'ok' : 'err');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var email = form.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      say('That email doesn’t look right.', false);
      return;
    }
    if (!form.consent.checked) {
      say('Tick the box to agree to updates first.', false);
      return;
    }
    var button = form.querySelector('button');
    button.disabled = true;

    fetch('/api/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email, consent: true, website: form.website.value })
    })
      .then(function (res) {
        return res.json().catch(function () { return {}; }).then(function (data) {
          if (!res.ok) throw new Error(data.error || 'Something went wrong. Try again.');
          return data;
        });
      })
      .then(function (data) {
        var number = carrierNumber(data.number);
        if (!number) throw new Error('Your number could not be retrieved. Try again in a minute.');
        try { localStorage.setItem(carrierKey, String(number)); } catch (e) {}
        updateReturnMark(number);
        var n = String(number).padStart(3, '0');
        say(data.existing ? 'You’re already on the list — №' + n + '.' : 'You’re in. Your number is №' + n + '.', true);
        var mark = document.createElement('a');
        mark.href = '/?n=' + number; mark.textContent = ' See your mark →';
        status.appendChild(mark);
        form.reset();
      })
      .catch(function (err) {
        say(err.message || 'Couldn’t reach the list. Try again in a minute.', false);
      })
      .finally(function () { button.disabled = false; });
  });
})();
