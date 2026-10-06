# GTM review — 6 October 2026

Reviewed the supplied GTM-5W8ZJPTD workspace export. The original export is unchanged. This is a workspace snapshot; it does not prove which version is published.

## Recommended changes

- Add a review_click tag and trigger. Review links must not count as booking intent.
- Add the missing event context: intent, booking platform, cabin, language, link placement and page path where applicable.
- Restrict the Google tag and custom-event triggers to kojohamacabins.jp and www.kojohamacabins.jp. Local previews already suppress GTM in the revised website.
- Retain existing event names and measurement ID G-30NYR8WMT3. No duplicate event tags were found in the supplied export.
- Clear unused event fields in the website data layer so values from one interaction do not carry into another. This is implemented in analytics.js.

| Event | Meaning | Added/retained context |
| --- | --- | --- |
| airbnb_click | Airbnb booking intent | cabin_name, destination_url, page_language, link_location, booking_platform, intent, page_path |
| booking_click | Ctrip booking intent | Same fields |
| review_click | Read reviews | Same fields; intent=reviews |
| contact_click | Open email or LINE | contact_method, page_language, link_location, page_path |
| language_change | Change language | selected_language, page_language, destination_url, link_location, page_path |
| bio_link_click | Other link on /go/ | link_text, destination_url, link_location, page_language, page_path |

## Import and verify

Prepared file: C:/dev/Kojohama-GTM-recommended-2026-10-06.json

1. Commit and deploy the revised website source first.
2. Export a fresh backup of your current GTM workspace. In Admin → Import Container, select the prepared file and the intended workspace. Choose **Merge**, then **Overwrite conflicting tags, triggers and variables**. Review the import change list before confirming. Avoid overwriting the entire container.
3. Use Preview / Tag Assistant on the production hostname. Hostname filters intentionally exclude localhost. Check that the Google tag fires once, then test Airbnb booking, Ctrip booking, Airbnb reviews, Booking.com reviews, LINE, email, language selection and /go/ social links.
4. In GA4 DebugView, confirm each action produces its matching event once, with the right language, cabin and placement. Reviews must not emit airbnb_click or booking_click. Language changes must not inherit a previous cabin or booking intent.
5. Publish only after the preview checks pass.

The file passed offline reference, identifier and variable checks. It has **not** been imported into GTM or validated by its UI, published, or tested for real GA4 receipt. If GTM rejects the file, use the event table above to make the changes manually and keep the original export.

## GA4 settings to inspect separately

The GTM export cannot establish your GA4 key events, filters, enhanced measurement, custom dimensions or consent configuration. Consider event-scoped dimensions for cabin_name, booking_platform, intent, page_language, link_location, contact_method and selected_language; link_text is optional. Destination URLs can create excessive distinct values; standard page-path reports are already available without a new custom dimension.

If useful, mark booking-intent or contact-intent events as key events, labelled accordingly. An outbound booking click is not a completed reservation or purchase. Do not sum enhanced-measurement generic click events and these custom events as separate bookings. No duplicate Google tag or consent defect is inferred from this export.

## References

- [Google: importing containers and merge conflicts](https://support.google.com/tagmanager/answer/6106997?hl=en-GB)
- [Google: custom-event triggers](https://support.google.com/tagmanager/answer/7679219?hl=en)
- [Google: the data layer](https://developers.google.com/tag-platform/tag-manager/datalayer)
- [Google: event-scoped custom dimensions](https://support.google.com/analytics/answer/14239696?hl=en)
- [Google: key events](https://support.google.com/analytics/answer/9322688?hl=en)
