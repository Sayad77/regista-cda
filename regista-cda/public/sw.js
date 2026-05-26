const CACHE_NAME = 'regista-v1-cache';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// 1. Installation du Service Worker et mise en cache des actifs
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Mise en cache PWA réussie');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Stratégie Réseau : Cache First avec repli réseau
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // On retourne le cache s'il existe, sinon on va chercher sur le réseau
      if (cachedResponse) return cachedResponse;
      return fetch(event.request);
    })
  );
});