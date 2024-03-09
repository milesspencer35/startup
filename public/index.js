let popup = document.getElementById('popup');

function openRegisterPopup() {
    popup.classList.add('open-popup');
}

let existingUsersText = localStorage.getItem('users');
let existingUsers = JSON.parse(existingUsersText);

async function login() {
    const loginUsername = document.querySelector("#InputUsername").value;
    const loginPassword = document.querySelector("#InputPassword").value;
    
    let user = await getUser(loginUsername);    

    if (!user || user.password !== loginPassword) {
        var message = document.querySelector("#badLoginMessage");
        message.textContent = "Invalid Login";
        return null;
    }

    await setCurrentUser(loginUsername);
    // localStorage.setItem("currentUsername", loginUsername);
    window.location.href = "counter.html";
}

async function closeRegisterPopup(type){
    if (type == "submit") {
        const registerUsername = document.querySelector("#RegisterUsername").value;
        const registerEmail = document.querySelector("#RegisterEmail").value;
        const registerPassword = document.querySelector("#RegisterPassword").value;

        if (!registerUsername || !registerEmail || !registerPassword ) { //one filled isn't filled out
            var message = document.querySelector("#badInfoMessage");
            message.textContent = "Please enter a valid username, email, and password";
            return null;
        }

        user = await getUser(registerUsername);

        if (user !== undefined) {
            var message = document.querySelector("#badInfoMessage");
            message.textContent = "That username is already taken, please choose a different one.";
        } else {
            let newUser = {username: registerUsername, email: registerEmail, password: registerPassword};

            try {
                await fetch('/api/register', {
                  method: 'POST',
                  headers: {'content-type': 'application/json'},
                  body: JSON.stringify(newUser),
                });

                // localStorage.setItem("currentUsername", registerUsername);
                await setCurrentUser(registerUsername);
                window.location.href = "counter.html";
              } catch (e) {
                console.log("Error", e.message());
              }
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

async function getUser(username) {
    let users = null
    try {
        const response = await fetch('/api/users');
        users = await response.json();
    } catch (e) {
        console.log("Error", e.message);
        return null;
    }

    user = users.find((user) => user.username === username);
    return user;
}

async function setCurrentUser(username) {
    try {
        const response = await fetch('/api/setCurrentUser', {
            method: 'PUT',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({'username': username}),
        })
    } catch (e) {
        console.log("Current User Error: ",e.message);
    }
}