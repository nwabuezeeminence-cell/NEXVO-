/* =========================================
   NEXVO
   CREATE GROUP PAGE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const backButton =
    document.getElementById("backButton");

const groupName =
    document.getElementById("groupName");

const groupDescription =
    document.getElementById(
        "groupDescription"
    );

const groupNameCount =
    document.getElementById(
        "groupNameCount"
    );

const descriptionCount =
    document.getElementById(
        "descriptionCount"
    );

const previewGroupName =
    document.getElementById(
        "previewGroupName"
    );

const previewMemberCount =
    document.getElementById(
        "previewMemberCount"
    );

const selectedCount =
    document.getElementById(
        "selectedCount"
    );

const memberSearchInput =
    document.getElementById(
        "memberSearchInput"
    );

const clearMemberSearch =
    document.getElementById(
        "clearMemberSearch"
    );

const membersList =
    document.getElementById(
        "membersList"
    );

const createGroupButton =
    document.getElementById(
        "createGroupButton"
    );

const groupPhotoButton =
    document.getElementById(
        "groupPhotoButton"
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

let availableMembers = [];

let selectedMembers = new Set();


/* =========================================
   HTML ESCAPE
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
            id: "nexvo-user",
            name: "NEXVO User",
            username: "nexvo_user",
            profilePhoto: ""
        };

    }

}


/* =========================================
   GET FRIENDS
========================================= */

function loadFriends() {

    let friends = [];

    if (
        typeof getNexvoFriends ===
        "function"
    ) {
        friends =
            getNexvoFriends() || [];
    }


    /*
     * If there are no saved friends yet,
     * use the same local prototype users
     * used by Add Friend.
     */

    if (!friends.length) {

        friends = [

            {
                id: "demo-001",
                name: "Alex Johnson",
                username: "alexjohnson",
                profilePhoto: ""
            },

            {
                id: "demo-002",
                name: "Daniel Smith",
                username: "danielsmith",
                profilePhoto: ""
            },

            {
                id: "demo-003",
                name: "Michael Brown",
                username: "michaelbrown",
                profilePhoto: ""
            },

            {
                id: "demo-004",
                name: "Sarah Williams",
                username: "sarahwilliams",
                profilePhoto: ""
            }

        ];

    }


    /*
     * Remove the current user from
     * selectable members.
     */

    availableMembers =
        friends.filter(
            function (friend) {

                return (
                    friend &&
                    friend.id !==
                    currentUser.id
                );

            }
        );

}


/* =========================================
   USER INITIALS
========================================= */

function getInitials(user) {

    const name =
        user.name ||
        user.username ||
        "N";

    const parts =
        name
            .trim()
            .split(/\s+/);


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
   RENDER MEMBERS
========================================= */

function renderMembers() {

    const query =
        memberSearchInput.value
            .trim()
            .toLowerCase();


    const filteredMembers =
        availableMembers.filter(
            function (member) {

                const name =
                    (
                        member.name ||
                        ""
                    ).toLowerCase();

                const username =
                    (
                        member.username ||
                        ""
                    ).toLowerCase();

                return (
                    !query ||
                    name.includes(query) ||
                    username.includes(query)
                );

            }
        );


    membersList.innerHTML = "";


    if (!filteredMembers.length) {

        membersList.innerHTML = `

            <div class="member-empty">

                <div class="member-empty-icon">
                    👥
                </div>

                ${
                    query
                        ? "No friends found."
                        : "You don't have any friends to add yet."
                }

            </div>

        `;

        return;
    }


    filteredMembers.forEach(
        function (member) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "member-item";


            if (
                selectedMembers.has(
                    member.id
                )
            ) {
                item.classList.add(
                    "selected"
                );
            }


            const avatarHTML =
                member.profilePhoto
                    ? `
                        <div class="member-avatar">
                            <img
                                src="${escapeHTML(
                                    member.profilePhoto
                                )}"
                                alt=""
                            >
                        </div>
                      `
                    : `
                        <div class="member-avatar">
                            ${escapeHTML(
                                getInitials(member)
                            )}
                        </div>
                      `;


            item.innerHTML = `

                ${avatarHTML}

                <div class="member-info">

                    <strong>
                        ${escapeHTML(
                            member.name ||
                            member.username
                        )}
                    </strong>

                    <span>
                        @${escapeHTML(
                            member.username ||
                            "user"
                        )}
                    </span>

                </div>

                <div class="member-check">
                    ✓
                </div>

            `;


            item.addEventListener(
                "click",
                function () {

                    toggleMember(
                        member
                    );

                }
            );


            membersList.appendChild(
                item
            );

        }
    );

}


/* =========================================
   TOGGLE MEMBER
========================================= */

function toggleMember(
    member
) {

    if (
        selectedMembers.has(
            member.id
        )
    ) {

        selectedMembers.delete(
            member.id
        );

    } else {

        selectedMembers.add(
            member.id
        );

    }


    updateMemberCount();

    renderMembers();

}


/* =========================================
   UPDATE MEMBER COUNT
========================================= */

function updateMemberCount() {

    const count =
        selectedMembers.size;


    selectedCount.textContent =
        count;


    previewMemberCount.textContent =
        count === 1
            ? "1 member selected"
            : count + " members selected";


    updateCreateButton();

}


/* =========================================
   UPDATE CREATE BUTTON
========================================= */

function updateCreateButton() {

    const name =
        groupName.value.trim();


    /*
     * A group requires:
     * - a name
     * - at least one other member
     */

    createGroupButton.disabled =
        !name ||
        selectedMembers.size === 0;

}


/* =========================================
   GROUP NAME
========================================= */

