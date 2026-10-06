# Ocean Stay Kojohama website

Static English, Japanese and Simplified Chinese website. The updated source is ready to review in this repository; no deployment command is needed to generate the pages.

See [the release notes](docs/UPDATE-2026-10-06.md) for changes, validation and remaining owner/external actions.

To regenerate the directory, photo captions, comparison tables, pricing notes and approved travel information after editing the records in `data/`:

```text
node scripts/sync-content.cjs
node scripts/check-site.cjs
```

Commit the generated HTML together with the content records, scripts and new images. The `data/`, `scripts/` and `docs/` folders are excluded from website hosting by `.assetsignore`.

The verification file `googlefa3fab5b6b918158.html` must be preserved exactly.

Venue photographs and source/permission records are in `data/venue-photo-sources.json`. Keep the register, `data/venues.json`, optimized full-size/mobile assets and regenerated pages together when replacing a photograph. The 65-entry directory contains 59 newly sourced profile photographs and six retained existing photographs.
## Shared layout, image cache and automatic checks

Run npm ci, npm run build and npm run check after changes. The build applies data/layouts.json, approved facts and galleries, creates content-hashed media files, and updates generated pages. Commit the media folder, original images, data, scripts, shared CSS/JavaScript, package files and .github workflow together. Shared layouts are edited in data/layouts.json; homepage styling and gallery behavior live in home.css and home-gallery.js.

For browser checks run npx playwright install chromium and npm run check:browser. Tests run against a local server and block external booking and analytics requests. GitHub Actions runs source and browser checks after commits and pull requests; branch protection is not configured by this repository. Monthly venue review runs on the first day at 09:00 Japan time once the workflow is on the default branch. It produces a queue, not automatic confirmation of hours. Run npm run review:venues locally to refresh docs/VENUE-REVIEW.csv.

See docs/GTM-REVIEW-2026-10-06.md for the separate GTM import draft and owner validation steps.
