/* =========================================
   NEXVO
   REAL ACTIVE CALL PAGE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const callPage =
    document.getElementById(
        "callPage"
    );

const callBackButton =
    document.getElementById(
        "callBackButton"
    );

const callMoreButton =
    document.getElementById(
        "callMoreButton"
    );

const callOptions =
    document.getElementById(
        "callOptions"
    );

const callName =
    document.getElementById(
        "callName"
    );

const callNumber =
    document.getElementById(
        "callNumber"
    );

const callState =
    document.getElementById(
        "callState"
    );

const callTimer =
    document.getElementById(
        "callTimer"
    );

const callActionButton =
    document.getElementById(
        "callActionButton"
    );

const callActionLabel =
    document.getElementById(
        "callActionLabel"
    );

const muteButton =
    document.getElementById(
        "muteButton"
    );

const speakerButton =
    document.getElementById(
        "speakerButton"
    );

const recordButton =
    document.getElementById(
        "recordButton"
    );

const videoSwitchButton =
    document.getElementById(
        "videoSwitchButton"
    );

const remoteAudio =
    document.getElementById(
        "remoteAudio"
    );

const remoteVideo =
    document.getElementById(
        "remoteVideo"
    );

const localVideo =
    document.getElementById(
        "localVideo"
    );

const recordingPanel =
    document.getElementById(
        "recordingPanel"
    );

const recordingTimer =
    document.getElementById(
        "recordingTimer"
    );

const pauseRecordingButton =
    document.getElementById(
        "pauseRecordingButton"
    );

const resumeRecordingButton =
    document.getElementById(
        "resumeRecordingButton"
    );

const stopRecordingButton =
    document.getElementById(
        "stopRecordingButton"
    );

const addCallButton =
    document.getElementById(
        "addCallButton"
    );

const callSettingsButton =
    document.getElementById(
        "callSettingsButton"
    );


/* =========================================
   STATE
========================================= */

let activeCallId = null;

let activeCallRole = null;

let activeCallData = null;

let callConnected = false;

let callTimerInterval = null;

let callSeconds = 0;

let recordingTimerInterval = null;

let recordingSeconds = 0;

let mediaRecorder = null;

let recordingChunks = [];

let callEnded = false;

let audioContext = null;

let ringtoneTimer = null;


/* =========================================
   URL DATA
========================================= */

function getCallParameters() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return {

        call:
            params.get("call"),

        role:
            params.get("role"),

        number:
            params.get("number")

    };

}


/* =========================================
   FORMAT TIME
========================================= */

function formatCallTime(
    seconds
) {

    const minutes =
        Math.floor(
            seconds / 60
        );

    const remaining =
        seconds % 60;


    return (
        String(minutes)
            .padStart(2, "0")
        +
        ":"
        +
        String(remaining)
            .padStart(2, "0")
    );

}


/* =========================================
   TIMER
========================================= */

function startCallTimer() {

    if (callTimerInterval) {
        return;
    }


    callSeconds = 0;

    callTimer.textContent =
        "00:00";


    callTimerInterval =
        setInterval(
            function () {

                callSeconds++;

                callTimer.textContent =
                    formatCallTime(
                        callSeconds
                    );

            },
            1000
        );

}


function stopCallTimer() {

    if (callTimerInterval) {

        clearInterval(
            callTimerInterval
        );

        callTimerInterval =
            null;

    }

}


/* =========================================
   UI
========================================= */

function setCallState(
    state
) {

    if (callState) {

        callState.textContent =
            state;

    }

}


function setConnectedUI() {

    if (callConnected) {
        return;
    }


    callConnected = true;


    callPage.classList.add(
        "connected"
    );


    setCallState(
        "Connected"
    );


    startCallTimer();


    stopRingtone();


    if (
        callActionLabel
    ) {

        callActionLabel.textContent =
            "End call";

    }

}


/* =========================================
   WEBRTC CALLBACKS
========================================= */

function nexvoCallConnectedUI() {

    setConnectedUI();

}


function nexvoCallFailedUI() {

    if (callEnded) {
        return;
    }


    setCallState(
        "Connection failed"
    );


    stopRingtone();

}


function nexvoCallDisconnectedUI() {

    if (callEnded) {
        return;
    }


    setCallState(
        "Disconnected"
    );


    stopCallTimer();

}


/* =========================================
   RINGTONE
========================================= */

