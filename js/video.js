/* =========================================
   NEXVO VIDEO
   MAIN VIDEO EXPERIENCE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const videoSearchButton =
    document.getElementById(
        "videoSearchButton"
    );

const videoSearchPanel =
    document.getElementById(
        "videoSearchPanel"
    );

const closeVideoSearch =
    document.getElementById(
        "closeVideoSearch"
    );

const videoSearchInput =
    document.getElementById(
        "videoSearchInput"
    );

const clearVideoSearch =
    document.getElementById(
        "clearVideoSearch"
    );

const videoSearchResults =
    document.getElementById(
        "videoSearchResults"
    );

const videoTabs =
    document.querySelectorAll(
        ".video-tab"
    );

const mainVideo =
    document.getElementById(
        "mainVideo"
    );

const videoPlaceholder =
    document.getElementById(
        "videoPlaceholder"
    );

const placeholderTitle =
    document.getElementById(
        "placeholderTitle"
    );

const placeholderText =
    document.getElementById(
        "placeholderText"
    );

const moreVideoActions =
    document.getElementById(
        "moreVideoActions"
    );

const videoActionMenu =
    document.getElementById(
        "videoActionMenu"
    );

const videoLikeButton =
    document.getElementById(
        "videoLikeButton"
    );

const videoLikeIcon =
    document.getElementById(
        "videoLikeIcon"
    );

const videoLikeCount =
    document.getElementById(
        "videoLikeCount"
    );

const videoCommentButton =
    document.getElementById(
        "videoCommentButton"
    );

const videoCommentCount =
    document.getElementById(
        "videoCommentCount"
    );

const videoCreateButton =
    document.getElementById(
        "videoCreateButton"
    );

const videoHomeButton =
    document.getElementById(
        "videoHomeButton"
    );

const videoMeButton =
    document.getElementById(
        "videoMeButton"
    );

const meMenu =
    document.getElementById(
        "meMenu"
    );

const closeMeMenu =
    document.getElementById(
        "closeMeMenu"
    );


/* COMMENTS */

const commentsPanel =
    document.getElementById(
        "commentsPanel"
    );

const closeComments =
    document.getElementById(
        "closeComments"
    );

const commentsList =
    document.getElementById(
        "commentsList"
    );

const commentsEmpty =
    document.getElementById(
        "commentsEmpty"
    );

const commentForm =
    document.getElementById(
        "commentForm"
    );

const commentInput =
    document.getElementById(
        "commentInput"
    );

const commentAvatar =
    document.getElementById(
        "commentAvatar"
    );

const commentsHeaderCount =
    document.getElementById(
        "commentsHeaderCount"
    );


/* =========================================
   STATE
========================================= */

let currentFeed =
    "for-you";

let currentVideoId =
    "nexvo-demo-video";

let videoLiked =
    false;

let videoActionsOpen =
    false;

let meMenuOpen =
    false;

let commentsOpen =
    false;

let commentsListener =
    null;


/* =========================================
   FIREBASE REFERENCES
========================================= */

let commentsDatabase =
    null;

let commentsUser =
    null;


/* =========================================
   INITIALIZE FIREBASE
========================================= */

async function initializeVideoFirebase() {

    try {

        if (
            typeof firebase ===
            "undefined"
        ) {

            console.warn(
                "NEXVO Firebase is not available."
            );

            return;

        }


        if (
            !window.nexvoDatabase
        ) {

            console.warn(
                "NEXVO database is not ready."
            );

            return;

        }


        commentsDatabase =
            window.nexvoDatabase;


        if (
            window.nexvoCurrentUser
        ) {

            commentsUser =
                window.nexvoCurrentUser;

        }


        if (
            typeof initializeNexvoIdentity ===
            "function" &&
            window.nexvoCurrentUser
        ) {

            try {

                await initializeNexvoIdentity();

            } catch (error) {

                console.warn(
                    "NEXVO identity initialization failed:",
                    error
                );

            }

        }


        if (
            window.nexvoIdentity
        ) {

            updateCommentAvatar();

        }


        listenForComments();

    } catch (error) {

        console.error(
            "NEXVO video Firebase error:",
            error
        );

    }

}


