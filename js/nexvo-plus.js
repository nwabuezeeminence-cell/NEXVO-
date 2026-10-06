/* =========================================
   NEXVO
   UNIVERSAL N BUTTON SYSTEM
========================================= */


/* =========================================
   INITIALIZE UNIVERSAL N BUTTON
========================================= */

function initializeNexvoPlusButton() {

    /* =====================================
       REMOVE OLD N / PLUS SYSTEM
    ===================================== */

    const oldElements = [
        document.getElementById("plusButton"),
        document.getElementById("floatingPlus"),
        document.getElementById("plusMenu"),
        document.getElementById("plusOverlay")
    ];

    oldElements.forEach(function (element) {

        if (element) {
            element.remove();
        }

    });


    /* =====================================
       REMOVE OLD PLUS MENUS
    ===================================== */

    document
        .querySelectorAll(".nexvo-plus-menu")
        .forEach(function (element) {

            element.remove();

        });


    /* =====================================
       CREATE N BUTTON
    ===================================== */

    let nexvoButton =
        document.getElementById(
            "nexvoGlobalButton"
        );

    if (!nexvoButton) {

        nexvoButton =
            document.createElement("button");

        nexvoButton.id =
            "nexvoGlobalButton";

        nexvoButton.className =
            "nexvo-global-button";

        nexvoButton.type =
            "button";

        nexvoButton.setAttribute(
            "aria-label",
            "Open NEXVO menu"
        );

        nexvoButton.setAttribute(
            "aria-expanded",
            "false"
        );

        nexvoButton.innerHTML =
            "<span>N</span>";

        document.body.appendChild(
            nexvoButton
        );

    }


    /* =====================================
       CREATE OVERLAY
    ===================================== */

    let nexvoOverlay =
        document.getElementById(
            "nexvoGlobalOverlay"
        );

    if (!nexvoOverlay) {

        nexvoOverlay =
            document.createElement("div");

        nexvoOverlay.id =
            "nexvoGlobalOverlay";

        nexvoOverlay.className =
            "nexvo-global-overlay";

        nexvoOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        document.body.appendChild(
            nexvoOverlay
        );

    }


    /* =====================================
       CREATE MENU
    ===================================== */

    let nexvoMenu =
        document.getElementById(
            "nexvoGlobalMenu"
        );

    if (!nexvoMenu) {

        nexvoMenu =
            document.createElement("div");

        nexvoMenu.id =
            "nexvoGlobalMenu";

        nexvoMenu.className =
            "nexvo-global-menu";

        nexvoMenu.setAttribute(
            "aria-hidden",
            "true"
        );

        nexvoMenu.innerHTML = `

            <div class="nexvo-menu-header">

                <div class="nexvo-menu-brand">

                    <div class="nexvo-menu-logo">
                        N
                    </div>

                    <div>
                        <div class="nexvo-menu-title">
                            NEXVO
                        </div>

                        <div class="nexvo-menu-subtitle">
                            What would you like to do?
                        </div>
                    </div>

                </div>


                <button
                    class="nexvo-menu-close"
                    id="nexvoMenuClose"
                    type="button"
                    aria-label="Close NEXVO menu"
                >
                    ×
                </button>

            </div>


            <div class="nexvo-menu-actions">


                <!-- ADD FRIEND -->

                <button
                    class="nexvo-menu-action"
                    data-action="friend"
                    type="button"
                >

                    <span class="nexvo-action-icon">
                        👤
                    </span>

                    <span class="nexvo-action-text">
                        <strong>Add Friend</strong>
                        <small>Connect with someone</small>
                    </span>

                    <span class="nexvo-action-arrow">
                        ›
                    </span>

                </button>


                <!-- CREATE GROUP -->

                <button
                    class="nexvo-menu-action"
                    data-action="group"
                    type="button"
                >

                    <span class="nexvo-action-icon">
                        👥
                    </span>

                    <span class="nexvo-action-text">
                        <strong>Create Group</strong>
                        <small>Start a group conversation</small>
                    </span>

                    <span class="nexvo-action-arrow">
                        ›
                    </span>

                </button>


                <!-- CREATE COMMUNITY -->

                <button
                    class="nexvo-menu-action"
                    data-action="community"
                    type="button"
                >

                    <span class="nexvo-action-icon">
                        🌐
                    </span>

                    <span class="nexvo-action-text">
                        <strong>Create Community</strong>
                        <small>Build your NEXVO community</small>
                    </span>

                    <span class="nexvo-action-arrow">
                        ›
                    </span>

                </button>


                <!-- MAKE CALL -->

                <button
                    class="nexvo-menu-action"
                    data-action="call"
                    type="button"
                >

                    <span class="nexvo-action-icon">
                        📞
                    </span>

                    <span class="nexvo-action-text">
                        <strong>Make Call</strong>
                        <small>Start a NEXVO call</small>
                    </span>

                    <span class="nexvo-action-arrow">
                        ›
                    </span>

                </button>


            </div>

        `;

        document.body.appendChild(
            nexvoMenu
        );

    }


    /* =====================================
       CLOSE MENU
    ===================================== */

    function closeNexvoMenu() {

        nexvoButton.classList.remove(
            "open"
        );

        nexvoOverlay.classList.remove(
            "open"
        );

        nexvoMenu.classList.remove(
            "open"
        );


        nexvoButton.setAttribute(
            "aria-expanded",
            "false"
        );

        nexvoOverlay.setAttribute(
            "aria-hidden",
            "true"
        );

        nexvoMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    /* =====================================
       OPEN MENU
    ===================================== */

    function openNexvoMenu() {

        nexvoButton.classList.add(
            "open"
        );

        nexvoOverlay.classList.add(
            "open"
        );

        nexvoMenu.classList.add(
            "open"
        );


        nexvoButton.setAttribute(
            "aria-expanded",
            "true"
        );

        nexvoOverlay.setAttribute(
            "aria-hidden",
            "false"
        );

        nexvoMenu.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    /* =====================================
       N BUTTON
    ===================================== */

    nexvoButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            const isOpen =
                nexvoMenu.classList.contains(
                    "open"
                );


            if (isOpen) {

                closeNexvoMenu();

            } else {

                openNexvoMenu();

            }

        }
    );


    /* =====================================
       OVERLAY
    ===================================== */

    nexvoOverlay.addEventListener(
        "click",
        function () {

            closeNexvoMenu();

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
            function (event) {

                event.preventDefault();

                event.stopPropagation();

                closeNexvoMenu();

            }
        );

    }


    /* =====================================
       MENU ACTIONS
    ===================================== */

    nexvoMenu
        .querySelectorAll(
            ".nexvo-menu-action"
        )
        .forEach(function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();

                    event.stopPropagation();


                    const action =
                        button.dataset.action;


                    closeNexvoMenu();


                    handleNexvoPlusAction(
                        action
                    );

                }
            );

        });


    /* =====================================
       ESCAPE KEY
    ===================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                nexvoMenu.classList.contains("open")
            ) {

                closeNexvoMenu();

            }

        }
    );

}


/* =========================================
   N BUTTON ACTION ROUTER
========================================= */

function handleNexvoPlusAction(action) {

    switch (action) {


        /* =================================
           ADD FRIEND
        ================================= */

        case "friend":

            window.location.href =
                "friend-requests.html";

            break;


        /* =================================
           CREATE GROUP
        ================================= */

        case "group":

            window.location.href =
                "create-group.html";

            break;


        /* =================================
           CREATE COMMUNITY
        ================================= */

        case "community":

            window.location.href =
                "create-community.html";

            break;


        /* =================================
           MAKE CALL
        ================================= */

        case "call":

            window.location.href =
                "calls.html";

            break;


        /* =================================
           UNKNOWN ACTION
        ================================= */

        default:

            console.warn(
                "NEXVO: Unknown N button action:",
                action
            );

            break;

    }

}


/* =========================================
   AUTOMATIC INITIALIZATION
========================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {

            initializeNexvoPlusButton();

        }
    );

} else {

    initializeNexvoPlusButton();

}