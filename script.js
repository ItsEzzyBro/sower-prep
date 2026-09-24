const getStartedButton = document.getElementById("getStartedButton");

if (getStartedButton) {
    getStartedButton.addEventListener("click", function () {
        window.location.href = "login.html";
    });
}