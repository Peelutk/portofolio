// Template HTML halaman publik. Semua teks dari D1 WAJIB lewat esc() / helper di bawah.
// Aturan: isian kosong = tidak ditampilkan (DESIGN §9.3).

const UI = {
  id: {
    htmlLang: 'id', skip: 'Langsung ke isi', other: 'en', otherLabel: 'English version',
    s: { tentang: 'tentang', proyek: 'proyek', desain: 'desain', pengalaman: 'pengalaman', prestasi: 'prestasi', kontak: 'kontak' },
    lihatProyek: 'Lihat Proyek', lihatCv: 'Lihat CV', bacaStudi: 'Baca studi kasus →', peran: 'Peran',
    toLight: 'Ganti ke mode terang', toDark: 'Ganti ke mode gelap', tutup: 'Tutup ✕',
    jenis: { lomba: 'Lomba', penghargaan: 'Penghargaan', sertifikat: 'Sertifikat' }, bukti: 'lihat bukti',
    portoTitle: 'Portofolio', portoDesc: (n) => `Portofolio ${n}: proyek, desain, pengalaman organisasi, dan prestasi.`,
    studi: 'Studi kasus', kembali: '← kembali ke proyek', semua: '← Semua proyek',
    cs: { masalah: 'masalah', peran: 'peran saya', proses: 'proses', hasil: 'hasil', pelajaran: 'pelajaran' },
    fakta: { peran: 'peran', periode: 'periode', alat: 'alat' },
    cv: {
      title: 'CV', kembali: '← kembali ke beranda', cetakInfo: 'Cetak atau simpan sebagai PDF. Hasil cetak selalu berlatar putih.',
      cetak: 'Cetak / Simpan PDF', pendidikan: 'Pendidikan', proyek: 'Proyek', pengalaman: 'Pengalaman Organisasi',
      prestasi: 'Prestasi & Sertifikat', keahlian: 'Keahlian', bahasa: 'Bahasa',
    },
    footer: 'dibuat dengan HTML, CSS & sedikit JS',
    t404: 'Halaman tidak ditemukan', p404: 'Alamat ini tidak ada atau sudah dipindah.', ke404: '← Kembali ke beranda',
  },
  en: {
    htmlLang: 'en', skip: 'Skip to content', other: 'id', otherLabel: 'Versi Indonesia',
    s: { tentang: 'about', proyek: 'projects', desain: 'design', pengalaman: 'experience', prestasi: 'achievements', kontak: 'contact' },
    lihatProyek: 'View Projects', lihatCv: 'View CV', bacaStudi: 'Read case study →', peran: 'Role',
    toLight: 'Switch to light mode', toDark: 'Switch to dark mode', tutup: 'Close ✕',
    jenis: { lomba: 'Competition', penghargaan: 'Award', sertifikat: 'Certificate' }, bukti: 'view proof',
    portoTitle: 'Portfolio', portoDesc: (n) => `Portfolio of ${n}: projects, design work, organizational experience, and achievements.`,
    studi: 'Case study', kembali: '← back to projects', semua: '← All projects',
    cs: { masalah: 'problem', peran: 'my role', proses: 'process', hasil: 'outcome', pelajaran: 'lessons' },
    fakta: { peran: 'role', periode: 'period', alat: 'tools' },
    cv: {
      title: 'CV', kembali: '← back to home', cetakInfo: 'Print or save as PDF. The printout always uses a white background.',
      cetak: 'Print / Save PDF', pendidikan: 'Education', proyek: 'Projects', pengalaman: 'Organizational Experience',
      prestasi: 'Achievements & Certificates', keahlian: 'Skills', bahasa: 'Languages',
    },
    footer: 'built with HTML, CSS & a little JS',
    t404: 'Page not found', p404: 'This address does not exist or has moved.', ke404: '← Back to home',
  },
};

// ---------- helper ----------
export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
const v = (row, k, lang) => (row ? String(row[lang ? `${k}_${lang}` : k] ?? '').trim() : '');
const baris = (s) => String(s || '').split(/\r?\n/).map((x) => x.trim()).filter(Boolean);
const paragraf = (s) =>
  String(s || '').split(/\r?\n\s*\r?\n/).map((p) => p.trim()).filter(Boolean)
    .map((p) => `<p>${esc(p).replace(/\r?\n/g, '<br>')}</p>`).join('');
