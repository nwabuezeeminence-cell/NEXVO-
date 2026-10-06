/* =========================================
   NEXVO
   REAL-TIME INDIVIDUAL CHAT SYSTEM
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const chatBackButton =
    document.getElementById(
        "chatBackButton"
    );

const chatAvatar =
    document.getElementById(
        "chatAvatar"
    );

const chatName =
    document.getElementById(
        "chatName"
    );

const chatStatus =
    document.getElementById(
        "chatStatus"
    );

const messagesArea =
    document.getElementById(
        "messagesArea"
    );

const messageInput =
    document.getElementById(
        "messageInput"
    );

const sendButton =
    document.getElementById(
        "sendButton"
    );

const emojiButton =
    document.getElementById(
        "emojiButton"
    );

const emojiBar =
    document.getElementById(
        "emojiBar"
    );

const attachmentButton =
    document.getElementById(
        "attachmentButton"
    );

const videoCallButton =
    document.getElementById(
        "videoCallButton"
    );

const voiceCallButton =
    document.getElementById(
        "voiceCallButton"
    );

const chatMoreButton =
    document.getElementById(
        "chatMoreButton"
    );

const chatMenuOverlay =
    document.getElementById(
        "chatMenuOverlay"
    );

const chatMoreMenu =
    document.getElementById(
        "chatMoreMenu"
    );

const typingIndicator =
    document.getElementById(
        "typingIndicator"
    );


/* =========================================
   STATE
========================================= */

let currentChatId = null;

let currentUser = null;

let currentRecipient = null;

let currentConversationId = null;

let messagesListener = null;


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupChatEvents();

        waitForFirebase();

    }
);


/* =========================================
   WAIT FOR FIREBASE
========================================= */

function waitForFirebase() {

    let attempts = 0;

    const maxAttempts = 100;


    const timer =
        setInterval(
            async function () {

                attempts++;


                if (
                    window.nexvoCurrentUser &&
                    window.nexvoDatabase
                ) {

                    clearInterval(timer);

                    currentUser =
                        window.nexvoCurrentUser;


                    await initializeRealTimeChat();

                    return;

                }


                if (
                    attempts >=
                    maxAttempts
                ) {

                    clearInterval(timer);

                    showConnectionError();

                }

            },
            100
        );

}


/* =========================================
   INITIALIZE
========================================= */

async function initializeRealTimeChat() {

    currentChatId =
        getChatId();


    if (!currentChatId) {

        showDefaultChat();

        return;

    }


    if (
        currentChatId ===
        currentUser.uid
    ) {

        showDefaultChat();

        chatName.textContent =
            "NEXVO Member";

        chatStatus.textContent =
            "This is you";

        return;

    }


    try {

        await loadRecipient();

        if (!currentRecipient) {

            showUserNotFound();

            return;

        }


        createConversationId();


        renderChatHeader(
            currentRecipient
        );


        listenForMessages();


    }

    catch (error) {

        console.error(
            "NEXVO chat initialization error:",
            error
        );

        showConnectionError();

    }

}


/* =========================================
   GET CHAT ID
========================================= */

function getChatId() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    return params.get(
        "id"
    );

}


/* =========================================
   LOAD RECIPIENT
========================================= */

async function loadRecipient() {

    const snapshot =
        await window.nexvoDatabase
            .ref("nexvoUsers")
            .child(currentChatId)
            .once("value");


    if (
        !snapshot.exists()
    ) {

        currentRecipient =
            null;

        return;

    }


    currentRecipient =
        snapshot.val();

}


/* =========================================
   CONVERSATION ID
========================================= */

function createConversationId() {

    const ids = [

        String(
            currentUser.uid
        ),

        String(
            currentRecipient.uid
        )

    ];


    ids.sort();


    currentConversationId =
        ids.join("_");

}


/* =========================================
   CHAT HEADER
========================================= */

