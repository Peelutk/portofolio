// Worker portofolio: render halaman dari D1, proxy gambar Drive, API & panel admin.
import { muatSemua, proyekBySlug, gambarDipakai, simpanProfil, tambah, ubah, hapus, urutkan, ekspor, impor, ambilIdDrive, GalatValidasi } from './db.js';
import { halamanBeranda, halamanProyek, halamanCv, halaman404 } from './render.js';
import { cekAdmin, halamanMasuk, prosesMasuk, cookieKeluar } from './sesi.js';
import { layaniGambar, ambilDariDrive } from './gambar.js';
import { SKEMA, kolomGambar } from './skema.js';

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'self'",
].join('; ');

function amankan(res, { html = false } = {}) {
  const h = new Headers(res.headers);
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('X-Frame-Options', 'DENY');
  if (html) {
    h.set('Content-Security-Policy', CSP);
    h.set('Content-Type', 'text/html; charset=utf-8');
  }
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
}

const html = (body, status = 200, extra = {}) =>
  amankan(new Response(body, { status, headers: { 'Cache-Control': 'no-cache', ...extra } }), { html: true });
const json = (data, status = 200) =>
  amankan(new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } }));
const pindah = (to, status = 301) => new Response(null, { status, headers: { Location: to } });

export default {
  async fetch(request, env, ctx) {
    try {
      return await tangani(request, env, ctx);
    } catch (e) {
      console.error(e);
      return json({ galat: 'Terjadi kesalahan di server.' }, 500);
    }
  },
};

