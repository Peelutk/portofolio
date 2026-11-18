-- Catatan login admin yang gagal, untuk pembatas percobaan (DESIGN §9.5).
-- Baris lebih dari 1 hari dihapus otomatis saat ada percobaan login.
CREATE TABLE login_gagal (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ip TEXT NOT NULL,
  waktu INTEGER NOT NULL
);
CREATE INDEX idx_login_gagal_waktu ON login_gagal(waktu);
