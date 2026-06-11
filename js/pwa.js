let deferredPrompt = null;

// ============================
// Service Worker
// ============================

window.addEventListener(

    'load',

    async () => {

        if (
            !('serviceWorker' in navigator)
        ) {
            return;
        }

        try {

            const registration =

                await navigator
                    .serviceWorker
                    .register(
                        '/sw.js'
                    );

            console.log(
                'PWA Ready',
                registration
            );

        }
        catch(error){

            console.error(
                error
            );

        }

    }

);

// ============================
// Install Prompt
// ============================

window.addEventListener(
    'beforeinstallprompt',
    (event) => {

        event.preventDefault();

        deferredPrompt = event;

    }
);

// ============================
// Install Function
// ============================

async function installPWA() {

    if (!deferredPrompt)
        return;

    deferredPrompt.prompt();

    await deferredPrompt.userChoice;

    deferredPrompt = null;

}

// ============================
// Installed Event
// ============================

window.addEventListener(
    'appinstalled',
    () => {

        console.log(
            'PWA Installed'
        );

    }
);