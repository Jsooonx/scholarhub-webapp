# ScholarHub - Data Management Guide

> ⚠️ **This guide is deprecated.** See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for the comprehensive, up-to-date documentation covering data management, auth, features, and more.

Complete guide for adding new providers or updating existing scholarship data.

---

## Table of Contents

1. [Data Structure](#1-data-structure)
2. [General Workflow](#2-general-workflow)
3. [Annual Data Update (Existing Providers)](#3-annual-data-update-existing-providers)
4. [Adding a New Provider](#4-adding-a-new-provider)
5. [Script Reference](#5-script-reference)
6. [Troubleshooting](#6-troubleshooting)
7. [Current Providers](#7-current-providers)

---

## 1. Data Structure

```
data/
├── scholarships.json          <- Main file read by the app (DO NOT edit manually)
├── DATA_GUIDE.md              <- This file
├── README.md
└── raw/                       <- Crawled source data, one folder per provider
    ├── daad/
    │   └── daad.md
    ├── mext/
    │   ├── undergraduate_gakubu.md
    │   ├── collegeoftechnology_kosen.md
    │   ├── research_student.md
    │   ├── japanesestudies.md
    │   ├── specializedtrainingcollege_senshu.md
    │   └── teacher_training.md
    ├── turkiyeburslari/
    │   ├── fulltimeprograms.md
    │   ├── shorttermprograms.md
    │   ├── partneredprograms_joint.md
    │   ├── scholarshipprograms.md
    │   ├── applicationscalendar.md
    │   ├── applysteps.md
    │   ├── evaluationandselectionprocess.md
    │   └── whyturkiye.md
    ├── chevening/
    │   └── *.md  (25 files)
    ├── australia-awards/
    │   └── *.md  (30 files)
    ├── gks/
    │   └── *.md  (6 files)
    ├── singa/
    │   └── *.md
    ├── eiffel/
    │   └── *.md
    └── canada/
        └── *.md

scripts/
├── crawl.js        <- Auto-discover crawler
├── jina_fetch.js   <- Fetch a single URL via Jina Reader (bypasses JS-heavy sites)
└── reextract.js    <- Generates scholarships.json from raw data
```

### Important Rule

> ⚠️ **Never edit `scholarships.json` directly.**
> This file is the output of `reextract.js`. All data changes must go through
> the raw `.md` files and the extract script.

---

## 2. General Workflow

```
1. Crawl / update raw .md files
        ↓
2. Update scripts/reextract.js
        ↓
3. node scripts/reextract.js
        ↓
4. npx next build
        ↓
5. Verify in browser
```

---

## 3. Annual Data Update (Existing Providers)

Run at the start of each year (January-February) or whenever a provider makes significant changes.

### 3a. Re-crawl Raw Data

Use the crawler script to fetch the latest content from official websites:

```bash
# General format
node scripts/crawl.js <rootUrl> <providerName> [options]

# Always dry-run first to preview URLs that will be crawled
node scripts/crawl.js <rootUrl> <providerName> --dry-run --max 30
```

**Examples per provider:**

```bash
# DAAD (Indonesia page)
node scripts/crawl.js https://www.daad-indonesia.org/en/find-funding/ daad \
  --keywords "scholarship,master,phd,doctoral,research,fellowship,grant,postdoc,apply,eligibility" \
  --depth 2 --max 30

# MEXT (crawl per program - 6 program URLs)
node scripts/crawl.js https://www.id.emb-japan.go.jp/itpr_id/sch_gakubu.html mext \
  --keywords "scholarship,mext,requirements,facilities,schedule,registration" \
  --depth 1 --max 5

# Turkiye Burslari
node scripts/crawl.js https://www.turkiyeburslari.gov.tr turkiyeburslari \
  --keywords "scholarship,program,apply,eligibility,benefit,requirement,calendar" \
  --depth 2 --max 40

# Chevening
node scripts/crawl.js https://www.chevening.org/scholarships chevening \
  --keywords "scholarship,eligibility,apply,timeline,benefits,who-can,faq,fellowship,programme" \
  --depth 2 --max 25

# Australia Awards
node scripts/crawl.js https://www.australiaawardsindonesia.org australia-awards \
  --keywords "scholarship,award,phd,masters,garuda,lpdp,apply,entitlement,requirement" \
  --depth 2 --max 35

# GKS Korea - use jina_fetch because the site is an SPA
node scripts/jina_fetch.js \
  "https://www.studyinkorea.go.kr/en/main.do" \
  "data/raw/gks/01_gks_main_en.md"
# Then add detail files manually if needed
```

> **MEXT Note:** The MEXT Indonesia website (`id.emb-japan.go.jp`) publishes new pages
> each year with updated program names (e.g. "2027" → "2028"). Make sure to crawl
> the correct URL per program. URL patterns:
> - `https://www.id.emb-japan.go.jp/itpr_id/sch_gakubu.html`
> - `https://www.id.emb-japan.go.jp/itpr_id/sch_kosen.html`
> - `https://www.id.emb-japan.go.jp/itpr_id/sch_rs.html`
> - `https://www.id.emb-japan.go.jp/itpr_id/sch_js.html`
> - `https://www.id.emb-japan.go.jp/itpr_id/sch_senshu.html`
> - `https://www.id.emb-japan.go.jp/itpr_id/sch_tt.html`

> **GKS Note:** `studyinkorea.go.kr` is a JavaScript-heavy SPA. The standard HTML crawler
> cannot extract tab content. Use `jina_fetch.js` or crawl manually.

### 3b. Update `scripts/reextract.js`

Open the file and update the parts that change. The most commonly updated fields each year:

```js
// ── MEXT - update year and dates ──────────────────────────────
name: 'MEXT Undergraduate Program (Gakubu) 2028',  // <- update year
deadline: 'Documents must arrive by 19 April 2027 at 23:59 WIB', // <- update
application_period: ['1 April 2027 – 19 April 2027'],  // <- update
important_dates: [
  '● Registration Period : 1 April 2027 – 19 April 2027', // <- update all rows
  ...
],
amounts: ['¥120,000/month'], // <- update if stipend increases

// ── Turkiye - update TL amounts if increased ──────────────────
amounts: ['5,000 TL/month'], // <- update if raised

// ── Chevening - update deadline ───────────────────────────────
deadline: '7 October 2026 at 12:00 UTC', // <- update annually
application_period: ['5 August 2026 – 7 October 2026'],

// ── Australia Awards - update deadline ────────────────────────
deadline: '30 April 2027 at 11.00 WIB',
application_period: ['Applications open early 2027 – close 30 April 2027'],

// ── GKS - update deadline if changed ─────────────────────────
// Graduate: typically Feb-March
// Undergraduate: typically September-October
```

If a provider adds a **new program**, add a new entry to the relevant array (`daad`, `mext`, `turkiye`, `chevening`, `australiaAwards`, `gks`).

If a program is **discontinued**, remove its entry from the array.

### 3c. Generate JSON

```bash
node scripts/reextract.js
```

Expected output:
```
✓ Written 68 scholarships to .../data/scholarships.json
  DAAD: 19, MEXT: 6, Turkiye: 17, Chevening: 3, Australia Awards: 5, GKS: 3, Singapore: 7, Eiffel: 5, Canada: 3
```

Verify the numbers look reasonable. If any count differs significantly, check for accidentally deleted entries.

### 3d. Build & Test

```bash
npx next build
```

Then run the dev server and check:
- [ ] Homepage stats card (scholarship count, countries, providers)
- [ ] `/scholarships` - all entries appear
- [ ] Detail page for at least one updated scholarship
- [ ] Deadline badge status (Open/Closed/Rolling) is correct
- [ ] `/providers/[slug]` for each provider

---

## 4. Adding a New Provider

### Step 1 - Crawl raw data

```bash
# Dry-run first
node scripts/crawl.js <OFFICIAL_URL> <provider-name> --dry-run --max 20

# If the dry-run looks good, run for real
node scripts/crawl.js <OFFICIAL_URL> <provider-name> \
  --keywords "scholarship,eligibility,apply,benefit,requirement,deadline,program" \
  --depth 2 --max 30
```

Provider name must be lowercase with hyphens, e.g. `fulbright`, `erasmus-mundus`.

Raw files are automatically saved to `data/raw/<provider-name>/`.

### Step 2 - Read and understand the raw data

Read through the crawled files to identify:
- Available program names
- Eligibility requirements
- Benefits/amounts
- Deadlines and application windows
- Official URLs

### Step 3 - Add a new array in `reextract.js`

At the top of the file, add shared constants if relevant:

```js
const FULBRIGHT_BENEFITS = [
  'Full tuition and fees',
  'Monthly living stipend',
  'Round-trip airfare',
  'Health insurance',
  // ...
];
```

Then create the entries array:

```js
const fulbright = [
  {
    name: 'Fulbright Indonesian Presidential Scholarship',
    provider: 'Fulbright / AMINEF',
    country: 'United States',
    degree_levels: ["Master's", 'PhD'],
    fields: ['All disciplines'],
    funding_type: 'Fully Funded',
    duration_months: { min: 24, max: 48 },
    deadline: 'March 15 (annually)',
    application_period: ['October – March'],
    important_dates: [
      'Applications open: October',
      'Applications close: mid-March',
      'Notification: June–July',
    ],
    requirements: {
      first_degree_required: true,
      professional_experience_required: null,
      professional_experience_years: null,
      country_restrictions: ['Indonesia'],
      raw_items: [
        'Indonesian citizen',
        'Minimum GPA 3.0/4.0',
        // ...
      ],
    },
    benefits: [...FULBRIGHT_BENEFITS],
    amounts: [],
    target_group: '...',
    official_url: 'https://www.aminef.or.id/grants-for-indonesians/fulbright-programs/',
    description: '...',
    application_process: ['...'],
    source: '01_fulbright_main.md',
    source_file: 'data/raw/fulbright/01_fulbright_main.md',
  },
  // ... more entries
];
```

### Step 4 - Update the spread at the bottom of `reextract.js`

```js
// Before
const scholarships = [...daad, ...mext, ...turkiye, ...chevening, ...australiaAwards, ...gks].map(...)

// After
const scholarships = [...daad, ...mext, ...turkiye, ...chevening, ...australiaAwards, ...gks, ...fulbright].map(...)
```

Also update `provider_groups` and `provider_summaries`:

```js
const output = {
  provider_groups: ['DAAD', 'MEXT', 'TURKIYE', 'CHEVENING', 'AUSTRALIA_AWARDS', 'GKS', 'FULBRIGHT'],
  provider_summaries: [
    // ...existing entries...
    { provider_group: 'FULBRIGHT', file_count: 5, scholarship_count: fulbright.length },
  ],
  // ...
};
```

### Step 5 - Update `src/lib/scholarships.ts`

**Add the new provider group** to the `providerGroup()` function:

```ts
export function providerGroup(provider: string): string {
  const p = provider.toLowerCase();
  // ...existing conditions...
  if (p.includes('fulbright') || p.includes('aminef')) return 'fulbright';
  // ...
}
```

**Add providerMeta entry:**

```ts
export const providerMeta = {
  // ...existing entries...
  fulbright: {
    name: 'Fulbright / AMINEF',
    flag: '🇺🇸',
    country: 'United States',
    description: 'The Fulbright Program...',
    website: 'https://www.aminef.or.id',
  },
};
```

**Update deadline logic** in `getDeadlineStatus()` if the provider has a specific annual deadline pattern. Otherwise it will automatically fall back to `rolling`.

### Step 6 - Update `providers/[provider]/page.tsx`

Add the slug to `generateStaticParams`:

```ts
export async function generateStaticParams() {
  return ['daad', 'mext', 'turkiye', 'chevening', 'australia-awards', 'gks', 'fulbright']
    .map((provider) => ({ provider }));
}
```

### Step 7 - Update UI components

**Navbar** - add to the providers array:
```tsx
{ name: 'Fulbright', country: 'United States', flag: '🇺🇸', slug: 'fulbright' },
```

**Footer** - add to the Providers column:
```tsx
<Link href="/providers/fulbright">🇺🇸 Fulbright</Link>
```

**ScholarshipsFilter** - add to the PROVIDERS list:
```ts
{ value: 'fulbright', label: '🇺🇸 Fulbright' },
```

**About page** - updates automatically since it uses `providerMeta`.

### Step 8 - Generate and build

```bash
node scripts/reextract.js
npx next build
```

---

## 5. Script Reference

### `scripts/crawl.js`

Auto-discover crawler. Starts from a root URL and follows relevant internal links.

```bash
node scripts/crawl.js <rootUrl> <providerName> [options]

Options:
  --depth <n>        Max link-follow depth (default: 3)
  --keywords <list>  Comma-separated keywords to filter followed paths
  --delay <ms>       Delay between requests in ms (default: 800)
  --max <n>          Max pages to crawl (default: 50)
  --dry-run          Preview URLs without saving files
```

**When to use:** Providers with standard HTML websites (Chevening, Australia Awards, DAAD, Turkiye, etc.)

**Not suitable for:** JavaScript-heavy SPA sites (GKS, some MEXT pages). Use `jina_fetch.js` instead.

### `scripts/jina_fetch.js`

Fetches a single URL via Jina Reader. Can bypass JavaScript-rendered content.

```bash
node scripts/jina_fetch.js <url> <outputFile>

# Example
node scripts/jina_fetch.js \
  "https://www.studyinkorea.go.kr/en/main.do" \
  "data/raw/gks/01_gks_main.md"
```

**When to use:** SPA sites, or as a fallback when `crawl.js` returns empty content.

### `scripts/reextract.js`

Main generator. Reads all data defined in the script and outputs to `scholarships.json`.

```bash
node scripts/reextract.js
```

---

## 6. Troubleshooting

### Crawl returns empty or very short content

The site likely uses JavaScript to render content. Try:
```bash
node scripts/jina_fetch.js <url> <output>
```

### Crawler follows irrelevant pages

Add more specific `--keywords`, or reduce `--depth`:
```bash
node scripts/crawl.js <url> <provider> \
  --keywords "scholarship,eligibility,apply,benefit" \
  --depth 1 --max 15
```

### `reextract.js` throws an error

Usually a JavaScript syntax error inside the script. Run:
```bash
node --check scripts/reextract.js
```

### Build error after data update

Most common causes:
1. **TypeScript** - `providerGroup()` return type changed from a union to `string`. Make sure no component is type-checking against a specific union value.
2. **Missing slug** - slugs are auto-generated from names. If there are duplicates across providers, slugs get a numeric suffix (`-1`, `-2`). Check `lib/scholarships.ts` in the `toSlug` function.
3. **generateStaticParams** - added a new provider but forgot to update `providers/[provider]/page.tsx`.

### Deadline badge missing or showing wrong status

Check `getDeadlineStatus()` in `src/lib/scholarships.ts`. Each provider group has its own logic. If a new provider does not have a handler, it will fall back to `rolling` (blue badge, "Rolling intake").

---

## 7. Current Providers

| Provider | Raw Folder | # Scholarships | Notes |
|---|---|---|---|
| 🇩🇪 DAAD | `data/raw/daad/` | 19 | Crawled from `daad-indonesia.org` |
| 🇩🇪 Studienstiftung | `data/raw/studienstiftung/` | 5 | 16 files crawled from `studienstiftung.de/en` — UG/Master, Doctoral, ERP, McCloy, Leo Baeck |
| 🇯🇵 MEXT | `data/raw/mext/` | 6 | 6 separate files per program, crawled from Jakarta embassy site |
| 🇹🇷 Turkiye Burslari | `data/raw/turkiyeburslari/` | 17 | 8 files from various portal pages |
| 🇬🇧 Chevening | `data/raw/chevening/` | 3 | 25 files crawled from `chevening.org/scholarship/indonesia` |
| 🇬🇧 Gates Cambridge | `data/raw/gates-cambridge/` | 1 | 9 files crawled from `gatescambridge.org` |
| 🇬🇧 Clarendon Fund | `data/raw/clarendon/` | 1 | Manually compiled from `ox.ac.uk/clarendon` |
| 🇬🇧 Rhodes Scholarship | `data/raw/rhodes/` | 1 | Manually compiled from `rhodeshouse.ox.ac.uk` |
| 🇳🇱 Netherlands | `data/raw/netherlands/` | 9 | Manually compiled — Holland Scholarship, OKP, Orange Tulip, TU Delft, Groningen, UvA, Leiden, Maastricht, Radboud |
| 🇦🇺 Australia Awards | `data/raw/australia-awards/` | 5 | 30 files from `australiaawardsindonesia.org` |
| 🇰🇷 GKS Korea | `data/raw/gks/` | 3 | Partial crawl - SPA site. `02_ko_plan_scholarship-do.md` is the main source (30k chars) |
| 🇸🇬 Singapore | `data/raw/singa/` | 7 | NUS, NTU, A*STAR scholarship pages |
| 🇫🇷 France (Eiffel) | `data/raw/eiffel/` | 5 | Eiffel, Sciences Po, ENS Lyon, Paris-Saclay |
| 🇨🇦 Canada | `data/raw/canada/` | 3 | CGRS-D, Canada Impact+, Lester B. Pearson |
| 🇸🇬 A*STAR | *(script only)* | 3 | AGS PhD, AIF Postdoc, AGS-MNS |
| 🇯🇵 JASSO | `data/raw/jasso/` | 2 | Honors Scholarship + Student Exchange Support |
| 🇰🇷 KOICA | `data/raw/koica/` | 2 | Master's and Doctoral tracks |
| 🇨🇦 CPRA | `data/raw/canada/` | 1 | Canada Postdoctoral Research Award |

### Recommended Annual Update Schedule

| Month | Providers to Check |
|---|---|
| January | Turkiye Burslari (applications open Jan 10), GKS Graduate (apps Feb-Mar), Netherlands university scholarships (~Feb 1 deadline) |
| February | GKS Graduate deadline, Chevening results, MEXT Teacher Training & Japanese Studies, **Leo Baeck Fellowship deadline (Feb 1)**, Netherlands uni scholarships deadline |
| March | Australia Awards (applications open), LPDP-Australia Awards |
| April | MEXT Gakubu, KOSEN, Research Student, Senshu (applications April-May) |
| July | **Studienstiftung ERP Fellowship opens (Jul 1 – Sep 20)**, KOICA deadline (~Jul) |
| August | Chevening (applications open 5 Aug), GKS Undergraduate (Sept-Oct), **Studienstiftung McCloy opens (Aug 1 – Nov 1)** |
| September | **Studienstiftung ERP closes (Sep 20)**, **Gates Cambridge opens (Sep)** |
| October | Chevening deadline (7 Oct), GKS Undergraduate deadline, **CPRA deadlines (Sep 11–Oct 17)**, **Gates Cambridge intl deadline (~Dec)** |
| November | Turkiye Burslari Success Scholarship, **Studienstiftung McCloy closes (Nov 1)** |
| December | GKS Undergraduate results, **Gates Cambridge international deadline (~Dec 15)**, **Clarendon first Oxford deadline (~Dec 1)** |

---

*Last updated: June 2026*