const tags = (s) => String(s || '').split(',').map((x) => x.trim()).filter(Boolean);
const img = (id, w) => `/img/${encodeURIComponent(id)}?w=${w}`;
const pre = (lang) => (lang === 'en' ? '/en' : '');
const safeUrl = (u) => (/^https:\/\//i.test(u) ? u : '');
const inisial = (nama) => esc(String(nama || '').split(/\s+/).filter(Boolean).slice(0, 3).map((w) => w[0]).join('').toUpperCase());

/** Ubah path halaman ke bahasa lain: /proyek/x ↔ /en/proyek/x */
function pathLain(path, lang) {
  if (lang === 'en') return path.replace(/^\/en(?=\/|$)/, '') || '/';
  return path === '/' ? '/en/' : '/en' + path;
}

// ---------- kerangka halaman ----------
function layout({ lang, path, origin, title, desc, nav, body, nama, bodyClass = '' }) {
  const u = UI[lang];
  const idPath = lang === 'id' ? path : pathLain(path, lang);
  const enPath = lang === 'en' ? path : pathLain(path, lang);
  const lainPath = lang === 'id' ? enPath : idPath;
  const langBtn = lang === 'id' ? '<b>ID</b> / EN' : 'ID / <b>EN</b>';
  const navHtml = nav.length ? `<ul>${nav.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join('')}</ul>` : '';
  return `<!doctype html>
<html lang="${u.htmlLang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="alternate" hreflang="id" href="${esc(origin + idPath)}">
<link rel="alternate" hreflang="en" href="${esc(origin + enPath)}">
<link rel="alternate" hreflang="x-default" href="${esc(origin + idPath)}">
<link rel="canonical" href="${esc(origin + path)}">
<script src="/assets/js/tema.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
<link rel="stylesheet" href="/assets/css/style.css">
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
<a class="skip" href="#isi">${u.skip}</a>
<header class="nav">
  <div class="wrap">
    <a class="brand" href="${pre(lang)}/">jao<span>.</span>hongkhai</a>
    ${navHtml}
    <div class="tools">
      <a class="tool lang" href="${esc(lainPath)}" hreflang="${u.other}" lang="${u.other}" title="${u.otherLabel}">${langBtn}</a>
      <button class="tool" id="themeBtn" type="button" data-to-light="${u.toLight}" data-to-dark="${u.toDark}">☾</button>
    </div>
  </div>
</header>
<main id="isi">
${body}
</main>
<footer class="foot"><div class="wrap"><span>© ${new Date().getUTCFullYear()} ${esc(nama)}</span><span>${esc(u.footer)}</span></div></footer>
<script src="/assets/js/main.js"></script>
</body>
</html>`;
}

const section = (id, judul, lead, isi, narrow = false) => `
  <section class="s" id="${id}">
    <div class="wrap${narrow ? ' narrow' : ''}">
      <h2>${esc(judul)}</h2>
      ${lead ? `<p class="lead">${esc(lead)}</p>` : ''}
      ${isi}
    </div>
  </section>`;

// ---------- beranda ----------
export function halamanBeranda(d, lang, origin) {
  const u = UI[lang];
  const p = d.profil || {};
  const nama = v(p, 'nama') || 'Portofolio';
  const P = pre(lang);
  const nav = [];
  const parts = [];

  // hero
  const meta = [v(p, 'kota', lang), v(p, 'sekolah', lang)].filter(Boolean);
  const proyek = d.proyek.filter((x) => v(x, 'judul', lang));
  parts.push(`
  <div class="wrap hero">
    <div class="term">
      <div class="term-bar" aria-hidden="true"><i class="dot"></i><i class="dot"></i><i class="dot"></i><span class="t">~/${lang === 'en' ? 'portfolio' : 'portofolio'}</span></div>
      <div class="term-body">
        <div aria-hidden="true"><span class="prompt">$</span> whoami</div>
        <h1>${esc(nama)}</h1>
        ${v(p, 'identitas', lang) ? `<p class="role">${esc(v(p, 'identitas', lang))}</p>` : ''}
        ${meta.length ? `<div class="meta">${meta.map((m) => `<span>${esc(m)}</span>`).join('')}</div>` : ''}
        <div class="term-end" aria-hidden="true"><span class="prompt">$</span> <span class="cursor"></span></div>
      </div>
    </div>
    <div class="cta">
      ${proyek.length ? `<a class="btn primary" href="#${u.s.proyek}">${u.lihatProyek}</a>` : ''}
      <a class="btn${proyek.length ? '' : ' primary'}" href="${P}/cv">${u.lihatCv}</a>
    </div>
  </div>`);

  // tentang
  const keahlian = d.keahlian.map((k) => v(k, 'nama', lang)).filter(Boolean);
  const tentang = v(p, 'tentang', lang), cara = v(p, 'cara_kerja', lang), foto = v(p, 'foto');
  if (tentang || cara || foto || keahlian.length) {
    nav.push([`#${u.s.tentang}`, u.s.tentang]);
    const fotoHtml = foto
      ? `<div class="photo has-img"><img src="${img(foto, 600)}" alt="${esc(nama)}" width="200" height="250" loading="lazy"></div>`
      : `<div class="photo" aria-hidden="true"><strong>${inisial(nama)}</strong></div>`;
    parts.push(section(u.s.tentang, u.s.tentang, v(p, 'lead_tentang', lang), `
      <div class="about">
        ${fotoHtml}
        <div>
          ${paragraf(tentang)}${paragraf(cara)}
          ${keahlian.length ? `<ul class="skills">${keahlian.map((k) => `<li class="tag">${esc(k)}</li>`).join('')}</ul>` : ''}
        </div>
      </div>`));
  }

  // proyek
  if (proyek.length) {
    nav.push([`#${u.s.proyek}`, u.s.proyek]);
    parts.push(section(u.s.proyek, u.s.proyek, v(p, 'lead_proyek', lang), `
      <div class="projects">${proyek.map((x) => {
        const judul = v(x, 'judul', lang);
        return `
        <article class="card">
          ${v(x, 'gambar') ? `<div class="shot"><img src="${img(v(x, 'gambar'), 800)}" alt="${esc(judul)}" loading="lazy"></div>` : ''}
          <h3>${esc(judul)}</h3>
          ${v(x, 'peran', lang) ? `<p class="who">${u.peran}: ${esc(v(x, 'peran', lang))}</p>` : ''}
          ${v(x, 'ringkasan', lang) ? `<p>${esc(v(x, 'ringkasan', lang))}</p>` : ''}
          ${tags(x.alat).length ? `<div class="tags">${tags(x.alat).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : ''}
          <a class="more" href="${P}/proyek/${esc(x.slug)}">${u.bacaStudi}</a>
        </article>`;
      }).join('')}
      </div>`));
  }

  // desain
  const desain = d.desain.filter((x) => v(x, 'gambar'));
  if (desain.length) {
    nav.push([`#${u.s.desain}`, u.s.desain]);
    parts.push(section(u.s.desain, u.s.desain, v(p, 'lead_desain', lang), `
      <div class="gallery" data-close="${esc(u.tutup)}">${desain.map((x) => `
        <a class="tile" href="${img(x.gambar, 2000)}"><img src="${img(x.gambar, 600)}" alt="${esc(v(x, 'judul', lang))}" loading="lazy"></a>`).join('')}
      </div>`));
  }

  // pengalaman
  const peng = d.pengalaman.filter((x) => v(x, 'jabatan', lang));
  if (peng.length) {
    nav.push([`#${u.s.pengalaman}`, u.s.pengalaman]);
    parts.push(section(u.s.pengalaman, u.s.pengalaman, v(p, 'lead_pengalaman', lang), `
      <ol class="timeline">${peng.map((x) => `
        <li>
          ${v(x, 'tahun') ? `<div class="yr">${esc(v(x, 'tahun'))}</div>` : ''}
          <h3>${esc(v(x, 'jabatan', lang))}</h3>
          ${v(x, 'organisasi', lang) ? `<div class="org">${esc(v(x, 'organisasi', lang))}</div>` : ''}
          ${v(x, 'dampak', lang) ? `<p>${esc(v(x, 'dampak', lang))}</p>` : ''}
        </li>`).join('')}
      </ol>`));
  }

  // prestasi
  const pres = d.prestasi.filter((x) => v(x, 'nama', lang));
  if (pres.length) {
    nav.push([`#${u.s.prestasi}`, u.s.prestasi]);
    parts.push(section(u.s.prestasi, u.s.prestasi, v(p, 'lead_prestasi', lang), `
      <div class="awards">${pres.map((x) => {
        const by = [v(x, 'pemberi', lang), v(x, 'tahun')].filter(Boolean).join(' · ');
        const bukti = safeUrl(v(x, 'bukti'));
        return `
        <div class="award">
          <span class="kind">${esc(u.jenis[x.jenis] || x.jenis)}</span>
          <h3>${esc(v(x, 'nama', lang))}</h3>
          ${by ? `<span class="by">${esc(by)}</span>` : ''}
          ${bukti ? `<a class="by" href="${esc(bukti)}" rel="noopener" target="_blank">${u.bukti} ↗</a>` : ''}
        </div>`;
      }).join('')}
      </div>`));
  }

  // kontak
  nav.push([`#${u.s.kontak}`, u.s.kontak]);
  parts.push(section(u.s.kontak, u.s.kontak, v(p, 'lead_kontak', lang), `
      <div class="contact">
        ${kontakDl(p)}
        <a class="btn primary" href="${P}/cv">${u.lihatCv}</a>
      </div>`));

  return layout({
    lang, path: P + '/', origin, nama, nav, body: parts.join('\n'),
    title: `${nama} — ${u.portoTitle}`, desc: v(p, 'identitas', lang) || u.portoDesc(nama),
  });
}

function kontakDl(p) {
  const rows = [];
  const email = v(p, 'email'), gh = v(p, 'github'), li = safeUrl(v(p, 'linkedin'));
  if (email) rows.push(['email', `<a href="mailto:${esc(email)}">${esc(email)}</a>`]);
  if (gh) rows.push(['github', `<a href="https://github.com/${esc(gh)}" rel="noopener" target="_blank">github.com/${esc(gh)}</a>`]);
  if (li) rows.push(['linkedin', `<a href="${esc(li)}" rel="noopener" target="_blank">${esc(li.replace(/^https:\/\/(www\.)?/, ''))}</a>`]);
  return rows.length ? `<dl>${rows.map(([k, val]) => `<dt>${k}</dt><dd>${val}</dd>`).join('')}</dl>` : '';
}

// ---------- studi kasus ----------
export function halamanProyek(d, x, lang, origin) {
  const u = UI[lang];
  const P = pre(lang);
  const nama = v(d.profil, 'nama') || 'Portofolio';
  const judul = v(x, 'judul', lang);
  const langkah = d.proyek_langkah.filter((l) => l.induk_id === x.id && v(l, 'judul', lang));
  const fakta = [
    [u.fakta.peran, v(x, 'peran', lang)],
    [u.fakta.periode, v(x, 'periode', lang)],
    [v(x, 'fakta_label', lang), v(x, 'fakta_isi', lang)],
    [u.fakta.alat, tags(x.alat).join(' · ')],
  ].filter(([a, b]) => a && b);
  const nav = [];
  const parts = [];
  const fig = (gb, ket) => gb ? `
      <figure class="figure">
        <div class="shot"><img src="${img(gb, 1600)}" alt="${esc(ket || judul)}" loading="lazy"></div>
        ${ket ? `<figcaption>${esc(ket)}</figcaption>` : ''}
      </figure>` : '';
  const add = (key, lead, isi) => {
    if (!isi.trim()) return;
    nav.push([`#${u.cs[key].replace(' ', '-')}`, u.cs[key]]);
    parts.push(section(u.cs[key].replace(' ', '-'), u.cs[key], lead, isi, true));
  };

  add('masalah', v(x, 'masalah_lead', lang), paragraf(v(x, 'masalah', lang)));
  const pd = baris(v(x, 'peran_detail', lang));
  add('peran', v(x, 'peran_lead', lang), pd.length ? `<ul>${pd.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '');
  add('proses', v(x, 'proses_lead', lang),
    (langkah.length ? `<ol class="steps">${langkah.map((l) => `<li><div><h3>${esc(v(l, 'judul', lang))}</h3>${v(l, 'isi', lang) ? `<p>${esc(v(l, 'isi', lang))}</p>` : ''}</div></li>`).join('')}</ol>` : '')
    + fig(v(x, 'proses_gambar'), v(x, 'proses_ket', lang)));
  const hs = baris(v(x, 'hasil', lang));
  add('hasil', v(x, 'hasil_lead', lang),
    (hs.length ? `<ul>${hs.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '') + fig(v(x, 'hasil_gambar'), v(x, 'hasil_ket', lang)));
  add('pelajaran', '', paragraf(v(x, 'pelajaran', lang)));

  // proyek berikutnya
  const daftar = d.proyek.filter((y) => v(y, 'judul', lang));
  const i = daftar.findIndex((y) => y.id === x.id);
  const next = daftar.length > 1 ? daftar[(i + 1) % daftar.length] : null;

  const body = `
  <div class="wrap narrow case-head">
    <a class="back" href="${P}/#${u.s.proyek}">${u.kembali}</a>
    <p class="eyebrow">${esc([u.studi, v(x, 'kategori', lang)].filter(Boolean).join(' · '))}</p>
    <h1>${esc(judul)}</h1>
    ${v(x, 'pembuka', lang) ? `<p class="summary">${esc(v(x, 'pembuka', lang))}</p>` : ''}
    ${fakta.length ? `<dl class="facts">${fakta.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd>${esc(b)}</dd></div>`).join('')}</dl>` : ''}
  </div>
  ${parts.join('\n')}
  <section class="s">
    <div class="wrap narrow next">
      <a class="btn" href="${P}/#${u.s.proyek}">${u.semua}</a>
      ${next ? `<a class="btn primary" href="${P}/proyek/${esc(next.slug)}">${esc(v(next, 'judul', lang))} →</a>` : ''}
    </div>
  </section>`;

  return layout({
    lang, path: `${P}/proyek/${x.slug}`, origin, nama, nav, body, bodyClass: 'case',
    title: `${judul} — ${u.studi} · ${nama}`, desc: v(x, 'ringkasan', lang) || v(x, 'pembuka', lang) || judul,
  });
}

// ---------- CV ----------
export function halamanCv(d, lang, origin) {
  const u = UI[lang];
  const c = u.cv;
  const P = pre(lang);
  const p = d.profil || {};
  const nama = v(p, 'nama') || 'Portofolio';
  const item = (h, when, ket) => `<div class="cv-item"><h3>${esc(h)}</h3>${when ? `<span class="when">${esc(when)}</span>` : '<span></span>'}${ket ? `<p>${esc(ket)}</p>` : ''}</div>`;
  const sec = (judul, isi) => (isi ? `<section class="cv-sec"><h2>${esc(judul)}</h2>${isi}</section>` : '');

  const kontak = [v(p, 'email'), v(p, 'github') ? `github.com/${v(p, 'github')}` : '', origin.replace(/^https?:\/\//, '')].filter(Boolean);
  const foto = v(p, 'foto');
  const pend = d.pendidikan.filter((x) => v(x, 'nama', lang)).map((x) => item(v(x, 'nama', lang), v(x, 'tahun', lang), v(x, 'keterangan', lang))).join('');
  const proy = d.proyek.filter((x) => v(x, 'judul', lang)).map((x) => item(v(x, 'judul', lang), v(x, 'cv_tahun') || v(x, 'periode', lang), v(x, 'cv', lang) || v(x, 'ringkasan', lang))).join('');
  const peng = d.pengalaman.filter((x) => v(x, 'jabatan', lang)).map((x) => item([v(x, 'jabatan', lang), v(x, 'organisasi', lang)].filter(Boolean).join(' · '), v(x, 'tahun'), v(x, 'dampak', lang))).join('');
  const pres = d.prestasi.filter((x) => v(x, 'nama', lang)).map((x) => item(v(x, 'nama', lang), v(x, 'tahun'), v(x, 'pemberi', lang))).join('');
  const keah = d.keahlian.map((k) => v(k, 'nama', lang)).filter(Boolean);
  const bhs = baris(v(p, 'bahasa', lang));

  const body = `
  <div class="wrap narrow cv">
    <div class="cv-bar no-print">
      <a class="back" href="${P}/">${c.kembali}</a>
      <p>${c.cetakInfo}</p>
      <button class="btn primary" id="printBtn" type="button">${c.cetak}</button>
    </div>
    <article class="paper">
      <header class="cv-head">
        <div>
          <h1>${esc(nama)}</h1>
          ${v(p, 'identitas', lang) ? `<p class="role">${esc(v(p, 'identitas', lang))}</p>` : ''}
          <ul class="cv-contact">${kontak.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>
        </div>
        ${foto ? `<div class="photo has-img"><img src="${img(foto, 400)}" alt="${esc(nama)}" width="110" height="138"></div>` : ''}
      </header>
      ${sec(c.pendidikan, pend)}
      ${sec(c.proyek, proy)}
      ${sec(c.pengalaman, peng)}
      ${sec(c.prestasi, pres)}
      ${sec(c.keahlian, keah.length ? `<div class="tags">${keah.map((k) => `<span class="tag">${esc(k)}</span>`).join('')}</div>` : '')}
      ${sec(c.bahasa, bhs.length ? `<p class="cv-lang">${bhs.map(esc).join(' · ')}</p>` : '')}
    </article>
  </div>`;

  return layout({
    lang, path: `${P}/cv`, origin, nama, nav: [], body,
    title: `${c.title} — ${nama}`, desc: `${c.title} ${nama}`,
  });
}

// ---------- 404 ----------
export function halaman404(d, lang, origin, path) {
  const u = UI[lang];
  const nama = v(d?.profil, 'nama') || 'Portofolio';
  const body = `
  <div class="wrap narrow case-head">
    <p class="eyebrow">404</p>
    <h1>${u.t404}</h1>
    <p class="summary">${u.p404}</p>
    <a class="btn primary" href="${pre(lang)}/">${u.ke404}</a>
  </div>`;
  return layout({ lang, path, origin, nama, nav: [], body, title: `404 — ${nama}`, desc: u.p404 });
}
