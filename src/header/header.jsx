import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from '../login/login';
import { Counter } from '../counter/counter';
import { InventoryList } from '../inventoryList/inventoryList';
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
                        <NavLink className="header-item" to='/app/counter'>Counter</NavLink>
                        <NavLink className="header-item" to='/app/inventoryList'>Inventory List</NavLink>
                        <span id="header-username" >{username}</span>
                        <NavLink className="header-item" to='/'>Log out</NavLink>
                    </div>
                    <div className="dropdown">
                        <i className="bi bi-list dropbtn" onClick={dropdownClicked}></i>
                        <div className="dropdown-content">
                            <div className="dropdown-items">
                                {/* <a className="dropdown-item" href="counter.html">Counter</a> */}
                                <NavLink className="dropdown-item" to='/counter'>Counter</NavLink>
                                <NavLink className="dropdown-item" to='/inventoryList'>Inventory List</NavLink>
                                <span className="dropdown-item" id="dropdown-username" style={{fontWeight: 'bold'}}>{username}</span>
                                <NavLink className="dropdown-item" to='/'>Log out</NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}