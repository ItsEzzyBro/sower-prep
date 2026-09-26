const getStartedButton = document.getElementById("getStartedButton");

if (getStartedButton) {
    getStartedButton.addEventListener("click", function () {
        window.location.href = "login.html";
    });
}


const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        alert("Registration will be connected to Supabase soon!");

    });
}