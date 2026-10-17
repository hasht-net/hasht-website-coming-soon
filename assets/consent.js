// Google Analytics loads only after the visitor opts in, and never when the
// browser sends a Global Privacy Control signal. Any element with
// [data-cookie-settings] reopens the choice.
(function () {
  var GA_ID = 'G-XXT980GLW8';
  var KEY = 'hasht_analytics_consent';
  var gpc = navigator.globalPrivacyControl === true;

  function read() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function write(v) {
    try { localStorage.setItem(KEY, v); } catch (e) { /* choice just won't persist */ }
  }

  var loaded = false;
  function loadAnalytics() {
    if (loaded) return;
    loaded = true;
    window['ga-disable-' + GA_ID] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function stopAnalytics() {
    window['ga-disable-' + GA_ID] = true;
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name === '_ga' || name.indexOf('_ga_') === 0) {
        var host = location.hostname;
        [host, '.' + host, '.' + host.split('.').slice(-2).join('.')].forEach(function (d) {
          document.cookie = name + '=; Max-Age=0; path=/; domain=' + d;
        });
        document.cookie = name + '=; Max-Age=0; path=/';
      }
    });
  }

  var style = document.createElement('style');
  style.textContent =
    '.consent{position:fixed;left:16px;right:16px;bottom:16px;z-index:100;max-width:520px;margin-left:auto;' +
    'background:#1c1d21;color:#dbdee1;border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:18px 20px;' +
    'box-shadow:0 12px 40px -8px rgba(0,0,0,.6);font:500 .92rem/1.55 Manrope,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}' +
    '.consent p{margin:0 0 14px}.consent a{color:#99a2f5}' +
    '.consent-actions{display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap}' +
    '.consent button{font:700 .9rem Manrope,-apple-system,sans-serif;padding:9px 16px;border-radius:10px;cursor:pointer;border:1px solid transparent}' +
    '.consent .accept{background:#414fd4;color:#fff}.consent .accept:hover{background:#313aa0}' +
    '.consent .decline{background:#24262b;color:#dbdee1;border-color:rgba(255,255,255,.16)}' +
    '.consent button:focus-visible{outline:2px solid #99a2f5;outline-offset:2px}';
  document.head.appendChild(style);

  var banner;
  function close() {
    if (banner) { banner.remove(); banner = null; }
  }
  function show() {
    close();
    banner = document.createElement('div');
    banner.className = 'consent';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Analytics cookies');
    var actions;
    if (gpc) {
      banner.innerHTML = '<p>Your browser is sending a Global Privacy Control signal, so analytics stay off on this site. ' +
        '<a href="/privacy#website">Learn more</a></p>';
      actions = '<button type="button" class="accept" data-choice="ok">OK</button>';
    } else {
      banner.innerHTML = '<p>We\'d like to use Google Analytics cookies to see which pages people visit. ' +
        'It\'s off unless you allow it, and it never runs in the hasht apps. <a href="/privacy#website">Learn more</a></p>';
      actions = '<button type="button" class="decline" data-choice="denied">Decline</button>' +
        '<button type="button" class="accept" data-choice="granted">Allow analytics</button>';
    }
    banner.innerHTML += '<div class="consent-actions">' + actions + '</div>';
    banner.addEventListener('click', function (e) {
      var choice = e.target.getAttribute && e.target.getAttribute('data-choice');
      if (!choice) return;
      if (choice === 'granted') { write('granted'); loadAnalytics(); }
      else if (choice === 'denied') { write('denied'); stopAnalytics(); }
      close();
    });
    document.body.appendChild(banner);
  }

  function init() {
    var choice = read();
    if (!gpc && choice === 'granted') loadAnalytics();
    else if (!gpc && choice !== 'denied') show();
    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); show(); }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
