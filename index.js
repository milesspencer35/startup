
function login() {

    // Test to see if the username and password are already in system.

    window.location.href = "counter.html";
}
  
let popup = document.getElementById('popup');

function openRegisterPopup() {
    popup.classList.add('open-popup');
}

function closeRegisterPopup(type){
    if (type == "submit") {
        const registerUsername = document.querySelector("#RegisterUsername");
        const registerEmail = document.querySelector("#RegisterEmail");
        const registerPassword = document.querySelector("#RegisterPassword");
        if (!registerUsername.value || !registerEmail.value || !registerPassword.value) {
            
            var message = document.querySelector("#badInfoMessage");
            message.textContent = "Please enter a valid username, email, and password";
        } else {

            // How should I store the users in LocalStorage??

            window.location.href = "counter.html";
        }
    } else {
        var message = document.querySelector("#badInfoMessage");
        message.textContent = "";
        popup.classList.remove('open-popup');
    }

}