function startRingtone() {

    stopRingtone();


    try {

        audioContext =
            new (
                window.AudioContext ||
                window.webkitAudioContext
            )();


        function beep() {

            if (!audioContext) {
                return;
            }


            const oscillator =
                audioContext
                    .createOscillator();


            const gain =
                audioContext
                    .createGain();


            oscillator.type =
                "sine";


            oscillator.frequency
                .value =
                660;


            gain.gain
                .setValueAtTime(
                    .0001,
                    audioContext.currentTime
                );


            gain.gain
                .exponentialRampToValueAtTime(
                    .08,
                    audioContext.currentTime +
                    .03
                );


            gain.gain
                .exponentialRampToValueAtTime(
                    .0001,
                    audioContext.currentTime +
                    .45
                );


            oscillator
                .connect(gain);


            gain
                .connect(
                    audioContext.destination
                );


            oscillator.start();


            oscillator.stop(
                audioContext.currentTime +
                .45
            );

        }


        beep();


        ringtoneTimer =
            setInterval(
                beep,
                1500
            );

    } catch (error) {

        console.warn(
            "NEXVO ringtone unavailable.",
            error
        );

    }

}


function stopRingtone() {

    if (ringtoneTimer) {

        clearInterval(
            ringtoneTimer
        );

        ringtoneTimer =
            null;

    }


    if (audioContext) {

        try {

            audioContext.close();

        } catch (error) {}

        audioContext =
            null;

    }

}


/* =========================================
   MUTE
========================================= */

function handleMute() {

    const muted =
        toggleNexvoMute();


    muteButton
        .classList
        .toggle(
            "active",
            muted
        );


    muteButton
        .setAttribute(
            "aria-pressed",
            String(muted)
        );


    const label =
        muteButton
            .querySelector(
                "span:last-child"
            );


    if (label) {

        label.textContent =
            muted
                ? "Unmute"
                : "Mute";

    }

}


/* =========================================
   SPEAKER
========================================= */

async function handleSpeaker() {

    if (!remoteAudio) {
        return;
    }


    const active =
        speakerButton
            .classList
            .contains(
                "active"
            );


    const newState =
        !active;


    speakerButton
        .classList
        .toggle(
            "active",
            newState
        );


    speakerButton
        .setAttribute(
            "aria-pressed",
            String(newState)
        );


    if (
        typeof remoteAudio
            .setSinkId ===
        "function"
    ) {

        try {

            await remoteAudio
                .setSinkId(
                    newState
                        ? "default"
                        : ""
                );

        } catch (error) {

            console.warn(
                "NEXVO speaker output control unavailable.",
                error
            );

        }

    }

}


/* =========================================
   VIDEO
========================================= */

async function handleVideo() {

    if (
        nexvoCallType !==
        "video"
    ) {

        const enabled =
            await enableNexvoVideo();


        if (!enabled) {

            setCallState(
                "Camera unavailable"
            );

            return;

        }


        nexvoCallType =
            "video";


        callPage.classList.add(
            "video-connected"
        );


        videoSwitchButton
            .classList
            .add(
                "active"
            );


        videoSwitchButton
            .setAttribute(
                "aria-pressed",
                "true"
            );


        return;

    }


    disableNexvoVideo();


    nexvoCallType =
        "audio";


    callPage.classList.remove(
        "video-connected"
    );


    videoSwitchButton
        .classList
        .remove(
            "active"
        );


    videoSwitchButton
        .setAttribute(
            "aria-pressed",
            "false"
        );

}


/* =========================================
   RECORDING TIMER
========================================= */

function startRecordingTimer() {

    recordingSeconds = 0;


    recordingTimer.textContent =
        "00:00";


    recordingTimerInterval =
        setInterval(
            function () {

                recordingSeconds++;

                recordingTimer.textContent =
                    formatCallTime(
                        recordingSeconds
                    );

            },
            1000
        );

}


function stopRecordingTimer() {

    if (
        recordingTimerInterval
    ) {

        clearInterval(
            recordingTimerInterval
        );

        recordingTimerInterval =
            null;

    }

}


/* =========================================
   START RECORDING
========================================= */

