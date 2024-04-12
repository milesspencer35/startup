import React from 'react';
import '../app.css';

export function Header() {

    async function logout() {
        await fetch('/api/logout', {
            method: 'DELETE'
        });
        window.location.href = "login.html";
    }


    const [dropdownOpen, setDropDown] = React.useState(false);
    const [username, setUsername] = React.useState("Username");

    function dropdownClicked() {
        var dropdown = document.querySelector(".dropdown-content");
        if (dropdownOpen) {
            dropdown.style.display = "none";
            setDropDown(false);
        } else {
            dropdown.style.display = "block";
            setDropDown(true);
        }
    }

    React.useEffect(() => {
        fetch('/api/getCurrentUser')
          .then((response) => response.text())
          .then((username) => {
            setUsername(username);
          });
      }, []);

    return (
        <div>
            <header id="page-header">
                <div id="header-brand">
                    <h1 id="header-title">UPC Counter</h1>
                    <img id="header-logo" width="100px" style={{ width: '3rem' }} src="barcode.png"></img>
                </div>
                <div>
                    <div id="header-items">
                        <a className="header-item" href="counter.html">Counter</a>
                        <a className="header-item" href="inventoryList.html">Inventory List</a>
                        <span id="header-username" >{username}</span>
                        <a className="header-item" href="" onClick={logout}>Log out</a>
                    </div>
                    <div className="dropdown">
                        <i className="bi bi-list dropbtn" onClick={dropdownClicked}></i>
                        <div className="dropdown-content">
                            <div className="dropdown-items">
                                <a className="dropdown-item" href="counter.html">Counter</a>
                                <a className="dropdown-item" href="inventoryList.html">Inventory List</a>
                                <span className="dropdown-item" id="dropdown-username" style={{fontWeight: 'bold'}}>{username}</span>
                                <a className="dropdown-item" href="" onClick={logout}>Log out</a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}