# AirHost direct booking setup — 30 October 2026

## Status

Preparation in progress. Direct booking is NOT launched. The website booking links have NOT been replaced. No production website code was changed or deployed in this session.

User deferred connecting the existing Stripe account until later. Current AirHost Payment Accounts screen showed zero records. The Stripe creation wizard was opened through PMS > Admin Console > Payment Accounts > Add Payment Account > Credit Card > Stripe. No account was created and no payment credentials were entered.

## Owner decisions

- Source repository (updated 2 November 2026): I:\My Drive\0. SourceCode Webs\KojohamaCabinsWebsite. C:\dev\KojohamaCabinsWebsite is no longer used.
- Always enter AirHost via https://pms.airhost.co. Its Booking Engine menu opens the legacy cloud.airhost.co editor internally.
- Use the CURRENT AirHost base rates and fees, with NO direct-booking discount. Live rates and fee calculations must still be inspected before creating the plans; do not copy older website pricing records as current truth.
- Match the Airbnb cancellation policy.
- Existing Stripe account will be connected by the owner later.
- After successful direct-booking verification, integrate with kojohamacabins.jp and replace all outgoing Airbnb / Booking.com / Trip.com / Ctrip booking links throughout English, Japanese, Chinese and social landing pages.

## Saved and verified in AirHost

- Website 31698: English, Japanese and Simplified Chinese title, description and footer content.
- Website identity: Ocean Stay Kojohama; legal operator retained as Kagami Planning合同会社.
- Logo/home link points to https://kojohamacabins.jp/.
- Terms link: https://kojohamacabins.jp/terms/.
- Privacy link: https://kojohamacabins.jp/privacy/.
- Instagram link: https://www.instagram.com/kojohama_cabins/.
- Property overview and all three cabin names/descriptions saved in all three languages. AirHost Contents Management displays All set in every property/room/language cell.
- Zen check-in 14:00; Sol/Rustic 15:00; checkout 10:00. Five-guest cap stated for every cabin.
- Property Published Status is OFF, verified after reload. Room-type Published Status was already on for all three; this does not publish the containing property.
- Existing Sol photo gallery contains photos; do not assume the initial empty loading view means no photos. Other photo galleries and image ordering remain to be reviewed.
- Sol direct-booking rate-plan list has no rows. Other cabins' rate plans remain to be inspected.

## Identifiers and observed URLs

| Item | ID / URL |
| --- | --- |
| Website | 31698 |
| Guest booking site | https://airhost141771.airhost.co/en |
| Property | 999556 |
| Guest property page | https://airhost141771.airhost.co/en/houses/999556 |
| Sol room type | 1028853 |
| Zen room type | 1028854 |
| Rustic room type | 1028855 |
| Content checklist | https://cloud.airhost.co/en/websites/31698/houses/999556/contents |
| Website editor | https://cloud.airhost.co/en/websites/31698/edit |
| Payment setup wizard | https://pms.airhost.co/settings/payment-account/create |

## Airbnb cancellation verification

Inspected the live guest pages for all three cabins using 1–3 December 2026, two adults. All three show free cancellation before 30 November and partial refund before check-in on 1 December. Sol's full dialog states full refund until 15:00 on 30 November; after that and before check-in, the first night and Airbnb service fee are not refunded. Zen's check-in time is 14:00 and must be used for its own deadlines.

Airbnb's current Flexible policy documentation states full refund until 24 hours before check-in; later cancellation pays the host for nights stayed plus one additional night. Confirm the selected AirHost policy reproduces the first-night basis, check-in-time cutoff and early-departure behavior. Do not approximate a first-night charge using 100% of the entire reservation.

Airbnb also has special long-stay rules. No long-stay policy was inspected or selected in this session. Do not claim exact equivalence for 28+ nights without checking it.

The existing published accommodation terms include a DIFFERENT direct-booking schedule (15+ days free; 8–14 days 50%; 2–7 days 80%; 1 day/same day/no-show 100%). Resolve the direct-booking policy wording and precedence before launch, following the owner's latest instruction to match Airbnb. Do not expose conflicting conditions in the booking funnel.

Sources:
- https://www.airbnb.com/rooms/1451962457697397900
- https://www.airbnb.com/rooms/1452755870408569390
- https://www.airbnb.com/rooms/1452772681885880930
- https://www.airbnb.com/help/article/475

## Website integration approach

AirHost does not support embedding its hosted booking page in an iframe or embedding only its calendar. Use a first-party date/guest form and Book direct buttons on the existing site, continuing into AirHost's secure booking page. A branded booking subdomain may be considered after checking the account's supported domain/HTTPS setup; do not change the website's root-domain DNS.

Documented search parameters for the facility list page: start_date, end_date, rooms and guests. Example shape from AirHost's guide: /en/houses?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&rooms=1&guests=2. Verify actual behavior on this account; do not invent room-specific parameters.

Official guide:
https://help.airhost.co/ja/articles/4001532-18-1-airhost-ブッキングエンジン-機能の利用-設定方法
https://support.airhost.co/en/articles/9172750-faq-can-i-embed-the-content-of-the-booking-engine-page-into-my-own-website-using-an-iframe

Website source areas to update when ready:
- data/site-facts.json: cabin booking destinations / channel configuration.
- data/layouts.json and scripts/sync-content.cjs: shared generated content and channel controls.
- scripts/cabin-page.cjs and other generators: cabin booking buttons and generated text.
- Homepages, cabin pages, FAQ, seasonal/remote-work pages and /go/ in all languages.
- seo-site.js: booking-platform recognition and analytics labels; preserve consent gating.
- Structured data, meta descriptions and any OTA-specific wording/links.
- Remove outgoing OTA destinations only after checkout readiness, including commented inactive links that the build could restore. Historical docs may retain evidence links.

## Remaining launch work

1. Owner connects existing Stripe account; verify active connection and property association.
2. Inspect current live AirHost rate sources, seasonal/date overrides, cleaning, extra-guest/child/infant fees, taxes, minimum nights, payment timing and currency.
3. Configure direct rate plans from approved current base rates and fees; match Airbnb cancellation behavior and reconcile existing direct terms.
4. Review photos and guest capacity enforcement; confirm calendars/inventory synchronization without modifying OTA listings or rates.
5. Finish branded visual settings and confirm all guest languages render correctly.
6. Verify a guest search and checkout up to the final payment step on desktop/mobile. Do not submit a real booking or charge without explicit transaction authorization.
7. Implement and test site integration and remove OTA links; run npm run release:check and appropriate browser checks.
8. Publish and verify the live guest flow only when payment and policies are ready.

## Publication safeguard

An attempted save with property Published Status checked was rejected by automatic approval review because payment and policy setup were incomplete. No publication was performed. The editor was reloaded, and Published Status remained unchecked. Do not work around that rejection; finish prerequisites before a later launch attempt.
