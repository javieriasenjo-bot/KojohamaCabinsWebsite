# Ocean Stay Kojohama — open items

Last reconciled: 5 November 2026, Japan time (owner decisions on open items; website price removal). Owner: Javier. Working agent: Claude (handover from Codex, 2 November 2026).

This is the canonical tracker for the main website, guest guide, listings, social channels and tourism follow-ups. Historical reviews remain evidence, not current to-do lists. Closed items stay closed unless new evidence changes their status. Update these rows when the owner answers; do not create another competing tracker.

## Open items

| ID | Item | Status / owner | Next action and evidence needed |
|---|---|---|---|
| O08 | Ikuta Clinic current hours | Owner: hours not known; label them as such | On 5 November 2026 the owner said the current reception hours are not known. The guest-guide app (separate repository) should say opening hours are not known instead of showing the 2025 town-guide timetable; not yet changed there. This website does not list the clinic. |

| O14 | Cookware and dish racks | Dish racks bought; delivery pending | Cookware/allocation/induction tests resolved 20 October. On 5 November 2026 the owner confirmed dish racks are bought and awaiting delivery; on arrival the owner will photograph them and upload. Then update the equipment wording on the website (scripts/equipment.cjs), the guest guide and the Airbnb/Trip text, which currently say there are no dish racks. See MEDIA-2026-10-20.md. |
| O15 | Removed Wikimedia photos | Replacement free-licence photos being sourced | On 5 November 2026 the owner asked for new free-licence ski and autumn photos instead of tracing the Wikimedia sources. The four files in images/ski (autumn leaves, lift-ticket office, ski mountain, ski school) stay off the site. Record source, licence and attribution in data/photo-provenance.json for every replacement. |
| O17 | Bio-link navigation tracking | Live same-tab transport verified 16 October | Normal /go/ to /cabins/ navigation preserves campaign tags and sends exactly one bio_link_click request (HTTP 204). Internal filtering remains enabled; this does not prove GA4 report inclusion. Source context is preserved in the data layer; GA4 uses the destination page path. See SOCIAL-FUNNEL-VERIFICATION-2026-10-16.md. |

| O19 | Website conversion improvements | Deployment verified; closed | Three-language stay-total examples, improved comparison and real-photo gallery sequencing; sand wording corrected. Build, site and mobile-browser checks pass. All 72 production HTML pages match committed source 5440653 on 16 October. See IMPROVEMENTS-2026-10-16.md. |

| O21 | 20 October website review fixes | Closed; production and build gate verified | Current commit a33b682 matches all 72 live HTML pages and seven root CSS/JS files. Site checks, mobile/browser checks and nine date-checker interactions pass. Cloudflare already shows Build npm run release:check, Deploy npx wrangler deploy, main branch; no setting change required. See OTA-AND-RELEASE-REVIEW-2026-10-20.md. |

## Closed or already resolved — do not re-ask

