/* =========================================
   NEXVO
   REAL QR SCANNER
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const closeScanner =
    document.getElementById(
        "closeScanner"
    );


const scannerStatus =
    document.getElementById(
        "scannerStatus"
    );


const scanResult =
    document.getElementById(
        "scanResult"
    );


const invalidResult =
    document.getElementById(
        "invalidResult"
    );


const resultName =
    document.getElementById(
        "resultName"
    );


const resultUsername =
    document.getElementById(
        "resultUsername"
    );


const resultNexvoId =
    document.getElementById(
        "resultNexvoId"
    );


const addScannedFriend =
    document.getElementById(
        "addScannedFriend"
    );


const scanAgain =
    document.getElementById(
        "scanAgain"
    );


const tryAgain =
    document.getElementById(
        "tryAgain"
    );



/* =========================================
   SCANNER
========================================= */

let scanner = null;

let scannerRunning = false;

let scannedIdentity = null;



/* =========================================
   RESET UI
========================================= */

function resetScannerUI() {

    scannerStatus.style.display =
        "block";


    scanResult.classList.remove(
        "active"
    );


    invalidResult.classList.remove(
        "active"
    );

}



/* =========================================
   STOP SCANNER
========================================= */

async function stopScanner() {

    if (
        scanner &&
        scannerRunning
    ) {

        try {

            await scanner.stop();

        }

        catch (error) {

            console.log(
                "Scanner stop:",
                error
            );

        }

        scannerRunning =
            false;

    }

}



/* =========================================
   START SCANNER
========================================= */

async function startScanner() {

    resetScannerUI();


    if (
        typeof Html5Qrcode ===
        "undefined"
    ) {

        showInvalid();

        return;

    }


    if (!scanner) {

        scanner =
            new Html5Qrcode(
                "reader"
            );

    }


    try {

        await scanner.start(

            {
                facingMode:
                    "environment"
            },

            {
                fps: 10,

                qrbox: {
                    width: 230,
                    height: 230
                }

            },

            handleQRCode,

            function () {

                /*
                 * QR not detected yet.
                 *
                 * We intentionally don't
                 * show an error for every frame.
                 */

            }

        );


        scannerRunning =
            true;

    }

    catch (error) {

        console.error(
            "Could not start camera:",
            error
        );


        scannerStatus.innerHTML = `

            <div class="status-icon">
                !
            </div>

            <h2>
                Camera unavailable
            </h2>

            <p>
                Please allow camera access
                and try again.
            </p>

        `;

    }

}



/* =========================================
   QR DETECTED
========================================= */

async function handleQRCode(
    decodedText
) {

    if (!decodedText) {

        return;

    }


    await stopScanner();


    const data =
        readNexvoQRPayload(
            decodedText
        );


    if (!data) {

        showInvalid();

        return;

    }


    if (
        !isValidNexvoId(
            data.nexvoId
        )
    ) {

        showInvalid();

        return;

    }


    scannedIdentity = {

        nexvoId:
            data.nexvoId,

        displayName:
            "NEXVO Member",

        username:
            ""

    };


    showScannedIdentity();

}



/* =========================================
   SHOW RESULT
========================================= */

function showScannedIdentity() {

    scannerStatus.style.display =
        "none";


    invalidResult.classList.remove(
        "active"
    );


    resultName.textContent =
        scannedIdentity.displayName;


    resultUsername.textContent =
        scannedIdentity.username
            ? "@" +
              scannedIdentity.username
            : "";


    resultNexvoId.textContent =
        scannedIdentity.nexvoId;


    scanResult.classList.add(
        "active"
    );

}



/* =========================================
   INVALID
========================================= */

function showInvalid() {

    scannerStatus.style.display =
        "none";


    scanResult.classList.remove(
        "active"
    );


    invalidResult.classList.add(
        "active"
    );

}



/* =========================================
   ADD FRIEND
========================================= */

addScannedFriend.addEventListener(
    "click",
    function () {

        if (
            !scannedIdentity
        ) {

            return;

        }


        const result =
            sendFriendRequest(
                scannedIdentity
            );


        if (
            result.success
        ) {

            addScannedFriend.textContent =
                "Request Sent";

            addScannedFriend.disabled =
                true;

        }

        else {

            addScannedFriend.textContent =
                result.message;

        }

    }
);

/* =========================================
   TRY AGAIN
========================================= */

tryAgain.addEventListener(
    "click",
    async function () {

        scannedIdentity =
            null;

        resetScannerUI();

        await startScanner();

    }
);



/* =========================================
   CLOSE
========================================= */

closeScanner.addEventListener(
    "click",
    async function () {

        await stopScanner();

        window.history.back();

    }
);



/* =========================================
   PAGE EXIT
========================================= */

window.addEventListener(
    "beforeunload",
    function () {

        stopScanner();

    }
);



/* =========================================
   START
========================================= */

startScanner();