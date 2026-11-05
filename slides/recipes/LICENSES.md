# DataMagic source and asset notices

Audited upstream: [HKUSTDial/DataMagic, commit 3a66365b6dcab798efc76baf54a3039d0b273f2c](https://github.com/HKUSTDial/DataMagic/tree/3a66365b6dcab798efc76baf54a3039d0b273f2c). The detailed file-by-file record is `upstream-audit.json`. This is an audit of upstream material, not a statement that every listed asset is included in this port.

- **Code:** MIT, Copyright (c) 2026 HKUST Dial Lab and DataMagic contributors. Preserve the full MIT notice in `THIRD_PARTY_LICENSES.md`.
- **Original category, coffee and region SVG icons:** their README files explicitly apply the project license.
- **Country flags:** lipis/flag-icons, MIT, Copyright (c) 2013 Panayiotis Lipiridis. Preserve its separate full license.
- **Brand icons:** Simple Icons, CC0-1.0. Brand names and trademarks belong to their owners; no affiliation or endorsement is implied. CC0 does not grant trademark rights.
- **Fonts:** Noto Sans SC and Inter are OFL-1.1. Preserve the full font license notices when distributing font files. The bundled Noto notice is in `cards/gallery/fonts/LICENSE-Noto-Sans-SC.txt`; Inter's license must come from its installed package.
- **Dependencies:** React/React DOM and Ajv are MIT; d3-geo is ISC according to package-lock metadata. Remotion has separate license terms. Preserve relevant installed dependency notices; the project MIT license does not replace them.
- **Generated media:** the cat presenter, fictional presenter portrait and Agnes recycling clip have documented project-generated provenance. No separate media-specific grant or generation-provider output terms were found. The semiconductor background has only limited provenance. The older recycling plate and five illustrated WEBP images lack asset-specific provenance in the inspected source. Do not describe all media as independently verified MIT assets. For strict explicitly licensed redistribution, obtain clarification or replace these assets with appropriately licensed media. Generic appearance and noncommercial use do not independently establish permission.
- **Gallery thumbnails:** no separate poster license found. Rendered posters retain the constraints of their underlying media and fonts; public accessibility alone is not a license.

## Source evidence

- [LICENSE](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/LICENSE)
- [cards/README.md](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/README.md)
- [cards/public/icons/flags/LICENSE](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/public/icons/flags/LICENSE)
- [cards/public/icons/brands/LICENSE.md](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/public/icons/brands/LICENSE.md)
- [cards/public/icons/brands/README.md](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/public/icons/brands/README.md)
- [cards/public/icons/categories/README.md](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/public/icons/categories/README.md)
- [cards/public/icons/coffee/README.md](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/public/icons/coffee/README.md)
- [cards/public/icons/regions/README.md](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/public/icons/regions/README.md)
- [cards/gallery/fonts/LICENSE-Noto-Sans-SC.txt](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/gallery/fonts/LICENSE-Noto-Sans-SC.txt)
- [cards/public/assets/character-perspective-board/README.md](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/public/assets/character-perspective-board/README.md)
- [cards/recipes/PresenterEvidenceBoard.md](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/recipes/PresenterEvidenceBoard.md)
- [cards/recipes/VideoMetricOverlay.md](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/recipes/VideoMetricOverlay.md)
- [cards/templates/video-data-overlay/assets/recycling-facility-agnes.json](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/templates/video-data-overlay/assets/recycling-facility-agnes.json)
- [cards/recipes/SpatialPercentOverlay.md](https://github.com/HKUSTDial/DataMagic/blob/3a66365b6dcab798efc76baf54a3039d0b273f2c/cards/recipes/SpatialPercentOverlay.md)

## Distribution decision for this adaptation

Seven unclear-provenance assets are replaced by original geometric SVGs in `assets-replacements/`; see `mapping.json`. These visibly differ from upstream and the old recycling plate becomes static. Project-generated cat-host, fictional-presenter and Agnes recycling footage are retained with their documented upstream provenance by the project distribution decision; this is not a claim of an additional media-specific license or rights warranty. The SVG replacements embed no third-party media, fonts, or trademarks.
