/* =========================================
   NEXVO
   ADD FRIEND PAGE
========================================= */


/* =========================================
   PAGE ELEMENTS
========================================= */

const backButton =
    document.getElementById("backButton");

const friendMethods =
    document.querySelectorAll(".friend-method");

const friendPanels =
    document.querySelectorAll(".friend-panel");

const nameSearchInput =
    document.getElementById("nameSearchInput");

const usernameSearchInput =
    document.getElementById(
        "usernameSearchInput"
    );

const clearNameSearch =
    document.getElementById("clearNameSearch");

const clearUsernameSearch =
    document.getElementById(
        "clearUsernameSearch"
    );

const nameSearchResults =
    document.getElementById(
        "nameSearchResults"
    );

const usernameSearchResults =
    document.getElementById(
        "usernameSearchResults"
    );

const myCode =
    document.getElementById("myCode");

const myCodeName =
    document.getElementById("myCodeName");

const myCodeUsername =
    document.getElementById(
        "myCodeUsername"
    );

const copyCodeButton =
    document.getElementById(
        "copyCodeButton"
    );

const startScanner =
    document.getElementById(
        "startScanner"
    );


/* =========================================
   CURRENT USER
========================================= */

let currentUser = null;


/* =========================================
   SAFE HTML
========================================= */