function renderChatHeader(
    user
) {

    chatName.textContent =
        user.displayName ||
        user.name ||
        "NEXVO Member";


    chatStatus.textContent =
        user.online
            ? "online"
            : "offline";


    if (
        user.profilePhoto
    ) {

        chatAvatar.innerHTML = `

            <img
                src="${escapeHTML(
                    user.profilePhoto
                )}"
                alt=""
            >

        `;

    }

    else if (
        user.avatar
    ) {

        chatAvatar.textContent =
            user.avatar;

    }

    else {

        chatAvatar.textContent =
            "👤";

    }

}


/* =========================================
   REAL-TIME MESSAGES
========================================= */

function listenForMessages() {

    if (
        !currentConversationId
    ) {

        return;

    }


    if (
        messagesListener
    ) {

        messagesListener.off();

    }


    const messagesRef =
        window.nexvoDatabase
            .ref(
                "nexvoChats/" +
                currentConversationId +
                "/messages"
            );


    messagesListener =
        messagesRef;


    messagesListener.on(
        "value",
        function (snapshot) {

            const messages = [];


            snapshot.forEach(
                function (child) {

                    messages.push({

                        id:
                            child.key,

                        ...child.val()

                    });

                }
            );


            renderMessages(
                messages
            );

        },
        function (error) {

            console.error(
                "NEXVO message listener error:",
                error
            );

            showConnectionError();

        }
    );

}


/* =========================================
   RENDER MESSAGES
========================================= */

function renderMessages(
    messages
) {

    if (!messagesArea) {

        return;

    }


    messagesArea.innerHTML = "";


    if (
        !messages.length
    ) {

        renderEmptyChat();

        return;

    }


    renderDateDivider();


    messages.forEach(
        function (message) {

            renderMessage(
                message
            );

        }
    );


    scrollMessagesToBottom();

}


/* =========================================
   EMPTY CHAT
========================================= */

function renderEmptyChat() {

    if (!messagesArea) {

        return;

    }


    messagesArea.innerHTML = `

        <div class="chat-start">

            <div class="chat-start-icon">
                💬
            </div>

            <h2>
                Start a conversation
            </h2>

            <p>
                Send a message to begin
                your NEXVO conversation.
            </p>

        </div>

    `;

}


/* =========================================
   DATE DIVIDER
========================================= */

function renderDateDivider() {

    const divider =
        document.createElement(
            "div"
        );


    divider.className =
        "message-date";


    divider.textContent =
        "Today";


    messagesArea.appendChild(
        divider
    );

}


/* =========================================
   RENDER MESSAGE
========================================= */

function renderMessage(
    message
) {

    const row =
        document.createElement(
            "div"
        );


    const isMine =
        String(
            message.senderId
        ) ===
        String(
            currentUser.uid
        );


    row.className =
        "message-row " +
        (
            isMine
                ? "sent"
                : "received"
        );


    const bubble =
        document.createElement(
            "div"
        );


    bubble.className =
        "message-bubble";


    const text =
        document.createElement(
            "div"
        );


    text.textContent =
        message.text || "";


    const meta =
        document.createElement(
            "div"
        );


    meta.className =
        "message-meta";


    meta.textContent =
        formatMessageTime(
            message.createdAt
        );


    if (isMine) {

        meta.textContent +=
            "  ✓";

    }


    bubble.appendChild(
        text
    );


    bubble.appendChild(
        meta
    );


    row.appendChild(
        bubble
    );


    messagesArea.appendChild(
        row
    );

}


/* =========================================
   SEND MESSAGE
========================================= */

