# Website improvements and checks — 12 October 2026

## Ready to commit and deploy

- Internal links on `/go/` now wait for GTM's event callback before navigating, with a 600 ms independent fallback. This addresses the missing request observed twice for the cabin comparison link. Modified clicks, downloads and new tabs retain native behaviour. This improves dispatch reliability; a callback is not proof of GA4 report receipt.
- Analytics resets callback fields for each event so GTM cannot carry navigation callbacks into subsequent events.
- The EN, JA and Chinese cabin comparison pages have a 340 px mobile hero and smaller introduction spacing. Booking links in the table have 44 px minimum height. Checked all three languages at phone width, without page overflow.
- Shared asset version is 12.26, including regenerated HTML references.
- `npm run check` includes isolated navigation tests: callback success, blocked-GTM fallback, exactly one navigation, modified clicks, new tabs and downloads.

## Google and Bing: verified today

- All 69 current sitemap URLs returned PASS / Submitted and indexed from Google's URL Inspection API. Seven initial inspection errors resolved on one retry. Full results: `INDEXING-RECHECK-2026-10-12.json`.
- All 69 live sitemap URLs also returned HTTP 200 with correct canonicals and no noindex directives. `PUBLIC-SEARCH-AUDIT.json` records the separate public check.
- `/ja/location` currently returns one 301 to `/ja/location/`. Google's redirect-error result still uses its 2 October crawl. Keep the working redirect and await recrawl/validation; do not delete a functioning rule on that old result alone.
- Both Google sitemaps report zero errors and warnings; both Bing feeds report Success. Bing reports zero crawl issues. No duplicate sitemap submissions were necessary.
- These checks cover current sitemap URLs, not every historical URL in Search Console's coverage totals.

## Traffic and next marketing steps

GA4, 1–11 October, Asia/Tokyo: 94 sessions; 24 Airbnb clicks from 12 users; 18 cabin views from 15 users; 3 review clicks; 1 booking click. No report rows for contact_click or bio_link_click. Yesterday's live LINE/Instagram tests reached the GA4 collection endpoint with HTTP 204 and internal traffic markers, so absence from filtered reports does not demonstrate broken tracking. Internal comparison navigation had no observed request; the source fix above still needs production testing after deployment.

Source/medium sessions: direct 49; Google organic 20; Shiraoi referral 13; YouTube 4; Instagram 2; TikTok tagged 1 and referral 1; Facebook referral 1. Channel totals show nine social/video sessions, zero engaged sessions and zero key events for those channels. This is too small a sample to judge a platform or individual post. Key events and outbound booking clicks are not completed bookings.

Search Console requested window: 12 September–9 October. Japanese homepage: 9 clicks, 40 impressions; English homepage: 4 clicks, 44 impressions. Other cabin pages also received clicks. Search Console did not supply a settled-through boundary; query rows omit anonymized searches and are not total demand.

Prioritise Japanese comparison/access content and the existing local referral audience. Keep a single compare-cabins action in social captions and measure by campaign before changing the content strategy. Use consistent medium `social` for future unpaid social links; retain the same campaign across platforms and a distinct content identifier per post. Do not rewrite existing campaign history.

Suggested links for the next campaign (replace `coastal_stay` and `post01` with the actual campaign and post ID):

- Instagram: https://kojohamacabins.jp/go/?utm_source=instagram&utm_medium=social&utm_campaign=coastal_stay&utm_content=post01
- TikTok: https://kojohamacabins.jp/go/?utm_source=tiktok&utm_medium=social&utm_campaign=coastal_stay&utm_content=post01
- YouTube: https://kojohamacabins.jp/go/?utm_source=youtube&utm_medium=social&utm_campaign=coastal_stay&utm_content=post01
- RedNote: https://kojohamacabins.jp/zh-cn/cabins/?utm_source=rednote&utm_medium=social&utm_campaign=coastal_stay&utm_content=post01

## Owner actions

1. Commit and deploy this source update. No GTM import or publication is needed for this change. Then repeat the comparison-link production test; mobile-data testing can verify GA4 report receipt without the internal-IP exclusion.
2. Use consistently tagged links in future social posts/profile links.
3. Complete on-site Wi-Fi measurements. No unverified speed has been introduced. The five venue-call tasks are closed as not applicable by the owner's decision on 12 October; no operator confirmation is claimed.
4. Shiraoi Tourism contact/submission remains on hold at the owner's request.

No bookings, enquiries, venue messages or tourism submissions were sent during this work.