function escapeHTML(value) {

    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================
   GET CURRENT USER
========================================= */

function loadCurrentUser() {

    if (
        typeof getNexvoUser ===
        "function"
    ) {
        currentUser =
            getNexvoUser();
    }

    if (!currentUser) {

        currentUser = {
            id: "nexvo-user",
            name: "NEXVO User",
            username: "nexvo_user",
            profilePhoto: ""
        };

    }

}


/* =========================================
   FRIEND METHODS
========================================= */

function setupFriendMethods() {

    friendMethods.forEach(
        function (method) {

            method.addEventListener(
                "click",
                function () {

                    const panelId =
                        method.dataset.panel;

                    friendMethods.forEach(
                        function (item) {
                            item.classList.remove(
                                "active"
                            );
                        }
                    );

                    friendPanels.forEach(
                        function (panel) {
                            panel.classList.remove(
                                "active"
                            );
                        }
                    );

                    method.classList.add(
                        "active"
                    );

                    const selectedPanel =
                        document.getElementById(
                            panelId
                        );

                    if (selectedPanel) {
                        selectedPanel.classList.add(
                            "active"
                        );
                    }

                }
            );

        }
    );

}


/* =========================================
   BACK BUTTON
========================================= */

function setupBackButton() {

    if (!backButton) {
        return;
    }

    backButton.addEventListener(
        "click",
        function () {

            if (
                window.history.length > 1
            ) {
                window.history.back();
            } else {
                window.location.href =
                    "friends.html";
            }

        }
    );

}


/* =========================================
   GET FRIENDS
========================================= */

function getFriends() {

    if (
        typeof getNexvoFriends ===
        "function"
    ) {
        return getNexvoFriends();
    }

    return [];

}


/* =========================================
   GET REQUESTS
========================================= */

function getFriendRequests() {

    if (
        typeof getNexvoFriendRequests ===
        "function"
    ) {
        return getNexvoFriendRequests();
    }

    return [];

}


/* =========================================
   SAVE REQUESTS
========================================= */

function saveFriendRequests(
    requests
) {

    if (
        typeof saveNexvoFriendRequests ===
        "function"
    ) {
        saveNexvoFriendRequests(
            requests
        );
        return;
    }

    localStorage.setItem(
        "nexvoFriendRequests",
        JSON.stringify(requests)
    );

}


/* =========================================
   FIND DEMO USERS
========================================= */

function getAvailableUsers() {

    const users = [];

    /*
     * Current account.
     */

    if (currentUser) {
        users.push(currentUser);
    }


    /*
     * Existing friends can also be
     * searched.
     */

    getFriends().forEach(
        function (friend) {

            if (
                friend &&
                !users.some(
                    function (user) {
                        return (
                            user.id ===
                            friend.id
                        );
                    }
                )
            ) {
                users.push(friend);
            }

        }
    );


    /*
     * Existing friend requests may
     * contain users.
     */

    getFriendRequests().forEach(
        function (request) {

            const possibleUser =
                request.user ||
                request.friend ||
                request;

            if (
                possibleUser &&
                possibleUser.id &&
                !users.some(
                    function (user) {
                        return (
                            user.id ===
                            possibleUser.id
                        );
                    }
                )
            ) {
                users.push(
                    possibleUser
                );
            }

        }
    );


    /*
     * Demo users allow the local
     * prototype to actually be tested
     * before a backend exists.
     */

    const demoUsers = [
        {
            id: "demo-001",
            name: "Alex Johnson",
            username: "alexjohnson",
            bio: "NEXVO user",
            profilePhoto: ""
        },
        {
            id: "demo-002",
            name: "Daniel Smith",
            username: "danielsmith",
            bio: "NEXVO user",
            profilePhoto: ""
        },
        {
            id: "demo-003",
            name: "Michael Brown",
            username: "michaelbrown",
            bio: "NEXVO user",
            profilePhoto: ""
        },
        {
            id: "demo-004",
            name: "Sarah Williams",
            username: "sarahwilliams",
            bio: "NEXVO user",
            profilePhoto: ""
        }
    ];

    demoUsers.forEach(
        function (user) {

            if (
                !users.some(
                    function (existing) {
                        return (
                            existing.id ===
                            user.id
                        );
                    }
                )
            ) {
                users.push(user);
            }

        }
    );


    return users;

}


/* =========================================
   USER AVATAR
========================================= */

function getUserInitials(user) {

    const name =
        user.name ||
        user.username ||
        "N";

    const parts =
        name.trim().split(/\s+/);

    if (parts.length >= 2) {

        return (
            parts[0].charAt(0) +
            parts[1].charAt(0)
        ).toUpperCase();

    }

    return name
        .substring(0, 2)
        .toUpperCase();

}


/* =========================================
   CHECK FRIEND STATUS
========================================= */

function getFriendStatus(
    userId
) {

    if (
        currentUser &&
        userId === currentUser.id
    ) {
        return "self";
    }


    const friends =
        getFriends();

    if (
        friends.some(
            function (friend) {
                return (
                    friend.id ===
                    userId
                );
            }
        )
    ) {
        return "friend";
    }


    const requests =
        getFriendRequests();

    const pending =
        requests.some(
            function (request) {

                const requestUserId =
                    request.userId ||
                    request.friendId ||
                    (
                        request.user &&
                        request.user.id
                    );

                return (
                    requestUserId ===
                    userId &&
                    (
                        request.status ===
                        "pending" ||
                        !request.status
                    )
                );

            }
        );

    if (pending) {
        return "pending";
    }

    return "none";

}


/* =========================================
   CREATE RESULT CARD
========================================= */

function createUserResult(
    user
) {

    const status =
        getFriendStatus(user.id);

    const article =
        document.createElement("div");

    article.className =
        "friend-result";

    const avatarHTML =
        user.profilePhoto
            ? `
                <div class="friend-result-avatar">
                    <img
                        src="${escapeHTML(
                            user.profilePhoto
                        )}"
                        alt=""
                    >
                </div>
              `
            : `
                <div class="friend-result-avatar">
                    ${escapeHTML(
                        getUserInitials(user)
                    )}
                </div>
              `;


    let buttonHTML = "";


    if (status === "self") {

        buttonHTML = `
            <button
                class="friend-result-action friend"
                type="button"
                disabled
            >
                You
            </button>
        `;

    } else if (status === "friend") {

        buttonHTML = `
            <button
                class="friend-result-action friend"
                type="button"
                disabled
            >
                Friends
            </button>
        `;

    } else if (status === "pending") {

        buttonHTML = `
            <button
                class="friend-result-action pending"
                type="button"
                disabled
            >
                Pending
            </button>
        `;

    } else {

        buttonHTML = `
            <button
                class="friend-result-action"
                type="button"
                data-user-id="${escapeHTML(
                    user.id
                )}"
            >
                Add
            </button>
        `;

    }


    article.innerHTML = `

        ${avatarHTML}

        <div class="friend-result-info">

            <strong>
                ${escapeHTML(
                    user.name ||
                    user.username
                )}
            </strong>

            <span>
                @${escapeHTML(
                    user.username ||
                    "user"
                )}
            </span>

        </div>

        ${buttonHTML}

    `;


    const addButton =
        article.querySelector(
            ".friend-result-action:not(.friend):not(.pending)"
        );


    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                sendFriendRequest(
                    user
                );

            }
        );

    }


    return article;

}


