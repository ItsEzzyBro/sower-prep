const getStartedButton = document.getElementById("getStartedButton");

if (getStartedButton) {
    getStartedButton.addEventListener("click", function () {
        window.location.href = "login.html";
    });
}


const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("registerEmail").value;
        const password = document.getElementById("registerPassword").value;

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name
                }
            }
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Account created successfully!");

        window.location.href = "login.html";

    });
}

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            alert(error.message);
            return;
        }

        alert("Login successful!");

        window.location.href = "dashboard.html";

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

    logoutButton.addEventListener("click", async function () {

        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            alert(error.message);
            return;
        }

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

const dashboardPage = document.getElementById("lessonList");

if (dashboardPage) {

    async function checkUser() {

        const { data: { user }, error } =
            await supabaseClient.auth.getUser();

        if (error || !user) {
            window.location.href = "login.html";
        }
    }

    checkUser();
}