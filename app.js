'use strict';
(function () {
  // 바탕화면 프로그램(WebView2) 안에서 열리면 HOST 로 창 제어·파일 저장을 주고받는다.
  const HOST = (window.chrome && window.chrome.webview) || null;
  const KEY = 'manneung-diary-v1';
  const VERSION = '1.3.3';
  const SVGNS = 'http://www.w3.org/2000/svg';
  const WD = ['일', '월', '화', '수', '목', '금', '토'];

  const ICONS = {
    logo: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M4 9.5h16M9 3v3M15 3v3M8.5 13.5h2M13.5 13.5h2M8.5 16.8h2"/>',
    home: '<path d="M3.5 10.5 12 3.5l8.5 7"/><path d="M5.5 9v11h13V9"/><path d="M10 20v-5.5h4V20"/>',
    day: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    month: '<rect x="3.5" y="5" width="17" height="15.5" rx="3"/><path d="M3.5 10h17M8.5 3v4M15.5 3v4"/>',
    year: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.8"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.8"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.8"/>',
    habit: '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><path d="m8.5 12.2 2.4 2.4 4.8-5.2"/>',
    memo: '<path d="M6 3.5h8.5l4 4V20a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z"/><path d="M14 3.5V8h4.5M9 12.5h6M9 16h4"/>',
    left: '<path d="m14.5 18-6-6 6-6"/>',
    right: '<path d="m9.5 18 6-6-6-6"/>',
    down: '<path d="m7 10 5 5 5-5"/>',
    up: '<path d="m7 14 5-5 5 5"/>',
    gear: '<path d="M4 7h9M17 7h3M4 12h3M11 12h9M4 17h11M19 17h1"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="17" r="2"/>',
    pin: '<path d="M12 16.5V21"/><path d="M8.5 3.5h7l-1 5.5 3 4H6.5l3-4z"/>',
    minus: '<path d="M6 12h12"/>',
    x: '<path d="M17 7 7 17M7 7l10 10"/>',
    plus: '<path d="M12 5.5v13M5.5 12h13"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2.2"/><path d="M15.5 8.5V6.2a1.7 1.7 0 0 0-1.7-1.7H6.2a1.7 1.7 0 0 0-1.7 1.7v7.6a1.7 1.7 0 0 0 1.7 1.7h2.3"/>',
    trash: '<path d="M4.5 7h15M10 11v6M14 11v6M6.5 7l1 13h9l1-13M9.5 7V4.5h5V7"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    eraser: '<path d="m8 20-4.3-4.3a1.5 1.5 0 0 1 0-2.1L13.5 3.8a1.5 1.5 0 0 1 2.1 0l4.6 4.6a1.5 1.5 0 0 1 0 2.1L10.7 20z"/><path d="M20 20H8M8.8 8.6l6.6 6.6"/>',
    open: '<path d="M8 16 16 8M9.5 8H16v6.5"/>',
    repeat: '<path d="M16.5 3.5 19.5 6.5 16.5 9.5"/><path d="M4.5 11.5V10a3.5 3.5 0 0 1 3.5-3.5h11.5M7.5 20.5l-3-3 3-3"/><path d="M19.5 12.5V14a3.5 3.5 0 0 1-3.5 3.5H4.5"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    wand: '<path d="m4 20 11-11M14 4.5V2.5M14 11.5v-2M18.5 7h2M9.5 7h-2M17.2 3.8l1.4-1.4M17.2 10.2l1.4 1.4"/>',
    download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',
    upload: '<path d="M12 15.5v-11M7.5 9 12 4.5 16.5 9M5 19.5h14"/>',
    folder: '<path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    star: '<path d="m12 4 2.4 5 5.4.7-4 3.8 1 5.4L12 16.3 7.2 18.9l1-5.4-4-3.8 5.4-.7z"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8.5 10.5V7.8a3.5 3.5 0 0 1 7 0v2.7"/>',
    win: '<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><path d="M3.5 9h17M7 6.8h.01M9.5 6.8h.01"/>',
    sync: '<path d="M19.5 8.5A7.8 7.8 0 0 0 5.2 7.2M4.5 15.5a7.8 7.8 0 0 0 14.3 1.3"/><path d="M19.8 3.8v4.9h-4.9M4.2 20.2v-4.9h4.9"/>',
    book: '<path d="M5.5 4.5h11a2 2 0 0 1 2 2v13h-11a2 2 0 0 1-2-2z"/><path d="M5.5 17.5a2 2 0 0 1 2-2h11M9 8.5h6"/>'
  };
  const CHECK = '<path d="m5 12.5 4.5 4.5L19 7.5"/>';

  const DEFAULT_CATS = [
    { id: 'c1', name: '업무', color: '#4f7df3' },
    { id: 'c2', name: '회의', color: '#8b5cf6' },
    { id: 'c3', name: '개인', color: '#10b981' },
    { id: 'c4', name: '가족', color: '#f59e0b' },
    { id: 'c5', name: '건강', color: '#14b8a6' },
    { id: 'c6', name: '공부', color: '#ec4899' },
    { id: 'c7', name: '이동·휴식', color: '#94a3b8' },
    { id: 'c8', name: '기념일', color: '#ef4444' }
  ];
  const PALETTE = ['#4f7df3', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899', '#f43f5e', '#ef4444', '#f97316',
    '#f59e0b', '#eab308', '#84cc16', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#94a3b8'];
  const TABS = [['home', '오늘', 'home'], ['day', '일간', 'day'], ['journal', '일기', 'book'], ['month', '월간', 'month'],
    ['year', '연간', 'year'], ['habit', '습관', 'habit'], ['memo', '메모', 'memo']];
  const YEAR_DEFAULT_COLOR = '#fbbf24';
  const FOCUS = ['H', 'M', 'L'];
  const FOCUS_NAME = { H: '높음', M: '보통', L: '낮음' };

  // ---------- 작은 도구 ----------
  const $ = (s, el) => (el || document).querySelector(s);
  const pad = n => String(n).padStart(2, '0');
  const range = n => Array.from({ length: n }, (_, i) => i);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const keyOf = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = k => { const p = k.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2] || 1); };
  const todayKey = () => keyOf(new Date());
  const addDays = (k, n) => { const d = parse(k); d.setDate(d.getDate() + n); return keyOf(d); };
  const daysIn = (y, m0) => new Date(y, m0 + 1, 0).getDate();
  const addMonths = (k, n) => {
    const d = parse(k), day = d.getDate();
    d.setDate(1); d.setMonth(d.getMonth() + n);
    d.setDate(Math.min(day, daysIn(d.getFullYear(), d.getMonth())));
    return keyOf(d);
  };
  const ym = k => k.slice(0, 7);
  const shortLabel = k => { const d = parse(k); return `${d.getMonth() + 1}/${d.getDate()}(${WD[d.getDay()]})`; };
  const fmtMin = m => m >= 60 ? `${Math.floor(m / 60)}시간${m % 60 ? ' ' + (m % 60) + '분' : ''}` : `${m}분`;
  const isWide = () => matchMedia('(min-width: 900px)').matches;
  const fmtStamp = ts => {
    const d = new Date(ts), now = new Date();
    return `${d.getFullYear() !== now.getFullYear() ? d.getFullYear() + '년 ' : ''}${d.getMonth() + 1}월 ${d.getDate()}일 ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  function h(sel, props, ...kids) {
    const parts = sel.split(/(?=[.#])/);
    const el = document.createElement(parts[0] || 'div');
    for (let i = 1; i < parts.length; i++) {
      const p = parts[i];
      if (p[0] === '.') el.classList.add(p.slice(1)); else el.id = p.slice(1);
    }
    if (props != null && (props instanceof Node || Array.isArray(props) || typeof props !== 'object')) { kids.unshift(props); props = null; }
    if (props) for (const k in props) {
      const v = props[k];
      if (v == null || v === false) continue;
      if (k === 'style') {
        if (typeof v === 'string') el.style.cssText = v;
        else for (const s in v) { if (v[s] == null) continue; if (s.startsWith('--')) el.style.setProperty(s, v[s]); else el.style[s] = v[s]; }
      } else if (k === 'dataset') Object.assign(el.dataset, v);
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else if (k === 'value' || k === 'checked' || k === 'disabled') el[k] = v;
      else if (k === 'cls') el.className += ' ' + v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    append(el, kids);
    return el;
  }
  function append(el, kids) {
    for (const k of kids) {
      if (k == null || k === false || k === true) continue;
      if (Array.isArray(k)) append(el, k);
      else el.append(k instanceof Node ? k : document.createTextNode(String(k)));
    }
  }
  function svgEl(inner, vb, cls) {
    const s = document.createElementNS(SVGNS, 'svg');
    s.setAttribute('viewBox', vb || '0 0 24 24');
    if (cls) s.setAttribute('class', cls);
    s.innerHTML = inner;
    return s;
  }
  const icon = name => svgEl(ICONS[name] || '', null, 'i');
  function autosize(el) {
    el.style.height = 'auto';
    el.style.height = (el.scrollHeight + 2) + 'px';
  }

  // ---------- 저장 ----------
  function fresh() {
    return {
      v: 1, savedAt: 0,
      settings: { startHour: 3, weekStart: 1, startTab: 'day', brush: 'c1', cats: DEFAULT_CATS.map(c => Object.assign({}, c)) },
      days: {}, mItems: {}, mNotes: {}, yItems: [], yNotes: {}, habits: [], checks: {}, memos: [], journal: {}
    };
  }
  function welcomeMemo() {
    return {
      id: 'welcome', title: '만능 다이어리 사용법', c: 'c2', pin: true, u: Date.now(),
      body: '• 일간: 시간 칸 왼쪽에 계획(PLAN)을 적고 끝나면 체크합니다. 오른쪽 6칸(10분씩)은 위에서 색을 골라 칠해 실적(DO)을 남깁니다.\n' +
        '• ‘전날 복사’로 어제 계획을 오늘로 가져올 수 있습니다.\n' +
        '• 월간·연간 칸을 누르면 일정과 기념일을 적습니다. 기념일은 ‘매년’을 켜면 해마다 표시됩니다.\n' +
        '• 일기: 기분·날씨·한 일을 누르고, 한 줄과 본문, 감사한 일 3가지를 적습니다. 기분 달력과 지난 해 오늘도 볼 수 있습니다.\n' +
        '• 오른쪽 위 설정에서 색 분류 이름과 색을 바꿀 수 있습니다.\n' +
        '• ← → 키로 날짜 이동, T 키는 오늘로 돌아옵니다.'
    };
  }
  function normalize(s) {
    const f = fresh();
    if (!s || typeof s !== 'object' || !s.days) { f.memos.push(welcomeMemo()); return f; }
    for (const k in f) if (s[k] == null) s[k] = f[k];
    s.settings = Object.assign({}, f.settings, s.settings || {});
    if (!Array.isArray(s.settings.cats) || !s.settings.cats.length) s.settings.cats = f.settings.cats;
    return s;
  }
  function load() {
    let local = null;
    try { local = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { local = null; }
    const file = window.__HOST_DATA__ || null;
    let s = local;
    if (file && (!local || (file.savedAt || 0) > (local.savedAt || 0))) s = file;
    return normalize(s);
  }
  let S = load();
  let saveTimer = 0;
  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(flush, 400);
  }
  // fromSync: 동기화로 받은 내용을 저장할 때는 다시 동기화를 부르지 않는다.
  function flush(fromSync) {
    clearTimeout(saveTimer); saveTimer = 0;
    S.savedAt = Date.now();
    const json = JSON.stringify(S);
    try { localStorage.setItem(KEY, json); } catch (e) { toast('저장 공간이 부족합니다. 설정 → 내보내기로 백업해 주세요.'); }
    if (HOST) HOST.postMessage('save:' + json);
    if (SYNC && fromSync !== true) SYNC.notifyChange();
  }
  window.addEventListener('beforeunload', () => { if (saveTimer) flush(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && saveTimer) flush(); });
  window.addEventListener('storage', e => {
    if (e.key !== KEY || !e.newValue) return;
    try { S = normalize(JSON.parse(e.newValue)); render(); } catch (err) { /* 다른 탭의 손상된 값은 무시 */ }
  });

  // ---------- 데이터 도우미 ----------
  const cat = id => S.settings.cats.find(c => c.id === id) || null;
  const catColor = id => { const c = id && cat(id); return c ? c.color : null; };
  const catName = id => { const c = id && cat(id); return c ? c.name : '분류 없음'; };
  function day(k, create) {
    let D = S.days[k];
    if (!D && create) D = S.days[k] = { todos: [], plan: {}, act: {}, see: '', score: 0 };
    return D || null;
  }
  function planOf(k, hr, create) {
    const D = day(k, create);
    if (!D) return null;
    if (!D.plan[hr] && create) D.plan[hr] = { t: '', c: null, d: false };
    return D.plan[hr] || null;
  }
  function actOf(k, hr, create) {
    const D = day(k, create);
    if (!D) return null;
    if (!D.act[hr] && create) D.act[hr] = { cells: [null, null, null, null, null, null], m: '', f: '' };
    return D.act[hr] || null;
  }
  function tidyDay(k) {
    const D = S.days[k];
    if (!D) return;
    for (const hr in D.plan) { const p = D.plan[hr]; if (!p.t.trim() && !p.c && !p.d) delete D.plan[hr]; }
    for (const hr in D.act) { const a = D.act[hr]; if (!a.cells.some(Boolean) && !a.m.trim() && !a.f) delete D.act[hr]; }
  }
  function dayHasData(D) {
    if (!D) return false;
    return D.todos.some(t => t.t.trim()) || Object.values(D.plan).some(p => p.t.trim()) ||
      Object.values(D.act).some(a => a.cells.some(Boolean) || a.m.trim() || a.f) || !!D.see.trim();
  }
  function dayStats(k) {
    const r = { total: 0, done: 0, mins: 0, byCat: {}, focus: { H: 0, M: 0, L: 0 } };
    const D = S.days[k];
    if (!D) return r;
    for (const a of Object.values(D.act)) if (a.f && r.focus[a.f] != null) r.focus[a.f]++;
    for (const p of Object.values(D.plan)) if (p.t.trim()) { r.total++; if (p.d) r.done++; }
    for (const t of D.todos) if (t.t.trim()) { r.total++; if (t.d) r.done++; }
    for (const a of Object.values(D.act)) for (const c of a.cells) if (c) { r.mins += 10; r.byCat[c] = (r.byCat[c] || 0) + 10; }
    return r;
  }
  function yearItemsOn(k) {
    const md = k.slice(5), y = k.slice(0, 4);
    return S.yItems.filter(it => it.date === k || (it.rep && it.date.slice(5) === md && it.date.slice(0, 4) < y));
  }
  const activeHabits = () => S.habits.filter(x => !x.arch);
  const isChecked = (id, k) => !!(S.checks[id] && S.checks[id][k]);
  function toggleCheck(id, k) {
    const c = S.checks[id] = S.checks[id] || {};
    if (c[k]) delete c[k]; else c[k] = 1;
    save();
  }
  function streak(id) {
    let k = todayKey(), n = 0;
    if (!isChecked(id, k)) k = addDays(k, -1);
    while (isChecked(id, k)) { n++; k = addDays(k, -1); }
    return n;
  }
  function weekStartKey(k) {
    const off = (parse(k).getDay() - S.settings.weekStart + 7) % 7;
    return addDays(k, -off);
  }
  function upcoming(fromKey, days, max) {
    const out = [];
    for (let i = 0; i <= days && out.length < max; i++) {
      const dk = addDays(fromKey, i), hol = holidayOf(dk);
      if (hol && !/연휴/.test(hol)) out.push({ dk, i, t: hol, kind: 'hol', c: '#ef4444' });
      for (const it of yearItemsOn(dk)) if (it.t.trim()) out.push({ dk, i, t: it.t, kind: 'yr', c: catColor(it.c) || YEAR_DEFAULT_COLOR });
      for (const it of S.mItems[dk] || []) if (it.t.trim()) out.push({ dk, i, t: it.t, kind: 'mo', c: catColor(it.c) });
    }
    return out.slice(0, max);
  }

  // ---------- 화면 상태 ----------
  const U = { tab: S.settings.startTab || 'day', cur: todayKey(), half: null, q: '', focus: null, forceScroll: true };
  let HS = { pinned: false, autostart: false, locked: false, alpha: 0, hover: true, zoom: 1, folder: '' };
  let SYNC = null;
  let hovering = false, previewUntil = 0, alphaTimer = 0;
  let paint = null;
  let sheet = null;
  let toastTimer = 0;
  const app = $('#app');

  // ---------- 공통 조각 ----------
  function chkBtn(on, color, fn, dim) {
    return h('button.chk' + (on ? '.on' : '') + (dim ? '.dim' : ''), {
      type: 'button', style: color ? { '--c': color } : null, 'aria-pressed': on ? 'true' : 'false', onclick: fn
    }, svgEl(CHECK));
  }
  function catBtn(cid, onOpen) {
    const c = catColor(cid);
    return h('button.dotbtn', { type: 'button', title: '색 분류: ' + catName(cid), onclick: e => onOpen(e.currentTarget) },
      h('span.dot' + (c ? '' : '.none'), { style: c ? { '--c': c } : null }));
  }
  function openPop(anchor, build) {
    closePop();
    const r = anchor.getBoundingClientRect();
    const close = () => closePop();
    const pop = h('div.pop', build(close));
    $('#pop-root').append(pop);
    const w = pop.offsetWidth, hh = pop.offsetHeight;
    let left = Math.min(r.left, innerWidth - w - 8), top = r.bottom + 4;
    if (top + hh > innerHeight - 8) top = Math.max(8, r.top - hh - 4);
    pop.style.left = Math.max(8, left) + 'px';
    pop.style.top = top + 'px';
  }
  function closePop() { const r = $('#pop-root'); if (r && r.firstChild) r.replaceChildren(); }
  function openCatMenu(anchor, current, onPick) {
    openPop(anchor, close => [
      h('div.ph', '색 분류'),
      S.settings.cats.map(c => h('button' + (c.id === current ? '.on' : ''), {
        style: { '--c': c.color }, onclick: () => { close(); onPick(c.id); }
      }, h('span.dot', { style: { '--c': c.color } }), c.name)),
      h('hr'),
      h('button', { onclick: () => { close(); onPick(null); } }, h('span.dot.none'), '색 없음')
    ]);
  }
  function toast(msg, action) {
    const root = $('#toast-root');
    const el = h('div.toast', h('span', msg), action && h('button', {
      onclick: () => { action.fn(); el.remove(); }
    }, action.label));
    root.replaceChildren(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.remove(), action ? 6500 : 2800);
  }
  function removeWithUndo(arr, item, msg, after) {
    const i = arr.indexOf(item);
    if (i < 0) return;
    arr.splice(i, 1);
    save(); render();
    toast(msg, { label: '되돌리기', fn: () => { arr.splice(Math.min(i, arr.length), 0, item); if (after) after(); save(); render(); } });
  }
  const snapDay = k => S.days[k] ? JSON.parse(JSON.stringify(S.days[k])) : null;
  function restoreDay(k, snap) {
    if (snap) S.days[k] = snap; else delete S.days[k];
    save(); render();
  }

  // ---------- 시트(아래에서 올라오는 편집 창) ----------
  function openSheet(build, focus, onClose) {
    closePop();
    sheet = { build, onClose, fresh: true };
    if (focus && matchMedia('(pointer: fine)').matches) U.focus = focus;
    drawSheet();
  }
  function drawSheet() {
    const root = $('#sheet-root');
    if (!sheet) { root.replaceChildren(); return; }
    const old = root.querySelector('.sheet');
    const st = old ? old.scrollTop : 0;
    const panel = h('div.sheet', { role: 'dialog' }, h('div.grip'), sheet.build());
    const back = h('div.sheet-back', { onclick: () => closeSheet() });
    if (!sheet.fresh) { panel.style.animation = 'none'; back.style.animation = 'none'; }
    sheet.fresh = false;
    root.replaceChildren(back, panel);
    panel.scrollTop = st;
    panel.querySelectorAll('textarea.auto').forEach(autosize);
    if (U.focus) {
      const f = panel.querySelector(`[data-focus="${U.focus}"]`);
      U.focus = null;
      if (f) f.focus();
    }
  }
  function closeSheet() {
    if (!sheet) return;
    const s = sheet;
    sheet = null;
    drawSheet();
    if (s.onClose) s.onClose();
    render();
  }

  // ---------- 머리글 · 탭 ----------
  function stepOf(tab) {
    return { day: 'day', journal: 'day', month: 'month', habit: 'month', year: 'year' }[tab] || null;
  }
  function move(n) {
    const st = stepOf(U.tab);
    if (!st) return;
    U.cur = st === 'day' ? addDays(U.cur, n) : addMonths(U.cur, st === 'month' ? n : 12 * n);
    if (st === 'year') U.half = null;
    render();
  }
  function goToday() {
    U.cur = todayKey();
    U.forceScroll = true;
    render();
  }
  function setTab(id) {
    if (U.tab === id) return;
    U.tab = id;
    U.forceScroll = true;
    render();
  }
  function pickDate(anchor) {
    const st = stepOf(U.tab);
    if (!st) return;
    if (st === 'year') {
      const y = parse(U.cur).getFullYear();
      openPop(anchor, close => range(7).map(i => y - 3 + i).map(yy => h('button' + (yy === y ? '.on' : ''), {
        onclick: () => { close(); U.cur = `${yy}${U.cur.slice(4)}`; U.cur = addDays(U.cur, 0); render(); }
      }, yy + '년')));
      return;
    }
    const r = anchor.getBoundingClientRect();
    const inp = h('input', {
      type: st === 'month' ? 'month' : 'date',
      style: { position: 'fixed', left: r.left + 'px', top: r.bottom + 'px', width: '1px', height: '1px', opacity: '0', border: '0' }
    });
    inp.value = st === 'month' ? ym(U.cur) : U.cur;
    inp.addEventListener('change', () => {
      if (!inp.value) return;
      if (st === 'month') {
        const p = inp.value.split('-').map(Number);
        U.cur = `${inp.value}-${pad(Math.min(parse(U.cur).getDate(), daysIn(p[0], p[1] - 1)))}`;
      } else U.cur = inp.value;
      U.forceScroll = true;
      render();
    });
    inp.addEventListener('blur', () => setTimeout(() => inp.remove(), 400));
    document.body.append(inp);
    try { inp.showPicker(); } catch (e) { inp.focus(); }
  }

  function header() {
    const st = stepOf(U.tab), d = parse(U.cur), now = new Date();
    let title;
    if (U.tab === 'home') { const t = new Date(); title = [`${t.getMonth() + 1}월 ${t.getDate()}일`, h('small', WD[t.getDay()] + '요일')]; }
    else if (st === 'day') title = [`${d.getMonth() + 1}월 ${d.getDate()}일 (${WD[d.getDay()]})`, d.getFullYear() !== now.getFullYear() && h('small', d.getFullYear() + '년')];
    else if (st === 'month') title = `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
    else if (st === 'year') title = `${d.getFullYear()}년`;
    else title = '메모';

    const nav = h('div.nav',
      st && h('button.ib', { title: '이전 (←)', onclick: () => move(-1) }, icon('left')),
      h('button.title', { title: st ? '날짜 고르기' : null, onclick: e => pickDate(e.currentTarget) }, title),
      st && h('button.ib', { title: '다음 (→)', onclick: () => move(1) }, icon('right')),
      st && h('button.today-btn', { title: '오늘로 (T)', onclick: goToday }, '오늘'));
    const acts = h('div.acts',
      SYNC && syncButton(),
      HOST && h('button.ib' + (HS.locked ? '.on' : ''), {
        title: '창 설정 — 바탕화면 고정 · 틀 고정 · 투명도', onclick: e => openWinMenu(e.currentTarget)
      }, icon(HS.locked ? 'lock' : 'win')),
      h('button.ib', { title: '설정', onclick: openSettings }, icon('gear')),
      HOST && h('button.ib', { title: '숨기기 (알림 영역 아이콘을 누르면 다시 열림)', onclick: () => HOST.postMessage('hide') }, icon('minus')));
    return h('header.top', {
      onmousedown: e => {
        if (!HOST || HS.locked || e.button !== 0 || e.target.closest('button,input,select,textarea')) return;
        e.preventDefault();
        HOST.postMessage('drag');
      }
    }, h('div.brand', h('div.logo', icon('logo')), h('b', '만능 다이어리')), nav, acts);
  }
  function tabsBar() {
    return h('nav.tabs', h('div.seg', TABS.map((t, i) => h('button' + (U.tab === t[0] ? '.on' : ''), {
      title: `${t[1]} (${i + 1})`, onclick: () => setTab(t[0])
    }, icon(t[2]), h('span', t[1])))));
  }

  // ---------- 일간 ----------
  function copyPrev(mode) {
    const k = U.cur, pk = addDays(k, -1), P = S.days[pk];
    const has = P && (Object.values(P.plan).some(p => p.t.trim()) || P.todos.some(t => t.t.trim()));
    if (!has) { toast(`전날(${shortLabel(pk)})에 적힌 계획이 없습니다`); return; }
    const before = snapDay(k), D = day(k, true);
    let n = 0, skip = 0;
    for (const hr in P.plan) {
      const p = P.plan[hr];
      if (!p.t.trim() || (mode === 'undone' && p.d)) continue;
      const cur = D.plan[hr];
      if (cur && cur.t.trim()) { skip++; continue; }
      D.plan[hr] = { t: p.t, c: p.c || null, d: false };
      n++;
    }
    for (const t of P.todos) {
      if (!t.t.trim() || (mode === 'undone' && t.d)) continue;
      if (D.todos.some(x => x.t === t.t)) { skip++; continue; }
      D.todos.push({ id: uid(), t: t.t, c: t.c || null, d: false });
      n++;
    }
    save(); render();
    if (!n) { toast(mode === 'undone' ? '전날 못 끝낸 계획이 없습니다' : '이미 모두 들어 있습니다'); return; }
    toast(`전날 계획 ${n}개를 가져왔습니다${skip ? ` · 이미 적힌 ${skip}칸은 그대로 둠` : ''}`,
      { label: '되돌리기', fn: () => restoreDay(k, before) });
  }
  function planToActual() {
    const k = U.cur, D = S.days[k];
    if (!D) { toast('계획이 없습니다'); return; }
    const before = snapDay(k);
    let n = 0;
    for (const hr in D.plan) {
      const p = D.plan[hr];
      if (!p.t.trim() || !p.d) continue;
      const a = actOf(k, hr, true);
      if (a.cells.some(Boolean)) continue;
      const fill = p.c || (S.settings.brush !== 'erase' ? S.settings.brush : null) || S.settings.cats[0].id;
      a.cells = a.cells.map(() => fill);
      if (!a.m.trim()) a.m = p.t;
      n++;
    }
    save(); render();
    if (!n) { toast('칠할 칸이 없습니다 (완료 체크한 계획 중 실적이 빈 시간만 칠합니다)'); return; }
    toast(`완료한 계획 ${n}시간을 실적에 칠했습니다`, { label: '되돌리기', fn: () => restoreDay(k, before) });
  }
  function clearDay() {
    const k = U.cur, before = snapDay(k);
    if (!before) { toast('지울 기록이 없습니다'); return; }
    delete S.days[k];
    save(); render();
    toast(`${shortLabel(k)} 기록을 지웠습니다`, { label: '되돌리기', fn: () => restoreDay(k, before) });
  }
  function openCopyMenu(anchor) {
    const pk = addDays(U.cur, -1), st = dayStats(pk);
    openPop(anchor, close => [
      h('div.ph', `전날 ${shortLabel(pk)} · 계획 ${st.total}개 (못 끝낸 ${st.total - st.done}개)`),
      h('button', { onclick: () => { close(); openSlotCopy(pk); } }, icon('day'), '시간대 골라 가져오기…'),
      h('button', { onclick: () => { close(); copyPrev('all'); } }, icon('copy'), '전날 계획 모두 가져오기'),
      h('button', { onclick: () => { close(); copyPrev('undone'); } }, icon('repeat'), '못 끝낸 계획만 가져오기'),
      h('hr'),
      h('button', { onclick: () => { close(); planToActual(); } }, icon('wand'), '완료한 계획을 실적에 칠하기'),
      h('button', { cls: 'danger', onclick: () => { close(); clearDay(); } }, icon('trash'), '이 날 기록 모두 지우기')
    ]);
  }

  // 시간대 골라 가져오기: 원하는 날(기본 전날)의 계획 중 고른 시간·할 일만 이 날로 옮긴다.
  function openSlotCopy(srcKey) {
    const target = U.cur;
    let src = srcKey || addDays(target, -1);
    let sel = new Set(), withAct = false, overwrite = false;
    const rowsOf = k => {
      const P = S.days[k], out = [];
      if (!P) return out;
      const start = (+S.settings.startHour || 0) % 24;
      range(24).map(i => (start + i) % 24).forEach(hr => {
        const p = P.plan[hr], a = P.act[hr];
        const hasP = !!(p && p.t.trim()), hasA = !!(a && (a.cells.some(Boolean) || a.m.trim() || a.f));
        if (hasP || hasA) out.push({ k: 'p' + hr, hr, p: hasP ? p : null, a: hasA ? a : null });
      });
      P.todos.filter(t => t.t.trim()).forEach(t => out.push({ k: 't' + t.id, t }));
      return out;
    };
    const apply = () => {
      const rows = rowsOf(src).filter(r => sel.has(r.k));
      if (!rows.length) return;
      const before = snapDay(target), D = day(target, true);
      let n = 0, skip = 0;
      for (const r of rows) {
        if (r.t) {
          if (D.todos.some(x => x.t === r.t.t)) { skip++; continue; }
          D.todos.push({ id: uid(), t: r.t.t, c: r.t.c || null, d: false });
          n++;
          continue;
        }
        let did = false;
        if (r.p) {
          const cur = D.plan[r.hr];
          if (cur && cur.t.trim() && !overwrite) skip++;
          else { D.plan[r.hr] = { t: r.p.t, c: r.p.c || null, d: false }; did = true; }
        }
        if (withAct && r.a) {
          const cur = D.act[r.hr];
          if (cur && (cur.cells.some(Boolean) || cur.m.trim()) && !overwrite) skip++;
          else { D.act[r.hr] = JSON.parse(JSON.stringify(r.a)); did = true; }
        }
        if (did) n++;
      }
      tidyDay(target);
      save();
      sheet = null; drawSheet(); render();
      if (!n) { toast('가져온 것이 없습니다 · 이미 적힌 칸은 ‘덮어쓰기’를 켜야 바뀝니다'); return; }
      toast(`${shortLabel(src)}에서 ${n}개를 가져왔습니다${skip ? ` · 이미 적힌 ${skip}칸은 그대로 둠` : ''}`,
        { label: '되돌리기', fn: () => restoreDay(target, before) });
    };
    openSheet(() => {
      const rows = rowsOf(src), T = S.days[target];
      const moveSrc = n => {
        let k = addDays(src, n);
        if (k === target) k = addDays(k, n);
        src = k; sel = new Set(); drawSheet();
      };
      const toggle = key => { if (sel.has(key)) sel.delete(key); else sel.add(key); drawSheet(); };
      const mini = a => h('span.mini-cells', a.cells.map(c => h('i', { style: c ? { '--c': catColor(c) || '#cbd5e1' } : null, cls: c ? 'p' : null })));
      return [
        h('div.sheet-h', h('h2', '시간대 골라 가져오기', h('small', { style: { color: 'var(--mute)' } }, `→ ${shortLabel(target)}`)),
          h('button.ib', { title: '닫기', onclick: () => closeSheet() }, icon('x'))),
        h('div.srcnav',
          h('button.ib', { title: '하루 전', onclick: () => moveSrc(-1) }, icon('left')),
          h('div.grow', h('b', `${shortLabel(src)} 계획`), h('small', src === addDays(target, -1) ? '전날' : '다른 날에서 가져오기')),
          h('button.ib', { title: '하루 뒤', onclick: () => moveSrc(1) }, icon('right'))),
        rows.length ? [
          h('div.row', { style: { margin: '8px 0 4px' } },
            h('button.btn.sm', { onclick: () => { rows.forEach(r => sel.add(r.k)); drawSheet(); } }, '전체 선택'),
            h('button.btn.sm', { onclick: () => { sel.clear(); drawSheet(); } }, '전체 해제'),
            h('div.grow'),
            h('span.muted', { style: { fontSize: '12px' } }, `${sel.size}개 선택`)),
          h('div.slotlist', rows.map(r => {
            const on = sel.has(r.k);
            const busy = r.t ? false : !!(T && T.plan[r.hr] && T.plan[r.hr].t.trim());
            const c = r.t ? catColor(r.t.c) : r.p ? catColor(r.p.c) : null;
            return h('div.slotrow' + (on ? '.on' : ''), { onclick: () => toggle(r.k) },
              chkBtn(on, null, e => { e.stopPropagation(); toggle(r.k); }),
              h('span.tm', r.t ? '할 일' : pad(r.hr) + ':00'),
              c ? h('span.dot', { style: { '--c': c } }) : null,
              h('span.tx', r.t ? r.t.t : r.p ? r.p.t : h('span.muted', '(계획 없음 · 실적만)')),
              r.a ? mini(r.a) : null,
              busy ? h('span.busy', '이미 있음') : null);
          }))
        ] : h('div.empty', { style: { padding: '16px 4px' } }, `${shortLabel(src)}에는 적힌 계획이 없습니다. 위 화살표로 다른 날을 골라 보세요.`),
        h('div.sec',
          setRow('실적(칠한 칸·메모)도 함께', '같은 시간의 DO 칸까지 복사', toggleBtn(withAct, () => { withAct = !withAct; drawSheet(); })),
          setRow('이미 적힌 칸 덮어쓰기', '끄면 비어 있는 시간에만 넣음', toggleBtn(overwrite, () => { overwrite = !overwrite; drawSheet(); }))),
        h('div.row', { style: { justifyContent: 'flex-end', marginTop: '12px' } },
          h('button.btn', { onclick: () => closeSheet() }, '취소'),
          h('button.btn.pri', { disabled: !sel.size, onclick: apply }, `선택한 ${sel.size}개 가져오기`))
      ];
    });
  }

  function dayHeadCard(k) {
    const d = parse(k), hol = holidayOf(k), t = todayKey();
    const rel = k === t ? '오늘' : k === addDays(t, -1) ? '어제' : k === addDays(t, 1) ? '내일' : '';
    const ws = weekStartKey(k);
    const strip = h('div.wstrip', range(7).map(i => {
      const dk = addDays(ws, i), dd = parse(dk), w = dd.getDay();
      const cls = (w === 6 ? '.sat' : '') + ((w === 0 || holidayOf(dk)) ? '.sun' : '') + (dk === t ? '.is-today' : '') +
        (dk === k ? '.sel' : '') + (dayHasData(S.days[dk]) ? '.has' : '');
      return h('button.wd-btn' + cls, { title: shortLabel(dk), onclick: () => { U.cur = dk; U.forceScroll = true; render(); } },
        WD[w], h('b', dd.getDate()), h('i.pip'));
    }));
    return h('div.card',
      h('div.dayhead',
        h('div.big', d.getDate()),
        h('div.meta',
          h('b', `${d.getFullYear()}년 ${d.getMonth() + 1}월 · ${WD[d.getDay()]}요일`),
          h('span', hol && h('span.hol', hol), hol && rel ? ' · ' : '', rel || (hol ? '' : ' '))),
        h('div.sp'),
        h('button.btn.sm', { title: '전날 계획 가져오기 등', onclick: e => openCopyMenu(e.currentTarget) }, icon('copy'), '전날 복사', icon('down'))),
      strip);
  }

  function todoCard(k) {
    const D = S.days[k], list = D ? D.todos : [];
    const done = list.filter(t => t.d).length;
    return h('div.card',
      h('div.card-h', h('h3', '할 일', list.length ? h('em', `${done}/${list.length}`) : null), h('div.sp'),
        h('span.muted', { style: { fontSize: '11px' } }, '시간이 정해지지 않은 일')),
      list.map((t, i) => h('div.todo',
        chkBtn(t.d, catColor(t.c), () => { t.d = !t.d; save(); render(); }),
        h('input.bare' + (t.d ? '.done-text' : ''), {
          value: t.t, dataset: { focus: 'todo-' + t.id },
          oninput: e => { t.t = e.target.value; save(); },
          onkeydown: e => {
            if (e.key === 'Enter') { e.preventDefault(); U.focus = 'todo-add'; render(); }
            else if (e.key === 'Backspace' && !e.target.value) {
              e.preventDefault();
              list.splice(i, 1); save();
              U.focus = i > 0 ? 'todo-' + list[i - 1].id : 'todo-add';
              render();
            }
          }
        }),
        catBtn(t.c, a => openCatMenu(a, t.c, id => { t.c = id; save(); render(); })),
        h('button.ib.sm.x', { title: '삭제', onclick: () => removeWithUndo(list, t, '할 일을 지웠습니다') }, icon('x')))),
      h('div.add-line', icon('plus'), h('input.bare', {
        placeholder: '할 일 추가 후 Enter', dataset: { focus: 'todo-add' },
        onkeydown: e => {
          if (e.key !== 'Enter' || !e.target.value.trim()) return;
          day(k, true).todos.push({ id: uid(), t: e.target.value.trim(), c: null, d: false });
          save(); U.focus = 'todo-add'; render();
        }
      })));
  }

  function rowKeys(e) {
    const r = +e.target.dataset.row, col = e.target.dataset.col;
    let to = null;
    if (e.key === 'ArrowDown' || e.key === 'Enter') to = r + 1;
    else if (e.key === 'ArrowUp') to = r - 1;
    if (to == null) return;
    const el = document.querySelector(`[data-row="${to}"][data-col="${col}"]`);
    if (el) { e.preventDefault(); el.focus(); }
  }

  function paintCell(cell) {
    const ps = paint, hr = +cell.dataset.h, j = +cell.dataset.j;
    const A = actOf(ps.k, hr, true);
    const v = ps.mode === 'erase' ? null : ps.brush;
    if (A.cells[j] === v) return;
    A.cells[j] = v;
    ps.changed = true;
    const col = catColor(v);
    cell.classList.toggle('p', !!col);
    if (col) cell.style.setProperty('--c', col); else cell.style.removeProperty('--c');
  }

  function timelineCard(k) {
    const D = S.days[k], start = (+S.settings.startHour || 0) % 24, t = todayKey(), nowH = new Date().getHours();
    const cats = S.settings.cats;
    let brush = S.settings.brush;
    if (brush !== 'erase' && !cats.some(c => c.id === brush)) brush = S.settings.brush = cats[0] ? cats[0].id : 'erase';
    const setBrush = id => { S.settings.brush = id; save(); render(); };

    const brushes = h('div.brushes', { dataset: { keepx: '' } },
      h('span.lbl', '칠할 색'),
      cats.map(c => h('button.chip' + (brush === c.id ? '.on' : ''), { style: { '--c': c.color }, onclick: () => setBrush(c.id) },
        h('span.dot', { style: { '--c': c.color } }), c.name)),
      h('button.chip' + (brush === 'erase' ? '.on' : ''), { onclick: () => setBrush('erase') }, icon('eraser'), '지우개'));

    const rows = range(24).map(i => {
      const hr = (start + i) % 24;
      const p = D && D.plan[hr], a = D && D.act[hr];
      const pc = p && catColor(p.c), hasT = !!(p && p.t.trim());
      const sub = i === 0 ? (hr < 12 ? '오전' : '오후') : hr === 12 ? '정오' : hr === 0 ? '자정' : '';
      return h('div.trow' + (k === t && hr === nowH ? '.now' : '') + (hr === 12 && i ? '.noon' : ''), { dataset: { h: hr } },
        h('div.pcell' + (pc ? '.has-c' : ''), { style: pc ? { '--c': pc } : null },
          chkBtn(p && p.d, pc, () => {
            const P = planOf(k, hr, false);
            if (!P || !P.t.trim()) return;
            P.d = !P.d; save(); render();
          }, !hasT),
          h('input.bare' + (p && p.d ? '.done-soft' : ''), {
            value: p ? p.t : '', dataset: { row: i, col: 'p' }, 'aria-label': `${hr}시 계획`,
            oninput: e => {
              const P = planOf(k, hr, true);
              P.t = e.target.value;
              e.target.previousSibling.classList.toggle('dim', !P.t.trim());
              save();
            },
            onblur: () => { tidyDay(k); },
            onkeydown: rowKeys
          }),
          catBtn(p && p.c, el => {
            const P = planOf(k, hr, false);
            openCatMenu(el, P && P.c, id => { planOf(k, hr, true).c = id; tidyDay(k); save(); render(); });
          })),
        h('div.hour', pad(hr), sub && h('small', sub)),
        h('div.dcol',
          h('div.dcells', range(6).map(j => {
            const col = catColor(a && a.cells[j]);
            return h('div.dcell' + (col ? '.p' : ''), { style: col ? { '--c': col } : null, dataset: { h: hr, j: j }, title: `${pad(hr)}:${j}0` });
          })),
          h('input.bare', {
            value: a ? a.m : '', dataset: { row: i, col: 'm' }, 'aria-label': `${hr}시 실적 메모`,
            oninput: e => { actOf(k, hr, true).m = e.target.value; save(); },
            onblur: () => { tidyDay(k); },
            onkeydown: rowKeys
          })),
        // 그 시간 업무 집중도: H·M·L 중 하나를 체크(다시 누르면 해제)
        h('div.fcol', FOCUS.map(f => h('button.fbtn.f' + f + (a && a.f === f ? '.on' : ''), {
          type: 'button', title: `집중도 ${f} (${FOCUS_NAME[f]})`,
          onclick: () => { const A = actOf(k, hr, true); A.f = A.f === f ? '' : f; tidyDay(k); save(); render(); }
        }, f))));
    });

    const body = h('div.tl-body', rows);
    // 칸은 시간 순서대로 이어져 있으므로, 끌다가 건너뛴 칸도 시작~현재 사이를 모두 칠한다.
    const allCells = () => Array.from(body.querySelectorAll('.dcell'));
    body.addEventListener('pointerdown', e => {
      const cell = e.target.closest('.dcell');
      if (!cell || e.button > 0) return;
      e.preventDefault();
      const b = S.settings.brush;
      const A = actOf(k, +cell.dataset.h, true);
      const cells = allCells();
      paint = { k, brush: b, mode: b === 'erase' || A.cells[+cell.dataset.j] === b ? 'erase' : 'paint', changed: false, cells, last: cells.indexOf(cell) };
      paintCell(cell);
      try { body.setPointerCapture(e.pointerId); } catch (err) { /* 일부 환경은 지원 안 함 */ }
    });
    body.addEventListener('pointermove', e => {
      if (!paint) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const cell = el && el.closest && el.closest('.dcell');
      if (!cell || !body.contains(cell)) return;
      const idx = paint.cells.indexOf(cell);
      if (idx < 0 || idx === paint.last) return;
      const step = idx > paint.last ? 1 : -1;
      for (let i = paint.last + step; i !== idx + step; i += step) paintCell(paint.cells[i]);
      paint.last = idx;
    });
    const end = () => {
      if (!paint) return;
      const changed = paint.changed;
      paint = null;
      tidyDay(k);
      if (changed) { save(); refreshSummary(); }
    };
    body.addEventListener('pointerup', end);
    body.addEventListener('pointercancel', end);
    body.addEventListener('lostpointercapture', end);

    return h('div.card.tl',
      h('div.tl-top', brushes, h('div.tl-cols', h('span', 'PLAN 계획'), h('span', '시'), h('span', 'DO 실적 (칠하기·메모)'), h('span', '집중'))),
      body);
  }

  function summaryCard(k) {
    const st = dayStats(k), pct = st.total ? Math.round(st.done / st.total * 100) : 0;
    const segs = Object.entries(st.byCat).sort((a, b) => b[1] - a[1]);
    return h('div.card.sum-card',
      h('div.card-h', h('h3', k === todayKey() ? '오늘의 결과' : '이 날의 결과')),
      h('div.stats',
        h('div.stat', h('div.k', '계획 달성'), h('div.v', pct + '%', h('small', `${st.done}/${st.total}`)),
          h('div.bar', h('i', { style: { width: pct + '%' } }))),
        h('div.stat', h('div.k', '실적 기록'), h('div.v', st.mins ? fmtMin(st.mins) : '—'),
          h('div.bar', h('i', { style: { width: Math.min(100, st.mins / 960 * 100) + '%' } })))),
      st.mins
        ? [h('div.stack', segs.map(s => h('i', { title: `${catName(s[0])} ${fmtMin(s[1])}`, style: { '--c': catColor(s[0]) || '#cbd5e1', width: (s[1] / st.mins * 100) + '%' } }))),
          h('div.legend', segs.map(s => h('span', h('span.dot', { style: { '--c': catColor(s[0]) || '#cbd5e1' } }), catName(s[0]), h('b', fmtMin(s[1])))))]
        : h('div.empty', { style: { marginTop: '8px' } }, 'DO 칸을 색으로 칠하면 시간 사용이 분류별로 모입니다.'),
      FOCUS.some(f => st.focus[f]) ? h('div.legend.focus-sum', h('span.muted', '집중도'),
        FOCUS.filter(f => st.focus[f]).map(f => h('span', h('i.fbtn.on.f' + f, f), FOCUS_NAME[f], h('b', st.focus[f] + '시간')))) : null);
  }
  function refreshSummary() {
    const old = $('.sum-card');
    if (old) old.replaceWith(summaryCard(U.cur));
  }

  function seeCard(k) {
    const D = S.days[k], sc = D ? D.score : 0;
    return h('div.card',
      h('div.card-h', h('h3', 'SEE 돌아보기'), h('div.sp'),
        h('div.stars', range(5).map(i => h('button' + (i < sc ? '.on' : ''), {
          title: `만족도 ${i + 1}점`,
          onclick: () => { const DD = day(k, true); DD.score = DD.score === i + 1 ? 0 : i + 1; save(); render(); }
        }, '★')))),
      h('textarea.bare.auto', {
        rows: 3, placeholder: '잘한 점 · 아쉬운 점 · 내일 다짐', value: D ? D.see : '',
        oninput: e => { day(k, true).see = e.target.value; autosize(e.target); save(); }
      }));
  }

  function viewDay() {
    const k = U.cur;
    if (isWide()) {
      return h('div.day-layout',
        h('div.day-side', { dataset: { keepy: '' } }, dayHeadCard(k), h('div.card', miniMonth(k)), todoCard(k), summaryCard(k), seeCard(k)),
        h('div.day-main', { dataset: { keepy: '' } }, timelineCard(k)));
    }
    return h('div', dayHeadCard(k), todoCard(k), timelineCard(k), summaryCard(k), seeCard(k));
  }
  function scrollDay(view) {
    const sc = view.querySelector('.day-main') || view;
    if (U.cur !== todayKey()) { sc.scrollTop = 0; return; }
    const row = view.querySelector('.trow.now');
    if (!row) return;
    const off = row.getBoundingClientRect().top - sc.getBoundingClientRect().top;
    sc.scrollTop = Math.max(0, sc.scrollTop + off - 150);
  }
  // 지금 시각 표시: 가로선 대신 그 시간 줄 전체에 연노랑 음영을 주고,
  // 분은 DO 칸에서만 표시한다(지금 10분 칸 옅은 테두리 + 칸 아래 정확한 분 위치에 작은 ▲).
  function placeNowLine() {
    document.querySelectorAll('.nowmark').forEach(e => e.remove());
    document.querySelectorAll('.dcell.nowcell').forEach(e => e.classList.remove('nowcell'));
    const now = new Date(), hr = now.getHours(), m = now.getMinutes();
    const on = U.tab === 'day' && U.cur === todayKey();
    document.querySelectorAll('.trow').forEach(r => r.classList.toggle('now', on && +r.dataset.h === hr));
    if (!on) return;
    const cell = document.querySelector(`.dcell[data-h="${hr}"][data-j="${Math.floor(m / 10)}"]`);
    if (!cell) return;
    cell.classList.add('nowcell');
    cell.append(h('span.nowmark', { style: { left: ((m % 10) / 10 * 100) + '%' }, title: `지금 ${pad(hr)}:${pad(m)}` }));
  }

  // ---------- 미니 달력 ----------
  function miniMonth(k, onPick) {
    const d = parse(k), y = d.getFullYear(), m0 = d.getMonth(), ws = S.settings.weekStart;
    const first = keyOf(new Date(y, m0, 1)), off = (parse(first).getDay() - ws + 7) % 7;
    const start = addDays(first, -off), weeks = Math.ceil((off + daysIn(y, m0)) / 7), t = todayKey();
    const selWeek = U.tab === 'day' ? weekStartKey(U.cur) : null;
    const pick = onPick || (dk => { U.tab = 'day'; U.cur = dk; U.forceScroll = true; render(); });
    return h('div.mini',
      h('div.mt', `${y}년 ${m0 + 1}월`),
      h('div.mgrid',
        range(7).map(i => { const w = (ws + i) % 7; return h('div.mh' + (w === 6 ? '.sat' : w === 0 ? '.sun' : ''), WD[w]); }),
        range(weeks * 7).map(i => {
          const dk = addDays(start, i), dd = parse(dk), w = dd.getDay();
          const cls = (dd.getMonth() !== m0 ? '.out' : '') + (w === 6 ? '.sat' : '') + ((w === 0 || holidayOf(dk)) ? '.sun' : '') +
            (dk === t ? '.today' : '') + (U.tab === 'day' && dk === U.cur ? '.sel' : '') + (selWeek && weekStartKey(dk) === selWeek ? '.inweek' : '');
          return h('div.md' + cls, { title: holidayOf(dk) || null, onclick: () => pick(dk) }, dd.getDate());
        })));
  }

  // ---------- 오늘 ----------
  function heroLine(k) {
    const up = upcoming(addDays(k, 1), 60, 1)[0];
    if (up) return `다음 일정 · ${up.t} D-${up.i + 1}`;
    const hr = new Date().getHours();
    return hr < 11 ? '좋은 아침이에요. 오늘 계획을 세워 볼까요?' : hr < 18 ? '오늘도 한 칸씩 채워 가요.' : '하루를 돌아보며 SEE를 적어 보세요.';
  }
  function memoCard(m) {
    const c = catColor(m.c);
    const lines = m.body.split('\n');
    const title = m.title.trim() || lines[0].trim() || '빈 메모';
    const body = (m.title.trim() ? m.body : lines.slice(1).join('\n')).trim();
    return h('div.memo', { style: c ? { '--c': c } : null, onclick: () => openMemoSheet(m.id) },
      h('h4', m.pin && icon('pin'), h('span', title)),
      body && h('p', body),
      h('div.mf', fmtStamp(m.u)));
  }
  function viewHome() {
    const k = todayKey(), d = parse(k), D = S.days[k], st = dayStats(k);
    const pct = st.total ? Math.round(st.done / st.total * 100) : 0;
    const habs = activeHabits(), habDone = habs.filter(x => isChecked(x.id, k)).length;
    const hol = holidayOf(k);
    const C = 2 * Math.PI * 30;
    const ring = svgEl(`<circle cx="37" cy="37" r="30" stroke="rgba(255,255,255,.25)" stroke-width="7" fill="none"/>` +
      `<circle cx="37" cy="37" r="30" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct / 100)}"/>`, '0 0 74 74');
    const hero = h('div.card.hero',
      h('div.row',
        h('div',
          h('div.d1', `${d.getFullYear()}년 ${d.getMonth() + 1}월${hol ? ' · ' + hol : ''}`),
          h('div.d2', `${d.getDate()}일 ${WD[d.getDay()]}요일`),
          h('div.d3', heroLine(k))),
        h('div.ring', ring, h('b', h('span', pct + '%', h('small', '계획 달성'))))),
      h('div.pills',
        h('span.pill', `계획 ${st.done}/${st.total}`),
        h('span.pill', `실적 ${st.mins ? fmtMin(st.mins) : '0분'}`),
        habs.length ? h('span.pill', `습관 ${habDone}/${habs.length}`) : null));

    const start = (+S.settings.startHour || 0) % 24;
    const pl = [];
    if (D) {
      range(24).map(i => (start + i) % 24).forEach(hr => {
        const p = D.plan[hr];
        if (!p || !p.t.trim()) return;
        pl.push(h('div.pl', h('span.tm', pad(hr) + ':00'),
          chkBtn(p.d, catColor(p.c), () => { p.d = !p.d; save(); render(); }),
          h('span.tx' + (p.d ? '.done-soft' : ''), p.t)));
      });
      D.todos.forEach(t => {
        if (!t.t.trim()) return;
        pl.push(h('div.pl', h('span.tm', '할 일'),
          chkBtn(t.d, catColor(t.c), () => { t.d = !t.d; save(); render(); }),
          h('span.tx' + (t.d ? '.done-text' : ''), t.t)));
      });
    }
    const openDay = () => { U.tab = 'day'; U.cur = k; U.forceScroll = true; render(); };
    const planCard = h('div.card',
      h('div.card-h', h('h3', '오늘 계획', h('em', `${st.done}/${st.total}`)), h('div.sp'),
        h('button.btn.sm', { onclick: openDay }, '일간 열기', icon('open'))),
      pl.length ? h('div.plist', pl) : h('div.empty', '아직 계획이 없어요. 일간에서 시간별 계획을 적거나 전날 계획을 가져와 보세요.',
        h('div.row', { style: { marginTop: '8px' } },
          h('button.btn.sm', { onclick: () => { U.cur = k; copyPrev('all'); } }, icon('copy'), '전날 계획 가져오기'))),
      h('div.add-line', icon('plus'), h('input.bare', {
        placeholder: '할 일 빠르게 추가 후 Enter', dataset: { focus: 'home-add' },
        onkeydown: e => {
          if (e.key !== 'Enter' || !e.target.value.trim()) return;
          day(k, true).todos.push({ id: uid(), t: e.target.value.trim(), c: null, d: false });
          save(); U.focus = 'home-add'; render();
        }
      })));

    const habitCard = h('div.card',
      h('div.card-h', h('h3', '오늘 습관', habs.length ? h('em', `${habDone}/${habs.length}`) : null), h('div.sp'),
        h('button.btn.sm.ghost', { onclick: () => { U.tab = 'habit'; U.cur = k; render(); } }, '습관 보기', icon('open'))),
      habs.length ? h('div.hchips', habs.map(hb => {
        const on = isChecked(hb.id, k);
        return h('button.chip' + (on ? '.on' : ''), { style: { '--c': hb.c }, onclick: () => { toggleCheck(hb.id, k); render(); } },
          on ? icon('check') : h('span.dot', { style: { '--c': hb.c } }), hb.name);
      })) : h('div.empty', '습관 탭에서 매일 체크할 습관을 추가해 보세요.'));

    const ups = upcoming(k, 60, 8);
    const upCard = h('div.card',
      h('div.card-h', h('h3', '다가오는 날', h('em', '60일'))),
      ups.length ? ups.map(u => h('div.up',
        h('span.dd' + (u.i <= 7 ? '.hot' : ''), u.i === 0 ? '오늘' : 'D-' + u.i),
        h('span.dot', { style: { '--c': u.c || '#cbd5e1' } }),
        h('span.tx', u.kind === 'yr' ? '★ ' + u.t : u.t),
        h('span.dt', shortLabel(u.dk))))
        : h('div.empty', '연간·월간에 적은 일정과 공휴일이 여기에 모입니다.'));

    const pins = S.memos.filter(m => m.pin).slice(0, 4);
    const pinCard = pins.length ? h('div.card',
      h('div.card-h', h('h3', '고정 메모'), h('div.sp'),
        h('button.btn.sm.ghost', { onclick: () => setTab('memo') }, '메모 보기', icon('open'))),
      pins.map(memoCard)) : null;

    const note = (S.mNotes[ym(k)] || '').trim();
    const goalCard = h('div.card',
      h('div.card-h', h('h3', `${d.getMonth() + 1}월 목표`), h('div.sp'),
        h('button.btn.sm.ghost', { onclick: () => { U.tab = 'month'; U.cur = k; render(); } }, '월간 보기', icon('open'))),
      note ? h('div', { style: { whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '13.5px' } }, note)
        : h('div.empty', '월간 화면 아래에 이달의 목표를 적으면 여기에 보입니다.'));

    const J = S.journal[k], jm = J && MOODS[J.mood];
    const openJ = () => { U.tab = 'journal'; U.cur = k; U.forceScroll = true; render(); };
    const jCard = h('div.card',
      h('div.card-h', h('h3', '오늘의 일기'), h('div.sp'),
        h('button.btn.sm' + (jHas(J) ? '.ghost' : '.pri'), { onclick: openJ }, jHas(J) ? '이어 쓰기' : '일기 쓰기', icon('open'))),
      jHas(J) ? h('div.row', { style: { cursor: 'pointer' }, onclick: openJ },
        h('span', { style: { fontSize: '28px' } }, jm ? jm.e : '📝'),
        h('div.grow', h('div', { style: { fontWeight: '700' } }, jSummary(J)),
          h('div.muted', { style: { fontSize: '12px', marginTop: '2px' } },
            [jm && jm.n, J.wx && (WEATHER.find(w => w[0] === J.wx) || [])[2], ...J.acts.map(a => (ACTS.find(z => z[0] === a) || [0, 0, a])[2])].filter(Boolean).join(' · '))))
        : h('div.empty', '💭 ' + promptFor(k)));

    if (isWide()) return h('div.home-grid', h('div.col', hero, planCard, habitCard, jCard), h('div.col', upCard, pinCard, goalCard));
    return h('div', hero, planCard, habitCard, jCard, upCard, pinCard, goalCard);
  }

  // ---------- 월간 ----------
  function viewMonth() {
    const k = U.cur, d = parse(k), y = d.getFullYear(), m0 = d.getMonth(), t = todayKey(), ws = S.settings.weekStart;
    const first = keyOf(new Date(y, m0, 1)), off = (parse(first).getDay() - ws + 7) % 7;
    const start = addDays(first, -off), weeks = Math.ceil((off + daysIn(y, m0)) / 7);
    const heads = range(7).map(i => { const w = (ws + i) % 7; return h('div.mh' + (w === 6 ? '.sat' : w === 0 ? '.sun' : ''), WD[w]); });
    const cells = range(weeks * 7).map(i => {
      const dk = addDays(start, i), dd = parse(dk), w = dd.getDay(), hol = holidayOf(dk);
      const st = dayStats(dk);
      const items = [
        ...yearItemsOn(dk).filter(it => it.t.trim()).map(it => h('div.mi.yr', { style: { '--c': catColor(it.c) || YEAR_DEFAULT_COLOR } }, '★ ' + it.t)),
        ...(S.mItems[dk] || []).filter(it => it.t.trim()).map(it => h('div.mi', { style: { '--c': catColor(it.c) || '#94a3b8' } }, it.t))
      ];
      const show = 3;
      return h('div.mcell' + (dd.getMonth() !== m0 ? '.out' : '') + (w === 6 ? '.sat' : '') + (w === 0 ? '.sun' : '') +
        (hol ? '.hol' : '') + (dk === t ? '.today' : ''), { onclick: () => openDateSheet(dk, 'month') },
        h('div.mtop', h('span.mnum', dd.getDate()), hol && h('span.hname', hol),
          S.journal[dk] && S.journal[dk].mood ? h('span.mmood', { title: '일기 기분: ' + MOODS[S.journal[dk].mood].n }, MOODS[S.journal[dk].mood].e) : null),
        items.slice(0, show),
        items.length > show && h('div.more', `+${items.length - show}`),
        st.total ? h('div.mprog', { title: `계획 ${st.done}/${st.total} 완료` },
          h('i', { style: { width: Math.round(st.done / st.total * 100) + '%' } })) : null);
    });
    const grid = h('div.card', { style: { padding: '6px 6px 4px' } }, h('div.mgrid', heads, cells));
    const goals = h('div.card',
      h('div.card-h', h('h3', `${m0 + 1}월 목표 · 메모`)),
      h('textarea.bare.auto', {
        rows: 4, placeholder: '이달에 꼭 할 일, 목표, 메모', value: S.mNotes[ym(k)] || '',
        oninput: e => { S.mNotes[ym(k)] = e.target.value; autosize(e.target); save(); }
      }));
    if (isWide()) {
      const minis = h('div.card', miniMonth(addMonths(first, -1)), h('div', { style: { height: '14px' } }), miniMonth(addMonths(first, 1)));
      return h('div.month-layout', h('div', grid), h('div', goals, minis));
    }
    return h('div', grid, goals);
  }

  // 월간·연간 칸을 누르면 여는 날짜 편집 창
  function monthEditor(dk) {
    const list = S.mItems[dk] || [];
    return [
      list.map((it, i) => h('div.ed-item',
        catBtn(it.c, a => openCatMenu(a, it.c, id => { it.c = id; save(); drawSheet(); })),
        h('input.bare', { value: it.t, oninput: e => { it.t = e.target.value; save(); } }),
        h('button.ib.sm', {
          title: '삭제', onclick: () => {
            list.splice(i, 1);
            if (!list.length) delete S.mItems[dk];
            save(); drawSheet();
          }
        }, icon('x')))),
      h('div.add-line', icon('plus'), h('input.bare', {
        placeholder: '일정 추가 후 Enter', dataset: { focus: 'mi-add' },
        onkeydown: e => {
          if (e.key !== 'Enter' || !e.target.value.trim()) return;
          (S.mItems[dk] = S.mItems[dk] || []).push({ id: uid(), t: e.target.value.trim(), c: null });
          save(); U.focus = 'mi-add'; drawSheet();
        }
      }))
    ];
  }
  function yearEditor(dk) {
    return [
      yearItemsOn(dk).map(it => {
        const since = it.date !== dk ? `${it.date.slice(0, 4)}년부터 매년` : '매년 같은 날 표시';
        return h('div.ed-item',
          catBtn(it.c, a => openCatMenu(a, it.c, id => { it.c = id; save(); drawSheet(); })),
          h('input.bare', { value: it.t, oninput: e => { it.t = e.target.value; save(); } }),
          h('button.chip' + (it.rep ? '.on' : ''), {
            title: since, style: { '--c': '#8b5cf6', padding: '3px 9px' },
            onclick: () => { it.rep = !it.rep; save(); drawSheet(); }
          }, icon('repeat'), '매년'),
          h('button.ib.sm', {
            title: '삭제', onclick: () => { S.yItems.splice(S.yItems.indexOf(it), 1); save(); drawSheet(); }
          }, icon('x')));
      }),
      h('div.add-line', icon('plus'), h('input.bare', {
        placeholder: '기념일·연간 일정 추가 후 Enter', dataset: { focus: 'yi-add' },
        onkeydown: e => {
          if (e.key !== 'Enter' || !e.target.value.trim()) return;
          S.yItems.push({ id: uid(), date: dk, t: e.target.value.trim(), c: null, rep: false });
          save(); U.focus = 'yi-add'; drawSheet();
        }
      }))
    ];
  }
  function openDateSheet(dk, from) {
    openSheet(() => {
      const d = parse(dk), hol = holidayOf(dk), st = dayStats(dk);
      const monthSec = h('div.sec', h('div.sec-t', '월간 일정'), monthEditor(dk));
      const yearSec = h('div.sec', h('div.sec-t', '연간 · 기념일 (연간 화면과 월간 칸에 ★로 표시)'), yearEditor(dk));
      return [
        h('div.sheet-h',
          h('h2', `${from === 'year' ? d.getFullYear() + '년 ' : ''}${d.getMonth() + 1}월 ${d.getDate()}일 (${WD[d.getDay()]})`, hol && h('small', hol)),
          h('button.ib', { title: '닫기', onclick: () => closeSheet() }, icon('x'))),
        from === 'year' ? [yearSec, monthSec] : [monthSec, yearSec],
        h('div.sec', h('div.sec-t', '일간'),
          h('div.row',
            h('div.grow.muted', { style: { fontSize: '13px' } },
              st.total || st.mins ? `계획 ${st.done}/${st.total} 완료 · 실적 ${fmtMin(st.mins)}` : '아직 기록이 없습니다'),
            h('button.btn.sm.pri', {
              onclick: () => { sheet = null; drawSheet(); U.tab = 'day'; U.cur = dk; U.forceScroll = true; render(); }
            }, '일간 열기', icon('open'))))
      ];
    }, from === 'year' ? 'yi-add' : 'mi-add');
  }

  // ---------- 연간 ----------
  function viewYear() {
    const y = parse(U.cur).getFullYear(), t = todayKey(), wide = isWide();
    const half = U.half || (wide ? 'all' : (parse(U.cur).getMonth() < 6 ? 'h1' : 'h2'));
    const months = half === 'h1' ? range(6) : half === 'h2' ? range(6).map(i => i + 6) : range(12);
    const nowD = new Date(), curM = nowD.getFullYear() === y ? nowD.getMonth() : -1;
    const idx = {};
    for (const it of S.yItems) {
      if (!it.t.trim()) continue;
      const iy = +it.date.slice(0, 4);
      if (iy === y || (it.rep && iy < y)) (idx[it.date.slice(5)] = idx[it.date.slice(5)] || []).push(it);
    }
    const seg = h('div.halfseg', [['h1', '상반기'], ['h2', '하반기'], ['all', '전체']].map(o =>
      h('button' + (half === o[0] ? '.on' : ''), { onclick: () => { U.half = o[0]; render(); } }, o[1])));
    const thead = h('thead', h('tr', h('th.dn', ''), months.map(m0 => h('th' + (m0 === curM ? '.cur' : ''), (m0 + 1) + '월'))));
    const tbody = h('tbody', range(31).map(di => h('tr', h('td.dn', di + 1), months.map(m0 => {
      if (di + 1 > daysIn(y, m0)) return h('td.yc.void');
      const dk = `${y}-${pad(m0 + 1)}-${pad(di + 1)}`, w = parse(dk).getDay(), hol = holidayOf(dk);
      const its = idx[dk.slice(5)] || [], first = its[0], col = first ? (catColor(first.c) || YEAR_DEFAULT_COLOR) : null;
      return h('td.yc' + (w === 6 ? '.sat' : '') + (w === 0 ? '.sun' : '') + (hol ? '.hol' : '') + (dk === t ? '.today' : '') + (first ? '.has' : ''), {
        style: col ? { '--c': col } : null,
        title: [hol, ...its.map(x => x.t + (x.rep ? ' (매년)' : ''))].filter(Boolean).join(' · ') || null,
        onclick: () => openDateSheet(dk, 'year')
      }, h('div', h('span.wd', WD[w]), first && h('span.yt', first.t + (its.length > 1 ? ` +${its.length - 1}` : '')),
        first && first.rep && h('span.rep', '↻')));
    }))));
    const goals = h('div.card',
      h('div.card-h', h('h3', `${y}년 목표`)),
      h('textarea.bare.auto', {
        rows: 2, placeholder: '올해 이루고 싶은 것', value: S.yNotes[y] || '',
        oninput: e => { S.yNotes[y] = e.target.value; autosize(e.target); save(); }
      }));
    return h('div', goals,
      h('div.card', { style: { padding: '10px 10px 6px' } },
        h('div.card-h', { style: { padding: '0 4px' } }, h('h3', `${y}년 한눈에`), h('div.sp'), seg),
        h('div.ywrap', { dataset: { keepx: '' } }, h('table.ytable', thead, tbody))));
  }

  // ---------- 습관 ----------
  function openHabitSheet(id) {
    openSheet(() => {
      const hb = S.habits.find(x => x.id === id);
      if (!hb) return [];
      const i = S.habits.indexOf(hb);
      const moveBy = n => {
        const j = i + n;
        if (j < 0 || j >= S.habits.length) return;
        S.habits.splice(i, 1); S.habits.splice(j, 0, hb);
        save(); drawSheet();
      };
      return [
        h('div.sheet-h', h('h2', '습관 편집'), h('button.ib', { title: '닫기', onclick: () => closeSheet() }, icon('x'))),
        h('input.field', { value: hb.name, dataset: { focus: 'hb-name' }, oninput: e => { hb.name = e.target.value; save(); } }),
        h('div.sec', h('div.sec-t', '색'), h('div.swatches', PALETTE.map(c => h('button.sw' + (hb.c === c ? '.on' : ''), {
          style: { '--c': c }, title: c, onclick: () => { hb.c = c; save(); drawSheet(); }
        })))),
        h('div.sec.row',
          h('button.btn.sm', { onclick: () => moveBy(-1), disabled: i === 0 }, '위로'),
          h('button.btn.sm', { onclick: () => moveBy(1), disabled: i === S.habits.length - 1 }, '아래로'),
          h('div.sp.grow'),
          h('button.btn.sm.danger', {
            onclick: () => {
              const checks = S.checks[hb.id];
              sheet = null; drawSheet();
              delete S.checks[hb.id];
              removeWithUndo(S.habits, hb, `‘${hb.name}’ 습관을 지웠습니다`, () => { if (checks) S.checks[hb.id] = checks; });
            }
          }, icon('trash'), '삭제'))
      ];
    }, null, () => { const hb = S.habits.find(x => x.id === id); if (hb && !hb.name.trim()) hb.name = '이름 없는 습관'; save(); });
  }
  function viewHabit() {
    const k = U.cur, d = parse(k), y = d.getFullYear(), m0 = d.getMonth(), n = daysIn(y, m0), t = todayKey();
    const habits = activeHabits();
    const dkOf = i => `${y}-${pad(m0 + 1)}-${pad(i + 1)}`;
    const elapsed = ym(k) === ym(t) ? +t.slice(8) : (ym(k) < ym(t) ? n : 0);
    const head = h('tr', h('th.hn', ''), range(n).map(i => {
      const dk = dkOf(i), w = parse(dk).getDay();
      return h('th' + (w === 6 ? '.sat' : '') + ((w === 0 || holidayOf(dk)) ? '.sun' : '') + (dk === t ? '.cur' : ''), WD[w], h('b', i + 1));
    }));
    const rows = habits.map(hb => {
      const ch = S.checks[hb.id] || {};
      let cnt = 0;
      const cells = range(n).map(i => {
        const dk = dkOf(i), on = !!ch[dk];
        if (on && i < elapsed) cnt++;
        return h('td' + (dk === t ? '.cur' : ''), h('button.hc' + (on ? '.on' : '') + (dk > t ? '.future' : ''), {
          style: { '--c': hb.c }, title: `${m0 + 1}/${i + 1} ${hb.name}`, onclick: () => { toggleCheck(hb.id, dk); render(); }
        }, svgEl(CHECK)));
      });
      const pct = elapsed ? Math.round(cnt / elapsed * 100) : 0;
      const sk = streak(hb.id);
      return h('tr',
        h('td.hn', h('button', { title: '편집', onclick: () => openHabitSheet(hb.id) },
          h('span.dot', { style: { '--c': hb.c } }),
          h('span.hname2', h('span', hb.name), h('small', `달성 ${pct}%${sk ? ` · 연속 ${sk}일` : ''}`)))),
        cells);
    });
    return h('div', h('div.card',
      h('div.card-h', h('h3', '습관 체크', h('em', `${y}년 ${m0 + 1}월`)), h('div.sp'),
        h('span.muted', { style: { fontSize: '11px' } }, '이름을 누르면 색·순서 편집')),
      habits.length
        ? h('div.hwrap', { dataset: { keepx: '' } }, h('table.htable', h('thead', head), h('tbody', rows)))
        : h('div.empty', '매일 체크할 습관을 추가해 보세요. 예) 운동 30분 · 물 2L · 독서 20쪽'),
      h('div.add-line', { style: { marginTop: '10px' } }, icon('plus'), h('input.bare', {
        placeholder: '새 습관 이름 입력 후 Enter', dataset: { focus: 'hb-add' },
        onkeydown: e => {
          if (e.key !== 'Enter' || !e.target.value.trim()) return;
          S.habits.push({ id: uid(), name: e.target.value.trim(), c: PALETTE[(S.habits.length * 5 + 1) % PALETTE.length], arch: false });
          save(); U.focus = 'hb-add'; render();
        }
      }))));
  }
  function scrollHabit(view) {
    const wrap = view.querySelector('.hwrap'), cur = wrap && wrap.querySelector('th.cur');
    if (cur) wrap.scrollLeft = Math.max(0, cur.offsetLeft - wrap.clientWidth / 2);
  }

  // ---------- 일기 ----------
  // 기분 5단계 + 날씨 + 한 일(하루콩·Daylio), 한 줄·본문(Day One), 감사 3가지(5분 일기), 기분 달력·지난 해 오늘.
  const MOODS = [null,
    { e: '😢', n: '힘듦', c: '#ef4444' },
    { e: '😕', n: '별로', c: '#8b5cf6' },
    { e: '😐', n: '보통', c: '#94a3b8' },
    { e: '🙂', n: '좋음', c: '#10b981' },
    { e: '😆', n: '최고', c: '#f59e0b' }];
  const WEATHER = [['sun', '☀️', '맑음'], ['cloud', '⛅', '구름'], ['gray', '☁️', '흐림'], ['rain', '🌧️', '비'], ['snow', '❄️', '눈']];
  const ACTS = [['work', '💼', '업무'], ['meet', '🤝', '만남'], ['family', '👨‍👩‍👧', '가족'], ['exercise', '🏃', '운동'],
    ['study', '📚', '공부·독서'], ['food', '🍽️', '맛있는 것'], ['rest', '🛋️', '휴식'], ['hobby', '🎬', '취미'],
    ['outing', '🚗', '나들이'], ['shop', '🛍️', '쇼핑'], ['late', '🌙', '야근'], ['sick', '🤒', '아픔']];
  const PROMPTS = ['오늘 가장 기억에 남는 순간은?', '오늘 나를 웃게 한 일은?', '오늘 새로 배운 것 한 가지는?',
    '내일의 나에게 하고 싶은 말은?', '오늘 고마웠던 사람은?', '오늘 힘들었던 일과 그때 마음은?', '오늘 잘한 일 한 가지는?',
    '요즘 가장 많이 생각하는 것은?', '오늘을 한 단어로 표현하면?', '이번 주에 기대되는 일은?'];
  const GRAT_HINT = ['고마운 사람·일', '오늘 잘한 일', '기분 좋았던 순간'];
  function jOf(k, create) {
    let J = S.journal[k];
    if (!J && create) J = S.journal[k] = { mood: 0, wx: '', acts: [], title: '', body: '', grat: ['', '', ''], u: 0 };
    return J || null;
  }
  const jHas = J => !!(J && (J.mood || J.wx || J.acts.length || J.title.trim() || J.body.trim() || J.grat.some(g => g.trim())));
  function jTouch(k) { jOf(k, true).u = Date.now(); save(); }
  function jStreak() {
    let k = todayKey(), n = 0;
    if (!jHas(S.journal[k])) k = addDays(k, -1);
    while (jHas(S.journal[k])) { n++; k = addDays(k, -1); }
    return n;
  }
  function promptFor(k) {
    const d = parse(k);
    return PROMPTS[(d.getFullYear() * 372 + d.getMonth() * 31 + d.getDate() + (U.promptShift || 0)) % PROMPTS.length];
  }
  function jSummary(J) {
    return J.title.trim() || J.body.trim().split('\n')[0] || J.grat.find(g => g.trim()) || '(기분만 기록)';
  }
  function jRow(k) {
    const J = S.journal[k], m = MOODS[J.mood], d = parse(k);
    return h('button.jrow', { onclick: () => { U.tab = 'journal'; U.cur = k; U.jq = ''; U.forceScroll = true; render(); } },
      h('span.jem', m ? m.e : '📝'),
      h('span.jtx', h('b', jSummary(J)), h('small', `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${WD[d.getDay()]})`)));
  }

  function journalEditor(k) {
    const J = S.journal[k] || null, d = parse(k), t = todayKey(), hol = holidayOf(k);
    const rel = k === t ? '오늘' : k === addDays(t, -1) ? '어제' : '';
    const pick = fn => () => { fn(jOf(k, true)); jTouch(k); render(); };
    const count = h('span');
    const setCount = () => { const n = (J ? J.body : '').length; count.textContent = n ? `${n.toLocaleString()}자` : ''; };
    const body = h('textarea.bare.auto.jbody', {
      rows: 6, placeholder: '위 질문에 답하거나, 오늘 있었던 일을 자유롭게 적어 보세요.', value: J ? J.body : '', dataset: { focus: 'j-body' },
      oninput: e => { jOf(k, true).body = e.target.value; autosize(e.target); count.textContent = e.target.value.length ? `${e.target.value.length.toLocaleString()}자` : ''; jTouch(k); }
    });
    setCount();
    return h('div.card.jcard',
      h('div.dayhead',
        h('div.big', d.getDate()),
        h('div.meta', h('b', `${d.getFullYear()}년 ${d.getMonth() + 1}월 · ${WD[d.getDay()]}요일`),
          h('span', hol && h('span.hol', hol), hol && rel ? ' · ' : '', rel || (hol ? '' : ' '))),
        h('div.sp'),
        J && J.u ? h('span.muted', { style: { fontSize: '11px' } }, '수정 ' + fmtStamp(J.u)) : null),
      h('div.sec-t', '오늘 기분'),
      h('div.moods', [5, 4, 3, 2, 1].map(v => h('button.mood' + (J && J.mood === v ? '.on' : ''), {
        style: { '--c': MOODS[v].c }, title: MOODS[v].n, onclick: pick(JJ => { JJ.mood = JJ.mood === v ? 0 : v; })
      }, h('span.em', MOODS[v].e), h('small', MOODS[v].n)))),
      h('div.sec', h('div.sec-t', '날씨'), h('div.chips', WEATHER.map(w => h('button.chip' + (J && J.wx === w[0] ? '.on' : ''), {
        onclick: pick(JJ => { JJ.wx = JJ.wx === w[0] ? '' : w[0]; })
      }, h('span.ej', w[1]), w[2])))),
      h('div.sec', h('div.sec-t', '오늘 한 일'), h('div.chips', ACTS.map(a => h('button.chip' + (J && J.acts.includes(a[0]) ? '.on' : ''), {
        onclick: pick(JJ => { const i = JJ.acts.indexOf(a[0]); if (i >= 0) JJ.acts.splice(i, 1); else JJ.acts.push(a[0]); })
      }, h('span.ej', a[1]), a[2])))),
      h('div.sec', h('input.bare.jtitle', {
        placeholder: '오늘을 한 줄로', value: J ? J.title : '', dataset: { focus: 'j-title' },
        oninput: e => { jOf(k, true).title = e.target.value; jTouch(k); }
      })),
      h('div.prompt', h('span', '💭 ' + promptFor(k)),
        h('button', { onclick: () => { U.promptShift = (U.promptShift || 0) + 1; render(); } }, '다른 질문')),
      body,
      h('div.jfoot', count),
      h('div.sec', h('div.sec-t', '감사한 일 3가지 · 5분 일기'),
        range(3).map(i => h('div.gline', h('span.gn', i + 1), h('input.bare', {
          placeholder: GRAT_HINT[i], value: J ? J.grat[i] : '', dataset: { focus: 'j-g' + i },
          oninput: e => { jOf(k, true).grat[i] = e.target.value; jTouch(k); }
        })))));
  }

  function moodCalendar(k) {
    const d = parse(k), y = d.getFullYear(), m0 = d.getMonth(), ws = S.settings.weekStart, t = todayKey();
    const first = keyOf(new Date(y, m0, 1)), off = (parse(first).getDay() - ws + 7) % 7;
    const start = addDays(first, -off), weeks = Math.ceil((off + daysIn(y, m0)) / 7);
    const counts = [0, 0, 0, 0, 0, 0], acts = {};
    let written = 0;
    for (let i = 1; i <= daysIn(y, m0); i++) {
      const J = S.journal[`${y}-${pad(m0 + 1)}-${pad(i)}`];
      if (!jHas(J)) continue;
      written++;
      counts[J.mood || 0]++;
      J.acts.forEach(a => { acts[a] = (acts[a] || 0) + 1; });
    }
    const moodN = counts.slice(1).reduce((a, b) => a + b, 0);
    const topActs = Object.entries(acts).sort((a, b) => b[1] - a[1]).slice(0, 4);
    return h('div.card',
      h('div.card-h', h('h3', '기분 달력', h('em', `${m0 + 1}월`)), h('div.sp'),
        h('span.muted', { style: { fontSize: '11.5px' } }, `${written}일 작성 · 연속 ${jStreak()}일`)),
      h('div.mgrid.jcal',
        range(7).map(i => { const w = (ws + i) % 7; return h('div.mh' + (w === 6 ? '.sat' : w === 0 ? '.sun' : ''), WD[w]); }),
        range(weeks * 7).map(i => {
          const dk = addDays(start, i), dd = parse(dk), J = S.journal[dk], m = J && MOODS[J.mood];
          return h('button.jd' + (dd.getMonth() !== m0 ? '.out' : '') + (dk === k ? '.sel' : '') + (dk === t ? '.today' : '') + (dk > t ? '.future' : ''), {
            title: J && jHas(J) ? jSummary(J) : null,
            onclick: () => { U.cur = dk; U.forceScroll = true; render(); }
          }, h('small', dd.getDate()), h('span', m ? m.e : jHas(J) ? '📝' : ''));
        })),
      moodN ? [h('div.stack', [5, 4, 3, 2, 1].filter(v => counts[v]).map(v => h('i', {
        title: `${MOODS[v].n} ${counts[v]}일`, style: { '--c': MOODS[v].c, width: (counts[v] / moodN * 100) + '%' }
      }))), h('div.legend', [5, 4, 3, 2, 1].filter(v => counts[v]).map(v => h('span', MOODS[v].e, MOODS[v].n, h('b', counts[v] + '일'))))] : null,
      topActs.length ? h('div.legend', { style: { marginTop: '6px' } }, h('span.muted', '자주 한 일'),
        topActs.map(a => { const x = ACTS.find(z => z[0] === a[0]); return h('span', x ? x[1] + ' ' + x[2] : a[0], h('b', a[1])); })) : null);
  }

  function onThisDay(k) {
    const md = k.slice(5), y = k.slice(0, 4);
    const list = Object.keys(S.journal).filter(x => x.slice(5) === md && x.slice(0, 4) < y && jHas(S.journal[x])).sort().reverse();
    if (!list.length) return null;
    return h('div.card', h('div.card-h', h('h3', '지난 해 오늘')), list.map(jRow));
  }

  function viewJournal() {
    const k = U.cur;
    const results = h('div');
    const draw = () => {
      const q = (U.jq || '').trim().toLowerCase();
      if (!q) { results.replaceChildren(); return; }
      const hits = Object.keys(S.journal).filter(x => {
        const J = S.journal[x];
        return jHas(J) && [J.title, J.body, ...J.grat, ...J.acts.map(a => (ACTS.find(z => z[0] === a) || [0, 0, ''])[2])].join('\n').toLowerCase().includes(q);
      }).sort().reverse();
      results.replaceChildren(h('div.card', h('div.card-h', h('h3', '검색 결과', h('em', hits.length + '건'))),
        hits.length ? hits.slice(0, 50).map(jRow) : h('div.empty', '찾는 내용이 없습니다.')));
    };
    draw();
    const search = h('div.search', { style: { marginBottom: '12px' } }, icon('search'),
      h('input.field', { placeholder: '일기 검색 (한 줄·본문·감사·한 일)', value: U.jq || '', dataset: { focus: 'j-search' }, oninput: e => { U.jq = e.target.value; draw(); } }));
    if (isWide()) {
      return h('div.day-layout',
        h('div.day-side', { dataset: { keepy: '' } }, search, results, moodCalendar(k), onThisDay(k)),
        h('div.day-main', { dataset: { keepy: '' } }, journalEditor(k)));
    }
    return h('div', search, results, journalEditor(k), moodCalendar(k), onThisDay(k));
  }

  // ---------- 메모 ----------
  function newMemo() {
    const m = { id: uid(), title: '', body: '', c: null, pin: false, u: Date.now() };
    S.memos.unshift(m);
    save();
    openMemoSheet(m.id, true);
  }
  function openMemoSheet(id, isNew) {
    openSheet(() => {
      const m = S.memos.find(x => x.id === id);
      if (!m) return [];
      const touch = () => { m.u = Date.now(); save(); };
      return [
        h('div.sheet-h', h('h2', isNew ? '새 메모' : '메모'),
          h('button.ib' + (m.pin ? '.on' : ''), { title: m.pin ? '고정 해제' : '위에 고정 (오늘 화면에도 표시)', onclick: () => { m.pin = !m.pin; save(); drawSheet(); } }, icon('pin')),
          h('button.ib', { title: '닫기', onclick: () => closeSheet() }, icon('x'))),
        h('input.field', {
          value: m.title, placeholder: '제목', dataset: { focus: 'memo-title' }, style: { fontWeight: '700', fontSize: '15px' },
          oninput: e => { m.title = e.target.value; touch(); }
        }),
        h('textarea.field.auto', {
          value: m.body, rows: 8, placeholder: '내용', style: { marginTop: '8px', lineHeight: '1.6', resize: 'none', minHeight: '160px' },
          oninput: e => { m.body = e.target.value; autosize(e.target); touch(); }
        }),
        h('div.sec', h('div.sec-t', '색 분류'), h('div.row.wrap', { style: { gap: '6px' } },
          h('button.chip' + (!m.c ? '.on' : ''), { onclick: () => { m.c = null; save(); drawSheet(); } }, '없음'),
          S.settings.cats.map(c => h('button.chip' + (m.c === c.id ? '.on' : ''), {
            style: { '--c': c.color }, onclick: () => { m.c = c.id; save(); drawSheet(); }
          }, h('span.dot', { style: { '--c': c.color } }), c.name)))),
        h('div.sec.row',
          h('div.grow.muted', { style: { fontSize: '12px' } }, '수정 ' + fmtStamp(m.u)),
          h('button.btn.sm.danger', {
            onclick: () => { sheet = null; drawSheet(); removeWithUndo(S.memos, m, '메모를 지웠습니다'); }
          }, icon('trash'), '삭제'))
      ];
    }, isNew ? 'memo-title' : null, () => {
      const m = S.memos.find(x => x.id === id);
      if (m && !m.title.trim() && !m.body.trim()) { S.memos.splice(S.memos.indexOf(m), 1); save(); }
    });
  }
  function viewMemo() {
    const box = h('div');
    const draw = () => {
      const q = (U.q || '').trim().toLowerCase();
      const arr = S.memos.filter(m => !q || (m.title + '\n' + m.body).toLowerCase().includes(q))
        .sort((a, b) => (b.pin - a.pin) || (b.u - a.u));
      box.replaceChildren(arr.length ? h('div.memo-grid', arr.map(memoCard))
        : h('div.card.empty', q ? '검색 결과가 없습니다.' : '메모가 없습니다. ‘새 메모’로 시작해 보세요.'));
    };
    draw();
    return h('div',
      h('div.mtool',
        h('div.search', icon('search'), h('input.field', { placeholder: '메모 검색', value: U.q, oninput: e => { U.q = e.target.value; draw(); } })),
        h('button.btn.pri', { onclick: newMemo }, icon('plus'), '새 메모')),
      box);
  }

  // ---------- 설정 ----------
  function exportData() {
    flush();
    const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
    const a = h('a', { href: URL.createObjectURL(blob), download: `만능다이어리_백업_${todayKey()}.json` });
    document.body.append(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    toast('백업 파일을 내려받았습니다');
  }
  function importData() {
    const inp = h('input', { type: 'file', accept: '.json,application/json' });
    inp.addEventListener('change', () => {
      const f = inp.files[0];
      if (!f) return;
      f.text().then(txt => {
        let data;
        try { data = JSON.parse(txt); } catch (e) { toast('파일을 읽을 수 없습니다'); return; }
        if (!data || !data.days) { toast('만능 다이어리 백업 파일이 아닙니다'); return; }
        const before = JSON.stringify(S);
        S = normalize(data);
        save();
        sheet = null; drawSheet(); render();
        toast('백업을 불러왔습니다', { label: '되돌리기', fn: () => { S = normalize(JSON.parse(before)); save(); render(); } });
      });
    });
    inp.click();
  }
  // 색 분류 순서 바꾸기: 칠할 색 줄·색 고르기 목록·합계 범례가 이 순서를 따른다.
  function moveCat(i, d) {
    const cats = S.settings.cats, j = i + d;
    if (j < 0 || j >= cats.length) return;
    const c = cats.splice(i, 1)[0];
    cats.splice(j, 0, c);
    save();
    drawSheet();
  }
  // 지운 기본 분류만 원래 자리·이름·색으로 되살린다. 이름이나 색을 바꾼 분류와 직접 만든 분류는 그대로 둔다.
  function restoreDefaultCats() {
    const cur = S.settings.cats;
    const missing = DEFAULT_CATS.filter(d => !cur.some(c => c.id === d.id));
    if (!missing.length) { toast('기본 분류가 모두 있습니다'); return; }
    const out = DEFAULT_CATS.map(d => cur.find(c => c.id === d.id) || Object.assign({}, d));
    cur.forEach(c => { if (!DEFAULT_CATS.some(d => d.id === c.id)) out.push(c); });
    S.settings.cats = out;
    save();
    if (sheet) drawSheet(); else render();
    toast(`기본 분류 ${missing.length}개를 되살렸습니다 (${missing.map(m => m.name).join(', ')})`);
  }
  function setRow(title, sub, control) {
    return h('div.set-row', h('div.t', title, sub && h('small', sub)), control);
  }
  function toggleBtn(on, fn) { return h('button.toggle' + (on ? '.on' : ''), { type: 'button', 'aria-pressed': on ? 'true' : 'false', onclick: fn }); }
  function openSettings() {
    openSheet(() => {
      const st = S.settings;
      const sel = (val, opts, fn) => h('select.field', { style: { width: 'auto' }, onchange: e => fn(e.target.value) },
        opts.map(o => h('option', { value: o[0], selected: String(o[0]) === String(val) }, o[1])));
      return [
        h('div.sheet-h', h('h2', '설정'), h('button.ib', { title: '닫기', onclick: () => closeSheet() }, icon('x'))),
        h('div.sec', h('div.sec-t', '색 분류 (계획·실적·일정·메모에 함께 쓰임)'),
          st.cats.map((c, i) => h('div.ed-item.cat-ed',
            h('input', { type: 'color', value: c.color, title: '색 바꾸기', oninput: e => { c.color = e.target.value; save(); } , onchange: () => drawSheet() }),
            h('input.bare', { value: c.name, oninput: e => { c.name = e.target.value; save(); } }),
            h('button.ib.sm', { title: '위로', disabled: i === 0, onclick: () => moveCat(i, -1) }, icon('up')),
            h('button.ib.sm', { title: '아래로', disabled: i === st.cats.length - 1, onclick: () => moveCat(i, 1) }, icon('down')),
            h('button.ib.sm', {
              title: '삭제', disabled: st.cats.length <= 1,
              onclick: () => {
                st.cats.splice(i, 1); save(); drawSheet();
                toast(`‘${c.name}’ 분류를 지웠습니다`, { label: '되돌리기', fn: () => { st.cats.splice(Math.min(i, st.cats.length), 0, c); save(); if (sheet) drawSheet(); else render(); } });
              }
            }, icon('x')))),
          h('div.row.wrap', { style: { marginTop: '8px' } },
            h('button.btn.sm', {
              onclick: () => { st.cats.push({ id: 'c' + uid(), name: '새 분류', color: PALETTE[(st.cats.length * 3) % PALETTE.length] }); save(); drawSheet(); }
            }, icon('plus'), '분류 추가'),
            h('button.btn.sm', { title: '지운 기본 분류(업무·회의·개인·가족·건강·공부·이동·휴식·기념일)를 되살림', onclick: restoreDefaultCats }, icon('repeat'), '기본 분류 되돌리기'))),
        h('div.sec', h('div.sec-t', '화면'),
          setRow('하루 시작 시각', '일간 시간표 첫 줄 (24줄을 이어서 표시)',
            sel(st.startHour, range(13).map(i => [i, pad(i) + '시']), v => { st.startHour = +v; save(); })),
          setRow('한 주 시작', '월간·주간 줄의 첫 요일', sel(st.weekStart, [[1, '월요일'], [0, '일요일']], v => { st.weekStart = +v; save(); })),
          setRow('처음 여는 화면', '프로그램을 열면 오늘 날짜로 이 화면을 띄움',
            sel(st.startTab, TABS.map(t => [t[0], t[1]]), v => { st.startTab = v; save(); }))),
        HOST && h('div.sec', h('div.sec-t', '바탕화면 창'), winControls(),
          winRow('autostart', 'Windows 시작 시 자동 실행', '로그인하면 바로 바탕화면에 뜸')),
        SYNC && h('div.sec', h('div.sec-t', '기기 동기화 (PC · 갤럭시 폰 · 탭)'),
          setRow(syncLabel(), SYNC.state.email || null,
            h('button.btn.sm', { onclick: () => { sheet = null; openSyncSheet(); } }, icon('sync'), '동기화 설정'))),
        h('div.sec', h('div.sec-t', '데이터'),
          h('div.muted', { style: { fontSize: '12px', lineHeight: '1.6', marginBottom: '8px' } },
            HOST ? `이 PC에 자동 저장됩니다: ${HS.folder || '문서\\만능 다이어리'} (하루 한 번 백업 사본도 남김)`
              : '이 기기(브라우저)에 자동 저장됩니다. 기기 사이 연동은 다음 단계에서 붙입니다.'),
          h('div.row.wrap',
            h('button.btn.sm', { onclick: exportData }, icon('download'), '내보내기'),
            h('button.btn.sm', { onclick: importData }, icon('upload'), '가져오기'),
            HOST && h('button.btn.sm', { onclick: () => HOST.postMessage('openfolder') }, icon('folder'), '저장 폴더 열기'))),
        h('div.sec.muted', { style: { fontSize: '11.5px' } }, `만능 다이어리 ${VERSION} · 단축키 ← → 날짜 이동 · T 오늘 · 1~7 화면 전환`)
      ];
    });
  }

  // ---------- 바탕화면 창: 고정 · 틀 고정 · 투명도 ----------
  // 투명도는 창 전체가 아니라 배경만 비치게 한다(--a). 글자와 색칠한 칸은 그대로 선명하다.
  function applyAlpha() {
    if (!HOST) return;
    const clear = HS.hover && Date.now() >= previewUntil && (hovering || document.hasFocus());
    const a = clear ? 1 : 1 - (HS.alpha || 0) / 100;
    document.documentElement.style.setProperty('--a', String(a));
  }
  const WIN_MSG = { pinned: 'pin', locked: 'lock', hover: 'hover', autostart: 'autostart' };
  function winRow(key, title, sub) {
    const btn = toggleBtn(!!HS[key], () => {
      HS[key] = !HS[key];
      btn.classList.toggle('on', HS[key]);
      if (key === 'hover') applyAlpha();
      HOST.postMessage(WIN_MSG[key] + ':' + (HS[key] ? 'on' : 'off'));
    });
    btn.dataset.k = key;
    return setRow(title, sub, btn);
  }
  function alphaRow() {
    const val = h('b.alpha-val', (HS.alpha || 0) + '%');
    const range = h('input.range', {
      type: 'range', min: 0, max: 85, step: 5, value: HS.alpha || 0, dataset: { k: 'alpha' }, 'aria-label': '배경 투명도',
      oninput: e => {
        HS.alpha = +e.target.value;
        val.textContent = HS.alpha + '%';
        previewUntil = Date.now() + 1500;
        applyAlpha();
        clearTimeout(alphaTimer);
        alphaTimer = setTimeout(applyAlpha, 1600);
      },
      onchange: e => HOST.postMessage('alpha:' + e.target.value)
    });
    return h('div.set-row.alpha-row',
      h('div.t', h('span', '배경 투명도 ', val), h('small', '0%는 불투명 · 글자와 색칠은 그대로 선명')),
      range);
  }
  // 화면 배율(글자·칸 크기)과 창 크기 프리셋
  const ZOOMS = [0.7, 0.8, 0.9, 1, 1.1, 1.25, 1.4, 1.5, 1.75];
  const SIZES = [['작게', 400, 760], ['보통', 470, 960], ['크게', 560, 1000], ['넓게', 1000, 900], ['아주 넓게', 1280, 1000]];
  function zoomRow() {
    const cur = HS.zoom || 1;
    const stepZoom = d => {
      let i = ZOOMS.findIndex(z => z >= cur - 0.001);
      if (i < 0) i = ZOOMS.length - 1;
      if (d > 0 && ZOOMS[i] <= cur + 0.001) i++;
      if (d < 0) i--;
      const v = ZOOMS[Math.max(0, Math.min(ZOOMS.length - 1, i))];
      HOST.postMessage('zoom:' + v);
    };
    return setRow('화면 배율', '글자·칸 크기 · Ctrl+마우스 휠로도 조절',
      h('div.zoomctl',
        h('button.ib.sm', { title: '작게', onclick: () => stepZoom(-1) }, icon('minus')),
        h('b', { dataset: { k: 'zoom' } }, Math.round(cur * 100) + '%'),
        h('button.ib.sm', { title: '크게', onclick: () => stepZoom(1) }, icon('plus')),
        h('button.btn.sm.ghost', { title: '100%로', onclick: () => HOST.postMessage('zoom:1') }, '원래대로')));
  }
  function sizeRow() {
    return h('div.set-row.size-row',
      h('div.t', '창 크기', h('small', '누르면 바로 바뀜 · 틀 고정 중에도 적용')),
      h('div.chips', SIZES.map(s => h('button.chip', { title: `${s[1]} × ${s[2]}`, onclick: () => HOST.postMessage(`size:${s[1]}x${s[2]}`) }, s[0]))));
  }
  function winControls() {
    return [
      winRow('pinned', '바탕화면에 고정', 'Win+D에도 남고, 다른 창을 쓰면 뒤로 물러남'),
      winRow('locked', '창 틀 고정', '위치·크기가 끌려서 바뀌지 않게 잠금'),
      alphaRow(),
      winRow('hover', '마우스를 올리면 선명하게', '투명해도 마우스를 올리거나 쓰는 동안은 불투명'),
      zoomRow(),
      sizeRow()
    ];
  }
  function openWinMenu(anchor) {
    openPop(anchor, () => [h('div.ph', '창 설정'), h('div.winpop', winControls())]);
  }

  // ---------- 기기 동기화 ----------
  function syncLabel() {
    const st = SYNC.state;
    if (st.mode === 'off') return '아직 설정 안 함';
    if (st.mode === 'out') return '로그인 필요';
    if (st.mode === 'busy') return st.msg || '동기화하는 중…';
    if (st.mode === 'err') return st.msg || '동기화 오류';
    return st.last ? `동기화됨 · ${fmtStamp(st.last)}` : '연결됨';
  }
  function syncButton() {
    const st = SYNC.state;
    const cls = { out: '.warn', idle: '.ok', busy: '.busy', err: '.err' }[st.mode] || '';
    return h('button.ib.syncbtn' + cls, {
      title: `동기화 — ${syncLabel()}${st.mode === 'idle' ? ' (누르면 지금 동기화, 오른쪽 클릭은 설정)' : ''}`,
      onclick: () => { if (st.mode === 'idle') SYNC.syncNow(true); else openSyncSheet(); },
      oncontextmenu: e => { e.preventDefault(); openSyncSheet(); }
    }, icon('sync'), h('i.sdot'));
  }
  const RULES = "rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    match /users/{uid}/{document=**} {\n      allow read, write: if request.auth != null && request.auth.uid == uid;\n    }\n  }\n}";
  function openSyncSheet() {
    openSheet(() => {
      const st = SYNC.state;
      const out = [
        h('div.sheet-h', h('h2', '기기 동기화'), h('button.ib', { title: '닫기', onclick: () => closeSheet() }, icon('x'))),
        h('div.syncstat.' + st.mode, h('i.sdot'), syncLabel())
      ];
      if (st.mode === 'off' || (!SYNC.configured)) {
        const ta = h('textarea.field', { rows: 6, placeholder: 'const firebaseConfig = { apiKey: "…", authDomain: "…", projectId: "…", appId: "…" };', style: { fontFamily: 'Consolas, monospace', fontSize: '12px' } });
        out.push(
          h('div.guide',
            h('p', 'PC·갤럭시 폰·탭이 같은 다이어리를 쓰려면 무료 구글 Firebase 저장소를 한 번 만들어 연결합니다. (약 10분, 처음 한 번만)'),
            h('ol',
              h('li', 'console.firebase.google.com 에 구글 계정으로 들어가 ‘프로젝트 만들기’ (이름 예: manneung-diary, 애널리틱스는 꺼도 됨)'),
              h('li', '빌드 → Authentication → 시작하기 → 로그인 방법에서 ‘이메일/비밀번호’ 사용 설정'),
              h('li', '빌드 → Firestore Database → 데이터베이스 만들기 (위치: asia-northeast3 서울) → ‘규칙’ 탭에 아래 규칙을 붙여 넣고 게시'),
              h('li', '프로젝트 설정(톱니) → 내 앱 → 웹(</>) 앱 추가 → 나오는 firebaseConfig 코드를 아래 칸에 붙여 넣기')),
            h('div.code', h('pre', RULES), h('button.btn.sm', {
              onclick: () => { navigator.clipboard.writeText(RULES).then(() => toast('규칙을 복사했습니다')); }
            }, icon('copy'), '규칙 복사'))),
          ta,
          h('div.row', { style: { marginTop: '10px', justifyContent: 'flex-end' } },
            h('button.btn.pri', {
              onclick: () => { if (!SYNC.configure(ta.value)) toast('설정 코드에서 apiKey·authDomain·projectId·appId 를 찾지 못했습니다'); }
            }, '연결 설정 저장')));
      } else if (!SYNC.ready) {
        out.push(h('div.sec',
          h('div.muted', { style: { fontSize: '13px', lineHeight: '1.6' } },
            '동기화 서버에 아직 연결되지 않았습니다. 로그인 정보는 이 기기에 남아 있어서, 인터넷이 연결되면 자동으로 다시 이어집니다.'),
          h('div.row', { style: { justifyContent: 'flex-end', marginTop: '8px' } },
            h('button.btn.pri', { onclick: () => SYNC.retry() }, icon('sync'), '지금 다시 연결'))));
      } else if (st.mode === 'out' || (st.mode === 'err' && !st.email)) {
        const em = h('input.field', { type: 'email', placeholder: '이메일', autocomplete: 'username', dataset: { focus: 'sync-email' } });
        const pw = h('input.field', { type: 'password', placeholder: '비밀번호 (6자 이상)', autocomplete: 'current-password', style: { marginTop: '8px' } });
        const msg = h('div.muted', { style: { fontSize: '12.5px', minHeight: '18px', marginTop: '8px' } });
        const go = create => {
          msg.textContent = create ? '계정을 만드는 중…' : '로그인하는 중…';
          SYNC.signIn(em.value.trim(), pw.value, create).then(() => { pw.value = ''; toast('로그인했습니다. 동기화를 시작합니다'); },
            err => { msg.textContent = err.message; });
        };
        pw.addEventListener('keydown', e => { if (e.key === 'Enter') go(false); });
        out.push(
          h('div.sec', h('div.sec-t', '동기화 계정 (모든 기기에서 같은 계정으로 로그인)'), em, pw, msg,
            h('div.row', { style: { justifyContent: 'flex-end', marginTop: '6px' } },
              h('button.btn', { onclick: () => go(true) }, '처음이면 계정 만들기'),
              h('button.btn.pri', { onclick: () => go(false) }, '로그인'))));
      } else {
        out.push(
          h('div.sec', setRow('계정', st.email, h('button.btn.sm', { onclick: () => SYNC.signOut() }, '로그아웃')),
            setRow('지금 동기화', '바꾼 내용은 5초 뒤 보내고, 30분마다·프로그램을 켤 때 자동으로 주고받음. 로그인은 계속 유지됨',
              h('button.btn.sm.pri', { onclick: () => SYNC.syncNow(true) }, icon('sync'), '동기화'))));
      }
      if (SYNC.configured && !SYNC.builtIn) {
        out.push(h('div.sec.row', h('div.grow.muted', { style: { fontSize: '12px' } }, '다른 Firebase 프로젝트로 바꾸려면'),
          h('button.btn.sm.danger', { onclick: () => SYNC.clearConfig() }, '연결 설정 지우기')));
      }
      out.push(h('div.sec.muted', { style: { fontSize: '12px', lineHeight: '1.6' } },
        '갤럭시 폰·탭에서는 다이어리 웹 주소를 열어 ‘홈 화면에 추가’한 뒤 같은 계정으로 로그인하면 같은 내용이 보입니다. 웹 주소는 폰·탭 배포 단계에서 안내합니다.'));
      return out;
    }, 'sync-email');
    sheet.sync = true;
  }

  // ---------- 그리기 ----------
  const VIEWS = { home: viewHome, day: viewDay, journal: viewJournal, month: viewMonth, year: viewYear, habit: viewHabit, memo: viewMemo };
  function sig() {
    const k = U.cur;
    if (U.tab === 'day' || U.tab === 'journal') return U.tab + k;
    if (U.tab === 'month' || U.tab === 'habit') return U.tab + ym(k);
    if (U.tab === 'year') return 'year' + k.slice(0, 4);
    return U.tab;
  }
  // 다시 그린 뒤에도 쓰던 입력 칸에 커서를 돌려놓기 위한 식별자
  function focusKey(el) {
    if (!el || !app.contains(el) || !el.matches('input,textarea')) return null;
    if (el.dataset.focus) return `[data-focus="${el.dataset.focus}"]`;
    if (el.dataset.row) return `[data-row="${el.dataset.row}"][data-col="${el.dataset.col}"]`;
    return null;
  }
  function render() {
    closePop();
    const ae = document.activeElement, fk = focusKey(ae);
    const caret = fk ? [ae.selectionStart, ae.selectionEnd] : null;
    const old = $('.view');
    const keep = !U.forceScroll && old && old.dataset.sig === sig() ? {
      top: old.scrollTop,
      x: Array.from(old.querySelectorAll('[data-keepx]')).map(e => e.scrollLeft),
      y: Array.from(old.querySelectorAll('[data-keepy]')).map(e => e.scrollTop)
    } : null;
    U.forceScroll = false;
    const view = h('main.view' + ((U.tab === 'day' || U.tab === 'journal') && isWide() ? '.split' : ''), { dataset: { sig: sig() } }, VIEWS[U.tab]());
    view.addEventListener('scroll', closePop, { passive: true, capture: true });
    app.replaceChildren(header(), tabsBar(), view);
    view.querySelectorAll('textarea.auto').forEach(autosize);
    if (keep) {
      view.scrollTop = keep.top;
      view.querySelectorAll('[data-keepx]').forEach((e, i) => { e.scrollLeft = keep.x[i] || 0; });
      view.querySelectorAll('[data-keepy]').forEach((e, i) => { e.scrollTop = keep.y[i] || 0; });
    } else if (U.tab === 'day') scrollDay(view);
    else if (U.tab === 'habit') scrollHabit(view);
    if (U.tab === 'day') placeNowLine();
    if (U.focus) {
      const f = document.querySelector(`[data-focus="${U.focus}"]`);
      U.focus = null;
      if (f) f.focus();
    } else if (fk && keep) {
      const f = view.querySelector(fk);
      if (f) { f.focus(); try { f.setSelectionRange(caret[0], caret[1]); } catch (e) { /* 선택 범위가 없는 칸 */ } }
    }
  }

  // ---------- 입력 · 시간 ----------
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if ($('#pop-root').firstChild) { closePop(); return; }
      if (sheet) { closeSheet(); return; }
    }
    const tag = document.activeElement ? document.activeElement.tagName : '';
    if (/INPUT|TEXTAREA|SELECT/.test(tag) || sheet || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); move(1); }
    else if (e.key === 't' || e.key === 'T' || e.key === 'ㅅ') goToday();
    else if (/^[1-7]$/.test(e.key)) setTab(TABS[+e.key - 1][0]);
  });
  document.addEventListener('pointerdown', e => {
    const pop = $('#pop-root').firstChild;
    if (pop && !pop.contains(e.target)) closePop();
  }, true);
  matchMedia('(min-width: 900px)').addEventListener('change', () => render());

  let lastToday = todayKey();
  setInterval(() => {
    const t = todayKey();
    if (t !== lastToday) {
      if (U.cur === lastToday) U.cur = t;
      lastToday = t;
      U.forceScroll = true;
      if (!sheet) render();
    } else placeNowLine();
  }, 30000);

  if (HOST) {
    HOST.addEventListener('message', e => {
      let m = e.data;
      if (typeof m === 'string') { try { m = JSON.parse(m); } catch (err) { return; } }
      if (!m) return;
      if (m.type === 'state') {
        HS = Object.assign(HS, m);
        document.documentElement.classList.toggle('locked', !!HS.locked);
        applyAlpha();
        document.querySelectorAll('#pop-root [data-k]').forEach(el => {
          if (el.dataset.k === 'alpha') { if (document.activeElement !== el) el.value = HS.alpha; }
          else if (el.dataset.k === 'zoom') el.textContent = Math.round((HS.zoom || 1) * 100) + '%';
          else el.classList.toggle('on', !!HS[el.dataset.k]);
        });
        if (sheet) drawSheet();
        const old = $('.top');
        if (old) old.replaceWith(header());
      } else if (m.type === 'today') {
        lastToday = todayKey();
        U.cur = lastToday;
        U.forceScroll = true;
        if (!sheet) render();
      } else if (m.type === 'flush') {
        if (saveTimer) flush();
      }
    });
  }

  if (HOST) {
    const root = document.documentElement;
    root.addEventListener('mouseenter', () => { hovering = true; applyAlpha(); });
    root.addEventListener('mouseleave', () => { hovering = false; applyAlpha(); });
    window.addEventListener('focus', applyAlpha);
    window.addEventListener('blur', applyAlpha);
  }
  if (window.DiarySync) {
    SYNC = window.DiarySync.create({
      getDocs: () => window.DiarySync.toDocs(S),
      applyDocs: docs => { S = normalize(window.DiarySync.fromDocs(docs, S)); flush(true); render(); },
      canSync: () => !(sheet && !sheet.sync) && !paint,
      onStatus: () => {
        const b = $('.syncbtn');
        if (b) b.replaceWith(syncButton());
        if (sheet && sheet.sync) drawSheet();
      },
      toast
    });
  }

  render();
  if (HOST) HOST.postMessage('ready');
  // 폰·탭 웹앱: 홈 화면 설치·오프라인용 서비스 워커 (바탕화면 프로그램과 개발용 localhost 에서는 끔, ?sw=1 로 켬)
  const local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const wantSW = !HOST && 'serviceWorker' in navigator &&
    (local ? /[?&]sw=1/.test(location.search) : location.protocol === 'https:');
  if (wantSW) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* 서비스 워커 없이도 동작 */ });
  }
  window.__diary = { get state() { return S; }, U, render, flush, get sync() { return SYNC; } };
})();
