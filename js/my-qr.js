/* =========================================
   NEXVO
   MY QR PAGE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const backButton =
    document.getElementById(
        "backButton"
    );


const qrAvatar =
    document.getElementById(
        "qrAvatar"
    );


const qrName =
    document.getElementById(
        "qrName"
    );


const qrUsername =
    document.getElementById(
        "qrUsername"
    );


const realQRCode =
    document.getElementById(
        "realQRCode"
    );


const qrNexvoId =
    document.getElementById(
        "qrNexvoId"
    );


const shareQRButton =
    document.getElementById(
        "shareQRButton"
    );


const refreshQRButton =
    document.getElementById(
        "refreshQRButton"
    );



/* =========================================
   LOAD PROFILE
========================================= */

function loadQRProfile() {

    const identity =
        ensureNexvoId();


    if (qrName) {

        qrName.textContent =
            identity.displayName ||
            "NEXVO Member";

    }


    if (qrUsername) {

        qrUsername.textContent =
            identity.username
                ? "@" +
                  identity.username
                : "@username";

    }


    if (qrNexvoId) {

        qrNexvoId.textContent =
            identity.nexvoId;

    }


    if (
        qrAvatar &&
        identity.avatar
    ) {

        qrAvatar.innerHTML = `

            <img
                src="${identity.avatar}"
                alt="Profile picture"
            >

        `;

    }

}



/* =========================================
   GENERATE QR
========================================= */

function generateQR() {

    if (!realQRCode) {

        return;

    }


    let payload;


    try {

        payload =
            createNexvoQRPayload();

    }

    catch (error) {

        console.error(
            "NEXVO: Could not create QR payload.",
            error
        );

        return;

    }


    realQRCode.innerHTML =
        "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        realQRCode.textContent =
            "QR unavailable";

        return;

    }


    new QRCode(
        realQRCode,
        {

            text:
                payload,

            width:
                250,

            height:
                250,

            correctLevel:
                QRCode.CorrectLevel.M

        }
    );

}



/* =========================================
   BACK
========================================= */

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            window.history.back();

        }
    );

}



/* =========================================
   REFRESH
========================================= */

if (refreshQRButton) {

    refreshQRButton.addEventListener(
        "click",
        function () {

            generateQR();

        }
    );

}



/* =========================================
   SHARE
========================================= */

if (shareQRButton) {

    shareQRButton.addEventListener(
        "click",
        async function () {

            const identity =
                ensureNexvoId();


            const shareText =
                "Connect with me on NEXVO: " +
                identity.nexvoId;


            if (
                navigator.share
            ) {

                try {

                    await navigator.share({

                        title:
                            "Connect on NEXVO",

                        text:
                            shareText

                    });

                }

                catch (error) {

                    /*
                     * Sharing was cancelled
                     * or unavailable.
                     */

                }

            }

            else {

                try {

                    await navigator.clipboard.writeText(
                        shareText
                    );


                    shareQRButton.textContent =
                        "Copied";


                    setTimeout(
                        function () {

                            shareQRButton.textContent =
                                "Share";

                        },
                        1500
                    );

                }

                catch (error) {

                    console.error(
                        "NEXVO: Could not share QR.",
                        error
                    );

                }

            }

        }
    );

}



/* =========================================
   START
========================================= */

loadQRProfile();

generateQR();