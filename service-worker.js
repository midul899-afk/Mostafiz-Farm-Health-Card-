const CACHE_NAME = 'farm-health-cache-v1';
const urlsToCache = [
  '/', 
  '/index.html', 
  '/manifest.json',
  // আইকনগুলিও ক্যাশ করুন 
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
  // আপনি যদি Tailwind CDN বাদ দিয়ে লোকাল CSS ব্যবহার করেন তবে সেটিও এখানে যোগ করতে পারেন
];

// Install event: ক্যাশে সম্পদ সংরক্ষণ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache addAll failed:', err);
      })
  );
});

// Fetch event: ক্যাশ থেকে সম্পদ পরিবেশন
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - ক্যাশ থেকে ফিরিয়ে দিন
        if (response) {
          return response;
        }
        // Cache miss - নেটওয়ার্ক থেকে আনুন
        return fetch(event.request);
      })
  );
});

// Activate event: পুরোনো ক্যাশে পরিষ্কার করুন
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
