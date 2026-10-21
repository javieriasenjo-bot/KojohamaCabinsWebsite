# OTA and website verification 20 October 2026

Scope: read-only review of Airbnb rates, extra-guest charges, English public policies and gallery choices; Trip setup/policy fields; main website release and Cloudflare build gate. RedNote excluded. Booking.com required login and the owner explicitly said to skip it. No rates, availability, promotions, photos, policies, PMS connections or activation settings changed. No messages or support requests sent.

## Main website release closed

Current source commit a33b682. Compared all 72 current HTML files and seven root CSS/JS files with https://kojohamacabins.jp/: all 79 match after line-ending normalization. Source site/navigation/analytics/pricing checks pass. Browser suite passes mobile layouts, directory/photos/galleries, no-JavaScript handling and nine cabin/language date-checker interactions.

Cloudflare Worker kojohamawebsite, production branch main: the displayed Build command already is `npm run release:check`; Deploy command is `npx wrangler deploy`; root `/`; builds enabled. No setting was changed. This closes the previous O21 dashboard/deployment task. The current count is 72 HTML pages; older handover page counts describe different snapshots.

## Airbnb price and fee discrepancies

The host calendar says pricing/availability settings are limited and must be edited in the connected property-management software. Do not disconnect it or silently overwrite commercial settings.

All three current Airbnb fee screens show:

| Field | Observed Airbnb setting | Approved website policy |
|---|---|---|
| Extra guest | After 4 guests, ¥2,000 per night | From guest 3, ¥2,500 per person per stay |
| Cleaning | ¥7,000 per stay | ¥7,000 per stay |
| Resort fee | ¥750 per stay | Not itemized as a named fee in the approved calendar; taxes are extra |

The extra-guest discrepancy is in threshold, amount and period. The owner's earlier confirmation that ¥2,500 had been set is retained as historical evidence; the currently displayed settings conflict with it. Do not infer that the resort fee is accommodation tax or remove it without reconciliation.

Live English public quotes, 10–12 November 2026, JPY:

| Cabin | 2 guests | 3 guests | 5 guests |
|---|---:|---:|---:|
| Zen | 35,350 | 35,350 | 39,350 |
| Rustic | 37,350 | 37,350 | 41,350 |

Adding a third guest changes neither total. Five guests add ¥4,000 for two nights, consistent with the host setting. Under the approved booked-extra-guest rule, the extra accommodation charge for three guests is ¥2,500 per stay and for five guests ¥7,500 per stay, independently of platform taxes/discounts. Sol's same-date public quote was unavailable; its host fee settings are confirmed, not a completed public quote. These are listing-page observations, not a reservation or final checkout/payment audit.

Recorded 109 priced cabin/date observations from the accessible host-calendar windows; 62 differ numerically from data/date-rates.json and 47 match. This is a partial calendar comparison, not verification of all 259 nights. Examples:

| Cabin/date | Airbnb calendar | Approved calendar |
|---|---:|---:|
| Sol 22 Oct 2026 | ¥20,900 | ¥17,800 |
| Sol 23 Oct 2026 | ¥25,000 | ¥20,800 |
| Sol 25 Oct 2026 | ¥22,000 | ¥17,800 |

Some November displayed rates are also lower than the approved calendar. Discounts or channel pricing may explain some differences; none were edited. February 6–26 and 1 July 2027 views showed unavailable inventory without prices for all three cabins. That does not establish whether future rates are correctly loaded, intentionally closed or limited by a booking window. Existing bookings and closures remain untouched.

### PMS reconciliation handover

Use the approved calendar as the comparison reference, but confirm whether any channel-specific pricing/discounts are intentional before changing them. Check the exact nightly rate and arrival minimum for each date, then the extra-guest threshold and once-per-stay basis. A per-night additional-guest setting is not equivalent. Resolve the purpose and basis of the ¥750 fee. Recheck one- and two-night quotes for 2, 3 and 5 guests after any separately authorized correction. Do not collect additional payments outside platform rules or change existing reservations.

