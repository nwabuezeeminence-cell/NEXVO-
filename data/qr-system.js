/* =========================================
   NEXVO
   QR CORE SYSTEM
========================================= */


/*
 * This file contains ONLY reusable QR logic.
 *
 * It must NOT directly access page buttons,
 * profile elements, or addEventListener().
 */


/* =========================================
   QR PREFIX
========================================= */

const NEXVO_QR_PREFIX =
    "nexvo://connect/";



/* =========================================
   CREATE QR PAYLOAD
========================================= */

function createNexvoQRPayload() {

    const identity =
        ensureNexvoId();


    if (!identity.nexvoId) {

        throw new Error(
            "NEXVO ID is required."
        );

    }


    return (
        NEXVO_QR_PREFIX +
        encodeURIComponent(
            identity.nexvoId
        )
    );

}



/* =========================================
   READ NEXVO PAYLOAD
========================================= */

function readNexvoQRPayload(
    payload
) {

    if (
        typeof payload !==
        "string"
    ) {

        return null;

    }


    if (
        !payload.startsWith(
            NEXVO_QR_PREFIX
        )
    ) {

        return null;

    }


    const encodedId =
        payload.substring(
            NEXVO_QR_PREFIX.length
        );


    try {

        const nexvoId =
            decodeURIComponent(
                encodedId
            );


        if (!nexvoId) {

            return null;

        }


        return {

            type:
                "nexvo-connect",

            nexvoId:
                nexvoId

        };

    }

    catch (error) {

        console.error(
            "NEXVO: Invalid QR payload.",
            error
        );


        return null;

    }

}



/* =========================================
   VALIDATE NEXVO ID
========================================= */

function isValidNexvoId(
    nexvoId
) {

    if (
        typeof nexvoId !==
        "string"
    ) {

        return false;

    }


    return /^NX-[A-Z0-9]{10}$/
        .test(nexvoId);

}



/* =========================================
   GET ID FROM QR
========================================= */

function getNexvoIdFromQR(
    payload
) {

    const result =
        readNexvoQRPayload(
            payload
        );


    if (!result) {

        return null;

    }


    if (
        !isValidNexvoId(
            result.nexvoId
        )
    ) {

        return null;

    }


    return result.nexvoId;

}