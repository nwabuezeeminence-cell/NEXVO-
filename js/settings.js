/* =========================================
   NEXVO
   SETTINGS PAGE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const settingsBackButton =
    document.getElementById(
        "backButton"
    );


const settingsItems =
    document.querySelectorAll(
        ".settings-item"
    );


const themeValue =
    document.getElementById(
        "themeValue"
    );


/* =========================================
   BACK BUTTON
========================================= */

function setupSettingsBack() {

    if (!settingsBackButton) {
        return;
    }


    settingsBackButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "more.html";

        }
    );

}


/* =========================================
   LOAD THEME
========================================= */

function loadSettingsTheme() {

    const savedTheme =
        localStorage.getItem(
            "nexvoTheme"
        );


    if (!savedTheme) {

        if (themeValue) {

            themeValue.textContent =
                "System";

        }

        return;

    }


    if (themeValue) {

        if (savedTheme === "light") {

            themeValue.textContent =
                "Light";

        }

        else if (
            savedTheme === "dark"
        ) {

            themeValue.textContent =
                "Dark";

        }

        else {

            themeValue.textContent =
                "System";

        }

    }

}


/* =========================================
   SETTINGS ACTIONS
========================================= */

function setupSettingsItems() {

    settingsItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    const setting =
                        item.dataset.setting;


                    handleSetting(
                        setting
                    );

                }
            );

        }
    );

}


/* =========================================
   HANDLE SETTINGS
========================================= */

function handleSetting(
    setting
) {

    switch (setting) {


        /* ================================
           PROFILE
        ================================= */

        case "profile":

            window.location.href =
                "profile-setup.html";

            break;


        /* ================================
           PRIVACY
        ================================= */

        case "privacy":

            alert(
                "Privacy & Security will be connected next."
            );

            break;


        /* ================================
           THEME
        ================================= */

        case "theme":

            cycleTheme();

            break;


        /* ================================
           NOTIFICATIONS
        ================================= */

        case "notifications":

            window.location.href =
                "notifications.html";

            break;


        /* ================================
           CHAT
        ================================= */

        case "chat":

            alert(
                "Chat Settings will be connected next."
            );

            break;


        /* ================================
           MEDIA
        ================================= */

        case "media":

            alert(
                "Media & Storage will be connected next."
            );

            break;


        /* ================================
           HELP
        ================================= */

        case "help":

            alert(
                "Help & Support will be connected next."
            );

            break;


        /* ================================
           ABOUT
        ================================= */

        case "about":

            alert(
                "NEXVO Version 1.0"
            );

            break;


        /* ================================
           UNKNOWN
        ================================= */

        default:

            console.warn(
                "NEXVO: Unknown setting:",
                setting
            );

            break;

    }

}


/* =========================================
   THEME
========================================= */

function cycleTheme() {

    const currentTheme =
        localStorage.getItem(
            "nexvoTheme"
        ) || "system";


    let nextTheme;


    if (currentTheme === "system") {

        nextTheme = "light";

    }

    else if (
        currentTheme === "light"
    ) {

        nextTheme = "dark";

    }

    else {

        nextTheme = "system";

    }


    localStorage.setItem(
        "nexvoTheme",
        nextTheme
    );


    applyTheme(
        nextTheme
    );


    loadSettingsTheme();

}


/* =========================================
   APPLY THEME
========================================= */

function applyTheme(
    theme
) {

    document.documentElement
        .setAttribute(
            "data-theme",
            theme
        );

}


/* =========================================
   INITIALIZE
========================================= */

function initializeSettingsPage() {

    setupSettingsBack();

    setupSettingsItems();

    loadSettingsTheme();


    const savedTheme =
        localStorage.getItem(
            "nexvoTheme"
        ) || "system";


    applyTheme(
        savedTheme
    );

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

            initializeSettingsPage();

        }
    );

}

else {

    initializeSettingsPage();

}