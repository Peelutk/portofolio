-- Isi awal = teks v1 yang sudah final. Placeholder [ISI: ...] TIDAK dimasukkan:
-- isian itu dibiarkan kosong supaya tidak tampil, lalu diisi lewat /admin.

INSERT INTO profil (id, nama, sekolah_id, sekolah_en, cara_kerja_id, cara_kerja_en,
  lead_tentang_id, lead_tentang_en, lead_proyek_id, lead_proyek_en,
  lead_desain_id, lead_desain_en, lead_pengalaman_id, lead_pengalaman_en,
  lead_prestasi_id, lead_prestasi_en, lead_kontak_id, lead_kontak_en, diubah)
VALUES (1, 'Jao Hong Khai',
  'Pondok Pesantren Daarul Uluum Lido', 'Daarul Uluum Lido Islamic Boarding School',
  'Saya bekerja dengan urutan yang sama di setiap proyek: mindmap, analisis, flowchart, desain database, baru kemudian kode. Setiap keputusan desain saya catat supaya bisa ditelusuri dan diperiksa ulang.',
  'I follow the same order on every project: mind map, analysis, flowchart, database design, and only then code. I record every design decision so it can be traced and reviewed later.',
  'Belajar membangun sistem dengan merancangnya lebih dulu.', 'Learning to build systems by designing them first.',
  'Proyek yang saya rancang dan bangun.', 'Projects I designed and built.',
  'Logo, poster, dan antarmuka.', 'Logos, posters, and interfaces.',
  'Organisasi dan kepanitiaan.', 'Organizations and committees.',
  'Penghargaan dan sertifikat.', 'Awards and certificates.',
  'Terbuka untuk pertanyaan seputar karya dan pendaftaran.', 'Happy to answer questions about my work or my application.',
  datetime('now'));

INSERT INTO keahlian (urut, nama_id, nama_en) VALUES
  (1, 'Analisis Sistem', 'Systems Analysis'),
  (2, 'Desain Database', 'Database Design'),
  (3, 'Flowchart & Mermaid', 'Flowcharts & Mermaid'),
  (4, 'HTML · CSS · JavaScript', 'HTML · CSS · JavaScript'),
  (5, 'Vue 3', 'Vue 3'),
  (6, 'Git & GitHub', 'Git & GitHub');

INSERT INTO proyek (id, urut, slug, judul_id, judul_en, kategori_id, kategori_en, alat,
  fakta_label_id, fakta_label_en, fakta_isi_id, fakta_isi_en,
  ringkasan_id, ringkasan_en, pembuka_id, pembuka_en,
  masalah_lead_id, masalah_lead_en, peran_lead_id, peran_lead_en,
  proses_lead_id, proses_lead_en, hasil_lead_id, hasil_lead_en, hasil_id, hasil_en,
  hasil_ket_id, hasil_ket_en, cv_id, cv_en, diubah)
VALUES (1, 1, 'hisada', 'HISADA', 'HISADA', 'Sistem informasi', 'Information system',
  'Analisis Sistem, Desain Database, Mermaid, Vue 3',
  'keputusan desain', 'design decisions', '100+ tercatat', '100+ recorded',
  'Sistem informasi administrasi Himpunan Santri. Dirancang lewat lebih dari seratus keputusan desain yang tercatat, lalu diwujudkan sebagai prototipe web.',
  'An administration system for the student council of a boarding school. Designed through more than a hundred recorded design decisions, then built as a web prototype.',
  'Sistem informasi administrasi Himpunan Santri di Pondok Pesantren Daarul Uluum Lido. Fokus proyek ini adalah merancang sistemnya dengan benar sebelum menulis kode.',
  'An administration system for the student council (Himpunan Santri) at Daarul Uluum Lido Islamic Boarding School. The focus of this project was to design the system properly before writing any code.',
  'Administrasi santri tersebar di banyak tangan.', 'Student administration was spread across many hands.',
  'Dari wawancara kebutuhan sampai prototipe.', 'From gathering requirements to a working prototype.',
  'Lima tahap, berurutan.', 'Five stages, in order.',
  'Desain yang disepakati dan prototipe yang bisa dicoba.', 'An agreed design and a prototype anyone can try.',
  'Lebih dari seratus keputusan desain tercatat beserta alasannya.
Hak akses per peran, dengan pemisahan data putra dan putri.
Prototipe web yang bisa dicoba dari sudut pandang setiap peran.',
  'More than a hundred design decisions recorded with their reasons.
Role-based access, with boys'' and girls'' data kept separate.
A web prototype that can be explored from the point of view of each role.',
  'Semua data pada gambar adalah data contoh, bukan data santri asli.', 'All data in the image is sample data, not real student records.',
  'Analisis kebutuhan, 100+ keputusan desain tercatat, flowchart, desain database, dan prototipe web (Vue 3).',
  'Requirements analysis, 100+ recorded design decisions, flowcharts, database design, and a web prototype (Vue 3).',
  datetime('now'));

