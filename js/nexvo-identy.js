/* =========================================
   NEXVO
   USER IDENTITY SYSTEM
========================================= */

window.nexvoIdentity = null;


/* =========================================
   GENERATE NEXVO ID
========================================= */

function generateNexvoId(uid) {

    if (!uid) {
        return null;
    }

    const clean =
        uid
            .replace(
                /[^a-zA-Z0-9]/g,
                ""
            )
            .toUpperCase();

    return (
        "NV-" +
        clean.substring(
            0,
            8
        )
    );

}


/* =========================================
   INITIALIZE IDENTITY
========================================= */

async function initializeNexvoIdentity() {

    if (!window.nexvoCurrentUser) {

        throw new Error(
            "NEXVO Firebase user is not available."
        );

    }


    if (!window.nexvoDatabase) {

        throw new Error(
            "NEXVO Firebase database is not available."
        );

    }


    const uid =
        window.nexvoCurrentUser.uid;


    const userRef =
        window.nexvoDatabase
            .ref("nexvoUsers")
            .child(uid);


    const snapshot =
        await userRef.once(
            "value"
        );


    const existing =
        snapshot.val();


    /* =====================================
       EXISTING USER
    ====================================== */

    if (existing) {

        /*
         * The user may have been created
         * before NEXVO IDs were added.
         *
         * If an ID already exists,
         * keep it.
         */

        if (
            existing.nexvoId
        ) {

            window.nexvoIdentity =
                existing;

            return existing;

        }


        /*
         * Existing record has no NEXVO ID.
         * Generate one now.
         */

        const nexvoId =
            generateNexvoId(
                uid
            );


        await userRef.update({

            nexvoId:
                nexvoId

        });


        existing.nexvoId =
            nexvoId;


        window.nexvoIdentity =
            existing;


        console.log(
            "NEXVO ID created:",
            nexvoId
        );


        return existing;

    }


    /* =====================================
       NEW USER
    ====================================== */

    const nexvoId =
        generateNexvoId(
            uid
        );


    const userData = {

        uid:
            uid,

        nexvoId:
            nexvoId,

        displayName:
            "NEXVO Member",

        createdAt:
            firebase.database
                .ServerValue
                .TIMESTAMP,

        online:
            true,

        lastSeen:
            firebase.database
                .ServerValue
                .TIMESTAMP

    };


    await userRef.set(
        userData
    );


    window.nexvoIdentity =
        userData;


    console.log(
        "NEXVO identity created:",
        nexvoId
    );


    return userData;

}


/* =========================================
   UPDATE IDENTITY
========================================= */

function updateNexvoIdentity(
    updates
) {

    if (
        !window.nexvoCurrentUser ||
        !window.nexvoIdentity
    ) {

        return Promise.reject(
            new Error(
                "NEXVO identity is not ready."
            )
        );

    }


    return window.nexvoDatabase
        .ref("nexvoUsers")
        .child(
            window.nexvoCurrentUser.uid
        )
        .update(
            updates
        )
        .then(
            function () {

                Object.assign(
                    window.nexvoIdentity,
                    updates
                );


                return window.nexvoIdentity;

            }
        );

}


/* =========================================
   FIND USER
========================================= */

async function findNexvoUser(
    nexvoId
) {

    if (!nexvoId) {

        return null;

    }


    const normalized =
        nexvoId
            .trim()
            .toUpperCase();


    const snapshot =
        await window.nexvoDatabase
            .ref("nexvoUsers")
            .orderByChild(
                "nexvoId"
            )
            .equalTo(
                normalized
            )
            .once(
                "value"
            );


    let result =
        null;


    snapshot.forEach(
        function (child) {

            result =
                child.val();

        }
    );


    return result;

}


/* =========================================
   ONLINE
========================================= */

function setNexvoOnline() {

    if (
        !window.nexvoCurrentUser
    ) {

        return;

    }


    window.nexvoDatabase
        .ref("nexvoUsers")
        .child(
            window.nexvoCurrentUser.uid
        )
        .update({

            online:
                true,

            lastSeen:
                firebase.database
                    .ServerValue
                    .TIMESTAMP

        });

}


/* =========================================
   OFFLINE
========================================= */

function setNexvoOffline() {

    if (
        !window.nexvoCurrentUser
    ) {

        return;

    }


    window.nexvoDatabase
        .ref("nexvoUsers")
        .child(
            window.nexvoCurrentUser.uid
        )
        .update({

            online:
                false,

            lastSeen:
                firebase.database
                    .ServerValue
                    .TIMESTAMP

        });

}


/* =========================================
   PRESENCE
========================================= */

function initializeNexvoPresence() {

    if (
        !window.nexvoCurrentUser
    ) {

        return;

    }


    const connectedRef =
        window.nexvoDatabase
            .ref(".info/connected");


    connectedRef.on(
        "value",
        function (snapshot) {

            if (
                snapshot.val() ===
                true
            ) {

                const userRef =
                    window.nexvoDatabase
                        .ref("nexvoUsers")
                        .child(
                            window.nexvoCurrentUser.uid
                        );


                userRef.update({

                    online:
                        true,

                    lastSeen:
                        firebase.database
                            .ServerValue
                            .TIMESTAMP

                });


                window.addEventListener(
                    "beforeunload",
                    setNexvoOffline
                );

            }

        }
    );

}