/* =========================================
   NEXVO
   REAL-TIME USER SEARCH
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const searchInput =
    document.getElementById(
        "searchInput"
    );

const searchResults =
    document.getElementById(
        "searchResults"
    );

const clearSearch =
    document.getElementById(
        "clearSearch"
    );

const backButton =
    document.getElementById(
        "backButton"
    );

const filterButtons =
    document.querySelectorAll(
        ".search-filter"
    );


/* =========================================
   STATE
========================================= */

let currentType =
    "all";

let firebaseUsers =
    [];

let firebaseReady =
    false;


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupSearchEvents();

        waitForFirebase();

    }
);


/* =========================================
   WAIT FOR FIREBASE
========================================= */

function waitForFirebase() {

    let attempts =
        0;

    const timer =
        setInterval(
            async function () {

                attempts++;


                if (
                    window.nexvoCurrentUser &&
                    window.nexvoDatabase
                ) {

                    clearInterval(timer);

                    firebaseReady =
                        true;

                    await loadFirebaseUsers();

                    performSearch();

                    return;

                }


                if (
                    attempts >= 100
                ) {

                    clearInterval(timer);

                    showSearchError();

                }

            },
            100
        );

}


/* =========================================
   LOAD USERS
========================================= */

async function loadFirebaseUsers() {

    if (
        !window.nexvoDatabase
    ) {

        return;

    }


    try {

        const snapshot =
            await window.nexvoDatabase
                .ref("nexvoUsers")
                .once("value");


        firebaseUsers =
            [];


        snapshot.forEach(
            function (child) {

                const user =
                    child.val();


                if (!user) {

                    return;

                }


                firebaseUsers.push({

                    uid:
                        child.key,

                    ...user

                });

            }
        );

    }

    catch (error) {

        console.error(
            "NEXVO user search error:",
            error
        );

        showSearchError();

    }

}


/* =========================================
   NORMALIZE
========================================= */

function normalizeText(
    value
) {

    return String(
        value || ""
    )
        .toLowerCase()
        .trim();

}


/* =========================================
   MATCH USER
========================================= */

