/* =========================================
   NEXVO
   FRIEND REQUEST SYSTEM
========================================= */


/* =========================================
   STORAGE
========================================= */

const NEXVO_FRIENDS_STORAGE =
    "nexvoFriendsData";


/* =========================================
   DEFAULT DATA
========================================= */

const DEFAULT_FRIEND_DATA = {

    friends: [],

    sentRequests: [],

    receivedRequests: [],

    blocked: []

};



/* =========================================
   LOAD DATA
========================================= */

function loadFriendData() {

    const saved =
        localStorage.getItem(
            NEXVO_FRIENDS_STORAGE
        );


    if (!saved) {

        return {
            ...DEFAULT_FRIEND_DATA
        };

    }


    try {

        const data =
            JSON.parse(saved);


        return {

            friends:
                Array.isArray(data.friends)
                    ? data.friends
                    : [],

            sentRequests:
                Array.isArray(
                    data.sentRequests
                )
                    ? data.sentRequests
                    : [],

            receivedRequests:
                Array.isArray(
                    data.receivedRequests
                )
                    ? data.receivedRequests
                    : [],

            blocked:
                Array.isArray(data.blocked)
                    ? data.blocked
                    : []

        };

    }

    catch (error) {

        console.error(
            "Could not load friend data:",
            error
        );


        return {
            ...DEFAULT_FRIEND_DATA
        };

    }

}



/* =========================================
   SAVE DATA
========================================= */

function saveFriendData(
    data
) {

    localStorage.setItem(
        NEXVO_FRIENDS_STORAGE,
        JSON.stringify(data)
    );

}



/* =========================================
   GET DATA
========================================= */

function getFriendData() {

    return loadFriendData();

}



/* =========================================
   CHECK FRIEND
========================================= */

function areFriends(
    nexvoId
) {

    const data =
        loadFriendData();


    return data.friends.some(
        function (friend) {

            return (
                friend.nexvoId ===
                nexvoId
            );

        }
    );

}



/* =========================================
   CHECK SENT REQUEST
========================================= */

function hasSentFriendRequest(
    nexvoId
) {

    const data =
        loadFriendData();


    return data.sentRequests.some(
        function (request) {

            return (
                request.nexvoId ===
                nexvoId
            );

        }
    );

}



/* =========================================
   CHECK RECEIVED REQUEST
========================================= */

function hasReceivedFriendRequest(
    nexvoId
) {

    const data =
        loadFriendData();


    return data.receivedRequests.some(
        function (request) {

            return (
                request.nexvoId ===
                nexvoId
            );

        }
    );

}



/* =========================================
   SEND REQUEST
========================================= */

function sendFriendRequest(
    person
) {

    if (
        !person ||
        !person.nexvoId
    ) {

        return {
            success: false,
            message:
                "Invalid NEXVO member."
        };

    }


    const identity =
        ensureNexvoId();


    if (
        person.nexvoId ===
        identity.nexvoId
    ) {

        return {
            success: false,
            message:
                "You cannot add yourself."
        };

    }


    const data =
        loadFriendData();


    if (
        data.blocked.includes(
            person.nexvoId
        )
    ) {

        return {
            success: false,
            message:
                "This member is blocked."
        };

    }


    if (
        areFriends(
            person.nexvoId
        )
    ) {

        return {
            success: false,
            message:
                "You are already friends."
        };

    }


    if (
        hasSentFriendRequest(
            person.nexvoId
        )
    ) {

        return {
            success: false,
            message:
                "Friend request already sent."
        };

    }


    /*
     * If the other person has already
     * sent us a request, accept it instead.
     */

    if (
        hasReceivedFriendRequest(
            person.nexvoId
        )
    ) {

        acceptFriendRequest(
            person.nexvoId
        );


        return {
            success: true,
            message:
                "You are now friends."
        };

    }


    data.sentRequests.push({

        nexvoId:
            person.nexvoId,

        displayName:
            person.displayName || "",

        username:
            person.username || "",

        sentAt:
            new Date().toISOString()

    });


    saveFriendData(
        data
    );


    return {

        success: true,

        message:
            "Friend request sent."

    };

}



