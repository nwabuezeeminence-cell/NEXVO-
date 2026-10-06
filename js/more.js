/* =========================================
   NEXVO
   MORE PAGE
========================================= */


/* =========================================
   MORE FEATURES
========================================= */

function setupMoreFeatures() {

    const items =
        document.querySelectorAll(
            ".more-item"
        );


    items.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    const feature =
                        item.dataset.feature;


                    switch (feature) {


                        /* =========================
                           PROFILE
                        ========================= */

                        case "profile":

                            window.location.href =
                                "profile.html";

                            break;



                        /* =========================
                           SETTINGS
                        ========================= */

                        case "settings":

                            window.location.href =
                                "settings.html";

                            break;



                        /* =========================
                           NOTIFICATIONS
                        ========================= */

                        case "notifications":

                            alert(
                                "NEXVO Notifications will be connected next."
                            );

                            break;



                        /* =========================
                           PRIVACY
                        ========================= */

                        case "privacy":

                            alert(
                                "NEXVO Privacy & Security will be connected next."
                            );

                            break;



                        /* =========================
                           FRIENDS
                        ========================= */

                        case "friends":

                            window.location.href =
                                "friends.html";

                            break;



                        /* =========================
                           FRIEND REQUESTS
                        ========================= */

                        case "friend-requests":

                            window.location.href =
                                "friend-requests.html";

                            break;



                        /* =========================
                           UNKNOWN
                        ========================= */

                        default:

                            console.warn(
                                "NEXVO: Unknown More feature:",
                                feature
                            );

                            break;

                    }

                }
            );

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

function initializeMorePage() {

    setupMoreFeatures();

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
        function () {

            initializeMorePage();

        }
    );

}

else {

    initializeMorePage();

}