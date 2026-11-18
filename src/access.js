// Verifikasi token Cloudflare Access (JWT RS256) untuk /admin dan /api/admin.
// Gagal = tertutup: jika ACCESS_TEAM_DOMAIN / ACCESS_AUD belum diisi, admin terkunci.
// Pengecualian HANYA untuk pengembangan lokal: DEV_ADMIN=1 (di .dev.vars) DAN host localhost.

let cacheKunci = { url: '', kunci: null, sampai: 0 };

const b64url = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4)), (c) => c.charCodeAt(0));
const jsonPart = (s) => JSON.parse(new TextDecoder().decode(b64url(s)));

async function ambilKunci(certsUrl) {
  const now = Date.now();
  if (cacheKunci.url === certsUrl && cacheKunci.sampai > now) return cacheKunci.kunci;
  const res = await fetch(certsUrl);
  if (!res.ok) throw new Error('Gagal mengambil kunci Access');
  const { keys } = await res.json();
  const kunci = new Map();
  for (const jwk of keys || []) {
    if (jwk.kty !== 'RSA') continue;
    kunci.set(jwk.kid, await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']));
  }
  cacheKunci = { url: certsUrl, kunci, sampai: now + 60 * 60 * 1000 };
  return kunci;
}

function ambilToken(request) {
  const h = request.headers.get('Cf-Access-Jwt-Assertion');
  if (h) return h;
  const m = (request.headers.get('Cookie') || '').match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  return m ? m[1] : '';
}

/** Mengembalikan {email} jika sah, atau null. */
export async function cekAdmin(request, env) {
  const url = new URL(request.url);
  if (env.DEV_ADMIN === '1' && (url.hostname === 'localhost' || url.hostname === '127.0.0.1')) return { email: 'dev@localhost' };

  const team = String(env.ACCESS_TEAM_DOMAIN || '').trim().replace(/^https?:\/\//, '').replace(/\/+$/, '');
  const aud = String(env.ACCESS_AUD || '').trim();
  if (!team || !aud) return null;

  const token = ambilToken(request);
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const header = jsonPart(parts[0]);
    const payload = jsonPart(parts[1]);
    if (header.alg !== 'RS256') return null;
    const kunci = await ambilKunci(`https://${team}/cdn-cgi/access/certs`);
    let k = kunci.get(header.kid);
    if (!k) {
      cacheKunci.sampai = 0; // kunci mungkin baru dirotasi
      k = (await ambilKunci(`https://${team}/cdn-cgi/access/certs`)).get(header.kid);
      if (!k) return null;
    }
    const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', k, b64url(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
    if (!ok) return null;
    const now = Math.floor(Date.now() / 1000);
    const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!auds.includes(aud)) return null;
    if (payload.iss !== `https://${team}`) return null;
    if (typeof payload.exp !== 'number' || payload.exp < now) return null;
    if (typeof payload.nbf === 'number' && payload.nbf > now + 60) return null;
    if (!payload.email) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}
