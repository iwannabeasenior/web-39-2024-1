// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Import các trang chính
import HomePage from './Features/HomePage/HomePage';
import Reservation from './Features/Reservation/Reservation'

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/reservation" element={<Reservation />} />
            </Routes>
        </Router>
    );
};

export default AppRoutes;
