// Google Analytics runs by default, except for browsers that send Global
// Privacy Control or visitors who opted out on /privacy. An element with
// [data-analytics-optout] toggles the opt-out and shows the current state.
(function () {
  var GA_ID = 'G-XXT980GLW8';
  var KEY = 'hasht_analytics_optout';
  var gpc = navigator.globalPrivacyControl === true;

  function optedOut() {
    try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; }
  }

  function load() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
  }

  function clearCookies() {
    window['ga-disable-' + GA_ID] = true;
    var host = location.hostname;
    var domains = [host, '.' + host, '.' + host.split('.').slice(-2).join('.')];
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name !== '_ga' && name.indexOf('_ga_') !== 0) return;
      document.cookie = name + '=; Max-Age=0; path=/';
      domains.forEach(function (d) { document.cookie = name + '=; Max-Age=0; path=/; domain=' + d; });
    });
  }

  if (!gpc && !optedOut()) load();

  function render(el) {
    if (gpc) {
      el.textContent = 'Analytics is off because your browser sends Global Privacy Control.';
      el.removeAttribute('href');
    } else {
      el.textContent = optedOut() ? 'Analytics is off on this browser. Turn it back on' : 'Opt out of analytics on this browser';
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-analytics-optout]').forEach(function (el) {
      render(el);
      el.addEventListener('click', function (e) {
        e.preventDefault();
        if (gpc) return;
        try {
          if (optedOut()) localStorage.removeItem(KEY);
          else { localStorage.setItem(KEY, '1'); clearCookies(); }
        } catch (err) { /* storage blocked: nothing to persist */ }
        render(el);
      });
    });
  });
})();
