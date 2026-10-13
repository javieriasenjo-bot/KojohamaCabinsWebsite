# Ocean Stay Kojohama — open items

Last reconciled: 13 October 2026, Japan time. Owner: Javier. Working agent: Codex.

This is the canonical tracker for the main website, guest guide, listings, social channels and tourism follow-ups. Historical reviews remain evidence, not current to-do lists. Closed items stay closed unless new evidence changes their status. Update these rows when the owner answers; do not create another competing tracker.

## Open items

| ID | Item | Status / owner | Next action and evidence needed |
|---|---|---|---|
| O02 | Two older RedNote posts with prices/Airbnb mentions | Login verified; older-post audit remains | On 13 October, freshly verified signed-in Ocean Stay 虎杖浜 creator account. Social Media posts - SEO + Analytics completed the revised 18 October RedNote post scheduling; live queue confirms 17:30 JST. This is separate from the two older price/Airbnb-caption cleanup, which is not established as completed. Do not request login again while the session remains valid or duplicate scheduled posts. |
| O06 | Remaining OTA setup and extra-guest charge period | Owner update received; Codex follow-up | Owner confirms Airbnb and Booking.com now charge ¥2,500 per extra guest. Do not ask again whether that amount is set. The charge period/final checkout totals have not been independently checked. Trip/Ctrip is not active yet; treat it as setup, not an active-listing audit. Owner approved hiding Trip/Ctrip booking buttons until activation. Source flag bookingChannels.ctrip=false now removes all rendered Ctrip links, including the bio page; committed as 80956bc and verified live on 12 October across all 13 affected pages; retain commercial tax/cleaning verification if needed. |
| O07 | Fresh inbound LINE end-to-end test | Owner has not performed a fresh test | Owner confirmed no new separate-account test on 12 October. Historical 3 October enquiry was only “Test”; no guest reply pending. A clearly labelled new message from a separate LINE account is still needed to establish current inbound forwarding and host receipt. |
| O08 | Ikuta Clinic current hours | Dated wording improved; current reception confirmation open | On 13 October, updated all four app languages to label hours as the 2025 town-guide reference and require phone confirmation of reception/lunch break. Primary source linked; hoursUnverified remains true. Source awaits commit/deployment; current clinic timetable not certified. |
| O09 | Two Paid Search sessions | Investigated; owner test-history answer pending | Both visits occurred 9 October: google/cpc, source platform Google Ads, campaign (not set), homepage `/`, no query detail, no engagement or key events. No hardcoded paid campaign found in source. Asked owner about tests; do not infer spend or delete records. See FOLLOW-UP-2026-10-13.md. |
| O10 | TikTok kotatsu caption typo | Audit complete; historical post cannot be edited in current Studio | Exact 22 September post 7688282103183592724 found with typo. Studio menu offers Pin, Download, Delete, no caption edit. Corrected future-use copy saved in FOLLOW-UP-2026-10-13.md; no deletion/reposting. Original caption remains unchanged. |
| O11 | Shiraoi Town enquiry | Awaiting third party | Form submission reported and 25 September automatic acknowledgement verified in Gmail. No substantive reply found in the focused search; do not treat the acknowledgement as an answer. No follow-up sent. |
| O12 | HOKKAIDO LOVE! membership decision | Owner decision pending; research and deck complete | The 25 September substantive reply says listings normally require membership. Official recruitment requests six ¥10,000 units (¥60,000 or more); renewal period and listing benefits need confirmation before joining. Four-slide decision deck: C:/dev/kojohama-membership-decision/output/Hokkaido-Love-Membership-Decision-2026-10-12.pptx. No application or payment made. |
| O13 | Shiraoi Tourism listing photos and corrections | Awaiting reply; contact remains on hold | Owner confirms photos were sent and no reply received as of 12 October. Do not ask for photo handover again. Wait for acknowledgement/public photo update; correction draft covers outdated capacity/pricing/cleaning/access/BBQ. Keep contact/submission on hold per existing instruction; no follow-up sent. |

| O14 | Cookware, dish rack, bedroom and CO alarms | Owner on-site facts pending | Reminder is today 13 October at 10:00 JST, together with Wi-Fi. Purchases establish one 24 cm IH-compatible pot and an IKEA pot-lid organiser, not a dish rack or installation/testing in all cabins. Do not change safety amenities without physical confirmation. |
| O15 | Removed Wikimedia photos | Exact source pages pending | Owner identified Wikimedia Commons as the source. Keep removed ski/autumn images out until the exact file pages and attribution/licence requirements are established. |
| O16 | Airbnb gallery and Angie reply | Codex follow-up; factual reply depends on O14 | Zen sea-view lead photo and Zen/Rustic exterior replacement remain to review; retain existing photos. Rustic currently has 38 amenities, superseding the old 27-to-34 target. Draft Angie reply only around confirmed actions. |
| O17 | Bio-link navigation tracking | Source fix ready; deployment verification pending | Live Ctrl-click retained the source page and produced a bio_link_click response HTTP 204. Normal navigation was not observed delivering the request. New temporary session-storage handoff dispatches once on the destination, preserving source context; storage-blocked browsers retain bounded fallback. Deploy then verify same-tab click; filtered GA4 report receipt remains separate. |

## Closed or already resolved — do not re-ask

| Item | Reconciled status / evidence |
| Per-cabin Wi-Fi measurements (O04) | Owner supplied six phone screenshots on 13 October 2026, covering both 2.4 and 5 GHz for Sol, Zen and Rustic. Exact download/upload/latency transcribed into website and guest-guide sources; room unspecified, no guaranteed-speed claim. Deployment and Airbnb saved-text evidence are recorded in WIFI-MEASUREMENTS-2026-10-13.md. |
|---|---|
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
