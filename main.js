let dropdownOpen = false;

function dropdownClicked() {
    var dropdown = document.querySelector(".dropdown-content");
    if (dropdownOpen) {
        dropdown.style.display = "none";
        dropdownOpen = false;
    } else {
        dropdown.style.display = "block";
        dropdownOpen = true;
    }
}

let username = localStorage.getItem("currentUsername");
let headerUsername = document.querySelector("#header-username");
headerUsername.textContent = username;
let dropdownUsername = document.querySelector("#dropdown-username");
dropdownUsername.textContent = username;