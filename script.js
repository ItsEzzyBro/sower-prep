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


// ========================================
// CREATE LESSON
// ========================================

const createPage =
    window.location.pathname.includes("create-lesson.html");

if (createPage) {

    document.addEventListener("submit", async function (event) {

        if (event.target.id !== "lessonForm") {
            return;
        }

        event.preventDefault();


        // Make sure the user is logged in

        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();


        if (userError || !user) {

            alert("Please log in before creating a lesson.");

            window.location.href = "login.html";

            return;
        }


        // Get the selected ministry

        const ministry =
            document.getElementById("ministry")?.value;


        // Get common lesson fields

        const title =
            document.getElementById("lessonTitle")?.value.trim();

        const lessonDate =
            document.getElementById("lessonDate")?.value;

        const ageGroup =
            document.getElementById("ageGroup")?.value || "2–5";

        const week =
            document.getElementById("week")?.value.trim();

        const biblePassage =
            document.getElementById("biblePassage")?.value.trim();


        // Get curriculum-specific fields

        const bibleStory =
            document.getElementById("bibleStory")?.value.trim();

        const storySummary =
            document.getElementById("storySummary")?.value.trim();

        const keyQuestion =
            document.getElementById("keyQuestion")?.value.trim();

        const bottomLine =
            document.getElementById("bottomLine")?.value.trim();

        const storyPoint =
            document.getElementById("storyPoint")?.value.trim();

        const memoryVerse =
            document.getElementById("memoryVerse")?.value.trim();

        const christConnection =
            document.getElementById("christConnection")?.value.trim();

        const activities =
            document.getElementById("activities")?.value.trim();

        const schedule =
            document.getElementById("schedule")?.value.trim();

        const reviewQuestions =
            document.getElementById("reviewQuestions")?.value.trim();

        const discussionQuestions =
            document.getElementById("discussionQuestions")?.value.trim();

        const prayer =
            document.getElementById("prayer")?.value.trim();

        const takeHome =
            document.getElementById("takeHome")?.value.trim();

        const notes =
            document.getElementById("notes")?.value.trim();


        // Create the curriculum content object

        const lessonContent = {

            week: week,

            bible_story: bibleStory,

            bible_references: biblePassage,

            story_summary: storySummary,

            key_question: keyQuestion,

            bottom_line: bottomLine,

            story_point: storyPoint,

            memory_verse: memoryVerse,

            christ_connection: christConnection,

            activities: activities,

            suggested_schedule: schedule,

            review_questions: reviewQuestions,

            discussion_questions: discussionQuestions,

            prayer: prayer,

            take_home: takeHome,

            teacher_notes: notes

        };


        // Save the lesson

        const { data, error } = await supabaseClient

            .from("lessons")

            .insert([
                {
                    user_id: user.id,

                    title: title,

                    bible_passage: biblePassage,

                    ministry: ministry,

                    age_group: ageGroup,

                    lesson_date: lessonDate,

                    description: storySummary,

                    activities: activities,

                    notes: notes,

                    lesson_content: lessonContent
                }
            ])

            .select();


        // Check for database error

        if (error) {

            console.error("Create lesson error:", error);

            alert(
                "There was a problem saving your lesson:\n\n" +
                error.message
            );

            return;
        }


        // Make sure the lesson was actually saved

        if (!data || data.length === 0) {

            alert("The lesson was not saved.");

            return;
        }


        // Success!

        alert("Lesson saved successfully! 🎉");

        window.location.href = "dashboard.html";

    });


    // ========================================
    // CANCEL BUTTON
    // ========================================

    document.addEventListener("click", function (event) {

        if (event.target.id === "cancelLessonButton") {

            window.location.href = "dashboard.html";

        }

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

        const welcomeMessage =
        document.getElementById("welcomeMessage");

        if (welcomeMessage) {
            const teacherName =
                user.user_metadata?.name || "Teacher";

            welcomeMessage.textContent =
                `Welcome, ${teacherName}! 👋`;
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

            const content = lesson.lesson_content || {};

            
        lessonCard.innerHTML = `
            <h3>${lesson.title}</h3>

            <span class="ministry-badge">
                ${lesson.ministry || "Ministry"}
            </span>

            <div class="lesson-info">

                <p>
                    <strong>Age Group:</strong>
                    ${lesson.age_group || "Not specified"}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${lesson.lesson_date || "Not specified"}
                </p>

                <p>
                    <strong>Week:</strong>
                    ${content.week || "Not specified"}
                </p>

                <p>
                    <strong>Bible Story:</strong>
                    ${content.bible_story || lesson.title}
                </p>

                <p>
                    <strong>Bible References:</strong>
                    ${content.bible_references || lesson.bible_passage || "Not specified"}
                </p>

                <p>
                    <strong>Bottom Line:</strong>
                    ${content.bottom_line || "Not specified"}
                </p>

                <p>
                    <strong>Memory Verse:</strong>
                    ${content.memory_verse || "Not specified"}
                </p>

            </div>

            <div class="lesson-buttons">

                <button
                    class="edit-button"
                    data-id="${lesson.id}"
                >
                    Edit
                </button>

                <button
                    class="delete-button"
                    data-id="${lesson.id}"
                >
                    Delete
                </button>

            </div>
        `;

            dashboardPage.appendChild(lessonCard);

            const deleteButton =
            lessonCard.querySelector(".delete-button");

            deleteButton.addEventListener("click", async function () {

            const confirmed = confirm(
                "Are you sure you want to delete this lesson?"
            );

            if (!confirmed) {
                return;
            }

            const { data, error } = await supabaseClient
                .from("lessons")
                .delete()
                .eq("id", lesson.id)
                .eq("user_id", user.id)
                .select();

            if (error) {
                alert(error.message);
                console.error(error);
                return;
            }

            if (!data || data.length === 0) {
                alert("The lesson was not deleted from the database.");
                console.log("Delete returned no rows:", data);
                return;
            }

            alert("Lesson deleted successfully!");

            lessonCard.remove();

            });

            const editButton =
            lessonCard.querySelector(".edit-button");

            editButton.addEventListener("click", function () {

            window.location.href =
                `edit-lesson.html?id=${lesson.id}`;

            });
        });
    }

    loadDashboard();
}

