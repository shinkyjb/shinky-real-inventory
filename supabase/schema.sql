# SHINKY REAL Inventory

Aplikasi katalog stok game online dengan desain SHINKY REAL. Versi ini siap dibuat sebagai front-end React dan dapat dibuat terhubung ke Supabase ketika credential sudah tersedia.

## Fitur utama
- katalog inventaris
- filter status dan game
- admin PIN sederhana
- tambah item baru
- support upload gambar (dapat dikembangkan ke Supabase Storage)

## Jalankan lokal

```bash
npm install
npm run dev
```

## Environment

Copy file `.env.example` menjadi `.env` dan isi nilai yang diperlukan.

```bash
cp .env.example .env
```

## Supabase setup

Setelah project Supabase dibuat, sesuaikan variabel berikut:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_PIN`

## Build production

```bash
npm run build
```
