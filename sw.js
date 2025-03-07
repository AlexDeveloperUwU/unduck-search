const CACHE_NAME = "unduck-cache-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/js/3.4.16.js",
  "/js/main.js",
  "/img/light.png",
  "/img/dark.png",
  "/css/styles.css",
  "/fonts/comfortaa.woff2",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache.filter((url) => !url.startsWith("chrome-extension://")));
    })
  );
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  if (event.request.url.startsWith("chrome-extension://")) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (event.request.method === "GET" && networkResponse && networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone).catch((error) => {
                console.error("Failed to cache response:", error);
              });
            });
          }
          return networkResponse;
        })
        .catch((error) => {
          console.error("Fetch failed for:", event.request.url, "Error:", error);
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});
