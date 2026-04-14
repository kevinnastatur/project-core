# HR Analytics — Frontend

Aplikasi web HR Analytics & Report System dibangun dengan **Next.js 14 App Router**, TypeScript, dan Tailwind CSS.

## Tech Stack

| Kategori | Library |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS + ShadCN UI |
| State | Zustand + TanStack Query |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios (BFF pattern) |
| Auth | JWT via httpOnly cookie + jose |
| Testing | Vitest + React Testing Library |
| Mocking | MSW (Mock Service Worker) |

## Struktur Folder

```
src/
├── app/
│   ├── (admin)/          # Route group: halaman admin (users, roles)
│   ├── (auth)/           # Route group: halaman autentikasi
│   ├── (b2b)/            # Route group: portal B2B
│   ├── (dashboard)/      # Route group: profile & dashboard
│   ├── bff/              # Backend for Frontend — route handlers API
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   ├── not-found.tsx      # Halaman 404
│   └── error.tsx          # Root error boundary
├── components/
│   ├── ui/               # ShadCN UI components
│   └── common/           # Shared components (Navbar, Sidebar, DataTable)
├── lib/
│   ├── api/              # Axios instances (client + server)
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service functions
│   └── validations/      # Zod schemas
├── stores/               # Zustand stores
├── types/                # TypeScript type definitions
└── middleware.ts          # Route protection middleware
```

## Cara Menjalankan

### 1. Persiapan environment

```bash
cp .env.example .env.local
# Edit .env.local sesuai konfigurasi lokal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Jalankan development server

```bash
npm run dev
```

Aplikasi berjalan di [http://localhost:3000](http://localhost:3000).

### 4. Build untuk production

```bash
npm run build
npm run start
```

## Testing

```bash
# Watch mode (development)
npm run test

# Run sekali (CI)
npm run test:run

# Dengan laporan coverage
npm run test:coverage
```

File test diletakkan di samping file yang diuji dengan format `*.test.ts` atau `*.test.tsx`.

## Environment Variables

Lihat [.env.example](.env.example) untuk daftar lengkap variabel yang dibutuhkan.

| Variable | Keterangan |
|---|---|
| `API_BASE_URL` | URL backend API (core-expressjs) |
| `ACCESS_TOKEN_COOKIE_NAME` | Nama cookie access token |
| `REFRESH_TOKEN_COOKIE_NAME` | Nama cookie refresh token |
| `COOKIE_SECRET` | Secret untuk signing cookie — **wajib diganti di production** |
| `NEXT_PUBLIC_ENABLE_MOCKING` | Aktifkan MSW mocking (`true`/`false`) |

## Arsitektur Autentikasi

Aplikasi menggunakan pola **BFF (Backend for Frontend)**:

```
Browser → Next.js BFF Routes (/bff/auth/*) → Backend API
```

Token JWT disimpan di **httpOnly cookie** (tidak bisa diakses JavaScript), sehingga lebih aman dari serangan XSS. Middleware Next.js memproteksi route yang membutuhkan autentikasi.

## Route Protection

| Route | Proteksi |
|---|---|
| `/users`, `/roles` | Harus login, redirect ke `/admin/login` |
| `/b2b` | Harus login, redirect ke `/b2b/login` |
| `/profile` | Harus login, redirect ke `/login` |
| `/login`, `/register`, dll | Redirect ke `/profile` jika sudah login |
