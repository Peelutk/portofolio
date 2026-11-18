# DESIGN — Web Portofolio Hong Khai

Versi: **v1.0 (DISETUJUI Hong Khai)** · 2026-11-15
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
