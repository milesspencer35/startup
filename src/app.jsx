import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Counter } from './counter/counter';
// import { InventoryList } from './inventoryList/inventoryList';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';



export default function App() {
    return (
        <BrowserRouter>
            <main>App components go here</main>
            <NavLink className="nav-link" to='counter'>Login</NavLink>

            <Routes>
                <Route path='/' element={<Login />} exact />
                <Route path='/counter' element={<Counter />} exact />
                <Route path='*' element={<NotFound />} />
            </Routes>

            <footer>
                <p id="name">Miles Spencer</p>
                <a id="linkedin" className="bi bi-linkedin" href="https://www.linkedin.com/in/milesspencer35" 
                    target="_blank" rel="noopener noreferrer"></a>
                <a id="github" className="bi bi-github" href="https://github.com/milesspencer35/startup" 
                    target="_blank" rel="noopener noreferrer"></a>
            </footer>
        </BrowserRouter>
    );
}

function NotFound() {
    return <main className='container-fluid bg-secondary text-center'>404: Return to sender. Address unknown.</main>;
}

