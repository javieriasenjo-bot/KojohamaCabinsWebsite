# Social traffic improvements — 8 October 2026

/go/ prioritises cabin comparison, LINE enquiries and clearly labelled Airbnb dates. Pricing conditions, five-guest capacity and winter drive allowance are visible. Social links remain below stay-planning actions. Existing campaign propagation and contact/booking event mappings remain intact.

Cabin detail pages in English, Japanese and Chinese push cabin_view once per page load with cabin_name, page_language, page_path and link_location=cabin_detail. This is a page view, not a booking or key-event recommendation. Reloading the page appropriately creates another view. Event queuing uses the existing shared data layer; local previews do not send GTM requests.

Incremental GTM import: C:/dev/Kojohama-GTM-cabin-view-2026-10-08.json. Export a fresh current GTM backup first. Import using Merge, reviewing conflicts; this file contains only the new cabin_view tag/trigger and three existing data-layer variables. It does not replace the current container. If IDs conflict with unrelated current items, use rename-on-conflict and review the resolved items, or create a Custom Event trigger for cabin_view manually. Copy the existing GA4 event tag using measurement ID G-30NYR8WMT3 with cabin_name, page_language, link_location and page_path parameters. Preview a cabin page in each language and confirm exactly one cabin_view plus the correct context. Publish only after successful Preview. Register cabin_name and page_language event-scoped dimensions if absent. Report receipt is not yet verified.

Local Thursday Story guides now point to the seafood/tarako guide; Sunday's Story guide points to /cabins/. Campaign names/content remain intact. These were edits to local publishing instructions, not changes to scheduled platform posts. RedNote external-URL policy and prepared video creative are unchanged. If posts/Stories are already scheduled, update their link stickers separately.

Evaluate at 48 hours and seven days: source/medium, engaged visits, cabin views and sessions with booking/contact intent. Outbound booking clicks do not establish paid reservations. No private GA4 settings or social accounts were changed.