async function tangani(request, env, ctx) {
  const url = new URL(request.url);
  let path = url.pathname;
  const origin = url.origin;

  // ---- admin ----
  if (path === '/admin' || path.startsWith('/admin/') || path.startsWith('/api/admin/')) {
    const noStore = { 'Cache-Control': 'no-store' };
    // halaman & proses masuk / keluar (tidak butuh sesi)
    if (path === '/admin/masuk') {
      if (request.method === 'POST') {
        const r = await prosesMasuk(request, env);
        if (r.redirect) return new Response(null, { status: r.status, headers: { Location: r.redirect, 'Set-Cookie': r.cookie, ...noStore } });
        return html(r.html, r.status, noStore);
      }
      if (await cekAdmin(request, env)) return pindah('/admin/', 302);
      return html(halamanMasuk(), 200, noStore);
    }
    if (path === '/admin/keluar' && request.method === 'POST') {
      return new Response(null, { status: 303, headers: { Location: '/admin/masuk', 'Set-Cookie': cookieKeluar(request), ...noStore } });
    }
    // aset tampilan halaman masuk boleh tanpa sesi
    if (path === '/admin/admin.css') return env.ASSETS.fetch(request);

    const admin = await cekAdmin(request, env);
    if (!admin) {
      return path.startsWith('/api/')
        ? json({ galat: 'Sesi berakhir. Silakan masuk lagi.' }, 401)
        : pindah('/admin/masuk', 302);
    }
    if (path.startsWith('/api/admin/')) return apiAdmin(request, env, path.slice('/api/admin/'.length), admin);
    if (path === '/admin') return pindah('/admin/', 302);
    const res = await env.ASSETS.fetch(request);
    const r = amankan(res, { html: (res.headers.get('Content-Type') || '').includes('text/html') });
    r.headers.set('Cache-Control', 'no-store');
    return r;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Metode tidak diizinkan', { status: 405, headers: { Allow: 'GET, HEAD' } });

  // ---- gambar ----
  const mImg = path.match(/^\/img\/([\w-]{10,200})$/);
  if (mImg) return layaniGambar(request, ctx, mImg[1], () => gambarDipakai(env.DB, mImg[1], kolomGambar()));

  if (path === '/robots.txt')
    return new Response(`User-agent: *\nDisallow: /admin/\nDisallow: /api/\nSitemap: ${origin}/sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain' } });

  // ---- alamat lama v1 (.html) ----
  const lama = path.match(/^(\/en)?\/(?:(index)|(cv)|proyek\/([a-z0-9-]+))\.html$/);
  if (lama) return pindah(`${lama[1] || ''}/${lama[3] ? 'cv' : lama[4] ? 'proyek/' + lama[4] : ''}`);
  if (path === '/en') return pindah('/en/');
  if (path.length > 1 && path.endsWith('/') && path !== '/en/') return pindah(path.slice(0, -1));

  const lang = path === '/en/' || path.startsWith('/en/') ? 'en' : 'id';
  const rel = lang === 'en' ? path.slice(3) || '/' : path; // path tanpa /en

  const d = await muatSemua(env.DB);
  if (path === '/sitemap.xml') return sitemap(d, origin);

  if (rel === '/') return html(halamanBeranda(d, lang, origin));
  if (rel === '/cv') return html(halamanCv(d, lang, origin));
  const mP = rel.match(/^\/proyek\/([a-z0-9-]+)$/);
  if (mP) {
    const x = await proyekBySlug(env.DB, mP[1]);
    if (x && String(x[`judul_${lang}`] || '').trim()) return html(halamanProyek(d, x, lang, origin));
  }
  return html(halaman404(d, lang, origin, path), 404);
}

function sitemap(d, origin) {
  const urls = ['/', '/cv', ...d.proyek.map((p) => `/proyek/${p.slug}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map((u) => {
    const id = origin + u, en = origin + (u === '/' ? '/en/' : '/en' + u);
    const alt = `<xhtml:link rel="alternate" hreflang="id" href="${id}"/><xhtml:link rel="alternate" hreflang="en" href="${en}"/>`;
    return `<url><loc>${id}</loc>${alt}</url>\n<url><loc>${en}</loc>${alt}</url>`;
  }).join('\n')}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

// ---- API admin ----
async function apiAdmin(request, env, sub, admin) {
  const m = request.method;
  const db = env.DB;
  // Perlindungan CSRF: semua perubahan wajib header khusus + JSON (form lintas situs tidak bisa mengirimnya)
  if (m !== 'GET') {
    if (request.headers.get('X-Admin') !== '1' || !(request.headers.get('Content-Type') || '').startsWith('application/json'))
      return json({ galat: 'Permintaan ditolak.' }, 403);
  }
  const body = m === 'GET' || m === 'DELETE' ? {} : await request.json().catch(() => null);
  if (body === null) return json({ galat: 'Isi permintaan bukan JSON yang valid.' }, 400);

  try {
    if (sub === 'saya' && m === 'GET') return json({ email: admin.email });
    if (sub === 'skema' && m === 'GET') return json(SKEMA);
    if (sub === 'data' && m === 'GET') return json(await muatSemua(db, { admin: true }));
    if (sub === 'ekspor' && m === 'GET') return json(await ekspor(db));
    if (sub === 'impor' && m === 'POST') { await impor(db, body); return json({ ok: true }); }
    if (sub === 'cek-gambar' && m === 'POST') {
      const id = ambilIdDrive(body.link);
      if (!id) return json({ ok: false, pesan: 'Link kosong.' });
      const r = await ambilDariDrive(id, 400);
      return json(r ? { ok: true, id } : { ok: false, id, pesan: 'Gambar tidak bisa diambil. Pastikan file di-share "Siapa saja yang memiliki link".' });
    }
    if (sub === 'profil' && m === 'PUT') { await simpanProfil(db, body); return json({ ok: true }); }

    const mt = sub.match(/^([a-z_]+)(?:\/(\d+))?(?:\/(urut))?$/);
    if (mt && SKEMA[mt[1]] && !SKEMA[mt[1]].tunggal) {
      const [, tabel, idStr, urut] = mt;
      const id = idStr ? Number(idStr) : null;
      if (urut && !id && m === 'POST') { await urutkan(db, tabel, body.ids); return json({ ok: true }); }
      if (!id && !urut && m === 'POST') return json({ ok: true, id: await tambah(db, tabel, body) }, 201);
      if (id && !urut && m === 'PUT') return (await ubah(db, tabel, id, body)) ? json({ ok: true }) : json({ galat: 'Data tidak ditemukan.' }, 404);
      if (id && !urut && m === 'DELETE') return (await hapus(db, tabel, id)) ? json({ ok: true }) : json({ galat: 'Data tidak ditemukan.' }, 404);
    }
    return json({ galat: 'Alamat API tidak dikenal.' }, 404);
  } catch (e) {
    if (e instanceof GalatValidasi) return json({ galat: e.message }, 400);
    if (/UNIQUE constraint/i.test(String(e?.message))) return json({ galat: 'Data bentrok: alamat halaman (slug) sudah dipakai.' }, 400);
    throw e;
  }
}
