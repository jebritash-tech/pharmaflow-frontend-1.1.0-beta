let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {

    e.preventDefault();

    deferredPrompt = e;

    const installBtn =
        document.getElementById('installBtn');

    if (installBtn) {
        installBtn.style.display = 'block';
    }

});

document.addEventListener('DOMContentLoaded', () => {

    const installBtn =
        document.getElementById('installBtn');

    if (!installBtn) return;

    installBtn.addEventListener(
        'click',
        async () => {

            if (!deferredPrompt) {

                alert(
                    'التثبيت غير متاح حالياً. افتح الموقع عدة مرات أو استخدم Chrome.'
                );

                return;

            }

            deferredPrompt.prompt();

            const result =
                await deferredPrompt.userChoice;

            console.log(
                result.outcome
            );

            deferredPrompt = null;

            installBtn.style.display =
                'none';

        }
    );

});

window.addEventListener(
    'appinstalled',
    () => {

        console.log(
            'PWA Installed'
        );

        const installBtn =
            document.getElementById(
                'installBtn'
            );

        if (installBtn) {
            installBtn.style.display =
                'none';
        }

    }
);

if ('serviceWorker' in navigator) {

    window.addEventListener(
        'load',
        () => {

            navigator.serviceWorker
                .register('./sw.js')
                .then(() => {

                    console.log(
                        'Service Worker Registered'
                    );

                })
                .catch(err => {

                    console.error(
                        err
                    );

                });

        }
    );

}
