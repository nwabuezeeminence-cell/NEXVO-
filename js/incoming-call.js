/* =========================================
   NEXVO
   INCOMING CALL
========================================= */

const incomingName =
    document.getElementById("incomingName");

const incomingType =
    document.getElementById("incomingType");

const acceptCallButton =
    document.getElementById("acceptCallButton");

const declineCallButton =
    document.getElementById("declineCallButton");


let incomingCallId = null;
let incomingCallData = null;


/* =========================================
   GET CALL ID
========================================= */

function getIncomingCallId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return params.get("call");

}


/* =========================================
   LOAD INCOMING CALL
========================================= */

function watchIncomingCall() {

    incomingCallId =
        getIncomingCallId();


    if (!incomingCallId) {

        window.location.href =
            "calls.html";

        return;

    }


    watchNexvoCall(
        incomingCallId,
        function (data) {

            if (!data) {

                window.location.href =
                    "calls.html";

                return;

            }


            incomingCallData =
                data;


            if (incomingName) {

                incomingName.textContent =
                    data.callerName ||
                    "NEXVO Member";

            }


            if (incomingType) {

                incomingType.textContent =
                    data.type === "video"
                        ? "Video call"
                        : "Audio call";

            }


            /*
               Caller cancelled or call
               was already handled.
            */

            if (
                data.status === "ended" ||
                data.status === "declined"
            ) {

                window.location.href =
                    "calls.html";

            }

        }
    );

}


/* =========================================
   ACCEPT
========================================= */

async function acceptIncomingCall() {

    if (
        !incomingCallId ||
        !incomingCallData
    ) {

        return;

    }


    if (
        !incomingCallData.offer
    ) {

        /*
           Caller has not created the
           WebRTC offer yet.
        */

        return;

    }


    acceptCallButton.disabled =
        true;

    declineCallButton.disabled =
        true;


    try {

        /*
           Tell the caller that the
           receiver accepted.
        */

        await updateNexvoCall(
            incomingCallId,
            {
                status:
                    "connecting"
            }
        );


        /*
           IMPORTANT:
           Do NOT open the microphone
           or camera here.

           call.html will do that after
           the page loads.
        */


        sessionStorage.setItem(
            "nexvoAcceptedCall",
            incomingCallId
        );


        window.location.href =
            "call.html?call=" +
            encodeURIComponent(
                incomingCallId
            ) +
            "&role=receiver";

    } catch (error) {

        console.error(
            "NEXVO accept call error:",
            error
        );


        acceptCallButton.disabled =
            false;

        declineCallButton.disabled =
            false;

    }

}


/* =========================================
   DECLINE
========================================= */

async function declineIncomingCall() {

    if (!incomingCallId) {

        return;

    }


    declineCallButton.disabled =
        true;

    acceptCallButton.disabled =
        true;


    try {

        await updateNexvoCall(
            incomingCallId,
            {
                status:
                    "declined",

                endedAt:
                    firebase.database
                        .ServerValue
                        .TIMESTAMP
            }
        );

    } catch (error) {

        console.error(
            "NEXVO decline error:",
            error
        );

    }


    window.location.href =
        "calls.html";

}


/* =========================================
   EVENTS
========================================= */

if (acceptCallButton) {

    acceptCallButton.addEventListener(
        "click",
        acceptIncomingCall
    );

}


if (declineCallButton) {

    declineCallButton.addEventListener(
        "click",
        declineIncomingCall
    );

}


/* =========================================
   INITIALIZE
========================================= */

async function initializeIncomingCall() {

    try {

        await initializeNexvoFirebase();

        watchIncomingCall();

    } catch (error) {

        console.error(
            "NEXVO incoming call initialization failed:",
            error
        );


        window.location.href =
            "calls.html";

    }

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeIncomingCall
    );

} else {

    initializeIncomingCall();

}