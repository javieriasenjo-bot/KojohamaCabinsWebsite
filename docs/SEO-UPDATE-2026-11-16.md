# Accommodation search and smartphone update — 16 November 2026

The local source contains the approved improvements from the Astra review. No commit, push, deployment or external booking-settings change was performed by this task. Newer commits appeared during the work; they were preserved, and the current source was used for the final release and responsive checks.

## Website changes

- Localized homepage titles, descriptions and main headings now describe accommodation in Kojohama/Shiraoi explicitly. The existing poetic line remains as supporting copy.
- Availability is the primary hero action, with cabin comparison alongside it. Both remain visible and touch-friendly on phones.
- All three language booking destinations point directly to the verified AirHost Kojohama property (`/en/houses/999556`, `/ja/houses/999556`, `/zh/houses/999556`). Opening those pages was verified; no reservation was made.
- Primary navigation focuses on cabins, access, area guide, FAQ and availability. Seasonal, ownership, remote-work and village-story links remain available in secondary footer navigation.
- Homepage experience cards link to existing local onsen, Upopoy, Noboribetsu and two-day Shiraoi guides. Destination guides include a clear route back to cabin comparison and availability.
- The comparison prioritizes capacity, bed count, sleeping arrangement, interior, parking and arrival times. Existing sleeping-layout photographs and bathroom-photo links help guests choose. Detailed Wi-Fi measurements remain available below.
- Japanese/Chinese Zen comparison cards now use the approved four-bed/five-guest facts. Card labels regenerate from `data/site-facts.json`, preventing translation drift. The English guide's shared-parking wording was corrected.
- Nightly prices remain on the booking platform. Existing privacy, booking policies, attribution and closed owner decisions remain in place.

## Editing and checks

Homepage copy: `data/accommodation-content.json`. Shared generation: `scripts/accommodation-content.cjs`. Comparison: `scripts/comparison.cjs`. Booking/facts: `data/site-facts.json`. Navigation: `data/layouts.json`.

Validation completed against the updated source:

- `npm ci` — locked dependencies installed; no dependency vulnerabilities reported.
- `npm run release:check` — passed on the current 83 HTML files, including local references, structured-data blocks, analytics/navigation checks and the prohibition on nightly prices.
- Rebuilding the committed website left generated files unchanged.
- `npm run check:responsive` — 90 page checks passed: Chromium and WebKit; English, Japanese and Chinese; widths 320, 390, 430, 768 and 1440 CSS pixels. Includes phone touch menus, visible unclipped booking actions, page overflow checks, independently scrollable comparisons and decoded sleeping-layout images.
- `npm run check:browser` — the main three-language interaction suite covers menus, galleries, directory search/deep links, photos, booking-click attribution, no-JavaScript fallback and analytics isolation. Its current result is recorded in `docs/browser-check-summary.json`.
- `git diff --check` — passed before handoff.

The new `check:responsive` command is also included in GitHub Actions. CI installs Chromium and WebKit before running browser checks. Results are recorded in `docs/responsive-check-summary.json`. Browser simulations were used; this is not a physical iPhone or Android device test. External booking and analytics requests were blocked in local tests.

## Outside this repository

These are current observations and measurement dependencies, not reopened historical OTA or tourism tasks.

1. AirHost's public English and Japanese Kojohama descriptions were observed on 16 November still saying Zen has five beds and check-in from 14:00. Current approved website facts are four beds (one double plus three singles), maximum five guests, and check-in from 15:00. Correct the property overview and Zen room text in AirHost; Japanese footer wording also contains 小幌浜 instead of 虎杖浜. No AirHost changes were made here.
2. GSC Wizard could not return current search data because its account has no active trial/subscription. Direct Search Console access or exports are alternatives. No current ranking or traffic gains are claimed.
3. Google travel connectivity requires provider support and eligibility checks; no integration, listing or subscription was created. Prior closed tourism follow-ups and the declined paid membership remain closed.

## Measurement after publication

Use 28 settled days before and after the actual publication date, with a seasonal caveat. Compare nonbrand accommodation-query impressions/clicks, organic homepage/cabin landing sessions by language, and sessions containing a booking click. Relevant query groups to inspect include 虎杖浜 宿泊, 白老 一棟貸し, 白老 貸別荘, Kojohama accommodation and Shiraoi cabins; search volumes have not been measured. The `homepage_hero`, `header`, `comparison` and `guide_stay` placements distinguish booking intent. Outbound booking clicks are not completed reservations; completion measurement requires reliable AirHost evidence.

Commit source and generated files together. The remaining working-tree changes may consist mainly of validation files if the website improvements have already been committed separately. Publication remains with the owner.
