// /img/<idDrive>?w=<lebar> — ambil gambar dari Google Drive, simpan di cache Cloudflare.
// Hanya ID yang dipakai di konten (dicek di D1) yang dilayani, supaya bukan proxy umum.

export const LEBAR = [400, 600, 800, 1600, 2000];

function sumber(id, w) {
  return [
    `https://lh3.googleusercontent.com/d/${id}=w${w}`,
    `https://drive.google.com/thumbnail?id=${id}&sz=w${w}`,
  ];
}

/** Ambil gambar dari Drive. Mengembalikan Response gambar atau null. */
export async function ambilDariDrive(id, w) {
  for (const u of sumber(id, w)) {
    try {
      const r = await fetch(u, { redirect: 'follow', cf: { cacheTtl: 0 } });
      const ct = r.headers.get('Content-Type') || '';
      if (r.ok && ct.startsWith('image/')) return r;
    } catch {
      /* coba sumber berikutnya */
    }
  }
  return null;
}

export async function layaniGambar(request, ctx, id, dipakai) {
  const url = new URL(request.url);
  let w = Number(url.searchParams.get('w')) || 800;
  w = LEBAR.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a));
  const kunciCache = new Request(`${url.origin}/img/${id}?w=${w}`);
  const cache = caches.default;
  const ada = await cache.match(kunciCache);
  if (ada) return ada;

  if (!(await dipakai())) return new Response('Gambar tidak ditemukan', { status: 404 });
  const r = await ambilDariDrive(id, w);
  if (!r) return new Response('Gambar tidak bisa diambil dari Google Drive', { status: 502, headers: { 'Cache-Control': 'no-store' } });

  const res = new Response(r.body, {
    headers: {
      'Content-Type': r.headers.get('Content-Type'),
      'Cache-Control': 'public, max-age=86400, s-maxage=604800',
      'X-Content-Type-Options': 'nosniff',
    },
  });
  ctx.waitUntil(cache.put(kunciCache, res.clone()));
  return res;
}
