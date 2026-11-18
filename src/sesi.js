// Login admin dengan password (DESIGN §9.5).
// - Password = secret ADMIN_PASSWORD (min. 12 karakter). Kosong/pendek = admin terkunci.
// - Sesi = cookie "adm" = <kedaluwarsa>.<acak>.<HMAC>, kunci HMAC diturunkan dari password,
//   jadi mengganti password otomatis membatalkan semua sesi.
// - Pembatas percobaan disimpan di tabel login_gagal (D1).
import { esc } from './render.js';

export const PANJANG_MIN = 12;
const DURASI = 8 * 60 * 60; // detik
const JENDELA = 15 * 60; // detik
const MAKS_PER_IP = 5;
const MAKS_TOTAL = 20;
const COOKIE = 'adm';

const enc = new TextEncoder();
const b64url = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

function passwordSiap(env) {
  return typeof env.ADMIN_PASSWORD === 'string' && env.ADMIN_PASSWORD.length >= PANJANG_MIN;
}

async function kunciHmac(env) {
  const bahan = await crypto.subtle.digest('SHA-256', enc.encode('portofolio-sesi-v1\u0000' + env.ADMIN_PASSWORD));
  return crypto.subtle.importKey('raw', bahan, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

/** Perbandingan waktu-tetap lewat digest (panjang input tidak bocor). */
async function samaAman(a, b) {
  const [x, y] = await Promise.all([crypto.subtle.digest('SHA-256', enc.encode(a)), crypto.subtle.digest('SHA-256', enc.encode(b))]);
  const ua = new Uint8Array(x), ub = new Uint8Array(y);
  let beda = 0;
  for (let i = 0; i < ua.length; i++) beda |= ua[i] ^ ub[i];
  return beda === 0;
}

function lokal(request) {
  const h = new URL(request.url).hostname;
  return h === 'localhost' || h === '127.0.0.1';
}
const ipDari = (request) => request.headers.get('CF-Connecting-IP') || 'tidak-diketahui';

async function buatCookie(env) {
  const exp = Math.floor(Date.now() / 1000) + DURASI;
  const acak = b64url(crypto.getRandomValues(new Uint8Array(16)));
  const isi = `${exp}.${acak}`;
  const sig = b64url(await crypto.subtle.sign('HMAC', await kunciHmac(env), enc.encode(isi)));
  return `${isi}.${sig}`;
}

function atributCookie(request, maxAge) {
  const secure = new URL(request.url).protocol === 'https:' ? '; Secure' : '';
  return `; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure}`;
}

/** {email} jika sesi sah, atau null. */
export async function cekAdmin(request, env) {
  if (env.DEV_ADMIN === '1' && lokal(request)) return { email: 'dev@localhost' };
  if (!passwordSiap(env)) return null;
  const m = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)adm=([\w.-]+)/);
  if (!m) return null;
  const parts = m[1].split('.');
  if (parts.length !== 3 || !/^\d+$/.test(parts[0])) return null;
  if (Number(parts[0]) < Math.floor(Date.now() / 1000)) return null;
  try {
    const sig = Uint8Array.from(atob(parts[2].replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((parts[2].length + 3) % 4)), (c) => c.charCodeAt(0));
    const ok = await crypto.subtle.verify('HMAC', await kunciHmac(env), sig, enc.encode(`${parts[0]}.${parts[1]}`));
    return ok ? { email: 'admin' } : null;
  } catch {
    return null;
  }
}

// ---------- halaman masuk ----------
export function halamanMasuk({ pesan = '', galat = false, terkunci = false } = {}) {
  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Masuk Admin</title>
<script src="/assets/js/tema.js"></script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap">
<link rel="stylesheet" href="/assets/css/style.css">
<link rel="stylesheet" href="/admin/admin.css">
</head>
<body class="admin">
<main class="wrap masuk">
  <form class="card" method="post" action="/admin/masuk">
    <p class="brand">admin<span>.</span>portofolio</p>
    <h1>Masuk</h1>
    ${pesan ? `<p class="hint${galat ? ' err' : ''}" role="alert">${esc(pesan)}</p>` : ''}
    ${terkunci ? '' : `
    <label class="field"><span class="lbl">Password admin</span>
      <input type="password" name="password" id="password" autocomplete="current-password" required autofocus maxlength="200">
    </label>
    <button class="btn primary" type="submit">Masuk</button>`}
    <a class="back" href="/">← kembali ke situs</a>
  </form>
</main>
</body>
</html>`;
}

/** Tangani POST /admin/masuk. Mengembalikan {status, html, cookie?, redirect?} */
export async function prosesMasuk(request, env) {
  if (!passwordSiap(env)) {
    return { status: 503, html: halamanMasuk({ terkunci: true, galat: true, pesan: `Admin belum diaktifkan. Isi secret ADMIN_PASSWORD (minimal ${PANJANG_MIN} karakter) di dashboard Cloudflare.` }) };
  }
  const db = env.DB;
  const now = Math.floor(Date.now() / 1000);
  const ip = ipDari(request);
  await db.prepare('DELETE FROM login_gagal WHERE waktu < ?').bind(now - 86400).run();
  const hitung = await db.prepare('SELECT SUM(ip = ?1) AS per_ip, COUNT(*) AS total FROM login_gagal WHERE waktu >= ?2').bind(ip, now - JENDELA).first();
  if ((hitung?.per_ip || 0) >= MAKS_PER_IP || (hitung?.total || 0) >= MAKS_TOTAL) {
    return { status: 429, html: halamanMasuk({ galat: true, pesan: 'Terlalu banyak percobaan salah. Coba lagi 15 menit lagi.' }) };
  }

  let password = '';
  try {
    const form = await request.formData();
    password = String(form.get('password') || '');
  } catch { /* form rusak = password kosong */ }

  if (password && password.length <= 200 && (await samaAman(password, env.ADMIN_PASSWORD))) {
    await db.prepare('DELETE FROM login_gagal WHERE ip = ?').bind(ip).run();
    return { status: 303, redirect: '/admin/', cookie: `${COOKIE}=${await buatCookie(env)}${atributCookie(request, DURASI)}` };
  }
  await db.prepare('INSERT INTO login_gagal (ip, waktu) VALUES (?, ?)').bind(ip, now).run();
  const sisa = MAKS_PER_IP - ((hitung?.per_ip || 0) + 1);
  return {
    status: 401,
    html: halamanMasuk({ galat: true, pesan: sisa > 0 ? `Password salah. Sisa ${sisa} percobaan sebelum dikunci 15 menit.` : 'Password salah. Login dikunci 15 menit.' }),
  };
}

export function cookieKeluar(request) {
  return `${COOKIE}=${atributCookie(request, 0)}`;
}