| Item | Reconciled status / evidence |
|---|---|
| Two older RedNote posts with prices/Airbnb mentions (O02) | Closed by owner on 5 November 2026; no cleanup requested. |
| OTA extra-guest charge and fee basis (O06) | Closed by owner on 5 November 2026 together with all booking-platform and fee items. No platform settings were changed by this tracker. |
| Two Paid Search sessions (O09) | Closed by owner on 5 November 2026; no follow-up on the 9 October visits. |
| TikTok kotatsu caption typo (O10) | Owner decided on 5 November 2026 to leave the post as it is; no deletion or reposting. |
| Shiraoi Town enquiry (O11) | Closed by owner on 5 November 2026; no follow-up will be sent. |
| HOKKAIDO LOVE! membership decision (O12) | Owner declined on 5 November 2026 (¥60,000 or more). No application or payment made. |
| Shiraoi Tourism listing photos and corrections (O13) | Closed by owner on 5 November 2026; no follow-up will be sent. |
| Airbnb gallery and Angie reply (O16) | Owner decided on 5 November 2026 to keep the gallery as it is and send no reply. |
| Final terms rollout (O18) | Closed by owner on 5 November 2026 together with all booking-platform and fee items (Trip.com and Booking.com follow-ups included). |
| Rates through 1 July 2027 (O20) | Closed by owner on 5 November 2026. The website no longer publishes prices; the PMS and booking platforms remain the pricing authority. |
| Carbon monoxide alarms | Owner confirmed on 14 October that Sol, Zen and Rustic each have a working alarm. |
| Fresh separate-account LINE test (O07) | Owner confirmed on 14 October that a new message from a different LINE account works. Closed; historical test is superseded. |
| Per-cabin Wi-Fi measurements (O04) | Owner confirms updates committed and live on website and guest guide on 14 October. Airbnb twelve saved translations verified on 13 October. Owner supplied six phone screenshots on 13 October 2026, covering both 2.4 and 5 GHz for Sol, Zen and Rustic. Exact download/upload/latency transcribed into website and guest-guide sources; room unspecified, no guaranteed-speed claim. Deployment and Airbnb saved-text evidence are recorded in WIFI-MEASUREMENTS-2026-10-13.md. |
| RedNote application 34100175 | Owner confirmed approved with no current restrictions on 12 October. Former ban-until-25-October claim superseded. O02 is a content cleanup task, not a restriction block. |
| Anthropic activation decision | Owner chose keep Workers AI for now on 12 October. No API key requested or added. Model support remains available if the owner changes this decision later. |
| Social media footage handover | Owner identified the complete available cabin media library: H:/My Drive/98. Projects/0.1 Websites, SEO, App/1. Kojohama Cabins - Web, SEO, App/1. Good Videos, Photos/. Folder and eight subfolders inspected. Source location is resolved; this does not certify every historical requested shot was filmed. See MEDIA-LIBRARY.md. |
| AI-training preference | Owner chose keep ai-train=yes on 11 October; live robots.txt still contains it on 12 October. No new decision needed. |
| Search Console account access / indexing requests | Access is available through the connected Search Console tool. The 12 October inspection record contains 69 current sitemap URLs indexed, including the comparison/ownership/Noboribetsu pages. No need to request access or repeat indexing submissions. This does not cover every historical URL in coverage reports. |
| Guest-guide tests, migration and deployment | Source commit 573b8b1; latest release 8d976ba064288cc4 matches all 98 live files. Remote migration check says none pending, including the new alert-state migration. Prior run: 38 tests, type checks and build passed. No need for the owner to repeat the older split-delivery deployment task. |
| workers_dev: false | Live Cloudflare Domains screen: Production Worker URL and Preview URLs both switched off; custom domain guide.kojohamacabins.jp active. Source setting also false. |
| Worker translation/model/delivery/address fixes | Implemented: English translation in LINE and email, translation-only fallback, explicit unavailable label, expired-window split warning, stable valid UUID retry keys and durable warning state, Haiku 5.5 compatibility, shared owner-confirmed emergency address. Provider activation is separate O03. |
| Venue sync / Cafe and Marugo deployment | All 18 reviewed app venues match the website snapshot; live guest-guide release matches local. Five unconfirmed venues retain cautious labels. Earlier main-site Cafe/Marugo deployment warning is superseded. |
| Five venue calls | Closed as not applicable by the owner's decision recorded in IMPROVEMENTS-2026-10-12.md. Do not reopen as mandatory calls. No operator confirmation is claimed; cautious wording stays. Numbers retained in the older worksheet: Tonton 0144-87-4488; Date Okina 0142-21-2311; Koshu Kitano 0143-83-1730; Antique 36 0144-87-2553; vending operator 0144-87-2433. |
| Airbnb BBQ/capacity/Rustic | Saved review confirms all three maximums five, BBQ amenity and ¥3,500 by-arrangement wording, with guests bringing compatible cartridges. Rustic host capacity/rules checked. Sol/Zen conflicting smoking clauses subsequently corrected. Do not reopen the sixth Zen guest or “no BBQ” claim from the stale import. Pricing and other platforms remain O06. |
| Four thin meta descriptions / internal links | Expanded and verified in the 11 October source review. Existing home/guide links already serve the target pages. All 69 sitemap URLs indexed in the 12 October record; do not add redundant links merely to resolve old indexing statuses. |
| Other booking/contact analytics | booking_click and contact_click saved as GA4 key events on 12 October, with existing Airbnb key event and platform/contact dimensions. Booking.com/Agoda source handling is implemented; live seo-site.js matches local after line-ending normalization. Review clicks are excluded. Clicks are intent, not completed bookings. Contact-event report receipt remains unproven and can be checked with future real traffic. |
| Historical LINE visitor email | Inspected; body is only “Test”. No substantive guest enquiry awaiting a reply. Fresh test remains O07. |
| Project consolidation | This tracker and CLAUDE-HANDOVER-2026-10-12.md map every imported item to current status and link the 10–12 October evidence. |
| Owner's explicitly closed items | Shelters; Zen sixth guest; Iburi programmes (no programmes; optional May–June 2027 lodging-tax meeting watch); Yahoo Loco declined; Baidu parked. Do not reopen. |
| Other explicitly completed items | Bing; GA4 internal-traffic filter; Instagram category; IndexNow; places/BBQ sync; app review fixes; ask_escalated and welcome_video_complete; Ask outage; credential rotation/deletion; parking; plus code. Preserve done status; no new secret values stored here. |

