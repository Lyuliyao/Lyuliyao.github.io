/*
 * Shared site behaviour:
 *  - bilingual EN/中文 toggle, persisted across pages via localStorage
 *  - loads the shared sidebar menu (side.html) into #navbar-placeholder
 */
(function () {
  var KEY = 'site-lang';

  function stored() {
    try {
      return localStorage.getItem(KEY) === 'zh' ? 'zh' : 'en';
    } catch (e) {
      return 'en';
    }
  }

  function apply(lang) {
    try {
      localStorage.setItem(KEY, lang);
    } catch (e) { /* private mode */ }

    var els = document.querySelectorAll('[data-lang]');
    for (var i = 0; i < els.length; i++) {
      els[i].hidden = els[i].getAttribute('data-lang') !== lang;
    }

    var toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.setAttribute('aria-pressed', lang === 'zh' ? 'true' : 'false');
      toggle.textContent = lang === 'zh' ? 'English' : '中文';
    }

    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');

    var titleEl = document.querySelector('title');
    if (titleEl) {
      var t = titleEl.getAttribute('data-' + lang);
      if (t) {
        document.title = t;
      }
    }
  }

  function init() {
    var toggle = document.getElementById('langToggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        apply(stored() === 'en' ? 'zh' : 'en');
      });
    }

    var placeholder = document.getElementById('navbar-placeholder');
    if (placeholder && window.fetch) {
      fetch('side.html')
        .then(function (r) { return r.text(); })
        .then(function (text) {
          placeholder.innerHTML = text;
          apply(stored()); // cover the freshly injected menu
        })
        .catch(function () { /* offline preview: keep page usable */ });
    }

    apply(stored());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
