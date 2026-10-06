/* =========================================
   NEXVO
   CREATE COMMUNITY PAGE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const backButton =
    document.getElementById("backButton");

const communityName =
    document.getElementById(
        "communityName"
    );

const communityDescription =
    document.getElementById(
        "communityDescription"
    );

const communityNameCount =
    document.getElementById(
        "communityNameCount"
    );

const communityDescriptionCount =
    document.getElementById(
        "communityDescriptionCount"
    );

const previewCommunityName =
    document.getElementById(
        "previewCommunityName"
    );

const previewCommunityCategory =
    document.getElementById(
        "previewCommunityCategory"
    );

const categoryOptions =
    document.querySelectorAll(
        ".category-option"
    );

const visibilityOptions =
    document.querySelectorAll(
        ".visibility-option"
    );

const createCommunityButton =
    document.getElementById(
        "createCommunityButton"
    );

const communityPhotoButton =
    document.getElementById(
        "communityPhotoButton"
    );

const photoMessage =
    document.getElementById(
        "photoMessage"
    );

const closePhotoMessage =
    document.getElementById(
        "closePhotoMessage"
    );


/* =========================================
   STATE
========================================= */

let currentUser = null;

let selectedCategory =
    "General";

let selectedVisibility =
    "public";


/* =========================================
   CURRENT USER
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

            id:
                "nexvo-user",

            name:
                "NEXVO User",

            username:
                "nexvo_user",

            profilePhoto:
                ""

        };

    }

}


/* =========================================
   ESCAPE HTML
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
   GROUP / COMMUNITY ID
========================================= */

function createCommunityId() {

    if (
        typeof createNexvoId ===
        "function"
    ) {

        return createNexvoId();

    }


    return (
        "community-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );

}


/* =========================================
   CATEGORY
========================================= */

function setupCategories() {

    categoryOptions.forEach(
        function (option) {

            option.addEventListener(
                "click",
                function () {

                    categoryOptions.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    option.classList.add(
                        "active"
                    );


                    selectedCategory =
                        option.dataset.category ||
                        "General";


                    previewCommunityCategory.textContent =
                        selectedCategory;


                }
            );

        }
    );

}


/* =========================================
   VISIBILITY
========================================= */

function setupVisibility() {

    visibilityOptions.forEach(
        function (option) {

            option.addEventListener(
                "click",
                function () {

                    visibilityOptions.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    option.classList.add(
                        "active"
                    );


                    selectedVisibility =
                        option.dataset.visibility ||
                        "public";

                }
            );

        }
    );

}


/* =========================================
   COMMUNITY NAME
========================================= */

function setupCommunityName() {

    communityName.addEventListener(
        "input",
        function () {

            const value =
                communityName.value.trim();


            communityNameCount.textContent =
                communityName.value.length +
                " / 60";


            previewCommunityName.textContent =
                value ||
                "New Community";


            updateCreateButton();

        }
    );

}


/* =========================================
   DESCRIPTION
========================================= */

function setupDescription() {

    communityDescription.addEventListener(
        "input",
        function () {

            communityDescriptionCount.textContent =
                communityDescription.value.length +
                " / 250";

        }
    );

}


/* =========================================
   GET COMMUNITIES
========================================= */

function getCommunities() {

    if (
        typeof getNexvoCommunities ===
        "function"
    ) {

        return (
            getNexvoCommunities() || []
        );

    }


    try {

        const saved =
            localStorage.getItem(
                "nexvoCommunities"
            );


        return saved
            ? JSON.parse(saved)
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================================
   SAVE COMMUNITIES
========================================= */

function saveCommunities(
    communities
) {

    if (
        typeof saveNexvoCommunities ===
        "function"
    ) {

        saveNexvoCommunities(
            communities
        );

        return;

    }


    localStorage.setItem(
        "nexvoCommunities",
        JSON.stringify(
            communities
        )
    );

}


/* =========================================
   UPDATE CREATE BUTTON
========================================= */

function updateCreateButton() {

    const name =
        communityName.value.trim();


    createCommunityButton.disabled =
        !name;

}


/* =========================================
   CREATE COMMUNITY
========================================= */

function createCommunity() {

    const name =
        communityName.value.trim();


    const description =
        communityDescription.value.trim();


    if (!name) {

        alert(
            "Please enter a community name."
        );

        communityName.focus();

        return;

    }


    const communities =
        getCommunities();


    const duplicate =
        communities.some(
            function (community) {

                return (
                    String(
                        community.name || ""
                    )
                        .trim()
                        .toLowerCase() ===
                    name.toLowerCase()
                );

            }
        );


    if (duplicate) {

        alert(
            "A community with this name already exists."
        );

        return;

    }


    const community = {

        id:
            createCommunityId(),

        name:
            name,

        description:
            description,

        category:
            selectedCategory,

        visibility:
            selectedVisibility,

        photo:
            "",

        ownerId:
            currentUser.id,

        owner:
            {

                id:
                    currentUser.id,

                name:
                    currentUser.name,

                username:
                    currentUser.username,

                profilePhoto:
                    currentUser.profilePhoto ||
                    ""

            },

        memberIds:
            [
                currentUser.id
            ],

        members:
            [
                {

                    id:
                        currentUser.id,

                    name:
                        currentUser.name,

                    username:
                        currentUser.username,

                    profilePhoto:
                        currentUser.profilePhoto ||
                        ""

                }
            ],

        memberCount:
            1,

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    communities.unshift(
        community
    );


    saveCommunities(
        communities
    );


    /*
     * Keep the created community
     * available to the Search page.
     */

    alert(
        "Community created successfully."
    );


    window.location.href =
        "more.html";

}


/* =========================================
   PHOTO MESSAGE
========================================= */

function setupCommunityPhoto() {

    communityPhotoButton.addEventListener(
        "click",
        function () {

            photoMessage.classList.add(
                "open"
            );

            photoMessage.setAttribute(
                "aria-hidden",
                "false"
            );

        }
    );


    closePhotoMessage.addEventListener(
        "click",
        function () {

            closePhotoNotice();

        }
    );


    photoMessage.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                photoMessage
            ) {

                closePhotoNotice();

            }

        }
    );

}


/* =========================================
   CLOSE PHOTO MESSAGE
========================================= */

function closePhotoNotice() {

    closePhotoMessage.blur();

    photoMessage.classList.remove(
        "open"
    );

    photoMessage.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================
   BACK
========================================= */

function setupBackButton() {

    backButton.addEventListener(
        "click",
        function () {

            if (
                window.history.length > 1
            ) {

                window.history.back();

            } else {

                window.location.href =
                    "more.html";

            }

        }
    );

}


/* =========================================
   CREATE BUTTON
========================================= */

function setupCreateButton() {

    createCommunityButton.addEventListener(
        "click",
        function () {

            createCommunity();

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

function initializeCreateCommunityPage() {

    loadCurrentUser();

    setupBackButton();

    setupCommunityName();

    setupDescription();

    setupCategories();

    setupVisibility();

    setupCommunityPhoto();

    setupCreateButton();

    updateCreateButton();

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

            initializeCreateCommunityPage();

        }
    );

} else {

    initializeCreateCommunityPage();

}