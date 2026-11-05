# Task for Claude in Chrome: request indexing of the new pages in Google Search Console

Give this whole file to Claude in Chrome. It is written to be followed step by step.

## Goal

Ask Google to index the three new April–September pages of https://kojohamacabins.jp/ and to re-crawl the three October–March pages that were updated, using the URL Inspection tool in Google Search Console. Change nothing else.

## Before you start (check, do not skip)

1. The pages must already be live. Open each URL in the table below in a normal tab. Each one must load (not a 404) and show the expected title. If any page is missing, STOP and tell the user: the site has probably not been deployed yet.
2. The user must be signed in to Google Search Console in this browser. If a sign-in page or CAPTCHA appears, STOP and ask the user to sign in themselves. Never type a password or complete a CAPTCHA.

## URLs to submit

New pages (submit these first):

| # | URL | Expected page title (browser tab) |
|---|---|---|
| 1 | https://kojohamacabins.jp/april-to-september/ | April to September in Kojohama \| Hokkaido Coastal Cabins |
| 2 | https://kojohamacabins.jp/ja/april-to-september/ | 4月〜9月の虎杖浜｜北海道の海辺の一棟貸し |
| 3 | https://kojohamacabins.jp/zh-cn/april-to-september/ | 4月至9月北海道虎杖浜住宿｜春夏海景小屋 |

Updated pages (a photo gallery was added; request a re-crawl):

| # | URL | Expected page title |
|---|---|---|
| 4 | https://kojohamacabins.jp/october-to-march/ | Kojohama Oct–Mar \| Winter Ocean Cabins in Hokkaido |
| 5 | https://kojohamacabins.jp/ja/october-to-march/ | 10月〜3月の虎杖浜｜北海道の海辺の一棟貸し |
| 6 | https://kojohamacabins.jp/zh-cn/october-to-march/ | 10月至3月北海道虎杖浜住宿｜秋冬海景小屋 |

Use the exact URLs above, with the trailing slash and the https scheme.

## Steps for each URL

1. Go to https://search.google.com/search-console and choose the property for kojohamacabins.jp (a "Domain" property or the "https://kojohamacabins.jp/" URL-prefix property, whichever the account has). If both exist, use the Domain property. Do not create or verify a property.
2. Click the search bar at the top ("Inspect any URL in …"), paste the full URL and press Enter.
3. Wait for the inspection result.
   - If it says "URL is not on Google" (expected for the new pages), or "URL is on Google" (expected for the updated ones), that is fine.
   - Optionally click "TEST LIVE URL" and confirm it reports "URL can be indexed" with no blocking errors. If it reports an error (blocked by robots.txt, noindex, server error, redirect), do NOT request indexing: note the exact message and move to the next URL.
4. Click "REQUEST INDEXING". Wait for the "Indexing requested" confirmation dialog, then click "GOT IT".
5. If a message says the daily quota is exceeded or that indexing could not be requested, STOP. Do not retry in a loop. Report which URLs were done and which remain.
6. Record the result for the URL, then continue with the next one.

## Sitemaps (look only, change nothing unless a sitemap is missing)

Open "Sitemaps" in the left menu. Two sitemaps should already be listed:

- https://kojohamacabins.jp/sitemap.xml
- https://kojohamacabins.jp/sitemap-zh-cn.xml

They are generated automatically and now include the three new URLs. If either is missing from the list, add it using the "Add a new sitemap" box (type only `sitemap.xml` or `sitemap-zh-cn.xml`). If both are listed, do nothing; do not delete or resubmit anything.

## Rules

- Do only what is written here. Do not change any Search Console settings, users, ownership, property, removals, or international targeting.
- Do not use "Remove URLs", "Validate fix" or any other button not named above.
- Do not submit any URL that is not in the tables.
- Do not enter passwords, API keys or personal data anywhere. If anything asks for them, STOP and tell the user.
- If the page looks different from what is described here, or something unexpected appears, STOP and describe it to the user instead of guessing.

## Report back (use this format)

| # | URL | Inspection result | Live test | Indexing requested? | Notes |
|---|---|---|---|---|---|

Finish with one sentence: how many of the 6 requests were accepted, and anything the user must do next. Indexing normally takes a few days; the user can re-inspect the URLs later to see when they appear in Google.

## Context (for the user, not needed by the browser agent)

- The new pages were added on 5 November 2026 together with a seasonal photo gallery on the October–March pages. See the "Price pipeline removed and release gate changes" section of `OPEN-ITEMS.md`.
- The site also has an IndexNow script (`npm run indexnow:preview`, then `npm run indexnow:submit`) for Bing and other engines. That is separate from this Google task.
