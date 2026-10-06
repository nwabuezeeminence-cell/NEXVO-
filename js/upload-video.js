/* =========================================
   NEXVO
   VIDEO UPLOAD SYSTEM
   LOCAL VIDEO + DRAFT STORAGE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const uploadBackButton =
    document.getElementById("uploadBackButton");

const videoInput =
    document.getElementById("videoInput");

const videoPicker =
    document.getElementById("videoPicker");

const previewSection =
    document.getElementById("previewSection");

const videoPreview =
    document.getElementById("videoPreview");

const videoFileInfo =
    document.getElementById("videoFileInfo");

const removeVideoButton =
    document.getElementById("removeVideoButton");

const detailsSection =
    document.getElementById("detailsSection");

const videoTitle =
    document.getElementById("videoTitle");

const videoDescription =
    document.getElementById("videoDescription");

const descriptionCount =
    document.getElementById("descriptionCount");

const saveDraftButton =
    document.getElementById("saveDraftButton");

const shareVideoButton =
    document.getElementById("shareVideoButton");

const uploadedSection =
    document.getElementById("uploadedSection");

const uploadedVideoList =
    document.getElementById("uploadedVideoList");


/* =========================================
   STATE
========================================= */

let selectedVideoFile = null;
let previewUrl = null;


/* =========================================
   INDEXEDDB
========================================= */

const VIDEO_DB_NAME =
    "NEXVO_VIDEO_DB";

const VIDEO_DB_VERSION =
    1;

const VIDEO_STORE_NAME =
    "videos";

let videoDatabase = null;


/* =========================================
   OPEN DATABASE
========================================= */

function openVideoDatabase() {

    return new Promise(function(resolve, reject) {

        const request =
            indexedDB.open(
                VIDEO_DB_NAME,
                VIDEO_DB_VERSION
            );


        request.onupgradeneeded =
            function(event) {

                const database =
                    event.target.result;

                if (
                    !database.objectStoreNames.contains(
                        VIDEO_STORE_NAME
                    )
                ) {

                    database.createObjectStore(
                        VIDEO_STORE_NAME,
                        {
                            keyPath: "id"
                        }
                    );

                }

            };


        request.onsuccess =
            function(event) {

                videoDatabase =
                    event.target.result;

                resolve(videoDatabase);

            };


        request.onerror =
            function() {

                reject(
                    request.error ||
                    new Error(
                        "Unable to open video database."
                    )
                );

            };

    });

}


/* =========================================
   SAVE VIDEO TO DATABASE
========================================= */

function saveVideoRecord(videoData) {

    return new Promise(function(resolve, reject) {

        if (!videoDatabase) {

            reject(
                new Error(
                    "Video database is not ready."
                )
            );

            return;
        }


        const transaction =
            videoDatabase.transaction(
                VIDEO_STORE_NAME,
                "readwrite"
            );


        const store =
            transaction.objectStore(
                VIDEO_STORE_NAME
            );


        const request =
            store.put(videoData);


        request.onsuccess =
            function() {
                resolve(videoData);
            };


        request.onerror =
            function() {

                reject(
                    request.error ||
                    new Error(
                        "Unable to save video."
                    )
                );

            };

    });

}


/* =========================================
   SELECT VIDEO
========================================= */

function handleVideoSelection(event) {

    const files =
        event.target.files;

    if (
        !files ||
        !files.length
    ) {
        return;
    }


    const file =
        files[0];


    if (
        !file.type.startsWith("video/")
    ) {

        alert(
            "Please select a video file."
        );

        videoInput.value = "";

        return;
    }


    selectedVideoFile =
        file;


    if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
    }


    previewUrl =
        URL.createObjectURL(file);


    if (videoPreview) {

        videoPreview.src =
            previewUrl;

    }


    if (videoFileInfo) {

        videoFileInfo.textContent =
            file.name +
            " • " +
            formatFileSize(file.size);

    }


    if (previewSection) {
        previewSection.hidden = false;
    }


    if (detailsSection) {
        detailsSection.hidden = false;
    }


    if (uploadedSection) {
        uploadedSection.hidden = true;
    }

}


/* =========================================
   REMOVE VIDEO
========================================= */

