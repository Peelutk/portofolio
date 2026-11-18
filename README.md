# Portofolio Jao Hong Khai

Situs portofolio dwibahasa (Indonesia `/`, Inggris `/en/`) di **Cloudflare Workers + D1**.
Isi dikelola lewat panel admin `/admin` yang dilindungi Cloudflare Access.

- Live: https://portofolio.jaohongk.workers.dev
- Desain & keputusan: [DESIGN.md](DESIGN.md) (§9 = panel admin)

## Struktur

```
src/        worker.js (router), render.js (template HTML), db.js (D1), skema.js (isian konten),
            access.js (verifikasi Cloudflare Access), gambar.js (proxy gambar Google Drive)
migrations/ skema D1 + isi awal
public/     assets/ (css, js) dan admin/ (panel admin)
```

Menambah isian baru: tambahkan di `src/skema.js` **dan** buat migrasi baru `migrations/000N_*.sql`
(`ALTER TABLE ... ADD COLUMN ...`). Form admin dibentuk otomatis dari skema.

## Perintah

```sh
npx wrangler@4 d1 migrations apply db_portofolio --local    # siapkan D1 lokal
echo DEV_ADMIN=1 > .dev.vars                                 # admin tanpa login, HANYA di localhost
npx wrangler@4 dev                                           # http://localhost:8787 dan /admin/

npx wrangler@4 d1 migrations apply db_portofolio --remote   # migrasi produksi
npx wrangler@4 deploy                                        # terbitkan
```

## Gambar

Di admin, tempel link share Google Drive (file harus "Siapa saja yang memiliki link").
Situs memuatnya lewat `/img/<id>` dan menyimpannya di cache Cloudflare. Hanya ID yang dipakai di konten yang dilayani.