/* =========================================
   COMMENT AVATAR
========================================= */

function updateCommentAvatar() {

    if (!commentAvatar) {
        return;
    }


    const identity =
        window.nexvoIdentity;


    if (
        identity &&
        identity.displayName
    ) {

        const firstLetter =
            identity.displayName
                .trim()
                .charAt(0)
                .toUpperCase();


        commentAvatar.textContent =
            firstLetter || "N";

    } else {

        commentAvatar.textContent =
            "N";

    }

}


/* =========================================
   FEED SWITCHING
========================================= */

function selectFeed(feedName) {

    currentFeed =
        feedName;


    videoTabs.forEach(
        function (tab) {

            tab.classList.toggle(
                "active",
                tab.dataset.feed ===
                    feedName
            );

        }
    );


    updateFeedContent();

}


function updateFeedContent() {

    if (!mainVideo) {
        return;
    }


    mainVideo.pause();


    mainVideo.removeAttribute(
        "src"
    );


    mainVideo.load();


    mainVideo.classList.remove(
        "visible"
    );


    if (videoPlaceholder) {

        videoPlaceholder.style.display =
            "flex";

    }


    if (placeholderTitle) {

        if (
            currentFeed ===
            "friends"
        ) {

            placeholderTitle.textContent =
                "Friends Videos";

        } else if (
            currentFeed ===
            "communities"
        ) {

            placeholderTitle.textContent =
                "Community Videos";

        } else {

            placeholderTitle.textContent =
                "NEXVO Video";

        }

    }


    if (placeholderText) {

        if (
            currentFeed ===
            "friends"
        ) {

            placeholderText.textContent =
                "Videos from your friends will appear here.";

        } else if (
            currentFeed ===
            "communities"
        ) {

            placeholderText.textContent =
                "Community videos will appear here.";

        } else {

            placeholderText.textContent =
                "Videos will appear here.";

        }

    }


    /*
        The real feed will later assign
        currentVideoId whenever a video
        is loaded.

        Example:

        setCurrentVideo({
            id: "video123"
        });
    */


    listenForComments();

}


/* =========================================
   SET CURRENT VIDEO
========================================= */

function setCurrentVideo(videoId) {

    if (!videoId) {
        return;
    }


    currentVideoId =
        String(videoId);


    videoLiked =
        false;


    updateLikeUI();


    listenForComments();

}


/* =========================================
   SEARCH
========================================= */

function openVideoSearchPanel() {

    if (!videoSearchPanel) {
        return;
    }


    videoSearchPanel.classList.add(
        "open"
    );


    videoSearchPanel.setAttribute(
        "aria-hidden",
        "false"
    );


    if (videoSearchInput) {

        setTimeout(
            function () {

                videoSearchInput.focus();

            },
            250
        );

    }

}


function closeVideoSearchPanel() {

    if (!videoSearchPanel) {
        return;
    }


    videoSearchPanel.classList.remove(
        "open"
    );


    videoSearchPanel.setAttribute(
        "aria-hidden",
        "true"
    );

}


function clearVideoSearchInput() {

    if (!videoSearchInput) {
        return;
    }


    videoSearchInput.value = "";


    renderSearchResults(
        ""
    );

}


function renderSearchResults(
    query
) {

    if (!videoSearchResults) {
        return;
    }


    const cleanQuery =
        query.trim();


    if (!cleanQuery) {

        videoSearchResults.innerHTML =
            "";

        return;

    }


    videoSearchResults.innerHTML =
        `
        <div class="search-empty-result">
            Search results for
            <strong>
                ${escapeHtml(cleanQuery)}
            </strong>
            will appear here.
        </div>
        `;

}


