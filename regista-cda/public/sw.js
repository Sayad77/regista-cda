const CACHE_NAME = 'regista-v2-cache'; // ⚠️ change ce nom à chaque déploiement important
const ASSETS_TO_CACHE = [
  '/manifest.json'
];

// 1. Installation : mise en cache minimale + activation immédiate
self.addEventListener('install', (event) => {
  self.skipWaiting(); // force le nouveau SW à s'activer tout de suite
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Mise en cache PWA réussie');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activation : suppression des anciens caches + prise de contrôle immédiate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Stratégie réseau :
//    - Network First pour la navigation (index.html) → toujours la dernière version
//    - Cache First pour le reste (images, manifest, etc.)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // Navigation (chargement de page / index.html) : réseau en priorité
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/index.html'))
    );
    return;
  }

  // Le reste : cache en priorité, sinon réseau
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});