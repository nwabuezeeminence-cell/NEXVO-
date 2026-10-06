/* =========================================
   NEXVO
   PROFILE SETUP
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const profileForm =
    document.getElementById(
        "profileForm"
    );

const displayName =
    document.getElementById(
        "displayName"
    );

const username =
    document.getElementById(
        "username"
    );

const bio =
    document.getElementById(
        "bio"
    );

const bioCount =
    document.getElementById(
        "bioCount"
    );

const usernameMessage =
    document.getElementById(
        "usernameMessage"
    );

const photoInput =
    document.getElementById(
        "photoInput"
    );

const photoPreview =
    document.getElementById(
        "photoPreview"
    );

const photoPlaceholder =
    document.getElementById(
        "photoPlaceholder"
    );

const skipProfile =
    document.getElementById(
        "skipProfile"
    );



/* =========================================
   LOAD ACCOUNT
========================================= */

const savedUser =
    JSON.parse(
        localStorage.getItem(
            "nexvoUser"
        )
    );


if (savedUser) {

    if (savedUser.name) {

        displayName.value =
            savedUser.name;

    }

}



/* =========================================
   PROFILE PHOTO
========================================= */

photoInput.addEventListener(
    "change",
    function () {

        const file =
            photoInput.files[0];

        if (!file) {

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                photoPreview.src =
                    event.target.result;

                photoPreview.style.display =
                    "block";

                photoPlaceholder.style.display =
                    "none";

            };


        reader.readAsDataURL(file);

    }
);



/* =========================================
   BIO COUNTER
========================================= */

bio.addEventListener(
    "input",
    function () {

        bioCount.textContent =
            bio.value.length;

    }
);



/* =========================================
   USERNAME CLEANING
========================================= */

username.addEventListener(
    "input",
    function () {

        username.value =
            username.value
                .toLowerCase()
                .replace(
                    /[^a-z0-9_.]/g,
                    ""
                );


        if (
            username.value.length < 3
        ) {

            usernameMessage.textContent =
                "Username must contain at least 3 characters.";

            usernameMessage.style.color =
                "#b0004f";

            return;

        }


        usernameMessage.textContent =
            "Username looks good.";

        usernameMessage.style.color =
            "#777";

    }
);



/* =========================================
   SAVE PROFILE
========================================= */

profileForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const name =
            displayName.value.trim();

        const user =
            username.value.trim();

        const bioText =
            bio.value.trim();


        if (name === "") {

            displayName.focus();

            return;

        }


        if (user.length < 3) {

            username.focus();

            return;

        }


        let currentUser =
            JSON.parse(
                localStorage.getItem(
                    "nexvoUser"
                )
            );


        if (!currentUser) {

            currentUser = {};

        }


        currentUser.name =
            name;

        currentUser.username =
            user;

        currentUser.bio =
            bioText;


        currentUser.profileComplete =
            true;


        /*
         * For this prototype we store
         * the selected image as a data URL.
         *
         * A real NEXVO backend will later
         * upload the image securely.
         */

        if (
            photoPreview.src &&
            photoPreview.style.display !== "none"
        ) {

            currentUser.profilePhoto =
                photoPreview.src;

        }


        localStorage.setItem(
            "nexvoUser",
            JSON.stringify(
                currentUser
            )
        );


        window.location.href =
            "home.html";

    }
);



/* =========================================
   SKIP PROFILE
========================================= */

skipProfile.addEventListener(
    "click",
    function () {

        let currentUser =
            JSON.parse(
                localStorage.getItem(
                    "nexvoUser"
                )
            );


        if (!currentUser) {

            currentUser = {};

        }


        currentUser.profileComplete =
            false;


        localStorage.setItem(
            "nexvoUser",
            JSON.stringify(
                currentUser
            )
        );


        window.location.href =
            "home.html";

    }
);