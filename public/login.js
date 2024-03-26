let popup = document.getElementById('popup');

function openRegisterPopup() {
    popup.classList.add('open-popup');
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

        if (!(await validEmail(registerEmail))) {
            var message = document.querySelector("#badInfoMessage");
            message.textContent = "Please use a valid email."
        } else {
            let newUser = {username: registerUsername, email: registerEmail, password: registerPassword};

            try {
                responseText = await fetch('/api/register', {
                  method: 'POST',
                  headers: {'content-type': 'application/json'},
                  body: JSON.stringify(newUser),
                });

                // response = JSON.parse(responseText);
                if (responseText.status !== 200) {
                    var message = document.querySelector("#badInfoMessage");
                    message.textContent = "That username is already taken, please choose a different one.";
                } else {
                    window.location.href = "counter.html";
                }
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

async function login() {
    const loginUsername = document.querySelector("#InputUsername").value;
    const loginPassword = document.querySelector("#InputPassword").value;
    
    let response = await loginUser(loginUsername, loginPassword); 
    
    if (response.status !== 200) {
        var message = document.querySelector("#badLoginMessage");
        message.textContent = "Invalid Login";
        return null;
    }

    window.location.href = "counter.html";
}

async function loginUser(username, password) {
    const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username: username, password: password }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
    });
    return response;
}

async function validEmail(email) {
    const response = await fetch('https://www.disify.com/api/email/'+ email);
    let result = await response.json();
    if (result.format === true && result.disposable === false && result.dns === true) {
        return true;
    } else {
        return false;
    }
}