/* =========================================
   RENDER RESULTS
========================================= */

function renderResults(
    resultsContainer,
    users
) {

    resultsContainer.innerHTML = "";


    if (!users.length) {

        resultsContainer.innerHTML = `

            <div class="search-empty">

                <div class="search-empty-icon">
                    🔎
                </div>

                No matching NEXVO users found.

            </div>

        `;

        return;
    }


    users.forEach(
        function (user) {

            resultsContainer.appendChild(
                createUserResult(user)
            );

        }
    );

}


/* =========================================
   SEARCH BY NAME
========================================= */

function searchByName() {

    const query =
        nameSearchInput.value
            .trim()
            .toLowerCase();


    updateClearButton(
        nameSearchInput,
        clearNameSearch
    );


    if (!query) {

        nameSearchResults.innerHTML = `
            <div class="search-empty">

                <div class="search-empty-icon">
                    👤
                </div>

                Start typing a name to search.

            </div>
        `;

        return;
    }


    const users =
        getAvailableUsers();


    const results =
        users.filter(
            function (user) {

                const name =
                    (
                        user.name ||
                        ""
                    ).toLowerCase();

                return name.includes(
                    query
                );

            }
        );


    renderResults(
        nameSearchResults,
        results
    );

}


/* =========================================
   SEARCH BY USERNAME
========================================= */

function searchByUsername() {

    const rawQuery =
        usernameSearchInput.value
            .trim()
            .toLowerCase();


    updateClearButton(
        usernameSearchInput,
        clearUsernameSearch
    );


    if (!rawQuery) {

        usernameSearchResults.innerHTML = `
            <div class="search-empty">

                <div class="search-empty-icon">
                    @
                </div>

                Enter a NEXVO username to search.

            </div>
        `;

        return;
    }


    const query =
        rawQuery.startsWith("@")
            ? rawQuery.substring(1)
            : rawQuery;


    const users =
        getAvailableUsers();


    const results =
        users.filter(
            function (user) {

                const username =
                    (
                        user.username ||
                        ""
                    ).toLowerCase();

                return username.includes(
                    query
                );

            }
        );


    renderResults(
        usernameSearchResults,
        results
    );

}


/* =========================================
   SEND FRIEND REQUEST
========================================= */

function sendFriendRequest(
    user
) {

    if (!user) {
        return;
    }


    if (
        currentUser &&
        user.id === currentUser.id
    ) {

        alert(
            "You cannot add yourself as a friend."
        );

        return;
    }


    const status =
        getFriendStatus(user.id);


    if (status === "friend") {

        alert(
            "You are already friends with this person."
        );

        return;
    }


    if (status === "pending") {

        alert(
            "A friend request is already pending."
        );

        return;
    }


    const requests =
        getFriendRequests();


    const request = {

        id:
            typeof createNexvoId ===
            "function"
                ? createNexvoId()
                : (
                    "request-" +
                    Date.now()
                ),

        senderId:
            currentUser
                ? currentUser.id
                : "nexvo-user",

        sender:
            currentUser
                ? {
                    id: currentUser.id,
                    name: currentUser.name,
                    username:
                        currentUser.username,
                    profilePhoto:
                        currentUser.profilePhoto ||
                        ""
                }
                : null,

        userId:
            user.id,

        user: {

            id: user.id,

            name:
                user.name ||
                user.username,

            username:
                user.username ||
                "",

            profilePhoto:
                user.profilePhoto ||
                ""

        },

        status: "pending",

        createdAt:
            new Date().toISOString()

    };


    requests.push(request);

    saveFriendRequests(
        requests
    );


    /*
     * Refresh both search panels.
     */

    searchByName();
    searchByUsername();


    alert(
        "Friend request sent."
    );

}


