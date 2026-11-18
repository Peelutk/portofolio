# DESIGN — Web Portofolio Hong Khai

Versi: **v1.0 (DISETUJUI Hong Khai)** · 2026-11-15 · **v2.0 disetujui (§9 Panel Admin)** · 2026-11-18
Status: tahap DESAIN. Belum ada kode.

---

## 1. Tujuan & Audiens

| | |
|---|---|
| **Tujuan** | Menampilkan karya, pengalaman, dan prestasi dalam satu tempat yang rapi |
| **Audiens utama** | Panitia kampus / beasiswa (dalam & luar negeri) |
| **Kesan yang dicari** | Kompeten secara teknis, terstruktur, dapat dipercaya |
| **Bahasa** | Indonesia + Inggris (tombol ID / EN) |

**Prinsip:** gaya *developer* dipakai sebagai **aksen**, bukan sebagai penghalang. Reviewer beasiswa harus bisa membaca semuanya dalam 2–3 menit tanpa paham kode.

---

## 2. Sitemap

```
/                     Beranda (satu halaman panjang, berisi section)
├── #tentang          Tentang saya
├── #proyek           Kartu proyek (2) → tautan ke studi kasus
├── #desain           Galeri desain/visual
├── #pengalaman       Timeline organisasi & kepanitiaan
├── #prestasi         Prestasi & sertifikat
└── #kontak           Kontak + tombol "Unduh CV"
/proyek/hisada.html   Studi kasus HISADA
/proyek/veinmara.html Studi kasus Web Veinmara
/cv.html              Versi CV (bisa dicetak / disimpan sebagai PDF)
```

**Alasan dibuat satu halaman + halaman studi kasus terpisah:**
- (+) Reviewer bisa scroll sekali saja untuk melihat semuanya; detail hanya untuk yang tertarik
- (+) Studi kasus bisa ditautkan langsung di formulir beasiswa
- (−) Halaman beranda jadi panjang → diatasi dengan navigasi yang menempel di atas

---

## 3. Isi Tiap Section

| Section | Isi | Bentuk tampilan |
|---|---|---|
| **Hero** | Nama, satu kalimat identitas, 2 tombol (Lihat Proyek · Unduh CV) | Gaya terminal: `$ whoami` → teks diketik singkat (sekali saja, bisa dilewati) |
| **Tentang** | 1 paragraf + foto + 3–5 keahlian utama | Dua kolom (satu kolom di HP) |
| **Proyek** | HISADA, Web Veinmara | Kartu: judul, peran, teknologi (tag), ringkasan 2 baris, tautan studi kasus |
| **Desain** | Logo, poster, UI | Galeri grid; klik → lightbox |
| **Pengalaman** | Jabatan/kepanitiaan di pondok | Timeline vertikal (tahun · peran · organisasi · 1 baris dampak) |
| **Prestasi** | Lomba, penghargaan, sertifikat kursus | Daftar kartu kecil + tautan bukti/sertifikat |
| **Kontak** | Email, GitHub, LinkedIn (opsional) | Baris ikon + tombol CV |

### Format studi kasus (berlaku untuk kedua proyek)
1. **Masalah**: apa yang ingin diselesaikan
2. **Peran saya**: apa yang saya kerjakan sendiri
3. **Proses**: Mindmap → Analisis → Flowchart → Desain Database → Coding (menunjukkan cara berpikir runtut, nilai plus untuk beasiswa)
4. **Hasil**: screenshot + yang sudah dicapai
5. **Pelajaran**: apa yang saya pelajari

---

## 4. Identitas Visual

### Warna (token)

| Token | Mode gelap (utama) | Mode terang | Dipakai untuk |
|---|---|---|---|
| `--bg` | `#0d1117` | `#ffffff` | latar halaman |
| `--surface` | `#161b22` | `#f6f8fa` | kartu |
| `--border` | `#30363d` | `#d0d7de` | garis |
| `--text` | `#e6edf3` | `#1f2328` | teks utama |
| `--muted` | `#8b949e` | `#59636e` | teks sekunder |
| `--accent` | `#3fb950` (hijau terminal) | `#1a7f37` | tautan, tombol, kursor |
| `--accent-2` | `#d29922` (amber) | `#9a6700` | sorotan prestasi |

