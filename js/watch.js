/* =========================================
   NEXVO
   WATCH PAGE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const watchBackButton =
    document.getElementById(
        "watchBackButton"
    );

const watchSearchButton =
    document.getElementById(
        "watchSearchButton"
    );

const watchSearchSection =
    document.getElementById(
        "watchSearchSection"
    );

const watchSearchInput =
    document.getElementById(
        "watchSearchInput"
    );

const watchClearSearch =
    document.getElementById(
        "watchClearSearch"
    );

const watchTabs =
    document.querySelectorAll(
        ".watch-tab"
    );

const watchVideoList =
    document.getElementById(
        "watchVideoList"
    );

const watchEmptyState =
    document.getElementById(
        "watchEmptyState"
    );

const watchUploadButton =
    document.getElementById(
        "watchUploadButton"
    );


/* =========================================
   BACK
========================================= */

if (watchBackButton) {

    watchBackButton.addEventListener(
        "click",
        function () {

            if (
                window.history.length >
                1
            ) {

                window.history.back();

            } else {

                window.location.href =
                    "home.html";

            }

        }
    );

}


/* =========================================
   SEARCH TOGGLE
========================================= */

if (watchSearchButton) {

    watchSearchButton.addEventListener(
        "click",
        function () {

            if (!watchSearchSection) {
                return;
            }

            watchSearchSection
                .classList.toggle(
                    "open"
                );

            if (
                watchSearchSection
                    .classList
                    .contains("open") &&
                watchSearchInput
            ) {

                watchSearchInput.focus();

            }

        }
    );

}


/* =========================================
   CLEAR SEARCH
========================================= */

if (watchClearSearch) {

    watchClearSearch.addEventListener(
        "click",
        function () {

            if (!watchSearchInput) {
                return;
            }

            watchSearchInput.value = "";

            watchSearchInput.focus();

            renderWatchVideos();

        }
    );

}


/* =========================================
   TABS
========================================= */

watchTabs.forEach(
    function (tab) {

        tab.addEventListener(
            "click",
            function () {

                watchTabs.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                tab.classList.add(
                    "active"
                );


                renderWatchVideos();

            }
        );

    }
);


/* =========================================
   VIDEO DATA
========================================= */

const nexvoWatchVideos = [];


/* =========================================
   RENDER VIDEOS
========================================= */

function renderWatchVideos() {

    if (!watchVideoList) {
        return;
    }


    watchVideoList.innerHTML = "";


    /*
     * Videos will be connected to Firebase
     * later.
     *
     * For now, keep the Watch page empty
     * instead of showing fake content.
     */

    if (
        nexvoWatchVideos.length ===
        0
    ) {

        if (watchEmptyState) {

            watchEmptyState.style.display =
                "flex";

        }

        return;

    }


    if (watchEmptyState) {

        watchEmptyState.style.display =
            "none";

    }


    nexvoWatchVideos.forEach(
        function (video) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "video-card";


            card.innerHTML = `
                <div class="video-thumbnail">

                    <div class="video-play">
                        ▶
                    </div>

                </div>

                <div class="video-info">

                    <h3>
                        ${video.title}
                    </h3>

                    <p>
                        ${video.creator}
                    </p>

                </div>
            `;


            watchVideoList.appendChild(
                card
            );

        }
    );

}


/* =========================================
   UPLOAD
========================================= */

if (watchUploadButton) {

    watchUploadButton.addEventListener(
        "click",
        function () {

            alert(
                "Video uploading will be added next."
            );

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

function initializeWatchPage() {

    if (watchSearchSection) {

        watchSearchSection.classList.remove(
            "open"
        );

    }


    renderWatchVideos();

}


if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeWatchPage
    );

} else {

    initializeWatchPage();

}