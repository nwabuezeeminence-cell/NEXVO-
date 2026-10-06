/* =========================================
   NEXVO STARTUP SYSTEM
========================================= */

(function () {

    const splashScreen =
        document.getElementById("splashScreen");

    const STARTUP_SOUND =
        "sounds/nexvo_startup.wav";

    const MINIMUM_SPLASH_TIME = 1800;

    let startupStartedAt =
        Date.now();

    let redirectStarted = false;


    /* =========================================
       STARTUP SOUND
    ========================================= */

    function playStartupSound() {

        try {

            const audio =
                new Audio(STARTUP_SOUND);

            audio.volume = 0.55;

            audio.preload = "auto";

            const playPromise =
                audio.play();

            if (
                playPromise &&
                typeof playPromise.catch === "function"
            ) {

                playPromise.catch(function () {

                    /*
                        Some mobile browsers block
                        automatic audio playback.

                        NEXVO must continue normally
                        even when audio is blocked.
                    */

                    console.log(
                        "NEXVO startup sound was blocked by the browser."
                    );

                });

            }

        } catch (error) {

            console.warn(
                "NEXVO startup sound could not play:",
                error
            );

        }

    }


    /* =========================================
       SPLASH EXIT
    ========================================= */

    function hideSplash() {

        if (!splashScreen) {
            return;
        }

        splashScreen.classList.add(
            "splash-hidden"
        );

    }


    /* =========================================
       REDIRECT
    ========================================= */

    function redirectUser(user) {

        if (redirectStarted) {
            return;
        }

        redirectStarted = true;


        const elapsed =
            Date.now() - startupStartedAt;

        const remaining =
            Math.max(
                0,
                MINIMUM_SPLASH_TIME - elapsed
            );


        setTimeout(function () {

            hideSplash();


            setTimeout(function () {

                if (user) {

                    /*
                        Existing signed-in user
                    */

                    window.location.href =
                        "pages/home.html";

                } else {

                    /*
                        User is not signed in
                    */

                    window.location.href =
                        "pages/login.html";

                }

            }, 300);

        }, remaining);

    }


    /* =========================================
       FIREBASE AUTH
    ========================================= */

    function initializeStartupAuth() {

        if (
            typeof firebase === "undefined"
        ) {

            console.error(
                "NEXVO Firebase SDK is unavailable."
            );

            /*
                Fallback to login if Firebase
                cannot initialize.
            */

            redirectUser(null);

            return;
        }


        if (
            typeof firebase.auth !== "function"
        ) {

            console.error(
                "NEXVO Firebase Authentication is unavailable."
            );

            redirectUser(null);

            return;
        }


        firebase.auth().onAuthStateChanged(
            function (user) {

                if (user) {

                    console.log(
                        "NEXVO authenticated user detected."
                    );

                } else {

                    console.log(
                        "No NEXVO user is currently signed in."
                    );

                }


                redirectUser(user);

            }
        );

    }


    /* =========================================
       START NEXVO
    ========================================= */

    function startNexvo() {

        startupStartedAt =
            Date.now();


        /*
            Start the sound immediately.
        */

        playStartupSound();


        /*
            Give Firebase initialization
            a moment to become ready.
        */

        setTimeout(
            initializeStartupAuth,
            150
        );

    }


    /* =========================================
       DOM READY
    ========================================= */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            startNexvo
        );

    } else {

        startNexvo();

    }

})();