INSERT INTO proyek_langkah (induk_id, urut, judul_id, judul_en, isi_id, isi_en) VALUES
  (1, 1, 'Mindmap', 'Mind map', 'Memetakan semua fungsi administrasi pondok menjadi satu pohon.', 'Mapped every administrative function of the school into one tree.'),
  (1, 2, 'Analisis', 'Analysis', 'Mengaudit sistem lama, lalu mencatat setiap keputusan desain dengan nomor (K-01, K-02, …) agar bisa ditelusuri.', 'Audited the old system, then numbered every design decision (K-01, K-02, …) so each one could be traced.'),
  (1, 3, 'Flowchart', 'Flowcharts', 'Menggambar alur seperti perizinan dan serah terima pengurus dengan diagram Mermaid.', 'Drew flows such as leave permits and officer handover as Mermaid diagrams.'),
  (1, 4, 'Desain Database', 'Database design', 'Menyusun tabel dan relasi, termasuk riwayat perubahan dan pemisahan data putra/putri.', 'Defined tables and relations, including change history and separate data for boys'' and girls'' campuses.'),
  (1, 5, 'Coding', 'Coding', 'Membangun prototipe web dengan data contoh untuk diuji oleh calon pengguna.', 'Built a web prototype with sample data for future users to try.');

INSERT INTO proyek (id, urut, slug, judul_id, judul_en, kategori_id, kategori_en, periode_id, periode_en, alat,
  fakta_label_id, fakta_label_en, fakta_isi_id, fakta_isi_en,
  ringkasan_id, ringkasan_en, pembuka_id, pembuka_en,
  masalah_lead_id, masalah_lead_en, peran_lead_id, peran_lead_en,
  proses_lead_id, proses_lead_en, hasil_lead_id, hasil_lead_en, hasil_id, hasil_en,
  cv_id, cv_en, cv_tahun, diubah)
VALUES (2, 2, 'veinmara', 'Web Veinmara', 'Veinmara Website', 'Website', 'Website',
  'Oktober–November 2026', 'October–November 2026', 'HTML, CSS, JavaScript',
  'tenggat', 'deadline', 'Hari peresmian angkatan', 'Class inauguration day',
  'Website angkatan Veinmara: filosofi nama, makna logo, dan para pemimpin angkatan, siap sebelum hari peresmian.',
  'A website for the Veinmara class year: the meaning of its name, its logo, and its leaders, finished before the inauguration day.',
  'Website untuk angkatan Veinmara, "A Renewal Catalyst". Menceritakan filosofi nama, makna sebelas elemen logo, dan para pemimpin angkatan.',
  'A website for the Veinmara class year, "A Renewal Catalyst". It tells the story behind the name, the meaning of the eleven logo elements, and the class leaders.',
  'Identitas angkatan perlu satu rumah.', 'The class identity needed one home.',
  'Merancang dan membangun seluruh situs.', 'Designing and building the whole site.',
  'Dari dokumen pengesahan ke halaman web.', 'From the official document to a web page.',
  'Situs angkatan yang selesai sebelum peresmian.', 'A class website finished before the inauguration.',
  'Bagian filosofi nama lengkap dengan ayat QS Al-Insyirah 5–6.
Penjelajah logo yang menjelaskan sebelas elemen satu per satu.
Hitung mundur menuju hari peresmian.',
  'A section on the meaning of the name, including QS Al-Insyirah 5–6.
A logo explorer that explains the eleven elements one by one.
A countdown to inauguration day.',
  'Situs statis berisi filosofi nama, penjelajah logo, dan hitung mundur peresmian (HTML, CSS, JavaScript).',
  'Static site with the meaning of the class name, a logo explorer, and an inauguration countdown (HTML, CSS, JavaScript).',
  '2026', datetime('now'));

INSERT INTO proyek_langkah (induk_id, urut, judul_id, judul_en, isi_id, isi_en) VALUES
  (2, 1, 'Kumpulkan sumber', 'Gather sources', 'Naskah pengesahan nama, makna logo, dan presentasi angkatan dijadikan satu sumber isi.', 'The naming document, logo meanings, and class slide deck became a single content source.'),
  (2, 2, 'Putuskan isi', 'Decide the content', 'Hanya ketua dan wakil yang tampil; data anggota lain tidak dimuat demi privasi.', 'Only class leaders and deputies are shown; other members'' data was left out for privacy.'),
  (2, 3, 'Terjemahkan identitas visual', 'Translate the visual identity', 'Warna burgundy dan emas dari logo angkatan menjadi palet situs.', 'The burgundy and gold of the class logo became the site palette.'),
  (2, 4, 'Bangun & uji', 'Build & test', 'Situs statis dengan hitung mundur peresmian dan penjelajah sebelas elemen logo.', 'A static site with an inauguration countdown and an explorer for the eleven logo elements.');

INSERT INTO pendidikan (urut, nama_id, nama_en) VALUES
  (1, 'Pondok Pesantren Daarul Uluum Lido', 'Daarul Uluum Lido Islamic Boarding School');
