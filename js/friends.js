/* =========================================
   NEXVO
   FRIENDS SYSTEM
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const friendsList =
    document.getElementById(
        "friendsList"
    );

const friendsEmpty =
    document.getElementById(
        "friendsEmpty"
    );

const friendsSearchInput =
    document.getElementById(
        "friendsSearchInput"
    );


/* =========================================
   INITIALIZE FRIENDS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadFriends();

        setupFriendSearch();

    }
);


/* =========================================
   LOAD FRIENDS
========================================= */

function loadFriends() {

    if (!friendsList || !friendsEmpty) {
        return;
    }


    const friends =
        getNexvoFriends();


    if (
        !friends ||
        friends.length === 0
    ) {

        showEmptyFriends();

        return;

    }


    renderFriends(
        friends
    );

}


/* =========================================
   EMPTY FRIENDS
========================================= */

function showEmptyFriends() {

    if (!friendsList || !friendsEmpty) {
        return;
    }


    friendsList.innerHTML = "";


    friendsEmpty.style.display =
        "flex";


    const title =
        friendsEmpty.querySelector(
            "h2"
        );

    const message =
        friendsEmpty.querySelector(
            "p"
        );


    if (title) {

        title.textContent =
            "No friends yet";

    }


    if (message) {

        message.textContent =
            "Add people to your NEXVO friends list and start conversations.";

    }

}


/* =========================================
   RENDER FRIENDS
========================================= */

function renderFriends(
    friends
) {

    if (!friendsList || !friendsEmpty) {
        return;
    }


    friendsList.innerHTML = "";


    friendsEmpty.style.display =
        "none";


    friends.forEach(
        function (friend) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "friend-card";


            card.innerHTML = `

                <div class="friend-avatar">
                    ${friend.avatar || "👤"}
                </div>


                <div class="friend-info">

                    <span class="friend-name">
                        ${friend.name || "NEXVO Member"}
                    </span>

                    <span class="friend-username">
                        @${friend.username || "member"}
                    </span>

                </div>


                <div class="friend-actions">

                    <button
                        class="friend-action"
                        type="button"
                        title="Message"
                        aria-label="Message ${
                            friend.name || "friend"
                        }"
                    >
                        💬
                    </button>

                </div>

            `;


            const messageButton =
                card.querySelector(
                    ".friend-action"
                );


            if (messageButton) {

                messageButton.addEventListener(
                    "click",
                    function () {

                        startFriendChat(
                            friend
                        );

                    }
                );

            }


            friendsList.appendChild(
                card
            );

        }
    );

}


/* =========================================
   START FRIEND CHAT
========================================= */

function startFriendChat(
    friend
) {

    const chats =
        getNexvoChats();


    let chat =
        chats.find(
            function (chat) {

                return String(
                    chat.friendId
                ) === String(
                    friend.id
                );

            }
        );


    if (!chat) {

        chat = {

            id:
                createNexvoId(),

            friendId:
                friend.id,

            name:
                friend.name,

            username:
                friend.username,

            avatar:
                friend.avatar ||
                "👤",

            online:
                friend.online ||
                false,

            lastMessage:
                "",

            time:
                "",

            messages:
                [],

            createdAt:
                Date.now()

        };


        chats.push(
            chat
        );


        saveNexvoChats(
            chats
        );

    }


    window.location.href =
        "chat.html?id=" +
        encodeURIComponent(
            chat.id
        );

}


/* =========================================
   FRIEND SEARCH
========================================= */

function setupFriendSearch() {

    if (!friendsSearchInput) {
        return;
    }


    friendsSearchInput.addEventListener(
        "input",
        function () {

            const search =
                friendsSearchInput.value
                    .trim()
                    .toLowerCase();


            const friends =
                getNexvoFriends();


            if (!search) {

                if (
                    friends.length === 0
                ) {

                    showEmptyFriends();

                } else {

                    renderFriends(
                        friends
                    );

                }

                return;

            }


            const filtered =
                friends.filter(
                    function (friend) {

                        const name =
                            String(
                                friend.name || ""
                            ).toLowerCase();


                        const username =
                            String(
                                friend.username || ""
                            ).toLowerCase();


                        return (
                            name.includes(search) ||
                            username.includes(search)
                        );

                    }
                );


            if (
                filtered.length === 0
            ) {

                showNoFriendsFound();

                return;

            }


            renderFriends(
                filtered
            );

        }
    );

}


/* =========================================
   NO SEARCH RESULTS
========================================= */

function showNoFriendsFound() {

    if (!friendsList || !friendsEmpty) {
        return;
    }


    friendsList.innerHTML = "";


    friendsEmpty.style.display =
        "flex";


    const title =
        friendsEmpty.querySelector(
            "h2"
        );

    const message =
        friendsEmpty.querySelector(
            "p"
        );


    if (title) {

        title.textContent =
            "No friends found";

    }


    if (message) {

        message.textContent =
            "Try another name or username.";

    }

}