// 만능 다이어리 기기 동기화 (PC 바탕화면 · 갤럭시 폰 · 탭)
// 저장소: 구글 Firebase(Firestore + 이메일 로그인). 사용자 데이터는 users/{uid}/rec/{기록키} 문서로 나눠 저장한다.
// 병합: 마지막 동기화 시점(base) · 이 기기(local) · 서버(remote)를 비교하는 3자 병합.
//   한쪽만 바뀐 값은 그쪽을 따르고, 둘 다 바뀐 객체는 안쪽 항목별로 다시 비교한다.
//   첫 동기화(base 없음)에서 충돌하면 서버 쪽을, 그 뒤에는 이 기기 쪽을 따른다.
(function (root) {
  'use strict';
  const FB = 'https://www.gstatic.com/firebasejs/10.12.2/';
  const LS_CFG = 'manneung-sync-config';

  // ---------- 순수 함수 (node 시험 가능) ----------
  function stable(x) {
    if (x === undefined) return 'undefined';
    if (x === null || typeof x !== 'object') return JSON.stringify(x);
    if (Array.isArray(x)) return '[' + x.map(stable).join(',') + ']';
    return '{' + Object.keys(x).sort().filter(k => x[k] !== undefined).map(k => JSON.stringify(k) + ':' + stable(x[k])).join(',') + '}';
  }
  const eq = (a, b) => stable(a) === stable(b);
  const clone = x => x === undefined ? undefined : JSON.parse(JSON.stringify(x));
  const isObj = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  const isIdArr = x => Array.isArray(x) && x.every(e => isObj(e) && e.id != null);

  function merge3(b, l, r, preferRemote) {
    if (eq(l, r)) return clone(l);
    if (eq(l, b)) return clone(r);
    if (eq(r, b)) return clone(l);
    if (isObj(l) && isObj(r)) {
      const bb = isObj(b) ? b : {};
      const out = {};
      const keys = new Set([...Object.keys(bb), ...Object.keys(l), ...Object.keys(r)]);
      for (const k of keys) {
        const v = merge3(bb[k], l[k], r[k], preferRemote);
        if (v !== undefined) out[k] = v;
      }
      return out;
    }
    if (isIdArr(l) && isIdArr(r) && (b === undefined || isIdArr(b)) && (l.length || r.length)) {
      const toMap = a => { const m = {}; (a || []).forEach(e => { m[e.id] = e; }); return m; };
      const m = merge3(toMap(b), toMap(l), toMap(r), preferRemote);
      const out = [], seen = new Set();
      for (const e of l.concat(r)) if (m[e.id] && !seen.has(e.id)) { out.push(m[e.id]); seen.add(e.id); }
      return out;
    }
    return clone(preferRemote ? r : l);
  }

  // 다이어리 상태 ↔ 기록 문서 묶음. brush·startTab 은 기기마다 다르게 두는 값이라 빼고 보낸다.
  const LOCAL_SETTINGS = ['brush', 'startTab'];
  const MAPS = { d: 'days', mi: 'mItems', mn: 'mNotes', yn: 'yNotes', ch: 'checks', j: 'journal' };
  const LISTS = { yi: 'yItems', hb: 'habits', mm: 'memos' };
  function toDocs(S) {
    const o = {};
    const st = clone(S.settings || {});
    LOCAL_SETTINGS.forEach(k => delete st[k]);
    o.set = st;
    for (const p in MAPS) for (const k in (S[MAPS[p]] || {})) o[p + ':' + k] = clone(S[MAPS[p]][k]);
    for (const p in LISTS) (S[LISTS[p]] || []).forEach((e, i) => {
      const v = clone(e);
      if (p === 'hb') v.o = i;
      o[p + ':' + e.id] = v;
    });
    return o;
  }
  function fromDocs(o, prev) {
    const S = { v: 1, savedAt: prev.savedAt || 0, settings: clone(prev.settings || {}) };
    for (const p in MAPS) S[MAPS[p]] = {};
    for (const p in LISTS) S[LISTS[p]] = [];
    if (o.set) Object.assign(S.settings, clone(o.set));
    LOCAL_SETTINGS.forEach(k => { if (prev.settings && prev.settings[k] !== undefined) S.settings[k] = prev.settings[k]; });
    for (const key in o) {
      const i = key.indexOf(':');
      if (i < 0) continue;
      const p = key.slice(0, i), id = key.slice(i + 1), v = clone(o[key]);
      if (MAPS[p]) S[MAPS[p]][id] = v;
      else if (LISTS[p]) S[LISTS[p]].push(v);
    }
    S.habits.sort((a, b) => (a.o || 0) - (b.o || 0)).forEach(hb => { delete hb.o; });
    S.yItems.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
    return S;
  }

  // Firebase 설정 코드(firebaseConfig = {...})를 붙여 넣으면 필요한 값만 뽑는다.
  function parseConfig(text) {
    const cfg = {};
    const re = /["']?(apiKey|authDomain|projectId|storageBucket|messagingSenderId|appId)["']?\s*:\s*["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(text || ''))) cfg[m[1]] = m[2];
    return cfg.apiKey && cfg.projectId && cfg.appId && cfg.authDomain ? cfg : null;
  }

  function errText(e) {
    const c = (e && e.code) || '';
    const map = {
      'auth/invalid-credential': '이메일 또는 비밀번호가 맞지 않습니다.',
      'auth/wrong-password': '이메일 또는 비밀번호가 맞지 않습니다.',
      'auth/user-not-found': '이 이메일로 만든 계정이 없습니다. ‘계정 만들기’를 눌러 주세요.',
      'auth/email-already-in-use': '이미 있는 계정입니다. ‘로그인’을 눌러 주세요.',
      'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
      'auth/invalid-email': '이메일 형식이 맞지 않습니다.',
      'auth/missing-password': '비밀번호를 입력해 주세요.',
      'auth/network-request-failed': '인터넷 연결을 확인해 주세요.',
      'auth/too-many-requests': '시도가 너무 많습니다. 잠시 뒤 다시 해 주세요.',
      'auth/operation-not-allowed': 'Firebase에서 이메일/비밀번호 로그인을 켜 주세요 (안내 2번).',
      'auth/api-key-not-valid.-please-pass-a-valid-api-key.': '붙여 넣은 설정 코드의 apiKey가 맞지 않습니다.',
      'permission-denied': 'Firestore 보안 규칙을 확인해 주세요 (안내 3번).',
      'unavailable': '동기화 서버에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.',
      'failed-precondition': 'Firestore 데이터베이스를 먼저 만들어 주세요 (안내 3번).',
      'not-found': 'Firestore 데이터베이스를 먼저 만들어 주세요 (안내 3번).'
    };
    return map[c] || ((e && e.message) ? '동기화 오류: ' + e.message : '동기화 중 오류가 났습니다.');
  }

  // ---------- 기기 저장(IndexedDB): 마지막 동기화 시점 ----------
  function kv(mode, key, val) {
    return new Promise((res, rej) => {
      const rq = indexedDB.open('manneung-sync', 1);
      rq.onupgradeneeded = () => rq.result.createObjectStore('kv');
      rq.onerror = () => rej(rq.error);
      rq.onsuccess = () => {
        const tx = rq.result.transaction('kv', mode === 'get' ? 'readonly' : 'readwrite');
        const st = tx.objectStore('kv');
        const op = mode === 'get' ? st.get(key) : mode === 'set' ? st.put(val, key) : st.delete(key);
        op.onsuccess = () => res(op.result);
        op.onerror = () => rej(op.error);
      };
    });
  }

  // ---------- 동기화 엔진 ----------
  // api: { getDocs(), applyDocs(docs), canSync(), onStatus(), toast(msg) }
  function create(api) {
    const state = { mode: 'off', msg: '', email: '', last: 0 };
    let fb = null, user = null, base = null, lastMs = 0, running = false, again = false, timer = 0, lastTry = 0;

    const setMode = (mode, msg) => { state.mode = mode; state.msg = msg || ''; api.onStatus(); };
    const savedConfig = () => {
      if (root.DIARY_SYNC_CONFIG) return root.DIARY_SYNC_CONFIG;
      try { return JSON.parse(localStorage.getItem(LS_CFG) || 'null'); } catch (e) { return null; }
    };

    async function boot(cfg) {
      setMode('busy', '동기화 서버에 연결하는 중…');
      try {
        const mods = await Promise.all([import(FB + 'firebase-app.js'), import(FB + 'firebase-auth.js'), import(FB + 'firebase-firestore.js')]);
        const appMod = mods[0], auth = mods[1], store = mods[2];
        const app = appMod.getApps().find(a => a.name === 'diary') || appMod.initializeApp(cfg, 'diary');
        fb = { auth, store, au: auth.getAuth(app), db: store.getFirestore(app) };
        auth.onAuthStateChanged(fb.au, async u => {
          user = u;
          if (!u) { base = null; state.email = ''; setMode('out'); return; }
          state.email = u.email || '';
          try { const saved = await kv('get', 'base:' + u.uid); base = saved ? saved.base : {}; lastMs = saved ? saved.lastMs : 0; }
          catch (e) { base = {}; lastMs = 0; }
          setMode('idle');
          syncNow(false);
        });
      } catch (e) {
        fb = null;
        setMode('err', '동기화 서버에 연결할 수 없습니다. 인터넷 연결을 확인해 주세요.');
      }
    }

    async function syncNow(manual) {
      if (!fb || !user) { if (manual) api.toast(state.mode === 'off' ? '먼저 동기화를 설정해 주세요' : '먼저 로그인해 주세요'); return; }
      if (running) { again = true; return; }
      if (!api.canSync()) { schedule(3000); return; }
      running = true; lastTry = Date.now();
      setMode('busy', '동기화하는 중…');
      try {
        const st = fb.store;
        const col = st.collection(fb.db, 'users', user.uid, 'rec');
        const q = lastMs ? st.query(col, st.where('ts', '>=', st.Timestamp.fromMillis(lastMs - 2000))) : col;
        const snap = await st.getDocs(q);
        const R = Object.assign({}, base);
        let maxMs = lastMs;
        snap.forEach(d => {
          const x = d.data();
          if (x.v == null) delete R[d.id]; else R[d.id] = JSON.parse(x.v);
          const ms = x.ts && x.ts.toMillis ? x.ts.toMillis() : 0;
          if (ms > maxMs) maxMs = ms;
        });
        if (!api.canSync()) { running = false; setMode('idle'); schedule(3000); return; }
        const L = api.getDocs();
        const M = merge3(base, L, R, Object.keys(base).length === 0);
        const push = [...new Set([...Object.keys(M), ...Object.keys(R)])].filter(k => !eq(M[k], R[k]));
        for (let i = 0; i < push.length; i += 400) {
          const batch = st.writeBatch(fb.db);
          push.slice(i, i + 400).forEach(k => batch.set(st.doc(col, k), {
            v: M[k] === undefined ? null : stable(M[k]), ts: st.serverTimestamp()
          }));
          await batch.commit();
        }
        const pulled = [...new Set([...Object.keys(M), ...Object.keys(L)])].filter(k => !eq(M[k], L[k])).length;
        if (pulled) api.applyDocs(M);
        base = M; lastMs = maxMs;
        try { await kv('set', 'base:' + user.uid, { base, lastMs }); } catch (e) { /* 다음 번에 다시 저장 */ }
        state.last = Date.now();
        setMode('idle');
        if (manual) api.toast(pulled || push.length ? `동기화했습니다 · 받은 변경 ${pulled}건 · 보낸 변경 ${push.length}건` : '이미 최신입니다');
      } catch (e) {
        setMode('err', errText(e));
        if (manual) api.toast(errText(e));
      } finally {
        running = false;
        if (again) { again = false; schedule(1000); }
      }
    }

    function schedule(ms) {
      clearTimeout(timer);
      timer = setTimeout(() => syncNow(false), ms);
    }

    const cfg0 = savedConfig();
    if (cfg0) boot(cfg0);

    setInterval(() => { if (user && document.visibilityState === 'visible') syncNow(false); }, 90000);
    root.addEventListener && root.addEventListener('focus', () => { if (user && Date.now() - lastTry > 20000) syncNow(false); });

    return {
      state,
      get configured() { return !!savedConfig(); },
      get builtIn() { return !!root.DIARY_SYNC_CONFIG; },
      configure(text) {
        const cfg = parseConfig(text);
        if (!cfg) return false;
        localStorage.setItem(LS_CFG, JSON.stringify(cfg));
        boot(cfg);
        return true;
      },
      async clearConfig() {
        if (fb && user) { try { await fb.auth.signOut(fb.au); } catch (e) { /* 무시 */ } }
        localStorage.removeItem(LS_CFG);
        fb = null; user = null; base = null;
        setMode('off');
      },
      async signIn(email, pw, create) {
        if (!fb) throw new Error('동기화 서버에 아직 연결되지 않았습니다.');
        try {
          if (create) await fb.auth.createUserWithEmailAndPassword(fb.au, email, pw);
          else await fb.auth.signInWithEmailAndPassword(fb.au, email, pw);
        } catch (e) { throw new Error(errText(e)); }
      },
      async signOut() { if (fb) await fb.auth.signOut(fb.au); },
      syncNow,
      notifyChange() { if (user) schedule(5000); }
    };
  }

  const api = { create, merge3, toDocs, fromDocs, stable, parseConfig };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.DiarySync = api;
})(typeof window !== 'undefined' ? window : globalThis);
