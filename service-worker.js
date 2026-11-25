
const CACHE_NAME = "bewertung_v7";

const FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon-192.png",
    "./icon-512.png"
];


// Installation

self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(FILES);
        })
    );

    self.skipWaiting();

});


// Aktivierung und alte Caches löschen

self.addEventListener("activate", event => {

    event.waitUntil(
        caches.keys().then(cacheNames => {

            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );

        }).then(() => {

            return self.clients.claim();

        })
    );

});


// Anfragen bearbeiten

self.addEventListener("fetch", event => {

    if (event.request.method !== "GET") return;

    event.respondWith(

        caches.match(event.request).then(response => {

            if (response) {
                return response;
            }

            return fetch(event.request);

        }).catch(() => {

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
