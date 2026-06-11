const CACHE_NAME =
    'pharmaflow-v1.1.0';

const BASE =
    '/pharmaflow-frontend-1.1.0-beta';

const STATIC_FILES = [

    `${BASE}/`,
    `${BASE}/login.html`,
    `${BASE}/admin.html`,
    `${BASE}/analytics.html`,
    `${BASE}/install.html`,
    `${BASE}/forgot-password.html`,
    `${BASE}/reset-password.html`,

    `${BASE}/manifest.json`,

    `${BASE}/js/pwa.js`,
    `${BASE}/js/api.js`,
    `${BASE}/js/auth.js`,

    `${BASE}/assets/icons/icon-192.png`,
    `${BASE}/assets/icons/icon-512.png`

];

self.addEventListener(
    'install',
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAME
            ).then(cache => {

                return cache.addAll(
                    STATIC_FILES
                );

            })

        );

        self.skipWaiting();

    }
);

self.addEventListener(
    'activate',
    event => {

        event.waitUntil(

            caches.keys()
                .then(keys => {

                    return Promise.all(

                        keys.map(key => {

                            if (
                                key !== CACHE_NAME
                            ) {

                                return caches.delete(
                                    key
                                );

                            }

                        })

                    );

                })

        );

        self.clients.claim();

    }
);

self.addEventListener(
    'fetch',
    event => {

        if (
            event.request.method !==
            'GET'
        ) {
            return;
        }

        const url =
            new URL(
                event.request.url
            );

        if (
            url.protocol ===
            'chrome-extension:'
        ) {
            return;
        }

        event.respondWith(

            caches.match(
                event.request
            ).then(cached => {

                if (cached) {
                    return cached;
                }

                return fetch(
                    event.request
                )
                    .then(response => {

                        if (
                            !response ||
                            response.status !== 200
                        ) {

                            return response;

                        }

                        const clone =
                            response.clone();

                        caches.open(
                            CACHE_NAME
                        )
                            .then(cache => {

                                cache.put(
                                    event.request,
                                    clone
                                );

                            });

                        return response;

                    })
                    .catch(() => {

                        return caches.match(
                            `${BASE}/login.html`
                        );

                    });

            })

        );

    }
);