function setupGroupName() {

    groupName.addEventListener(
        "input",
        function () {

            const value =
                groupName.value.trim();


            groupNameCount.textContent =
                groupName.value.length +
                " / 50";


            previewGroupName.textContent =
                value ||
                "New Group";


            updateCreateButton();

        }
    );

}


/* =========================================
   DESCRIPTION
========================================= */

function setupDescription() {

    groupDescription.addEventListener(
        "input",
        function () {

            descriptionCount.textContent =
                groupDescription.value.length +
                " / 160";

        }
    );

}


/* =========================================
   MEMBER SEARCH
========================================= */

function setupMemberSearch() {

    memberSearchInput.addEventListener(
        "input",
        function () {

            updateSearchClearButton();

            renderMembers();

        }
    );


    clearMemberSearch.addEventListener(
        "click",
        function () {

            memberSearchInput.value = "";

            updateSearchClearButton();

            renderMembers();

            memberSearchInput.focus();

        }
    );

}


/* =========================================
   CLEAR SEARCH BUTTON
========================================= */

function updateSearchClearButton() {

    if (
        memberSearchInput.value.trim()
    ) {

        clearMemberSearch.classList.add(
            "visible"
        );

    } else {

        clearMemberSearch.classList.remove(
            "visible"
        );

    }

}


/* =========================================
   SAVE GROUPS
========================================= */

function getGroups() {

    if (
        typeof getNexvoGroups ===
        "function"
    ) {

        return (
            getNexvoGroups() || []
        );

    }


    try {

        const saved =
            localStorage.getItem(
                "nexvoGroups"
            );


        return saved
            ? JSON.parse(saved)
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================================
   SAVE GROUPS
========================================= */

function saveGroups(
    groups
) {

    if (
        typeof saveNexvoGroups ===
        "function"
    ) {

        saveNexvoGroups(
            groups
        );

        return;

    }


    localStorage.setItem(
        "nexvoGroups",
        JSON.stringify(groups)
    );

}


/* =========================================
   CREATE GROUP ID
========================================= */

function createGroupId() {

    if (
        typeof createNexvoId ===
        "function"
    ) {

        return createNexvoId();

    }


    return (
        "group-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );

}


/* =========================================
   CREATE GROUP
========================================= */

function createGroup() {

    const name =
        groupName.value.trim();


    const description =
        groupDescription.value.trim();


    if (!name) {

        alert(
            "Please enter a group name."
        );

        groupName.focus();

        return;

    }


    if (
        selectedMembers.size === 0
    ) {

        alert(
            "Please select at least one friend."
        );

        return;

    }


    const selectedUsers =
        availableMembers.filter(
            function (member) {

                return selectedMembers.has(
                    member.id
                );

            }
        );


    const group = {

        id:
            createGroupId(),

        name:
            name,

        description:
            description,

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
                },

                ...selectedUsers.map(
                    function (member) {

                        return {

                            id:
                                member.id,

                            name:
                                member.name,

                            username:
                                member.username,

                            profilePhoto:
                                member.profilePhoto ||
                                ""

                        };

                    }
                )
            ],

        memberIds:
            [
                currentUser.id,
                ...selectedUsers.map(
                    function (member) {
                        return member.id;
                    }
                )
            ],

        createdAt:
            new Date().toISOString(),

        updatedAt:
            new Date().toISOString()

    };


    const groups =
        getGroups();


    groups.push(
        group
    );


    saveGroups(
        groups
    );


    /*
     * Save the group as a chat as well
     * if the existing data layer supports
     * chats through localStorage.
     */

    addGroupToChats(
        group
    );


    alert(
        "Group created successfully."
    );


    window.location.href =
        "chats.html";

}


/* =========================================
   ADD GROUP TO CHATS
========================================= */

function addGroupToChats(
    group
) {

    let chats = [];


    if (
        typeof getNexvoChats ===
        "function"
    ) {

        chats =
            getNexvoChats() || [];

    } else {

        try {

            const saved =
                localStorage.getItem(
                    "nexvoChats"
                );

            chats =
                saved
                    ? JSON.parse(saved)
                    : [];

        } catch (error) {

            chats = [];

        }

    }


    const chatExists =
        chats.some(
            function (chat) {

                return (
                    chat.id ===
                    group.id
                );

            }
        );


    if (chatExists) {
        return;
    }


    const chat = {

        id:
            group.id,

        type:
            "group",

        groupId:
            group.id,

        name:
            group.name,

        photo:
            group.photo,

        lastMessage:
            "",

        lastMessageAt:
            group.createdAt,

        unreadCount:
            0,

        members:
            group.members

    };


    chats.unshift(
        chat
    );


    if (
        typeof saveNexvoChats ===
        "function"
    ) {

        saveNexvoChats(
            chats
        );

    } else {

        localStorage.setItem(
            "nexvoChats",
            JSON.stringify(chats)
        );

    }

}


/* =========================================
   PHOTO MESSAGE
========================================= */

function setupGroupPhoto() {

    groupPhotoButton.addEventListener(
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
   BACK BUTTON
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
                    "friends.html";

            }

        }
    );

}


/* =========================================
   CREATE BUTTON
========================================= */

function setupCreateButton() {

    createGroupButton.addEventListener(
        "click",
        function () {

            createGroup();

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

function initializeCreateGroupPage() {

    loadCurrentUser();

    loadFriends();

    setupBackButton();

    setupGroupName();

    setupDescription();

    setupMemberSearch();

    setupCreateButton();

    setupGroupPhoto();

    updateMemberCount();

    updateSearchClearButton();

    renderMembers();

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

            initializeCreateGroupPage();

        }
    );

} else {

    initializeCreateGroupPage();

}