/* =========================================
   NEXVO
   FRIEND REQUESTS
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const requestsContent =
    document.getElementById(
        "requestsContent"
    );


const incomingCount =
    document.getElementById(
        "incomingCount"
    );


const outgoingCount =
    document.getElementById(
        "outgoingCount"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


const requestTabs =
    document.querySelectorAll(
        ".request-tab"
    );


let currentRequestTab =
    "incoming";



/* =========================================
   BACK BUTTON
========================================= */

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "more.html";

        }
    );

}



/* =========================================
   AVATAR
========================================= */

function getRequestAvatar(
    avatar
) {

    if (!avatar) {

        return "👤";

    }


    if (
        avatar.startsWith("data:image")
    ) {

        return `
            <img
                src="${avatar}"
                alt=""
            >
        `;

    }


    return avatar;

}



/* =========================================
   UPDATE COUNTS
========================================= */

function updateRequestCounts() {

    const incoming =
        getNexvoIncomingFriendRequests();


    const outgoing =
        getNexvoOutgoingFriendRequests();


    if (incomingCount) {

        incomingCount.textContent =
            incoming.length;

    }


    if (outgoingCount) {

        outgoingCount.textContent =
            outgoing.length;

    }

}



/* =========================================
   EMPTY STATE
========================================= */

function renderEmptyState(
    type
) {

    if (type === "incoming") {

        requestsContent.innerHTML = `

            <div class="requests-empty">

                <div class="empty-icon">
                    👥
                </div>

                <h2>
                    No friend requests
                </h2>

                <p>
                    When someone sends you
                    a friend request, it will
                    appear here.
                </p>

            </div>

        `;

        return;

    }


    requestsContent.innerHTML = `

        <div class="requests-empty">

            <div class="empty-icon">
                ✈️
            </div>

            <h2>
                No sent requests
            </h2>

            <p>
                Friend requests you send
                will appear here.
            </p>

        </div>

    `;

}



/* =========================================
   RENDER INCOMING
========================================= */

function renderIncomingRequests() {

    const requests =
        getNexvoIncomingFriendRequests();


    if (!requests.length) {

        renderEmptyState(
            "incoming"
        );

        return;

    }


    requestsContent.innerHTML =
        requests.map(
            function (request) {

                return `

                    <article
                        class="request-card"
                        data-request-id="${request.id}"
                    >

                        <div class="request-avatar">

                            ${getRequestAvatar(
                                request.fromAvatar
                            )}

                        </div>


                        <div class="request-info">

                            <h3
                                class="request-name"
                            >
                                ${escapeRequestHTML(
                                    request.fromName ||
                                    "NEXVO Member"
                                )}
                            </h3>


                            <div
                                class="request-username"
                            >
                                @${escapeRequestHTML(
                                    request.fromUsername ||
                                    ""
                                )}
                            </div>

                        </div>


                        <div class="request-actions">

                            <button
                                class="request-action accept-request"
                                data-request-action="accept"
                                data-request-id="${request.id}"
                                type="button"
                            >
                                Accept
                            </button>


                            <button
                                class="request-action decline-request"
                                data-request-action="decline"
                                data-request-id="${request.id}"
                                type="button"
                            >
                                Decline
                            </button>

                        </div>

                    </article>

                `;

            }
        )
        .join("");

}



/* =========================================
   RENDER OUTGOING
========================================= */

function renderOutgoingRequests() {

    const requests =
        getNexvoOutgoingFriendRequests();


    if (!requests.length) {

        renderEmptyState(
            "outgoing"
        );

        return;

    }


    requestsContent.innerHTML =
        requests.map(
            function (request) {

                return `

                    <article
                        class="request-card"
                        data-request-id="${request.id}"
                    >

                        <div class="request-avatar">

                            ${getRequestAvatar(
                                request.toAvatar
                            )}

                        </div>


                        <div class="request-info">

                            <h3
                                class="request-name"
                            >
                                ${escapeRequestHTML(
                                    request.toName ||
                                    "NEXVO Member"
                                )}
                            </h3>


                            <div
                                class="request-username"
                            >
                                @${escapeRequestHTML(
                                    request.toUsername ||
                                    ""
                                )}
                            </div>

                        </div>


                        <div class="request-actions">

                            <button
                                class="request-action cancel-request"
                                data-request-action="cancel"
                                data-request-id="${request.id}"
                                type="button"
                            >
                                Cancel
                            </button>

                        </div>

                    </article>

                `;

            }
        )
        .join("");

}



/* =========================================
   ESCAPE HTML
========================================= */

function escapeRequestHTML(
    value
) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}



/* =========================================
   RENDER CURRENT TAB
========================================= */

function renderRequests() {

    updateRequestCounts();


    if (
        currentRequestTab ===
        "incoming"
    ) {

        renderIncomingRequests();

    }

    else {

        renderOutgoingRequests();

    }

}



/* =========================================
   TAB SWITCHING
========================================= */

requestTabs.forEach(
    function (tab) {

        tab.addEventListener(
            "click",
            function () {

                requestTabs.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                tab.classList.add(
                    "active"
                );


                currentRequestTab =
                    tab.dataset.tab ||
                    "incoming";


                renderRequests();

            }
        );

    }
);



/* =========================================
   REQUEST ACTIONS
========================================= */

if (requestsContent) {

    requestsContent.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    "[data-request-action]"
                );


            if (!button) {

                return;

            }


            const action =
                button.dataset.requestAction;


            const requestId =
                button.dataset.requestId;


            if (!requestId) {

                return;

            }



            /* =============================
               ACCEPT
            ============================== */

            if (action === "accept") {

                const result =
                    acceptNexvoFriendRequest(
                        requestId
                    );


                if (
                    result &&
                    result.success
                ) {

                    renderRequests();

                }

                return;

            }



            /* =============================
               DECLINE
            ============================== */

            if (action === "decline") {

                const success =
                    declineNexvoFriendRequest(
                        requestId
                    );


                if (success) {

                    renderRequests();

                }

                return;

            }



            /* =============================
               CANCEL
            ============================== */

            if (action === "cancel") {

                const success =
                    cancelNexvoFriendRequest(
                        requestId
                    );


                if (success) {

                    renderRequests();

                }

            }

        }
    );

}



/* =========================================
   PLUS MENU
========================================= */

const plusButton =
    document.getElementById(
        "plusButton"
    );


const plusMenu =
    document.getElementById(
        "plusMenu"
    );


const plusOverlay =
    document.getElementById(
        "plusOverlay"
    );


if (
    plusButton &&
    plusMenu &&
    plusOverlay
) {

    initializeNexvoPlusButton(
        plusButton,
        plusMenu,
        plusOverlay
    );

}



/* =========================================
   PLUS ACTIONS
========================================= */

const plusActions =
    document.querySelectorAll(
        ".plus-action"
    );


plusActions.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const action =
                    button.dataset.action;


                if (
                    action === "friend"
                ) {

                    window.location.href =
                        "add-friend.html";

                }


                else if (
                    action === "group"
                ) {

                    alert(
                        "Group creation will be connected soon."
                    );

                }


                else if (
                    action === "community"
                ) {

                    alert(
                        "Community creation will be connected soon."
                    );

                }


                else if (
                    action === "call"
                ) {

                    window.location.href =
                        "calls.html";

                }

            }
        );

    }
);



/* =========================================
   BOTTOM NAVIGATION
========================================= */

initializeNexvoNavigation(
    "more"
);



/* =========================================
   INITIALIZE
========================================= */

renderRequests();