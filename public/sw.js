// Offline support + reliable updates.
// Strategy: stale-while-revalidate. The app opens instantly from cache (and works
// with no signal), while a fresh copy is fetched in the background whenever you're
// online — so a new deploy is picked up on the next launch or two, with no need to
// touch this file each release.
const CACHE = "eos-v5";
const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./app.css",
  "./manifest.webmanifest",
  "./icon-180.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.open(CACHE).then((cache) =>
      cache.match(e.request).then((cached) => {
        const network = fetch(e.request)
          .then((res) => {
            if (res && res.status === 200 && res.type === "basic") cache.put(e.request, res.clone());
            return res;
          })
          .catch(() => cached || caches.match("./index.html"));
        return cached || network;
      })
    )
  );
});

// ---- Notifications (EOS nudges) ----
self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "Every Other Saturday", {
    body: d.body || "",
    icon: "./icon-192.png",
    badge: "./icon-192.png",
    tag: d.tag || undefined,
    data: { url: d.url || "./" },
  }));
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = new URL((e.notification.data && e.notification.data.url) || "./", self.registration.scope).href;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const w of wins) {
      if ("focus" in w) { w.postMessage({ type: "eos-open", url }); return w.focus(); }
    }
    return self.clients.openWindow(url);
  })());
});