function matchesUser(
    user,
    query
) {

    if (!query) {

        return true;

    }


    const searchableText = [

        user.nexvoId,

        user.displayName,

        user.name,

        user.username,

        user.bio

    ]
        .filter(Boolean)
        .join(" ");


    return normalizeText(
        searchableText
    ).includes(
        normalizeText(query)
    );

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeSearchHTML(
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
   CREATE PERSON RESULT
========================================= */

function createPersonResult(
    user
) {

    const name =
        user.displayName ||
        user.name ||
        "NEXVO Member";


    const nexvoId =
        user.nexvoId ||
        "";


    const username =
        user.username
            ? "@" +
              user.username
            : "";


    let avatarHTML =
        "👤";


    if (
        user.profilePhoto
    ) {

        avatarHTML = `

            <img
                src="${escapeSearchHTML(
                    user.profilePhoto
                )}"
                alt=""
            >

        `;

    }


    else if (
        user.avatar
    ) {

        avatarHTML =
            escapeSearchHTML(
                user.avatar
            );

    }


    return `

        <button
            class="search-result"
            data-id="${escapeSearchHTML(
                user.uid
            )}"
            data-type="people"
            type="button"
        >

            <div class="result-avatar">

                ${avatarHTML}

            </div>


            <div class="result-info">

                <h3 class="result-name">

                    ${escapeSearchHTML(
                        name
                    )}

                </h3>


                ${
                    username
                        ? `
                            <p class="result-username">
                                ${escapeSearchHTML(
                                    username
                                )}
                            </p>
                          `
                        : ""
                }


                <p class="result-type">

                    ${
                        nexvoId
                            ? escapeSearchHTML(
                                nexvoId
                              )
                            : "NEXVO member"
                    }

                </p>

            </div>


            <span class="search-result-arrow">
                ›
            </span>

        </button>

    `;

}


/* =========================================
   LOCAL GROUPS / COMMUNITIES
========================================= */

function getLocalResults() {

    const groups =
        typeof getNexvoGroups ===
        "function"
            ? getNexvoGroups() || []
            : [];


    const communities =
        typeof getNexvoCommunities ===
        "function"
            ? getNexvoCommunities() || []
            : [];


    return {

        groups:
            groups,

        communities:
            communities

    };

}


/* =========================================
   CREATE LOCAL RESULT
========================================= */

function createLocalResult(
    item,
    type
) {

    const icon =
        type === "groups"
            ? "👥"
            : "🌐";


    const name =
        item.name ||
        item.displayName ||
        "NEXVO";


    const description =
        item.description ||
        item.bio ||
        (
            type === "groups"
                ? "NEXVO group"
                : "NEXVO community"
        );


    return `

        <button
            class="search-result"
            data-id="${escapeSearchHTML(
                item.id || ""
            )}"
            data-type="${type}"
            type="button"
        >

            <div class="result-avatar">

                ${icon}

            </div>


            <div class="result-info">

                <h3 class="result-name">

                    ${escapeSearchHTML(
                        name
                    )}

                </h3>


                <p class="result-type">

                    ${escapeSearchHTML(
                        description
                    )}

                </p>

            </div>


            <span class="search-result-arrow">
                ›
            </span>

        </button>

    `;

}


/* =========================================
   EMPTY
========================================= */

function showSearchEmpty(
    hasQuery
) {

    if (!searchResults) {

        return;

    }


    searchResults.innerHTML = `

        <div class="search-empty">

            <div class="search-empty-icon">

                ${
                    hasQuery
                        ? "⌕"
                        : "🔎"
                }

            </div>


            <h2>

                ${
                    hasQuery
                        ? "Nothing found"
                        : "Search NEXVO"
                }

            </h2>


            <p>

                ${
                    hasQuery
                        ? "We couldn't find anything matching your search."
                        : "Find people, groups and communities across NEXVO."
                }

            </p>

        </div>

    `;

}


/* =========================================
   SEARCH ERROR
========================================= */

function showSearchError() {

    if (!searchResults) {

        return;

    }


    searchResults.innerHTML = `

        <div class="search-empty">

            <div class="search-empty-icon">
                ⚠️
            </div>


            <h2>
                Search unavailable
            </h2>


            <p>
                NEXVO could not connect to
                the user directory.
            </p>

        </div>

    `;

}


/* =========================================
   PERFORM SEARCH
========================================= */

function performSearch() {

    if (!searchResults) {

        return;

    }


    if (!firebaseReady) {

        searchResults.innerHTML = `

            <div class="search-empty">

                <div class="search-empty-icon">
                    ⏳
                </div>

                <h2>
                    Connecting to NEXVO
                </h2>

                <p>
                    Loading NEXVO members...
                </p>

            </div>

        `;

        return;

    }


    const query =
        searchInput
            ? searchInput.value.trim()
            : "";


    const results = [];


    /* =====================================
       PEOPLE
    ====================================== */

    if (
        currentType ===
        "all" ||
        currentType ===
        "people"
    ) {

        firebaseUsers
            .filter(
                function (user) {

                    return (
                        user.uid !==
                        window.nexvoCurrentUser.uid
                    );

                }
            )
            .filter(
                function (user) {

                    return matchesUser(
                        user,
                        query
                    );

                }
            )
            .forEach(
                function (user) {

                    results.push({

                        item:
                            user,

                        type:
                            "people"

                    });

                }
            );

    }


    /* =====================================
       GROUPS + COMMUNITIES
    ====================================== */

    const local =
        getLocalResults();


    if (
        currentType ===
        "all" ||
        currentType ===
        "groups"
    ) {

        local.groups
            .filter(
                function (item) {

                    return matchesUser(
                        item,
                        query
                    );

                }
            )
            .forEach(
                function (item) {

                    results.push({

                        item:
                            item,

                        type:
                            "groups"

                    });

                }
            );

    }


    if (
        currentType ===
        "all" ||
        currentType ===
        "communities"
    ) {

        local.communities
            .filter(
                function (item) {

                    return matchesUser(
                        item,
                        query
                    );

                }
            )
            .forEach(
                function (item) {

                    results.push({

                        item:
                            item,

                        type:
                            "communities"

                    });

                }
            );

    }


    /* =====================================
       EMPTY
    ====================================== */

    if (
        !results.length
    ) {

        showSearchEmpty(
            Boolean(query)
        );

        return;

    }


    /* =====================================
       RENDER
    ====================================== */

    searchResults.innerHTML = `

        <p class="search-section-title">

            ${
                query
                    ? `${results.length} result${
                        results.length === 1
                            ? ""
                            : "s"
                      }`
                    : "NEXVO members"
            }

        </p>


        ${
            results
                .map(
                    function (result) {

                        if (
                            result.type ===
                            "people"
                        ) {

                            return createPersonResult(
                                result.item
                            );

                        }


                        return createLocalResult(
                            result.item,
                            result.type
                        );

                    }
                )
                .join("")
        }

    `;

}


/* =========================================
   EVENTS
========================================= */

function setupSearchEvents() {


    /* =====================================
       BACK
    ====================================== */

    if (backButton) {

        backButton.addEventListener(
            "click",
            function () {

                if (
                    window.history.length >
                    1
                ) {

                    window.history.back();

                }

                else {

                    window.location.href =
                        "home.html";

                }

            }
        );

    }


    /* =====================================
       SEARCH INPUT
    ====================================== */

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            function () {

                if (
                    clearSearch
                ) {

                    if (
                        searchInput.value.trim()
                    ) {

                        clearSearch.classList.add(
                            "visible"
                        );

                    }

                    else {

                        clearSearch.classList.remove(
                            "visible"
                        );

                    }

                }


                performSearch();

            }
        );

    }


    /* =====================================
       CLEAR
    ====================================== */

    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            function () {

                if (searchInput) {

                    searchInput.value =
                        "";

                    searchInput.focus();

                }


                clearSearch.classList.remove(
                    "visible"
                );


                performSearch();

            }
        );

    }


    /* =====================================
       FILTERS
    ====================================== */

    filterButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    filterButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    currentType =
                        button.dataset.type ||
                        "all";


                    performSearch();

                }
            );

        }
    );


    /* =====================================
       RESULT CLICK
    ====================================== */

    if (searchResults) {

        searchResults.addEventListener(
            "click",
            function (event) {

                const result =
                    event.target.closest(
                        ".search-result"
                    );


                if (!result) {

                    return;

                }


                const id =
                    result.dataset.id;


                const type =
                    result.dataset.type;


                if (!id) {

                    return;

                }


                /* =========================
                   PEOPLE → REAL CHAT
                ========================== */

                if (
                    type ===
                    "people"
                ) {

                    window.location.href =
                        "chat.html?id=" +
                        encodeURIComponent(
                            id
                        );

                    return;

                }


                /* =========================
                   GROUP
                ========================== */

                if (
                    type ===
                    "groups"
                ) {

                    window.location.href =
                        "group.html?id=" +
                        encodeURIComponent(
                            id
                        );

                    return;

                }


                /* =========================
                   COMMUNITY
                ========================== */

                if (
                    type ===
                    "communities"
                ) {

                    window.location.href =
                        "community.html?id=" +
                        encodeURIComponent(
                            id
                        );

                }

            }
        );

    }

}


/* =========================================
   START INITIAL SEARCH
========================================= */

performSearch();