## Evidence and review boundaries

- Current source and live release checks were performed during this reconciliation. Main-site analytics script differs only in CRLF/LF line endings. Neither repository had uncommitted edits before this tracker update.
- Prior checked records: FOLLOW-UP-2026-10-11.md; REMAINING-ITEMS-2026-10-11.md; IMPROVEMENTS-2026-10-12.md; INDEXING-RECHECK-2026-10-12.json; ANALYTICS-FOLLOW-UP-2026-10-12.md; guest-guide RELEASE_NOTES.md.
- Social evidence: project 3. SEO/2. Social Media Posts/2026-10-12-review/findings.md and 2026-10-12-coastal-week/SCHEDULED-POSTS.md. The former records publication on all four platforms; the latter is historical scheduling evidence, not proof that future posts have published. Social accounts were not freshly audited in this reconciliation.
- Clinic research: https://www.town.shiraoi.hokkaido.jp/fs/5/9/4/2/2/_/_______2025_.pdf and https://www.town.shiraoi.hokkaido.jp/fs/5/0/4/5/4/_/_____________2024.10.1__.pdf. Both are dated references; neither establishes current emergency availability.
- Tourism listing: https://shiraoi.net/zh-tw/stay/ocean-stay-kojohama/ ; correction draft SHIRAOI-LISTING-CORRECTIONS-2026-10-11.md.
- Inbox review was focused, not an exhaustive audit of all mailboxes. No messages, forms, social edits, listing changes or notifications were sent.
- Owner answers incorporated on 12 October: RedNote approved/no restrictions; retain Workers AI; Wi-Fi testing tomorrow with screenshots; Airbnb/Booking fee amount set; Trip inactive; tourism photos sent/no reply; no fresh LINE test; available media library identified. Open rows above supersede the historical item count. The Tourism Association contact hold remains unchanged.

- 12 October owner follow-up: Trip/Ctrip buttons hidden in website source until listings are active. Restore by setting `bookingChannels.ctrip` to true in `data/site-facts.json` and rebuilding after activation is confirmed. Inactive link markup is preserved in source comments; it is not rendered, including with JavaScript disabled.

- Deployment confirmed after owner commit 80956bc: all 13 affected comparison, cabin and bio pages return HTTP 200 with zero active Trip/Ctrip links and Airbnb links still available. Dormant Ctrip markup remains only in non-rendered source comments.

## Owner decisions received on 12 October

