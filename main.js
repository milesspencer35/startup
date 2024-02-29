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