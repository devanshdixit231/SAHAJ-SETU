document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // ELEMENTS
    // =========================

    const roleCards = document.querySelectorAll(".role-card");
    const loginForm = document.getElementById("loginForm");

    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    const loginButton = document.querySelector(".login-button");
    const loginMessage = document.getElementById("loginMessage");

    const forgotPassword = document.getElementById("forgotPassword");

    const emailInput = document.getElementById("email");


    // =========================
    // BACKEND API
    // =========================

    const API_URL = "http://localhost:5000/api/auth/login";


    // =========================
    // DEFAULT ROLE
    // =========================

    let selectedRole = "user";


    // =========================
    // ROLE SELECTION
    // =========================

    roleCards.forEach(function (card) {

        card.addEventListener("click", function () {

            roleCards.forEach(function (item) {
                item.classList.remove("active");
            });

            card.classList.add("active");

            selectedRole = card.dataset.role;

            if (selectedRole === "officer") {

                loginButton.textContent = "Sign In as Officer";

            } else {

                loginButton.textContent = "Sign In as User";

            }

            loginMessage.textContent = "";
        });
    });


    // =========================
    // SHOW / HIDE PASSWORD
    // =========================

    togglePassword.addEventListener("click", function () {

        if (passwordInput.type === "password") {

            passwordInput.type = "text";
            togglePassword.textContent = "Hide";

        } else {

            passwordInput.type = "password";
            togglePassword.textContent = "Show";

        }
    });


    // =========================
    // LOGIN
    // =========================

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();


        // =========================
        // BASIC VALIDATION
        // =========================

        if (email === "") {

            loginMessage.textContent =
                "Please enter your email address.";

            loginMessage.style.color = "#c0392b";

            emailInput.focus();

            return;
        }


        if (password === "") {

            loginMessage.textContent =
                "Please enter your password.";

            loginMessage.style.color = "#c0392b";

            passwordInput.focus();

            return;
        }


        // =========================
        // LOADING STATE
        // =========================

        loginMessage.textContent = "Signing in...";
        loginMessage.style.color = "#173b78";

        loginButton.disabled = true;
        loginButton.textContent = "Signing In...";


        try {

            // =========================
            // SEND LOGIN REQUEST
            // =========================

            const response = await fetch(API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    email: email,

                    password: password,

                    role: selectedRole

                })

            });


            const data = await response.json();


            // =========================
            // LOGIN FAILED
            // =========================

            if (!response.ok || !data.success) {

                loginMessage.textContent =
                    data.message || "Login failed. Please try again.";

                loginMessage.style.color = "#c0392b";

                loginButton.disabled = false;

                if (selectedRole === "officer") {
                    loginButton.textContent = "Sign In as Officer";
                } else {
                    loginButton.textContent = "Sign In as User";
                }

                return;
            }


            // =========================
            // SAVE JWT TOKEN
            // =========================

            localStorage.setItem(
                "sahajSetuToken",
                data.token
            );


            // =========================
            // SAVE USER DATA
            // =========================

            const userData = {

                id: data.user.id,

                name: data.user.name,

                email: data.user.email,

                role: data.user.role,

                phone: data.user.phone || "",

                department: data.user.department || "",

                loginTime: new Date().toISOString()

            };


            localStorage.setItem(
                "sahajSetuUser",
                JSON.stringify(userData)
            );


            // =========================
            // SUCCESS MESSAGE
            // =========================

            loginMessage.textContent =
                "Login successful! Redirecting...";

            loginMessage.style.color = "#16803c";


            // =========================
            // REDIRECT
            // =========================

            setTimeout(function () {

                if (data.user.role === "user") {

                    window.location.href = "dashboard.html";

                } else if (data.user.role === "officer") {

                    window.location.href = "officer-dashboard.html";

                }

            }, 500);


        } catch (error) {

            console.error("Login error:", error);

            loginMessage.textContent =
                "Unable to connect to the server. Please make sure the backend is running.";

            loginMessage.style.color = "#c0392b";

            loginButton.disabled = false;

            if (selectedRole === "officer") {
                loginButton.textContent = "Sign In as Officer";
            } else {
                loginButton.textContent = "Sign In as User";
            }

        }

    });


    // =========================
    // FORGOT PASSWORD
    // =========================

    forgotPassword.addEventListener("click", function (event) {

        event.preventDefault();

        loginMessage.textContent =
            "Password recovery will be available soon.";

        loginMessage.style.color = "#173b78";

    });

});