- Media root: H:/My Drive/98. Projects/0.1 Websites, SEO, App/1. Kojohama Cabins - Web, SEO, App/1. Good Videos, Photos/. Use real recorded cabin media from here; do not assume every library file is a local photo without inspection.
- New BBQ fee is per stay, superseding earlier per-use instructions. Updated three description sections in all four Airbnb languages plus Japanese additional rules for all three cabins.
- Review reply corrected, existing property types verified, Villa Cangrejo left unlisted, RedNote queue retained. No Shiraoi Tourism submission or membership application sent.

## 13 October progress

- New seasonal rates are live on /go/. All three Airbnb listings were verified as Cabin / Entire place; Villa Cangrejo remains unlisted. Zen’s existing two-star reply was corrected and saved without unsupported completed-equipment claims.
- RedNote 6 and 11 October posts were already published and future posts already queued during the 12 October inspection; no duplicate posts created. Fresh publication checks remain distinct from queue evidence.

- 13 October continuation: analytics cohort/campaign/platform investigated; TikTok typo and edit limitation verified; RedNote awaiting login; clinic wording made explicitly dated/unverified. Focused tourism-mail check found no new replies. See FOLLOW-UP-2026-10-13.md.

- 13 October cross-chat reconciliation: current RedNote login verified. Social Media posts - SEO + Analytics handled the revised Sunday post; the current creator queue shows 13/15 October at 21:30 JST and 18 October at 17:30 JST. Older-caption cleanup remains a separate audit task.

## Owner follow-up — 14 October 2026

Working CO alarms in all three cabins and fresh separate-account LINE test confirmed. Wi-Fi sources committed and live per owner. Equipment reminder set for 20 October at 10:00 JST and refers to this chat. HOKKAIDO LOVE! decision remains pending; owner will reply soon. No membership application or tourism outreach sent.

- 14 October fee-task observations for O06: Trip Zen structured capacity still six, despite owner-approved maximum five. Trip check-in 16:00 differs from newer Airbnb Sol/Rustic 15:00 and Zen 14:00. Booking.com shows resort fee ¥750/night. Reconcile these separately; do not assume they were corrected by the guest-charge text update.

## Production verification — 16 October 2026

Owner reported production deployment. Independent comparison found all 72 website HTML files identical to source commit 5440653 after line-ending normalization; analytics.js and seo-site.js also match. Guest-guide release 13b076552622d83c matches all 98 files with no differences. Guest-guide 38 tests, type checks and 18-venue drift check pass; website site/navigation/analytics/pricing checks pass. These checks do not establish booking-platform rate publication or current clinic reception hours.

## Garbage sorting — 19 October 2026

Owner-supplied garbage information implemented in the guest-guide source at /guide/garbage for all three cabins and all four languages. The embedded chatbot consumes the same guide data. 39 tests, type checks, production build and 12 mobile cabin/language combinations passed. Production verified on 19 October after owner commit 209af86: release 061154a2e24f7a4d matches all 98 live files with no differences. No database migration needed. Source ambiguities use conservative separate handling for aluminium foil and host contact for medical sharps. See guest-guide RELEASE_NOTES.md.

## Trip.com equipment update — 20 October 2026

Cookware/induction/no-dish-rack facts, qualified workspaces and Zen extra gear submitted to all three Trip.com property profiles. English submissions read back under review; platform estimates three working days. Translated fields saved; public language propagation unverified. Added three normal room-photo cards per property (nine total); Zen required a clearer original replacement after one image-quality rejection. Original rejected card remains as review evidence. No support messages, rates, availability, capacity, activation or PMS changes. O18 monetary-policy support follow-up remains separate. Evidence: TRIP-EQUIPMENT-2026-10-20.md.

## OTA and release review — 20 October 2026

Airbnb pricing/extra-guest discrepancy and partial rate comparison recorded; English public charge policies verified for all three cabins; gallery recommendations ready with no edits. Trip still needs Zen capacity, check-in, quiet-hour, monetary-policy and address reconciliation before activation; no connections changed. Booking.com skipped on owner instruction. RedNote untouched. Main website release/build setting closed. See OTA-AND-RELEASE-REVIEW-2026-10-20.md.