const editForm =
    document.getElementById("lessonForm");

if (
    editForm &&
    window.location.pathname.includes("edit-lesson.html")
) {

    loadLesson();
}

async function loadLesson() {

    const params =
        new URLSearchParams(window.location.search);

    const lessonId = params.get("id");

    if (!lessonId) return;

    const { data: { user } } =
        await supabaseClient.auth.getUser();

    const { data: lesson, error } =
        await supabaseClient
            .from("lessons")
            .select("*")
            .eq("id", lessonId)
            .eq("user_id", user.id)
            .single();

    if (error) {
        alert(error.message);
        return;
    }

    document.getElementById("lessonTitle").value =
        lesson.title;

    document.getElementById("biblePassage").value =
        lesson.bible_passage;

    document.getElementById("ageGroup").value =
        lesson.age_group;

    document.getElementById("lessonDate").value =
        lesson.lesson_date;

    document.getElementById("description").value =
        lesson.description;

    document.getElementById("activities").value =
        lesson.activities;

    document.getElementById("notes").value =
        lesson.notes;
}

const editPage =
    window.location.pathname.includes("edit-lesson.html");

if (editPage) {

    const params = new URLSearchParams(window.location.search);
    const lessonId = params.get("id");

    const ministryForm =
        document.getElementById("ministryForm");

    const ministryDisplay =
        document.getElementById("editMinistryDisplay");


    async function loadLessonForEditing() {

        if (!lessonId) {

            ministryForm.innerHTML = `
                <div class="empty-message">
                    <p>No lesson was selected.</p>
                </div>
            `;

            return;
        }


        // Check that the user is logged in

        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();


        if (userError || !user) {

            window.location.href = "login.html";

            return;
        }


        // Get the lesson from Supabase

        const {
            data: lesson,
            error
        } = await supabaseClient
            .from("lessons")
            .select("*")
            .eq("id", lessonId)
            .eq("user_id", user.id)
            .single();


        if (error) {

            console.error(
                "Load lesson error:",
                error
            );

            ministryForm.innerHTML = `
                <div class="empty-message">
                    <p>
                        There was a problem loading this lesson.
                    </p>
                </div>
            `;

            return;
        }


        if (!lesson) {

            ministryForm.innerHTML = `
                <div class="empty-message">
                    <p>
                        Lesson not found.
                    </p>
                </div>
            `;

            return;
        }


        console.log(
            "Lesson loaded for editing:",
            lesson
        );


        // Display the ministry

        ministryDisplay.innerHTML = `
            <div class="ministry-badge">
                ${lesson.ministry || "Ministry"}
            </div>
        `;


        // Get the saved curriculum information

        const content =
            lesson.lesson_content || {};


        /*
         * For now, we are building the
         * Calvary Kids 2–5 edit form.
         */

        if (lesson.ministry === "Calvary Kids — 2–5") {

            ministryForm.innerHTML = `

                <form id="lessonForm">

                    <h3 class="form-section-title">
                        🌈 Calvary Kids — 2–5
                    </h3>

                    <p class="form-section-description">
                        Update your Calvary Kids 2–5 lesson.
                    </p>


                    <div class="form-section">

                        <h4>Lesson Information</h4>

                        <label for="lessonTitle">
                            Lesson Title
                        </label>

                        <input
                            type="text"
                            id="lessonTitle"
                            value="${lesson.title || ""}"
                            required
                        >


                        <label for="lessonDate">
                            Lesson Date
                        </label>

                        <input
                            type="date"
                            id="lessonDate"
                            value="${lesson.lesson_date || ""}"
                            required
                        >


                        <label for="week">
                            Week
                        </label>

                        <input
                            type="text"
                            id="week"
                            value="${content.week || ""}"
                        >

                    </div>


                    <div class="form-section">

                        <h4>Bible Story</h4>

                        <label for="biblePassage">
                            Bible References
                        </label>

                        <input
                            type="text"
                            id="biblePassage"
                            value="${content.bible_references || lesson.bible_passage || ""}"
                            required
                        >


                        <label for="bibleStory">
                            Bible Story
                        </label>

                        <input
                            type="text"
                            id="bibleStory"
                            value="${content.bible_story || ""}"
                        >


                        <label for="storySummary">
                            Bible Story Summary
                        </label>

                        <textarea
                            id="storySummary"
                            rows="5"
                        >${content.story_summary || lesson.description || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Teaching Points</h4>

                        <label for="keyQuestion">
                            Key Question
                        </label>

                        <input
                            type="text"
                            id="keyQuestion"
                            value="${content.key_question || ""}"
                        >


                        <label for="bottomLine">
                            Bottom Line
                        </label>

                        <textarea
                            id="bottomLine"
                            rows="3"
                        >${content.bottom_line || ""}</textarea>


                        <label for="storyPoint">
                            Story Point
                        </label>

                        <textarea
                            id="storyPoint"
                            rows="3"
                        >${content.story_point || ""}</textarea>


                        <label for="memoryVerse">
                            Memory Verse
                        </label>

                        <textarea
                            id="memoryVerse"
                            rows="3"
                        >${content.memory_verse || ""}</textarea>


                        <label for="christConnection">
                            Christ Connection
                        </label>

                        <textarea
                            id="christConnection"
                            rows="5"
                        >${content.christ_connection || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Activities</h4>

                        <label for="activities">
                            Activities
                        </label>

                        <textarea
                            id="activities"
                            rows="6"
                        >${content.activities || lesson.activities || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Suggested Schedule</h4>

                        <label for="schedule">
                            Lesson Schedule
                        </label>

                        <textarea
                            id="schedule"
                            rows="6"
                        >${content.suggested_schedule || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Bible Story Review</h4>

                        <label for="reviewQuestions">
                            Review Questions
                        </label>

                        <textarea
                            id="reviewQuestions"
                            rows="5"
                        >${content.review_questions || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Prayer</h4>

                        <label for="prayer">
                            Prayer
                        </label>

                        <textarea
                            id="prayer"
                            rows="5"
                        >${content.prayer || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Take Home</h4>

                        <label for="takeHome">
                            Parent / Take-Home Notes
                        </label>

                        <textarea
                            id="takeHome"
                            rows="5"
                        >${content.take_home || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Teacher Notes</h4>

                        <label for="notes">
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            rows="5"
                        >${content.teacher_notes || lesson.notes || ""}</textarea>

                    </div>


                    <div class="form-buttons">

                        <button
                            type="button"
                            id="cancelLessonButton"
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            Update Lesson
                        </button>

                    </div>

                </form>
            `;

        }

        else if (lesson.ministry === "Calvary Kids — K–3") {

            ministryForm.innerHTML = `

                <form id="lessonForm">

                    <input
                        type="hidden"
                        id="ageGroup"
                        value="K–3"
                    >

                    <h3 class="form-section-title">
                        🌈 Calvary Kids — K–3
                    </h3>

                    <p class="form-section-description">
                        Update your Calvary Kids K–3 lesson.
                    </p>


                    <div class="form-section">

                        <h4>Lesson Information</h4>

                        <label for="lessonTitle">
                            Lesson Title
                        </label>

                        <input
                            type="text"
                            id="lessonTitle"
                            value="${lesson.title || ""}"
                            required
                        >

                        <label for="lessonDate">
                            Lesson Date
                        </label>

                        <input
                            type="date"
                            id="lessonDate"
                            value="${lesson.lesson_date || ""}"
                            required
                        >

                        <label for="week">
                            Week
                        </label>

                        <input
                            type="text"
                            id="week"
                            value="${content.week || ""}"
                        >

                    </div>


                    <div class="form-section">

                        <h4>Bible Story</h4>

                        <label for="bibleStory">
                            Bible Story
                        </label>

                        <input
                            type="text"
                            id="bibleStory"
                            value="${content.bible_story || ""}"
                        >

                        <label for="biblePassage">
                            Bible References
                        </label>

                        <input
                            type="text"
                            id="biblePassage"
                            value="${content.bible_references || lesson.bible_passage || ""}"
                            required
                        >

                        <label for="storySummary">
                            Bible Story Summary
                        </label>

                        <textarea
                            id="storySummary"
                            rows="5"
                        >${content.story_summary || lesson.description || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Teaching Points</h4>

                        <label for="bottomLine">
                            Bottom Line
                        </label>

                        <textarea
                            id="bottomLine"
                            rows="3"
                        >${content.bottom_line || ""}</textarea>

                        <label for="storyPoint">
                            Story Point
                        </label>

                        <textarea
                            id="storyPoint"
                            rows="3"
                        >${content.story_point || ""}</textarea>

                        <label for="memoryVerse">
                            Memory Verse
                        </label>

                        <textarea
                            id="memoryVerse"
                            rows="3"
                        >${content.memory_verse || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Discussion Questions</h4>

                        <label for="discussionQuestions">
                            Discussion Questions
                        </label>

                        <textarea
                            id="discussionQuestions"
                            rows="7"
                        >${content.discussion_questions || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Activities</h4>

                        <label for="activities">
                            Activities
                        </label>

                        <textarea
                            id="activities"
                            rows="7"
                        >${content.activities || lesson.activities || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Review the Story</h4>

                        <label for="reviewQuestions">
                            Review Questions
                        </label>

                        <textarea
                            id="reviewQuestions"
                            rows="6"
                        >${content.review_questions || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Take Home</h4>

                        <label for="takeHome">
                            Take-Home Information
                        </label>

                        <textarea
                            id="takeHome"
                            rows="5"
                        >${content.take_home || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Closing Prayer</h4>

                        <label for="prayer">
                            Prayer
                        </label>

                        <textarea
                            id="prayer"
                            rows="5"
                        >${content.prayer || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Teacher Notes</h4>

                        <label for="notes">
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            rows="5"
                        >${content.teacher_notes || lesson.notes || ""}</textarea>

                    </div>


                    <div class="form-buttons">

                        <button
                            type="button"
                            id="cancelLessonButton"
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            Update Lesson
                        </button>

                    </div>

                </form>
            `;
        }

        else if (lesson.ministry === "The 45") {

            ministryForm.innerHTML = `

                <form id="lessonForm">

                    <input
                        type="hidden"
                        id="ageGroup"
                        value="The 45"
                    >

                    <h3 class="form-section-title">
                        4️⃣5️⃣ The 45
                    </h3>

                    <p class="form-section-description">
                        Update your The 45 Small Group lesson.
                    </p>


                    <div class="form-section">

                        <h4>Lesson Information</h4>

                        <label for="lessonTitle">
                            Lesson Title
                        </label>

                        <input
                            type="text"
                            id="lessonTitle"
                            value="${lesson.title || ""}"
                            required
                        >


                        <label for="lessonDate">
                            Lesson Date
                        </label>

                        <input
                            type="date"
                            id="lessonDate"
                            value="${lesson.lesson_date || ""}"
                            required
                        >


                        <label for="week">
                            Week
                        </label>

                        <input
                            type="text"
                            id="week"
                            value="${content.week || ""}"
                        >

                    </div>


                    <div class="form-section">

                        <h4>Bible Story</h4>

                        <label for="bibleStory">
                            Bible Story
                        </label>

                        <input
                            type="text"
                            id="bibleStory"
                            value="${content.bible_story || ""}"
                        >


                        <label for="biblePassage">
                            Bible References
                        </label>

                        <input
                            type="text"
                            id="biblePassage"
                            value="${content.bible_references || lesson.bible_passage || ""}"
                            required
                        >


                        <label for="storySummary">
                            Bible Story Summary
                        </label>

                        <textarea
                            id="storySummary"
                            rows="6"
                        >${content.story_summary || lesson.description || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Memory Verse</h4>

                        <label for="memoryVerse">
                            Memory Verse
                        </label>

                        <textarea
                            id="memoryVerse"
                            rows="4"
                        >${content.memory_verse || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Discussion Questions</h4>

                        <label for="discussionQuestions">
                            Discussion Questions
                        </label>

                        <textarea
                            id="discussionQuestions"
                            rows="8"
                        >${content.discussion_questions || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Review the Story</h4>

                        <label for="reviewQuestions">
                            Review Questions
                        </label>

                        <textarea
                            id="reviewQuestions"
                            rows="8"
                        >${content.review_questions || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Activities</h4>

                        <label for="activities">
                            Activities
                        </label>

                        <textarea
                            id="activities"
                            rows="8"
                        >${content.activities || lesson.activities || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Prayer</h4>

                        <label for="prayer">
                            Prayer
                        </label>

                        <textarea
                            id="prayer"
                            rows="6"
                        >${content.prayer || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Take Home</h4>

                        <label for="takeHome">
                            Take-Home Information
                        </label>

                        <textarea
                            id="takeHome"
                            rows="6"
                        >${content.take_home || ""}</textarea>

                    </div>


                    <div class="form-section">

                        <h4>Teacher Notes</h4>

                        <label for="notes">
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            rows="6"
                        >${content.teacher_notes || lesson.notes || ""}</textarea>

                    </div>


                    <div class="form-buttons">

                        <button
                            type="button"
                            id="cancelLessonButton"
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            Update Lesson
                        </button>

                    </div>

                </form>
            `;
        }
    }


    loadLessonForEditing();
}

