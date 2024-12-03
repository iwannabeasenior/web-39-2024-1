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
import ItemManagements from "./Features/Admin/pages/ItemManagements";
import UserManagement from "./Features/Admin/pages/UserManagement";
import Header from "../src/components/HomePage/header"
import Contact from './Features/Contact/Contact';



const AppRoutes = () => {
    const navLinks = [
        { path: '/', label: 'Trang chủ' },
        { path: '/menu', label: 'Thực đơn' },
        { path: '/reservation', label: 'Đặt bàn' },
        { path: '/contact', label: 'Liên hệ' },
    ];
    return (
        <AuthProvider>
            <Router>
                <Header logo="/Assets/Header/logoRestaurant.png" navLinks={navLinks} />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/reservation" element={<Reservation />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/menu" element={<Menu />} />
                    <Route path="/unauthorized" element={<BanKhongPhaiLaAdmin />} />
                    <Route path="/contact" element={<Contact/>} />

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
                        <Route path="menu" element={<ItemManagements />} />
                        <Route path="users" element={<UserManagement />} />

                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default AppRoutes;