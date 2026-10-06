/* =========================================
   NEXVO
   ONBOARDING CONTROLLER
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const onboardingSlides =
    document.querySelectorAll(
        ".onboarding-slide"
    );


const progressDots =
    document.querySelectorAll(
        ".progress-dot"
    );


const nextButton =
    document.getElementById(
        "nextButton"
    );


const nextButtonText =
    document.getElementById(
        "nextButtonText"
    );


const nextButtonIcon =
    document.getElementById(
        "nextButtonIcon"
    );


const skipButton =
    document.getElementById(
        "skipButton"
    );


/* =========================================
   STATE
========================================= */

let currentSlide =
    0;


const totalSlides =
    onboardingSlides.length;


/* =========================================
   UPDATE SLIDE
========================================= */

function updateOnboarding() {

    onboardingSlides.forEach(
        function (slide, index) {

            slide.classList.toggle(
                "active",
                index === currentSlide
            );

        }
    );


    progressDots.forEach(
        function (dot, index) {

            dot.classList.toggle(
                "active",
                index === currentSlide
            );

        }
    );


    /*
        Change button text on the
        final onboarding screen.
    */

    if (
        currentSlide ===
        totalSlides - 1
    ) {

        nextButtonText.textContent =
            "Get Started";

        nextButtonIcon.textContent =
            "→";

    }

    else {

        nextButtonText.textContent =
            "Next";

        nextButtonIcon.textContent =
            "→";

    }

}


/* =========================================
   NEXT
========================================= */

function goNext() {

    if (
        currentSlide <
        totalSlides - 1
    ) {

        currentSlide++;

        updateOnboarding();

    }

    else {

        finishOnboarding();

    }

}


/* =========================================
   PREVIOUS
========================================= */

function goPrevious() {

    if (
        currentSlide >
        0
    ) {

        currentSlide--;

        updateOnboarding();

    }

}


/* =========================================
   FINISH
========================================= */

function finishOnboarding() {

    /*
        Save that onboarding has been seen.

        Later this will allow NEXVO to skip
        onboarding for returning users.
    */

    localStorage.setItem(
        "nexvoOnboardingCompleted",
        "true"
    );


    /*
        Temporary destination.

        We will replace this with the real
        authentication screen in the next phase.
    */

    window.location.href =
        "auth.html";

}


/* =========================================
   SKIP
========================================= */

function skipOnboarding() {

    localStorage.setItem(
        "nexvoOnboardingCompleted",
        "true"
    );


    window.location.href =
    "auth.html";
    }


/* =========================================
   DOT NAVIGATION
========================================= */

progressDots.forEach(
    function (dot) {

        dot.addEventListener(
            "click",
            function () {

                const selectedSlide =
                    Number(
                        dot.dataset.dot
                    );


                if (
                    selectedSlide >= 0 &&
                    selectedSlide < totalSlides
                ) {

                    currentSlide =
                        selectedSlide;

                    updateOnboarding();

                }

            }
        );

    }
);


/* =========================================
   NEXT BUTTON
========================================= */

if (nextButton) {

    nextButton.addEventListener(
        "click",
        goNext
    );

}


/* =========================================
   SKIP BUTTON
========================================= */

if (skipButton) {

    skipButton.addEventListener(
        "click",
        skipOnboarding
    );

}


/* =========================================
   SWIPE SUPPORT
========================================= */

let touchStartX =
    0;

let touchEndX =
    0;


document.addEventListener(
    "touchstart",
    function (event) {

        touchStartX =
            event.changedTouches[0].screenX;

    },
    {
        passive: true
    }
);


document.addEventListener(
    "touchend",
    function (event) {

        touchEndX =
            event.changedTouches[0].screenX;

        handleSwipe();

    },
    {
        passive: true
    }
);


function handleSwipe() {

    const swipeDistance =
        touchEndX -
        touchStartX;


    const minimumSwipe =
        50;


    /*
        Swipe left → next
    */

    if (
        swipeDistance <
        -minimumSwipe
    ) {

        goNext();

    }


    /*
        Swipe right → previous
    */

    else if (
        swipeDistance >
        minimumSwipe
    ) {

        goPrevious();

    }

}


/* =========================================
   KEYBOARD SUPPORT
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "ArrowRight"
        ) {

            goNext();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            goPrevious();

        }

    }
);


/* =========================================
   INITIALIZE
========================================= */

updateOnboarding();