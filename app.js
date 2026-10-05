const STORAGE_KEY = 'shinky_real_inventory_v5';
const DEFAULT_STATE = {
  pin: '',
  items: [
    {
      id: 'i1791226248684',
      name: 'STOCK 2',
      game: 'Free Fire',
      type: 'Jual',
      price: 200000,
      status: 'READY',
      spec: 'p',
      imgs: []
    },
    {
      id: 'i1791226214784',
      name: 'STOCK 1',
      game: 'Free Fire',
      type: 'Jual',
      price: 150000,
      status: 'READY',
      spec: 'p',
      imgs: []
    }
  ]
};

let state = loadState();
let admin = false;
let editId = null;
let curImgs = [];
let timer = null;
const MAXIMG = 6;
let pinMode = 'unlock';

const $ = (id) => document.getElementById(id);
const rp = (n) => 'Rp ' + Number(n || 0).toLocaleString('id-ID');
const WA = '6285641260260';

const days = (v) => {
  if (v <= 0) return 0;
  if (v <= 100000) return 7;
  if (v <= 300000) return 16;
  if (v <= 500000) return 23;
  return 31;
};

function el(tag, className, text) {
  const e = document.createElement(tag);
  if (className) e.className = className;
  if (text !== undefined && text !== null) e.textContent = text;
  return e;
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.items)) {
        return {
          pin: typeof parsed.pin === 'string' ? parsed.pin : '',
          items: parsed.items
        };
      }
    }
  } catch (err) {
    console.warn('Tidak bisa membaca localStorage:', err);
  }
  return JSON.parse(JSON.stringify(DEFAULT_STATE));
}

function save() {
  clearTimeout(timer);
  timer = setTimeout(() => {
    try {
      const payload = JSON.stringify(state);
      if (payload.length > 4_500_000) {
        alert('Data terlalu besar untuk penyimpanan browser. Kurangi jumlah atau ukuran gambar.');
        return;
      }
      localStorage.setItem(STORAGE_KEY, payload);
    } catch (err) {
      alert('Gagal menyimpan data di browser. Coba hapus beberapa gambar atau data lama.');
      console.error(err);
    }
  }, 100);
}

function setAdmin(on) {
  admin = !!on;
  try { sessionStorage.setItem('sr_admin', admin ? '1' : '0'); } catch (err) {}
  $('toolbar').classList.toggle('hidden', !admin);
  $('admin-btn').classList.toggle('hidden', admin);
  render();

  if (admin && !state.pin) {
    setTimeout(() => {
      if (confirm('Mode admin aktif. Buat PIN admin sekarang?')) {
        openPin('set');
      }
    }, 120);
  }
}

function hashPin(value) {
  const raw = 'shinky:' + value;
  if (window.crypto && crypto.subtle && window.TextEncoder) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw)).then((buf) =>
      Array.from(new Uint8Array(buf)).map((x) => x.toString(16).padStart(2, '0')).join('')
    );
  }
  return Promise.resolve(btoa(unescape(encodeURIComponent(raw))));
}

function openPin(mode) {
  pinMode = mode;
  $('pin-in').value = '';
  $('pin-err').textContent = '';
  $('pin-title').textContent = mode === 'unlock' ? 'Masukkan PIN Admin' : 'Atur PIN Admin';
  $('pin-hint').textContent = mode === 'unlock' ? '' : 'Minimal 4 karakter. Kosongkan lalu OK untuk menghapus PIN.';
  $('pinbox').classList.remove('hidden');
  setTimeout(() => $('pin-in').focus(), 50);
}

function tryAdmin() {
  if (state.pin) {
    openPin('unlock');
  } else {
    setAdmin(true);
  }
}

$('pin-cancel').onclick = () => $('pinbox').classList.add('hidden');

