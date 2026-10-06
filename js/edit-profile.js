/* =========================================
   NEXVO
   EDIT PROFILE
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const cancelButton =
    document.getElementById(
        "cancelButton"
    );


const saveButton =
    document.getElementById(
        "saveButton"
    );


const displayNameInput =
    document.getElementById(
        "displayName"
    );


const usernameInput =
    document.getElementById(
        "username"
    );


const bioInput =
    document.getElementById(
        "bio"
    );


const usernameMessage =
    document.getElementById(
        "usernameMessage"
    );


const characterCount =
    document.getElementById(
        "characterCount"
    );


const nexvoId =
    document.getElementById(
        "nexvoId"
    );


const saveMessage =
    document.getElementById(
        "saveMessage"
    );


const avatarButton =
    document.getElementById(
        "avatarButton"
    );


const avatarContent =
    document.getElementById(
        "avatarContent"
    );


const profilePhotoInput =
    document.getElementById(
        "profilePhotoInput"
    );



/* =========================================
   ORIGINAL DATA
========================================= */

const originalIdentity =
    ensureNexvoId();



/* =========================================
   PROFILE PHOTO STORAGE KEY
========================================= */

const PROFILE_PHOTO_KEY =
    "nexvoProfilePhoto";



/* =========================================
   LOAD FORM
========================================= */

function loadForm() {

    displayNameInput.value =
        originalIdentity.displayName || "";


    usernameInput.value =
        originalIdentity.username || "";


    bioInput.value =
        originalIdentity.bio || "";


    nexvoId.textContent =
        originalIdentity.nexvoId;


    updateCharacterCount();

    loadProfilePhoto();

}



/* =========================================
   CHARACTER COUNT
========================================= */

function updateCharacterCount() {

    characterCount.textContent =
        bioInput.value.length;

}


bioInput.addEventListener(
    "input",
    updateCharacterCount
);



/* =========================================
   USERNAME
========================================= */

function checkUsername() {

    const username =
        cleanNexvoUsername(
            usernameInput.value
        );


    if (!username) {

        usernameMessage.textContent =
            "Your username helps people find you.";

        usernameMessage.className = "";

        return false;

    }


    if (
        !isValidNexvoUsername(
            username
        )
    ) {

        usernameMessage.textContent =
            "Use 3–24 letters, numbers, underscores or dots.";

        usernameMessage.className =
            "error";

        return false;

    }


    usernameMessage.textContent =
        "Username looks good.";

    usernameMessage.className =
        "available";


    return true;

}


usernameInput.addEventListener(
    "input",
    checkUsername
);



/* =========================================
   SAVE
========================================= */

function saveProfile() {

    const displayName =
        displayNameInput.value.trim();


    const username =
        cleanNexvoUsername(
            usernameInput.value
        );


    const bio =
        bioInput.value.trim();


    /*
     * Display name is intentionally allowed
     * to be empty because profile completion
     * can happen later.
     */

    if (
        username &&
        !isValidNexvoUsername(
            username
        )
    ) {

        showMessage(
            "Please choose a valid username."
        );

        return;

    }


    updateNexvoIdentity({

        displayName,

        username,

        bio

    });


    showMessage(
        "Profile saved."
    );


    setTimeout(
        function () {

            window.location.href =
                "profile.html";

        },
        700
    );

}



/* =========================================
   MESSAGE
========================================= */

function showMessage(
    message
) {

    saveMessage.textContent =
        message;

    saveMessage.classList.add(
        "visible"
    );


    setTimeout(
        function () {

            saveMessage.classList.remove(
                "visible"
            );

        },
        2000
    );

}



/* =========================================
   CANCEL
========================================= */

cancelButton.addEventListener(
    "click",
    function () {

        window.history.back();

    }
);



/* =========================================
   SAVE BUTTON
========================================= */

saveButton.addEventListener(
    "click",
    saveProfile
);



/* =========================================
   OPEN PHOTO PICKER
========================================= */

avatarButton.addEventListener(
    "click",
    function () {

        profilePhotoInput.click();

    }
);



/* =========================================
   PHOTO SELECTED
========================================= */

profilePhotoInput.addEventListener(
    "change",
    function () {

        const file =
            profilePhotoInput.files[0];


        if (!file) {
            return;
        }


        /*
         * Make sure the selected file
         * is actually an image.
         */

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {

            showMessage(
                "Please choose an image."
            );

            profilePhotoInput.value = "";

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                const imageData =
                    event.target.result;


                /*
                 * Show the selected image.
                 */

                showProfilePhoto(
                    imageData
                );


                /*
                 * Save it locally so the
                 * picture remains available
                 * after leaving this page.
                 */

                try {

                    localStorage.setItem(
                        PROFILE_PHOTO_KEY,
                        imageData
                    );

                    showMessage(
                        "Profile picture updated."
                    );

                }

                catch (error) {

                    console.error(
                        "NEXVO: Could not save profile photo.",
                        error
                    );

                    showMessage(
                        "Picture selected, but could not be saved."
                    );

                }

            };


        reader.readAsDataURL(file);

    }
);



/* =========================================
   SHOW PROFILE PHOTO
========================================= */

function showProfilePhoto(
    imageData
) {

    avatarContent.innerHTML = "";


    const image =
        document.createElement(
            "img"
        );


    image.src =
        imageData;


    image.alt =
        "Profile picture";


    image.className =
        "profile-avatar-image";


    avatarContent.appendChild(
        image
    );

}



/* =========================================
   LOAD PROFILE PHOTO
========================================= */

function loadProfilePhoto() {

    const savedPhoto =
        localStorage.getItem(
            PROFILE_PHOTO_KEY
        );


    if (!savedPhoto) {
        return;
    }


    showProfilePhoto(
        savedPhoto
    );

}



/* =========================================
   START
========================================= */

loadForm();