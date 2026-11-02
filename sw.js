// 폰·탭 웹앱용 오프라인 동작.
// 앱 파일은 인터넷이 되면 늘 새로 받고(수정본이 바로 반영되게), 안 되면 받아 둔 것으로 연다.
// Firebase 라이브러리(gstatic)도 받아 두어 오프라인에서도 앱이 뜨게 한다. 기록 자체는 기기 안에 저장된다.
const VERSION = '1.3.1';
const CACHE = 'manneung-diary-' + VERSION;
const PRECACHE = ['./', 'index.html', 'manifest.webmanifest', 'app.css', 'app.js', 'holidays.js', 'sync.js', 'sync-config.js',
  'fonts/PretendardVariable.woff2', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});

async function networkFirst(req) {
  const c = await caches.open(CACHE);
  try {
    const res = await fetch(req);
    if (res.ok) c.put(req, res.clone());
    return res;
  } catch (err) {
    const hit = await c.match(req, { ignoreSearch: true });
    if (hit) return hit;
    if (req.mode === 'navigate') return c.match('index.html');
    throw err;
  }
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) { e.respondWith(networkFirst(req)); return; }
  if (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/')) {
    e.respondWith((async () => {
      const c = await caches.open(CACHE);
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok) c.put(req, res.clone());
      return res;
    })());
  }
});
