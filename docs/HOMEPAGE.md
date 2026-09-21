# Personal homepage

The homepage uses Hugo's `layouts/index.html` with the `academic` styles and publication filters. A simple profile introduction leads into research, publications, experience, and honors.

## Updating content

- `content/authors/admin/_index.md`: biography, public email, education, and portrait bundle.
- `data/profile.yaml`: research areas, internships, projects, and honors.
- `data/homepage_publications.yaml`: selected and additional publications, contribution markers, topics, and verified links.
- `content/publication/`: individual publication pages. The older gait preprint and the 2026 journal article remain separate records.
- `data/scholar.yaml`: dated Google Scholar metrics snapshot; update the date together with all counters.
- `data/news.yaml`: recent milestones.
- `static/files/twinworld-2026-third-place.pdf`: the supplied award certificate.

The September 2026 refresh uses the supplied CV, TwinWorld certificate, live [Google Scholar profile](https://scholar.google.com/citations?user=az4zv18AAAAJ&hl=en&sortby=pubdate), and linked publisher/conference records. Eighteen distinct publication records are listed after removing the NTIRE preprint/proceedings duplicate and the collected-book reprint of the Sensing article. Unknown publication years remain unspecified. The CV's personal demographic and phone fields are not included, and the original CV is not published.

The reading collection remains at `/papers/`; its third-party paper citation totals are not personal academic metrics.

## Local verification

Use Hugo Extended 0.121.0 and Go 1.21, matching deployment:

```sh
hugo --gc --minify
hugo server --bind 127.0.0.1 --port 1313 --disableFastRender
```

In another terminal:

```sh
npm ci
npx playwright install chromium
BASE_URL=http://127.0.0.1:1313 npm run test:homepage
BASE_URL=http://127.0.0.1:1313 npm run test:e2e
```

Homepage tests use a separate configuration so the scheduled Papers UI checks continue testing their deployed page without a deployment race. Check the desktop and mobile layouts visually after styling changes, in addition to running the tests.
