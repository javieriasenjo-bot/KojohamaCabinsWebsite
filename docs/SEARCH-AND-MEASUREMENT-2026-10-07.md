# Search and measurement follow-up — 7 October 2026

## Verified evidence

The supplied Search Console workbook is an overview export, not an affected-URL export. Chart data ends on 4 October: 74 indexed, 10 not indexed (1 redirect error, 7 discovered, 2 crawled). It contains no page URLs. The redirect identified in the owner's screenshot was fixed and its production 301 independently verified. All 69 current sitemap URLs passed public HTTP 200, canonical and noindex checks. The Search Console inventory includes historical/alternate URLs and cannot be reconciled to the current sitemap count without detail exports.

## Local source changes ready to commit

- Added 68 exact permanent redirects for existing canonical sitemap pages. Canonical slash destinations are not redirected, and file routes are not captured by a wildcard.
- Corrected privacy sitemap dates to 6 October. Future builds maintain dates using hashes of main content, title and description; footer-only and whitespace edits do not force date updates. Baseline hashes preserve dates already recorded rather than inventing modification dates.
- Added an IndexNow ownership file and submission script. npm run indexnow:preview is read-only. npm run indexnow:submit submits all canonical sitemap pages only when the key and matching page contents are live.
- GitHub workflow submits changed sitemap pages after a main-branch push, waiting for live content to match the checked-out commit. Manual workflow runs can submit all sitemap pages for the initial baseline. Verification waits are bounded; failure leaves a visible failed run, not a false success. No submission has been performed yet because the new key file has not been deployed.
- Added npm run audit:search for repeatable public HTTP and canonical checks. Results are docs/PUBLIC-SEARCH-AUDIT.json, not a claim of search engine indexing.

## Tagged social destinations

Use these as profile website links where supported; do not add UTMs to internal site links:

- Instagram: https://kojohamacabins.jp/go/?utm_source=instagram&utm_medium=social&utm_campaign=bio&utm_content=link_in_bio
- TikTok: https://kojohamacabins.jp/go/?utm_source=tiktok&utm_medium=social&utm_campaign=bio
- YouTube: https://kojohamacabins.jp/go/?utm_source=youtube&utm_medium=social&utm_campaign=bio

8 October live check: Instagram and TikTok already use the first two links. Preserve their existing medium and campaign for continuity. Use full lowercase source names for new links; group historical `ig` with `instagram` in analysis, without rewriting raw exports. YouTube is a prepared link, not a verified profile update. RedNote link, where the platform permits it: https://kojohamacabins.jp/go/?utm_source=rednote&utm_medium=social&utm_campaign=bio . Its profile requires login; no profile edit was made.

Per-post Story links should retain an identifying utm_campaign and utm_content. Existing Thursday and Sunday publishing guides already include tagged Instagram Story links. RedNote publishing guidance has no external URL CTA; do not change that based on this document. Profile changes were not made in authenticated accounts.

## GA4 account work pending access

Confirm report receipt of booking_click, airbnb_click, contact_click, language_change and bio_link_click. review_click receipt is closed based on the owner's confirmation. Register event-scoped custom dimensions only if absent: cabin_name, booking_platform, intent, page_language, link_location, contact_method, selected_language. Use standard page-path reporting rather than a duplicate custom definition. If marking booking/contact clicks as key events, label them booking/enquiry intent, never completed purchases. Review clicks remain separate. Retain internal IP exclusions. Link Search Console if not already linked.

Weekly report: source/medium, landing page, engaged sessions, booking-intent sessions and contact-intent sessions. Count sessions with an intent event for rates rather than dividing repeated event counts by sessions. Actual OTA reservations require separate booking evidence; outbound clicks do not establish them.

## Google and Bing account work pending access

Export example URLs from each non-indexed reason in Search Console; overview exports cannot identify them. Verify both sitemap.xml and sitemap-zh-cn.xml are submitted and successfully fetched in Google and Bing. Confirm Bing ownership and inspect key cabin-page indexing. The current chat has no browser-control tools; opening authenticated tabs does not expose their contents. Neither Google nor Bing dashboard changes were performed. Deprecated public sitemap-ping endpoints are not a substitute for verified submissions.

References: https://www.indexnow.org/documentation ; https://developers.cloudflare.com/workers/static-assets/redirects/ ; https://support.google.com/analytics/answer/14239696?hl=en