function startRecording() {

    if (
        !nexvoLocalStream
    ) {

        return;

    }


    if (
        typeof MediaRecorder ===
        "undefined"
    ) {

        setCallState(
            "Recording unsupported"
        );

        return;

    }


    const streams = [];


    if (
        nexvoLocalStream
    ) {

        streams.push(
            nexvoLocalStream
        );

    }


    if (
        nexvoRemoteStream
    ) {

        streams.push(
            nexvoRemoteStream
        );

    }


    let recordingStream;


    try {

        recordingStream =
            new MediaStream();


        streams.forEach(
            function (stream) {

                stream
                    .getTracks()
                    .forEach(
                        function (track) {

                            recordingStream
                                .addTrack(
                                    track
                                );

                        }
                    );

            }
        );


        mediaRecorder =
            new MediaRecorder(
                recordingStream
            );

    } catch (error) {

        console.error(
            "NEXVO recording error:",
            error
        );

        setCallState(
            "Recording unavailable"
        );

        return;

    }


    recordingChunks = [];


    mediaRecorder.ondataavailable =
        function (event) {

            if (
                event.data &&
                event.data.size > 0
            ) {

                recordingChunks.push(
                    event.data
                );

            }

        };


    mediaRecorder.onstop =
        function () {

            saveRecording();

        };


    mediaRecorder.start();


    recordingPanel.hidden =
        false;


    recordButton
        .classList
        .add(
            "active"
        );


    recordButton
        .setAttribute(
            "aria-pressed",
            "true"
        );


    startRecordingTimer();

}


/* =========================================
   PAUSE RECORDING
========================================= */

function pauseRecording() {

    if (
        !mediaRecorder ||
        mediaRecorder.state !==
        "recording"
    ) {

        return;

    }


    mediaRecorder.pause();


    stopRecordingTimer();


    pauseRecordingButton.hidden =
        true;


    resumeRecordingButton.hidden =
        false;

}


/* =========================================
   RESUME RECORDING
========================================= */

function resumeRecording() {

    if (
        !mediaRecorder ||
        mediaRecorder.state !==
        "paused"
    ) {

        return;

    }


    mediaRecorder.resume();


    startRecordingTimer();


    pauseRecordingButton.hidden =
        false;


    resumeRecordingButton.hidden =
        true;

}


/* =========================================
   STOP RECORDING
========================================= */

function stopRecording() {

    if (
        !mediaRecorder ||
        mediaRecorder.state ===
        "inactive"
    ) {

        return;

    }


    mediaRecorder.stop();


    stopRecordingTimer();


    recordingPanel.hidden =
        true;


    recordButton
        .classList
        .remove(
            "active"
        );


    recordButton
        .setAttribute(
            "aria-pressed",
            "false"
        );

}


/* =========================================
   SAVE RECORDING
========================================= */

