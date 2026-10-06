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
