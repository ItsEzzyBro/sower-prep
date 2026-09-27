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

    lessonForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const title =
            document.getElementById("lessonTitle").value;

        const biblePassage =
            document.getElementById("biblePassage").value;

        const ageGroup =
            document.getElementById("ageGroup").value;

        const lessonDate =
            document.getElementById("lessonDate").value;

        const description =
            document.getElementById("description").value;

        const activities =
            document.getElementById("activities").value;

        const notes =
            document.getElementById("notes").value;


        const { data: { user } } =
            await supabaseClient.auth.getUser();


        if (!user) {

            alert("You must be logged in to create a lesson.");

            window.location.href = "login.html";

            return;
        }


        const { data, error } =
        await supabaseClient
        .from("lessons")
        .insert([
            {
                user_id: user.id,
                title: title,
                bible_passage: biblePassage,
                age_group: ageGroup,
                lesson_date: lessonDate,
                description: description,
                activities: activities,
                notes: notes
            }
        ]);


        if (error) {

            alert(error.message);

            return;
        }


        alert("Lesson saved successfully!");

        window.location.href = "dashboard.html";

    });
}

const dashboardPage = document.getElementById("lessonList");

if (dashboardPage) {

    async function loadDashboard() {

        const { data: { user }, error: userError } =
            await supabaseClient.auth.getUser();

        if (userError || !user) {
            window.location.href = "login.html";
            return;
        }

        const { data: lessons, error: lessonError } =
        await supabaseClient
        .from("lessons")
        .select("*")
        .eq("user_id", user.id)
        .order("lesson_date", { ascending: true });

        if (lessonError) {
            dashboardPage.innerHTML =
                "<p>Unable to load lessons.</p>";

            console.error(lessonError);

            return;
        }

        if (lessons.length === 0) {
            dashboardPage.innerHTML = `
                <p class="empty-message">
                    No lessons yet.
                    Create your first lesson to get started!
                </p>
            `;

            return;
        }

        dashboardPage.innerHTML = "";

        lessons.forEach(function (lesson) {

            const lessonCard = document.createElement("div");

            lessonCard.classList.add("lesson-card");

            lessonCard.innerHTML = `
                <h3>${lesson.title}</h3>

                <p>
                    <strong>Bible Passage:</strong>
                    ${lesson.bible_passage}
                </p>

                <p>
                    <strong>Age Group:</strong>
                    ${lesson.age_group}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${lesson.lesson_date}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${lesson.description}
                </p>
            `;

            dashboardPage.appendChild(lessonCard);
        });
    }

    loadDashboard();
}