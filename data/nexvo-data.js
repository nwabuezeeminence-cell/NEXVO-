/* =========================================
   NEXVO
   CORE DATA SYSTEM
========================================= */


/*
    IMPORTANT

    This is currently a FRONT-END prototype.

    localStorage is being used only so we
    can develop the interface.

    Later this system will be replaced or
    connected to a real backend/database.
*/


/* =========================================
   STORAGE KEYS
========================================= */

const NEXVO_STORAGE = {

    USER:
        "nexvoUser",

    AUTH:
        "nexvoAuthenticated",

    FRIENDS:
        "nexvoFriends",

    REQUESTS:
        "nexvoFriendRequests",

    CHATS:
        "nexvoChats",

    COMMUNITIES:
        "nexvoCommunities",

    GROUPS:
        "nexvoGroups",

    NOTIFICATIONS:
        "nexvoNotifications",

    SETTINGS:
        "nexvoSettings"

};



/* =========================================
   DEFAULT USER
========================================= */

const DEFAULT_NEXVO_USER = {

    id: null,

    name: "",

    username: "",

    bio: "",

    profilePhoto: "",

    profileComplete: false,

    createdAt: null

};



/* =========================================
   GET USER
========================================= */

function getNexvoUser() {

    const saved =
        localStorage.getItem(
            NEXVO_STORAGE.USER
        );


    if (!saved) {

        return {
            ...DEFAULT_NEXVO_USER
        };

    }


    try {

        return JSON.parse(
            saved
        );

    }

    catch (error) {

        console.error(
            "NEXVO user data could not be read.",
            error
        );


        return {
            ...DEFAULT_NEXVO_USER
        };

    }

}



/* =========================================
   SAVE USER
========================================= */

function saveNexvoUser(user) {

    localStorage.setItem(

        NEXVO_STORAGE.USER,

        JSON.stringify(
            user
        )

    );

}



/* =========================================
   UPDATE USER
========================================= */

function updateNexvoUser(updates) {

    const currentUser =
        getNexvoUser();


    const updatedUser = {

        ...currentUser,

        ...updates

    };


    saveNexvoUser(
        updatedUser
    );


    return updatedUser;

}



/* =========================================
   GET ARRAY DATA
========================================= */

function getNexvoArray(
    storageKey
) {

    const saved =
        localStorage.getItem(
            storageKey
        );


    if (!saved) {

        return [];

    }


    try {

        const parsed =
            JSON.parse(
                saved
            );


        return Array.isArray(
            parsed
        )
            ? parsed
            : [];

    }

    catch (error) {

        console.error(
            "NEXVO data could not be read.",
            error
        );


        return [];

    }

}



/* =========================================
   SAVE ARRAY DATA
========================================= */

function saveNexvoArray(
    storageKey,
    data
) {

    localStorage.setItem(

        storageKey,

        JSON.stringify(
            data
        )

    );

}



/* =========================================
   FRIENDS
========================================= */

function getNexvoFriends() {

    return getNexvoArray(
        NEXVO_STORAGE.FRIENDS
    );

}


function saveNexvoFriends(
    friends
) {

    saveNexvoArray(

        NEXVO_STORAGE.FRIENDS,

        friends

    );

}



/* =========================================
   FRIEND REQUESTS
========================================= */

function getNexvoFriendRequests() {

    return getNexvoArray(
        NEXVO_STORAGE.REQUESTS
    );

}


function saveNexvoFriendRequests(
    requests
) {

    saveNexvoArray(

        NEXVO_STORAGE.REQUESTS,

        requests

    );

}



/* =========================================
   CHATS
========================================= */

function getNexvoChats() {

    return getNexvoArray(
        NEXVO_STORAGE.CHATS
    );

}


function saveNexvoChats(
    chats
) {

    saveNexvoArray(

        NEXVO_STORAGE.CHATS,

        chats

    );

}



/* =========================================
   COMMUNITIES
========================================= */

function getNexvoCommunities() {

    return getNexvoArray(
        NEXVO_STORAGE.COMMUNITIES
    );

}


function saveNexvoCommunities(
    communities
) {

    saveNexvoArray(

        NEXVO_STORAGE.COMMUNITIES,

        communities

    );

}



/* =========================================
   GROUPS
========================================= */

function getNexvoGroups() {

    return getNexvoArray(
        NEXVO_STORAGE.GROUPS
    );

}