if (editPage) {

    document.addEventListener("submit", async function (event) {

        if (event.target.id !== "lessonForm") {
            return;
        }

        event.preventDefault();


        // Get the lesson ID from the URL

        const params =
            new URLSearchParams(window.location.search);

        const lessonId =
            params.get("id");


        // Check the logged-in user

        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser();


        if (userError || !user) {

            alert("Please log in before editing a lesson.");

            window.location.href = "login.html";

            return;
        }


        // Get the existing lesson

        const {
            data: existingLesson,
            error: lessonError
        } = await supabaseClient
            .from("lessons")
            .select("*")
            .eq("id", lessonId)
            .eq("user_id", user.id)
            .single();


        if (lessonError || !existingLesson) {

            console.error(
                "Lesson lookup error:",
                lessonError
            );

            alert("The lesson could not be found.");

            return;
        }


        // Get the updated values

        const title =
            document.getElementById("lessonTitle")?.value.trim();

        const lessonDate =
            document.getElementById("lessonDate")?.value;

        const week =
            document.getElementById("week")?.value.trim();

        const biblePassage =
            document.getElementById("biblePassage")?.value.trim();

        const bibleStory =
            document.getElementById("bibleStory")?.value.trim();

        const storySummary =
            document.getElementById("storySummary")?.value.trim();

        const keyQuestion =
            document.getElementById("keyQuestion")?.value.trim();

        const bottomLine =
            document.getElementById("bottomLine")?.value.trim();

        const storyPoint =
            document.getElementById("storyPoint")?.value.trim();

        const memoryVerse =
            document.getElementById("memoryVerse")?.value.trim();

        const christConnection =
            document.getElementById("christConnection")?.value.trim();

        const activities =
            document.getElementById("activities")?.value.trim();

        const schedule =
            document.getElementById("schedule")?.value.trim();

        const reviewQuestions =
            document.getElementById("reviewQuestions")?.value.trim();

        const discussionQuestions =
            document.getElementById("discussionQuestions")?.value.trim();

        const prayer =
            document.getElementById("prayer")?.value.trim();

        const takeHome =
            document.getElementById("takeHome")?.value.trim();

        const notes =
            document.getElementById("notes")?.value.trim();


        // Put the curriculum information
        // back into lesson_content

        const lessonContent = {

            week: week,

            bible_story: bibleStory,

            bible_references: biblePassage,

            story_summary: storySummary,

            key_question: keyQuestion,

            bottom_line: bottomLine,

            story_point: storyPoint,

            memory_verse: memoryVerse,

            christ_connection: christConnection,

            activities: activities,

            suggested_schedule: schedule,

            review_questions: reviewQuestions,

            discussion_questions: discussionQuestions,

            prayer: prayer,

            take_home: takeHome,

            teacher_notes: notes
        };


        // Update the lesson in Supabase

        const {
            data,
            error
        } = await supabaseClient
            .from("lessons")
            .update({

                title: title,

                bible_passage: biblePassage,

                lesson_date: lessonDate,

                description: storySummary,

                activities: activities,

                notes: notes,

                lesson_content: lessonContent

            })
            .eq("id", lessonId)
            .eq("user_id", user.id)
            .select();


        if (error) {

            console.error(
                "Update lesson error:",
                error
            );

            alert(
                "There was a problem updating your lesson:\n\n" +
                error.message
            );

            return;
        }


        if (!data || data.length === 0) {

            alert(
                "The lesson was not updated."
            );

            return;
        }


        alert(
            "Lesson updated successfully! 🎉"
        );


        // Return to the dashboard

        window.location.href =
            "dashboard.html";

    });


    // Cancel button

    document.addEventListener("click", function (event) {

        if (
            event.target.id ===
            "cancelLessonButton"
        ) {

            window.location.href =
                "dashboard.html";
        }

    });

}

