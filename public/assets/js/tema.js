// Dimuat di <head> sebelum CSS agar mode terang/gelap pilihan pengunjung tidak berkedip.
try { var t = localStorage.getItem('jhk-theme'); if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t); } catch (e) {}
