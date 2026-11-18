// Akses D1. Nama tabel/kolom HANYA dari SKEMA (whitelist), nilai selalu lewat bind().
import { SKEMA, TABEL, kolom, MAKS_PANJANG } from './skema.js';

const DAFTAR = TABEL.filter((t) => !SKEMA[t].tunggal);

/** Semua isi untuk halaman publik (hanya yang tampil) atau admin (semua). */
export async function muatSemua(db, { admin = false } = {}) {
  const filter = admin ? '' : ' WHERE tampil = 1';
  const qs = [db.prepare('SELECT * FROM profil WHERE id = 1')];
  for (const t of DAFTAR) {
    const order = SKEMA[t].induk ? 'induk_id, urut, id' : 'urut, id';
    qs.push(db.prepare(`SELECT * FROM ${t}${filter} ORDER BY ${order}`));
  }
  const res = await db.batch(qs);
  const out = { profil: res[0].results[0] || null };
  DAFTAR.forEach((t, i) => (out[t] = res[i + 1].results));
  if (!admin) {
    // langkah dari proyek tersembunyi juga disembunyikan
    const ids = new Set(out.proyek.map((p) => p.id));
    out.proyek_langkah = out.proyek_langkah.filter((l) => ids.has(l.induk_id));
  }
  return out;
}

export async function proyekBySlug(db, slug) {
  return db.prepare('SELECT * FROM proyek WHERE slug = ? AND tampil = 1').bind(slug).first();
}

/** Apakah ID gambar Drive dipakai di salah satu kolom gambar (mencegah /img jadi proxy umum). */
export async function gambarDipakai(db, id, kolomGambar) {
  const sql = kolomGambar.map(({ tabel, kolom: k }) => `SELECT 1 FROM ${tabel} WHERE ${k} = ?1`).join(' UNION ALL ') + ' LIMIT 1';
  return !!(await db.prepare(sql).bind(id).first());
}

// ---------- validasi ----------
export class GalatValidasi extends Error {}

export function ambilIdDrive(s) {
  s = String(s || '').trim();
  if (!s) return '';
  const pola = [/\/file\/d\/([\w-]{10,})/, /[?&]id=([\w-]{10,})/, /\/d\/([\w-]{10,})/, /^([\w-]{10,})$/];
  for (const p of pola) {
    const m = s.match(p);
    if (m) return m[1];
  }
  throw new GalatValidasi('Link Google Drive tidak dikenali. Tempel link share dari tombol "Bagikan" di Drive.');
}

