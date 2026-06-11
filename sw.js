// =====================================
// Environment Detection
// =====================================

const IS_DEV =

    self.location.hostname === '127.0.0.1' ||

    self.location.hostname === 'localhost';


// =====================================
// Cache Settings
// =====================================

const CACHE_NAME = 'pharmacy-v1';

const STATIC_FILES = [

    '/',

    '/login.html',
    '/admin.html',
    '/pos.html',
    '/analytics.html',

    '/manifest.json',

    '/js/pwa.js',
    '/js/api.js',
    '/js/auth.js',
    '/js/offline-db.js',

];


// =====================================
// Development Mode
// =====================================

if (IS_DEV) {

    console.log(
        '[SW] Development Mode'
    );

    self.addEventListener(
        'install',
        () => self.skipWaiting()
    );

    self.addEventListener(
        'activate',
        event => {

            event.waitUntil(

                self.clients.claim()

            );

        }
    );

    self.addEventListener(
        'fetch',
        event => {

            event.respondWith(

                fetch(event.request)

            );

        }
    );

}

// =====================================
// Production Mode
// =====================================

else {

    console.log(
        '[SW] Production Mode'
    );

    // Install

    self.addEventListener(

        'install',

        event => {

            self.skipWaiting();

            event.waitUntil(

                caches.open(
                    CACHE_NAME
                )
                .then(cache =>

                    cache.addAll(
                        STATIC_FILES
                    )

                )

            );

        }

    );

    // Activate

    self.addEventListener(

        'activate',

        event => {

            event.waitUntil(

                Promise.all([

                    self.clients.claim(),

                    caches.keys()
                        .then(keys =>

                            Promise.all(

                                keys
                                    .filter(

                                        key =>
                                        key !== CACHE_NAME

                                    )
                                    .map(

                                        key =>
                                        caches.delete(
                                            key
                                        )

                                    )

                            )

                        )

                ])

            );

        }

    );

    // Fetch

    self.addEventListener(

        'fetch',

        event => {

            if (
                event.request.method !==
                'GET'
            ) {
                return;
            }

            event.respondWith(

                fetch(
                    event.request
                )

                .then(response => {

                    const copy =
                        response.clone();

                    caches.open(
                        CACHE_NAME
                    )
                    .then(cache => {

                        cache.put(
                            event.request,
                            copy
                        );

                    });

                    return response;

                })

                .catch(() =>

                    caches.match(
                        event.request
                    )

                )

            );

        }

    );

}