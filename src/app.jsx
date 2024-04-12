import React from 'react';
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom';
import { Login } from './login/login';
import { Counter } from './counter/counter';
import { InventoryList } from './inventoryList/inventoryList';
import { InApp } from './inApp/inApp';
import './app.css';



export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Login />} exact />
                <Route path='app' element={<InApp param={"counter"} />} exact>
                    <Route path="counter" element={<Counter />} exact/>
                    <Route path='inventoryList' element={<InventoryList />} exact />
                </Route>
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
    return <main className='text-center'>404: Return to sender. Address unknown.</main>;
}