function bersihkan(tabel, f, nilai) {
  let s = nilai == null ? '' : String(nilai);
  s = s.replace(/\r\n/g, '\n').trim();
  if (s.length > MAKS_PANJANG) throw new GalatValidasi(`"${f.label}" terlalu panjang (maks ${MAKS_PANJANG} karakter).`);
  if (!s) {
    if (f.jenis === 'slug') throw new GalatValidasi('Alamat halaman wajib diisi.');
    if (f.jenis === 'select') return f.pilihan[0];
    return '';
  }
  switch (f.jenis) {
    case 'text': case 'tags':
      return s.replace(/\s*\n\s*/g, ' ');
    case 'image':
      return ambilIdDrive(s);
    case 'url':
      if (!/^https:\/\/[^\s<>"']+$/i.test(s)) throw new GalatValidasi(`"${f.label}" harus diawali https:// dan tanpa spasi.`);
      return s;
    case 'email':
      if (!/^[^\s@<>"']+@[^\s@<>"']+\.[a-z]{2,}$/i.test(s)) throw new GalatValidasi('Format email tidak valid.');
      return s;
    case 'github':
      s = s.replace(/^https?:\/\/(www\.)?github\.com\//i, '').replace(/\/.*$/, '');
      if (!/^[a-z\d](?:[a-z\d-]{0,38})$/i.test(s)) throw new GalatValidasi('Username GitHub tidak valid.');
      return s;
    case 'slug':
      s = s.toLowerCase();
      if (!/^[a-z0-9](?:[a-z0-9-]{0,58}[a-z0-9])?$/.test(s)) throw new GalatValidasi('Alamat halaman hanya boleh huruf kecil, angka, dan tanda - (tidak di awal/akhir).');
      return s;
    case 'select':
      if (!f.pilihan.includes(s)) throw new GalatValidasi(`Pilihan "${f.label}" tidak valid.`);
      return s;
    default: // long, list
      return s;
  }
}

/** Ubah body JSON jadi {kolom: nilai} yang sudah divalidasi. Hanya kolom yang dikirim. */
function nilaiDariBody(tabel, body, { wajibSemua = false } = {}) {
  const out = {};
  for (const f of SKEMA[tabel].isian) {
    const keys = f.bi ? [f.k + '_id', f.k + '_en'] : [f.k];
    for (const k of keys) {
      if (k in body) out[k] = bersihkan(tabel, f, body[k]);
      else if (wajibSemua && f.jenis === 'slug') throw new GalatValidasi('Alamat halaman wajib diisi.');
    }
  }
  return out;
}

// ---------- tulis ----------
export async function simpanProfil(db, body) {
  const val = nilaiDariBody('profil', body);
  const ks = Object.keys(val);
  if (!ks.length) return;
  await db.prepare('INSERT OR IGNORE INTO profil (id) VALUES (1)').run();
  await db.prepare(`UPDATE profil SET ${ks.map((k) => `${k} = ?`).join(', ')}, diubah = datetime('now') WHERE id = 1`)
    .bind(...ks.map((k) => val[k])).run();
}

export async function tambah(db, tabel, body) {
  cekDaftar(tabel);
  const val = nilaiDariBody(tabel, body, { wajibSemua: true });
  const s = SKEMA[tabel];
  let induk = null;
  if (s.induk) {
    induk = Number(body.induk_id);
    if (!Number.isInteger(induk) || !(await db.prepare(`SELECT 1 FROM ${s.induk} WHERE id = ?`).bind(induk).first()))
      throw new GalatValidasi('Induk tidak ditemukan.');
    val.induk_id = induk;
  }
  if (tabel === 'proyek') await cekSlugUnik(db, val.slug, null);
  const where = s.induk ? ' WHERE induk_id = ?' : '';
  const maks = await db.prepare(`SELECT COALESCE(MAX(urut), 0) AS m FROM ${tabel}${where}`).bind(...(s.induk ? [induk] : [])).first();
  val.urut = (maks?.m || 0) + 1;
  val.tampil = body.tampil === false || body.tampil === 0 ? 0 : 1;
  const ks = Object.keys(val);
  const r = await db.prepare(`INSERT INTO ${tabel} (${ks.join(', ')}, diubah) VALUES (${ks.map(() => '?').join(', ')}, datetime('now'))`)
    .bind(...ks.map((k) => val[k])).run();
  return r.meta.last_row_id;
}

export async function ubah(db, tabel, id, body) {
  cekDaftar(tabel);
  const val = nilaiDariBody(tabel, body);
  if ('tampil' in body) val.tampil = body.tampil ? 1 : 0;
  if (tabel === 'proyek' && 'slug' in val) await cekSlugUnik(db, val.slug, id);
  const ks = Object.keys(val);
  if (!ks.length) return false;
  const r = await db.prepare(`UPDATE ${tabel} SET ${ks.map((k) => `${k} = ?`).join(', ')}, diubah = datetime('now') WHERE id = ?`)
    .bind(...ks.map((k) => val[k]), id).run();
  return r.meta.changes > 0;
}

export async function hapus(db, tabel, id) {
  cekDaftar(tabel);
  const qs = [];
  // D1 tidak menjamin PRAGMA foreign_keys aktif → hapus anak secara eksplisit
  for (const t of DAFTAR) if (SKEMA[t].induk === tabel) qs.push(db.prepare(`DELETE FROM ${t} WHERE induk_id = ?`).bind(id));
  qs.push(db.prepare(`DELETE FROM ${tabel} WHERE id = ?`).bind(id));
  const res = await db.batch(qs);
  return res[res.length - 1].meta.changes > 0;
}

/** ids = urutan baru (semua id dalam satu daftar / satu induk). */
export async function urutkan(db, tabel, ids) {
  cekDaftar(tabel);
  if (!Array.isArray(ids) || !ids.length || ids.length > 500 || !ids.every((x) => Number.isInteger(x)))
    throw new GalatValidasi('Daftar urutan tidak valid.');
  await db.batch(ids.map((id, i) => db.prepare(`UPDATE ${tabel} SET urut = ? WHERE id = ?`).bind(i + 1, id)));
}

async function cekSlugUnik(db, slug, kecualiId) {
  const ada = await db.prepare('SELECT id FROM proyek WHERE slug = ?').bind(slug).first();
  if (ada && ada.id !== kecualiId) throw new GalatValidasi(`Alamat "${slug}" sudah dipakai proyek lain.`);
}

function cekDaftar(tabel) {
  if (!DAFTAR.includes(tabel)) throw new GalatValidasi('Bagian tidak dikenal.');
}

// ---------- cadangan ----------
export async function ekspor(db) {
  const d = await muatSemua(db, { admin: true });
  return { format: 'portofolio-cadangan', versi: 1, dibuat: new Date().toISOString(), data: d };
}

/** Ganti SEMUA isi dengan cadangan. Divalidasi dulu seluruhnya, baru ditulis dalam satu batch. */
export async function impor(db, cadangan) {
  if (!cadangan || cadangan.format !== 'portofolio-cadangan' || cadangan.versi !== 1 || typeof cadangan.data !== 'object')
    throw new GalatValidasi('File bukan cadangan portofolio yang valid.');
  const d = cadangan.data;
  const qs = [];
  // hapus anak dulu, lalu induk
  const urutHapus = [...DAFTAR].sort((a, b) => (SKEMA[b].induk ? 1 : 0) - (SKEMA[a].induk ? 1 : 0));
  for (const t of urutHapus) qs.push(db.prepare(`DELETE FROM ${t}`));
  qs.push(db.prepare('DELETE FROM profil'));

  const tulis = (tabel, row, extra) => {
    const val = { ...nilaiDariBody(tabel, row), ...extra };
    const ks = Object.keys(val);
    qs.push(db.prepare(`INSERT INTO ${tabel} (${ks.join(', ')}, diubah) VALUES (${ks.map(() => '?').join(', ')}, datetime('now'))`)
      .bind(...ks.map((k) => val[k])));
  };
  const int = (x, nama) => {
    const n = Number(x);
    if (!Number.isInteger(n) || n < 0) throw new GalatValidasi(`Nilai ${nama} tidak valid di file cadangan.`);
    return n;
  };
  if (d.profil) tulis('profil', d.profil, { id: 1 });
  const urutTulis = [...DAFTAR].sort((a, b) => (SKEMA[a].induk ? 1 : 0) - (SKEMA[b].induk ? 1 : 0));
  for (const t of urutTulis) {
    const rows = d[t] || [];
    if (!Array.isArray(rows) || rows.length > 500) throw new GalatValidasi(`Bagian ${t} tidak valid.`);
    const indukIds = SKEMA[t].induk ? new Set((d[SKEMA[t].induk] || []).map((r) => r.id)) : null;
    for (const r of rows) {
      const extra = { id: int(r.id, 'id'), urut: int(r.urut ?? 0, 'urut'), tampil: r.tampil ? 1 : 0 };
      if (indukIds) {
        if (!indukIds.has(r.induk_id)) continue; // anak yatim dilewati
        extra.induk_id = int(r.induk_id, 'induk_id');
      }
      tulis(t, r, extra);
    }
  }
  await db.batch(qs); // D1 batch = satu transaksi
}
