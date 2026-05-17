(function () {
  'use strict';

  var STORAGE_KEY = 'blog_lang';
  var DEFAULT_LANG = 'fr';
  var cache = {};

  function getDict(lang) {
    if (cache[lang]) return Promise.resolve(cache[lang]);
    return fetch('locales/' + lang + '.json')
      .then(function (res) {
        if (!res.ok) throw new Error('Locale load failed: ' + lang);
        return res.json();
      })
      .then(function (data) {
        cache[lang] = data;
        return data;
      });
  }

  function applyDictionary(dict) {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (key == null || dict[key] === undefined) return;
      el.textContent = dict[key];
    });

    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (key == null || dict[key] === undefined) return;
      el.innerHTML = dict[key];
    });

    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-alt');
      if (key == null || dict[key] === undefined) return;
      el.setAttribute('alt', dict[key]);
    });

    var langSelect = document.querySelector('.language');
    if (langSelect && dict['lang.aria']) {
      langSelect.setAttribute('aria-label', dict['lang.aria']);
    }
  }

  function setLang(lang) {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) { /* ignore */ }
  }

  function init() {
    var select = document.querySelector('.language');
    if (!select) return;

    var saved = DEFAULT_LANG;
    try {
      saved = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) { /* ignore */ }

    if (!['fr', 'en', 'ja'].includes(saved)) saved = DEFAULT_LANG;
    select.value = saved;
    setLang(saved);

    getDict(saved)
      .then(applyDictionary)
      .catch(function () {
        if (saved !== DEFAULT_LANG) {
          select.value = DEFAULT_LANG;
          setLang(DEFAULT_LANG);
          return getDict(DEFAULT_LANG).then(applyDictionary);
        }
      });

    select.addEventListener('change', function () {
      var lang = select.value;
      setLang(lang);
      getDict(lang)
        .then(applyDictionary)
        .catch(function () {
          console.warn('i18n: could not load', lang);
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
