/* Panel admin portofolio. Semua isi dari server dimasukkan lewat textContent/value — tidak pernah innerHTML. */
(function () {
  'use strict';
  var SKEMA = null, DATA = null, TAB = 'profil';
  var TABS = ['profil', 'keahlian', 'proyek', 'desain', 'pengalaman', 'prestasi', 'pendidikan', 'cadangan'];
  var $panel = document.getElementById('panel');
  var $status = document.getElementById('status');
  var $tabs = document.getElementById('tabs');
  var $toast = document.getElementById('toast');
  var openKeys = new Set();

  // ---------- util ----------
  function el(tag, attrs) {
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      var v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'text') n.textContent = v;
      else if (k === 'class') n.className = v;
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
      else if (k === 'value') n.value = v;
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (var i = 2; i < arguments.length; i++) {
      var c = arguments[i];
      if (c == null || c === false) continue;
      if (Array.isArray(c)) c.forEach(function (x) { if (x) n.appendChild(x); });
      else n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    }
    return n;
  }
  var toastTimer;
  function toast(msg, err) {
    $toast.textContent = msg;
    $toast.className = 'toast' + (err ? ' err' : '');
    $toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { $toast.hidden = true; }, err ? 6000 : 2500);
  }
  function api(method, path, body) {
    var opt = { method: method, headers: { 'X-Admin': '1' }, credentials: 'same-origin' };
    if (body !== undefined) { opt.headers['Content-Type'] = 'application/json'; opt.body = JSON.stringify(body); }
    return fetch('/api/admin/' + path, opt).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) throw new Error(j.galat || ('Gagal (' + r.status + ')'));
        return j;
      });
    });
  }
  function adaDirty() { return !!$panel.querySelector('.dirty'); }
  window.addEventListener('beforeunload', function (e) { if (adaDirty()) { e.preventDefault(); e.returnValue = ''; } });

  // ---------- muat ----------
  function muat() {
    return Promise.all([api('GET', 'skema'), api('GET', 'data'), api('GET', 'saya')]).then(function (r) {
      SKEMA = r[0]; DATA = r[1];
      document.getElementById('who').textContent = r[2].email;
      $status.textContent = '';
      $status.className = 'status';
      render();
    }).catch(function (e) {
      $status.textContent = e.message;
      $status.className = 'status err';
    });
  }
  function muatUlang() {
    return api('GET', 'data').then(function (d) { DATA = d; render(); });
  }

  // ---------- tab ----------
  function renderTabs() {
    $tabs.textContent = '';
    TABS.forEach(function (t) {
      $tabs.appendChild(el('button', {
        type: 'button', role: 'tab', 'aria-selected': String(t === TAB),
        text: t === 'cadangan' ? 'Cadangan' : SKEMA[t].label,
        onclick: function () {
          if (t === TAB) return;
          if (adaDirty()) { toast('Ada perubahan yang belum disimpan di tab ini.', true); return; }
          TAB = t; render();
          try { history.replaceState(null, '', '#' + t); } catch (e) {}
        },
      }));
    });
  }

  function render() {
    renderTabs();
    $panel.textContent = '';
    if (TAB === 'cadangan') return renderCadangan();
    if (TAB === 'profil') return renderProfil();
    renderDaftar(TAB);
  }

  // ---------- isian ----------
  function driveLink(id) { return id ? 'https://drive.google.com/file/d/' + id + '/view' : ''; }

  /** Membuat satu isian. Mengembalikan {node, baca()} */
  function isian(f, row, tandai) {
    var keys = f.bi ? [f.k + '_id', f.k + '_en'] : [f.k];
    var ctrls = {};
    function kontrol(key, label) {
      var val = row ? (row[key] == null ? '' : String(row[key])) : '';
      var id = 'f-' + Math.random().toString(36).slice(2, 9);
      var c;
      if (f.jenis === 'long' || f.jenis === 'list') c = el('textarea', { id: id, rows: f.jenis === 'list' ? 4 : 5 });
      else if (f.jenis === 'select') {
        c = el('select', { id: id }, f.pilihan.map(function (p) { return el('option', { value: p, text: p }); }));
        if (!val) val = f.pilihan[0];
      } else c = el('input', { type: 'text', id: id, autocomplete: 'off', spellcheck: f.jenis === 'text' || f.jenis === 'long' ? 'true' : 'false' });
      c.value = f.jenis === 'image' ? driveLink(val) : val;
      c.addEventListener('input', tandai);
      c.addEventListener('change', tandai);
      ctrls[key] = c;
      return { c: c, id: id, label: label };
    }
    var node;
    if (f.bi) {
      var a = kontrol(keys[0], 'ID'), b = kontrol(keys[1], 'EN');
      function cekEn() { b.c.classList.toggle('en-kosong', !!a.c.value.trim() && !b.c.value.trim()); }
      a.c.addEventListener('input', cekEn); b.c.addEventListener('input', cekEn); cekEn();
      node = el('div', { class: 'field' },
        el('span', { class: 'lbl', text: f.label }),
        el('div', { class: 'pair' },
          el('div', null, el('label', { class: 'lang', for: a.id, text: 'ID' }), a.c),
          el('div', null, el('label', { class: 'lang', for: b.id, text: 'EN' }), b.c)));
    } else {
      var k = kontrol(keys[0]);
      node = el('div', { class: 'field' }, el('label', { for: k.id, text: f.label }));
      if (f.jenis === 'image') {
        var hint = el('p', { class: 'hint', text: 'Tempel link share Google Drive. File harus di-share "Siapa saja yang memiliki link".' });
        var saved = row && row[f.k];
        var thumb = saved ? el('img', { class: 'thumb', src: '/img/' + encodeURIComponent(saved) + '?w=400', alt: 'Pratinjau' }) : null;
        if (thumb) thumb.addEventListener('error', function () { hint.textContent = 'Gambar tersimpan tidak bisa dimuat. Cek pengaturan share di Drive.'; hint.className = 'hint err'; });
        var cek = el('button', {
          type: 'button', class: 'btn sm', text: 'Cek gambar',
          onclick: function () {
            if (!k.c.value.trim()) { hint.textContent = 'Link masih kosong.'; hint.className = 'hint err'; return; }
            cek.disabled = true; hint.textContent = 'Mengecek…'; hint.className = 'hint';
            api('POST', 'cek-gambar', { link: k.c.value }).then(function (r) {
              hint.textContent = r.ok ? 'Gambar bisa diambil. Jangan lupa Simpan.' : r.pesan;
              hint.className = 'hint ' + (r.ok ? 'ok' : 'err');
            }).catch(function (e) { hint.textContent = e.message; hint.className = 'hint err'; })
              .then(function () { cek.disabled = false; });
          },
        });
        node.appendChild(el('div', { class: 'img-row' }, k.c, cek, thumb));
        node.appendChild(hint);
      } else {
        node.appendChild(k.c);
        if (f.jenis === 'tags') node.appendChild(el('p', { class: 'hint', text: 'Pisahkan dengan koma.' }));
      }
    }
    return {
      node: node,
      baca: function () { var o = {}; keys.forEach(function (key) { o[key] = ctrls[key].value; }); return o; },
    };
  }

  function judulBaris(tabel, row) {
    var s = SKEMA[tabel];
    var k = s.judulItem || s.isian[0].k;
    var f = s.isian.filter(function (x) { return x.k === k; })[0];
    var t = row ? (f && f.bi ? (row[k + '_id'] || row[k + '_en']) : row[k]) : '';
    return t || (row ? '(tanpa judul)' : 'Item baru');
  }
  function enBelumLengkap(tabel, row) {
    if (!row) return false;
    return SKEMA[tabel].isian.some(function (f) {
      return f.bi && String(row[f.k + '_id'] || '').trim() && !String(row[f.k + '_en'] || '').trim();
    });
  }

  // ---------- profil ----------
  function renderProfil() {
    var row = DATA.profil || {};
    var fields = [];
    var card = el('section', { class: 'item profil' });
    function tandai() { card.classList.add('dirty'); }
    var body = el('div', { class: 'body' });
    SKEMA.profil.isian.forEach(function (f) { var x = isian(f, row, tandai); fields.push(x); body.appendChild(x.node); });
    var simpan = el('button', {
      type: 'button', class: 'btn primary sm', text: 'Simpan profil',
      onclick: function () {
        var o = {}; fields.forEach(function (x) { Object.assign(o, x.baca()); });
        simpan.disabled = true;
        api('PUT', 'profil', o).then(function () { card.classList.remove('dirty'); toast('Profil disimpan'); return muatUlang(); })
          .catch(function (e) { toast(e.message, true); }).then(function () { simpan.disabled = false; });
      },
    });
    body.appendChild(el('div', { class: 'actions' }, simpan, el('span', { class: 'sp' }), el('a', { class: 'btn sm', href: '/', target: '_blank', rel: 'noopener', text: 'Lihat beranda ↗' })));
    card.appendChild(body);
    $panel.appendChild(el('div', { class: 'bar' }, el('h1', { text: 'Profil' }),
      el('p', { text: 'Isian kosong tidak ditampilkan di situs. Kolom EN yang kosong padahal ID terisi diberi garis kuning.' })));
    $panel.appendChild(card);
  }

  // ---------- daftar ----------
  function renderDaftar(tabel) {
    var rows = DATA[tabel] || [];
    var wadah = el('div');
    $panel.appendChild(el('div', { class: 'bar' },
      el('h1', { text: SKEMA[tabel].label }),
      el('button', { type: 'button', class: 'btn primary sm', text: '+ Tambah', onclick: function () { tambahBaru(tabel, wadah, null); } }),
      el('p', { text: tabel === 'proyek'
        ? 'Setiap proyek otomatis punya halaman studi kasus di /proyek/<alamat>. Langkah proses diatur di dalam tiap proyek.'
        : 'Urutan di sini = urutan di situs. Item tersembunyi tidak tampil di situs.' })));
    if (!rows.length) wadah.appendChild(el('p', { class: 'hint', text: 'Belum ada isi. Klik "+ Tambah".' }));
    rows.forEach(function (row) { wadah.appendChild(kartu(tabel, row, rows, null)); });
    $panel.appendChild(wadah);
  }

  function tambahBaru(tabel, wadah, indukId) {
    if (wadah.querySelector('.item.baru')) { toast('Selesaikan item baru yang sedang dibuat dulu.', true); return; }
    var hint = wadah.querySelector(':scope > p.hint'); if (hint) hint.remove();
    var k = kartu(tabel, null, [], indukId);
    wadah.insertBefore(k, wadah.firstChild);
    var first = k.querySelector('input, textarea, select'); if (first) first.focus();
  }

  function kartu(tabel, row, saudara, indukId) {
    var s = SKEMA[tabel];
    var key = tabel + ':' + (row ? row.id : 'baru');
    var det = el('details', { class: 'item' + (row ? '' : ' baru dirty') });
    if (!row || openKeys.has(key)) det.open = true;
    det.addEventListener('toggle', function () { if (det.open) openKeys.add(key); else openKeys.delete(key); });
    function tandai() { det.classList.add('dirty'); }

    var badges = [];
    if (row && !row.tampil) badges.push(el('span', { class: 'badge', text: 'tersembunyi' }));
    if (enBelumLengkap(tabel, row)) badges.push(el('span', { class: 'badge warn', text: 'EN belum lengkap' }));
    if (!row) badges.push(el('span', { class: 'badge warn', text: 'belum disimpan' }));
    det.appendChild(el('summary', null, el('span', { class: 't', text: judulBaris(tabel, row) }), badges));

    var body = el('div', { class: 'body' });
    var fields = s.isian.map(function (f) { var x = isian(f, row, tandai); body.appendChild(x.node); return x; });
    var tampil = el('input', { type: 'checkbox', onchange: tandai });
    tampil.checked = row ? !!row.tampil : true;
    body.appendChild(el('label', { class: 'check' }, tampil, 'Tampilkan di situs'));

    var simpan = el('button', { type: 'button', class: 'btn primary sm', text: row ? 'Simpan' : 'Simpan item baru' });
    simpan.addEventListener('click', function () {
      var o = { tampil: tampil.checked };
      fields.forEach(function (x) { Object.assign(o, x.baca()); });
      simpan.disabled = true;
      var p;
      if (row) p = api('PUT', tabel + '/' + row.id, o);
      else {
        if (indukId) o.induk_id = indukId;
        p = api('POST', tabel, o).then(function (r) { openKeys.add(tabel + ':' + r.id); });
      }
      p.then(function () {
        det.classList.remove('dirty');
        toast('Disimpan');
        if (!adaDirty()) return muatUlang();
      }).catch(function (e) { toast(e.message, true); }).then(function () { simpan.disabled = false; });
    });

    var act = el('div', { class: 'actions' }, simpan);
    if (row) {
      var idx = saudara.indexOf(row);
      var geser = function (arah) {
        return function () {
          if (adaDirty()) { toast('Simpan perubahan yang ada dulu sebelum mengubah urutan.', true); return; }
          var ids = saudara.map(function (r) { return r.id; });
          var j = idx + arah;
          var t = ids[idx]; ids[idx] = ids[j]; ids[j] = t;
          api('POST', tabel + '/urut', { ids: ids }).then(muatUlang).catch(function (e) { toast(e.message, true); });
        };
      };
      act.appendChild(el('button', { type: 'button', class: 'btn sm', text: '↑', title: 'Naikkan', 'aria-label': 'Naikkan', disabled: idx <= 0, onclick: geser(-1) }));
      act.appendChild(el('button', { type: 'button', class: 'btn sm', text: '↓', title: 'Turunkan', 'aria-label': 'Turunkan', disabled: idx >= saudara.length - 1, onclick: geser(1) }));
      if (tabel === 'proyek') act.appendChild(el('a', { class: 'btn sm', href: '/proyek/' + row.slug, target: '_blank', rel: 'noopener', text: 'Lihat ↗' }));
      act.appendChild(el('span', { class: 'sp' }));
      var yakinTimer;
      var hapusBtn = el('button', { type: 'button', class: 'btn sm danger', text: 'Hapus' });
      hapusBtn.addEventListener('click', function () {
        if (!hapusBtn.classList.contains('yakin')) {
          hapusBtn.classList.add('yakin');
          hapusBtn.textContent = tabel === 'proyek' ? 'Yakin? Langkahnya ikut terhapus' : 'Klik lagi untuk hapus';
          yakinTimer = setTimeout(function () { hapusBtn.classList.remove('yakin'); hapusBtn.textContent = 'Hapus'; }, 4000);
          return;
        }
        clearTimeout(yakinTimer);
        if (adaDirty() && !det.classList.contains('dirty')) { toast('Simpan perubahan lain dulu.', true); return; }
        api('DELETE', tabel + '/' + row.id).then(function () {
          det.classList.remove('dirty'); toast('Dihapus'); return muatUlang();
        }).catch(function (e) { toast(e.message, true); });
      });
      act.appendChild(hapusBtn);
    } else {
      act.appendChild(el('button', { type: 'button', class: 'btn sm', text: 'Batal', onclick: function () { det.remove(); } }));
    }
    body.appendChild(act);

    // anak (langkah proses) di dalam proyek
    if (row) {
      Object.keys(SKEMA).forEach(function (t) {
        if (SKEMA[t].induk !== tabel) return;
        var anak = (DATA[t] || []).filter(function (r) { return r.induk_id === row.id; });
        var wadah = el('div');
        anak.forEach(function (r) { wadah.appendChild(kartu(t, r, anak, row.id)); });
        body.appendChild(el('div', { class: 'sub' },
          el('div', { class: 'bar' }, el('h3', { text: SKEMA[t].label }),
            el('button', { type: 'button', class: 'btn sm', text: '+ Tambah langkah', onclick: function () { tambahBaru(t, wadah, row.id); } })),
          wadah));
      });
    }
    det.appendChild(body);
    return det;
  }

  // ---------- cadangan ----------
  function renderCadangan() {
    var info = el('p', { class: 'hint' });
    var file = el('input', { type: 'file', accept: 'application/json,.json', id: 'impor-file' });
    var imporBtn = el('button', { type: 'button', class: 'btn danger sm', text: 'Ganti semua isi dengan file ini', disabled: true });
    var isiFile = null, yakinTimer;
    file.addEventListener('change', function () {
      isiFile = null; imporBtn.disabled = true; info.className = 'hint'; info.textContent = '';
      var f = file.files[0]; if (!f) return;
      f.text().then(function (t) {
        var j = JSON.parse(t);
        if (j.format !== 'portofolio-cadangan') throw new Error('Bukan file cadangan portofolio.');
        isiFile = j;
        var d = j.data || {};
        info.textContent = 'Cadangan ' + (j.dibuat || '') + ': ' + (d.proyek || []).length + ' proyek, ' + (d.pengalaman || []).length + ' pengalaman, ' + (d.prestasi || []).length + ' prestasi, ' + (d.desain || []).length + ' desain.';
        imporBtn.disabled = false;
      }).catch(function (e) { info.textContent = e.message; info.className = 'hint err'; });
    });
    imporBtn.addEventListener('click', function () {
      if (!isiFile) return;
      if (!imporBtn.classList.contains('yakin')) {
        imporBtn.classList.add('yakin'); imporBtn.textContent = 'Yakin? Semua isi sekarang akan diganti';
        yakinTimer = setTimeout(function () { imporBtn.classList.remove('yakin'); imporBtn.textContent = 'Ganti semua isi dengan file ini'; }, 5000);
        return;
      }
      clearTimeout(yakinTimer);
      imporBtn.disabled = true;
      api('POST', 'impor', isiFile).then(function () { toast('Isi dipulihkan dari cadangan'); return muatUlang(); })
        .catch(function (e) { toast(e.message, true); imporBtn.disabled = false; });
    });
    var ekspor = el('button', {
      type: 'button', class: 'btn primary sm', text: 'Unduh cadangan (JSON)',
      onclick: function () {
        api('GET', 'ekspor').then(function (j) {
          var blob = new Blob([JSON.stringify(j, null, 2)], { type: 'application/json' });
          var a = el('a', { href: URL.createObjectURL(blob), download: 'portofolio-cadangan-' + new Date().toISOString().slice(0, 10) + '.json' });
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
        }).catch(function (e) { toast(e.message, true); });
      },
    });
    $panel.appendChild(el('div', { class: 'bar' }, el('h1', { text: 'Cadangan' })));
    $panel.appendChild(el('div', { class: 'backup' },
      el('div', { class: 'card' }, el('h3', { text: 'Ekspor' }),
        el('p', { text: 'Unduh semua isi portofolio sebagai satu file JSON. Simpan di Google Drive sebagai cadangan.' }), el('div', { class: 'actions' }, ekspor)),
      el('div', { class: 'card' }, el('h3', { text: 'Impor' }),
        el('p', { text: 'Memulihkan isi dari file cadangan. Semua isi yang sekarang akan diganti.' }),
        el('label', { for: 'impor-file', class: 'hint', text: 'Pilih file cadangan (.json)' }), file, info, el('div', { class: 'actions' }, imporBtn))));
  }

  // ---------- mulai ----------
  var h = (location.hash || '').slice(1);
  if (TABS.indexOf(h) >= 0) TAB = h;
  muat();
})();
