// One analytics entry point; previews and no-JavaScript pages do not load GTM.
(() => {
  const push = (event, details = {}) => {
    window.dataLayer = window.dataLayer || [];
    // GTM data-layer version 2 remembers values. Reset click context per event.
    window.dataLayer.push({
      intent: null, booking_platform: null, cabin_name: null, destination_url: null,
      selected_language: null, contact_method: null, link_location: null, link_text: null,
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
})();