function saveNexvoGroups(
    groups
) {

    saveNexvoArray(

        NEXVO_STORAGE.GROUPS,

        groups

    );

}



/* =========================================
   NOTIFICATIONS
========================================= */

function getNexvoNotifications() {

    return getNexvoArray(
        NEXVO_STORAGE.NOTIFICATIONS
    );

}


function saveNexvoNotifications(
    notifications
) {

    saveNexvoArray(

        NEXVO_STORAGE.NOTIFICATIONS,

        notifications

    );

}



/* =========================================
   SETTINGS
========================================= */

function getNexvoSettings() {

    const saved =
        localStorage.getItem(
            NEXVO_STORAGE.SETTINGS
        );


    if (!saved) {

        return {

            theme:
                "system",

            sound:
                true,

            vibration:
                true,

            notifications:
                true

        };

    }


    try {

        return JSON.parse(
            saved
        );

    }

    catch (error) {

        return {

            theme:
                "system",

            sound:
                true,

            vibration:
                true,

            notifications:
                true

        };

    }

}



/* =========================================
   SAVE SETTINGS
========================================= */

function saveNexvoSettings(
    settings
) {

    localStorage.setItem(

        NEXVO_STORAGE.SETTINGS,

        JSON.stringify(
            settings
        )

    );

}



/* =========================================
   AUTH STATUS
========================================= */

function isNexvoAuthenticated() {

    return (
        localStorage.getItem(
            NEXVO_STORAGE.AUTH
        ) === "true"
    );

}



/* =========================================
   LOGOUT
========================================= */

function logoutNexvo() {

    localStorage.removeItem(
        NEXVO_STORAGE.AUTH
    );

    window.location.href =
        "auth.html";

}



/* =========================================
   CREATE USER ID
========================================= */

function createNexvoId() {

    return (

        "nexvo_" +

        Date.now().toString(36) +

        "_" +

        Math.random()
            .toString(36)
            .substring(2, 8)

    );

}



/* =========================================
   INITIALIZE USER
========================================= */

function initializeNexvoUser() {

    const user =
        getNexvoUser();


    if (!user.id) {

        user.id =
            createNexvoId();

    }


    if (!user.createdAt) {

        user.createdAt =
            new Date().toISOString();

    }


    saveNexvoUser(
        user
    );


    return user;

}
/* =========================================
   NEXVO FRIEND REQUEST SYSTEM
========================================= */


/* =========================================
   CREATE FRIEND REQUEST
========================================= */

function createNexvoFriendRequest(targetUser) {

    const currentUser = getNexvoUser();

    if (!currentUser) {
        console.warn(
            "NEXVO: Current user not found."
        );

        return null;
    }


    if (!targetUser) {
        console.warn(
            "NEXVO: Target user is missing."
        );

        return null;
    }


    const requests =
        getNexvoFriendRequests();


    /* =====================================
       PREVENT REQUEST TO YOURSELF
    ===================================== */

    if (
        currentUser.id &&
        targetUser.id &&
        String(currentUser.id) ===
        String(targetUser.id)
    ) {

        return {
            success: false,
            message:
                "You cannot send a friend request to yourself."
        };

    }


    /* =====================================
       CHECK IF ALREADY FRIENDS
    ===================================== */

    const friends =
        getNexvoFriends();


    const alreadyFriend =
        friends.some(function (friend) {

            return (
                String(friend.id) ===
                String(targetUser.id)
            );

        });


    if (alreadyFriend) {

        return {
            success: false,
            message:
                "You are already friends."
        };

    }


    /* =====================================
       CHECK EXISTING REQUEST
    ===================================== */

    const existingRequest =
        requests.find(function (request) {

            return (
                String(request.fromId) ===
                    String(currentUser.id) &&
                String(request.toId) ===
                    String(targetUser.id)
            );

        });


    if (existingRequest) {

        return {
            success: false,
            message:
                "Friend request already sent.",
            request: existingRequest
        };

    }


    /* =====================================
       CREATE REQUEST
    ===================================== */

    const request = {

        id: createNexvoId(),

        fromId:
            currentUser.id,

        fromName:
            currentUser.name,

        fromUsername:
            currentUser.username,

        fromAvatar:
            currentUser.profilePhoto || "",

        toId:
            targetUser.id,

        toName:
            targetUser.name || "",

        toUsername:
            targetUser.username || "",

        toAvatar:
            targetUser.avatar ||
            targetUser.profilePhoto ||
            "",

        status:
            "pending",

        createdAt:
            Date.now()

    };


    requests.push(request);

    saveNexvoFriendRequests(
        requests
    );


    /* =====================================
       CREATE NOTIFICATION
    ===================================== */

    const notifications =
        getNexvoNotifications();


    notifications.unshift({

        id:
            createNexvoId(),

        type:
            "friend_request",

        title:
            "Friend request sent",

        message:
            "Your friend request was sent.",

        read:
            false,

        createdAt:
            Date.now()

    });


    saveNexvoNotifications(
        notifications
    );


    return {

        success: true,

        message:
            "Friend request sent.",

        request:
            request

    };

}



