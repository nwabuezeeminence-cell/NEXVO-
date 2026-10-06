/* =========================================
   NEXVO
   FIREBASE INITIALIZATION
========================================= */

window.firebaseApp =
    firebase.initializeApp(
        firebaseConfig
    );


window.nexvoDatabase =
    firebase.database();


window.nexvoAuth =
    firebase.auth();


var nexvoCurrentUser = null;

window.nexvoCurrentUser =
    nexvoCurrentUser;


/* =========================================
   INITIALIZE FIREBASE
========================================= */

async function initializeNexvoFirebase() {

    try {

        const result =
            await window.nexvoAuth
                .signInAnonymously();


        window.nexvoCurrentUser =
            result.user;


        console.log(
            "NEXVO Firebase user:",
            window.nexvoCurrentUser.uid
        );


        if (
            typeof initializeNexvoIdentity ===
            "function"
        ) {

            await initializeNexvoIdentity();

        }


        if (
            typeof initializeNexvoPresence ===
            "function"
        ) {

            initializeNexvoPresence();

        }


        return window.nexvoCurrentUser;


    } catch (error) {

        console.error(
            "NEXVO Firebase authentication failed:",
            error
        );

        throw error;

    }

}