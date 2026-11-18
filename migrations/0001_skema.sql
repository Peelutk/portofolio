-- Skema konten portofolio. Harus cocok dengan src/skema.js.
-- Kolom *_id = Bahasa Indonesia, *_en = English. Teks kosong = tidak ditampilkan.

CREATE TABLE profil (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  nama TEXT NOT NULL DEFAULT '',
  identitas_id TEXT NOT NULL DEFAULT '', identitas_en TEXT NOT NULL DEFAULT '',
  kota_id TEXT NOT NULL DEFAULT '', kota_en TEXT NOT NULL DEFAULT '',
  sekolah_id TEXT NOT NULL DEFAULT '', sekolah_en TEXT NOT NULL DEFAULT '',
  foto TEXT NOT NULL DEFAULT '',
  tentang_id TEXT NOT NULL DEFAULT '', tentang_en TEXT NOT NULL DEFAULT '',
  cara_kerja_id TEXT NOT NULL DEFAULT '', cara_kerja_en TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  github TEXT NOT NULL DEFAULT '',
  linkedin TEXT NOT NULL DEFAULT '',
  bahasa_id TEXT NOT NULL DEFAULT '', bahasa_en TEXT NOT NULL DEFAULT '',
  lead_tentang_id TEXT NOT NULL DEFAULT '', lead_tentang_en TEXT NOT NULL DEFAULT '',
  lead_proyek_id TEXT NOT NULL DEFAULT '', lead_proyek_en TEXT NOT NULL DEFAULT '',
  lead_desain_id TEXT NOT NULL DEFAULT '', lead_desain_en TEXT NOT NULL DEFAULT '',
  lead_pengalaman_id TEXT NOT NULL DEFAULT '', lead_pengalaman_en TEXT NOT NULL DEFAULT '',
  lead_prestasi_id TEXT NOT NULL DEFAULT '', lead_prestasi_en TEXT NOT NULL DEFAULT '',
  lead_kontak_id TEXT NOT NULL DEFAULT '', lead_kontak_en TEXT NOT NULL DEFAULT '',
  diubah TEXT
);

CREATE TABLE keahlian (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  urut INTEGER NOT NULL DEFAULT 0,
  tampil INTEGER NOT NULL DEFAULT 1,
  nama_id TEXT NOT NULL DEFAULT '', nama_en TEXT NOT NULL DEFAULT '',
  diubah TEXT
);

CREATE TABLE proyek (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  urut INTEGER NOT NULL DEFAULT 0,
  tampil INTEGER NOT NULL DEFAULT 1,
  slug TEXT NOT NULL UNIQUE,
  judul_id TEXT NOT NULL DEFAULT '', judul_en TEXT NOT NULL DEFAULT '',
  kategori_id TEXT NOT NULL DEFAULT '', kategori_en TEXT NOT NULL DEFAULT '',
  peran_id TEXT NOT NULL DEFAULT '', peran_en TEXT NOT NULL DEFAULT '',
  periode_id TEXT NOT NULL DEFAULT '', periode_en TEXT NOT NULL DEFAULT '',
  alat TEXT NOT NULL DEFAULT '',
  fakta_label_id TEXT NOT NULL DEFAULT '', fakta_label_en TEXT NOT NULL DEFAULT '',
  fakta_isi_id TEXT NOT NULL DEFAULT '', fakta_isi_en TEXT NOT NULL DEFAULT '',
  ringkasan_id TEXT NOT NULL DEFAULT '', ringkasan_en TEXT NOT NULL DEFAULT '',
  pembuka_id TEXT NOT NULL DEFAULT '', pembuka_en TEXT NOT NULL DEFAULT '',
  gambar TEXT NOT NULL DEFAULT '',
  masalah_lead_id TEXT NOT NULL DEFAULT '', masalah_lead_en TEXT NOT NULL DEFAULT '',
  masalah_id TEXT NOT NULL DEFAULT '', masalah_en TEXT NOT NULL DEFAULT '',
  peran_lead_id TEXT NOT NULL DEFAULT '', peran_lead_en TEXT NOT NULL DEFAULT '',
  peran_detail_id TEXT NOT NULL DEFAULT '', peran_detail_en TEXT NOT NULL DEFAULT '',
  proses_lead_id TEXT NOT NULL DEFAULT '', proses_lead_en TEXT NOT NULL DEFAULT '',
  proses_gambar TEXT NOT NULL DEFAULT '',
  proses_ket_id TEXT NOT NULL DEFAULT '', proses_ket_en TEXT NOT NULL DEFAULT '',
  hasil_lead_id TEXT NOT NULL DEFAULT '', hasil_lead_en TEXT NOT NULL DEFAULT '',
  hasil_id TEXT NOT NULL DEFAULT '', hasil_en TEXT NOT NULL DEFAULT '',
  hasil_gambar TEXT NOT NULL DEFAULT '',
  hasil_ket_id TEXT NOT NULL DEFAULT '', hasil_ket_en TEXT NOT NULL DEFAULT '',
  pelajaran_id TEXT NOT NULL DEFAULT '', pelajaran_en TEXT NOT NULL DEFAULT '',
  cv_id TEXT NOT NULL DEFAULT '', cv_en TEXT NOT NULL DEFAULT '',
  cv_tahun TEXT NOT NULL DEFAULT '',
  diubah TEXT
);

