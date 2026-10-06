/* =========================================================
   NEXVO REAL-TIME CALL SIGNALING SERVER
========================================================= */

const http = require("http");
const WebSocket = require("ws");


/* =========================================================
   SERVER SETTINGS
========================================================= */

const PORT = process.env.PORT || 3000;

const server = http.createServer((request, response) => {

    response.writeHead(200, {
        "Content-Type": "text/plain"
    });

    response.end(
        "NEXVO signaling server is running."
    );

});


/* =========================================================
   WEBSOCKET SERVER
========================================================= */

const wss = new WebSocket.Server({
    server
});


/*
 * Connected users.
 *
 * userId -> WebSocket
 */

const users = new Map();


/* =========================================================
   SEND MESSAGE
========================================================= */

function send(socket, data) {

    if (
        socket &&
        socket.readyState === WebSocket.OPEN
    ) {

        socket.send(
            JSON.stringify(data)
        );

    }

}


/* =========================================================
   SEND TO USER
========================================================= */

function sendToUser(userId, data) {

    const socket =
        users.get(String(userId));

    if (!socket) {

        return false;

    }

    send(socket, data);

    return true;

}


/* =========================================================
   BROADCAST ONLINE USERS
========================================================= */

function broadcastPresence() {

    const onlineUsers =
        Array.from(users.keys());

    for (const socket of wss.clients) {

        send(socket, {

            type: "presence",

            users: onlineUsers

        });

    }

}


/* =========================================================
   WEBSOCKET CONNECTION
========================================================= */

wss.on("connection", socket => {

    console.log(
        "NEXVO client connected."
    );


    socket.userId =
        null;


    /* =====================================================
       MESSAGE
    ====================================================== */

    socket.on("message", rawMessage => {

        let message;

        try {

            message =
                JSON.parse(
                    rawMessage.toString()
                );

        } catch {

            send(socket, {

                type: "error",

                message:
                    "Invalid message format."

            });

            return;

        }


        if (!message.type) {

            return;

        }


        /* =================================================
           REGISTER
        ================================================== */

        if (message.type === "register") {

            const userId =
                String(message.userId || "")
                    .trim();


            if (!userId) {

                send(socket, {

                    type: "error",

                    message:
                        "A NEXVO user ID is required."

                });

                return;

            }


            /*
             * Remove an older connection
             * using the same user ID.
             */

            const oldSocket =
                users.get(userId);

            if (
                oldSocket &&
                oldSocket !== socket
            ) {

                try {

                    oldSocket.close();

                } catch {}

            }


            users.set(
                userId,
                socket
            );


            socket.userId =
                userId;


            send(socket, {

                type: "registered",

                userId

            });


            broadcastPresence();

            return;

        }


        /* =================================================
           CALL REQUEST
        ================================================== */

        if (message.type === "call-request") {

            const from =
                String(
                    socket.userId || ""
                );

            const to =
                String(
                    message.to || ""
                );


            if (!from || !to) {

                return;

            }


            const delivered =
                sendToUser(
                    to,
                    {

                        type:
                            "incoming-call",

                        from,

                        callId:
                            message.callId,

                        mode:
                            message.mode || "audio",

                        caller:
                            message.caller || null

                    }
                );


            send(socket, {

                type:
                    "call-request-result",

                callId:
                    message.callId,

                delivered

            });


            return;

        }


        /* =================================================
           CALL ACCEPTED
        ================================================== */

        if (message.type === "call-accepted") {

            sendToUser(
                message.to,
                {

                    type:
                        "call-accepted",

                    from:
                        socket.userId,

                    callId:
                        message.callId

                }
            );

            return;

        }


        /* =================================================
           CALL DECLINED
        ================================================== */

        if (message.type === "call-declined") {

            sendToUser(
                message.to,
                {

                    type:
                        "call-declined",

                    from:
                        socket.userId,

                    callId:
                        message.callId

                }
            );

            return;

        }


        /* =================================================
           WEBRTC OFFER
        ================================================== */

        if (message.type === "webrtc-offer") {

            sendToUser(
                message.to,
                {

                    type:
                        "webrtc-offer",

                    from:
                        socket.userId,

                    callId:
                        message.callId,

                    offer:
                        message.offer

                }
            );

            return;

        }


        /* =================================================
           WEBRTC ANSWER
        ================================================== */

        if (message.type === "webrtc-answer") {

            sendToUser(
                message.to,
                {

                    type:
                        "webrtc-answer",

                    from:
                        socket.userId,

                    callId:
                        message.callId,

                    answer:
                        message.answer

                }
            );

            return;

        }


        /* =================================================
           ICE CANDIDATE
        ================================================== */

        if (message.type === "ice-candidate") {

            sendToUser(
                message.to,
                {

                    type:
                        "ice-candidate",

                    from:
                        socket.userId,

                    callId:
                        message.callId,

                    candidate:
                        message.candidate

                }
            );

            return;

        }


        /* =================================================
           END CALL
        ================================================== */

        if (message.type === "call-ended") {

            sendToUser(
                message.to,
                {

                    type:
                        "call-ended",

                    from:
                        socket.userId,

                    callId:
                        message.callId

                }
            );

            return;

        }


        /* =================================================
           CALL BUSY
        ================================================== */

        if (message.type === "call-busy") {

            sendToUser(
                message.to,
                {

                    type:
                        "call-busy",

                    from:
                        socket.userId,

                    callId:
                        message.callId

                }
            );

            return;

        }

    });


    /* =====================================================
       DISCONNECT
    ====================================================== */

    socket.on("close", () => {

        if (
            socket.userId &&
            users.get(socket.userId) === socket
        ) {

            users.delete(
                socket.userId
            );

        }


        console.log(
            "NEXVO client disconnected."
        );


        broadcastPresence();

    });


    /* =====================================================
       ERROR
    ====================================================== */

    socket.on("error", error => {

        console.error(
            "NEXVO WebSocket error:",
            error.message
        );

    });

});


/* =========================================================
   START
========================================================= */

server.listen(
    PORT,
    () => {

        console.log(
            `NEXVO signaling server running on port ${PORT}`
        );

    }
);