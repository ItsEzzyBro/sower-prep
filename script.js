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

const backToDashboardButton =
    document.getElementById("backToDashboardButton");

if (backToDashboardButton) {
    backToDashboardButton.addEventListener("click", function () {
        window.location.href = "dashboard.html";
    });
}


const cancelLessonButton =
    document.getElementById("cancelLessonButton");

if (cancelLessonButton) {
    cancelLessonButton.addEventListener("click", function () {
        window.location.href = "dashboard.html";
    });
}

const lessonForm = document.getElementById("lessonForm");

if (lessonForm) {
    lessonForm.addEventListener("submit", function (event) {

        event.preventDefault();

        alert("Lesson form submitted! We will connect this to the database next.");

    });
}