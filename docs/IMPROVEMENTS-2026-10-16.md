# Website improvements — 16 October 2026

## Scope

Improve the existing three-language booking journey: show illustrative stay totals, make cabin differences easier to compare, sequence real property photos, remove the invitation to bring sandy shoes indoors, and verify the link-in-bio navigation handoff. Booking-platform prices and availability remain authoritative. No new OTA inventory, prices, outreach or advertising is authorised by this release.

## Approved pricing through 1 July 2027

The owner subsequently supplied the exact daily calendar through 1 July 2027. It is implemented and verified live; the earlier request for post-3-January rates is superseded. See APPROVED-RATE-SCHEDULE-2026-10-16.md for the approved calendar, minimum stays and per-stay fee overrides. Rates beyond 1 July 2027 remain unpublished. Booking-platform publication requires separate verification.

## Social-to-booking measurement

Use a distinct campaign URL for every platform/post, for example:

`https://kojohamacabins.jp/go/?utm_source=instagram&utm_medium=organic_social&utm_campaign=autumn_2026&utm_content=20261018_sea_view`

Use platform names consistently (`instagram`, `tiktok`, `xiaohongshu`, `youtube`) and descriptive content IDs. Add the URLs to scheduled posts only where the platform supports clickable links. Do not replace a profile URL for every post without recording when it changed; traffic through a shared profile link cannot reliably be assigned to an individual post.

In GA4, compare sessions and engaged sessions by session source/medium and campaign first. Then examine `bio_link_click`, `cabin_view`, and booking-intent events by cabin. Treat contact intent separately. `airbnb_click` and `booking_click` measure departure for a booking platform, not completed reservations. Review clicks are not booking intent.

For a GA4 funnel exploration, define an ordered journey of `/go/` page view → `bio_link_click` → `cabin_view` → booking intent (`airbnb_click` OR `booking_click`). Allow intervening steps and inspect direct-to-cabin traffic separately: that traffic should not be expected to pass through `/go/`. A funnel that requires every website session to start on `/go/` will undercount the wider booking journey.

Use a 28-day window for decisions and keep platform/campaign samples visible. Avoid changing creative or diagnosing a broken channel from one or two sessions. Keep the internal-traffic filter enabled. A successful browser event or analytics HTTP response verifies transport only; actual GA4 report receipt remains a separate check using an eligible external visitor.

## Release checks

Build the static pages, run the site/navigation/analytics/pricing checks and the local mobile-browser checks. Review English, Japanese and Simplified Chinese comparison pages at narrow mobile widths. After the owner commits and deploys, verify the new content on production before closing deployment items.
