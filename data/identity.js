/* =========================================
   NEXVO
   IDENTITY SYSTEM
========================================= */


/* =========================================
   STORAGE KEY
========================================= */

const NEXVO_IDENTITY_KEY =
    "nexvoIdentity";



/* =========================================
   DEFAULT IDENTITY
========================================= */

const DEFAULT_NEXVO_IDENTITY = {

    displayName: "",

    username: "",

    nexvoId: "",

    avatar: "",

    bio: "",

    createdAt: null

};



/* =========================================
   LOAD IDENTITY
========================================= */

function getNexvoIdentity() {

    try {

        const saved =
            localStorage.getItem(
                NEXVO_IDENTITY_KEY
            );


        if (!saved) {

            return {
                ...DEFAULT_NEXVO_IDENTITY
            };

        }


        return {

            ...DEFAULT_NEXVO_IDENTITY,

            ...JSON.parse(saved)

        };

    }

    catch (error) {

        console.error(
            "NEXVO identity could not be loaded:",
            error
        );


        return {
            ...DEFAULT_NEXVO_IDENTITY
        };

    }

}



/* =========================================
   SAVE IDENTITY
========================================= */

function saveNexvoIdentity(
    identity
) {

    const cleanIdentity = {

        ...DEFAULT_NEXVO_IDENTITY,

        ...identity

    };


    localStorage.setItem(
        NEXVO_IDENTITY_KEY,
        JSON.stringify(
            cleanIdentity
        )
    );


    return cleanIdentity;

}



/* =========================================
   GENERATE ID
========================================= */

function generateNexvoId() {

    const characters =
        "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";


    let code = "";


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const index =
            Math.floor(
                Math.random() *
                characters.length
            );


        code +=
            characters[index];

    }


    return "NX-" + code;

}



/* =========================================
   ENSURE ID
========================================= */

function ensureNexvoId() {

    const identity =
        getNexvoIdentity();


    if (
        identity.nexvoId
    ) {

        return identity;

    }


    identity.nexvoId =
        generateNexvoId();


    identity.createdAt =
        new Date().toISOString();


    return saveNexvoIdentity(
        identity
    );

}



/* =========================================
   USERNAME CLEANING
========================================= */

function cleanNexvoUsername(
    username
) {

    return String(
        username || ""
    )
        .trim()
        .toLowerCase()
        .replace(
            /^@/,
            ""
        )
        .replace(
            /[^a-z0-9_.]/g,
            ""
        );

}



/* =========================================
   USERNAME VALIDATION
========================================= */

function isValidNexvoUsername(
    username
) {

    const clean =
        cleanNexvoUsername(
            username
        );


    return /^[a-z0-9_.]{3,24}$/
        .test(clean);

}



/* =========================================
   UPDATE PROFILE
========================================= */

function updateNexvoIdentity(
    updates
) {

    const current =
        ensureNexvoId();


    const next = {

        ...current,

        ...updates

    };


    if (
        next.username
    ) {

        next.username =
            cleanNexvoUsername(
                next.username
            );

    }


    return saveNexvoIdentity(
        next
    );

}