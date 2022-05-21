const CACHE_NAME = "version-1";
const urlsToCache = ['index.html', 'offline.html'];

const self = this;


// Install serviceWorker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');

                return cache.addAll(urlsToCache);
            })
    )
});


// Listen for requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(() => {
                return fetch(event.request)
                    .catch(() => caches.match('offline.html'))
            })
    )
});


// Activate the serviceWorker
self.addEventListener('activate', (event) => {
    const cacheWhiteList = [];
    cacheWhiteList.push(CACHE_NAME);

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            Promise.all(cacheNames.map((cacheName) => {
                if(!cacheWhiteList.includes(cacheName)) {
                    return cache.delete(cacheName);
                }
            }))
        })
    )
});



self.addEventListener('push', event => {
    console.log("Serviceworker event.data: " + event.data.text());
    const title = event.data.text();
    
    // const timestamp = new Date(2022, 3, 18, 7, 31, 55, 0);
    var options = {
        body: 'Here is a notification body!',
        // showTrigger: new TimestampTrigger(timestamp),
        icon: 'images/logo.jpeg',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1
        },
        actions: [
            {
              action: 'open',
              title: 'Open app',
            },
            {
              action: 'close',
              title: 'Close notification',
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});



// listen to a notification click
// self.addEventListener('notificationclick', event => {
//     event.waitUntil(self.clients.matchAll().then(clients => {
//         if (clients.length) { // check if at least one tab is already open
//             clients[0].focus();
//             clients[0].postMessage('Push notification clicked!');
//         } else {
//             self.clients.openWindow('/');
//         }
//     }));
// });


function alarm(){
    console.log('running:');
    setTimeout(function(){
      alarm();
      self.registration.showNotification("Alert!");
    }, 1*60*1000);
  }


self.addEventListener('sync', function(event) {
    if (event.tag == "bing") {
      event.waitUntil(alarm());
    }
    console.log("sync fired!!");
  });



// service-worker.js
self.addEventListener('notificationclick', event => {
    if (event.action === 'close') {
      event.notification.close();
    } else {
      self.clients.openWindow('/');
      event.notification.close();
    }
  });