## Airbnb public policies

English guest pages for Sol, Zen and Rustic show maximum five; check-in Sol/Rustic 15:00 and Zen 14:00; checkout by 10:00; BBQ ¥3,500 per stay by prior request with compatible cartridges supplied by guests. The complete eight-clause extra cleaning/service charge wording is present, including smoking/pets ¥100,000 excluding tax, sand ¥20,000 excluding tax, unregistered guests ¥5,000/person/night, late checkout ¥5,000/30 minutes, disposal, actual damage and domestic lost-item return terms. This confirms English guest-facing publication; it is not a new independent review of every translated field or a claim that monetary policies are legally enforceable in every case.

## Airbnb gallery recommendations

Reviewed the current covers and first visible gallery rows; no images or order changed. This does not review the entire available media library.

- Zen: current cover already shows the sea with tatami/kotatsu, so the old lead-photo task is satisfied. First three photos repeat the living room. Suggested first-five story: current cover, bedroom (currently 4), coastal exterior (5), kitchen (18), bathroom (22). Keep the remaining living-room variants later.
- Sol: current cover looks into the room. Existing photo 4 shows the yellow sofa with sea-facing windows more clearly; consider it as cover, followed by bedroom (3), kitchen, bathroom and a property/coast overview. Retain all current images.
- Rustic: current cover communicates the sea-facing living area. Keep it, followed by bedroom (2), kitchen (4), bathroom and the coastal/property overview (currently 11). Several similar living-room angles can move later.
- Zen and Rustic front-on exterior shots mainly show facade/gravel; the existing coastal aerial/oblique views convey location more clearly. No need to delete the facade images, which remain useful for arrival recognition.
- Ski promotional graphics occur early in the galleries (Zen 8, Rustic 9, Sol 12). Prefer actual cabin/location photos first. Exact photo-source/licence review remains separate; no permission or removal claim is made here.

Angie reply was not requested or sent in this review. Equipment confirmation and existing owner work from other chats must not be reopened from old notes.

## Trip setup requires reconciliation before activation

Host-side policy fields freshly checked for all three properties:

| Field | Sol | Zen | Rustic |
|---|---|---|---|
| Check-in | 16:00 | 16:00 | 16:00 |
| Checkout | Before 10:00 | Before 10:00 | Before 10:00 |
| Maximum occupancy | 5 | 6 | 5 |
| Quiet hours | No information | No information | No information |
| Property important notice | No notice | No notice | No notice |

Zen room label is Triple Room. The six-guest setting conflicts with the owner-confirmed five. Check-in conflicts with current website/Airbnb hours. No property monetary notice is present in these policy fields; this does not establish publication elsewhere. Sol child-rate display says ages 3–17: 100% of room rate per child per night; this needs interpretation and a real quote before activation. No child-rate setting was changed.

Property selector labels show Sol/Rustic as 595-1 Kojohama, whereas the owner-confirmed shared emergency address is 595-2. Reconcile public address/location records before launch; no address edited. Pet settings show no pets and service animals permitted, as previously approved.

Zen's readiness dashboard warns that the channel manager has not updated pricing/inventory/availability. The owner's instruction is to keep Trip inactive/disconnected; this warning is not an instruction to connect it. No complete guest-side Trip rate or booking verification is possible from the observed setup. Website Trip links remain disabled. Do not activate or change PMS connections as part of this review.

## Evidence

Read-only DOM/text extracts and rate observations are saved under C:/dev/kojohama-ota-review-2026-10-20/: sol-fees.txt, zen-fees.txt, rustic-fees.txt, public policy extracts, Zen/Rustic quote JSON, rate-comparison.json and Trip policy extracts. Host evidence is distinct from public publication. No login credentials or guest reservation records were saved. Booking.com remains skipped at owner request.
