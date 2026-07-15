# TaniPro

Platform B2B Agrilogistik Indonesia — menghubungkan petani langsung dengan pembeli industri, lengkap dengan simulasi logistik 3PL, laporan ESG, sistem loyalitas Tani Point, dan escrow pembayaran.

## Tech Stack

- **Framework:** Next.js 14 (App Router) — JavaScript murni, tanpa TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** bcryptjs (mock session, belum terhubung ke NextAuth)

## Struktur Proyek

```
app/
├── layout.jsx              # Root layout (dark theme, fonts)
├── page.jsx                # Landing page
├── pembeli/                # Dashboard Pembeli (B2B)
├── petani/                 # Dashboard Petani
├── admin/                  # Admin Command Center
└── api/                    # API Routes
components/
├── ui/                     # Shadcn primitives
├── shared/                 # Navbar, Sidebar, DashboardLayout, StatCard
├── pembeli/ petani/ admin/ # Komponen spesifik per peran
lib/
├── prisma.js                # Prisma client singleton
├── constants.js              # Fleet specs, Tani Point rules, navigasi, dll.
└── utils.js                  # Formatter, kalkulator ESG/logistik
prisma/
├── schema.prisma             # Data model lengkap
└── seed.js                   # Data awal (admin, petani, pembeli, produk)
```

## Prasyarat

- Node.js 18.18 atau lebih baru
- Database PostgreSQL (lokal, atau layanan cloud seperti Neon / Supabase / Railway)

## Menjalankan Secara Lokal

**1. Install dependencies**

```bash
npm install
```

**2. Siapkan environment variable**

Salin `.env.example` menjadi `.env`, lalu isi `DATABASE_URL` dengan connection string PostgreSQL kamu:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://user:password@localhost:5432/tanipro"
```

**3. Push schema ke database**

```bash
npm run db:push
```

**4. (Opsional) Isi data awal**

```bash
npm run db:seed
```

**5. Jalankan development server**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Script yang Tersedia

| Script | Fungsi |
|---|---|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build untuk production |
| `npm run start` | Menjalankan hasil build |
| `npm run lint` | Menjalankan ESLint |
| `npm run db:push` | Sinkronkan `schema.prisma` ke database (tanpa migration file) |
| `npm run db:seed` | Isi database dengan data contoh |
| `npm run db:studio` | Buka Prisma Studio (GUI database) |
| `npm run db:reset` | Reset database — **menghapus semua data** |

## Deploy ke Vercel

**1. Push kode ke Git**

Pastikan proyek sudah ada di repository GitHub/GitLab/Bitbucket — Vercel deploy berdasarkan repo, bukan upload manual.

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <url-repo-kamu>
git push -u origin main
```

**2. Siapkan database production**

Vercel tidak menyediakan PostgreSQL bawaan, jadi siapkan database cloud dulu — paling praktis pakai [Neon](https://neon.tech) atau [Supabase](https://supabase.com) (keduanya ada tier gratis dan cocok untuk serverless/Prisma). Salin connection string-nya untuk langkah berikutnya.

**3. Import project di Vercel**

- Buka [vercel.com/new](https://vercel.com/new)
- Pilih repository TaniPro kamu
- Framework Preset akan otomatis terdeteksi sebagai **Next.js** — biarkan default (Build Command: `next build`, Output: default)

**4. Set Environment Variable**

Di halaman konfigurasi sebelum deploy (atau nanti di **Project Settings → Environment Variables**), tambahkan:

| Key | Value |
|---|---|
| `DATABASE_URL` | connection string dari Neon/Supabase kamu |

Terapkan untuk environment **Production**, **Preview**, dan **Development** sekalian.

**5. Pastikan Prisma Client ter-generate saat build**

Tambahkan `postinstall` script berikut di `package.json` supaya Vercel otomatis menjalankan `prisma generate` setiap build (wajib untuk Prisma di Vercel):

```json
"scripts": {
  "postinstall": "prisma generate"
}
```

**6. Deploy**

Klik **Deploy**. Vercel akan install dependencies, generate Prisma Client, lalu build project.

**7. Push schema ke database production**

Schema belum otomatis ter-push ke database saat deploy. Jalankan sekali dari lokal (dengan `DATABASE_URL` yang sama seperti di Vercel):

```bash
DATABASE_URL="<connection-string-production>" npx prisma db push
```

Kalau mau isi data contoh juga:

```bash
DATABASE_URL="<connection-string-production>" node prisma/seed.js
```

## Catatan Penting Sebelum Deploy

- `next.config.js` saat ini membatasi Server Actions hanya untuk `localhost:3000` (`experimental.serverActions.allowedOrigins`). Setelah punya domain Vercel (misalnya `tanipro.vercel.app`), tambahkan domain tersebut ke daftar `allowedOrigins`, atau Server Actions akan gagal di production.
- Sesi user saat ini masih **mock** (`MOCK_USER` di masing-masing `layout.jsx`) — belum terhubung ke auth sungguhan. Aman untuk demo, tapi perlu diganti sebelum dipakai produksi nyata.
- Gunakan Postgres yang mendukung koneksi serverless/pooled (Neon & Supabase sudah otomatis menyediakan ini) agar tidak kehabisan koneksi saat traffic naik di lingkungan serverless Vercel.
