
function login() {

    // Test to see if the username and password are already in system.

    window.location.href = "counter.html";
}
  
let popup = document.getElementById('popup');

function openRegisterPopup() {
    popup.classList.add('open-popup');
}

let existingUsersText = localStorage.getItem('users');
let existingUsers = JSON.parse(existingUsersText);

function closeRegisterPopup(type){
    if (type == "submit") {
        const registerUsername = document.querySelector("#RegisterUsername");
        const registerEmail = document.querySelector("#RegisterEmail");
        const registerPassword = document.querySelector("#RegisterPassword");

        if (!registerUsername.value || !registerEmail.value || !registerPassword.value) { //one filled isn't filled out
            
            var message = document.querySelector("#badInfoMessage");
            message.textContent = "Please enter a valid username, email, and password";
        } else if (existingUsers && existingUsers.some(item =>  item.username === registerUsername.value)) { //username taken
            var message = document.querySelector("#badInfoMessage");
            message.textContent = "That username is already taken, please choose a different one.";
        } else {
            this.saveUser({username: registerUsername.value, email: registerEmail.value, password:registerPassword.value});
            localStorage.setItem("currentUsername", registerUsername.value);
            window.location.href = "counter.html";
        }
    } else { //cancel clicked
        var message = document.querySelector("#badInfoMessage");
        message.textContent = "";
        popup.classList.remove('open-popup');
    }
}

function saveUser(newUser) {
    let users = [];
    const usersText = localStorage.getItem('users');
    if (usersText) {
        users = JSON.parse(usersText);
    }
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
}