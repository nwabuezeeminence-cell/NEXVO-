/* =========================================
   NEXVO
   MY VIDEOS
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const myVideosBackButton =
    document.getElementById(
        "myVideosBackButton"
    );

const myVideosUploadButton =
    document.getElementById(
        "myVideosUploadButton"
    );

const emptyUploadButton =
    document.getElementById(
        "emptyUploadButton"
    );

const myVideosList =
    document.getElementById(
        "myVideosList"
    );

const myVideosEmpty =
    document.getElementById(
        "myVideosEmpty"
    );


/* =========================================
   DATABASE
========================================= */

const VIDEO_DB_NAME =
    "NEXVO_VIDEO_DB";

const VIDEO_DB_VERSION =
    1;

const VIDEO_STORE =
    "videos";


/* =========================================
   OPEN DATABASE
========================================= */

function openVideoDatabase() {

    return new Promise(
        function (resolve, reject) {

            const request =
                indexedDB.open(
                    VIDEO_DB_NAME,
                    VIDEO_DB_VERSION
                );


            request.onupgradeneeded =
                function (event) {

                    const database =
                        event.target.result;


                    if (
                        !database.objectStoreNames.contains(
                            VIDEO_STORE
                        )
                    ) {

                        database.createObjectStore(
                            VIDEO_STORE,
                            {
                                keyPath: "id"
                            }
                        );

                    }

                };


            request.onsuccess =
                function () {

                    resolve(
                        request.result
                    );

                };


            request.onerror =
                function () {

                    reject(
                        request.error
                    );

                };

        }
    );

}


/* =========================================
   GET VIDEOS
========================================= */

async function getMyVideos() {

    const database =
        await openVideoDatabase();


    return new Promise(
        function (resolve, reject) {

            const transaction =
                database.transaction(
                    VIDEO_STORE,
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    VIDEO_STORE
                );


            const request =
                store.getAll();


            request.onsuccess =
                function () {

                    database.close();


                    const videos =
                        request.result || [];


                    videos.sort(
                        function (a, b) {

                            return (
                                (b.createdAt || 0) -
                                (a.createdAt || 0)
                            );

                        }
                    );


                    resolve(
                        videos
                    );

                };


            request.onerror =
                function () {

                    database.close();

                    reject(
                        request.error
                    );

                };

        }
    );

}


/* =========================================
   DELETE VIDEO
========================================= */

async function deleteMyVideo(
    videoId
) {

    const database =
        await openVideoDatabase();


    return new Promise(
        function (resolve, reject) {

            const transaction =
                database.transaction(
                    VIDEO_STORE,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    VIDEO_STORE
                );


            store.delete(
                videoId
            );


            transaction.oncomplete =
                function () {

                    database.close();

                    resolve();

                };


            transaction.onerror =
                function () {

                    database.close();

                    reject(
                        transaction.error
                    );

                };

        }
    );

}


/* =========================================
   RENDER
========================================= */

async function renderMyVideos() {

    if (!myVideosList) {
        return;
    }


    try {

        const videos =
            await getMyVideos();


        myVideosList.innerHTML =
            "";


        if (
            !videos.length
        ) {

            if (myVideosEmpty) {

                myVideosEmpty.style.display =
                    "flex";

            }

            return;

        }


        if (myVideosEmpty) {

            myVideosEmpty.style.display =
                "none";

        }


        videos.forEach(
            function (videoData) {

                myVideosList.appendChild(
                    createVideoCard(
                        videoData
                    )
                );

            }
        );

    } catch (error) {

        console.error(
            "NEXVO My Videos error:",
            error
        );

    }

}


/* =========================================
   CREATE CARD
========================================= */

function createVideoCard(
    videoData
) {

    const card =
        document.createElement(
            "article"
        );


    card.className =
        "my-video-card";


    const player =
        document.createElement(
            "video"
        );


    player.className =
        "my-video-player";


    player.controls =
        true;

    player.playsInline =
        true;

    player.preload =
        "metadata";


    const objectUrl =
        URL.createObjectURL(
            videoData.file
        );


    player.src =
        objectUrl;


    player.addEventListener(
        "emptied",
        function () {

            URL.revokeObjectURL(
                objectUrl
            );

        },
        {
            once: true
        }
    );


    const info =
        document.createElement(
            "div"
        );


    info.className =
        "my-video-info";


    const title =
        document.createElement(
            "h2"
        );


    title.textContent =
        videoData.title ||
        "Untitled video";


    const description =
        document.createElement(
            "p"
        );


    description.textContent =
        videoData.description ||
        "No description added.";


    const date =
        document.createElement(
            "span"
        );


    date.className =
        "my-video-date";


    date.textContent =
        formatDate(
            videoData.createdAt
        );


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.textContent =
        "Delete";


    deleteButton.style.marginTop =
        "10px";


    deleteButton.style.border =
        "1px solid #f0d9e3";


    deleteButton.style.borderRadius =
        "10px";


    deleteButton.style.padding =
        "7px 10px";


    deleteButton.style.background =
        "#fff0f6";


    deleteButton.style.color =
        "#a3164d";


    deleteButton.addEventListener(
        "click",
        async function () {

            const confirmed =
                confirm(
                    "Delete this video from this device?"
                );


            if (!confirmed) {
                return;
            }


            try {

                await deleteMyVideo(
                    videoData.id
                );


                URL.revokeObjectURL(
                    objectUrl
                );


                await renderMyVideos();

            } catch (error) {

                console.error(
                    "Delete video error:",
                    error
                );

                alert(
                    "The video could not be deleted."
                );

            }

        }
    );


    info.appendChild(
        title
    );


    info.appendChild(
        description
    );


    info.appendChild(
        date
    );


    info.appendChild(
        deleteButton
    );


    card.appendChild(
        player
    );


    card.appendChild(
        info
    );


    return card;

}


/* =========================================
   DATE
========================================= */

function formatDate(
    timestamp
) {

    if (!timestamp) {
        return "Saved just now";
    }


    return new Date(
        timestamp
    ).toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================
   NAVIGATION
========================================= */

if (myVideosBackButton) {

    myVideosBackButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "video.html";

        }
    );

}


function openUploader() {

    window.location.href =
        "upload-video.html";

}


if (myVideosUploadButton) {

    myVideosUploadButton.addEventListener(
        "click",
        openUploader
    );

}


if (emptyUploadButton) {

    emptyUploadButton.addEventListener(
        "click",
        openUploader
    );

}


/* =========================================
   INITIALIZE
========================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        renderMyVideos
    );

} else {

    renderMyVideos();

}