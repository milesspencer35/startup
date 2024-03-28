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

async function logout() {
    await fetch('/api/logout', {
        method: 'DELETE'
    });
    window.location.href = "login.html";
}

async function getCurrentUser() {
    try {
        const response = await fetch('/api/getCurrentUser');
        return await response.text();
    } catch (e) {
        console.log("Error", e.message);
        return null;
    }
}

getCurrentUser()
    .then((username) => {
        let headerUsername = document.querySelector("#header-username");
        headerUsername.textContent = username;
        let dropdownUsername = document.querySelector("#dropdown-username");
        dropdownUsername.textContent = username;
    });
