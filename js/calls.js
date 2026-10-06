/* =========================================
   NEXVO
   CALLS PAGE
========================================= */

let selectedCallType = "audio";

let dialPad = null;
let dialPadButton = null;
let dialPadClose = null;
let dialNumber = null;
let dialDelete = null;
let dialCallButton = null;

let nexvoIdInput = null;
let startCallButton = null;

let myNexvoId = null;
let copyNexvoIdButton = null;

let incomingCallHandled = false;


/* =========================================
   ELEMENTS
========================================= */

function initializeCallsElements() {

    dialPad =
        document.getElementById(
            "dialPad"
        );

    dialPadButton =
        document.getElementById(
            "dialPadButton"
        );

    dialPadClose =
        document.getElementById(
            "dialPadClose"
        );

    dialNumber =
        document.getElementById(
            "dialNumber"
        );

    dialDelete =
        document.getElementById(
            "dialDelete"
        );

    dialCallButton =
        document.getElementById(
            "dialCallButton"
        );

    nexvoIdInput =
        document.getElementById(
            "nexvoIdInput"
        );

    startCallButton =
        document.getElementById(
            "startCallButton"
        );

    myNexvoId =
        document.getElementById(
            "myNexvoId"
        );

    copyNexvoIdButton =
        document.getElementById(
            "copyNexvoIdButton"
        );

}


/* =========================================
   CALL TYPE
========================================= */

function selectAudioMode() {

    selectedCallType =
        "audio";

    const audioButton =
        document.getElementById(
            "audioModeButton"
        );

    const videoButton =
        document.getElementById(
            "videoModeButton"
        );

    if (audioButton) {

        audioButton.classList.add(
            "active"
        );

    }

    if (videoButton) {

        videoButton.classList.remove(
            "active"
        );

    }

}


function selectVideoMode() {

    selectedCallType =
        "video";

    const audioButton =
        document.getElementById(
            "audioModeButton"
        );

    const videoButton =
        document.getElementById(
            "videoModeButton"
        );

    if (audioButton) {

        audioButton.classList.remove(
            "active"
        );

    }

    if (videoButton) {

        videoButton.classList.add(
            "active"
        );

    }

}


/* =========================================
   STATUS
========================================= */

function setCallTargetStatus(
    message,
    type
) {

    const status =
        document.getElementById(
            "callTargetStatus"
        );

    if (!status) {
        return;
    }

    status.textContent =
        message || "";

    status.className =
        "call-target-status";

    if (type) {

        status.classList.add(
            type
        );

    }

}


/* =========================================
   NORMALIZE NEXVO ID
========================================= */

function normalizeNexvoId(
    value
) {

    if (!value) {
        return "";
    }

    return value
        .trim()
        .toUpperCase()
        .replace(
            /\s+/g,
            ""
        );

}


/* =========================================
   START CALL
========================================= */

async function startNexvoCall() {

    if (
        !window.nexvoCurrentUser ||
        !window.nexvoIdentity
    ) {

        setCallTargetStatus(
            "NEXVO is still connecting. Please wait.",
            "error"
        );

        return;

    }


    const targetId =
        normalizeNexvoId(
            nexvoIdInput
                ? nexvoIdInput.value
                : ""
        );


    if (!targetId) {

        setCallTargetStatus(
            "Enter a NEXVO ID first.",
            "error"
        );

        return;

    }


    if (
        !targetId.startsWith(
            "NV-"
        )
    ) {

        setCallTargetStatus(
            "NEXVO IDs must start with NV-.",
            "error"
        );

        return;

    }


    if (
        window.nexvoIdentity.nexvoId &&
        targetId ===
        window.nexvoIdentity.nexvoId
            .toUpperCase()
    ) {

        setCallTargetStatus(
            "You cannot call yourself.",
            "error"
        );

        return;

    }


    if (startCallButton) {

        startCallButton.disabled =
            true;

    }


    setCallTargetStatus(
        "Finding NEXVO user...",
        ""
    );


    try {

        const receiver =
            await findNexvoUser(
                targetId
            );


        if (!receiver) {

            setCallTargetStatus(
                "No NEXVO user was found with that ID.",
                "error"
            );

            return;

        }


        if (
            receiver.uid ===
            window.nexvoCurrentUser.uid
        ) {

            setCallTargetStatus(
                "You cannot call yourself.",
                "error"
            );

            return;

        }


        setCallTargetStatus(
            "Starting " +
            (
                selectedCallType ===
                "video"
                    ? "video"
                    : "audio"
            ) +
            " call...",
            ""
        );


        const callId =
            await createNexvoCall(
                receiver.uid,
                selectedCallType,
                window.nexvoIdentity
                    .displayName ||
                "NEXVO Member",
                receiver.displayName ||
                "NEXVO Member"
            );


        localStorage.setItem(
            "nexvoCallTarget",
            JSON.stringify({

                uid:
                    receiver.uid,

                nexvoId:
                    receiver.nexvoId ||
                    targetId,

                displayName:
                    receiver.displayName ||
                    "NEXVO Member"

            })
        );


        window.location.href =
            "call.html?call=" +
            encodeURIComponent(
                callId
            ) +
            "&role=caller";


    } catch (error) {

        console.error(
            "NEXVO call start error:",
            error
        );


        setCallTargetStatus(
            "Unable to start the call. Please try again.",
            "error"
        );

    } finally {

        if (startCallButton) {

            startCallButton.disabled =
                false;

        }

    }

}