$('pin-ok').onclick = () => {
  const v = $('pin-in').value;

  if (pinMode === 'unlock') {
    hashPin(v).then((h) => {
      if (h === state.pin) {
        $('pinbox').classList.add('hidden');
        setAdmin(true);
      } else {
        $('pin-err').textContent = 'PIN salah.';
      }
    });
    return;
  }

  if (!v) {
    delete state.pin;
    $('pinbox').classList.add('hidden');
    save();
    return;
  }

  if (v.length < 4) {
    $('pin-err').textContent = 'PIN minimal 4 karakter.';
    return;
  }

  hashPin(v).then((h) => {
    state.pin = h;
    $('pinbox').classList.add('hidden');
    save();
  });
};

$('pin-in').addEventListener('keydown', (e) => {
  if (e.key === 'Enter') $('pin-ok').click();
});

$('admin-btn').onclick = tryAdmin;
$('exit-btn').onclick = () => setAdmin(false);
$('pin-set').onclick = () => {
  if (admin) openPin('set');
};
$('add-btn').onclick = () => openModal(null);
$('reset-btn').onclick = () => {
  if (confirm('Hapus semua perubahan lokal dan kembali ke stok bawaan?')) {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
};

function render() {
  const q = $('q').value.toLowerCase();
  const game = $('fg').value;
  const status = $('fs').value;

  const list = state.items.filter((item) => {
    const matchText = !q || (item.name + ' ' + item.spec).toLowerCase().includes(q);
    const matchGame = !game || item.game === game;
    const matchStatus = !status || item.status === status;
    return matchText && matchGame && matchStatus;
  });

  $('count').textContent = `${list.length} / ${state.items.length} STOK TERDETEKSI`;
  $('empty').classList.toggle('hidden', list.length > 0);

  const grid = $('grid');
  grid.innerHTML = '';

  list.forEach((item) => {
    const card = el('article', 'card');

    const media = el('div', 'media');
    if (item.imgs && item.imgs.length) {
      media.classList.add('has');
      const img = el('img');
      img.src = item.imgs[0];
      img.alt = 'Spesifikasi ' + item.name;
      img.loading = 'lazy';
      media.appendChild(img);
      if (item.imgs.length > 1) {
        media.appendChild(el('span', 'n', item.imgs.length + ' FOTO'));
      }
      media.onclick = () => openLightbox(item.imgs);
    } else {
      media.appendChild(el('span', 'dot'));
    }
    media.appendChild(el('span', 'badge ' + item.status, item.status));

    const body = el('div', 'cbody');
    const top = el('div', 'ctop');
    top.appendChild(el('span', 'ty mono', (item.type || '').toUpperCase()));
    top.appendChild(el('span', 'gtag', item.game));

    const prices = el('div', 'prices');
    const p1 = el('div');
    p1.appendChild(el('small', '', 'Harga'));
    p1.appendChild(el('b', '', rp(item.price)));

    const p2 = el('div', 'dp');
    p2.appendChild(el('small', '', 'DP 30%'));
    p2.appendChild(el('b', '', rp(Math.ceil(item.price * 0.3))));

    prices.appendChild(p1);
    prices.appendChild(p2);

    const acts = el('div', 'acts');
    const calcBtn = el('button', 'btn', 'HITUNG DP');
    calcBtn.onclick = () => {
      $('calc').value = item.price;
      calc();
      document.getElementById('kalkulator').scrollIntoView({ behavior: 'smooth' });
    };

    let buyBtn;
    if (item.status !== 'TERJUAL') {
      buyBtn = el('a', 'btn o', 'BELI VIA WA');
      buyBtn.target = '_blank';
      buyBtn.rel = 'noopener';
      buyBtn.href = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(
        'Halo Admin SHINKY REAL, saya tertarik: ' + item.name + ' (' + item.game + ') ' + rp(item.price) + '. Apakah masih tersedia?'
      );
    } else {
      buyBtn = el('span', 'btn off', 'TERJUAL');
    }

    acts.appendChild(calcBtn);
    acts.appendChild(buyBtn);

    body.appendChild(top);
    body.appendChild(el('h3', '', item.name));
    body.appendChild(el('p', 'spec', item.spec));
    body.appendChild(prices);
    body.appendChild(el('p', 'due', 'Batas pelunasan: ' + days(item.price) + ' hari setelah DP.'));
    body.appendChild(acts);

    if (admin) {
      const row = el('div', 'arow');
      const editBtn = el('button', 'btn', 'EDIT');
      editBtn.onclick = () => openModal(item.id);

      const delBtn = el('button', 'btn r', 'HAPUS');
      delBtn.onclick = () => {
        if (delBtn.dataset.sure) {
          state.items = state.items.filter((x) => x.id !== item.id);
          save();
          render();
        } else {
          delBtn.dataset.sure = '1';
          delBtn.textContent = 'YAKIN?';
          setTimeout(() => {
            delete delBtn.dataset.sure;
            delBtn.textContent = 'HAPUS';
          }, 3000);
        }
      };

      row.appendChild(editBtn);
      row.appendChild(delBtn);
      body.appendChild(row);
    }

    card.appendChild(media);
    card.appendChild(body);
    grid.appendChild(card);
  });
}

function ensureOption(select, val) {
  const exists = Array.from(select.options).some((o) => o.value === val || o.text === val);
  if (val && !exists) {
    const option = document.createElement('option');
    option.textContent = val;
    select.appendChild(option);
  }
}

function openModal(id) {
  editId = id;
  const item = state.items.find((x) => x.id === id) || {
    name: '',
    game: 'Free Fire',
    type: 'Jual',
    price: '',
    status: 'READY',
    spec: '',
    imgs: []
  };

  curImgs = (item.imgs || []).slice();
  $('f-img').value = '';
  renderPrev();
  $('m-title').textContent = id ? 'Edit Stok' : 'Tambah Stok';
  $('m-err').textContent = '';

  ensureOption($('f-game'), item.game);
  ensureOption($('f-type'), item.type);

  $('f-name').value = item.name;
  $('f-game').value = item.game;
  $('f-type').value = item.type;
  $('f-price').value = item.price;
  $('f-status').value = item.status;
  $('f-spec').value = item.spec;
  $('modal').classList.remove('hidden');
}

function renderPrev() {
  const box = $('f-prev');
  box.innerHTML = '';
  curImgs.forEach((url, idx) => {
    const t = el('div', 'thumb');
    const img = el('img');
    img.src = url;
    const del = el('button', '', '×');
    del.type = 'button';
    del.title = 'Hapus gambar';
    del.onclick = () => {
      curImgs.splice(idx, 1);
      renderPrev();
    };
    t.appendChild(img);
    t.appendChild(del);
    box.appendChild(t);
  });
  $('f-info').textContent = curImgs.length + ' / ' + MAXIMG + ' gambar';
}

function compress(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Read failed'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Image failed'));
      img.onload = () => {
        const maxSize = 1600;
        const ratio = Math.min(1, maxSize / Math.max(img.naturalWidth, img.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.naturalWidth * ratio);
        canvas.height = Math.round(img.naturalHeight * ratio);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.78));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

