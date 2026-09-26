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

const createLessonButton = document.getElementById("createLessonButton");

if (createLessonButton) {
    createLessonButton.addEventListener("click", function () {
        window.location.href = "create-lesson.html";
    });
}


const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function () {

        alert("You have been logged out.");

        window.location.href = "login.html";

    });
}