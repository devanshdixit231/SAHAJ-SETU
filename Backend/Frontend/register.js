document.addEventListener("DOMContentLoaded", function () {

    const roleCards = document.querySelectorAll(".role-card");
    const registerForm = document.getElementById("registerForm");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");

    const departmentGroup = document.getElementById("departmentGroup");
    const departmentInput = document.getElementById("department");

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const togglePassword = document.getElementById("togglePassword");
    const toggleConfirmPassword =
        document.getElementById("toggleConfirmPassword");

    const termsCheckbox = document.getElementById("terms");

    const registerButton =
        document.querySelector(".register-button");

    const registerMessage =
        document.getElementById("registerMessage");

    const termsLink =
        document.getElementById("termsLink");


    // Backend API
    const API_URL =
        "http://localhost:5000/api/auth/register";


    // Default role
    let selectedRole = "user";


    /* =========================
       ROLE SELECTION
    ========================== */

    roleCards.forEach(function (card) {

        card.addEventListener("click", function () {

            // Remove active from all cards
            roleCards.forEach(function (item) {
                item.classList.remove("active");
            });

            // Activate clicked card
            card.classList.add("active");

            // Get selected role
            selectedRole = card.dataset.role;


            // Officer selected
            if (selectedRole === "officer") {

                departmentGroup.style.display = "block";

                departmentInput.required = true;

                registerButton.textContent =
                    "Create Officer Account";

            }

            // Entrepreneur selected
            else {

                departmentGroup.style.display = "none";

                departmentInput.required = false;

                departmentInput.value = "";

                registerButton.textContent =
                    "Create Entrepreneur Account";
            }


            // Clear previous message
            registerMessage.textContent = "";
        });

    });


    /* =========================
       PASSWORD TOGGLE
    ========================== */

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";

            togglePassword.textContent = "Hide";

        } else {

            passwordInput.type = "password";

            togglePassword.textContent = "Show";
        }

    });


    /* =========================
       CONFIRM PASSWORD TOGGLE
    ========================== */

    toggleConfirmPassword.addEventListener("click", function () {

        if (confirmPasswordInput.type === "password") {

            confirmPasswordInput.type = "text";

            toggleConfirmPassword.textContent = "Hide";

        } else {

            confirmPasswordInput.type = "password";

            toggleConfirmPassword.textContent = "Show";
        }

    });


    /* =========================
       PHONE VALIDATION
    ========================== */

    phoneInput.addEventListener("input", function () {

        // Only numbers
        phoneInput.value =
            phoneInput.value.replace(/\D/g, "");

    });


    /* =========================
       REGISTRATION
    ========================== */

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();

        const password = passwordInput.value;
        const confirmPassword =
            confirmPasswordInput.value;

        const department =
            departmentInput.value.trim();


        /* =========================
           BASIC VALIDATION
        ========================== */

        if (name === "") {

            showMessage(
                "Please enter your full name.",
                "error"
            );

            nameInput.focus();

            return;
        }


        if (email === "") {

            showMessage(
                "Please enter your email address.",
                "error"
            );

            emailInput.focus();

            return;
        }


        if (phone.length !== 10) {

            showMessage(
                "Please enter a valid 10-digit phone number.",
                "error"
            );

            phoneInput.focus();

            return;
        }


        if (
            selectedRole === "officer" &&
            department === ""
        ) {

            showMessage(
                "Please enter your department.",
                "error"
            );

            departmentInput.focus();

            return;
        }


        if (password.length < 8) {

            showMessage(
                "Password must contain at least 8 characters.",
                "error"
            );

            passwordInput.focus();

            return;
        }


        if (password !== confirmPassword) {

            showMessage(
                "Passwords do not match.",
                "error"
            );

            confirmPasswordInput.focus();

            return;
        }


        if (!termsCheckbox.checked) {

            showMessage(
                "Please accept the Terms & Conditions.",
                "error"
            );

            return;
        }


        /* =========================
           LOADING STATE
        ========================== */

        registerButton.disabled = true;

        registerButton.textContent =
            "Creating Account...";

        showMessage(
            "Creating your account...",
            "info"
        );


        /* =========================
           API REQUEST
        ========================== */

        try {

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    name: name,

                    email: email,

                    password: password,

                    role: selectedRole,

                    phone: phone,

                    department:
                        selectedRole === "officer"
                            ? department
                            : ""

                })

            });


            const data = await response.json();


            /* =========================
               ERROR
            ========================== */

            if (!response.ok || !data.success) {

                showMessage(
                    data.message ||
                    "Registration failed. Please try again.",
                    "error"
                );

                resetButton();

                return;
            }


            /* =========================
               SUCCESS
            ========================== */

            showMessage(
                "Account created successfully! Redirecting to login...",
                "success"
            );


            registerButton.textContent =
                "Account Created";


            // Redirect to login
            setTimeout(function () {

                window.location.href = "login.html";

            }, 1500);


        } catch (error) {

            console.error(
                "Registration error:",
                error
            );


            showMessage(
                "Unable to connect to the server. Please make sure the backend is running.",
                "error"
            );


            resetButton();
        }

    });


    /* =========================
       MESSAGE FUNCTION
    ========================== */

    function showMessage(message, type) {

        registerMessage.textContent = message;


        if (type === "success") {

            registerMessage.style.color =
                "#16803c";

        } else if (type === "error") {

            registerMessage.style.color =
                "#c0392b";

        } else {

            registerMessage.style.color =
                "#173b78";
        }

    }


    /* =========================
       RESET BUTTON
    ========================== */

    function resetButton() {

        registerButton.disabled = false;


        if (selectedRole === "officer") {

            registerButton.textContent =
                "Create Officer Account";

        } else {

            registerButton.textContent =
                "Create Entrepreneur Account";
        }

    }


    /* =========================
       TERMS LINK
    ========================== */

    termsLink.addEventListener("click", function (event) {

        event.preventDefault();

        showMessage(
            "Terms & Conditions will be available soon.",
            "info"
        );

    });

});