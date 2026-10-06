/* =========================================
   NEXVO
   REAL-TIME CALL SIGNALING
========================================= */

var nexvoCallReference = null;

var nexvoCallListeners = [];


/* =========================================
   CREATE CALL
========================================= */

function createNexvoCall(
    receiverId,
    callType,
    callerName,
    receiverName
) {

    if (
        !window.nexvoCurrentUser
    ) {

        return Promise.reject(
            new Error(
                "NEXVO user is not authenticated."
            )
        );

    }


    if (
        !window.nexvoDatabase
    ) {

        return Promise.reject(
            new Error(
                "NEXVO database is not available."
            )
        );

    }


    const callsRef =
        window.nexvoDatabase
            .ref("calls");


    const callRef =
        callsRef.push();


    const callData = {

        callerId:
            window.nexvoCurrentUser.uid,

        receiverId:
            receiverId,

        callerName:
            callerName ||
            "NEXVO Member",

        receiverName:
            receiverName ||
            "NEXVO Member",

        type:
            callType ||
            "audio",

        status:
            "ringing",

        createdAt:
            firebase.database
                .ServerValue
                .TIMESTAMP

    };


    nexvoCallReference =
        callRef;


    return callRef
        .set(callData)
        .then(
            function () {

                console.log(
                    "NEXVO call created:",
                    callRef.key
                );


                return callRef.key;

            }
        );

}


/* =========================================
   WATCH ONE CALL
========================================= */

function watchNexvoCall(
    callId,
    callback
) {

    if (!callId) {

        return null;

    }


    if (
        !window.nexvoDatabase
    ) {

        return null;

    }


    const callRef =
        window.nexvoDatabase
            .ref("calls")
            .child(
                callId
            );


    function listener(
        snapshot
    ) {

        const data =
            snapshot.val();


        if (callback) {

            callback(
                data,
                snapshot
            );

        }

    }


    callRef.on(
        "value",
        listener
    );


    nexvoCallListeners.push({

        ref:
            callRef,

        listener:
            listener

    });


    return callRef;

}


/* =========================================
   UPDATE CALL
========================================= */

function updateNexvoCall(
    callId,
    updates
) {

    if (!callId) {

        return Promise.reject(
            new Error(
                "Missing NEXVO call ID."
            )
        );

    }


    if (
        !window.nexvoDatabase
    ) {

        return Promise.reject(
            new Error(
                "NEXVO database is not available."
            )
        );

    }


    return window.nexvoDatabase
        .ref("calls")
        .child(
            callId
        )
        .update(
            updates
        );

}


/* =========================================
   END CALL
========================================= */

function endNexvoCall(
    callId
) {

    if (!callId) {

        return Promise.resolve();

    }


    return updateNexvoCall(
        callId,
        {

            status:
                "ended",

            endedAt:
                firebase.database
                    .ServerValue
                    .TIMESTAMP

        }
    );

}


/* =========================================
   WATCH INCOMING CALLS
========================================= */

window.watchIncomingNexvoCalls(
    window.nexvoCurrentUser.uid,
    function (callId, callData) {

    if (!userId) {

        return null;

    }


    if (
        !window.nexvoDatabase
    ) {

        return null;

    }


    const callsRef =
        window.nexvoDatabase
            .ref("calls");


    const query =
        callsRef
            .orderByChild(
                "receiverId"
            )
            .equalTo(
                userId
            );


    function listener(
        snapshot
    ) {

        snapshot.forEach(
            function (
                child
            ) {

                const call =
                    child.val();


                if (
                    !call
                ) {

                    return;

                }


                if (
                    call.status !==
                    "ringing"
                ) {

                    return;

                }


                if (
                    callback
                ) {

                    callback(
                        child.key,
                        call
                    );

                }

            }
        );

    }


    query.on(
        "value",
        listener
    );


    nexvoCallListeners.push({

        ref:
            query,

        listener:
            listener

    });


    return query;

}


/* =========================================
   STOP ALL CALL LISTENERS
========================================= */

function stopNexvoCallListeners() {

    nexvoCallListeners
        .forEach(
            function (
                item
            ) {

                if (
                    item &&
                    item.ref &&
                    item.listener
                ) {

                    item.ref.off(
                        "value",
                        item.listener
                    );

                }

            }
        );


    nexvoCallListeners = [];

}


/* =========================================
   CANCEL CALL
========================================= */

function cancelNexvoCall(
    callId
) {

    if (!callId) {

        return Promise.resolve();

    }


    return updateNexvoCall(
        callId,
        {

            status:
                "cancelled",

            endedAt:
                firebase.database
                    .ServerValue
                    .TIMESTAMP

        }
    );

}
/* =========================================
   WATCH INCOMING CALLS
========================================= */

window.watchIncomingNexvoCalls = function (
    userId,
    callback
) {
    if (!userId) {
        console.warn(
            "NEXVO: Cannot watch incoming calls without a user ID."
        );
        return null;
    }

    if (!window.nexvoDatabase) {
        console.error(
            "NEXVO: Firebase Database is not available."
        );
        return null;
    }

    const callsRef =
        window.nexvoDatabase.ref("calls");

    const query =
        callsRef
            .orderByChild("receiverId")
            .equalTo(userId);

    function listener(snapshot) {
        snapshot.forEach(function (child) {
            const call = child.val();

            if (!call) {
                return;
            }

            if (call.status !== "ringing") {
                return;
            }

            if (typeof callback === "function") {
                callback(
                    child.key,
                    call
                );
            }
        });
    }

    query.on(
        "value",
        listener
    );

    console.log(
        "NEXVO incoming-call listener started."
    );

    return query;
};
console.log(
    "NEXVO CALL SIGNALING LOADED:",
    typeof window.watchIncomingNexvoCalls
);