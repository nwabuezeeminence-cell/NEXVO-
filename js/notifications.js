/* =========================================
   NEXVO
   NOTIFICATIONS SYSTEM
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const notificationsList =
    document.getElementById(
        "notificationsList"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


const markAllRead =
    document.getElementById(
        "markAllRead"
    );


const filterButtons =
    document.querySelectorAll(
        ".notification-filter"
    );


let currentFilter = "all";


/* =========================================
   BACK BUTTON
========================================= */

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "more.html";

        }
    );

}


/* =========================================
   NOTIFICATION ICON
========================================= */

function getNotificationIcon(type) {

    switch (type) {

        case "friend_request":
            return "👤";

        case "friend_added":
            return "🤝";

        case "message":
            return "💬";

        case "group":
            return "👥";

        case "community":
            return "🌐";

        case "call":
            return "📞";

        default:
            return "🔔";

    }

}


/* =========================================
   NOTIFICATION TIME
========================================= */

function getNotificationTime(timestamp) {

    if (!timestamp) {
        return "";
    }


    const difference =
        Date.now() - Number(timestamp);


    const minute =
        60 * 1000;

    const hour =
        60 * minute;

    const day =
        24 * hour;


    if (difference < minute) {
        return "Just now";
    }


    if (difference < hour) {

        return (
            Math.floor(
                difference / minute
            ) +
            " min ago"
        );

    }


    if (difference < day) {

        return (
            Math.floor(
                difference / hour
            ) +
            " hr ago"
        );

    }


    if (difference < 7 * day) {

        return (
            Math.floor(
                difference / day
            ) +
            " days ago"
        );

    }


    return new Date(
        timestamp
    ).toLocaleDateString();

}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeNotificationHTML(value) {

    return String(value || "")
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
   RENDER NOTIFICATIONS
========================================= */

function renderNotifications() {

    if (!notificationsList) {
        return;
    }


    const notifications =
        typeof getNexvoNotifications ===
        "function"
            ? getNexvoNotifications()
            : [];


    let visibleNotifications =
        notifications;


    if (
        currentFilter ===
        "unread"
    ) {

        visibleNotifications =
            notifications.filter(
                function (notification) {

                    return !notification.read;

                }
            );

    }


    /* =====================================
       EMPTY STATE
    ===================================== */

    if (
        visibleNotifications.length === 0
    ) {

        const title =
            currentFilter === "unread"
                ? "You're all caught up"
                : "No notifications yet";


        const message =
            currentFilter === "unread"
                ? "There are no unread notifications right now."
                : "Your NEXVO activity will appear here.";


        notificationsList.innerHTML = `

            <div class="notifications-empty">

                <div class="notifications-empty-icon">
                    🔔
                </div>

                <h2>
                    ${title}
                </h2>

                <p>
                    ${message}
                </p>

            </div>

        `;

        return;

    }


    /* =====================================
       BUILD LIST
    ===================================== */

    notificationsList.innerHTML =
        visibleNotifications
            .map(
                function (notification) {

                    const unreadClass =
                        notification.read
                            ? ""
                            : "unread";


                    const title =
                        escapeNotificationHTML(
                            notification.title ||
                            "NEXVO Notification"
                        );


                    const message =
                        escapeNotificationHTML(
                            notification.message ||
                            ""
                        );


                    const time =
                        getNotificationTime(
                            notification.createdAt
                        );


                    const icon =
                        getNotificationIcon(
                            notification.type
                        );


                    return `

                        <article
                            class="notification-card ${unreadClass}"
                            data-notification-id="${notification.id}"
                        >

                            <div class="notification-icon">
                                ${icon}
                            </div>


                            <div class="notification-content">

                                <h3 class="notification-title">
                                    ${title}
                                </h3>


                                <p class="notification-message">
                                    ${message}
                                </p>


                                <div class="notification-time">
                                    ${time}
                                </div>

                            </div>

                        </article>

                    `;

                }
            )
            .join("");

}


/* =========================================
   MARK ONE AS READ
========================================= */

function markNotificationAsRead(
    notificationId
) {

    if (
        typeof getNexvoNotifications !==
        "function" ||
        typeof saveNexvoNotifications !==
        "function"
    ) {

        return;

    }


    const notifications =
        getNexvoNotifications();


    const notification =
        notifications.find(
            function (item) {

                return String(item.id) ===
                    String(notificationId);

            }
        );


    if (!notification) {
        return;
    }


    notification.read = true;


    saveNexvoNotifications(
        notifications
    );

}


/* =========================================
   CLICK NOTIFICATION
========================================= */

if (notificationsList) {

    notificationsList.addEventListener(
        "click",
        function (event) {

            const card =
                event.target.closest(
                    ".notification-card"
                );


            if (!card) {
                return;
            }


            const notificationId =
                card.dataset.notificationId;


            markNotificationAsRead(
                notificationId
            );


            renderNotifications();

        }
    );

}


/* =========================================
   MARK ALL READ
========================================= */

if (markAllRead) {

    markAllRead.addEventListener(
        "click",
        function () {

            if (
                typeof getNexvoNotifications !==
                "function" ||
                typeof saveNexvoNotifications !==
                "function"
            ) {

                return;

            }


            const notifications =
                getNexvoNotifications();


            notifications.forEach(
                function (notification) {

                    notification.read = true;

                }
            );


            saveNexvoNotifications(
                notifications
            );


            renderNotifications();

        }
    );

}


/* =========================================
   FILTER BUTTONS
========================================= */

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


                currentFilter =
                    button.dataset.filter ||
                    "all";


                renderNotifications();

            }
        );

    }
);


/* =========================================
   INITIALIZE
========================================= */

function initializeNotificationsPage() {

    renderNotifications();

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

            initializeNotificationsPage();

        }
    );

}

else {

    initializeNotificationsPage();

}