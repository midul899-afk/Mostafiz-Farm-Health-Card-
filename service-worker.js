// service-worker.js

const CACHE_NAME = 'farm-health-v1';

// সকল গুরুত্বপূর্ণ ফাইল যা অফলাইনে প্রয়োজন
const urlsToCache = [
    './', // এই ফোল্ডারের রুট ফাইল (index.html)
    './index.html', // আপনার প্রধান HTML ফাইল
    './manifest.json',
    // আপনার প্রধান JavaScript অংশ, যদি আলাদা ফাইলে থাকে
    // '/js/app.js', 
    // যদি আপনি CDN ব্যবহার না করে নিজের CSS ফাইল ব্যবহার করেন, তবে সেটি এখানে যোগ করতে হবে।

    // Note: CDN ফাইল ক্যাশ করা কঠিন, তবে চেষ্টা করা যেতে পারে।
    // 'https://cdn.tailwindcss.com' 
];

// 1. INSTALL: যখন সার্ভিস ওয়ার্কার ইনস্টল হয়, তখন সব ফাইল ক্যাশে সেভ করো।
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache and added all core files');
            // 'cache.addAll' সব ফাইল ক্যাশ করে, তবে যদি কোনো CDN ফাইলে CORS সমস্যা হয় তবে এটি ব্যর্থ হতে পারে।
            return cache.addAll(urlsToCache);
        })
        .catch(err => console.error('Cache installation failed:', err))
    );
});

// 2. FETCH: যখন ব্রাউজার কিছু লোড করার চেষ্টা করে।
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
        .then((response) => {
            // যদি ক্যাশে পাওয়া যায়, তবে ক্যাশে থেকে সেটি দেখাও
            if (response) {
                return response;
            }
            // না হলে নেটওয়ার্ক থেকে লোড করার চেষ্টা করো
            return fetch(event.request);
        })
    );
});

// 3. ACTIVATE: পুরোনো ক্যাশ ভার্সন মুছে দাও 
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});