/* =========================================
   NEXVO
   FRIEND REQUESTS PAGE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const backButton =
    document.getElementById("backButton");

const requestsList =
    document.getElementById("requestsList");

const sentRequestsList =
    document.getElementById("sentRequestsList");

const requestCount =
    document.getElementById("requestCount");


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupBackButton();

        renderFriendRequests();

    }
);


/* =========================================
   BACK BUTTON
========================================= */

function setupBackButton() {

    if (!backButton) {
        return;
    }


    backButton.addEventListener(
        "click",
        function () {

            /*
             * Return to the previous page.
             */

            if (window.history.length > 1) {

                window.history.back();

            } else {

                /*
                 * Fallback if this page was opened directly.
                 */

                window.location.href =
                    "friends.html";

            }

        }
    );

}


/* =========================================
   RENDER FRIEND REQUESTS
========================================= */

function renderFriendRequests() {

    /*
     * Make sure the required elements exist.
     */

    if (!requestsList || !sentRequestsList) {
        return;
    }


    /*
     * Clear existing content.
     */

    requestsList.innerHTML = "";

    sentRequestsList.innerHTML = "";


    /*
     * Get friend data.
     */

    let friendsData = [];

    try {

        if (
            typeof NEXVO_FRIENDS !== "undefined"
            &&
            Array.isArray(NEXVO_FRIENDS)
        ) {

            friendsData = NEXVO_FRIENDS;

        }

    } catch (error) {

        console.warn(
            "Unable to load friend data.",
            error
        );

    }


    /*
     * Separate requests.
     */

    const receivedRequests =
        friendsData.filter(function (friend) {

            return friend.status === "received";

        });


    const sentRequests =
        friendsData.filter(function (friend) {

            return friend.status === "sent";

        });


    /*
     * Update request count.
     */

    if (requestCount) {

        requestCount.textContent =
            receivedRequests.length;

    }


    /*
     * Show empty states.
     */

    if (receivedRequests.length === 0) {

        requestsList.innerHTML = `
            <div class="empty-state">
                <p>No friend requests yet.</p>
            </div>
        `;

    }


    if (sentRequests.length === 0) {

        sentRequestsList.innerHTML = `
            <div class="empty-state">
                <p>No sent requests.</p>
            </div>
        `;

    }


    /*
     * Render received requests.
     */

    receivedRequests.forEach(function (friend) {

        requestsList.appendChild(
            createRequestCard(friend, "received")
        );

    });


    /*
     * Render sent requests.
     */

    sentRequests.forEach(function (friend) {

        sentRequestsList.appendChild(
            createRequestCard(friend, "sent")
        );

    });

}


/* =========================================
   REQUEST CARD
========================================= */

function createRequestCard(
    friend,
    type
) {

    const card =
        document.createElement("div");

    card.className =
        "friend-request-card";


    const name =
        friend.name ||
        friend.username ||
        "NEXVO User";


    const username =
        friend.username
            ? "@" + friend.username
            : "";


    card.innerHTML = `

        <div class="friend-request-info">

            <div class="friend-avatar">
                ${getFriendInitial(name)}
            </div>

            <div class="friend-details">

                <h3>
                    ${name}
                </h3>

                <p>
                    ${username}
                </p>

            </div>

        </div>

        ${
            type === "received"
                ? `
                    <div class="friend-request-actions">

                        <button
                            type="button"
                            class="accept-request"
                            data-id="${friend.id || ""}"
                        >
                            Accept
                        </button>

                        <button
                            type="button"
                            class="decline-request"
                            data-id="${friend.id || ""}"
                        >
                            Decline
                        </button>

                    </div>
                `
                : `
                    <span class="request-status">
                        Sent
                    </span>
                `
        }

    `;


    /*
     * Received request actions.
     */

    if (type === "received") {

        const acceptButton =
            card.querySelector(
                ".accept-request"
            );


        const declineButton =
            card.querySelector(
                ".decline-request"
            );


        if (acceptButton) {

            acceptButton.addEventListener(
                "click",
                function () {

                    handleAcceptRequest(
                        friend,
                        card
                    );

                }
            );

        }


        if (declineButton) {

            declineButton.addEventListener(
                "click",
                function () {

                    handleDeclineRequest(
                        friend,
                        card
                    );

                }
            );

        }

    }


    return card;

}


/* =========================================
   ACCEPT REQUEST
========================================= */

function handleAcceptRequest(
    friend,
    card
) {

    /*
     * Remove the request visually.
     */

    if (card) {

        card.remove();

    }


    /*
     * Update count.
     */

    if (requestCount) {

        const currentCount =
            parseInt(
                requestCount.textContent,
                10
            ) || 0;

        requestCount.textContent =
            Math.max(
                0,
                currentCount - 1
            );

    }

}


/* =========================================
   DECLINE REQUEST
========================================= */

function handleDeclineRequest(
    friend,
    card
) {

    /*
     * Remove the request visually.
     */

    if (card) {

        card.remove();

    }


    /*
     * Update count.
     */

    if (requestCount) {

        const currentCount =
            parseInt(
                requestCount.textContent,
                10
            ) || 0;

        requestCount.textContent =
            Math.max(
                0,
                currentCount - 1
            );

    }

}


/* =========================================
   GET INITIAL
========================================= */

function getFriendInitial(name) {

    if (!name) {
        return "N";
    }


    return name
        .charAt(0)
        .toUpperCase();

}