/* =========================================
   NEXVO
   WEBRTC CALL ENGINE
========================================= */

let nexvoPeerConnection = null;

let nexvoLocalStream = null;

let nexvoRemoteStream = null;

let nexvoCallId = null;

let nexvoCallRole = null;

let nexvoCallType = "audio";

let nexvoRemoteDescriptionSet = false;


/* =========================================
   ICE SERVERS
========================================= */

const nexvoRtcConfiguration = {

    iceServers: [

        {
            urls:
                "stun:stun.l.google.com:19302"
        },

        {
            urls:
                "stun:stun1.l.google.com:19302"
        }

    ]

};


/* =========================================
   CREATE PEER CONNECTION
========================================= */

function createNexvoPeerConnection() {

    if (nexvoPeerConnection) {

        return nexvoPeerConnection;

    }


    nexvoPeerConnection =
        new RTCPeerConnection(
            nexvoRtcConfiguration
        );


    nexvoRemoteStream =
        new MediaStream();


    /* REMOTE TRACK */

    nexvoPeerConnection.ontrack =
        function (event) {

            if (
                event.streams &&
                event.streams[0]
            ) {

                event.streams[0]
                    .getTracks()
                    .forEach(
                        function (track) {

                            nexvoRemoteStream
                                .addTrack(
                                    track
                                );

                        }
                    );

            }


            const remoteAudio =
                document.getElementById(
                    "remoteAudio"
                );


            if (remoteAudio) {

                remoteAudio.srcObject =
                    nexvoRemoteStream;

                remoteAudio
                    .play()
                    .catch(
                        function () {}
                    );

            }


            const remoteVideo =
                document.getElementById(
                    "remoteVideo"
                );


            if (remoteVideo) {

                remoteVideo.srcObject =
                    nexvoRemoteStream;

                remoteVideo
                    .play()
                    .catch(
                        function () {}
                    );

            }

        };


    /* ICE */

    nexvoPeerConnection.onicecandidate =
        function (event) {

            if (
                !event.candidate ||
                !nexvoCallId ||
                !nexvoCallRole
            ) {

                return;

            }


            const path =
                nexvoCallRole ===
                "caller"

                    ? "callerCandidates"

                    : "receiverCandidates";


            nexvoDatabase
                .ref("calls")
                .child(nexvoCallId)
                .child(path)
                .push(
                    event.candidate.toJSON()
                );

        };


    /* CONNECTION STATE */

    nexvoPeerConnection
        .onconnectionstatechange =
        function () {

            const state =
                nexvoPeerConnection
                    .connectionState;


            console.log(
                "NEXVO WebRTC state:",
                state
            );


            if (
                state ===
                "connected"
            ) {

                if (
                    typeof nexvoCallConnectedUI ===
                    "function"
                ) {

                    nexvoCallConnectedUI();

                }

            }


            if (
                state ===
                "failed"
            ) {

                if (
                    typeof nexvoCallFailedUI ===
                    "function"
                ) {

                    nexvoCallFailedUI();

                }

            }


            if (
                state ===
                "disconnected"
            ) {

                if (
                    typeof nexvoCallDisconnectedUI ===
                    "function"
                ) {

                    nexvoCallDisconnectedUI();

                }

            }

        };


    return nexvoPeerConnection;

}


/* =========================================
   GET MEDIA
========================================= */

async function getNexvoMedia(
    videoEnabled
) {

    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices
            .getUserMedia
    ) {

        throw new Error(
            "Camera and microphone are not available in this browser."
        );

    }


    const constraints = {

        audio: true,

        video:
            videoEnabled === true

    };


    nexvoLocalStream =
        await navigator
            .mediaDevices
            .getUserMedia(
                constraints
            );


    nexvoLocalStream
        .getTracks()
        .forEach(
            function (track) {

                nexvoPeerConnection
                    .addTrack(
                        track,
                        nexvoLocalStream
                    );

            }
        );


    const localVideo =
        document.getElementById(
            "localVideo"
        );


    if (
        localVideo &&
        videoEnabled
    ) {

        localVideo.srcObject =
            nexvoLocalStream;

    }


    return nexvoLocalStream;

}


/* =========================================
   CREATE OFFER
========================================= */

async function createNexvoOffer() {

    createNexvoPeerConnection();


    await getNexvoMedia(
        nexvoCallType ===
        "video"
    );


    const offer =
        await nexvoPeerConnection
            .createOffer();


    await nexvoPeerConnection
        .setLocalDescription(
            offer
        );


    await updateNexvoCall(
        nexvoCallId,
        {

            offer:
                offer.toJSON(),

            status:
                "ringing"

        }
    );


    watchNexvoAnswer();


    watchNexvoCandidates(
        "receiverCandidates"
    );

}


/* =========================================
   CREATE ANSWER
========================================= */

