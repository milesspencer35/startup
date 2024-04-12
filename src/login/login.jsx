import React from 'react';
import { useNavigate } from 'react-router-dom';
import './login.css';
import '../popup.css';

export function Login() {
    const navigate = useNavigate();
    let popup = document.getElementById('popup');

    function openRegisterPopup() {
        popup = document.getElementById('popup');
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
                    let responseText = await fetch('/api/register', {
                    method: 'POST',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(newUser),
                    });

                    // response = JSON.parse(responseText);
                    if (responseText.status !== 200) {
                        var message = document.querySelector("#badInfoMessage");
                        message.textContent = "That username is already taken, please choose a different one.";
                    } else {
                        //window.location.href = "counter.html";
                        navigate('/app/counter');
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

        // window.location.href = "counter.html";
        navigate('/app/counter');
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


  return (
    <div id="center-content">
        <header id="login-header">
            <h1 id="header-text">UPC Counter</h1>
            <img width="75rem" src="barcode.png"></img>
        </header>
        <main id="login">
            <div className="login-form">
                <div className="form-group">
                  <input type="text" className="form-control login-content" id="InputUsername" placeholder="Username"></input>
                </div>
                <div className="form-group">
                  <input type="password" className="form-control login-content" id="InputPassword" placeholder="Password"></input>
                </div>
                <div id="badLoginMessage"></div>
                <button onClick={login} className="btn btn-primary login-content">Submit</button>
            </div>

            <div onClick={openRegisterPopup} className="btn btn-outline-dark login-content">Register</div>

            <div className="popup" id="popup">
                <h2>Register</h2>
                <div className="login-form">
                    <div className="form-group">
                      <input type="text" className="form-control login-content" id="RegisterUsername" placeholder="Username"></input>
                    </div>
                    <div className="form-group">
                        <input type="text" className="form-control login-content" id="RegisterEmail" placeholder="Email"></input>
                      </div>
                    <div className="form-group">
                      <input type="password" className="form-control login-content" id="RegisterPassword" placeholder="Password"></input>
                    </div>
                    <div id="badInfoMessage"></div>
                    <button onClick={() => closeRegisterPopup('submit')} className="btn btn-primary login-content">Submit</button>
                    <button onClick={ () => closeRegisterPopup('cancel')} className="btn btn-outline-dark login-content">Cancel</button>
                </div>
            </div>
        </main>
    </div>
  );
}