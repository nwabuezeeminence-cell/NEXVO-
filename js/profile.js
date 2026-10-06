/* =========================================
   NEXVO
   PROFILE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const backButton =
    document.getElementById(
        "backButton"
    );


const editProfileButton =
    document.getElementById(
        "editProfileButton"
    );


const profileAvatar =
    document.getElementById(
        "profileAvatar"
    );


const profileName =
    document.getElementById(
        "profileName"
    );


const profileUsername =
    document.getElementById(
        "profileUsername"
    );


const profileBio =
    document.getElementById(
        "profileBio"
    );


const nexvoId =
    document.getElementById(
        "nexvoId"
    );


const copyIdButton =
    document.getElementById(
        "copyIdButton"
    );



/* =========================================
   LOAD PROFILE
========================================= */

function loadProfile() {

    const identity =
        ensureNexvoId();


    profileName.textContent =
        identity.displayName ||
        "NEXVO Member";


    profileUsername.textContent =
        identity.username
            ? "@" + identity.username
            : "@username";


    nexvoId.textContent =
        identity.nexvoId;


    profileBio.textContent =
        identity.bio || "";


    if (
        identity.avatar
    ) {

        profileAvatar.innerHTML = `

            <img
                src="${identity.avatar}"
                alt="Profile picture"
            >

        `;

    }

}


/* =========================================
   BACK
========================================= */

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            if (
                window.history.length > 1
            ) {

                window.history.back();

            } else {

                window.location.href =
                    "friends.html";

            }

        }
    );

}
/* =========================================
   EDIT
========================================= */

if (editProfileButton) {

    editProfileButton.addEventListener(
        "click",
        function () {

            /*
             * The full profile editor will be
             * created in the next profile step.
             */

            window.location.href =
                "edit-profile.html";

        }
    );

}



/* =========================================
   COPY ID
========================================= */

if (copyIdButton) {

    copyIdButton.addEventListener(
        "click",
        async function () {

            const identity =
                ensureNexvoId();


            try {

                await navigator.clipboard.writeText(
                    identity.nexvoId
                );


                copyIdButton.textContent =
                    "Copied";


                setTimeout(
                    function () {

                        copyIdButton.textContent =
                            "Copy";

                    },
                    1500
                );

            }

            catch (error) {

                console.error(
                    "Could not copy NEXVO ID:",
                    error
                );

            }

        }
    );

}



/* =========================================
   START
========================================= */

loadProfile();