async function createNexvoAnswer(
    offer
) {

    createNexvoPeerConnection();


    await getNexvoMedia(
        nexvoCallType ===
        "video"
    );


    await nexvoPeerConnection
        .setRemoteDescription(
            new RTCSessionDescription(
                offer
            )
        );


    nexvoRemoteDescriptionSet =
        true;


    const answer =
        await nexvoPeerConnection
            .createAnswer();


    await nexvoPeerConnection
        .setLocalDescription(
            answer
        );


    await updateNexvoCall(
        nexvoCallId,
        {

            answer:
                answer.toJSON(),

            status:
                "connecting"

        }
    );


    watchNexvoCandidates(
        "callerCandidates"
    );

}


/* =========================================
   WATCH ANSWER
========================================= */

function watchNexvoAnswer() {

    const answerRef =
        nexvoDatabase
            .ref("calls")
            .child(nexvoCallId)
            .child("answer");


    answerRef.on(
        "value",
        async function (
            snapshot
        ) {

            const answer =
                snapshot.val();


            if (!answer) {
                return;
            }


            if (
                !nexvoPeerConnection
            ) {

                return;

            }


            if (
                nexvoRemoteDescriptionSet
            ) {

                return;

            }


            try {

                await nexvoPeerConnection
                    .setRemoteDescription(
                        new RTCSessionDescription(
                            answer
                        )
                    );


                nexvoRemoteDescriptionSet =
                    true;

            } catch (error) {

                console.error(
                    "NEXVO answer error:",
                    error
                );

            }

        }
    );

}


/* =========================================
   WATCH ICE CANDIDATES
========================================= */

function watchNexvoCandidates(
    path
) {

    const candidatesRef =
        nexvoDatabase
            .ref("calls")
            .child(nexvoCallId)
            .child(path);


    candidatesRef.on(
        "child_added",
        async function (
            snapshot
        ) {

            const candidate =
                snapshot.val();


            if (
                !candidate ||
                !nexvoPeerConnection
            ) {

                return;

            }


            try {

                await nexvoPeerConnection
                    .addIceCandidate(
                        new RTCIceCandidate(
                            candidate
                        )
                    );

            } catch (error) {

                console.warn(
                    "NEXVO ICE candidate error:",
                    error
                );

            }

        }
    );

}


/* =========================================
   MUTE MICROPHONE
========================================= */

function toggleNexvoMute() {

    if (!nexvoLocalStream) {

        return false;

    }


    const tracks =
        nexvoLocalStream
            .getAudioTracks();


    if (!tracks.length) {

        return false;

    }


    const currentlyEnabled =
        tracks[0].enabled;


    tracks.forEach(
        function (track) {

            track.enabled =
                !currentlyEnabled;

        }
    );


    return currentlyEnabled;

}


/* =========================================
   VIDEO
========================================= */

async function enableNexvoVideo() {

    if (!nexvoPeerConnection) {

        return false;

    }


    if (!nexvoLocalStream) {

        return false;

    }


    const existingVideo =
        nexvoLocalStream
            .getVideoTracks();


    if (existingVideo.length) {

        existingVideo.forEach(
            function (track) {

                track.enabled = true;

            }
        );

        return true;

    }


    try {

        const videoStream =
            await navigator
                .mediaDevices
                .getUserMedia(
                    {
                        video: true
                    }
                );


        const videoTrack =
            videoStream
                .getVideoTracks()[0];


        nexvoLocalStream
            .addTrack(
                videoTrack
            );


        const sender =
            nexvoPeerConnection
                .getSenders()
                .find(
                    function (item) {

                        return (
                            item.track &&
                            item.track.kind ===
                            "video"
                        );

                    }
                );


        if (sender) {

            await sender
                .replaceTrack(
                    videoTrack
                );

        } else {

            nexvoPeerConnection
                .addTrack(
                    videoTrack,
                    nexvoLocalStream
                );

        }


        const localVideo =
            document.getElementById(
                "localVideo"
            );


        if (localVideo) {

            localVideo.srcObject =
                nexvoLocalStream;

        }


        return true;

    } catch (error) {

        console.error(
            "NEXVO camera error:",
            error
        );

        return false;

    }

}


/* =========================================
   DISABLE VIDEO
========================================= */

function disableNexvoVideo() {

    if (!nexvoLocalStream) {

        return;

    }


    nexvoLocalStream
        .getVideoTracks()
        .forEach(
            function (track) {

                track.enabled =
                    false;

            }
        );

}


/* =========================================
   STOP EVERYTHING
========================================= */

function stopNexvoWebRTC() {

    if (nexvoLocalStream) {

        nexvoLocalStream
            .getTracks()
            .forEach(
                function (track) {

                    track.stop();

                }
            );

        nexvoLocalStream = null;

    }


    if (nexvoPeerConnection) {

        nexvoPeerConnection
            .close();

        nexvoPeerConnection = null;

    }


    nexvoRemoteStream =
        null;

    nexvoRemoteDescriptionSet =
        false;

}