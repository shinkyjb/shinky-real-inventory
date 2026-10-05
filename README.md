# SHINKY REAL Inventory

Website katalog stok game berbasis HTML, CSS, JS yang siap dipakai sebagai halaman statis untuk demo atau penggunaan pribadi di browser.

## Fitur utama
- Katalog stok akun game
- Search dan filter berdasarkan game & status
- Kalkulator DP 30%
- Admin mode dengan PIN
- Tambah, edit, hapus stok
- Upload gambar spesifikasi dengan kompresi otomatis
- Data tersimpan di `localStorage` browser

## Cara pakai
1. Buka file `index.html` di browser, atau jalankan server lokal.
2. Klik icon admin di pojok kanan atas.
3. Jika PIN belum dibuat, admin mode akan aktif dan Anda bisa membuat PIN.
4. Gunakan tombol `+ TAMBAH STOK` untuk menambah item.

## Menjalankan lokal
Bisa langsung buka file HTML, atau pakai server sederhana:

```bash
python -m http.server 8000
```

Lalu buka:

```text
http://localhost:8000
```

## Catatan penting
Aplikasi ini dirancang untuk penggunaan single-browser / single-user. Data disimpan hanya di browser pengguna dan tidak bisa dibagikan antar perangkat tanpa backend/database.

Untuk versi multi-user yang benar-benar real-world, diperlukan backend seperti Supabase/Firebase, autentikasi admin, dan database yang aman.

## Struktur file
- `index.html` — layout utama
- `styles.css` — styling
- `app.js` — logika aplikasi

## Pengembangan lanjutan yang disarankan
- Integrasi ke Supabase / Firebase
- Login admin real
- Upload gambar ke cloud storage
- API CRUD untuk stok
- Backup data otomatis
