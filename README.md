# Portofolio Jao Hong Khai

Situs portofolio dwibahasa (Indonesia `/`, Inggris `/en/`) di **Cloudflare Workers + D1**.
Isi dikelola lewat panel admin `/admin` (login dengan password admin).

- Live: https://portofolio.jaohongk.workers.dev
- Desain & keputusan: [DESIGN.md](DESIGN.md) (§9 = panel admin)

## Struktur

```
src/        worker.js (router), render.js (template HTML), db.js (D1), skema.js (isian konten),
            sesi.js (login admin & pembatas percobaan), gambar.js (proxy gambar Google Drive)
migrations/ skema D1 + isi awal
public/     assets/ (css, js) dan admin/ (panel admin)
```

Menambah isian baru: tambahkan di `src/skema.js` **dan** buat migrasi baru `migrations/000N_*.sql`
(`ALTER TABLE ... ADD COLUMN ...`). Form admin dibentuk otomatis dari skema.

## Perintah

```sh
npx wrangler@4 d1 migrations apply db_portofolio --local    # siapkan D1 lokal
echo ADMIN_PASSWORD=password-lokal-minimal-12 > .dev.vars  # atau DEV_ADMIN=1 (tanpa login, HANYA localhost)
npx wrangler@4 dev                                           # http://localhost:8787 dan /admin/

npx wrangler@4 d1 migrations apply db_portofolio --remote   # migrasi produksi
npx wrangler@4 deploy                                        # terbitkan
```

## Password admin

Password = secret `ADMIN_PASSWORD` (minimal 12 karakter), diisi di dashboard Cloudflare:
Workers & Pages → portofolio → Settings → Variables and secrets → Add → Type **Secret**.
Mengganti password otomatis mengeluarkan semua sesi. 5 kali salah per IP / 15 menit = dikunci 15 menit.

## Gambar

Di admin, tempel link share Google Drive (file harus "Siapa saja yang memiliki link").
Situs memuatnya lewat `/img/<id>` dan menyimpannya di cache Cloudflare. Hanya ID yang dipakai di konten yang dilayani.
