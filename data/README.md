# ScholarHub - Data Directory

All scholarship data is stored here.

## Files

| File | Description |
|---|---|
| `scholarships.json` | **Main output** - read by the application. Do not edit manually. |
| `DATA_GUIDE.md` | Complete guide for updating data and adding new providers. |

## Folders

| Folder | Description |
|---|---|
| `raw/daad/` | Raw crawl from daad-indonesia.org |
| `raw/mext/` | Raw crawl from id.emb-japan.go.jp (6 programs) |
| `raw/turkiyeburslari/` | Raw crawl from turkiyeburslari.gov.tr |
| `raw/chevening/` | Raw crawl from chevening.org |
| `raw/australia-awards/` | Raw crawl from australiaawardsindonesia.org |
| `raw/gks/` | Raw crawl from studyinkorea.go.kr and NIIED |
| `raw/singa/` | Raw crawl from NUS, NTU, A*STAR scholarship pages |
| `raw/eiffel/` | Raw crawl from campusfrance.org, sciencespo.fr, ens-lyon.fr, paris-saclay.fr |
| `raw/canada/` | Raw crawl from nserc.canada.ca and future.utoronto.ca |

## How to update data

See `DATA_GUIDE.md` for the complete guide.

Quick summary:
1. Update raw `.md` files in `raw/<provider>/`
2. Update `../scripts/reextract.js`
3. Run `node scripts/reextract.js`
4. Build: `npx next build`
