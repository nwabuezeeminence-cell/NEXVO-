/* =========================================
   NEXVO
   CHATS PAGE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const chatList =
    document.getElementById("chatList");

const chatEmpty =
    document.getElementById("chatEmpty");

const chatSearchInput =
    document.getElementById("chatSearchInput");

const chatSearchButton =
    document.getElementById("chatSearchButton");


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadChats();

        setupChatSearch();

        setupChatSearchButton();

    }
);


/* =========================================
   LOAD CHATS
========================================= */

function loadChats() {

    const chats =
        getNexvoChats();


    if (
        !Array.isArray(chats) ||
        chats.length === 0
    ) {

        showEmptyChats();

        return;

    }


    showChats(chats);

}


/* =========================================
   EMPTY CHATS
========================================= */

function showEmptyChats() {

    if (chatList) {

        chatList.innerHTML = "";

    }


    if (chatEmpty) {

        chatEmpty.style.display = "flex";


        const emptyTitle =
            chatEmpty.querySelector("h2");

        const emptyText =
            chatEmpty.querySelector("p");


        if (emptyTitle) {

            emptyTitle.textContent =
                "No chats yet";

        }


        if (emptyText) {

            emptyText.textContent =
                "Start a conversation with a friend using the N button.";

        }

    }

}


/* =========================================
   SHOW CHATS
========================================= */

function showChats(chats) {

    if (!chatList) {

        return;

    }


    if (chatEmpty) {

        chatEmpty.style.display = "none";

    }


    chatList.innerHTML = "";


    chats.forEach(
        function (chat) {

            const item =
                document.createElement("div");


            item.className =
                "chat-item";


            item.innerHTML = `

                <div class="chat-avatar">
                    💬
                </div>


                <div class="chat-content">

                    <span class="chat-name">
                        ${escapeChatText(
                            chat.name ||
                            "NEXVO Member"
                        )}
                    </span>


                    <span class="chat-preview">
                        ${escapeChatText(
                            chat.lastMessage ||
                            "Start a conversation"
                        )}
                    </span>

                </div>


                <span class="chat-time">
                    ${escapeChatText(
                        chat.time || ""
                    )}
                </span>

            `;


            /*
             * Open chat when clicked.
             *
             * Only happens when the chat
             * actually has an ID.
             */

            if (chat.id) {

                item.style.cursor = "pointer";


                item.addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            "chat.html?id=" +
                            encodeURIComponent(
                                chat.id
                            );

                    }
                );

            }


            chatList.appendChild(item);

        }
    );

}


/* =========================================
   CHAT SEARCH
========================================= */

function setupChatSearch() {

    if (!chatSearchInput) {

        return;

    }


    chatSearchInput.addEventListener(
        "input",
        function () {

            const search =
                chatSearchInput.value
                    .trim()
                    .toLowerCase();


            const chats =
                getNexvoChats();


            /*
             * Empty search:
             * restore normal chat list.
             */

            if (!search) {

                loadChats();

                return;

            }


            const filtered =
                chats.filter(
                    function (chat) {

                        const name =
                            String(
                                chat.name || ""
                            ).toLowerCase();


                        const message =
                            String(
                                chat.lastMessage || ""
                            ).toLowerCase();


                        return (
                            name.includes(search) ||
                            message.includes(search)
                        );

                    }
                );


            /*
             * No search results.
             */

            if (
                filtered.length === 0
            ) {

                showNoSearchResults();

                return;

            }


            /*
             * Display matching chats.
             */

            showChats(filtered);

        }
    );

}


/* =========================================
   NO SEARCH RESULTS
========================================= */

function showNoSearchResults() {

    if (chatList) {

        chatList.innerHTML = "";

    }


    if (chatEmpty) {

        chatEmpty.style.display = "flex";


        const emptyTitle =
            chatEmpty.querySelector("h2");

        const emptyText =
            chatEmpty.querySelector("p");


        if (emptyTitle) {

            emptyTitle.textContent =
                "No chats found";

        }


        if (emptyText) {

            emptyText.textContent =
                "Try searching for another conversation.";

        }

    }

}


/* =========================================
   SEARCH BUTTON
========================================= */

function setupChatSearchButton() {

    if (!chatSearchButton) {

        return;

    }


    chatSearchButton.addEventListener(
        "click",
        function () {

            if (chatSearchInput) {

                chatSearchInput.focus();

            }

        }
    );

}


/* =========================================
   SAFE CHAT TEXT
========================================= */

function escapeChatText(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}