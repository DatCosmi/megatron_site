const CACHE_NAME = "megatron-cache-v1";

// URLs para precache (asegúrate de que existan en el proyecto)
const urlsToCache = [
  "/", // Página principal
  "/manifest.json",
  "/favicon.ico",
  "/printer.png",
  "/megatron-logo.png",
  "/printer2.png",
  "/printer-display.png",
  "/brother-logo.png",
  "/offline.html", // Página de respaldo para cuando esté offline
];

// Evento de instalación: precachea recursos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Abriendo caché y agregando recursos...");
      return Promise.all(
        urlsToCache.map((url) => {
          return cache.add(url).catch((error) => {
            console.warn(`Fallo al agregar ${url} al caché:`, error);
          });
        })
      );
    })
  );
});

// Evento de activación: elimina cachés antiguos
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log("Eliminando caché antiguo:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento de fetch: maneja solicitudes
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Devuelve el recurso del caché si está disponible
      if (response) {
        return response;
      }

      // Intentamos buscar el recurso en la red y lo guardamos en caché
      return fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            // Cacheamos los recursos de _next/static (chunks dinámicos)
            if (event.request.url.includes("_next/static")) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          });
        })
        .catch(() => {
          // Devuelve la página offline si la solicitud es de navegación
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }
        });
    })
  );
});
