# Menu Slider (Scan-to-Open)

Website fullscreen dengan slider gambar interaktif (Swiper.js). Cocok untuk dibuka via barcode/QR code yang mengarah ke URL halaman ini.

## Fitur
- Gambar full-bleed (1 slide = 1 gambar)
- Navigasi panah kiri/kanan, swipe gesture (mobile), keyboard
- Pagination bullets (opsional)
- Loading animation + logo saat awal
- Hover zoom ringan (desktop)
- Auto dark mode (mengikuti sistem)
- Tombol fullscreen (opsional)

## Struktur
```
/tugas
  index.html
  styles.css
  app.js
  /assets
    /data
      slides.json   <-- edit tautan dan gambar di sini
    logo.svg
  /assets/images    <-- taruh gambar lokal Anda (opsional)
```

## Mengganti Konten
Ubah `assets/data/slides.json` sesuai kebutuhan. Contoh:
```json
[
  {
    "image": "./assets/images/menu1.jpg",
    "link": "https://domain-anda/fitur-a",
    "alt": "Fitur A"
  }
]
```

- `image`: path gambar (lokal atau URL)
- `link`: tujuan ketika gambar di-klik
- `alt`: deskripsi singkat (aksesibilitas)

Catatan: Jika membuka file langsung (file://), pengambilan `slides.json` mungkin diblokir oleh browser. Aplikasi otomatis fallback ke contoh gambar online agar tetap tampil. Untuk produksi, sebaiknya jalankan lewat server statis.

## Cara Menjalankan (Lokal)
- Opsi cepat: klik dua kali `index.html` (akan pakai data fallback bila `slides.json` gagal dimuat)
- Disarankan: jalankan server statis di folder `tugas/`:
  - Node.js: `npx serve` lalu buka URL yang muncul
  - Python 3: `python -m http.server 5500` lalu buka `http://localhost:5500`

## Hosting
Deploy ke layanan statis seperti Vercel, Netlify, GitHub Pages, atau Firebase Hosting. Arahkan QR/barcode ke URL hasil deploy agar saat dipindai langsung membuka website ini.

## Kustomisasi Efek
Di `app.js` pada inisialisasi Swiper, Anda bisa ganti `effect: "slide"` menjadi `"fade"`, `"cube"`, `"coverflow"`, dll. Sesuaikan juga kecepatan (`speed`).