/* =========================================
   DISPLAY MY NEXVO ID
========================================= */

async function displayMyNexvoId() {

    if (!myNexvoId) {
        return;
    }

    try {

        /* =====================================
           MAKE SURE FIREBASE USER EXISTS
        ===================================== */

        if (!window.nexvoCurrentUser) {

            await initializeNexvoFirebase();

        }


        /* =====================================
           MAKE SURE IDENTITY EXISTS
        ===================================== */

        if (
            !window.nexvoIdentity &&
            typeof initializeNexvoIdentity ===
            "function"
        ) {

            await initializeNexvoIdentity();

        }


        /* =====================================
           IF ID EXISTS, DISPLAY IT
        ===================================== */

        if (
            window.nexvoIdentity &&
            window.nexvoIdentity.nexvoId
        ) {

            myNexvoId.textContent =
                window.nexvoIdentity.nexvoId;

            return;

        }


        /* =====================================
           REPAIR OLD IDENTITY RECORD
        ===================================== */

        if (
            window.nexvoCurrentUser &&
            typeof generateNexvoId ===
            "function"
        ) {

            const newNexvoId =
                generateNexvoId(
                    window.nexvoCurrentUser.uid
                );


            await window.nexvoDatabase
                .ref("nexvoUsers")
                .child(
                    window.nexvoCurrentUser.uid
                )
                .update({
                    nexvoId: newNexvoId
                });


            if (!window.nexvoIdentity) {

                window.nexvoIdentity = {};

            }


            window.nexvoIdentity.nexvoId =
                newNexvoId;


            myNexvoId.textContent =
                newNexvoId;

            return;

        }


        myNexvoId.textContent =
            "Unavailable";

    } catch (error) {

        console.error(
            "NEXVO ID display error:",
            error
        );

        myNexvoId.textContent =
            "Unavailable";

    }

}
/* =========================================
   COPY MY NEXVO ID
========================================= */

async function copyMyNexvoId() {

    if (
        !window.nexvoIdentity ||
        !window.nexvoIdentity.nexvoId
    ) {

        return;

    }


    const value =
        window.nexvoIdentity.nexvoId;


    try {

        if (
            navigator.clipboard &&
            navigator.clipboard.writeText
        ) {

            await navigator
                .clipboard
                .writeText(
                    value
                );

        } else {

            const temporaryInput =
                document.createElement(
                    "textarea"
                );

            temporaryInput.value =
                value;

            temporaryInput.style.position =
                "fixed";

            temporaryInput.style.opacity =
                "0";

            document.body.appendChild(
                temporaryInput
            );

            temporaryInput.select();

            document.execCommand(
                "copy"
            );

            temporaryInput.remove();

        }


        if (copyNexvoIdButton) {

            copyNexvoIdButton.textContent =
                "Copied";

            copyNexvoIdButton.classList.add(
                "copied"
            );


            setTimeout(
                function () {

                    if (
                        copyNexvoIdButton
                    ) {

                        copyNexvoIdButton.textContent =
                            "Copy";

                        copyNexvoIdButton.classList.remove(
                            "copied"
                        );

                    }

                },
                1800
            );

        }

    } catch (error) {

        console.error(
            "NEXVO copy error:",
            error
        );

    }

}


/* =========================================
   DIAL PAD
========================================= */

function updateDialDisplay() {

    if (!dialNumber) {
        return;
    }


    const value =
        dialNumber.dataset.value ||
        "";


    dialNumber.textContent =
        value ||
        "—";

}


function openDialPad() {

    if (!dialPad) {
        return;
    }


    dialPad.inert =
        false;


    dialPad.classList.add(
        "open"
    );


    if (dialPadButton) {

        dialPadButton.setAttribute(
            "aria-expanded",
            "true"
        );

    }


    updateDialDisplay();

}