function removeSelectedVideo() {

    selectedVideoFile =
        null;


    if (previewUrl) {

        URL.revokeObjectURL(
            previewUrl
        );

        previewUrl =
            null;

    }


    if (videoPreview) {

        videoPreview.pause();

        videoPreview.removeAttribute(
            "src"
        );

        videoPreview.load();

    }


    if (videoFileInfo) {
        videoFileInfo.textContent = "";
    }


    if (previewSection) {
        previewSection.hidden = true;
    }


    if (detailsSection) {
        detailsSection.hidden = true;
    }


    if (videoInput) {
        videoInput.value = "";
    }


    if (videoTitle) {
        videoTitle.value = "";
    }


    if (videoDescription) {
        videoDescription.value = "";
    }


    updateDescriptionCount();

}


/* =========================================
   DESCRIPTION COUNTER
========================================= */

function updateDescriptionCount() {

    if (!videoDescription ||
        !descriptionCount) {
        return;
    }


    descriptionCount.textContent =
        videoDescription.value.length;

}


/* =========================================
   CREATE VIDEO DATA
========================================= */

function createVideoRecord(status) {

    return {

        id:
            "local_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 8),

        title:
            videoTitle &&
            videoTitle.value.trim()
                ? videoTitle.value.trim()
                : "Untitled Video",

        description:
            videoDescription
                ? videoDescription.value.trim()
                : "",

        file:
            selectedVideoFile,

        fileName:
            selectedVideoFile
                ? selectedVideoFile.name
                : "",

        fileType:
            selectedVideoFile
                ? selectedVideoFile.type
                : "",

        fileSize:
            selectedVideoFile
                ? selectedVideoFile.size
                : 0,

        createdAt:
            Date.now(),

        status:
            status

    };

}


/* =========================================
   SAVE DRAFT
========================================= */

async function saveDraft() {

    if (!selectedVideoFile) {

        alert(
            "Choose a video before saving a draft."
        );

        return;

    }


    try {

        if (!videoDatabase) {
            await openVideoDatabase();
        }


        const draft =
            createVideoRecord(
                "draft"
            );


        await saveVideoRecord(
            draft
        );


        alert(
            "Draft saved on this device."
        );


        window.location.href =
            "drafts.html";


    } catch (error) {

        console.error(
            "NEXVO draft error:",
            error
        );


        alert(
            "The draft could not be saved."
        );

    }

}


/* =========================================
   SHARE VIDEO
========================================= */

async function shareVideo() {

    if (!selectedVideoFile) {

        alert(
            "Choose a video before sharing."
        );

        return;

    }


    try {

        if (!videoDatabase) {
            await openVideoDatabase();
        }


        const video =
            createVideoRecord(
                "published"
            );


        await saveVideoRecord(
            video
        );


        alert(
            "Video saved and added to My Videos."
        );


        window.location.href =
            "my-videos.html";


    } catch (error) {

        console.error(
            "NEXVO upload error:",
            error
        );


        alert(
            "The video could not be saved."
        );

    }

}


/* =========================================
   FILE SIZE
========================================= */

function formatFileSize(bytes) {

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
   BACK
========================================= */

function goBackFromUpload() {

    if (
        document.referrer &&
        document.referrer.includes(
            "video.html"
        )
    ) {

        window.location.href =
            "video.html";

        return;

    }


    window.location.href =
        "video.html";

}


/* =========================================
   EVENTS
========================================= */

if (videoInput) {

    videoInput.addEventListener(
        "change",
        handleVideoSelection
    );

}


if (removeVideoButton) {

    removeVideoButton.addEventListener(
        "click",
        removeSelectedVideo
    );

}


if (videoDescription) {

    videoDescription.addEventListener(
        "input",
        updateDescriptionCount
    );

}


if (saveDraftButton) {

    saveDraftButton.addEventListener(
        "click",
        saveDraft
    );

}


if (shareVideoButton) {

    shareVideoButton.addEventListener(
        "click",
        shareVideo
    );

}


if (uploadBackButton) {

    uploadBackButton.addEventListener(
        "click",
        goBackFromUpload
    );

}


/* =========================================
   INITIALIZE
========================================= */

async function initializeUploadPage() {

    updateDescriptionCount();


    try {

        await openVideoDatabase();

    } catch (error) {

        console.error(
            "NEXVO video database error:",
            error
        );

    }

}


initializeUploadPage();