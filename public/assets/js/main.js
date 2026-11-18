/* Portofolio Jao Hong Khai — mode terang/gelap, galeri lightbox, tombol cetak CV.
   Semua bagian tetap berfungsi tanpa JS kecuali tombol-tombol ini. */
(function () {
  var root = document.documentElement;
  var KEY = 'jhk-theme';

  /* ---- Mode terang/gelap ---- */
  var themeBtn = document.getElementById('themeBtn');
  function current() {
    var t = root.getAttribute('data-theme');
    if (t) return t;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  function paint() {
    if (!themeBtn) return;
    var dark = current() === 'dark';
    themeBtn.textContent = dark ? '☀' : '☾';
    themeBtn.setAttribute('aria-label', themeBtn.getAttribute(dark ? 'data-to-light' : 'data-to-dark'));
  }
  if (themeBtn) {
    paint();
    themeBtn.addEventListener('click', function () {
      var next = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      paint();
    });
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', paint);
  }

  /* ---- Lightbox galeri: <a class="tile" href="gambar-besar.jpg"><img ...></a> ---- */
  var gallery = document.querySelector('.gallery');
  if (gallery) {
    gallery.addEventListener('click', function (ev) {
      var link = ev.target.closest('a.tile');
      if (!link) return;
      ev.preventDefault();
      var lastFocus = document.activeElement;
      var box = document.createElement('div');
      box.className = 'lightbox';
      box.setAttribute('role', 'dialog');
      box.setAttribute('aria-modal', 'true');
      var img = document.createElement('img');
      img.src = link.getAttribute('href');
      var inner = link.querySelector('img');
      img.alt = inner ? inner.alt : '';
      var close = document.createElement('button');
      close.type = 'button';
      close.textContent = gallery.getAttribute('data-close') || 'Tutup ✕';
      box.appendChild(img);
      box.appendChild(close);
      function shut() {
        box.remove();
        document.removeEventListener('keydown', onKey);
        if (lastFocus) lastFocus.focus();
      }
      function onKey(e) { if (e.key === 'Escape') shut(); }
      box.addEventListener('click', function (e) { if (e.target !== img) shut(); });
      document.addEventListener('keydown', onKey);
      document.body.appendChild(box);
      close.focus();
    });
  }

  /* ---- Tombol cetak / simpan PDF di halaman CV ---- */
  var printBtn = document.getElementById('printBtn');
  if (printBtn) printBtn.addEventListener('click', function () { window.print(); });
})();
