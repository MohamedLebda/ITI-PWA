let cacheName = "appV";
let assets = [
  "/static/js/src_Components_Users_jsx.chunk.js",
  "/static/js/src_Components_Navbar_jsx.chunk.js",
  "/static/js/src_Components_Home_jsx.chunk.js",
  "https://jsonplaceholder.typicode.com/users",
  "/static/js/bundle.js",
  "/index.html",
  "/bootstrap/min/css",
  "/bootstrap/min/js",
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/static/js/bundle.js",
];

this.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});

//? web-push
this.addEventListener("fetch", (event) => {
  if (!navigator.onLine) {
    //? notification
    event.respondWith(
      caches.match(event.request).then((res) => {
        if (res) {
          return res;
        }
        fetch(event.request);
      })
    );
  }
});