function closeDialPad() {

    if (!dialPad) {
        return;
    }


    if (
        document.activeElement &&
        dialPad.contains(
            document.activeElement
        )
    ) {

        if (dialPadButton) {

            dialPadButton.focus();

        } else {

            document.activeElement.blur();

        }

    }


    dialPad.inert =
        true;


    dialPad.classList.remove(
        "open"
    );


    if (dialPadButton) {

        dialPadButton.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}


function addDialValue(
    value
) {

    if (!dialNumber) {
        return;
    }


    let current =
        dialNumber.dataset.value ||
        "";


    if (
        current.length >= 20
    ) {

        return;

    }


    current += value;


    dialNumber.dataset.value =
        current;


    updateDialDisplay();

}


function deleteDialValue() {

    if (!dialNumber) {
        return;
    }


    let current =
        dialNumber.dataset.value ||
        "";


    current =
        current.slice(
            0,
            -1
        );


    dialNumber.dataset.value =
        current;


    updateDialDisplay();

}


function useDialNumber() {

    if (
        !dialNumber ||
        !nexvoIdInput
    ) {

        return;

    }


    const value =
        dialNumber.dataset.value ||
        "";


    if (!value) {
        return;
    }


    nexvoIdInput.value =
        value;


    closeDialPad();


    startNexvoCall();

}


/* =========================================
   INCOMING CALLS
========================================= */

function initializeIncomingCallListener() {

    if (
        !window.nexvoCurrentUser
    ) {

        return;

    }


    watchIncomingNexvoCalls(
        window.nexvoCurrentUser.uid,
        function (
            callId,
            callData
        ) {

            if (
                incomingCallHandled
            ) {

                return;

            }


            if (
                !callId ||
                !callData
            ) {

                return;

            }


            const handledCall =
                sessionStorage.getItem(
                    "nexvoIncomingCall"
                );


            if (
                handledCall ===
                callId
            ) {

                return;

            }


            incomingCallHandled =
                true;


            sessionStorage.setItem(
                "nexvoIncomingCall",
                callId
            );


            window.location.href =
                "incoming-call.html?call=" +
                encodeURIComponent(
                    callId
                );

        }
    );

}


/* =========================================
   RECENT CALLS
========================================= */

function loadCalls() {

    const list =
        document.getElementById(
            "recentCallsList"
        );

    const empty =
        document.getElementById(
            "callsEmptyState"
        );


    if (list) {

        list.innerHTML =
            "";

    }


    if (empty) {

        empty.style.display =
            "flex";

    }

}


/* =========================================
   EVENTS
========================================= */

function initializeCallsEvents() {

    const audioButton =
        document.getElementById(
            "audioModeButton"
        );

    const videoButton =
        document.getElementById(
            "videoModeButton"
        );


    if (audioButton) {

        audioButton.addEventListener(
            "click",
            selectAudioMode
        );

    }


    if (videoButton) {

        videoButton.addEventListener(
            "click",
            selectVideoMode
        );

    }


    if (startCallButton) {

        startCallButton.addEventListener(
            "click",
            startNexvoCall
        );

    }


    if (nexvoIdInput) {

        nexvoIdInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter"
                ) {

                    startNexvoCall();

                }

            }
        );

    }


    if (copyNexvoIdButton) {

        copyNexvoIdButton.addEventListener(
            "click",
            copyMyNexvoId
        );

    }


    if (dialPadButton) {

        dialPadButton.addEventListener(
            "click",
            openDialPad
        );

    }


    if (dialPadClose) {

        dialPadClose.addEventListener(
            "click",
            closeDialPad
        );

    }


    if (dialDelete) {

        dialDelete.addEventListener(
            "click",
            deleteDialValue
        );

    }


    if (dialCallButton) {

        dialCallButton.addEventListener(
            "click",
            useDialNumber
        );

    }


    document
        .querySelectorAll(
            ".dial-key"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        addDialValue(
                            button.dataset.digit
                        );

                    }
                );

            }
        );

}


/* =========================================
   INITIALIZATION
========================================= */

async function initializeCallsPage() {

    initializeCallsElements();

    selectAudioMode();

    loadCalls();

    updateDialDisplay();


    if (dialPad) {

        dialPad.inert =
            true;

    }


    initializeCallsEvents();


    try {

        await initializeNexvoFirebase();


        await displayMyNexvoId();


        initializeIncomingCallListener();


        console.log(
            "NEXVO Calls initialized successfully."
        );


    } catch (error) {

        console.error(
            "NEXVO Calls initialization failed:",
            error
        );


        if (myNexvoId) {

            myNexvoId.textContent =
                "Unavailable";

        }

    }

}


/* =========================================
   START
========================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCallsPage
    );

} else {

    initializeCallsPage();

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
            "NEXVO: Missing user ID for incoming calls."
        );
        return null;
    }

    if (!window.nexvoDatabase) {
        console.error(
            "NEXVO: Firebase Database is unavailable."
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

            const call =
                child.val();

            if (!call) {
                return;
            }

            if (call.status !== "ringing") {
                return;
            }

            if (
                typeof callback ===
                "function"
            ) {
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