CREATE TABLE proyek_langkah (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  induk_id INTEGER NOT NULL REFERENCES proyek(id) ON DELETE CASCADE,
  urut INTEGER NOT NULL DEFAULT 0,
  tampil INTEGER NOT NULL DEFAULT 1,
  judul_id TEXT NOT NULL DEFAULT '', judul_en TEXT NOT NULL DEFAULT '',
  isi_id TEXT NOT NULL DEFAULT '', isi_en TEXT NOT NULL DEFAULT '',
  diubah TEXT
);
CREATE INDEX idx_langkah_induk ON proyek_langkah(induk_id, urut);

CREATE TABLE desain (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  urut INTEGER NOT NULL DEFAULT 0,
  tampil INTEGER NOT NULL DEFAULT 1,
  judul_id TEXT NOT NULL DEFAULT '', judul_en TEXT NOT NULL DEFAULT '',
  gambar TEXT NOT NULL DEFAULT '',
  diubah TEXT
);

CREATE TABLE pengalaman (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  urut INTEGER NOT NULL DEFAULT 0,
  tampil INTEGER NOT NULL DEFAULT 1,
  tahun TEXT NOT NULL DEFAULT '',
  jabatan_id TEXT NOT NULL DEFAULT '', jabatan_en TEXT NOT NULL DEFAULT '',
  organisasi_id TEXT NOT NULL DEFAULT '', organisasi_en TEXT NOT NULL DEFAULT '',
  dampak_id TEXT NOT NULL DEFAULT '', dampak_en TEXT NOT NULL DEFAULT '',
  diubah TEXT
);

CREATE TABLE prestasi (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  urut INTEGER NOT NULL DEFAULT 0,
  tampil INTEGER NOT NULL DEFAULT 1,
  jenis TEXT NOT NULL DEFAULT 'lomba' CHECK (jenis IN ('lomba','penghargaan','sertifikat')),
  nama_id TEXT NOT NULL DEFAULT '', nama_en TEXT NOT NULL DEFAULT '',
  pemberi_id TEXT NOT NULL DEFAULT '', pemberi_en TEXT NOT NULL DEFAULT '',
  tahun TEXT NOT NULL DEFAULT '',
  bukti TEXT NOT NULL DEFAULT '',
  diubah TEXT
);

CREATE TABLE pendidikan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  urut INTEGER NOT NULL DEFAULT 0,
  tampil INTEGER NOT NULL DEFAULT 1,
  nama_id TEXT NOT NULL DEFAULT '', nama_en TEXT NOT NULL DEFAULT '',
  tahun_id TEXT NOT NULL DEFAULT '', tahun_en TEXT NOT NULL DEFAULT '',
  keterangan_id TEXT NOT NULL DEFAULT '', keterangan_en TEXT NOT NULL DEFAULT '',
  diubah TEXT
);