function escapeHtml(value) {

    return String(value)
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
   VIDEO ACTIONS
========================================= */

function toggleVideoActions() {

    videoActionsOpen =
        !videoActionsOpen;


    if (videoActionMenu) {

        videoActionMenu.classList.toggle(
            "open",
            videoActionsOpen
        );


        videoActionMenu.setAttribute(
            "aria-hidden",
            String(!videoActionsOpen)
        );

    }


    if (moreVideoActions) {

        moreVideoActions.setAttribute(
            "aria-expanded",
            String(videoActionsOpen)
        );

    }

}


function closeVideoActions() {

    videoActionsOpen =
        false;


    if (videoActionMenu) {

        videoActionMenu.classList.remove(
            "open"
        );


        videoActionMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    if (moreVideoActions) {

        moreVideoActions.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}


/* =========================================
   LIKE
========================================= */

function toggleLike() {

    videoLiked =
        !videoLiked;


    updateLikeUI();


    /*
        Real video likes can later be
        stored under:

        videoLikes/{videoId}/{uid}

        We keep this local until the
        actual video database is connected.
    */

}


function updateLikeUI() {

    if (videoLikeButton) {

        videoLikeButton.classList.toggle(
            "liked",
            videoLiked
        );

    }


    if (videoLikeIcon) {

        videoLikeIcon.textContent =
            videoLiked
                ? "♥"
                : "♡";

    }


    if (videoLikeCount) {

        videoLikeCount.textContent =
            videoLiked
                ? "1"
                : "0";

    }

}


/* =========================================
   COMMENTS
========================================= */

function openComments() {

    if (!commentsPanel) {
        return;
    }


    commentsOpen =
        true;


    commentsPanel.classList.add(
        "open"
    );


    commentsPanel.setAttribute(
        "aria-hidden",
        "false"
    );


    listenForComments();


    if (commentInput) {

        setTimeout(
            function () {

                commentInput.focus();

            },
            250
        );

    }

}


function closeCommentsPanel() {

    commentsOpen =
        false;


    if (!commentsPanel) {
        return;
    }


    commentsPanel.classList.remove(
        "open"
    );


    commentsPanel.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================
   LISTEN FOR COMMENTS
========================================= */

function listenForComments() {

    if (
        !commentsDatabase ||
        !currentVideoId
    ) {

        return;

    }


    if (
        commentsListener
    ) {

        commentsListener.off();

        commentsListener =
            null;

    }


    commentsListener =
        commentsDatabase
            .ref("videoComments")
            .child(
                currentVideoId
            );


    commentsListener.on(
        "value",
        function (snapshot) {

            const comments =
                [];


            snapshot.forEach(
                function (child) {

                    const data =
                        child.val();


                    if (data) {

                        comments.push({
                            id:
                                child.key,

                            ...data

                        });

                    }

                }
            );


            comments.sort(
                function (a, b) {

                    return (
                        (a.createdAt || 0) -
                        (b.createdAt || 0)
                    );

                }
            );


            renderComments(
                comments
            );

        }
    );

}


/* =========================================
   RENDER COMMENTS
========================================= */

function renderComments(
    comments
) {

    if (!commentsList) {
        return;
    }


    const existingComments =
        commentsList.querySelectorAll(
            ".comment-item"
        );


    existingComments.forEach(
        function (item) {

            item.remove();

        }
    );


    if (
        !comments ||
        comments.length === 0
    ) {

        if (commentsEmpty) {

            commentsEmpty.style.display =
                "flex";

        }

    } else {

        if (commentsEmpty) {

            commentsEmpty.style.display =
                "none";

        }


        comments.forEach(
            function (comment) {

                commentsList.appendChild(
                    createCommentElement(
                        comment
                    )
                );

            }
        );

    }


    updateCommentCount(
        comments
            ? comments.length
            : 0
    );

}


function createCommentElement(
    comment
) {

    const article =
        document.createElement(
            "article"
        );


    article.className =
        "comment-item";


    const avatar =
        document.createElement(
            "div"
        );


    avatar.className =
        "comment-user-avatar";


    const name =
        comment.displayName ||
        "NEXVO Member";


    avatar.textContent =
        name
            .trim()
            .charAt(0)
            .toUpperCase() ||
            "N";


    const content =
        document.createElement(
            "div"
        );


    content.className =
        "comment-content";


    const top =
        document.createElement(
            "div"
        );


    top.className =
        "comment-top";


    const userName =
        document.createElement(
            "strong"
        );


    userName.textContent =
        name;


    const time =
        document.createElement(
            "small"
        );


    time.textContent =
        formatCommentTime(
            comment.createdAt
        );


    top.appendChild(
        userName
    );


    top.appendChild(
        time
    );


    const message =
        document.createElement(
            "p"
        );


    message.textContent =
        comment.text ||
        "";


    const actions =
        document.createElement(
            "div"
        );


    actions.className =
        "comment-actions";


    const likeButton =
        document.createElement(
            "button"
        );


    likeButton.type =
        "button";


    likeButton.textContent =
        "♡ Like";


    likeButton.addEventListener(
        "click",
        function () {

            likeComment(
                comment.id,
                comment
            );

        }
    );


    actions.appendChild(
        likeButton
    );


    content.appendChild(
        top
    );


    content.appendChild(
        message
    );


    content.appendChild(
        actions
    );


    article.appendChild(
        avatar
    );


    article.appendChild(
        content
    );


    return article;

}


/* =========================================
   SEND COMMENT
========================================= */

async function sendComment() {

    if (!commentInput) {
        return;
    }


    const text =
        commentInput.value.trim();


    if (!text) {
        return;
    }


    if (
        !commentsDatabase
    ) {

        alert(
            "NEXVO comments are not connected yet."
        );

        return;

    }


    if (
        !window.nexvoCurrentUser
    ) {

        alert(
            "NEXVO is still connecting your account. Please try again."
        );

        return;

    }


    const identity =
        window.nexvoIdentity;


    const commentData = {

        uid:
            window.nexvoCurrentUser.uid,

        displayName:
            identity &&
            identity.displayName
                ? identity.displayName
                : "NEXVO Member",

        text:
            text,

        createdAt:
            firebase.database
                .ServerValue
                .TIMESTAMP

    };


    try {

        await commentsDatabase
            .ref("videoComments")
            .child(
                currentVideoId
            )
            .push(
                commentData
            );


        commentInput.value =
            "";


    } catch (error) {

        console.error(
            "Comment send error:",
            error
        );


        alert(
            "The comment could not be sent. Please try again."
        );

    }

}


/* =========================================
   COMMENT LIKE
========================================= */

function likeComment(
    commentId,
    comment
) {

    /*
        Comment likes are prepared for
        Firebase integration.

        The actual count will be added
        when the full video interaction
        system is connected.
    */


    const button =
        document.querySelector(
            `.comment-item[data-comment-id="${commentId}"]`
        );


    if (button) {

        button.classList.toggle(
            "liked"
        );

    }

}


/* =========================================
   COMMENT COUNT
========================================= */

function updateCommentCount(
    count
) {

    if (videoCommentCount) {

        videoCommentCount.textContent =
            String(count);

    }


    if (commentsHeaderCount) {

        commentsHeaderCount.textContent =
            count === 1
                ? "1 comment"
                : `${count} comments`;

    }

}


/* =========================================
   COMMENT TIME
========================================= */

function formatCommentTime(
    timestamp
) {

    if (!timestamp) {
        return "now";
    }


    const difference =
        Date.now() -
        Number(timestamp);


    const seconds =
        Math.floor(
            difference / 1000
        );


    if (seconds < 60) {

        return "now";

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    if (minutes < 60) {

        return `${minutes}m`;

    }


    const hours =
        Math.floor(
            minutes / 60
        );


    if (hours < 24) {

        return `${hours}h`;

    }


    const days =
        Math.floor(
            hours / 24
        );


    if (days < 7) {

        return `${days}d`;

    }


    return new Date(
        timestamp
    ).toLocaleDateString();

}


/* =========================================
   ME MENU
========================================= */

function openMeMenu() {

    meMenuOpen =
        true;


    if (!meMenu) {
        return;
    }


    meMenu.classList.add(
        "open"
    );


    meMenu.setAttribute(
        "aria-hidden",
        "false"
    );

}


function closeMeMenuPanel() {

    meMenuOpen =
        false;


    if (!meMenu) {
        return;
    }


    meMenu.classList.remove(
        "open"
    );


    meMenu.setAttribute(
        "aria-hidden",
        "true"
    );

}


/* =========================================
   CREATE / UPLOAD
========================================= */

function openVideoCreator() {

    window.location.href =
        "upload-video.html";

}


/* =========================================
   HOME
========================================= */

function goHome() {

    window.location.href =
        "home.html";

}


/* =========================================
   ME ACTIONS
========================================= */

function handleMeAction(
    action
) {

    if (
    action ===
    "videos"
) {

    window.location.href =
        "my-videos.html";

    return;

}

    if (action === "drafts") {
    window.location.href = "drafts.html";
    return;
}

    if (
        action ===
        "saved"
    ) {

        alert(
            "Saved videos will be connected next."
        );

        return;

    }


    if (
        action ===
        "activity"
    ) {

        alert(
            "Video activity will be connected next."
        );

    }

}


/* =========================================
   EVENTS
========================================= */

if (videoSearchButton) {

    videoSearchButton.addEventListener(
        "click",
        openVideoSearchPanel
    );

}


if (closeVideoSearch) {

    closeVideoSearch.addEventListener(
        "click",
        closeVideoSearchPanel
    );

}


if (clearVideoSearch) {

    clearVideoSearch.addEventListener(
        "click",
        clearVideoSearchInput
    );

}


if (videoSearchInput) {

    videoSearchInput.addEventListener(
        "input",
        function () {

            renderSearchResults(
                videoSearchInput.value
            );

        }
    );

}


videoTabs.forEach(
    function (tab) {

        tab.addEventListener(
            "click",
            function () {

                selectFeed(
                    tab.dataset.feed
                );

            }
        );

    }
);


if (moreVideoActions) {

    moreVideoActions.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            toggleVideoActions();

        }
    );

}


if (videoLikeButton) {

    videoLikeButton.addEventListener(
        "click",
        toggleLike
    );

}


if (videoCommentButton) {

    videoCommentButton.addEventListener(
        "click",
        openComments
    );

}


if (closeComments) {

    closeComments.addEventListener(
        "click",
        closeCommentsPanel
    );

}


if (commentForm) {

    commentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            sendComment();

        }
    );

}


if (videoCreateButton) {

    videoCreateButton.addEventListener(
        "click",
        openVideoCreator
    );

}


if (videoHomeButton) {

    videoHomeButton.addEventListener(
        "click",
        goHome
    );

}


if (videoMeButton) {

    videoMeButton.addEventListener(
        "click",
        openMeMenu
    );

}


if (closeMeMenu) {

    closeMeMenu.addEventListener(
        "click",
        closeMeMenuPanel
    );

}


document.querySelectorAll(
    ".me-menu-item"
).forEach(
    function (item) {

        item.addEventListener(
            "click",
            function () {

                handleMeAction(
                    item.dataset.meAction
                );

            }
        );

    }
);



/* =========================================
   OUTSIDE CLICK
========================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            videoActionsOpen &&
            videoActionMenu &&
            moreVideoActions &&
            !videoActionMenu.contains(
                event.target
            ) &&
            !moreVideoActions.contains(
                event.target
            )
        ) {

            closeVideoActions();

        }

    }
);



/* =========================================
   ESCAPE
========================================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key !==
            "Escape"
        ) {

            return;

        }


        closeVideoSearchPanel();

        closeVideoActions();

        closeCommentsPanel();

        closeMeMenuPanel();

    }
);



/* =========================================
   INITIALIZATION
========================================= */

selectFeed(
    "for-you"
);


initializeVideoFirebase();