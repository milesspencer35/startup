import React from "react";
import { BrowserRouter, NavLink, Route, Routes, useParams } from 'react-router-dom';
import { Header } from '../header/header';
import { Counter } from '../counter/counter';
import { InventoryList } from '../inventoryList/inventoryList';

export function InApp({ param }) {
 
    return (
        <div>
            <Header></Header>
            <Routes>
                <Route path="counter" element={<Counter />} exact/>
                <Route path='inventoryList' element={<InventoryList />} exact />
            </Routes>
        </div> 
    );
}