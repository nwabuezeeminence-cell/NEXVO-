/* =========================================
   NEXVO
   AUTHENTICATION CONTROLLER
========================================= */


/* =========================================
   ELEMENTS
========================================= */

const authWelcome =
    document.getElementById(
        "authWelcome"
    );


const signupView =
    document.getElementById(
        "signupView"
    );


const loginView =
    document.getElementById(
        "loginView"
    );


const createAccountButton =
    document.getElementById(
        "createAccountButton"
    );


const loginButton =
    document.getElementById(
        "loginButton"
    );


const switchToLogin =
    document.getElementById(
        "switchToLogin"
    );


const switchToSignup =
    document.getElementById(
        "switchToSignup"
    );


const backButton =
    document.getElementById(
        "backButton"
    );


const signupForm =
    document.getElementById(
        "signupForm"
    );


const loginForm =
    document.getElementById(
        "loginForm"
    );


const signupMessage =
    document.getElementById(
        "signupMessage"
    );


const loginMessage =
    document.getElementById(
        "loginMessage"
    );


/* =========================================
   CURRENT VIEW
========================================= */

let currentAuthView =
    "welcome";


/* =========================================
   SHOW VIEW
========================================= */

function showAuthView(view) {

    authWelcome.classList.remove(
        "active"
    );

    signupView.classList.remove(
        "active"
    );

    loginView.classList.remove(
        "active"
    );


    if (view === "welcome") {

        authWelcome.classList.add(
            "active"
        );

    }


    else if (view === "signup") {

        signupView.classList.add(
            "active"
        );

    }


    else if (view === "login") {

        loginView.classList.add(
            "active"
        );

    }


    currentAuthView =
        view;


    clearMessages();

}


/* =========================================
   CLEAR MESSAGES
========================================= */

function clearMessages() {

    if (signupMessage) {

        signupMessage.textContent =
            "";

    }


    if (loginMessage) {

        loginMessage.textContent =
            "";

    }

}


/* =========================================
   CREATE ACCOUNT
========================================= */

if (createAccountButton) {

    createAccountButton.addEventListener(
        "click",
        function () {

            showAuthView(
                "signup"
            );

        }
    );

}


/* =========================================
   LOGIN
========================================= */

if (loginButton) {

    loginButton.addEventListener(
        "click",
        function () {

            showAuthView(
                "login"
            );

        }
    );

}


/* =========================================
   SWITCH TO LOGIN
========================================= */

if (switchToLogin) {

    switchToLogin.addEventListener(
        "click",
        function () {

            showAuthView(
                "login"
            );

        }
    );

}


/* =========================================
   SWITCH TO SIGNUP
========================================= */

if (switchToSignup) {

    switchToSignup.addEventListener(
        "click",
        function () {

            showAuthView(
                "signup"
            );

        }
    );

}


/* =========================================
   BACK BUTTON
========================================= */

if (backButton) {

    backButton.addEventListener(
        "click",
        function () {

            if (
                currentAuthView ===
                "welcome"
            ) {

                window.location.href =
                    "onboarding.html";

            }

            else {

                showAuthView(
                    "welcome"
                );

            }

        }
    );

}


/* =========================================
   PASSWORD VISIBILITY
========================================= */

const passwordToggles =
    document.querySelectorAll(
        ".password-toggle"
    );


passwordToggles.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const targetId =
                    button.dataset.target;


                const input =
                    document.getElementById(
                        targetId
                    );


                if (!input) {

                    return;

                }


                if (
                    input.type ===
                    "password"
                ) {

                    input.type =
                        "text";

                    button.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                }

                else {

                    input.type =
                        "password";

                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    }
);


/* =========================================
   SIGNUP
========================================= */

if (signupForm) {

    signupForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const name =
                document
                    .getElementById(
                        "signupName"
                    )
                    .value
                    .trim();


            const contact =
                document
                    .getElementById(
                        "signupContact"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "signupPassword"
                    )
                    .value;


            if (
                name.length < 2
            ) {

                signupMessage.textContent =
                    "Please enter your name.";

                return;

            }


            if (
                contact.length < 3
            ) {

                signupMessage.textContent =
                    "Please enter your email or phone number.";

                return;

            }


            if (
                password.length < 6
            ) {

                signupMessage.textContent =
                    "Your password should be at least 6 characters.";

                return;

            }


            /*
                TEMPORARY ACCOUNT CREATION

                This does NOT create a real
                online account yet.

                The real authentication system
                will be connected later.
            */

            const temporaryUser = {

                name:
                    name,

                contact:
                    contact,

                createdAt:
                    new Date().toISOString()

            };


            localStorage.setItem(
                "nexvoUser",
                JSON.stringify(
                    temporaryUser
                )
            );


            localStorage.setItem(
                "nexvoAuthenticated",
                "true"
            );


            /*
                Next stage:

                Profile setup will go here.

                The user is already a member,
                so profile completion can happen
                later.
            */

            window.location.href =
                "profile-setup.html";

        }
    );

}


/* =========================================
   LOGIN
========================================= */

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const contact =
                document
                    .getElementById(
                        "loginContact"
                    )
                    .value
                    .trim();


            const password =
                document
                    .getElementById(
                        "loginPassword"
                    )
                    .value;


            if (
                contact.length < 3
            ) {

                loginMessage.textContent =
                    "Please enter your email or phone number.";

                return;

            }


            if (
                password.length < 1
            ) {

                loginMessage.textContent =
                    "Please enter your password.";

                return;

            }


            /*
                Temporary login.

                Real server authentication
                will replace this later.
            */

            localStorage.setItem(
                "nexvoAuthenticated",
                "true"
            );


            window.location.href =
                "home.html";

        }
    );

}


/* =========================================
   FORGOT PASSWORD
========================================= */

const forgotPasswordButton =
    document.getElementById(
        "forgotPasswordButton"
    );


if (forgotPasswordButton) {

    forgotPasswordButton.addEventListener(
        "click",
        function () {

            loginMessage.textContent =
                "Password recovery will be available when the NEXVO account system is connected.";

        }
    );

}


/* =========================================
   INITIALIZE
========================================= */

showAuthView(
    "welcome"
);