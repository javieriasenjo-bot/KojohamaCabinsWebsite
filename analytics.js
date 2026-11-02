// Analytics on by default (opt-out): Google Analytics loads unless this browser declined.
// Metricool's web tracker stays opt-in (loads only after Accept).
// Advertising consent is always denied. In the EEA, UK and Switzerland Google's
// consent-mode region default keeps analytics storage denied until the visitor accepts.
(() => {
  const production = ['kojohamacabins.jp', 'www.kojohamacabins.jp'].includes(location.hostname);
  const key = 'kojohama-analytics-choice-v1', navigationKey = 'kojohama-pending-bio-click';
  const lifetime = 180 * 86400000;
  // Region codes where analytics storage starts denied (EEA + UK + CH), resolved by Google from the request.
  const consentRegions = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IS', 'IE', 'IT', 'LV', 'LI', 'LT', 'LU', 'MT', 'NL', 'NO', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'GB', 'CH'];
  let choice = null, loaded = false, metricoolLoaded = false, pendingView = null;
  if (production) try {
    const stored = JSON.parse(window.localStorage.getItem(key));
    const age = Date.now() - stored?.saved;
    if (stored?.version === 1 && typeof stored.allowed === 'boolean' && age >= 0 && age < lifetime) choice = stored.allowed;
  } catch (_) { /* An unavailable preference store keeps the default (analytics on, Metricool off). */ }
  const active = () => choice !== false;
  const push = (event, details = {}) => {
    if (production && !active()) return;
    if (production && !loaded) {
      if (event === 'cabin_view') pendingView = details;
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      intent: null, booking_platform: null, cabin_name: null, destination_url: null,
      selected_language: null, contact_method: null, link_location: null, link_text: null,
      eventCallback: null, eventTimeout: null,
      event, page_path: location.pathname, page_language: document.documentElement.lang, ...details
    });
  };
  const queueNavigationEvent = details => {
    if (production && !active()) return false;
    try {
      window.sessionStorage.setItem(navigationKey, JSON.stringify({
        details: { ...details, page_path: location.pathname, page_language: document.documentElement.lang }, created: Date.now()
      }));
      return true;
    } catch (_) { return false; }
  };
  window.KojohamaAnalytics = { push, queueNavigationEvent };
  if (!production) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  const ads = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  // Region-specific default first, then the general default (Google applies the most specific match).
  gtag('consent', 'default', { analytics_storage: 'denied', ...ads, region: consentRegions });
  gtag('consent', 'default', { analytics_storage: 'granted', ...ads });
  function loadMetricool() {
    if (metricoolLoaded || choice !== true) return;
    metricoolLoaded = true;
    const metricool = document.createElement('script');
    metricool.async = true; metricool.src = 'https://tracker.metricool.com/resources/be.js';
    metricool.onload = () => {
      if (choice === true && window.beTracker && typeof window.beTracker.t === 'function') window.beTracker.t({ hash: '1f12ad07e125ef58f7265e4b7371949b' });
    };
    document.head.appendChild(metricool);
  }
  function load() {
    if (!active()) return;
    // An explicit Accept also grants analytics storage in consent regions.
    if (choice === true) gtag('consent', 'update', { analytics_storage: 'granted', ...ads });
    if (!loaded) {
      loaded = true;
      window['ga-disable-G-30NYR8WMT3'] = false;
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      try {
        const raw = window.sessionStorage.getItem(navigationKey);
        window.sessionStorage.removeItem(navigationKey);
        if (raw) {
          const pending = JSON.parse(raw), destination = new URL(pending.details.destination_url), age = Date.now() - pending.created;
          if (age >= 0 && age < 300000 && destination.origin === location.origin && destination.pathname === location.pathname && destination.search === location.search) push('bio_link_click', pending.details);
        }
      } catch (_) { /* Stale or blocked storage must not affect navigation. */ }
      const script = document.createElement('script');
      script.async = true; script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-5W8ZJPTD';
      document.head.appendChild(script);
      if (pendingView) { const view = pendingView; pendingView = null; push('cabin_view', view); }
    }
    loadMetricool();
  }
  const language = document.documentElement.lang;
  const prefix = language === 'ja' ? '/ja' : language === 'zh-CN' ? '/zh-cn' : '';
  const text = {
    en: ['Analytics settings', 'We use Google Analytics to understand visits and booking-link clicks. Advertising and personalisation are never enabled. You can turn analytics off at any time; booking and contact links work either way. Accepting also enables the cookie-free Metricool tracker.', 'Accept analytics', 'Turn off analytics', 'Analytics settings', 'Privacy policy', 'Close'],
    ja: ['アクセス解析の設定', '閲覧や予約リンクの利用状況を把握するためGoogle Analyticsを使用しています。広告やパーソナライズには使用しません。解析はいつでもオフにでき、予約・お問い合わせはどちらでも利用できます。許可するとCookieを使わないMetricoolの計測も有効になります。', '解析を許可', '解析をオフにする', '解析の設定', 'プライバシーポリシー', '閉じる'],
    'zh-CN': ['统计设置', '我们使用Google Analytics了解访问情况及预订链接点击，从不用于广告或个性化。您可随时关闭统计，预订和联系链接均不受影响。允许后还会启用不使用Cookie的Metricool统计。', '允许统计', '关闭统计', '统计设置', '隐私政策', '关闭']
  }[language] || ['Analytics settings', 'We use Google Analytics to understand visits. You can turn it off at any time.', 'Accept analytics', 'Turn off analytics', 'Analytics settings', 'Privacy policy', 'Close'];
  const panel = document.createElement('section');
  panel.className = 'analytics-choice'; panel.hidden = true;
  panel.setAttribute('aria-label', text[0]);
  panel.innerHTML = `<h2>${text[0]}</h2><p>${text[1]}</p><div><button type="button" data-choice="yes">${text[2]}</button><button type="button" data-choice="no">${text[3]}</button><a href="${prefix}/privacy/">${text[5]}</a><button type="button" data-close>${text[6]}</button></div>`;
  const close = panel.querySelector('[data-close]'); close.hidden = false;
  const settings = document.createElement('button');
  settings.type = 'button'; settings.className = 'analytics-settings'; settings.textContent = text[4];
  settings.addEventListener('click', () => { panel.hidden = false; close.hidden = false; panel.querySelector('[data-choice="yes"]').focus(); });
  close.addEventListener('click', () => { panel.hidden = true; settings.focus(); });
  function decide(allowed) {
    const wasLoaded = loaded || metricoolLoaded;
    choice = allowed;
    try { window.localStorage.setItem(key, JSON.stringify({ version: 1, allowed, saved: Date.now() })); } catch (_) { /* Choice remains valid for this page only. */ }
    panel.hidden = true;
    if (allowed) load();
    else {
      window['ga-disable-G-30NYR8WMT3'] = true;
      try { window.sessionStorage.removeItem(navigationKey); } catch (_) {}
      if (wasLoaded) {
        gtag('consent', 'update', { analytics_storage: 'denied', ...ads });
        for (const cookie of document.cookie.split(';')) {
          const name = cookie.split('=')[0].trim();
          if (/^_ga(?:_|$)/.test(name)) for (const domain of ['', '; domain=' + location.hostname, '; domain=.kojohamacabins.jp']) document.cookie = `${name}=; Max-Age=0; path=/${domain}; SameSite=Lax`;
        }
        // Reload unloads the already-loaded third-party scripts; later pages remain opted out.
        location.reload();
      }
    }
    settings.focus();
  }
  panel.querySelector('[data-choice="yes"]').addEventListener('click', () => decide(true));
  panel.querySelector('[data-choice="no"]').addEventListener('click', () => decide(false));
  document.body.appendChild(panel);
  (document.querySelector('footer .legal-links') || document.querySelector('footer') || document.body).appendChild(settings);
  // No prompt on arrival. Analytics loads unless this browser turned it off.
  if (active()) load();
  else try { window.sessionStorage.removeItem(navigationKey); } catch (_) {}
})();
