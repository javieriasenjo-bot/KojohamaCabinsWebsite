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
  window.KojohamaAnalytics = { push };
  if (!['kojohamacabins.jp', 'www.kojohamacabins.jp'].includes(location.hostname)) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-5W8ZJPTD';
  document.head.appendChild(script);
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
