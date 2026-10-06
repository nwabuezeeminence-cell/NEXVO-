/* =========================================
   NEXVO
   DRAFTS
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const draftsBackButton =
    document.getElementById(
        "draftsBackButton"
    );

const draftsUploadButton =
    document.getElementById(
        "draftsUploadButton"
    );

const emptyDraftUploadButton =
    document.getElementById(
        "emptyDraftUploadButton"
    );

const draftsList =
    document.getElementById(
        "draftsList"
    );

const draftsEmpty =
    document.getElementById(
        "draftsEmpty"
    );


/* =========================================
   DATABASE
========================================= */

const DRAFT_DB_NAME =
    "NEXVO_VIDEO_DB";

const DRAFT_DB_VERSION =
    1;

const DRAFT_STORE_NAME =
    "videos";

let draftsDatabase = null;


/* =========================================
   OPEN DATABASE
========================================= */

function openDraftDatabase() {

    return new Promise(function(resolve, reject) {

        const request =
            indexedDB.open(
                DRAFT_DB_NAME,
                DRAFT_DB_VERSION
            );


        request.onupgradeneeded =
            function(event) {

                const database =
                    event.target.result;

                if (
                    !database.objectStoreNames.contains(
                        DRAFT_STORE_NAME
                    )
                ) {

                    database.createObjectStore(
                        DRAFT_STORE_NAME,
                        {
                            keyPath: "id"
                        }
                    );

                }

            };


        request.onsuccess =
            function(event) {

                draftsDatabase =
                    event.target.result;

                resolve(
                    draftsDatabase
                );

            };


        request.onerror =
            function() {

                reject(
                    request.error
                );

            };

    });

}


/* =========================================
   GET ALL VIDEOS
========================================= */

function getAllVideos() {

    return new Promise(function(resolve, reject) {

        const transaction =
            draftsDatabase.transaction(
                DRAFT_STORE_NAME,
                "readonly"
            );


        const store =
            transaction.objectStore(
                DRAFT_STORE_NAME
            );


        const request =
            store.getAll();


        request.onsuccess =
            function() {

                resolve(
                    request.result || []
                );

            };


        request.onerror =
            function() {

                reject(
                    request.error
                );

            };

    });

}


/* =========================================
   DELETE DRAFT
========================================= */

