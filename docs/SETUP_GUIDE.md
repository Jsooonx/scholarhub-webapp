# ScholarHub - Complete Setup Guide

One guide to rule them all. Covers everything from adding scholarship data to implementing features.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Getting Started (Local Dev)](#2-getting-started-local-dev)
3. [Data Structure](#3-data-structure)
4. [General Data Flow](#4-general-data-flow)
5. [Adding a New Country / Provider](#5-adding-a-new-country--provider)
6. [Updating the Scholarships Library](#6-updating-the-scholarships-library)
7. [Auth & Database](#7-auth--database)
8. [Current Features](#8-current-features)
9. [Sending Notifications](#9-sending-notifications)
10. [Troubleshooting](#10-troubleshooting)
11. [Current Countries & Counts](#11-current-countries--counts)

---

## 1. Project Overview

```
Stack: Next.js 16 + React 19 + Supabase + Tailwind v4
Animations: Framer Motion, GSAP, Lenis (smooth scroll)
Auth: Supabase Auth (Google OAuth + Email magic link)
Email: Resend (newsletter + notifications)
Data: Static JSON generated from data/scholarships/index.js (per-country files)
```

### Data Flow

```
research → data/scholarships/<country>.js (add arrays)
                ↓
      data/scholarships/index.js (imports all + assembly)
                ↓
      node scripts/reextract.js (thin wrapper → requires index.js)
                ↓
      data/scholarships.json (auto-generated)
                ↓
      src/lib/scholarships/ (providerGroup, meta, helpers, data)
                ↓
      Pages & components consume src/lib/scholarships.ts (facade)
```

### Key Architecture Decisions

- **Country-first grouping**: All provider pages are per-country (`/providers/germany`)
- **Static generation**: All pages are SSG (Static Site Generation) via `generateStaticParams`
- **Auto-generated**: `providerMeta` drives Navbar, Footer, About page, filter dropdowns automatically
- **No manual UI per provider**: Adding a new country = add to `providerMeta` → everything appears

---

## 2. Getting Started (Local Dev)

```bash
git clone <repo>
cd scholarhub
npm install
```

Create `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"  # for admin operations
RESEND_API_KEY=""
RESEND_AUDIENCE_ID=""
NOTIFY_SECRET=""
SITE_URL="http://localhost:3000"
```

Run dev:

```bash
npm run dev
```

Build for production:

```bash
npx next build
```

---

## 3. Data Structure

```
data/
├── scholarships.json              ← Main file read by the app (DO NOT edit manually!)
├── README.md
├── scholarships/                  ← Per-country scholarship data files
│   ├── index.js                   ← Assembly: imports all countries + writes JSON
│   ├── daad.js                    ← Germany (DAAD)
│   ├── mext.js                    ← Japan (MEXT)
│   ├── turkiye.js                 ← Turkey
│   ├── saudiMoe.js                ← Saudi Arabia
│   ├── qatar.js                   ← Qatar
│   ├── hongKong.js                ← Hong Kong
│   ├── malaysia.js                ← Malaysia
│   ├── denmark.js                 ← Denmark
│   └── ... (48 files total, one per country array)
└── raw/                           ← 48 provider folders with scraped .md files
    ├── daad/
    ├── mext/
    ├── turkiyeburslari/
    └── [45+ more folders]

scripts/
├── reextract.js                   ← Thin wrapper — just requires data/scholarships/index.js
├── crawl.js                       ← Auto-discover web crawler
└── jina_fetch.js                  ← Jina Reader for JS-heavy sites

src/
└── lib/
    └── scholarships/              ← Core pipeline directory
        ├── types.ts               ← Type/interface contracts
        ├── providerMeta.ts        ← Metadata for all providers
        ├── helpers.ts             ← Helper functions (logos, images, deadlines)
        ├── data.ts                ← Accessors & filtering logic
    └── scholarships.ts            ← Facade exporting all submodules

supabase/
└── migrations/                    ← 8 SQL migration files for auth & features
```

> ⚠️ **Never edit `data/scholarships.json` directly!** It's the output of `data/scholarships/index.js`.
> Instead, edit the per-country file in `data/scholarships/<country>.js`.

### Why Per-Country Files?

- **Before**: 1 file `scripts/reextract.js` — ~11K lines, 680KB
- **After**: 48 files in `data/scholarships/`, each 3-38KB
- Editing Malaysia? Open `data/scholarships/malaysia.js` → no scrolling through 11K lines
- Adding a new country? Create `data/scholarships/new-country.js` → register in `index.js`

### Quick Commands

```bash
# Generate JSON from all country files (after editing any data)
node scripts/reextract.js

# Build
npx next build
```

---

## 4. General Data Flow

```
1. Research scholarships for a country
        ↓
2. Create/edit data/scholarships/<country>.js
        ↓
3. Register the array in data/scholarships/index.js (COUNTRY_PROGRAMS + spread)
        ↓
4. node scripts/reextract.js (thin wrapper → triggers data/scholarships/index.js)
        ↓
5. Update files under src/lib/scholarships/:
   - helpers.ts        ← providerGroup(), getDeadlineStatus(), getScholarshipImage(), getMatchedUniversityLogos()
   - providerMeta.ts   ← providerMeta (flag, description, website)
        ↓
6. npx next build
        ↓
7. Verify in browser
```

---

## 5. Adding a New Country / Provider

### Step 1 — Create Data File in `data/scholarships/`

Create a new file e.g. `data/scholarships/my-new-country.js`:

```js
// ── My New Country ───────────────────────────────────────────────
const myNewCountry = [
  {
    name: "Scholarship Name Here",
    provider: "Provider Name",
    country: "Country Name",
    degree_levels: ["Bachelor", "Master", "PhD"],
    fields: ["All disciplines"],
    funding_type: "Fully Funded",
    duration_months: { min: 12, max: 48 },
    deadline: "15 January (annually)",
    application_period: ["October – January"],
    requirements: {
      first_degree_required: true,
      professional_experience_required: null,
      professional_experience_years: null,
      country_restrictions: ["Indonesia"],
      raw_items: ["Requirement item 1", "Requirement item 2"],
    },
    benefits: ["Full tuition fee", "Monthly living allowance"],
    amounts: ["$X,000/year"],
    target_group: "Description of ideal candidate.",
    official_url: "https://official-website.com",
    description: "Detailed scholarship description.",
    application_process: ["Step 1: Apply online", "Step 2: Submit documents"],
    source: "source_file_name.md",
    source_file: null,
  },
  // Add more entries...
];

module.exports = myNewCountry;
```

### Step 2 — Register in `data/scholarships/index.js`

Two things to add:

**A. Add import at the top:**
```js
const myNewCountry = require('./my-new-country');
```

**B. Add to COUNTRY_PROGRAMS:**
```js
const COUNTRY_PROGRAMS = {
  // ...existing entries...
  'my-new-country': { arrays: [myNewCountry], programs: ['Program1', 'Program2'] },
};
```

**C. Add to the scholarships spread:**
```js
const scholarships = [...daad, ...mext, ..., ...myNewCountry].map(...)
```

### Step 3 — Generate JSON

```bash
node scripts/reextract.js
```

Expected output will show your new country with counts.

---

## 6. Updating the Scholarships Library

After adding data to `reextract.js` and running it, you must update the submodules under `src/lib/scholarships/` in these 5 places:

### 6a. `providerGroup()` (in `src/lib/scholarships/helpers.ts`) — Map provider names to country slug

Find the function and add a new if-statement:

```ts
export function providerGroup(provider: string): string {
  const p = provider.toLowerCase();
  // ...existing conditions...
  if (p.includes('my provider') || p.includes('my uni')) return 'my-new-country';
  // Fallback — DO NOT REMOVE
  return p.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
```

> **Naming convention**: Use kebab-case for country slugs (`united-kingdom`, `south-korea`, `saudi-arabia`)

### 6b. `providerMeta` (in `src/lib/scholarships/providerMeta.ts`) — Country info, flag, description

Add an entry to the `providerMeta` object:

```ts
export const providerMeta = {
  // ...existing entries...
  'my-new-country': {
    name: 'My Country',
    flag: '🇲🇨',
    country: 'My Country',
    description: 'Description of scholarships available in this country.',
    website: 'https://official-website.com',
  },
};
```

> This automatically populates: Navbar dropdown, Footer links, About page, filter dropdowns, provider pages.

### 6c. `getDeadlineStatus()` (in `src/lib/scholarships/helpers.ts`) — Deadline badge logic

Find the function and add a new if-statement before `return getDaadStatus()`:

```ts
// ── My New Country: ~Month–Month annually ──────────────────────
if (group === 'my-new-country') {
  const now = new Date();
  const year = now.getFullYear();
  const open = new Date(year, 0, 1);   // Jan 1
  const close = new Date(year, 2, 31); // Mar 31
  // ... date comparison logic ...
  return { type: 'open', label: `Open · closes ${fmt}`, daysLeft: diff, deadline: target };
}
```

If the scholarship has rolling/no deadline, use:

```ts
if (group === 'my-new-country') return { type: 'rolling', label: 'Rolling intake' };
```

### 6d. `getScholarshipImage()` (in `src/lib/scholarships/helpers.ts`) — Hero background images

Add override entries for specific university images, plus a fallback:

```ts
// My New Country Universities
if (name.includes('my-uni') || provider.includes('my-uni')) return '/images/universities/MY_Uni.png';

// In the fallback section (before return '/images/editorial/stem.jpg'):
if (group === 'my-new-country') return '/images/universities/MY_Default.png';
```

### 6e. `getMatchedUniversityLogos()` (in `src/lib/scholarships/helpers.ts`) — Participating university logos

Add to the keyword-matching list:

```ts
// My New Country Universities
{ name: 'My University', logo: '/images/logos/MyUni.png', keywords: ['my uni', 'my university'] },
```

Add to the fallback section (when no keywords match):

```ts
} else if (group === 'my-new-country') {
  list.push(
    { name: 'My University', logo: '/images/logos/MyUni.png' },
    { name: 'My Other Uni', logo: '/images/logos/MyOtherUni.png' },
  );
}
```

---

## 7. Auth & Database

### 7.1 Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"    # for admin/server operations
```

### 7.2 Supabase Auth Providers

Enable in Supabase dashboard → Auth → Providers:
- **Google OAuth** — Configure with Google Cloud Console credentials
- **Email OTP / Magic Link** — Just toggle on

Redirect URL:
```
https://your-domain.com/auth/callback
http://localhost:3000/auth/callback
```

### 7.3 Database Migrations

Run all migrations in `supabase/migrations/` in order:

| File | Table | Purpose |
|---|---|---|
| `20260622000000_create_shortlists.sql` | `shortlists` | **DEPRECATED** — migrated into scholarship_applications |
| `20260622001000_create_profiles.sql` | `profiles` | User profiles (display name, username, bio, location, website, avatar) |
| `20260623002000_create_scholarship_applications.sql` | `scholarship_applications` | Core table — stores shortlist + application status (shortlisted/preparing/applied/interviewing/accepted/rejected), notes |
| `20260623003000_add_checklist_to_applications.sql` | `scholarship_applications` | Adds `checklist` (jsonb) column for per-application todo items |
| `20260623004000_add_target_deadline_to_applications.sql` | `scholarship_applications` | Adds `target_deadline` + `is_deadline_verified` columns |
| `20260623005000_add_announcement_to_applications.sql` | `scholarship_applications` | Adds `announcement_date` + `is_announcement_verified` columns |
| `20260625000000_add_quiz_answers_to_profiles.sql` | `profiles` | Adds `quiz_answers` (jsonb) column for ScholarMatch quiz |

### 7.4 Server Actions

All auth/data CRUD is handled via Next.js Server Actions:

| File (src/app/actions/) | Functions |
|---|---|
| `auth.ts` | `signOutAction()` |
| `profile.ts` | `getCurrentProfile()`, `updateProfileAction()`, `updateProfileQuizAnswers()` |
| `shortlist.ts` | `getShortlistSlugs()`, `addToShortlist()`, `removeFromShortlist()`, `updateApplicationStatus()`, `updateApplicationNotes()`, `updateApplicationChecklist()`, `updateApplicationDeadline()`, `updateApplicationAnnouncement()`, `getApplicationsWithDetails()` |

---

## 8. Current Features

| Feature | What It Does | Key Files |
|---|---|---|
| **Browse scholarships** | Filter by text, provider, funding, level, country | `scholarships/page.tsx`, `ScholarshipsFilter.tsx` |
| **Provider pages** | Per-country grouping | `providers/[provider]/page.tsx` |
| **Detail page** | Full info, benefits, requirements, deadlines | `scholarships/[slug]/page.tsx` |
| **Deadline badges** | Open/Closing/Closed/Rolling with countdown | `DeadlineStatus.tsx`, `getDeadlineStatus()` |
| **Google OAuth + Email login** | Supabase Auth with magic link | `login/page.tsx`, `actions/auth.ts` |
| **Profile** | Display name, username, bio, location, URLs | `profile/page.tsx`, `ProfileForm.tsx` |
| **ScholarMatch Quiz** | 5 questions → matched scholarships | `match/page.tsx`, `ScholarMatchQuiz.tsx` |
| **Shortlist (save)** | Bookmark scholarships | `SaveScholarshipButton.tsx`, `ShortlistProvider.tsx` |
| **Application Tracker** | Kanban board (6 statuses) | `ApplicationTracker.tsx`, `ShortlistDashboard.tsx` |
| **Checklist** | Per-application todo items | `ShortlistDashboard.tsx` |
| **Calendar view** | Deadline + announcement dates | `DeadlineCalendar.tsx` |
| **Newsletter** | Subscribe via Resend | `NewsletterFooter.tsx`, `api/subscribe/route.ts` |
| **Smooth scroll** | Lenis + GSAP ScrollTrigger | `SmoothScroll.tsx` |
| **Animations** | GSAP SplitText, Framer Motion, TrueFocus | Various components |
| **SEO** | Dynamic sitemap + robots.txt | `sitemap.ts`, `robots.ts` |

---

## 9. Sending Notifications

### Via curl

```bash
curl -X POST https://scholarhub.jsooonx.my.id/api/notify \
  -H "Content-Type: application/json" \
  -H "x-notify-secret: YOUR_NOTIFY_SECRET" \
  -d '{
    "subject": "Subject here",
    "note": "Optional intro paragraph",
    "updates": [
      "Update item 1",
      "Update item 2"
    ]
  }'
```

### Request Parameters

| Field | Required | Description |
|---|---|---|
| `subject` | Yes | Email subject line |
| `updates` | Yes | Array of strings (changes/new scholarships) |
| `note` | No | Optional intro paragraph |
| `from` | No | Sender name. Default: `ScholarHub <onboarding@resend.dev>` |

### Viewing Subscribers

Open [resend.com](https://resend.com) → **Audience** → **Contacts**.

Or via API:
```bash
curl https://api.resend.com/audiences/AUDIENCE_ID/contacts \
  -H "Authorization: Bearer RESEND_API_KEY"
```

> **Rate limits**: Resend free tier = 100 emails/day, 3,000/month.

---

## 10. Troubleshooting

### Build error after data update

Common causes:
1. **providerGroup() doesn't match** — Check if your provider name string is caught by the function. `node -e "console.log(require('./src/lib/scholarships').providerGroup('Your Provider'))"`
2. **Missing slug** — Duplicate scholarship names get `-1`, `-2` suffixes. Check `toSlug()` in `src/lib/scholarships/helpers.ts`.
3. **Missing provider group** — New scholarships not showing on `/providers/xxx`? The `generateStaticParams` uses `Object.keys(providerMeta)` — so if it's not in `providerMeta`, it won't appear.

### `reextract.js` syntax error

```bash
node --check scripts/reextract.js
```

Most common: unescaped apostrophes inside single-quoted strings. Use `\'s` or switch to double quotes for the field.

```
name: 'Some Bachelor's Program'   // ❌ SyntaxError
name: "Some Bachelor's Program"   // ✅ OK
```

### Deadline badge missing/wrong

`getDeadlineStatus()` falls back to `rolling` for unhandled groups. Add your country's logic before `return getDaadStatus()`.

### Scholarship not showing on provider page

Check `providerGroup(s.provider)` returns the right slug:

```bash
node -e "
const data = require('./data/scholarships.json');
const s = data.scholarships.find(s => s.name.includes('keyword'));
if (s) console.log(providerGroup(s.provider));
"
```

---

## 11. Current Countries & Counts

*Last updated: June 2026 — 243 scholarships, 33 countries*

| Country | Slugs | Scholarships | Key Programs |
|---|---|---|---|
| 🇩🇪 Germany | `germany` | 25 | DAAD, Studienstiftung, Leadership for Africa |
| 🇯🇵 Japan | `japan` | 10 | MEXT, JASSO, ADB-Japan, JJ/WBGSP |
| 🇹🇷 Turkey | `turkey` | 17 | Türkiye Burslari |
| 🇬🇧 United Kingdom | `united-kingdom` | 10 | Chevening, Gates Cambridge, Clarendon, Rhodes, Commonwealth |
| 🇦🇺 Australia | `australia` | 13 | Australia Awards, 8 universities |
| 🇰🇷 South Korea | `south-korea` | 5 | GKS, KOICA |
| 🇸🇬 Singapore | `singapore` | 10 | SINGA, NUS, NTU, A*STAR |
| 🇫🇷 France | `france` | 5 | Eiffel, Paris-Saclay, Sciences Po, ENS Lyon |
| 🇨🇦 Canada | `canada` | 4 | CGRS-D, Impact+, Pearson, CPRA |
| 🇺🇸 United States | `united-states` | 5 | Fulbright, Humphrey, FLTA, Knight-Hennessy |
| 🇳🇱 Netherlands | `netherlands` | 10 | Holland Scholarship, OKP, OTS, 7 universities |
| 🇧🇪 Belgium | `belgium` | 7 | VLIR-UOS, ARES, Master Mind, Science@Leuven, Global Minds |
| 🇪🇺 European Union | `eu` | 1 | Erasmus Mundus |
| 🇨🇳 China | `china` | 4 | CGS Bilateral, CGS University, Belt & Road, MOFCOM |
| 🇸🇪 Sweden | `sweden` | 9 | SISGP, PWIS, 7 universities |
| 🇮🇹 Italy | `italy` | 3 | MAECI, IYT, MAECI Special Projects |
| 🇭🇺 Hungary | `hungary` | 3 | Stipendium Hungaricum |
| 🇹🇼 Taiwan | `taiwan` | 6 | MOE, ICDF, Huayu, NTU, NTHU |
| 🇨🇭 Switzerland | `switzerland` | 6 | Swiss Govt Excellence, ETH ESOP, EPFL Excellence, UNIGE Excellence |
| 🇦🇹 Austria | `austria` | 5 | OeAD, TU Wien |
| 🇫🇮 Finland | `finland` | 6 | Helsinki, Aalto, Tampere, Oulu, Hanken, Nokia |
| 🇳🇿 New Zealand | `new-zealand` | 3 | Manaaki NZ |
| 🇮🇪 Ireland | `ireland` | 12 | GOI-IES, GOIPG, TCD, UCD, + more |
| 🇵🇱 Poland | `poland` | 5 | NAWA Banach, NAWA Łukasiewicz, Jagiellonian, Warsaw, NCN |
| 🇪🇸 Spain | `spain` | 5 | MAEC-AECID, la Caixa, IE Foundation, UdG |
| 🇩🇰 Denmark | `denmark` | 8 | Danish Govt, UCPH, Aarhus, DTU, CBS, SDU, AAU, RUC |
| 🇳🇴 Norway | `norway` | 2 | Tuition-Free, BI Presidential |
| 🇭🇰 Hong Kong | `hong-kong` | 6 | HKPFS, HKU, HKUST, CUHK, CityU, PolyU |
| 🇲🇾 Malaysia | `malaysia` | 9 | MIS, UM, USM, UPM, UTM, Monash, Nottingham, Curtin, Taylor's |
| 🇷🇴 Romania | `romania` | 4 | MFA Non-EU, ARICE, TAS, WUT Timișoara |
| 🇷🇺 Russia | `russia` | 7 | Open Doors, Quota, SPbU, BMSTU, MGIMO, HSE |
| 🇸🇦 Saudi Arabia | `saudi-arabia` | 11 | MOE, KSU, KAU, KFUPM, UQU, Madinah, KAUST |
| 🇶🇦 Qatar | `qatar` | 7 | QU, HBKU, Doha Institute, EAA |

---

## Quick Reference

### Commands

```bash
# Generate data (delegates to data/scholarships/index.js)
node scripts/reextract.js

# Check syntax of a data file
node --check data/scholarships/my-country.js

# Build
npx next build

# Dev
npm run dev

# Send notification
curl -X POST https://scholarhub.jsooonx.my.id/api/notify ...
```

### Files to edit when adding a new country

1. `data/scholarships/<country>.js` — Scholarship data arrays
2. `data/scholarships/index.js` — Import + register in COUNTRY_PROGRAMS + spread
3. `src/lib/scholarships/` submodules — `providerGroup`, `getDeadlineStatus`, `getScholarshipImage`, `getMatchedUniversityLogos` in `helpers.ts`; and `providerMeta` in `providerMeta.ts`

### Files you NEVER need to edit manually

- `data/scholarships.json` — Auto-generated
- `src/app/providers/[provider]/page.tsx` — Auto-generated from `providerMeta`
- `src/components/Navbar.tsx` dropdown — Auto-generated from `providerMeta`
- `src/components/Footer.tsx` links — Auto-generated from `providerMeta`
- `src/components/ScholarshipsFilter.tsx` — Auto-generated from `providerMeta`
- `src/app/about/page.tsx` — Auto-generated from `providerMeta`
