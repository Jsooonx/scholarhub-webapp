# Panduan Lengkap Deploy ScholarHub ke Cloudflare Pages & Cloudflare D1

Dokumen ini berisi panduan langkah demi langkah untuk mendeploy website **ScholarHub** dan database terdistribusi **Cloudflare D1** secara penuh (100% native di ekosistem Cloudflare tanpa ketergantungan Supabase).

---

## Langkah 1: Buat Database Cloudflare D1

1. Pastikan Anda memiliki akun Cloudflare dan Wrangler CLI (atau gunakan Cloudflare Dashboard).
2. Di terminal, jalankan perintah berikut untuk membuat database D1:
   ```bash
   npx wrangler d1 create scholarhub-db
   ```
3. Terminal akan menampilkan output seperti:
   ```text
   ✅ Successfully created DB 'scholarhub-db'
   database_id = "xxxx-xxxx-xxxx-xxxx"
   ```
4. Salin `database_id` tersebut ke dalam file [wrangler.json](file:///d:/Productivity/Coding/Websites/(Usecase-Webapp)/WebApp-ScholarHub/wrangler.json):
   ```json
   "d1_databases": [
     {
       "binding": "DB",
       "database_name": "scholarhub-db",
       "database_id": "PASTE_DATABASE_ID_ANDA_DI_SINI"
     }
   ]
   ```

---

## Langkah 2: Eksekusi Migrasi Skema D1

Jalankan perintah ini untuk membuat tabel `users`, `sessions`, `magic_links`, `profiles`, `shortlists`, dan `scholarship_applications`:

```bash
npx wrangler d1 execute scholarhub-db --file=d1/schema.sql --remote
```

*(Untuk pengujian lokal, schema akan otomatis diinisialisasi di local SQLite).*

---

## Langkah 3: Hubungkan ke Cloudflare Pages

1. Masuk ke [Cloudflare Dashboard](https://dash.cloudflare.com/) $\rightarrow$ **Compute (Workers & Pages)** $\rightarrow$ **Create Application** $\rightarrow$ **Pages** $\rightarrow$ **Connect to Git**.
2. Pilih repositori GitHub: `Jsooonx/scholarhub-webapp`.
3. Konfigurasi Build:
   - **Framework preset**: `Next.js`
   - **Build command**: `npm run build`
   - **Build output directory**: `.next`
   - **Root directory**: `/` (default)

---

## Langkah 4: Hubungkan D1 Binding di Cloudflare Pages Dashboard

1. Setelah project Pages dibuat di dashboard Cloudflare, buka **Settings** $\rightarrow$ **Bindings** (atau **Functions** / **D1 Database bindings**).
2. Klik **Add binding** $\rightarrow$ **D1 Database**:
   - **Variable name**: `DB`
   - **D1 database**: Pilih `scholarhub-db`
3. Klik **Save**.

---

## Langkah 5: Atur Environment Variables dan Secrets di Cloudflare

Simpan konfigurasi publik sebagai environment variable. Jangan menyimpan API key atau token di `wrangler.json`, Git, atau dokumentasi.

| Variable Name | Value / Contoh | Keterangan |
|---|---|---|
| `NODE_VERSION` | `20` | Wajib untuk Next.js 16 |
| `NEXT_PUBLIC_SITE_URL` | `https://scholarhub.pages.dev` | Ganti dengan domain Cloudflare / domain kustom Anda |
| `RESEND_AUDIENCE_ID` | `your-resend-audience-id` | Audience ID Resend |

Klik **Save and Deploy**.

Atur secret secara terpisah menggunakan Wrangler untuk environment yang sesuai:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put NOTIFY_SECRET
```

Perintah tersebut meminta nilai secara interaktif dan menyimpannya di Cloudflare Secret Store. Ulangi untuk environment Production/Preview bila keduanya digunakan. Karena token notifikasi sebelumnya pernah berada di konfigurasi tracked, rotasi token tersebut sebelum deployment berikutnya.

---

## Langkah 6: Verifikasi Fitur di Cloudflare Pages

1. **Passwordless Magic Link Login**:
   - Buka `/login`, masukkan email Anda, dan klik **Send magic sign-in link**.
   - Periksa email masuk $\rightarrow$ klik link login $\rightarrow$ Anda akan otomatis masuk dan diarahkan ke `/shortlist`.
2. **Shortlist & Kanban Tracker**:
   - Simpan beasiswa dari halaman utama / `/scholarships`.
   - Pindahkan kartu di board tracker (`Shortlisted`, `Preparing`, `Applied`, dll.) $\rightarrow$ status otomatis tersimpan di Cloudflare D1.
   - Isi Checklist dokumen dan Notes pribadi.
3. **ScholarMatch Quiz Profile Sync**:
   - Buka `/match`, selesaikan kuis rekomendasi $\rightarrow$ preferensi profil Anda tersimpan di D1 dan langsung tersinkron di dashboard.