## Website Trip.com / Ctrip status — 2 November 2026

Supersedes the 12 October notes above that Trip/Ctrip buttons are hidden and that Trip is inactive on the website. Owner commits "trip.com" and "trip" (27 October 2026) set `bookingChannels.ctrip` to true in `data/site-facts.json`. The committed pages now link the three existing Ctrip properties — Sol 136074478, Zen 136074484, Rustic 136074515 — on 14 pages: the three cabin pages in English, Japanese and Chinese, the Chinese homepage and cabin comparison page, and `/go/` in all three languages. `llms.txt` lists Airbnb only and contains no Ctrip URL (enforced by `scripts/check-site.cjs`).

This records website link status only. Trip.com listing work remains open under O06/O18: Zen structured capacity, check-in time, monetary-policy support request, and the planned Sol/Zen/Rustic consolidation, which the 2 November handover says is not confirmed complete. Do not close the existing Zen or Rustic Ctrip properties before the combined setup is verified and closure separately approved; if they are closed, set `bookingChannels.ctrip` to false and rebuild first.

## llms.txt prices removed — 2 November 2026

Following the 28 October "prices off" decision, `scripts/llms.cjs` no longer writes nightly rates, cleaning/extra-guest fees or the `#seasonal-rates` link; the Prices section now directs readers to the booking platform. `scripts/check-pricing.cjs` now also fails if `llms.txt` contains accommodation prices. The optional BBQ fee (per stay) is still published, matching the BBQ page.

## Price pipeline removed and release gate changes — 5 November 2026

Supersedes every earlier note that the website carries a "Check your dates" estimator, a dated rate calendar, stay-total examples, JSON-LD offers or a price row in the cabin comparison. None of these is published any more (they were already stripped from the pages by the 28 October "prices off" decision; on 5 November the generators were deleted so a rate change in `data/site-facts.json` can no longer reintroduce them).

- Removed from source: `scripts/date-check.cjs`, `scripts/pricing.cjs`, `scripts/check-date-check.cjs`, `scripts/booking-prices.cjs`, `data/date-rates.json`, the date-check block in `seo-site.js` and the related CSS. Neutral wording now comes from `scripts/booking-note.cjs`; the comparison table (without prices) is `scripts/comparison.cjs`.
- Guard: `scripts/check-pricing.cjs` fails on any ¥/円 amount near night/泊/每晚 (BBQ, cleaning, extra-guest and unregistered-guest fees are allowed) and on rate calendars, offers or `priceRange` data. `llms.txt` is covered too.
- Historical documents that still describe the removed feature are evidence only: UPDATE-2026-10-19.md, APPROVED-RATE-SCHEDULE-2026-10-16.md, OTA-AND-RELEASE-REVIEW-2026-10-20.md and WORKSPACE-PHOTOS-2026-10-21.md. Rows O19 and O20 above describe the state at the time; the website calendar they mention is no longer live. The approved rates remain in `data/site-facts.json` for reference only; the PMS and booking platforms stay the pricing authority (O20).
- Release gate: the review-rating snapshot ("as shown on each platform on 2 November 2026", 13 pages, three languages) now only warns once older than 30 days (from 3 December 2026) and fails the build, and therefore the Cloudflare deploy, once older than 90 days (from 1 February 2027). Refresh the ratings and date before then; calendar reminders were set for 30 November 2026 and 18 January 2027. Owner: Javier.
- Also on 5 November: /go/ facts tile and meta descriptions rewritten (no price text); terms tables use the existing `table-wrap` class (a check now fails if a table wrapper class has no CSS); venue photos all carry responsive `srcset` (640w, or 400w for photos under 640 px wide); hashed CSS/JS are cached as immutable; the cabin pages lazy-load the other-cabins photos; Japanese footer and privacy page show the address in Japanese.
