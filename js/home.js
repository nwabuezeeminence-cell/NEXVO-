/* =========================================
   NEXVO
   HOME ENGINE
========================================= */


/* =========================================
   ELEMENTS
========================================= */
const videoButton =
    document.getElementById("videoButton");

const profileButton =
    document.getElementById(
        "profileButton"
    );


const homeAvatar =
    document.getElementById(
        "homeAvatar"
    );


const searchInput =
    document.getElementById(
        "searchInput"
    );


const clearSearch =
    document.getElementById(
        "clearSearch"
    );


const searchResults =
    document.getElementById(
        "searchResults"
    );


const conversationList =
    document.getElementById(
        "conversationList"
    );


const emptyState =
    document.getElementById(
        "emptyState"
    );


const plusButton =
    document.getElementById(
        "plusButton"
    );


const plusBackdrop =
    document.getElementById(
        "plusBackdrop"
    );


const plusMenu =
    document.getElementById(
        "plusMenu"
    );


const closePlusMenu =
    document.getElementById(
        "closePlusMenu"
    );


const addActions =
    document.querySelectorAll(
        ".add-action"
    );



/* =========================================
   PROFILE
========================================= */

function loadHomeProfile() {

    const identity =
        ensureNexvoId();


    if (
        identity.avatar
    ) {

        homeAvatar.innerHTML = `

            <img
                src="${escapeHTML(
                    identity.avatar
                )}"
                alt="Profile"
            >

        `;

    }

}


loadHomeProfile();



/* =========================================
   CONVERSATIONS
========================================= */

function renderConversations() {

    /*
     * Conversations will eventually come
     * from the NEXVO backend.
     *
     * For now, no fake conversations are
     * inserted.
     */

    const conversations = [];


    conversationList.innerHTML =
        "";


    if (
        conversations.length ===
        0
    ) {

        emptyState.style.display =
            "flex";

        return;

    }


    emptyState.style.display =
        "none";


    conversations.forEach(
        function (conversation) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "conversation-card";


            card.innerHTML = `

                <div
                    class="conversation-avatar"
                >
                    👤
                </div>

                <div
                    class="conversation-info"
                >

                    <strong>
                        ${escapeHTML(
                            conversation.name
                        )}
                    </strong>

                    <p>
                        ${escapeHTML(
                            conversation.lastMessage
                        )}
                    </p>

                </div>

            `;


            conversationList.appendChild(
                card
            );

        }
    );

}



/* =========================================
   SEARCH
========================================= */

searchInput.addEventListener(
    "input",
    function () {

        const value =
            searchInput.value.trim();


        clearSearch.style.display =
            value
                ? "block"
                : "none";


        if (!value) {

            searchResults.innerHTML =
                "";

            searchResults.classList.remove(
                "active"
            );

            return;

        }


        /*
         * The actual member search will be
         * connected to the backend later.
         *
         * We don't show fake people.
         */

        searchResults.innerHTML = `

            <div class="empty-state"
                 style="min-height:180px">

                <div class="empty-icon">
                    ⌕
                </div>

                <h2>
                    Search will connect to NEXVO members
                </h2>

                <p>
                    Member discovery will be
                    connected when the NEXVO
                    account server is ready.
                </p>

            </div>

        `;


        searchResults.classList.add(
            "active"
        );

    }
);



/* =========================================
   CLEAR SEARCH
========================================= */

clearSearch.addEventListener(
    "click",
    function () {

        searchInput.value =
            "";


        clearSearch.style.display =
            "none";


        searchResults.innerHTML =
            "";


        searchResults.classList.remove(
            "active"
        );


        searchInput.focus();

    }
);



/* =========================================
   PLUS MENU
========================================= */

function openPlusMenu() {

    plusButton.classList.add(
        "active"
    );


    plusBackdrop.classList.add(
        "active"
    );


    plusMenu.classList.add(
        "active"
    );


    plusMenu.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeMenu() {

    plusButton.classList.remove(
        "active"
    );


    plusBackdrop.classList.remove(
        "active"
    );


    plusMenu.classList.remove(
        "active"
    );


    plusMenu.setAttribute(
        "aria-hidden",
        "true"
    );

}


plusButton.addEventListener(
    "click",
    function () {

        if (
            plusMenu.classList.contains(
                "active"
            )
        ) {

            closeMenu();

        }

        else {

            openPlusMenu();

        }

    }
);


closePlusMenu.addEventListener(
    "click",
    closeMenu
);


plusBackdrop.addEventListener(
    "click",
    closeMenu
);



/* =========================================
   PLUS ACTIONS
========================================= */

addActions.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const action =
                    button.dataset.action;


                closeMenu();


                if (
                    action ===
                    "friend"
                ) {

                    window.location.href =
                        "add-friend.html";

                }


                else if (
                    action ===
                    "scan"
                ) {

                    window.location.href =
                        "qr-scanner.html";

                }


                else if (
                    action ===
                    "group"
                ) {

                    alert(
                        "Group creation will be added next."
                    );

                }


                else if (
                    action ===
                    "community"
                ) {

                    alert(
                        "Community creation will be added next."
                    );

                }


                else if (
                    action ===
                    "call"
                ) {

                    alert(
                        "Calling will be added when communication services are connected."
                    );

                }

            }
        );

    }
);



/* =========================================
   PROFILE
========================================= */

profileButton.addEventListener(
    "click",
    function () {

        window.location.href =
            "profile.html";

    }
);



/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}
if (videoButton) {

    videoButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "video.html";

        }
    );

}


/* =========================================
   START
========================================= */

renderConversations();
