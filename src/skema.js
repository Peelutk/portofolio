// Skema konten — satu sumber untuk API admin, form admin, dan validasi.
// Harus cocok dengan migrations/0001_skema.sql (diuji oleh uji skema).
//
// Jenis isian:
//   text  : satu baris            long : paragraf (baris kosong = paragraf baru)
//   list  : satu item per baris   tags : dipisah koma
//   image : link Google Drive → disimpan ID file
//   url   : harus https://        email, github : format khusus
//   select: salah satu dari `pilihan`
// bi: true → disimpan dua kolom: <k>_id dan <k>_en

export const SKEMA = {
  profil: {
    label: 'Profil',
    tunggal: true,
    isian: [
      { k: 'nama', label: 'Nama lengkap', jenis: 'text' },
      { k: 'identitas', label: 'Identitas (satu kalimat di hero)', jenis: 'text', bi: true },
      { k: 'kota', label: 'Kota', jenis: 'text', bi: true },
      { k: 'sekolah', label: 'Sekolah / pondok', jenis: 'text', bi: true },
      { k: 'foto', label: 'Foto profil (link Google Drive, rasio 4:5)', jenis: 'image' },
      { k: 'tentang', label: 'Paragraf tentang saya', jenis: 'long', bi: true },
      { k: 'cara_kerja', label: 'Cara kerja (paragraf kedua)', jenis: 'long', bi: true },
      { k: 'email', label: 'Email (khusus portofolio)', jenis: 'email' },
      { k: 'github', label: 'Username GitHub', jenis: 'github' },
      { k: 'linkedin', label: 'Link LinkedIn (opsional)', jenis: 'url' },
      { k: 'bahasa', label: 'Bahasa yang dikuasai (untuk CV, satu per baris)', jenis: 'list', bi: true },
      { k: 'lead_tentang', label: 'Judul section Tentang', jenis: 'text', bi: true },
      { k: 'lead_proyek', label: 'Judul section Proyek', jenis: 'text', bi: true },
      { k: 'lead_desain', label: 'Judul section Desain', jenis: 'text', bi: true },
      { k: 'lead_pengalaman', label: 'Judul section Pengalaman', jenis: 'text', bi: true },
      { k: 'lead_prestasi', label: 'Judul section Prestasi', jenis: 'text', bi: true },
      { k: 'lead_kontak', label: 'Judul section Kontak', jenis: 'text', bi: true },
    ],
  },
  keahlian: {
    label: 'Keahlian',
    isian: [{ k: 'nama', label: 'Keahlian', jenis: 'text', bi: true }],
  },
  proyek: {
    label: 'Proyek',
    judulItem: 'judul',
    isian: [
      { k: 'slug', label: 'Alamat halaman (huruf kecil, angka, tanda -)', jenis: 'slug' },
      { k: 'judul', label: 'Judul', jenis: 'text', bi: true },
      { k: 'kategori', label: 'Kategori (mis. Sistem informasi)', jenis: 'text', bi: true },
      { k: 'peran', label: 'Peran', jenis: 'text', bi: true },
      { k: 'periode', label: 'Periode', jenis: 'text', bi: true },
      { k: 'alat', label: 'Alat / teknologi (pisahkan dengan koma)', jenis: 'tags' },
      { k: 'fakta_label', label: 'Fakta tambahan: label (mis. keputusan desain)', jenis: 'text', bi: true },
      { k: 'fakta_isi', label: 'Fakta tambahan: isi (mis. 100+ tercatat)', jenis: 'text', bi: true },
      { k: 'ringkasan', label: 'Ringkasan untuk kartu (2 kalimat)', jenis: 'long', bi: true },
      { k: 'pembuka', label: 'Pembuka studi kasus', jenis: 'long', bi: true },
      { k: 'gambar', label: 'Gambar kartu (link Google Drive)', jenis: 'image' },
      { k: 'masalah_lead', label: 'Masalah: judul', jenis: 'text', bi: true },
      { k: 'masalah', label: 'Masalah: isi', jenis: 'long', bi: true },
      { k: 'peran_lead', label: 'Peran saya: judul', jenis: 'text', bi: true },
      { k: 'peran_detail', label: 'Peran saya: daftar (satu per baris)', jenis: 'list', bi: true },
      { k: 'proses_lead', label: 'Proses: judul', jenis: 'text', bi: true },
      { k: 'proses_gambar', label: 'Proses: gambar (link Google Drive)', jenis: 'image' },
      { k: 'proses_ket', label: 'Proses: keterangan gambar', jenis: 'text', bi: true },
      { k: 'hasil_lead', label: 'Hasil: judul', jenis: 'text', bi: true },
      { k: 'hasil', label: 'Hasil: daftar (satu per baris)', jenis: 'list', bi: true },
      { k: 'hasil_gambar', label: 'Hasil: gambar (link Google Drive)', jenis: 'image' },
      { k: 'hasil_ket', label: 'Hasil: keterangan gambar', jenis: 'text', bi: true },
      { k: 'pelajaran', label: 'Pelajaran', jenis: 'long', bi: true },
      { k: 'cv', label: 'Satu baris untuk CV', jenis: 'text', bi: true },
      { k: 'cv_tahun', label: 'Tahun di CV', jenis: 'text' },
    ],
  },
  proyek_langkah: {
    label: 'Langkah proses',
    induk: 'proyek',
    isian: [
      { k: 'judul', label: 'Judul langkah', jenis: 'text', bi: true },
      { k: 'isi', label: 'Penjelasan', jenis: 'long', bi: true },
    ],
  },
  desain: {
    label: 'Desain',
    judulItem: 'judul',
    isian: [
      { k: 'judul', label: 'Judul karya', jenis: 'text', bi: true },
      { k: 'gambar', label: 'Gambar (link Google Drive)', jenis: 'image' },
    ],
  },
  pengalaman: {
    label: 'Pengalaman',
    judulItem: 'jabatan',
    isian: [
      { k: 'tahun', label: 'Tahun (mis. 2025–2026)', jenis: 'text' },
      { k: 'jabatan', label: 'Jabatan', jenis: 'text', bi: true },
      { k: 'organisasi', label: 'Organisasi', jenis: 'text', bi: true },
      { k: 'dampak', label: 'Dampak (satu kalimat, sebaiknya dengan angka)', jenis: 'text', bi: true },
    ],
  },
  prestasi: {
    label: 'Prestasi',
    judulItem: 'nama',
    isian: [
      { k: 'jenis', label: 'Jenis', jenis: 'select', pilihan: ['lomba', 'penghargaan', 'sertifikat'] },
      { k: 'nama', label: 'Nama prestasi', jenis: 'text', bi: true },
      { k: 'pemberi', label: 'Penyelenggara / pemberi', jenis: 'text', bi: true },
      { k: 'tahun', label: 'Tahun', jenis: 'text' },
      { k: 'bukti', label: 'Link bukti / sertifikat (opsional)', jenis: 'url' },
    ],
  },
  pendidikan: {
    label: 'Pendidikan',
    judulItem: 'nama',
    isian: [
      { k: 'nama', label: 'Nama sekolah', jenis: 'text', bi: true },
      { k: 'tahun', label: 'Tahun', jenis: 'text', bi: true },
      { k: 'keterangan', label: 'Keterangan (jenjang / program)', jenis: 'text', bi: true },
    ],
  },
};

export const TABEL = Object.keys(SKEMA);
export const BAHASA = ['id', 'en'];
export const MAKS_PANJANG = 5000;

/** Daftar nama kolom data (tanpa id/urut/tampil/induk) untuk satu tabel. */
export function kolom(tabel) {
  const out = [];
  for (const f of SKEMA[tabel].isian) {
    if (f.bi) out.push(f.k + '_id', f.k + '_en');
    else out.push(f.k);
  }
  return out;
}

/** Semua kolom bergambar di semua tabel: [{tabel, kolom}] */
export function kolomGambar() {
  const out = [];
  for (const t of TABEL) for (const f of SKEMA[t].isian) if (f.jenis === 'image') out.push({ tabel: t, kolom: f.k });
  return out;
}
