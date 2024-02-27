
function login() {
    const nameEl = document.querySelector("#InputUsername");
    localStorage.setItem("userName", nameEl.value);
    window.location.href = "counter.html";
}