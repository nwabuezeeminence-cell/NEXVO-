/* =========================================
   NEXVO
   GLOBAL NAVIGATION
========================================= */


/* =========================================
   ROUTES
========================================= */

const NEXVO_ROUTES = {

    home:
        "home.html",

    chats:
        "chats.html",

    friends:
        "friends.html",

    calls:
        "calls.html",

    notifications:
        "notifications.html",

    search:
        "search.html",

    more:
        "more.html"

};


/* =========================================
   INITIALIZE
========================================= */

function initializeNexvoNavigation(
    currentPage
) {

    /*
        Remove old navigation systems
    */

    removeOldNavigation();

    removeOldPlusSystem();


    /*
        Create N button
    */

    createNexvoControl(
        currentPage
    );

}


/* =========================================
   REMOVE OLD NAVIGATION
========================================= */

function removeOldNavigation() {

    const oldNavigation =
        document.querySelectorAll(
            ".bottom-nav, .bottom-navigation, .tab-bar"
        );


    oldNavigation.forEach(
        function (element) {

            element.remove();

        }
    );

}


/* =========================================
   REMOVE OLD PLUS SYSTEM
========================================= */

function removeOldPlusSystem() {

    const oldElements =
        document.querySelectorAll(
            "#plusButton, #plusMenu, #plusOverlay, .plus-button, .plus-menu, .plus-overlay"
        );


    oldElements.forEach(
        function (element) {

            element.remove();

        }
    );

}


/* =========================================
   CREATE NEXVO CONTROL
========================================= */

function createNexvoControl(
    currentPage
) {

    /*
        Prevent duplicates
    */

    if (
        document.getElementById(
            "nexvoControl"
        )
    ) {

        return;

    }


    /* =====================================
       CONTROL
    ===================================== */

    const control =
        document.createElement(
            "button"
        );


    control.id =
        "nexvoControl";

    control.className =
        "nexvo-control";

    control.type =
        "button";

    control.setAttribute(
        "aria-label",
        "Open NEXVO menu"
    );

    control.innerHTML = `
        <span>N</span>
    `;


    /* =====================================
       OVERLAY
    ===================================== */

    const overlay =
        document.createElement(
            "div"
        );


    overlay.id =
        "nexvoMenuOverlay";

    overlay.className =
        "nexvo-menu-overlay";


    /* =====================================
       MENU
    ===================================== */

    const menu =
        document.createElement(
            "div"
        );


    menu.id =
        "nexvoMenu";

    menu.className =
        "nexvo-menu";

    menu.setAttribute(
        "aria-hidden",
        "true"
    );


    menu.innerHTML = `

        <div class="nexvo-menu-header">

            <div>

                <strong>
                    NEXVO
                </strong>

                <span>
                    Connect & Create
                </span>

            </div>

            <button
                type="button"
                class="nexvo-menu-close"
                id="nexvoMenuClose"
                aria-label="Close NEXVO menu"
            >
                ×
            </button>

        </div>


        <div class="nexvo-menu-actions">


            <!-- CREATE -->

            <button
                type="button"
                class="nexvo-menu-action"
                data-nexvo-action="create"
            >

                <span class="nexvo-action-icon">
                    ＋
                </span>

                <span class="nexvo-action-content">

                    <strong>
                        Create
                    </strong>

                    <small>
                        Create something new
                    </small>

                </span>

                <span class="nexvo-action-arrow">
                    ›
                </span>

            </button>


            <!-- CREATE GROUP -->

            <button
                type="button"
                class="nexvo-menu-action"
                data-nexvo-action="group"
            >

                <span class="nexvo-action-icon">
                    👥
                </span>

                <span class="nexvo-action-content">

                    <strong>
                        Create Group
                    </strong>

                    <small>
                        Start a group conversation
                    </small>

                </span>

                <span class="nexvo-action-arrow">
                    ›
                </span>

            </button>


            <!-- CREATE COMMUNITY -->

            <button
                type="button"
                class="nexvo-menu-action"
                data-nexvo-action="community"
            >

                <span class="nexvo-action-icon">
                    🌐
                </span>

                <span class="nexvo-action-content">

                    <strong>
                        Create Community
                    </strong>

                    <small>
                        Build a community
                    </small>

                </span>

                <span class="nexvo-action-arrow">
                    ›
                </span>

            </button>


            <!-- MAKE A CALL -->

            <button
                type="button"
                class="nexvo-menu-action"
                data-nexvo-action="call"
            >

                <span class="nexvo-action-icon">
                    📞
                </span>

                <span class="nexvo-action-content">

                    <strong>
                        Make a Call
                    </strong>

                    <small>
                        Start a voice or video call
                    </small>

                </span>

                <span class="nexvo-action-arrow">
                    ›
                </span>

            </button>


        </div>

    `;


    /* =====================================
       ADD TO PAGE
    ===================================== */

    document.body.appendChild(
        overlay
    );

    document.body.appendChild(
        menu
    );

    document.body.appendChild(
        control
    );


    /* =====================================
       OPEN MENU
    ===================================== */

    function openMenu() {

        menu.classList.add(
            "active"
        );

        overlay.classList.add(
            "active"
        );

        menu.setAttribute(
            "aria-hidden",
            "false"
        );

        control.classList.add(
            "active"
        );

    }


    /* =====================================
       CLOSE MENU
    ===================================== */

    function closeMenu() {

        menu.classList.remove(
            "active"
        );

        overlay.classList.remove(
            "active"
        );

        menu.setAttribute(
            "aria-hidden",
            "true"
        );

        control.classList.remove(
            "active"
        );

    }


    /* =====================================
       N BUTTON
    ===================================== */

    control.addEventListener(
        "click",
        function () {

            if (
                menu.classList.contains(
                    "active"
                )
            ) {

                closeMenu();

            } else {

                openMenu();

            }

        }
    );


    /* =====================================
       CLOSE BUTTON
    ===================================== */

    const closeButton =
        document.getElementById(
            "nexvoMenuClose"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeMenu
        );

    }


    /* =====================================
       OVERLAY
    ===================================== */

    overlay.addEventListener(
        "click",
        closeMenu
    );


    /* =====================================
       ESCAPE KEY
    ===================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeMenu();

            }

        }
    );


    /* =====================================
       MENU ACTIONS
    ===================================== */

    const actions =
        menu.querySelectorAll(
            "[data-nexvo-action]"
        );


    actions.forEach(
        function (action) {

            action.addEventListener(
                "click",
                function () {

                    const type =
                        action.dataset.nexvoAction;


                    handleNexvoAction(
                        type
                    );

                }
            );

        }
    );

}


/* =========================================
   HANDLE NEXVO ACTION
========================================= */

function handleNexvoAction(
    type
) {

    switch (type) {


        /* =================================
           CREATE
        ================================= */

        case "create":

            window.location.href =
                "create.html";

            break;


        /* =================================
           GROUP
        ================================= */

        case "group":

            window.location.href =
                "create-group.html";

            break;


        /* =================================
           COMMUNITY
        ================================= */

        case "community":

            window.location.href =
                "create-community.html";

            break;


        /* =================================
           CALL
        ================================= */

        case "call":

            window.location.href =
                "calls.html";

            break;


        default:

            console.warn(
                "NEXVO: Unknown action:",
                type
            );

    }

}