/* =========================================
   CLEAR BUTTON
========================================= */

function updateClearButton(
    input,
    button
) {

    if (
        input.value.trim()
    ) {

        button.classList.add(
            "visible"
        );

    } else {

        button.classList.remove(
            "visible"
        );

    }

}


/* =========================================
   NAME SEARCH EVENTS
========================================= */

function setupNameSearch() {

    nameSearchInput.addEventListener(
        "input",
        searchByName
    );


    clearNameSearch.addEventListener(
        "click",
        function () {

            nameSearchInput.value = "";

            updateClearButton(
                nameSearchInput,
                clearNameSearch
            );

            searchByName();

            nameSearchInput.focus();

        }
    );

}


/* =========================================
   USERNAME SEARCH EVENTS
========================================= */

function setupUsernameSearch() {

    usernameSearchInput.addEventListener(
        "input",
        searchByUsername
    );


    clearUsernameSearch.addEventListener(
        "click",
        function () {

            usernameSearchInput.value = "";

            updateClearButton(
                usernameSearchInput,
                clearUsernameSearch
            );

            searchByUsername();

            usernameSearchInput.focus();

        }
    );

}


/* =========================================
   MY NEXVO CODE
========================================= */

function generateMyCode() {

    const username =
        currentUser.username ||
        "nexvo_user";

    const userId =
        currentUser.id ||
        "nexvo-user";

    const code =
        "NEXVO-" +
        String(username)
            .replace(
                /[^a-zA-Z0-9]/g,
                ""
            )
            .toUpperCase()
            .substring(0, 8) +
        "-" +
        String(userId)
            .replace(
                /[^a-zA-Z0-9]/g,
                ""
            )
            .substring(0, 6)
            .toUpperCase();


    myCode.textContent =
        code;


    myCodeName.textContent =
        currentUser.name ||
        "NEXVO User";


    myCodeUsername.textContent =
        "@" +
        (
            currentUser.username ||
            "username"
        );

}


/* =========================================
   COPY MY CODE
========================================= */

function setupCopyCode() {

    copyCodeButton.addEventListener(
        "click",
        async function () {

            const code =
                myCode.textContent;


            try {

                await navigator.clipboard.writeText(
                    code
                );

                copyCodeButton.textContent =
                    "Copied!";


                setTimeout(
                    function () {

                        copyCodeButton.textContent =
                            "Copy NEXVO Code";

                    },
                    1500
                );

            } catch (error) {

                alert(
                    "Your NEXVO Code is: " +
                    code
                );

            }

        }
    );

}


/* =========================================
   SCANNER
========================================= */

function setupScanner() {

    startScanner.addEventListener(
        "click",
        function () {

            alert(
                "NEXVO Code scanning will be connected when the camera feature is added."
            );

        }
    );

}


/* =========================================
   INITIAL EMPTY STATES
========================================= */

function setupInitialStates() {

    nameSearchResults.innerHTML = `
        <div class="search-empty">

            <div class="search-empty-icon">
                👤
            </div>

            Start typing a name to search.

        </div>
    `;


    usernameSearchResults.innerHTML = `
        <div class="search-empty">

            <div class="search-empty-icon">
                @
            </div>

            Enter a NEXVO username to search.

        </div>
    `;

}


/* =========================================
   INITIALIZE PAGE
========================================= */

function initializeAddFriendPage() {

    loadCurrentUser();

    setupBackButton();

    setupFriendMethods();

    setupNameSearch();

    setupUsernameSearch();

    setupCopyCode();

    setupScanner();

    generateMyCode();

    setupInitialStates();

}


/* =========================================
   DOM READY
========================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        function () {
            initializeAddFriendPage();
        }
    );

} else {

    initializeAddFriendPage();

}