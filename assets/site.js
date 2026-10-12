/* Mx. Coad CS Resources — shared behaviour.
   Load in <head> (not deferred) so the theme is set before the page paints:
     <link rel="stylesheet" href="/assets/site.css">
     <script src="/assets/site.js"></script>
   Sets data-theme="light"|"dark" on <html> (saved choice, else the device
   setting) and inserts the shared site bar at the top of <body>.
   A page can opt out of the bar with <body data-ms-bar="off">. */
(function () {
  var KEY = 'ms-theme';
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function current() {
    var s = saved();
    if (s === 'light' || s === 'dark') return s;
    return media && media.matches ? 'dark' : 'light';
  }
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var btn = document.querySelector('.ms-theme');
    if (btn) {
      var next = theme === 'dark' ? 'light' : 'dark';
      btn.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      btn.querySelector('.ms-theme-label').textContent = next === 'dark' ? 'Dark mode' : 'Light mode';
      btn.querySelector('.ms-icon-moon').style.display = next === 'dark' ? '' : 'none';
      btn.querySelector('.ms-icon-sun').style.display = next === 'dark' ? 'none' : '';
    }
    document.dispatchEvent(new CustomEvent('ms-themechange', { detail: { theme: theme } }));
  }

  apply(current());
  if (media && media.addEventListener) {
    media.addEventListener('change', function () { if (!saved()) apply(current()); });
  }

  var STAGES = [
    ['ks3', 'KS3'], ['gcse', 'GCSE'], ['alevel', 'A-Level'], ['btec', 'BTEC IT'], ['tools', 'Tools']
  ];

  function buildBar() {
    if (document.body.getAttribute('data-ms-bar') === 'off' || document.querySelector('.ms-bar')) return;
    // Pages shown inside another page (e.g. a lesson in the Velocity FC panel) don't need a second bar
    try { if (window.self !== window.top) return; } catch (e) { return; }
    var nav = STAGES.map(function (s) {
      return '<a href="/#' + s[0] + '"><span class="ms-dot" aria-hidden="true" style="background:var(--ks-' + s[0] + ')"></span>' + s[1] + '</a>';
    }).join('');
    var bar = document.createElement('div');
    bar.className = 'ms-bar';
    bar.innerHTML =
      '<div class="ms-bar-inner">' +
        '<a class="ms-brand" href="/">Mx. Coad<span>· Computer Science</span></a>' +
        '<nav class="ms-nav" aria-label="Key stages">' + nav + '</nav>' +
        '<button type="button" class="ms-theme">' +
          '<svg class="ms-icon-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
          '<svg class="ms-icon-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>' +
          '<span class="ms-theme-label"></span>' +
        '</button>' +
      '</div>';
    document.body.insertBefore(bar, document.body.firstChild);
    bar.querySelector('.ms-theme').addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
    });
    apply(root.getAttribute('data-theme'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildBar);
  } else {
    buildBar();
  }
})();
