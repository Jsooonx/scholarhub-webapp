# ScholarHub - Data Management Guide

Panduan lengkap untuk menambah provider baru atau update data beasiswa yang sudah ada.

---

## Daftar Isi

1. [Struktur Data](#1-struktur-data)
2. [Alur Kerja Umum](#2-alur-kerja-umum)
3. [Update Data Tahunan (Provider Lama)](#3-update-data-tahunan-provider-lama)
4. [Menambah Provider Baru](#4-menambah-provider-baru)
5. [Referensi Script](#5-referensi-script)
6. [Troubleshooting](#6-troubleshooting)
7. [Provider yang Sudah Ada](#7-provider-yang-sudah-ada)

---

## 1. Struktur Data

```
data/
├── scholarships.json          ← File utama yang dibaca oleh aplikasi (JANGAN edit manual)
├── DATA_GUIDE.md              ← File ini
├── README.md
└── raw/                       ← Source data hasil crawl, satu folder per provider
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
    └── gks/
        └── *.md  (6 files)

scripts/
├── crawl.js        ← Crawler otomatis (auto-discover mode)
├── jina_fetch.js   ← Fetch satu URL via Jina Reader (bypass JS-heavy sites)
└── reextract.js    ← Generator scholarships.json dari raw data
```

### Aturan Penting

> ⚠️ **Jangan pernah edit `scholarships.json` secara langsung.**
> File ini adalah output dari `reextract.js`. Semua perubahan data harus dilakukan
> lewat raw `.md` files dan script extract.

---

## 2. Alur Kerja Umum

```
1. Crawl / update raw .md files
        ↓
2. Update scripts/reextract.js
        ↓
3. node scripts/reextract.js
        ↓
4. npx next build
        ↓
5. Verifikasi di browser
```

---

## 3. Update Data Tahunan (Provider Lama)

Dilakukan setiap awal tahun (Januari–Februari) atau saat ada perubahan signifikan dari provider.

### 3a. Crawl Ulang Raw Data

Gunakan script crawler untuk ambil konten terbaru dari website official:

```bash
# Format umum
node scripts/crawl.js <rootUrl> <providerName> [options]

# Selalu dry-run dulu untuk preview URL yang akan di-crawl
node scripts/crawl.js <rootUrl> <providerName> --dry-run --max 30
```

**Contoh per provider:**

```bash
# DAAD (Indonesia page)
node scripts/crawl.js https://www.daad-indonesia.org/en/find-funding/ daad \
  --keywords "scholarship,master,phd,doctoral,research,fellowship,grant,postdoc,apply,eligibility" \
  --depth 2 --max 30

# MEXT (crawl per program - 6 program URLs)
node scripts/crawl.js https://www.id.emb-japan.go.jp/itpr_id/sch_gakubu.html mext \
  --keywords "beasiswa,mext,persyaratan,fasilitas,jadwal,pendaftaran" \
  --depth 1 --max 5

# Türkiye Burslari
node scripts/crawl.js https://www.turkiyeburslari.gov.tr turkiyeburslari \
  --keywords "scholarship,program,apply,eligibility,benefit,requirement,calendar" \
  --depth 2 --max 40

# Chevening
node scripts/crawl.js https://www.chevening.org/scholarships chevening \
  --keywords "scholarship,eligibility,apply,timeline,benefits,who-can,faq,fellowship,programme" \
  --depth 2 --max 25

# Australia Awards
node scripts/crawl.js https://www.australiaawardsindonesia.org australia-awards \
  --keywords "scholarship,beasiswa,award,phd,masters,garuda,lpdp,apply,entitlement,requirement" \
  --depth 2 --max 35

# GKS Korea - gunakan jina_fetch karena site SPA
node scripts/jina_fetch.js \
  "https://www.studyinkorea.go.kr/en/main.do" \
  "data/raw/gks/01_gks_main_en.md"
# Lalu tambah manual file benefits detail jika diperlukan
```

> **Catatan MEXT:** Website MEXT Indonesia (`id.emb-japan.go.jp`) merilis halaman baru
> tiap tahun dengan nama program yang updated (misal "2027" → "2028"). Pastikan crawl
> URL yang benar per program. URL pattern:
> - `https://www.id.emb-japan.go.jp/itpr_id/sch_gakubu.html`
> - `https://www.id.emb-japan.go.jp/itpr_id/sch_kosen.html`
> - `https://www.id.emb-japan.go.jp/itpr_id/sch_rs.html`
> - `https://www.id.emb-japan.go.jp/itpr_id/sch_js.html`
> - `https://www.id.emb-japan.go.jp/itpr_id/sch_senshu.html`
> - `https://www.id.emb-japan.go.jp/itpr_id/sch_tt.html`

> **Catatan GKS:** `studyinkorea.go.kr` adalah SPA (JavaScript-heavy). Crawler HTML biasa
> tidak bisa ambil konten tab. Gunakan `jina_fetch.js` atau crawl manual.

### 3b. Update `scripts/reextract.js`

Buka file dan update bagian yang berubah. Yang paling sering berubah tiap tahun:

```js
// ── MEXT - update tahun dan tanggal ──────────────────────────
name: 'Beasiswa MEXT Program Undergraduate (Gakubu) 2028', // ← update tahun
deadline: 'Berkas harus tiba paling lambat 19 April 2027 pukul 23.59 WIB', // ← update
application_period: ['1 April 2027 – 19 April 2027'],       // ← update
important_dates: [
  '● Masa Pendaftaran : 1 April 2027 – 19 April 2027',      // ← update semua baris
  ...
],
amounts: ['¥120,000/month'], // ← update jika ada kenaikan tunjangan

// ── Türkiye - update TL amounts jika ada kenaikan ────────────
amounts: ['5,000 TL/month'], // ← update dari 4,500 jika naik

// ── Chevening - update deadline ──────────────────────────────
deadline: '7 October 2026 at 12:00 UTC', // ← update tiap tahun
application_period: ['5 August 2026 – 7 October 2026'],

// ── Australia Awards - update deadline ───────────────────────
deadline: '30 April 2027 at 11.00 WIB',
application_period: ['Applications open early 2027 – close 30 April 2027'],

// ── GKS - update deadline jika ada perubahan ─────────────────
// Graduate: biasanya Feb–March
// Undergraduate: biasanya September–October
```

Jika ada **program baru** dari provider yang sudah ada, tambahkan entry baru di array yang relevan (`daad`, `mext`, `turkiye`, `chevening`, `australiaAwards`, `gks`).

Jika ada **program yang dihapus**, hapus entry tersebut dari array.

### 3c. Generate JSON

```bash
node scripts/reextract.js
```

Output yang diharapkan:
```
✓ Written 53 scholarships to .../data/scholarships.json
  DAAD: 19, MEXT: 6, Türkiye: 17, Chevening: 3, Australia Awards: 5, GKS: 3
```

Verifikasi jumlahnya masuk akal. Kalau ada angka yang jauh berbeda, cek apakah ada entry yang terhapus tidak sengaja.

### 3d. Build & Test

```bash
npx next build
```

Lalu jalankan dev server dan cek:
- [ ] Homepage stats card (jumlah beasiswa, countries, providers)
- [ ] `/scholarships` - semua entries muncul
- [ ] Detail page salah satu beasiswa yang di-update
- [ ] Deadline badge status (Open/Closed/Rolling) sudah benar
- [ ] `/providers/[slug]` masing-masing provider

---

## 4. Menambah Provider Baru

### Langkah 1 - Crawl raw data

```bash
# Dry-run dulu
node scripts/crawl.js <URL_OFFICIAL> <nama-provider> --dry-run --max 20

# Jika hasil dry-run oke, jalankan beneran
node scripts/crawl.js <URL_OFFICIAL> <nama-provider> \
  --keywords "scholarship,eligibility,apply,benefit,requirement,deadline,program" \
  --depth 2 --max 30
```

Nama provider harus lowercase dan pakai hyphen, contoh: `fulbright`, `erasmus-mundus`, `chevening`.

Raw files akan tersimpan otomatis di `data/raw/<nama-provider>/`.

### Langkah 2 - Baca dan pahami raw data

Baca file-file yang di-crawl untuk mengetahui:
- Nama-nama program yang tersedia
- Eligibility requirements
- Benefits/amounts
- Deadline dan application window
- Official URLs

### Langkah 3 - Tambah array baru di `reextract.js`

Di bagian atas file, tambahkan konstanta shared jika relevan:

```js
const FULBRIGHT_BENEFITS = [
  'Full tuition and fees',
  'Monthly living stipend',
  'Round-trip airfare',
  'Health insurance',
  // ...
];
```

Lalu buat array entries:

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
  // ... lebih banyak entries
];
```

### Langkah 4 - Update spread di bagian bawah `reextract.js`

```js
// Sebelum
const scholarships = [...daad, ...mext, ...turkiye, ...chevening, ...australiaAwards, ...gks].map(...)

// Sesudah
const scholarships = [...daad, ...mext, ...turkiye, ...chevening, ...australiaAwards, ...gks, ...fulbright].map(...)
```

Update juga `provider_groups` dan `provider_summaries`:

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

### Langkah 5 - Update `src/lib/scholarships.ts`

**Tambah provider group baru** di fungsi `providerGroup()`:

```ts
export function providerGroup(provider: string): string {
  const p = provider.toLowerCase();
  // ...existing conditions...
  if (p.includes('fulbright') || p.includes('aminef')) return 'fulbright';
  // ...
}
```

**Tambah providerMeta:**

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

**Update deadline logic** di `getDeadlineStatus()` jika provider punya pola deadline tahunan yang spesifik. Jika tidak, akan otomatis fallback ke `rolling`.

### Langkah 6 - Update `providers/[provider]/page.tsx`

Tambah slug ke `generateStaticParams`:

```ts
export async function generateStaticParams() {
  return ['daad', 'mext', 'turkiye', 'chevening', 'australia-awards', 'gks', 'fulbright']
    .map((provider) => ({ provider }));
}
```

### Langkah 7 - Update UI components

**Navbar** - tambah ke dropdown:
```tsx
// Navbar.tsx - providers array
{ name: 'Fulbright', country: 'United States', flag: '🇺🇸', slug: 'fulbright' },
```

**Footer** - tambah ke Providers column:
```tsx
<Link href="/providers/fulbright">🇺🇸 Fulbright</Link>
```

**Trending** - jika ingin tampil di homepage "By provider", tambah ke `PROVIDER_GROUPS` array dan `flagMap`/`PROVIDER_IMAGES`/`PROVIDER_LABELS` di `Trending.tsx`.

**ScholarshipsFilter** - tambah ke PROVIDERS list:
```ts
{ value: 'fulbright', label: '🇺🇸 Fulbright' },
```

**About page** - otomatis update karena menggunakan `providerMeta`.

### Langkah 8 - Generate dan build

```bash
node scripts/reextract.js
npx next build
```

---

## 5. Referensi Script

### `scripts/crawl.js`

Auto-discover crawler. Mulai dari satu URL dan follow internal links yang relevan.

```bash
node scripts/crawl.js <rootUrl> <providerName> [options]

Options:
  --depth <n>        Max kedalaman link follow (default: 3)
  --keywords <list>  Comma-separated keywords untuk filter path yang di-follow
  --delay <ms>       Delay antar request, ms (default: 800)
  --max <n>          Maksimal halaman (default: 50)
  --dry-run          Preview URLs tanpa save file
```

**Kapan pakai:** Provider dengan website HTML biasa (Chevening, Australia Awards, DAAD, Türkiye, dll).

**Tidak cocok untuk:** Website SPA/JavaScript-heavy (GKS, beberapa halaman MEXT). Gunakan `jina_fetch.js` sebagai gantinya.

### `scripts/jina_fetch.js`

Fetch satu URL via Jina Reader. Bisa bypass JavaScript-rendered content.

```bash
node scripts/jina_fetch.js <url> <outputFile>

# Contoh
node scripts/jina_fetch.js \
  "https://www.studyinkorea.go.kr/en/main.do" \
  "data/raw/gks/01_gks_main.md"
```

**Kapan pakai:** Site SPA, atau sebagai fallback ketika `crawl.js` dapat konten kosong.

### `scripts/reextract.js`

Generator utama. Membaca data yang sudah di-code di script dan output ke `scholarships.json`.

```bash
node scripts/reextract.js
```

---

## 6. Troubleshooting

### Crawl menghasilkan konten kosong atau terlalu pendek

Kemungkinan situs pakai JavaScript untuk render konten. Coba:
```bash
node scripts/jina_fetch.js <url> <output>
```

### Crawler masuk ke halaman yang tidak relevan

Tambahkan `--keywords` yang lebih spesifik, atau kurangi `--depth`:
```bash
node scripts/crawl.js <url> <provider> \
  --keywords "scholarship,eligibility,apply,benefit" \
  --depth 1 --max 15
```

### `reextract.js` error

Biasanya karena syntax JS di dalam script. Jalankan:
```bash
node --check scripts/reextract.js
```

### Build error setelah update data

Paling sering karena:
1. **TypeScript** - `providerGroup()` return type berubah dari union ke `string`. Pastikan tidak ada komponen yang type-check ke specific union type.
2. **Missing slug** - slug di-generate otomatis dari nama. Kalau ada nama duplikat antar provider, slug akan di-suffix angka (`-1`, `-2`). Cek di `lib/scholarships.ts` bagian `toSlug`.
3. **generateStaticParams** - kalau tambah provider baru tapi lupa update `providers/[provider]/page.tsx`.

### Deadline badge tidak muncul atau status salah

Cek `getDeadlineStatus()` di `src/lib/scholarships.ts`. Setiap provider group punya logic sendiri. Kalau provider baru belum ada handlernya, akan fallback ke `rolling` (biru, "Rolling intake").

---

## 7. Provider yang Sudah Ada

| Provider | Folder Raw | # Scholarships | Catatan |
|---|---|---|---|
| 🇩🇪 DAAD | `data/raw/daad/` | 19 | Crawl dari `daad-indonesia.org` |
| 🇯🇵 MEXT | `data/raw/mext/` | 6 | 6 file terpisah per program, crawl URL embassy Jakarta |
| 🇹🇷 Türkiye Burslari | `data/raw/turkiyeburslari/` | 17 | 8 file dari berbagai halaman portal |
| 🇬🇧 Chevening | `data/raw/chevening/` | 3 | 25 file crawl dari `chevening.org/scholarship/indonesia` |
| 🇦🇺 Australia Awards | `data/raw/australia-awards/` | 5 | 30 file dari `australiaawardsindonesia.org` |
| 🇰🇷 GKS Korea | `data/raw/gks/` | 3 | Partial crawl - site SPA. File `02_ko_plan_scholarship-do.md` adalah sumber utama (30k chars) |

### Jadwal Update Tahunan (Rekomendasi)

| Bulan | Provider yang Perlu Dicek |
|---|---|
| Januari | Türkiye Burslari (aplikasi buka 10 Jan), GKS Graduate (aplikasi Feb–Mar) |
| Februari | GKS Graduate deadline, Chevening results, MEXT Teacher Training & Japanese Studies |
| Maret | Australia Awards (aplikasi buka), LPDP-Australia Awards |
| April | MEXT Gakubu, KOSEN, Research Student, Senshu (aplikasi April–Mei) |
| Agustus | Chevening (aplikasi buka 5 Aug), GKS Undergraduate (Sept–Oct) |
| Oktober | Chevening deadline (7 Oct), GKS Undergraduate deadline |
| November | Türkiye Burslari Success Scholarship |
| Desember | GKS Undergraduate results |

---

*Last updated: June 2026*