function saveRecording() {

    if (
        !recordingChunks.length
    ) {

        return;

    }


    const blob =
        new Blob(
            recordingChunks,
            {
                type:
                    "video/webm"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "NEXVO-Call-" +
        Date.now() +
        ".webm";


    document.body
        .appendChild(
            link
        );


    link.click();


    link.remove();


    setTimeout(
        function () {

            URL.revokeObjectURL(
                url
            );

        },
        1000
    );

}


/* =========================================
   END CALL
========================================= */

async function endCurrentCall() {

    if (callEnded) {
        return;
    }


    callEnded = true;


    stopRingtone();


    stopCallTimer();


    if (
        mediaRecorder &&
        mediaRecorder.state !==
        "inactive"
    ) {

        try {

            mediaRecorder.stop();

        } catch (error) {}

    }


    if (activeCallId) {

        try {

            await endNexvoCall(
                activeCallId
            );

        } catch (error) {

            console.error(
                "NEXVO call ending error:",
                error
            );

        }

    }


    stopNexvoWebRTC();


    if (
        typeof stopNexvoCallListeners ===
        "function"
    ) {

        stopNexvoCallListeners();

    }


    window.location.href =
        "calls.html";

}


/* =========================================
   WATCH CALL
========================================= */

function watchActiveCall() {

    watchNexvoCall(
        activeCallId,
        async function (
            data
        ) {

            if (!data) {

                return;

            }


            activeCallData =
                data;


            if (callName) {

                callName.textContent =
                    data.callerName ||
                    "NEXVO Member";

            }


            if (
                callNumber &&
                data.receiverId
            ) {

                callNumber.textContent =
                    data.type ===
                    "video"
                        ? "Video call"
                        : "Audio call";

            }


            if (
                data.status ===
                "declined"
            ) {

                setCallState(
                    "Call declined"
                );

                setTimeout(
                    function () {

                        window.location.href =
                            "calls.html";

                    },
                    1000
                );

                return;

            }


            if (
                data.status ===
                "ended"
            ) {

                if (!callEnded) {

                    callEnded = true;

                    stopRingtone();

                    stopCallTimer();

                    stopNexvoWebRTC();

                    setCallState(
                        "Call ended"
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "calls.html";

                        },
                        800
                    );

                }

                return;

            }


            if (
                data.status ===
                "connecting"
            ) {

                setCallState(
                    "Connecting..."
                );

            }


            if (
                data.status ===
                "ringing" &&
                activeCallRole ===
                "caller"
            ) {

                setCallState(
                    "Calling..."
                );

            }

        }
    );

}


/* =========================================
   START CALLER
========================================= */

async function startCallerCall() {

    try {

        setCallState(
            "Calling..."
        );


        startRingtone();


        await createNexvoOffer();

    } catch (error) {

        console.error(
            "NEXVO caller error:",
            error
        );


        stopRingtone();


        setCallState(
            "Microphone/camera permission required"
        );

    }

}


/* =========================================
   START RECEIVER
========================================= */

async function startReceiverCall() {

    try {

        if (
            !activeCallData ||
            !activeCallData.offer
        ) {

            setCallState(
                "Waiting for caller..."
            );

            return;

        }


        setCallState(
            "Connecting..."
        );


        await createNexvoAnswer(
            activeCallData.offer
        );

    } catch (error) {

        console.error(
            "NEXVO receiver error:",
            error
        );


        setCallState(
            "Microphone/camera permission required"
        );

    }

}


/* =========================================
   ADD CALL
========================================= */

function handleAddCall() {

    if (
        !callConnected
    ) {

        return;

    }


    callOptions.hidden =
        true;


    window.location.href =
        "calls.html?addCall=1";

}


/* =========================================
   SETTINGS
========================================= */

function handleCallSettings() {

    callOptions.hidden =
        true;


    setCallState(
        "Call settings coming next"
    );

}


/* =========================================
   BUTTON EVENTS
========================================= */

if (muteButton) {

    muteButton.addEventListener(
        "click",
        handleMute
    );

}


if (speakerButton) {

    speakerButton.addEventListener(
        "click",
        handleSpeaker
    );

}


if (videoSwitchButton) {

    videoSwitchButton.addEventListener(
        "click",
        handleVideo
    );

}


if (recordButton) {

    recordButton.addEventListener(
        "click",
        function () {

            if (
                mediaRecorder &&
                mediaRecorder.state !==
                "inactive"
            ) {

                stopRecording();

            } else {

                startRecording();

            }

        }
    );

}


if (pauseRecordingButton) {

    pauseRecordingButton.addEventListener(
        "click",
        pauseRecording
    );

}


if (resumeRecordingButton) {

    resumeRecordingButton.addEventListener(
        "click",
        resumeRecording
    );

}


if (stopRecordingButton) {

    stopRecordingButton.addEventListener(
        "click",
        stopRecording
    );

}


if (callActionButton) {

    callActionButton.addEventListener(
        "click",
        endCurrentCall
    );

}


if (addCallButton) {

    addCallButton.addEventListener(
        "click",
        handleAddCall
    );

}


if (callSettingsButton) {

    callSettingsButton.addEventListener(
        "click",
        handleCallSettings
    );

}


if (callMoreButton) {

    callMoreButton.addEventListener(
        "click",
        function () {

            callOptions.hidden =
                !callOptions.hidden;

        }
    );

}


if (callBackButton) {

    callBackButton.addEventListener(
        "click",
        function () {

            if (callConnected) {

                return;

            }


            window.location.href =
                "calls.html";

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

async function initializeCallPage() {

    const params =
        getCallParameters();


    activeCallId =
        params.call;


    activeCallRole =
        params.role;


    if (!activeCallId) {

        window.location.href =
            "calls.html";

        return;

    }


    nexvoCallId =
        activeCallId;


    nexvoCallRole =
        activeCallRole;


    if (
        callNumber &&
        params.number
    ) {

        callNumber.textContent =
            params.number;

    }


    await initializeNexvoFirebase();


    watchActiveCall();


    /*
       RECEIVER:
       The incoming page has already
       accepted the call. The actual
       microphone/camera is opened HERE,
       not on incoming-call.html.
    */

    if (
        activeCallRole ===
        "receiver"
    ) {

        setCallState(
            "Connecting..."
        );


        const snapshot =
            await nexvoDatabase
                .ref("calls")
                .child(activeCallId)
                .once("value");


        activeCallData =
            snapshot.val();


        nexvoCallType =
            activeCallData &&
            activeCallData.type
                ? activeCallData.type
                : "audio";


        await startReceiverCall();

    }


    /*
       CALLER
    */

    if (
        activeCallRole ===
        "caller"
    ) {

        const snapshot =
            await nexvoDatabase
                .ref("calls")
                .child(activeCallId)
                .once("value");


        activeCallData =
            snapshot.val();


        nexvoCallType =
            activeCallData &&
            activeCallData.type
                ? activeCallData.type
                : "audio";


        await startCallerCall();

    }

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeCallPage
    );

} else {

    initializeCallPage();

}