async function sendMessage() {

    if (
        !messageInput ||
        !currentUser ||
        !currentRecipient ||
        !currentConversationId
    ) {

        return;

    }


    const text =
        messageInput.value.trim();


    if (!text) {

        return;

    }


    if (
        text.length >
        2000
    ) {

        return;

    }


    const message = {

        senderId:
            currentUser.uid,

        receiverId:
            currentRecipient.uid,

        text:
            text,

        createdAt:
            firebase.database
                .ServerValue
                .TIMESTAMP

    };


    try {

        const messagesRef =
            window.nexvoDatabase
                .ref(
                    "nexvoChats/" +
                    currentConversationId +
                    "/messages"
                );


        await messagesRef.push(
            message
        );


        messageInput.value =
            "";

        resetMessageInput();

        messageInput.focus();


        updateConversationPreview(
            text
        );

    }

    catch (error) {

        console.error(
            "NEXVO could not send message:",
            error
        );


        alert(
            "Message could not be sent. Please check your connection."
        );

    }

}


/* =========================================
   UPDATE CONVERSATION PREVIEW
========================================= */

function updateConversationPreview(
    text
) {

    if (
        !currentConversationId
    ) {

        return;

    }


    const conversationRef =
        window.nexvoDatabase
            .ref(
                "nexvoChats/" +
                currentConversationId
            );


    conversationRef.update({

        lastMessage:
            text,

        lastMessageSenderId:
            currentUser.uid,

        updatedAt:
            firebase.database
                .ServerValue
                .TIMESTAMP

    })
        .catch(
            function (error) {

                console.warn(
                    "NEXVO conversation preview update failed:",
                    error
                );

            }
        );

}


/* =========================================
   INPUT HEIGHT
========================================= */

function resizeMessageInput() {

    if (!messageInput) {

        return;

    }


    messageInput.style.height =
        "auto";


    messageInput.style.height =
        Math.min(
            messageInput.scrollHeight,
            120
        ) + "px";

}


function resetMessageInput() {

    if (!messageInput) {

        return;

    }


    messageInput.style.height =
        "auto";

}


/* =========================================
   SCROLL
========================================= */

function scrollMessagesToBottom() {

    if (!messagesArea) {

        return;

    }


    setTimeout(
        function () {

            messagesArea.scrollTop =
                messagesArea.scrollHeight;

        },
        30
    );

}


/* =========================================
   TIME
========================================= */

function formatMessageTime(
    timestamp
) {

    if (!timestamp) {

        return "";

    }


    const date =
        new Date(
            timestamp
        );


    return date.toLocaleTimeString(
        [],
        {
            hour:
                "numeric",

            minute:
                "2-digit"
        }
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(
    value
) {

    return String(
        value || ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================
   EVENTS
========================================= */

function setupChatEvents() {


    /* BACK */

    if (chatBackButton) {

        chatBackButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "chats.html";

            }
        );

    }


    /* SEND */

    if (sendButton) {

        sendButton.addEventListener(
            "click",
            sendMessage
        );

    }


    /* ENTER */

    if (messageInput) {

        messageInput.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key ===
                    "Enter" &&
                    !event.shiftKey
                ) {

                    event.preventDefault();

                    sendMessage();

                }

            }
        );


        messageInput.addEventListener(
            "input",
            resizeMessageInput
        );

    }


    /* EMOJI */

    if (emojiButton) {

        emojiButton.addEventListener(
            "click",
            function () {

                if (!emojiBar) {

                    return;

                }


                emojiBar.classList.toggle(
                    "show"
                );

            }
        );

    }


    /* QUICK EMOJIS */

    if (emojiBar) {

        const emojis =
            emojiBar.querySelectorAll(
                "button"
            );


        emojis.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        if (
                            !messageInput
                        ) {

                            return;

                        }


                        messageInput.value +=
                            button.textContent;


                        messageInput.focus();

                        resizeMessageInput();

                    }
                );

            }
        );

    }


    /* ATTACHMENT */

    if (attachmentButton) {

        attachmentButton.addEventListener(
            "click",
            function () {

                alert(
                    "NEXVO attachments will be connected next."
                );

            }
        );

    }


    /* VOICE CALL */

    if (voiceCallButton) {

        voiceCallButton.addEventListener(
            "click",
            function () {

                alert(
                    "NEXVO voice calling will be connected next."
                );

            }
        );

    }


    /* VIDEO CALL */

    if (videoCallButton) {

        videoCallButton.addEventListener(
            "click",
            function () {

                alert(
                    "NEXVO video calling will be connected next."
                );

            }
        );

    }


    /* MORE */

    if (chatMoreButton) {

        chatMoreButton.addEventListener(
            "click",
            openChatMoreMenu
        );

    }


    /* OVERLAY */

    if (chatMenuOverlay) {

        chatMenuOverlay.addEventListener(
            "click",
            closeChatMoreMenu
        );

    }


    /* MORE ACTIONS */

    const menuActions =
        document.querySelectorAll(
            "[data-menu-action]"
        );


    menuActions.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    handleChatMenuAction(
                        button.dataset.menuAction
                    );

                }
            );

        }
    );

}


