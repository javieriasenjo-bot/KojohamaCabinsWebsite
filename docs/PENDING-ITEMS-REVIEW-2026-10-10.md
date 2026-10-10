# Pending items reviewed — 10 October 2026

## Source changes ready for deployment

- Researched all 43 remaining directory entries and updated English, Japanese and Simplified Chinese. This batch establishes official published hours for 29 entries, access guidance for six outdoor destinations, and qualified information for eight entries still needing direct confirmation. Published schedules are not telephone or on-site confirmations.
- Across the complete directory, 51 entries now have published hours reviewed (including the earlier hospital review), six have access information reviewed, and eight need direct confirmation. No baseline research entries remain. The review queue is `docs/VENUE-REVIEW.csv`; this batch's sources and limitations are in `docs/REMAINING-VENUES-RESEARCH-2026-10-10.json`.
- Corrected Cowbell's first/third Tuesday closures, Iwasaki's later closing time, Hamachidori's third-Friday closure, seasonal Mina Pieno closures, Hashimoto's Friday–Sunday/public-holiday schedule, and Usu Zenkoji museum's reservation requirement. Added Lake Kuttara winter road guidance and Cape Chikyu's paid parking; removed unsupported outdoor 24-hour claims.
- The review queue now separates published hours from access guidance and records unsuccessful research attempts without treating them as verified. Public check labels explicitly refer to published information.
- Added a practical cabin choice section in all three languages, differentiating beds, tatami/kotatsu and the confirmed children/BBQ policy, with planning links.
- Added shorter/longer trip options and direct official Hell Valley information to the English Noboribetsu guide.
- Reviewed both ownership pages: they already have correct canonical URLs, hreflang, static navigation and sitemap entries; no evidence warrants redirecting or removing them solely for being unindexed. No speculative indexing fix was applied to them.

## Google indexing

Fresh connector checks during this batch: Google reports both submitted sitemaps processed with zero errors/warnings. Bing reports both retained sitemaps successful and zero crawl-issue URLs. These are provider-reported snapshots, not proof every page is indexed. No unchanged sitemap was resubmitted and no analytics settings were changed.

The 10 October URL Inspection API snapshot reports 65 of 69 current canonical pages indexed. `/cabins/` and `/zh-cn/own-a-cabin/` are discovered but not indexed; `/guides/noboribetsu-from-kojohama/` is crawled but not indexed (stored crawl 17 September); `/ja/own-a-cabin/` is unknown to Google. See `docs/INDEXING-STATUS-2026-10-10.json`.

These states do not establish a technical failure. The comparison and itinerary changes help visitors; they do not guarantee indexing. Once this release is live, optionally request indexing in Search Console for the comparison and itinerary pages first. No URL Inspection API indexing-request action exists in the available connector. Both Google sitemaps were already processed without errors; do not repeatedly resubmit unchanged sitemaps.

## Public booking-listing review

Public content available through the web reader can be cached or incomplete. This review is not a read of host-account settings or a confirmed dated price quote.

- Sol: the readable Japanese Airbnb version displays five guests and four beds, consistent with the owner-confirmed capacity. Its rules still say BBQ cannot be used.
- Zen: the readable Japanese Airbnb version displays six guests in its summary and description, and says BBQ cannot be used. This conflicts with the owner's maximum of five and BBQ by prior arrangement.
- Rustic: the reader retrieved the listing intermittently but could not reliably expose its current capacity/rules. Leave verification open.
- Ctrip: all three direct listing pages failed in the reader. Do not infer a broken listing or confirm any settings from this failure.
- Nightly price, tax treatment, cleaning inclusion and the extra-guest fee basis were not verified through a dated checkout quote.

Sources: https://www.airbnb.jp/rooms/1451962457697397900 and https://www.airbnb.jp/rooms/1452755870408569390 . No booking listing was edited, and no message was sent to the operator.

## Exact changes for the owner/booking manager

1. Set maximum guests to **5** in every cabin's booking controls and descriptions. For Zen, remove every reference to six guests.
2. Replace `BBQは利用不可です。` wherever present with:

> BBQは事前のご相談でご利用いただけます。Colemanグリルの利用料は1回3,500円です。対応するガス缶2本、食材、調理器具、その他必要なBBQ用品はお客様ご自身でご持参ください。

English equivalent:

> BBQ is available by prior arrangement. Use of our Coleman grill costs ¥3,500 per use. Guests bring two compatible gas cartridges, food, utensils and other BBQ gear.

3. Verify the pricing configuration with two dated quotes using identical dates: two guests versus three guests, and a one-night versus multi-night stay. The owner-confirmed additional charge is ¥2,500 per extra guest **per stay**, not per night. Confirm cleaning is included in the starting rate and taxes are additional; display the final platform total before booking.
4. Wi-Fi needs an on-site test in each cabin. Record download/upload, test date, room and connection type; no fresh speed number has been invented.

## Release boundary

Changes are saved in `C:\dev\KojohamaCabinsWebsite` for the user to review, commit and deploy. They are not yet production changes. Existing GTM and GA4 settings were not altered.

## Remaining venue confirmations

- Tonton and Sakuraya: conflicting/unsupported published schedules; contact the restaurants.
- Date Okina: official group page does not give current opening hours.
- Sunrise shrine: confirm its exact local identity before assigning an official website.
- Tarako vending machine: confirm this machine's availability and access arrangements.
- Kikyohara Farm: official tourism sources disagree on seasonal closing times.
- Antique Shop 36: confirm the Shiraoi branch is operating and its hours.
- Koshu Kitano Museum: recent September 2026 local reporting lists 10:00–16:00 and irregular closures; confirm directly. The guide labels this as reporting, not operator verification.

The owner can confirm these locally or send current operator information. They remain visible to visitors with qualified wording; old precise schedules were not retained as established facts.

## Additional published schedules resolved

Kojohama Cafe and Marugo were resolved through their Japanese official tourism pages. Cafe opening days still follow its current Instagram calendar; Marugo publishes Saturday/Sunday 11:00–16:30. These two additional source updates require another commit/deployment; the preceding 43-entry release was verified live.
