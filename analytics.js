// One analytics entry point; previews do not load GTM or Metricool.
(() => {
  const push = (event, details = {}) => {
    window.dataLayer = window.dataLayer || [];
    // GTM data-layer version 2 remembers values. Reset click context per event.
    window.dataLayer.push({
      intent: null, booking_platform: null, cabin_name: null, destination_url: null,
      selected_language: null, contact_method: null, link_location: null, link_text: null,
      eventCallback: null, eventTimeout: null,
      event, page_path: location.pathname, page_language: document.documentElement.lang,
      ...details
    });
  };
  const navigationKey = 'kojohama-pending-bio-click';
  const queueNavigationEvent = details => {
    try {
      window.sessionStorage.setItem(navigationKey, JSON.stringify({
        details: { ...details, page_path: location.pathname, page_language: document.documentElement.lang },
        created: Date.now()
      }));
      return true;
    } catch (_) { return false; }
  };
  window.KojohamaAnalytics = { push, queueNavigationEvent };
  if (!['kojohamacabins.jp', 'www.kojohamacabins.jp'].includes(location.hostname)) return;
  window.dataLayer = window.dataLayer || [];
  // Google Consent Mode v2, set before GTM loads. Visitors in the EEA, UK and Switzerland
  // default to "denied" (no analytics cookies; Google sends cookieless pings only).
  // Everyone else keeps the current behaviour. Google applies the region list itself.
  function gtag() { window.dataLayer.push(arguments); }
  const consent = value => ({ ad_storage: value, analytics_storage: value, ad_user_data: value, ad_personalization: value });
  gtag('consent', 'default', consent('granted'));
  gtag('consent', 'default', { ...consent('denied'), region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','IS','LI','NO','GB','CH'] });
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  // Dispatch after arriving, where page unload cannot interrupt the request.
  // Remove before dispatch so refreshes cannot send the same click twice.
  try {
    const raw = window.sessionStorage.getItem(navigationKey);
    window.sessionStorage.removeItem(navigationKey);
    if (raw) {
      const pending = JSON.parse(raw);
      const destination = new URL(pending.details.destination_url);
      const age = Date.now() - pending.created;
      if (age >= 0 && age < 300000 && destination.origin === location.origin &&
          destination.pathname === location.pathname && destination.search === location.search) {
        push('bio_link_click', pending.details);
      }
    }
  } catch (_) { /* Storage restrictions or stale data must not affect browsing. */ }
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-5W8ZJPTD';
  document.head.appendChild(script);
  // Metricool has no consent mode: skip it for visitors whose device clock is set to a European time zone.
  let timeZone = '';
  try { timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (_) { /* Older browsers */ }
  if (/^Europe\/|^Atlantic\/(Canary|Madeira|Azores|Reykjavik|Faroe)$/.test(timeZone)) return;
  const metricool = document.createElement('script');
  metricool.async = true;
  metricool.src = 'https://tracker.metricool.com/resources/be.js';
  metricool.onload = () => {
    if (window.beTracker && typeof window.beTracker.t === 'function') {
      window.beTracker.t({ hash: 'ffd44c179566f41dd21d51d09878d58d' });
    }
  };
  document.head.appendChild(metricool);
})();
