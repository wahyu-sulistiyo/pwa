importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

workbox.precaching.precacheAndRoute([
    { url: "/", revision: "1" },
    { url: "/manifest.json", revision: "1"},
    { url: "/index.html", revision: "1"},
    { url: "/nav.html", revision: "1"},
    { url: "/pages/favorit.html", revision: "1"},
    { url: "/pages/home.html", revision: "1"},
    { url: "/pages/klasemen.html", revision: "1"},
    { url: "/pages/detail_team.html", revision: "1"},
    { url: "/pages/detail_player.html", revision: "1"},
    { url: "/css/materialize.min.css", revision: "1"},
    { url: "/js/api.js", revision: "1"},
    { url: "/js/db.js", revision: "1"},
    { url: "/js/idb.js", revision: "1"},
    { url: "/js/materialize.min.js", revision: "1"},
    { url: "/js/nav.js", revision: "1"},
    { url: "/images/Liga_Jerman.png", revision: "1"}, 
    { url: "/images/maskable_icon_small.png", revision: "1"}, 
    { url: "/images/maskable_icon.png", revision: "1"}, 
    ],{
      ignoreUrlParametersMatching: [/.*/]
});

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: "image-caches",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 30,
                maxAgeSeconds: 7 * 24 * 60 * 60,
            }),
        ],
    })
);

workbox.routing.registerRoute(
    new RegExp("/pages/"),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "page-caches"
    })
);


workbox.routing.registerRoute(
    new RegExp('https://api.football-data.org/v2/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: "api-caches"
    })
)

self.addEventListener("push", event => {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = "Push message no payload";
    }

    var options = {
        body: body,
        icon: "images/Liga_Jerman.png",
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };

    event.waitUntil(
        self.registration.showNotification("Push Notification", options)
    );
});