$('f-pick').addEventListener('click', (e) => {
  const input = $('f-img');
  if (input.showPicker) {
    try {
      e.preventDefault();
      input.showPicker();
      return;
    } catch (err) {}
  }
});

$('f-img').onchange = function () {
  const files = Array.from(this.files || []);
  let room = MAXIMG - curImgs.length;
  $('m-err').textContent = '';

  if (files.length > room) {
    $('m-err').textContent = 'Maksimal ' + MAXIMG + ' gambar per stok.';
    files.splice(0, Math.max(room, 0));
  }

  const jobs = files
    .filter((f) => /^image\//.test(f.type) || /\.(jpe?g|png|webp|heic)$/i.test(f.name || ''))
    .map((f) => compress(f).catch(() => null));

  Promise.all(jobs).then((out) => {
    out.forEach((u) => {
      if (u) curImgs.push(u);
    });

    if (out.some((u) => !u)) {
      $('m-err').textContent = 'Sebagian file gagal dibaca.';
    }

    renderPrev();
    $('f-img').value = '';
  });
};

$('m-cancel').onclick = () => $('modal').classList.add('hidden');

$('m-save').onclick = () => {
  const name = $('f-name').value.trim();
  const price = parseInt($('f-price').value, 10);

  if (!name) {
    $('m-err').textContent = 'Nama akun wajib diisi.';
    return;
  }
  if (Number.isNaN(price) || price < 0) {
    $('m-err').textContent = 'Harga tidak valid.';
    return;
  }

  const obj = {
    id: editId || ('i' + Date.now()),
    name,
    game: $('f-game').value,
    type: $('f-type').value,
    price,
    status: $('f-status').value,
    spec: $('f-spec').value.trim(),
    imgs: curImgs.slice()
  };

  if (editId) {
    state.items = state.items.map((x) => (x.id === editId ? obj : x));
  } else {
    state.items.unshift(obj);
  }

  $('modal').classList.add('hidden');
  save();
  render();
};

function calc() {
  const v = parseInt($('calc').value, 10) || 0;
  const d = days(v);
  const dp = Math.ceil(v * 0.3);

  $('c-total').textContent = rp(v);
  $('c-dp').textContent = rp(dp);
  $('c-days').textContent = d ? d + ' HARI' : '--';
  $('c-rest').textContent = d
    ? 'Sisa pembayaran ' + rp(v - dp) + ' wajib dilunasi maksimal ' + d + ' hari setelah DP masuk.'
    : '';
}

['q', 'fg', 'fs'].forEach((id) => {
  $(id).addEventListener('input', render);
});
$('calc').addEventListener('input', calc);

function openLightbox(list, start = 0) {
  const lb = $('lightbox');
  lb.innerHTML = '';

  let idx = 0;
  const stateZoom = { s: 1, x: 0, y: 0, w: 1, h: 1 };
  const pointers = {};
  let down = null;
  let multi = false;
  let lastTap = 0;

  const stage = el('div', 'zs');
  const img = el('img');
  img.draggable = false;
  stage.appendChild(img);

  const bar = el('div', 'zbar');
  const g1 = el('div', 'grp');
  const g2 = el('div', 'grp');
  const lab = el('span', 'zl', '×1');
  const cnt = el('span', 'zl', '');

  const button = (label, fn, title, extraClass = '') => {
    const btn = el('button', 'zb' + (extraClass ? ' ' + extraClass : ''), label);
    btn.type = 'button';
    btn.title = title;
    btn.onclick = fn;
    return btn;
  };

  const W = () => stage.clientWidth;
  const H = () => stage.clientHeight;

  const apply = () => {
    const cw = stateZoom.w * stateZoom.s;
    const ch = stateZoom.h * stateZoom.s;

    stateZoom.x = cw <= W() ? (W() - cw) / 2 : Math.min(0, Math.max(W() - cw, stateZoom.x));
    stateZoom.y = ch <= H() ? (H() - ch) / 2 : Math.min(0, Math.max(H() - ch, stateZoom.y));

    img.style.transform = 'translate(' + stateZoom.x + 'px,' + stateZoom.y + 'px) scale(' + stateZoom.s + ')';
    lab.textContent = '×' + (stateZoom.s < 10 ? (Math.round(stateZoom.s * 10) / 10) : Math.round(stateZoom.s));
  };

  const zoomAt = (ns, cx, cy) => {
    ns = Math.max(1, Math.min(100, ns));
    const k = ns / stateZoom.s;
    stateZoom.x = cx - (cx - stateZoom.x) * k;
    stateZoom.y = cy - (cy - stateZoom.y) * k;
    stateZoom.s = ns;
    apply();
  };

  const fit = () => {
    const nw = img.naturalWidth || 1;
    const nh = img.naturalHeight || 1;
    const k = Math.min(W() / nw, H() / nh);
    stateZoom.w = nw * k;
    stateZoom.h = nh * k;
    img.style.width = stateZoom.w + 'px';
    img.style.height = stateZoom.h + 'px';
    stateZoom.s = 1;
    apply();
  };

  const show = (i) => {
    idx = (i + list.length) % list.length;
    img.onload = fit;
    img.src = list[idx];
    cnt.textContent = list.length > 1 ? (idx + 1) + '/' + list.length : '';
  };

  const close = () => {
    document.removeEventListener('keydown', keyHandler);
    window.removeEventListener('resize', fit);
    lb.classList.add('hidden');
    lb.innerHTML = '';
  };

  const keyHandler = (e) => {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === '+' || e.key === '=') zoomAt(stateZoom.s * 2, W() / 2, H() / 2);
    else if (e.key === '-') zoomAt(stateZoom.s / 2, W() / 2, H() / 2);
  };

  const pointList = () => Object.keys(pointers).map((k) => pointers[k]);
  const getDistance = (a, b) => Math.max(1, Math.hypot(a.x - b.x, a.y - b.y));
  const getMid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

  stage.onpointerdown = (e) => {
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
    pointers[e.pointerId] = { x: e.clientX, y: e.clientY };
    if (pointList().length === 1) {
      multi = false;
      down = { x: e.clientX, y: e.clientY, t: Date.now() };
    } else {
      multi = true;
    }
    stage.classList.add('g');
  };

  stage.onpointermove = (e) => {
    const p = pointers[e.pointerId];
    if (!p) return;
    const points = pointList();
    const previousMid = points.length > 1 ? getMid(points[0], points[1]) : null;
    const ox = p.x;
    const oy = p.y;
    p.x = e.clientX;
    p.y = e.clientY;

    if (previousMid) {
      const nextMid = getMid(pointList()[0], pointList()[1]);
      const currentDistance = getDistance(pointList()[0], pointList()[1]);
      const previousDistance = getDistance(points[0], points[1]);
      stateZoom.x += nextMid.x - previousMid.x;
      stateZoom.y += nextMid.y - previousMid.y;
      zoomAt(stateZoom.s * (currentDistance / previousDistance), nextMid.x, nextMid.y);
    } else {
      stateZoom.x += p.x - ox;
      stateZoom.y += p.y - oy;
      apply();
    }
  };

  stage.onpointerup = (e) => {
    if (!pointers[e.pointerId]) return;
    delete pointers[e.pointerId];
    if (pointList().length) return;

    stage.classList.remove('g');
    const now = Date.now();
    if (!multi && down && Math.hypot(e.clientX - down.x, e.clientY - down.y) < 10 && now - down.t < 350) {
      if (now - lastTap < 350) {
        lastTap = 0;
        zoomAt(stateZoom.s > 1.01 ? 1 : 5, e.clientX, e.clientY);
      } else {
        lastTap = now;
      }
    }
  };

  stage.onpointercancel = stage.onpointerup;
  stage.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomAt(stateZoom.s * Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.0025)), e.clientX, e.clientY);
  }, { passive: false });

  g1.appendChild(button('✕', close, 'Tutup'));
  g1.appendChild(cnt);
  g2.appendChild(button('−', () => zoomAt(stateZoom.s / 2, W() / 2, H() / 2), 'Zoom out'));
  g2.appendChild(lab);
  g2.appendChild(button('+', () => zoomAt(stateZoom.s * 2, W() / 2, H() / 2), 'Zoom in'));
  g2.appendChild(button('⟲', fit, 'Reset'));

  bar.appendChild(g1);
  bar.appendChild(g2);
  lb.appendChild(stage);
  lb.appendChild(bar);

  if (list.length > 1) {
    lb.appendChild(button('‹', () => show(idx - 1), 'Sebelumnya', 'znav l'));
    lb.appendChild(button('›', () => show(idx + 1), 'Berikutnya', 'znav r'));
  }

  lb.appendChild(el('div', 'zhint', 'Geser · cubit · scroll · ketuk 2× · maks ×100'));
  lb.classList.remove('hidden');

  document.addEventListener('keydown', keyHandler);
  window.addEventListener('resize', fit);
  show(start || 0);
}

calc();
render();

try {
  const again = sessionStorage.getItem('sr_admin') === '1';
  if (again && state.pin) setAdmin(true);
} catch (err) {}

if (location.hash === '#admin') tryAdmin();