/* =========================================
   ACCEPT REQUEST
========================================= */

function acceptFriendRequest(
    nexvoId
) {

    const data =
        loadFriendData();


    const requestIndex =
        data.receivedRequests.findIndex(
            function (request) {

                return (
                    request.nexvoId ===
                    nexvoId
                );

            }
        );


    if (
        requestIndex === -1
    ) {

        return {
            success: false,
            message:
                "Request not found."
        };

    }


    const request =
        data.receivedRequests[
            requestIndex
        ];


    /*
     * Remove incoming request.
     */

    data.receivedRequests.splice(
        requestIndex,
        1
    );


    /*
     * Add to friends.
     */

    if (
        !data.friends.some(
            function (friend) {

                return (
                    friend.nexvoId ===
                    nexvoId
                );

            }
        )
    ) {

        data.friends.push({

            nexvoId:
                request.nexvoId,

            displayName:
                request.displayName || "",

            username:
                request.username || "",

            friendsSince:
                new Date().toISOString()

        });

    }


    /*
     * Remove matching sent request
     * if it exists locally.
     */

    data.sentRequests =
        data.sentRequests.filter(
            function (sent) {

                return (
                    sent.nexvoId !==
                    nexvoId
                );

            }
        );


    saveFriendData(
        data
    );


    return {

        success: true,

        message:
            "Friend request accepted."

    };

}



/* =========================================
   DECLINE REQUEST
========================================= */

function declineFriendRequest(
    nexvoId
) {

    const data =
        loadFriendData();


    const before =
        data.receivedRequests.length;


    data.receivedRequests =
        data.receivedRequests.filter(
            function (request) {

                return (
                    request.nexvoId !==
                    nexvoId
                );

            }
        );


    saveFriendData(
        data
    );


    return {

        success:
            before !==
            data.receivedRequests.length,

        message:
            "Friend request declined."

    };

}



/* =========================================
   CANCEL SENT REQUEST
========================================= */

function cancelFriendRequest(
    nexvoId
) {

    const data =
        loadFriendData();


    const before =
        data.sentRequests.length;


    data.sentRequests =
        data.sentRequests.filter(
            function (request) {

                return (
                    request.nexvoId !==
                    nexvoId
                );

            }
        );


    saveFriendData(
        data
    );


    return {

        success:
            before !==
            data.sentRequests.length,

        message:
            "Friend request cancelled."

    };

}



/* =========================================
   REMOVE FRIEND
========================================= */

function removeFriend(
    nexvoId
) {

    const data =
        loadFriendData();


    data.friends =
        data.friends.filter(
            function (friend) {

                return (
                    friend.nexvoId !==
                    nexvoId
                );

            }
        );


    saveFriendData(
        data
    );


    return {

        success: true,

        message:
            "Friend removed."

    };

}



/* =========================================
   BLOCK MEMBER
========================================= */

function blockMember(
    nexvoId
) {

    const data =
        loadFriendData();


    if (
        !data.blocked.includes(
            nexvoId
        )
    ) {

        data.blocked.push(
            nexvoId
        );

    }


    data.friends =
        data.friends.filter(
            function (friend) {

                return (
                    friend.nexvoId !==
                    nexvoId
                );

            }
        );


    data.sentRequests =
        data.sentRequests.filter(
            function (request) {

                return (
                    request.nexvoId !==
                    nexvoId
                );

            }
        );


    data.receivedRequests =
        data.receivedRequests.filter(
            function (request) {

                return (
                    request.nexvoId !==
                    nexvoId
                );

            }
        );


    saveFriendData(
        data
    );


    return {

        success: true,

        message:
            "Member blocked."

    };

}