Semua pasangan teks dengan latar memenuhi kontras **WCAG AA**.

### Tipografi
- **JetBrains Mono** untuk judul section, label, tag, dan hero (nuansa kode)
- **Inter** untuk paragraf dan isi (supaya nyaman dibaca reviewer)
- Kedua font berlisensi **SIL OFL**, gratis untuk web (tidak ada masalah lisensi seperti di Veinmara)

### Ciri khas "developer" (dibatasi agar tetap formal)
- Judul section ditulis seperti komentar: `// proyek`, `// pengalaman`
- Hero bergaya prompt terminal dengan kursor berkedip
- Tag teknologi seperti badge kode: `PHP` `Cloudflare` `HTML`
- **Tidak dipakai:** efek matrix, glitch, atau animasi berlebihan

### Mode terang
Tombol ☀/☾ di navigasi. Bawaannya mengikuti setelan perangkat.
- (+) Sebagian reviewer lebih nyaman membaca di latar terang
- (−) Setiap komponen perlu dicek di dua mode

---

## 5. Teknis

| Aspek | Keputusan |
|---|---|
| Stack | HTML + CSS + JavaScript murni, **tanpa build tool / framework** |
| Hosting | **Cloudflare Pages** (gratis, alamat `*.pages.dev`; domain sendiri bisa menyusul) |
| Repo | Repo GitHub **baru dan terpisah** (tidak digabung dengan ProjectJao) |
| Dwibahasa | Folder `/en/` terpisah (Keputusan #1) |
| CV | `cv.html` dengan `@media print`: latar putih, satu kolom, rapi saat dicetak menjadi PDF |
| Aksesibilitas | Navigasi keyboard, `alt` pada semua gambar, animasi mati jika `prefers-reduced-motion` aktif |
| Responsif | Mobile-first; titik pecah 640px dan 1024px |
| Analitik | Cloudflare Web Analytics (tanpa cookie). Opsional. |

### Struktur folder (rencana)
```
portofolio/
├── DESIGN.md
├── index.html, cv.html, proyek/ hisada.html, veinmara.html   ← Indonesia
├── en/ index.html, cv.html, proyek/ hisada.html, veinmara.html ← English
└── assets/ css/, js/, img/, fonts/                            ← dipakai bersama
```
Tombol ID / EN mengarah ke halaman yang sama di bahasa lain (misal `/proyek/hisada.html` ↔ `/en/proyek/hisada.html`). Setiap halaman diberi tag `hreflang`.

---

## 6. Aturan Privasi & Konten

1. **Tidak ada data santri** di screenshot HISADA: pakai data contoh, atau blur/sensor nama, NIS, dan foto
2. Nama sistem pendidikan pondok (di luar HISADA) **tidak** disebut di mana pun
3. Email yang ditampilkan: email khusus portofolio (bukan email sekolah), sesuai keputusan Hong Khai
4. Repo Kantor Pixel dan Al-Ma'had **tidak** ditampilkan (sesuai pilihan)
5. Semua teks awal berupa **placeholder** yang ditandai `[ISI: ...]` agar mudah dicari dan diganti

---

## 7. Keputusan (diputuskan Hong Khai, 2026-11-15)

| # | Topik | Keputusan |
|---|---|---|
| 1 | Dwibahasa | **B. Folder terpisah `/` (ID) dan `/en/` (EN)**: kedua bahasa bisa diindeks Google dan tetap jalan tanpa JS. Konsekuensinya, setiap perubahan tata letak dikerjakan di dua file. CSS/JS dipakai bersama. |
| 2 | Nama | **Jao Hong Khai** |
| 3 | Foto | **Pakai foto profil** (formal) di section Tentang dan di CV |
| 4 | Domain | **Gratis dulu**: `*.pages.dev`; domain sendiri bisa ditambahkan kapan saja tanpa membangun ulang |

---

## 8. Tahapan Setelah Desain Disetujui

1. Prototype visual satu halaman (Artifact) → direview Hong Khai
2. Bangun semua halaman dengan placeholder
3. Hong Khai mengisi konten asli
4. Review: kontras, HP, cetak CV, privasi screenshot
5. Deploy ke Cloudflare Pages

> Tahap 1–2 selesai (2026-11-18, commit 89bcc9d). Tahap 3–5 digantikan oleh §9.

---

## 9. v2.0: Panel Admin Konten (DISETUJUI 2026-11-18)

Diputuskan Hong Khai pada 2026-11-18: isi portofolio diedit lewat panel admin, disimpan di **Cloudflare D1**, memakai akun Cloudflare **pribadi Hong Khai**.

### 9.1 Keputusan

| # | Topik | Keputusan |
|---|---|---|
| 5 | Hosting | **Cloudflare Worker** + static assets + **D1** (menggantikan Pages). Alamat: https://portofolio.jaohongk.workers.dev |
| 6 | Render | **Worker merender HTML** dari D1. Tampilan, URL (`/`, `/en/`, `/proyek/…`), SEO, dan kerja tanpa JS sama seperti v1 |
| 7 | Login admin | ~~Cloudflare Access~~ → **Password admin** (diubah 2026-11-18: Zero Trust meminta detail pembayaran). Rincian di §9.5 |
| 8 | Gambar | **Google Drive**: di admin cukup tempel link share Drive |
| 9 | Cakupan | **Semua isi** bisa diedit; setiap isian punya kolom **ID dan EN** berdampingan; CV tersusun otomatis dari data yang sama |
| 10 | Deploy | `wrangler deploy` dari PC ini dengan login akun Cloudflare pribadi |

### 9.2 Gambar dari Google Drive

Alur: tempel link Drive di admin → disimpan **ID file** saja → halaman memakai `/img/<id>` → Worker mengambil gambar dari Drive lalu menyimpannya di cache Cloudflare.

- (+) Gratis, tanpa kartu, dan upload cukup lewat Drive yang sudah biasa dipakai
- (+) Pengunjung tidak diarahkan ke Google, dan setelah cache terisi gambar dimuat cepat
- (−) File Drive **wajib** di-share "Siapa saja yang memiliki link". Admin menampilkan peringatan kalau gambar tidak bisa diambil
- (−) Pengambilan langsung dari Drive bukan layanan resmi Google untuk hosting gambar, jadi sewaktu-waktu bisa berubah. Kalau terjadi, cukup ganti sumber di satu tempat (`/img/`)
- Aturan privasi §6 tetap berlaku: tidak ada foto/data santri di file yang di-share

### 9.3 Model data (D1)

Semua teks disimpan dua kolom: `…_id` dan `…_en`. Isian kosong = **tidak ditampilkan** (penanda `[ISI: …]` hilang dengan sendirinya).

| Tabel | Isi |
|---|---|
| `profil` | satu baris: nama, identitas, kota, sekolah, paragraf tentang, foto, email, GitHub, LinkedIn, bahasa yang dikuasai |
| `keahlian` | urutan, nama |
| `proyek` | slug (URL), urutan, judul, peran, periode, alat (tag), ringkasan, gambar, masalah, peran detail, hasil, pelajaran, gambar proses/hasil, tampil |
| `proyek_langkah` | langkah proses per proyek: urutan, judul, isi |
| `desain` | urutan, judul, gambar, tampil |
| `pengalaman` | urutan, tahun, jabatan, organisasi, dampak, tampil |
| `prestasi` | urutan, jenis (lomba/penghargaan/sertifikat), nama, pemberi, tahun, link bukti, tampil |
| `pendidikan` | untuk CV: urutan, nama sekolah, tahun, keterangan |

- Teks polos; baris kosong = paragraf baru; daftar = satu item per baris. **Tidak menerima HTML** (mencegah XSS)
- Setiap item punya tombol **tampil/sembunyi** dan **naik/turun** untuk urutan
- Proyek baru otomatis mendapat halaman studi kasus `/proyek/<slug>` dan `/en/proyek/<slug>`
- Isi awal D1 = teks yang sudah ditulis di v1

### 9.4 Panel admin `/admin`

- Satu halaman dengan tab: Profil · Keahlian · Proyek · Desain · Pengalaman · Prestasi · Pendidikan · Cadangan
- Form ID | EN berdampingan (bertumpuk di HP); tombol **Simpan** per item; perubahan langsung tayang
- Tombol **Lihat halaman** untuk membuka hasilnya
- Tab Cadangan: **Ekspor JSON** (unduh semua isi) dan **Impor JSON**. D1 juga punya Time Travel (pemulihan ke titik waktu sebelumnya)
- Gaya visual sama dengan situs (token warna §4)

### 9.5 Keamanan

1. `/admin` dan `/api/admin/*` hanya bisa dibuka setelah login di `/admin/masuk` dengan **password admin**:
   - Password = *secret* Cloudflare `ADMIN_PASSWORD`, diisi Hong Khai sendiri lewat dashboard (tidak pernah ada di repo atau chat). Minimal **12 karakter**; lebih pendek atau kosong = admin terkunci
   - Sesi = cookie bertanda tangan HMAC (HttpOnly, Secure, SameSite=Strict), berlaku **8 jam**. Ganti password = semua sesi otomatis keluar
   - Pembatas percobaan: **5 kali salah per IP / 15 menit** → IP dikunci 15 menit; **20 kali salah total / 15 menit** → login dikunci untuk semua (tabel `login_gagal` di D1)
   - Pengembangan lokal: `DEV_ADMIN=1` di `.dev.vars`, hanya berlaku di `localhost`
   - (−) Keamanan bergantung pada kekuatan password; lupa password = atur ulang secret di dashboard
2. Semua teks di-escape saat dirender; link hanya boleh `https://` atau `mailto:`
3. ID D1 boleh ada di `wrangler.jsonc` (bukan rahasia; butuh login akun untuk dipakai). Tidak ada secret di repo
4. Repo tetap publik; isi asli hanya ada di D1, bukan di repo

### 9.6 Struktur folder (rencana)

```
portofolio/
├── DESIGN.md, README.md, wrangler.jsonc
├── src/        worker.js (router), render.js (template HTML), db.js, skema.js, sesi.js (login admin), gambar.js
├── migrations/ 0001_skema.sql, 0002_isi_awal.sql, 0003_login.sql
└── public/     assets/ (css, js), admin/ (index.html, admin.js)
```
File HTML v1 (`index.html`, `en/`, `proyek/`, `cv.html`) menjadi dasar template, lalu dihapus dari root setelah Worker siap.

### 9.7 Langkah

1. Hong Khai menyetujui §9
2. Hong Khai: `npx wrangler logout`, lalu `npx wrangler login` dengan email admin Hong Khai (login HISADA di PC ini akan terlepas)
3. Bangun Worker + D1 + admin, uji lokal (`wrangler dev`)
4. Deploy, lalu Hong Khai mengisi secret `ADMIN_PASSWORD` di dashboard (Settings → Variables and secrets)
5. Hong Khai mengisi konten asli lewat admin

> Status 2026-11-18: langkah 1–3 selesai. Worker live di https://portofolio.jaohongk.workers.dev, D1 dimigrasi (0001–0003) dan diisi teks v1. Login diganti ke password (§9.5); `/admin` terkunci sampai secret `ADMIN_PASSWORD` diisi (langkah 4). Uji: 75 cek integrasi + 16 cek login + cek skema, semuanya lulus.
