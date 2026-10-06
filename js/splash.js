/* =========================================
   NEXVO
   SPLASH SCREEN
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const splashScreen =
    document.getElementById("splashScreen");

const appContent =
    document.getElementById("appContent");


/* =========================================
   SPLASH TIMING
========================================= */

const splashStartTime =
    Date.now();


/* =========================================
   STARTUP SOUND
========================================= */

let nexvoStartupSound = null;

function initializeStartupSound() {

    nexvoStartupSound =
        new Audio("../sounds/nexvo_startup.wav");

    nexvoStartupSound.preload = "auto";
    nexvoStartupSound.volume = 0.75;

    /*
        Try to play the original NEXVO
        startup sound.

        Browsers may block autoplay.
    */

    nexvoStartupSound.play().catch(function () {

        console.log(
            "NEXVO: Startup sound waiting for user interaction."
        );

    });
}


/* =========================================
   INITIALIZE SPLASH
========================================= */

function initializeSplash() {

    if (!splashScreen) {

        console.error(
            "NEXVO: Splash screen not found."
        );

        return;
    }


    window.scrollTo(0, 0);


    /*
        Start NEXVO startup sound
    */

    initializeStartupSound();


    /*
        Calculate remaining splash time
    */

    const elapsedTime =
        Date.now() - splashStartTime;


    const minimumDuration =
        (
            window.NEXVO_CONFIG &&
            NEXVO_CONFIG.splash &&
            NEXVO_CONFIG.splash.minimumDuration
        )
        ||
        3000;


    const remainingTime =
        Math.max(
            0,
            minimumDuration - elapsedTime
        );


    setTimeout(
        hideSplash,
        remainingTime
    );
}


/* =========================================
   HIDE SPLASH
========================================= */

function hideSplash() {

    if (!splashScreen) {
        return;
    }


    splashScreen.classList.add(
        "splash-exit"
    );


    const exitDuration =
        (
            window.NEXVO_CONFIG &&
            NEXVO_CONFIG.splash &&
            NEXVO_CONFIG.splash.exitDuration
        )
        ||
        500;


    setTimeout(function () {

        splashScreen.style.display =
            "none";


        if (appContent) {

            appContent.setAttribute(
                "aria-hidden",
                "false"
            );

            appContent.style.opacity =
                "1";

            appContent.style.pointerEvents =
                "auto";
        }


        /*
            Open onboarding after splash
        */

        window.location.href =
            "/pages/onboarding.html";

    }, exitDuration);
}


/* =========================================
   DOM READY
========================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeSplash
    );

} else {

    initializeSplash();
}