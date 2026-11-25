
const CACHE_NAME = "bewertung_v16";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


// ==========================================
// INSTALLATION
// ==========================================

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES);
        })

    );

    self.skipWaiting();

});


// ==========================================
// AKTIVIERUNG
// ==========================================

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(cacheNames => {

            return Promise.all(

                cacheNames
                    .filter(name =>
                        name.startsWith("bewertung_") &&
                        name !== CACHE_NAME
                    )
                    .map(name => caches.delete(name))

            );

        }).then(() => {

            return self.clients.claim();

        })

    );

});


// ==========================================
// DATEIANFRAGEN
// ==========================================

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") {
        return;
    }

    const url = new URL(event.request.url);

    // Nur Dateien vom eigenen Ursprung behandeln

    if (url.origin !== self.location.origin) {
        return;
    }

    event.respondWith(

        caches.match(event.request).then(cachedResponse => {

            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then(response => {

                if (
                    response &&
                    response.status === 200 &&
                    response.type === "basic"
                ) {

                    const copy = response.clone();

                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, copy);
                    });

                }

                return response;

            });

        }).catch(() => {

            if (event.request.mode === "navigate") {

                return caches.match("./index.html");

            }

            return new Response(
                "Datei momentan nicht verfügbar.",
                {
                    status: 503,
                    headers: {
                        "Content-Type": "text/plain; charset=utf-8"
                    }
                }
            );

        })

    );

});
