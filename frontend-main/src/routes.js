// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from "./Features/Login/Login"
import HomePage from './Features/HomePage/HomePage';
import Reservation from './Features/Reservation/Reservation'
import Register from "./Features/Register/Register"
import Menu from './Features/Menu/menu';
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Profile from "./Features/Profile/profile";
import AdminLayout from "./Features/Admin/layouts/AdminLayout";
import BanKhongPhaiLaAdmin from "./Features/BanKhongPhaiLaAdmin/BanKhongPhaiLaAdmin";
import TableManagement from "./Features/Admin/pages/TableManagements";




const AppRoutes = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/reservation" element={<Reservation />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/unauthorized" element={<BanKhongPhaiLaAdmin />} />

                    {/* Protected Profile Route */}
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile/>
                        </ProtectedRoute>
                    } />

                    {/* Admin Routes */}
                    <Route path="/admin" element={
                        <ProtectedRoute roles={['ADMIN']}>
                            <AdminLayout />
                        </ProtectedRoute>
                    }>
                        <Route path="tables" element={<TableManagement />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRoutes;