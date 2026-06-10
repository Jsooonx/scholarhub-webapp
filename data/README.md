# ScholarHub - Data Directory

Semua data beasiswa tersimpan di sini.

## Files

| File | Deskripsi |
|---|---|
| `scholarships.json` | **Output utama** - dibaca oleh aplikasi. Jangan edit manual. |
| `DATA_GUIDE.md` | Panduan lengkap update data dan tambah provider baru. |

## Folders

| Folder | Deskripsi |
|---|---|
| `raw/daad/` | Raw crawl hasil dari daad-indonesia.org |
| `raw/mext/` | Raw crawl hasil dari id.emb-japan.go.jp (6 program) |
| `raw/turkiyeburslari/` | Raw crawl hasil dari turkiyeburslari.gov.tr |
| `raw/chevening/` | Raw crawl hasil dari chevening.org |
| `raw/australia-awards/` | Raw crawl hasil dari australiaawardsindonesia.org |
| `raw/gks/` | Raw crawl hasil dari studyinkorea.go.kr dan NIIED |

## Cara update data

Lihat `DATA_GUIDE.md` untuk panduan lengkap.

Singkatnya:
1. Update raw `.md` files di `raw/<provider>/`
2. Update `../scripts/reextract.js`
3. Jalankan `node scripts/reextract.js`
4. Build: `npx next build`
