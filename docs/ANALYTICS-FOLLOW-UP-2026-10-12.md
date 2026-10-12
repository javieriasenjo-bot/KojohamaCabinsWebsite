# Booking and contact analytics — 12 October 2026

## Saved in GA4

For KojohamaCabins property 553369233, `booking_click` and `contact_click` are now key events. Existing `airbnb_click` remains enabled. Booking and contact custom dimensions already exist (`booking_platform`, `contact_method`), so no duplicate dimensions were added. Contact clicks had no received stream data when configured; this is preparation for future visitor events, not evidence of received enquiries.

Screenshot: `ga4-booking-contact-key-events-2026-10-12.png`.

## Source ready to commit

`seo-site.js` now handles Booking.com and Agoda booking links alongside Ctrip/Trip.com, with the matching `booking_platform`. Review links remain separate `review_click` events; booking links on the bio page do not also emit a duplicate bio-click event. No booking URL, price or listing was invented. Agoda handling supports links if added later.

The existing Tag Manager booking/contact tags accept these event names; no new tags were needed. Both the 72-page source check and offline browser checks passed, including a fixture checking Booking.com/Agoda clicks and review exclusion. Real analytics/enquiries were blocked during browser tests.

Commit and deploy the source changes to activate the new link handling. The GA4 key-event settings are already saved externally. Key events measure outbound booking intent and contact interest, not confirmed reservations, and changes do not backfill historical key-event counts.

Other edits already present in this working folder were preserved.