/* =========================================
   CANCEL FRIEND REQUEST
========================================= */

function cancelNexvoFriendRequest(
    requestId
) {

    const requests =
        getNexvoFriendRequests();


    const newRequests =
        requests.filter(function (request) {

            return String(request.id) !==
                String(requestId);

        });


    if (
        newRequests.length ===
        requests.length
    ) {

        return false;

    }


    saveNexvoFriendRequests(
        newRequests
    );


    return true;

}



/* =========================================
   DECLINE FRIEND REQUEST
========================================= */

function declineNexvoFriendRequest(
    requestId
) {

    const requests =
        getNexvoFriendRequests();


    const request =
        requests.find(function (item) {

            return String(item.id) ===
                String(requestId);

        });


    if (!request) {

        return false;

    }


    const newRequests =
        requests.filter(function (item) {

            return String(item.id) !==
                String(requestId);

        });


    saveNexvoFriendRequests(
        newRequests
    );


    return true;

}



/* =========================================
   ACCEPT FRIEND REQUEST
========================================= */

function acceptNexvoFriendRequest(
    requestId
) {

    const currentUser =
        getNexvoUser();


    const requests =
        getNexvoFriendRequests();


    const request =
        requests.find(function (item) {

            return String(item.id) ===
                String(requestId);

        });


    if (!request) {

        return {

            success: false,

            message:
                "Friend request not found."

        };

    }


    /* =====================================
       CREATE FRIEND ENTRIES
    ===================================== */

    const friends =
        getNexvoFriends();


    const alreadyFriend =
        friends.some(function (friend) {

            return (
                String(friend.id) ===
                String(request.fromId)
            );

        });


    if (!alreadyFriend) {

        friends.push({

            id:
                request.fromId,

            name:
                request.fromName,

            username:
                request.fromUsername,

            avatar:
                request.fromAvatar || "👤",

            online:
                false,

            addedAt:
                Date.now()

        });

    }


    saveNexvoFriends(
        friends
    );


    /* =====================================
       REMOVE REQUEST
    ===================================== */

    const remainingRequests =
        requests.filter(function (item) {

            return String(item.id) !==
                String(requestId);

        });


    saveNexvoFriendRequests(
        remainingRequests
    );


    /* =====================================
       NOTIFICATION
    ===================================== */

    const notifications =
        getNexvoNotifications();


    notifications.unshift({

        id:
            createNexvoId(),

        type:
            "friend_added",

        title:
            "New friend",

        message:
            request.fromName +
            " is now your friend.",

        read:
            false,

        createdAt:
            Date.now()

    });


    saveNexvoNotifications(
        notifications
    );


    return {

        success: true,

        message:
            "Friend request accepted."

    };

}



/* =========================================
   GET INCOMING REQUESTS
========================================= */

function getNexvoIncomingFriendRequests() {

    const currentUser =
        getNexvoUser();


    if (!currentUser) {

        return [];

    }


    const requests =
        getNexvoFriendRequests();


    return requests.filter(
        function (request) {

            return (
                String(request.toId) ===
                String(currentUser.id)
            );

        }
    );

}



/* =========================================
   GET OUTGOING REQUESTS
========================================= */

function getNexvoOutgoingFriendRequests() {

    const currentUser =
        getNexvoUser();


    if (!currentUser) {

        return [];

    }


    const requests =
        getNexvoFriendRequests();


    return requests.filter(
        function (request) {

            return (
                String(request.fromId) ===
                String(currentUser.id)
            );

        }
    );

}