// ========================================
// MINISTRY-SPECIFIC LESSON FORM
// ========================================

const ministrySelector = document.getElementById("ministry");
const ministryForm = document.getElementById("ministryForm");

if (ministrySelector && ministryForm) {

    ministrySelector.addEventListener("change", function () {

        const selectedMinistry = ministrySelector.value;

        if (selectedMinistry === "") {

            ministryForm.innerHTML = `
                <div class="empty-message">
                    <p>
                        Please select a ministry above to begin.
                    </p>
                </div>
            `;

            return;
        }


        if (selectedMinistry === "Calvary Kids — 2–5") {

            ministryForm.innerHTML = `

                <form id="lessonForm">

                    <input
                        type="hidden"
                        id="ageGroup"
                        value="2–5"
                    >

                    <h3 class="form-section-title">
                        🌈 Calvary Kids — 2–5
                    </h3>

                    <p class="form-section-description">
                        Create a lesson using the Calvary Kids 2–5 curriculum structure.
                    </p>


                    <!-- BASIC LESSON INFORMATION -->

                    <div class="form-section">

                        <h4>Lesson Information</h4>

                        <label for="lessonTitle">
                            Lesson Title
                        </label>

                        <input
                            type="text"
                            id="lessonTitle"
                            placeholder="Example: Jesus Calmed a Storm"
                            required
                        >


                        <label for="lessonDate">
                            Lesson Date
                        </label>

                        <input
                            type="date"
                            id="lessonDate"
                            required
                        >


                        <label for="week">
                            Week
                        </label>

                        <input
                            type="text"
                            id="week"
                            placeholder="Example: Week 3"
                        >

                    </div>


                    <!-- BIBLE STORY -->

                    <div class="form-section">

                        <h4>Bible Story</h4>

                        <label for="biblePassage">
                            Bible References
                        </label>

                        <input
                            type="text"
                            id="biblePassage"
                            placeholder="Example: Matthew 8; Mark 4; Luke 8"
                            required
                        >


                        <label for="bibleStory">
                            Bible Story
                        </label>

                        <input
                            type="text"
                            id="bibleStory"
                            placeholder="Example: Jesus Calmed a Storm"
                        >


                        <label for="storySummary">
                            Bible Story Summary
                        </label>

                        <textarea
                            id="storySummary"
                            rows="5"
                            placeholder="Write a short summary of the Bible story..."
                        ></textarea>

                    </div>


                    <!-- TEACHING POINTS -->

                    <div class="form-section">

                        <h4>Teaching Points</h4>

                        <label for="keyQuestion">
                            Key Question
                        </label>

                        <input
                            type="text"
                            id="keyQuestion"
                            placeholder="Example: Is the Bible true?"
                        >


                        <label for="bottomLine">
                            Bottom Line
                        </label>

                        <textarea
                            id="bottomLine"
                            rows="3"
                            placeholder="Example: The Bible is true."
                        ></textarea>


                        <label for="storyPoint">
                            Story Point
                        </label>

                        <textarea
                            id="storyPoint"
                            rows="3"
                            placeholder="What should the children remember from the Bible story?"
                        ></textarea>


                        <label for="memoryVerse">
                            Memory Verse
                        </label>

                        <textarea
                            id="memoryVerse"
                            rows="3"
                            placeholder="Enter the memory verse..."
                        ></textarea>


                        <label for="christConnection">
                            Christ Connection
                        </label>

                        <textarea
                            id="christConnection"
                            rows="5"
                            placeholder="Explain how this lesson points children to Jesus..."
                        ></textarea>

                    </div>


                    <!-- ACTIVITIES -->

                    <div class="form-section">

                        <h4>Activities</h4>

                        <label for="activities">
                            Activities
                        </label>

                        <textarea
                            id="activities"
                            rows="6"
                            placeholder="Example: Play a Fall Asleep and Wake Up Game..."
                        ></textarea>

                    </div>


                    <!-- SCHEDULE -->

                    <div class="form-section">

                        <h4>Suggested Schedule</h4>

                        <label for="schedule">
                            Lesson Schedule
                        </label>

                        <textarea
                            id="schedule"
                            rows="6"
                            placeholder="Example:
                            Small Group — 15 minutes
                            Large Group — 20 minutes
                            Small Group — 25 minutes"
                        ></textarea>

                    </div>


                    <!-- REVIEW -->

                    <div class="form-section">

                        <h4>Bible Story Review</h4>

                        <label for="reviewQuestions">
                            Review Questions
                        </label>

                        <textarea
                            id="reviewQuestions"
                            rows="5"
                            placeholder="Enter questions to review the Bible story with the children..."
                        ></textarea>

                    </div>


                    <!-- PRAYER -->

                    <div class="form-section">

                        <h4>Prayer</h4>

                        <label for="prayer">
                            Prayer
                        </label>

                        <textarea
                            id="prayer"
                            rows="5"
                            placeholder="Enter the prayer or prayer instructions..."
                        ></textarea>

                    </div>


                    <!-- TAKE HOME -->

                    <div class="form-section">

                        <h4>Take Home</h4>

                        <label for="takeHome">
                            Parent / Take-Home Notes
                        </label>

                        <textarea
                            id="takeHome"
                            rows="5"
                            placeholder="Add information parents can use at home..."
                        ></textarea>

                    </div>


                    <!-- ADDITIONAL NOTES -->

                    <div class="form-section">

                        <h4>Teacher Notes</h4>

                        <label for="notes">
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            rows="5"
                            placeholder="Add any additional teacher notes..."
                        ></textarea>

                    </div>


                    <!-- BUTTONS -->

                    <div class="form-buttons">

                        <button
                            type="button"
                            id="cancelLessonButton"
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            Save Lesson
                        </button>

                    </div>

                </form>
            `;
        }


        else if (selectedMinistry === "Calvary Kids — K–3") {

            ministryForm.innerHTML = `

                <form id="lessonForm">

                    <input
                        type="hidden"
                        id="ageGroup"
                        value="K–3"
                    >

                    <h3 class="form-section-title">
                        🌈 Calvary Kids — K–3
                    </h3>

                    <p class="form-section-description">
                        Create a Calvary Kids K–3 lesson.
                    </p>


                    <div class="form-section">

                        <h4>Lesson Information</h4>

                        <label for="lessonTitle">
                            Lesson Title
                        </label>

                        <input
                            type="text"
                            id="lessonTitle"
                            placeholder="Example: Jesus Taught about the Kingdom"
                            required
                        >


                        <label for="lessonDate">
                            Lesson Date
                        </label>

                        <input
                            type="date"
                            id="lessonDate"
                            required
                        >


                        <label for="week">
                            Week
                        </label>

                        <input
                            type="text"
                            id="week"
                            placeholder="Example: Week 2"
                        >

                    </div>


                    <div class="form-section">

                        <h4>Bible Story</h4>

                        <label for="bibleStory">
                            Bible Story
                        </label>

                        <input
                            type="text"
                            id="bibleStory"
                            placeholder="Enter the Bible story"
                        >


                        <label for="biblePassage">
                            Bible References
                        </label>

                        <input
                            type="text"
                            id="biblePassage"
                            placeholder="Example: Matthew 13; Mark 4"
                            required
                        >


                        <label for="storySummary">
                            Bible Story Summary
                        </label>

                        <textarea
                            id="storySummary"
                            rows="5"
                            placeholder="Write a summary of the Bible story..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Teaching Points</h4>

                        <label for="bottomLine">
                            Bottom Line
                        </label>

                        <textarea
                            id="bottomLine"
                            rows="3"
                            placeholder="What should children remember?"
                        ></textarea>


                        <label for="storyPoint">
                            Story Point
                        </label>

                        <textarea
                            id="storyPoint"
                            rows="3"
                            placeholder="What is the main point of the story?"
                        ></textarea>


                        <label for="memoryVerse">
                            Memory Verse
                        </label>

                        <textarea
                            id="memoryVerse"
                            rows="3"
                            placeholder="Enter the memory verse..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Discussion Questions</h4>

                        <label for="discussionQuestions">
                            Discussion Questions
                        </label>

                        <textarea
                            id="discussionQuestions"
                            rows="7"
                            placeholder="Enter discussion questions for the children..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Activities</h4>

                        <label for="activities">
                            Activities
                        </label>

                        <textarea
                            id="activities"
                            rows="7"
                            placeholder="Enter activities, games, or activity pages..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Review the Story</h4>

                        <label for="reviewQuestions">
                            Review Questions
                        </label>

                        <textarea
                            id="reviewQuestions"
                            rows="6"
                            placeholder="Enter questions to review the Bible story..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Take Home</h4>

                        <label for="takeHome">
                            Take-Home Information
                        </label>

                        <textarea
                            id="takeHome"
                            rows="5"
                            placeholder="Enter information or activities children can take home..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Closing Prayer</h4>

                        <label for="prayer">
                            Prayer
                        </label>

                        <textarea
                            id="prayer"
                            rows="5"
                            placeholder="Enter the closing prayer..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Teacher Notes</h4>

                        <label for="notes">
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            rows="5"
                            placeholder="Add any additional teacher notes..."
                        ></textarea>

                    </div>


                    <div class="form-buttons">

                        <button
                            type="button"
                            id="cancelLessonButton"
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            Save Lesson
                        </button>

                    </div>

                </form>
            `;
        }


        else if (selectedMinistry === "The 45") {

            ministryForm.innerHTML = `

                <form id="lessonForm">

                    <input
                        type="hidden"
                        id="ageGroup"
                        value="The 45"
                    >

                    <h3 class="form-section-title">
                        4️⃣5️⃣ The 45
                    </h3>

                    <p class="form-section-description">
                        Create a Small Group lesson for The 45.
                    </p>


                    <div class="form-section">

                        <h4>Lesson Information</h4>

                        <label for="lessonTitle">
                            Lesson Title
                        </label>

                        <input
                            type="text"
                            id="lessonTitle"
                            placeholder="Example: Jesus Taught about the Kingdom"
                            required
                        >

                        <label for="lessonDate">
                            Lesson Date
                        </label>

                        <input
                            type="date"
                            id="lessonDate"
                            required
                        >

                        <label for="week">
                            Week
                        </label>

                        <input
                            type="text"
                            id="week"
                            placeholder="Example: Week 2"
                        >

                    </div>


                    <div class="form-section">

                        <h4>Bible Story</h4>

                        <label for="bibleStory">
                            Bible Story
                        </label>

                        <input
                            type="text"
                            id="bibleStory"
                            placeholder="Enter the Bible story"
                        >

                        <label for="biblePassage">
                            Bible References
                        </label>

                        <input
                            type="text"
                            id="biblePassage"
                            placeholder="Example: Matthew 13; Mark 4"
                            required
                        >

                        <label for="storySummary">
                            Bible Story Summary
                        </label>

                        <textarea
                            id="storySummary"
                            rows="6"
                            placeholder="Write a summary of the Bible story..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Memory Verse</h4>

                        <label for="memoryVerse">
                            Memory Verse
                        </label>

                        <textarea
                            id="memoryVerse"
                            rows="4"
                            placeholder="Enter the memory verse..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Discussion Questions</h4>

                        <label for="discussionQuestions">
                            Discussion Questions
                        </label>

                        <textarea
                            id="discussionQuestions"
                            rows="8"
                            placeholder="Enter questions for the group to discuss..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Review the Story</h4>

                        <label for="reviewQuestions">
                            Review Questions
                        </label>

                        <textarea
                            id="reviewQuestions"
                            rows="8"
                            placeholder="Enter questions to review the Bible story..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Activities</h4>

                        <label for="activities">
                            Activities
                        </label>

                        <textarea
                            id="activities"
                            rows="8"
                            placeholder="Enter activities, games, or activity pages..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Prayer</h4>

                        <label for="prayer">
                            Prayer
                        </label>

                        <textarea
                            id="prayer"
                            rows="6"
                            placeholder="Enter the prayer or prayer instructions..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Take Home</h4>

                        <label for="takeHome">
                            Take-Home Information
                        </label>

                        <textarea
                            id="takeHome"
                            rows="6"
                            placeholder="Enter information children can take home..."
                        ></textarea>

                    </div>


                    <div class="form-section">

                        <h4>Teacher Notes</h4>

                        <label for="notes">
                            Notes
                        </label>

                        <textarea
                            id="notes"
                            rows="6"
                            placeholder="Add any additional teacher notes..."
                        ></textarea>

                    </div>


                    <div class="form-buttons">

                        <button
                            type="button"
                            id="cancelLessonButton"
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            Save Lesson
                        </button>

                    </div>

                </form>
            `;
        }


        else if (selectedMinistry === "King's Kids") {

            ministryForm.innerHTML = `
                <div class="empty-message">

                    <h3>👑 King's Kids</h3>

                    <p>
                        A King's Kids lesson form will be added here.
                    </p>

                </div>
            `;

        }


        else if (selectedMinistry === "Calvary Youth") {

            ministryForm.innerHTML = `
                <div class="empty-message">

                    <h3>⚡ Calvary Youth</h3>

                    <p>
                        A Calvary Youth lesson form will be added here.
                    </p>

                </div>
            `;

        }

    });

}