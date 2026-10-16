# Social landing-page tracking verification — 16 October 2026

## Verified live

An ordinary same-tab click from `/go/` to the cabin comparison page retained the incoming `utm_source`, `utm_medium` and `utm_campaign` values. The deliberately labelled test campaign was `bio_handoff_20261016`, with source `codex_test` and medium `qa`.

After navigation, Chrome's network log showed one `bio_link_click` collection request to measurement ID `G-30NYR8WMT3`, followed by HTTP 204. The request included the expected comparison-link text, `link_location=linkinbio_primary`, destination URL and English language. This closes the previously unobserved ordinary same-tab delivery check in O17.

The request was marked `tt=internal`. The internal-traffic filter was left unchanged. HTTP 204 verifies transport to Google's collection endpoint, not inclusion in GA4 reports, a booking, or a confirmed reservation. The earlier owner-confirmed external-device tests remain the evidence for report receipt.

## Page attribution: source versus destination

The event is intentionally sent after arrival, to avoid losing it during page unload. Its GA4 `page_location` and `dp`/page path in the live request identify `/cabins/`, the destination. The request's referrer points to `/go/`. Do not interpret the destination page path as evidence that the visitor originally clicked somewhere other than `/go/`.

The current source retains `/go/` as `page_path` in the queued data-layer event. The observed live GA4 request does not include a separate event parameter for that source path; its `dp` is the destination. A future GTM review can map the existing data-layer `page_path` value to a distinct event parameter named `source_page_path`, and register an event-scoped GA4 custom dimension if it is needed in reports. Keep the ordinary page-location fields describing the actual loaded page. No GTM or GA4 account changes were made in this verification.

## Useful evaluation setup

Use a consistent campaign per creative: `utm_source` for platform, `utm_medium=organic_social`, `utm_campaign` for the campaign and `utm_content` for the specific post or video. Avoid personal information in campaign values. Keep the internal QA campaign out of marketing comparisons.

Review the journey in steps, using users or sessions consistently rather than mixing totals:

1. Social landing visit, grouped by session source/medium and campaign.
2. `bio_link_click` on the comparison or planning link, grouped by `link_location` and `destination_url`.
3. `cabin_view`, grouped by `cabin_name`.
4. Booking-intent events such as `airbnb_click` or `booking_click`, and `contact_click` as a separate contact outcome.

Segment by device and language when the sample is large enough to be useful. Compare matched time windows and similar post ages. A route through `/go/` is optional: visitors may enter a cabin page directly, so an analysis requiring step 1 must be labelled as the social-landing journey rather than the whole site's conversion rate. Booking-link clicks are intent, not completed bookings; only platform reservation evidence can establish bookings.

Before creating new custom dimensions, inspect GA4's existing definitions for `cabin_name`, `link_location`, `page_language` and `booking_platform` to avoid duplicates. If an exploration is built, keep `contact_click` separate from booking-link actions and document whether the funnel is open or closed.

## Source checks

`node scripts/check-navigation.cjs` and `node scripts/check-analytics.cjs` passed. These cover same-tab handoff, one-time replay, stale or wrong-destination events, storage restrictions, callback fallback, modified clicks, preview isolation and loader behavior. No defect requiring a production loader change was found.
