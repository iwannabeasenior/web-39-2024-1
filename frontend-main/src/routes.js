// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Features/Login/Login"
// Import các trang chính
import HomePage from './Features/HomePage/HomePage';
import Reservation from './Features/Reservation/Reservation'
import Register from "./Features/Register/Register"
import Menu from './Features/Menu/menu';

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/reservation" element={<Reservation />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/menu" element={<Menu />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
