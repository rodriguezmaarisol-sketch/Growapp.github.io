/* We Grow App · lógica compartida: idioma, accesibilidad, menú, íconos y animaciones. */
(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } }
  };

  /* Íconos de trazo (24 px, 2 px), según el brand book */
  var I = {
    book: '<path d="M4 4h11a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M4 17a3 3 0 0 1 3-3h11"/>',
    people: '<circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="3"/><path d="M2 20c0-3 3-5 6-5s6 2 6 5M14 15.5c.6-.3 1.3-.5 2-.5 3 0 6 2 6 5"/>',
    scale: '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    cap: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    sprout: '<path d="M12 21v-9M12 12c0-4 3-7 8-7 0 4-3 7-8 7zM12 14c0-3-2-5-6-5 0 3 2 5 6 5z"/>',
    pin: '<circle cx="12" cy="10" r="3"/><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/>',
    alert: '<path d="M12 3l10 18H2z"/><path d="M12 10v4M12 17.5v.5"/>',
    child: '<circle cx="12" cy="6" r="3"/><path d="M8 21v-5l-2-3 6-2 6 2-2 3v5"/>',
    teen: '<circle cx="12" cy="5" r="3"/><path d="M12 8v7M8 21l4-6 4 6M7 12h10"/>',
    lines: '<path d="M4 6h16M4 12h10M4 18h13"/>',
    bolt: '<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
    mountain: '<path d="M3 20l6-10 4 6 3-4 5 8z"/>',
    barrier: '<rect x="3" y="8" width="18" height="6" rx="1"/><path d="M7 8l4 6M13 8l4 6M6 14v6M18 14v6"/>',
    bars: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    down: '<path d="M3 6l6 6 4-4 8 8M21 10v6h-6"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a4 4 0 0 0 0-8h-4a4 4 0 0 1 0-8h6"/>',
    battery: '<rect x="2" y="7" width="17" height="10" rx="2"/><path d="M22 11v2M6 11v2"/>',
    teach: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4M7 9h6M7 12h4"/>',
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14"/>',
    pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',
    school: '<path d="M3 10l9-6 9 6M5 10v10h14V10M10 20v-5h4v5"/>',
    hand: '<path d="M7 11l4-4a2 2 0 0 1 3 0l5 5-5 5H9"/><path d="M3 13l4 4"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    leaf: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19l7-7"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>'
  };
  function svg(name, sw, size) {
    var s = size ? ' width="' + size + '" height="' + size + '"' : '';
    return '<svg' + s + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[name] + '</svg>';
  }

  /* Idioma: el español vive en el HTML; el inglés llega con WGA.addDict() */
  var en = {}, es = {}, listeners = [];
  var lang = store.get('language') === 'en' ? 'en' : 'es';
  function captureEs() {
    $$('[data-i18n]').forEach(function (el) { var k = el.getAttribute('data-i18n'); if (!(k in es)) es[k] = el.innerHTML; });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var p = pair.split(':'), k = p[1].trim();
        if (!(k in es)) es[k] = el.getAttribute(p[0].trim()) || '';
      });
    });
    if (!('_title' in es)) es._title = document.title;
  }
  function t(k) { var d = lang === 'en' ? en : es; return (k in d) ? d[k] : (es[k] || ''); }
  function applyLang(l) {
    lang = l === 'en' ? 'en' : 'es';
    store.set('language', lang);
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-i18n')); });
    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var p = pair.split(':'); el.setAttribute(p[0].trim(), t(p[1].trim()));
      });
    });
    document.title = t('_title');
    $$('.lang button').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
    listeners.forEach(function (fn) { fn(lang); });
  }

  /* Panel de accesibilidad: letra, tamaño e interlineado (se recuerdan) */
  var fonts = { brand: '"Nunito",ui-rounded,system-ui,sans-serif', atk: '"Atkinson Hyperlegible",system-ui,sans-serif', od: '"OpenDyslexic","Nunito",sans-serif' };
  function setFont(v) { document.documentElement.style.setProperty('--page-font', fonts[v] || fonts.brand); }
  function setSize(v) { var h = document.documentElement; h.classList.remove('fs-md', 'fs-lg'); if (v === 'md' || v === 'lg') h.classList.add('fs-' + v); }
  function setLeading(v) { document.documentElement.style.setProperty('--page-leading', v); var o = $('#lh-out'); if (o) o.textContent = String(v).replace('.', lang === 'es' ? ',' : '.'); }
  function initA11y() {
    var btn = $('#a11y-btn'), panel = $('#a11y-panel');
    if (!btn || !panel) return;
    var prefs = {}; try { prefs = JSON.parse(store.get('wga-a11y') || '{}') || {}; } catch (e) { prefs = {}; }
    function save() { store.set('wga-a11y', JSON.stringify(prefs)); }
    function mark(group, v) { $$('[data-group="' + group + '"] button', panel).forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.v === v)); }); }
    if (prefs.font) { setFont(prefs.font); mark('font', prefs.font); }
    if (prefs.size) { setSize(prefs.size); mark('size', prefs.size); }
    if (prefs.leading) { setLeading(prefs.leading); $('#lh').value = prefs.leading; }
    function close() { panel.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); var open = panel.hidden; panel.hidden = !open; btn.setAttribute('aria-expanded', String(open)); });
    document.addEventListener('click', function (e) { if (!panel.hidden && !panel.contains(e.target)) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { close(); btn.focus(); } });
    $$('.choice', panel).forEach(function (g) {
      g.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b) return;
        mark(g.dataset.group, b.dataset.v);
        if (g.dataset.group === 'font') { prefs.font = b.dataset.v; setFont(b.dataset.v); } else { prefs.size = b.dataset.v; setSize(b.dataset.v); }
        save();
      });
    });
    $('#lh').addEventListener('input', function () { prefs.leading = this.value; setLeading(this.value); save(); });
  }

  /* Menú en celular */
  function initMenu() {
    var btn = $('#menu-btn'), menu = $('#mobile-menu');
    if (!btn || !menu) return;
    function set(open) { menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); }
    btn.addEventListener('click', function (e) { e.stopPropagation(); set(menu.hidden); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
    document.addEventListener('click', function (e) { if (!menu.hidden && !menu.contains(e.target)) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1080) set(false); });
  }

  /* Números que crecen al aparecer en pantalla */
  function countUp(el) {
    var to = parseFloat(el.dataset.to);
    if (reduce || isNaN(to)) return;
    var dur = 1400, t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(to * e);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }
  /* Las animaciones (números, gráficos, subrayado del título) se repiten si la persona
     vuelve a una sección después de un rato (REPLAY_MS) */
  var REPLAY_MS = 60000;
  function restartCss(root) {
    $$('.hl', root).forEach(function (h) { h.classList.remove('anim'); void h.offsetWidth; h.classList.add('anim'); });
  }
  function initReveal() {
    var targets = $$('.reveal, [data-count-group], .hero h1');
    if (!('IntersectionObserver' in window)) return;
    var last = new Map(), away = new Map();
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        if (!en.isIntersecting) { if (last.has(el)) away.set(el, true); return; }
        el.classList.remove('pre');
        var prev = last.get(el);
        if (prev !== undefined && !(away.get(el) && Date.now() - prev >= REPLAY_MS)) return;
        last.set(el, Date.now()); away.set(el, false);
        if (prev === undefined && el.matches('.hero h1')) return; /* la primera vez ya anima con CSS */
        $$('.count', el).forEach(countUp);
        if (!reduce) restartCss(el.matches('.hero h1') ? el.parentNode : el);
        el.dispatchEvent(new CustomEvent('wga:visible'));
      });
    }, { threshold: 0.25 });
    targets.forEach(function (el) {
      if (!reduce && el.classList.contains('reveal') && el.getBoundingClientRect().top > window.innerHeight) el.classList.add('pre');
      io.observe(el);
    });
  }

  /* Copiar texto (correo) */
  function initCopy() {
    $$('[data-copy]').forEach(function (b) {
      b.addEventListener('click', function () {
        var target = $(b.dataset.copy), text = target ? target.textContent.trim() : '';
        var done = function () { var old = b.innerHTML; b.textContent = t('copied') || 'Copiado'; setTimeout(function () { b.innerHTML = old; }, 1600); };
        var select = function () { var r = document.createRange(); r.selectNodeContents(target); var s = getSelection(); s.removeAllRanges(); s.addRange(r); };
        try { navigator.clipboard.writeText(text).then(done, select); } catch (e) { select(); }
      });
    });
  }

  /* Textos en inglés compartidos por todas las páginas (menú, accesibilidad, footer) */
  var common = {
    skip: 'Skip to content', logo_home: 'We Grow App, home', menu_label: 'Open menu',
    nav_home: 'Home', nav_about: 'About us', nav_tools: 'Tools', nav_luma: 'Luma', nav_schools: 'Schools', nav_faq: 'FAQ', nav_start: 'Get started', nav_login: 'Sign in',
    a11y_btn: 'Accessibility', a11y_title: 'Read your way', a11y_font: 'Font', a11y_size: 'Size', a11y_sm: 'Small', a11y_md: 'Medium', a11y_lg: 'Large', a11y_leading: 'Line spacing', a11y_panel: 'Accessibility options',
    foot_tag: 'Your zip code doesn’t define your future.', foot_follow: 'Follow us', foot_nav: 'Navigation', foot_res: 'Resources', foot_legal: 'Legal',
    foot_demo: 'Demo', foot_why: 'Why we exist', foot_faq: 'FAQ', foot_schools: 'For schools', foot_join: 'Add my school', foot_contact: 'Contact', foot_privacy: 'Privacy policy', foot_about: 'About us',
    foot_copy: '© We Grow App 2026. All rights reserved.', copied: 'Copied', copy: 'Copy'
  };
  for (var ck in common) en[ck] = common[ck];

  window.WGA = {
    I: I, svg: svg, reduce: reduce, $: $, $$: $$,
    t: t,
    get lang() { return lang; },
    addDict: function (d) { for (var k in d) en[k] = d[k]; },
    onLang: function (fn) { listeners.push(fn); },
    start: function () {
      captureEs();
      $$('.lang button').forEach(function (b) { b.addEventListener('click', function () { applyLang(b.dataset.lang); }); });
      initA11y(); initMenu(); initCopy();
      applyLang(lang);
      initReveal();
    }
  };
})();
