// Optional analytics: no third-party tracker loads before an explicit choice.
(() => {
  const production = ['kojohamacabins.jp', 'www.kojohamacabins.jp'].includes(location.hostname);
  const key = 'kojohama-analytics-choice-v1', navigationKey = 'kojohama-pending-bio-click';
  const lifetime = 180 * 86400000;
  let choice = null, loaded = false, pendingView = null;
  if (production) try {
    const stored = JSON.parse(window.localStorage.getItem(key));
    const age = Date.now() - stored?.saved;
    if (stored?.version === 1 && typeof stored.allowed === 'boolean' && age >= 0 && age < lifetime) choice = stored.allowed;
  } catch (_) { /* An unavailable preference store leaves tracking off. */ }
  const push = (event, details = {}) => {
    if (production && choice !== true) {
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
    if (production && choice !== true) return false;
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
  gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
  function load() {
    if (loaded || choice !== true) return;
    loaded = true;
    window['ga-disable-G-30NYR8WMT3'] = false;
    // Analytics permission does not grant advertising or personalization permission.
    gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
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
    const metricool = document.createElement('script');
    metricool.async = true; metricool.src = 'https://tracker.metricool.com/resources/be.js';
    metricool.onload = () => {
      if (choice === true && window.beTracker && typeof window.beTracker.t === 'function') window.beTracker.t({ hash: 'ffd44c179566f41dd21d51d09878d58d' });
    };
    document.head.appendChild(metricool);
    // The initial deferred cabin_view was intentionally discarded before consent.
    if (pendingView) { const view = pendingView; pendingView = null; push('cabin_view', view); }
  }
  const language = document.documentElement.lang;
  const prefix = language === 'ja' ? '/ja' : language === 'zh-CN' ? '/zh-cn' : '';
  const text = {
    en: ['Optional analytics', 'May we use Google Analytics and Metricool to understand visits and booking-link clicks? Booking and contact links work if you decline.', 'Accept analytics', 'Decline analytics', 'Analytics settings', 'Privacy policy', 'Close'],
    ja: ['任意のアクセス解析', 'Google AnalyticsとMetricoolを使い、閲覧や予約リンクの利用状況を調べてもよろしいですか？拒否しても予約・お問い合わせは利用できます。', '解析を許可', '解析を拒否', '解析の設定', 'プライバシーポリシー', '閉じる'],
    'zh-CN': ['可选访问分析', '是否允许Google Analytics和Metricool分析访问及预订链接点击？拒绝后仍可使用预订和联系链接。', '允许分析', '拒绝分析', '分析设置', '隐私政策', '关闭']
  }[language] || ['Optional analytics', 'Allow Google Analytics and Metricool? Booking works if you decline.', 'Accept analytics', 'Decline analytics', 'Analytics settings', 'Privacy policy', 'Close'];
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
    const wasLoaded = loaded;
    choice = allowed;
    try { window.localStorage.setItem(key, JSON.stringify({ version: 1, allowed, saved: Date.now() })); } catch (_) { /* Choice remains valid for this page only. */ }
    panel.hidden = true;
    if (allowed) load();
    else {
      window['ga-disable-G-30NYR8WMT3'] = true;
      try { window.sessionStorage.removeItem(navigationKey); } catch (_) {}
      if (wasLoaded) {
        gtag('consent', 'update', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
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
  if (choice === true) load();
  else try { window.sessionStorage.removeItem(navigationKey); } catch (_) {}
})();