/* =========================================
   MORE MENU
========================================= */

function openChatMoreMenu() {

    if (chatMoreMenu) {

        chatMoreMenu.classList.add(
            "show"
        );

    }


    if (chatMenuOverlay) {

        chatMenuOverlay.classList.add(
            "show"
        );

    }

}


function closeChatMoreMenu() {

    if (chatMoreMenu) {

        chatMoreMenu.classList.remove(
            "show"
        );

    }


    if (chatMenuOverlay) {

        chatMenuOverlay.classList.remove(
            "show"
        );

    }

}


/* =========================================
   MENU ACTIONS
========================================= */

function handleChatMenuAction(
    action
) {

    if (
        action ===
        "search"
    ) {

        closeChatMoreMenu();

        alert(
            "Message search will be connected next."
        );

        return;

    }


    if (
        action ===
        "clear"
    ) {

        clearConversation();

        return;

    }


    if (
        action ===
        "block"
    ) {

        closeChatMoreMenu();

        alert(
            "Blocking will be connected to the NEXVO safety system later."
        );

        return;

    }


    closeChatMoreMenu();

}


/* =========================================
   CLEAR CONVERSATION
========================================= */

async function clearConversation() {

    if (
        !currentConversationId
    ) {

        return;

    }


    const confirmed =
        window.confirm(
            "Clear this conversation?"
        );


    if (!confirmed) {

        return;

    }


    try {

        await window.nexvoDatabase
            .ref(
                "nexvoChats/" +
                currentConversationId +
                "/messages"
            )
            .remove();


        closeChatMoreMenu();

    }

    catch (error) {

        console.error(
            "NEXVO could not clear conversation:",
            error
        );

        alert(
            "The conversation could not be cleared."
        );

    }

}


/* =========================================
   DEFAULT / ERROR STATES
========================================= */

function showDefaultChat() {

    if (chatName) {

        chatName.textContent =
            "NEXVO Member";

    }


    if (chatStatus) {

        chatStatus.textContent =
            "offline";

    }


    renderEmptyChat();

}


function showUserNotFound() {

    if (chatName) {

        chatName.textContent =
            "User not found";

    }


    if (chatStatus) {

        chatStatus.textContent =
            "NEXVO member unavailable";

    }


    if (messagesArea) {

        messagesArea.innerHTML = `

            <div class="chat-start">

                <div class="chat-start-icon">
                    ⚠️
                </div>

                <h2>
                    User not found
                </h2>

                <p>
                    This NEXVO account could not
                    be found.
                </p>

            </div>

        `;

    }

}


function showConnectionError() {

    if (!messagesArea) {

        return;

    }


    messagesArea.innerHTML = `

        <div class="chat-start">

            <div class="chat-start-icon">
                ⚠️
            </div>

            <h2>
                Connection problem
            </h2>

            <p>
                NEXVO could not connect to the
                messaging service.
            </p>

        </div>

    `;

}