function deleteDraft(id) {

    return new Promise(function(resolve, reject) {

        const transaction =
            draftsDatabase.transaction(
                DRAFT_STORE_NAME,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                DRAFT_STORE_NAME
            );


        const request =
            store.delete(id);


        request.onsuccess =
            function() {
                resolve();
            };


        request.onerror =
            function() {

                reject(
                    request.error
                );

            };

    });

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDraftDate(timestamp) {

    if (!timestamp) {
        return "Saved recently";
    }


    const date =
        new Date(timestamp);


    return (
        "Saved " +
        date.toLocaleDateString(
            undefined,
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        )
    );

}


/* =========================================
   FORMAT SIZE
========================================= */

function formatDraftSize(bytes) {

    if (!bytes) {
        return "0 KB";
    }


    const units =
        [
            "Bytes",
            "KB",
            "MB",
            "GB"
        ];


    const index =
        Math.floor(
            Math.log(bytes) /
            Math.log(1024)
        );


    const size =
        bytes /
        Math.pow(
            1024,
            index
        );


    return (
        size.toFixed(
            index === 0 ? 0 : 1
        ) +
        " " +
        units[index]
    );

}


/* =========================================
   RENDER
========================================= */

function renderDrafts(videos) {

    const drafts =
        videos
            .filter(function(video) {

                return (
                    video &&
                    video.status === "draft"
                );

            })
            .sort(function(a, b) {

                return (
                    (b.createdAt || 0) -
                    (a.createdAt || 0)
                );

            });


    draftsList.innerHTML = "";


    if (!drafts.length) {

        draftsEmpty.hidden =
            false;

        return;

    }


    draftsEmpty.hidden =
        true;


    drafts.forEach(function(draft) {

        const card =
            document.createElement(
                "article"
            );

        card.className =
            "draft-card";


        const video =
            document.createElement(
                "video"
            );

        video.className =
            "draft-video";

        video.controls =
            true;

        video.playsInline =
            true;


        if (draft.file) {

            const url =
                URL.createObjectURL(
                    draft.file
                );

            video.src =
                url;


            video.addEventListener(
                "loadeddata",
                function() {

                    URL.revokeObjectURL(
                        url
                    );

                },
                {
                    once: true
                }
            );

        }


        const info =
            document.createElement(
                "div"
            );

        info.className =
            "draft-info";


        const title =
            document.createElement(
                "h2"
            );

        title.className =
            "draft-title";

        title.textContent =
            draft.title ||
            "Untitled Video";


        const description =
            document.createElement(
                "p"
            );

        description.className =
            "draft-description";

        description.textContent =
            draft.description ||
            "No description added.";


        const meta =
            document.createElement(
                "div"
            );

        meta.className =
            "draft-meta";

        meta.textContent =
            formatDraftDate(
                draft.createdAt
            ) +
            " • " +
            formatDraftSize(
                draft.fileSize
            );


        const actions =
            document.createElement(
                "div"
            );

        actions.className =
            "draft-actions";


        const continueButton =
            document.createElement(
                "button"
            );

        continueButton.type =
            "button";

        continueButton.className =
            "draft-action primary";

        continueButton.textContent =
            "Continue Editing";


        continueButton.addEventListener(
            "click",
            function() {

                /*
                 * For now we return to the
                 * upload screen.
                 *
                 * Full draft editing will
                 * be connected after the
                 * basic draft system is tested.
                 */

                window.location.href =
                    "upload-video.html";

            }
        );


        const deleteButton =
            document.createElement(
                "button"
            );

        deleteButton.type =
            "button";

        deleteButton.className =
            "draft-action delete";

        deleteButton.textContent =
            "Delete";


        deleteButton.addEventListener(
            "click",
            async function() {

                const confirmed =
                    confirm(
                        "Delete this draft?"
                    );


                if (!confirmed) {
                    return;
                }


                try {

                    await deleteDraft(
                        draft.id
                    );


                    loadDrafts();

                } catch (error) {

                    console.error(
                        "NEXVO draft delete error:",
                        error
                    );

                    alert(
                        "The draft could not be deleted."
                    );

                }

            }
        );


        actions.appendChild(
            continueButton
        );

        actions.appendChild(
            deleteButton
        );


        info.appendChild(
            title
        );

        info.appendChild(
            description
        );

        info.appendChild(
            meta
        );

        info.appendChild(
            actions
        );


        card.appendChild(
            video
        );

        card.appendChild(
            info
        );


        draftsList.appendChild(
            card
        );

    });

}


/* =========================================
   LOAD DRAFTS
========================================= */

async function loadDrafts() {

    try {

        const videos =
            await getAllVideos();


        renderDrafts(
            videos
        );

    } catch (error) {

        console.error(
            "NEXVO drafts error:",
            error
        );

        draftsList.innerHTML = "";

        draftsEmpty.hidden =
            false;

    }

}


/* =========================================
   NAVIGATION
========================================= */

function goBackToVideo() {

    window.location.href =
        "video.html";

}


function goToUpload() {

    window.location.href =
        "upload-video.html";

}


/* =========================================
   EVENTS
========================================= */

if (draftsBackButton) {

    draftsBackButton.addEventListener(
        "click",
        goBackToVideo
    );

}


if (draftsUploadButton) {

    draftsUploadButton.addEventListener(
        "click",
        goToUpload
    );

}


if (emptyDraftUploadButton) {

    emptyDraftUploadButton.addEventListener(
        "click",
        goToUpload
    );

}


/* =========================================
   INITIALIZE
========================================= */

async function initializeDraftsPage() {

    try {

        await openDraftDatabase();

        await loadDrafts();

    } catch (error) {

        console.error(
            "NEXVO drafts database error:",
            error
        );

    }

}


initializeDraftsPage();