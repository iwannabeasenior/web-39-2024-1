// components/ProtectedRoute.js
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {message} from "antd";
import { jwtDecode } from 'jwt-decode';



const ProtectedRoute = ({ children,roles }) => {
    const { user } = useAuth();
    const location = useLocation();
    const token = localStorage.getItem('accessToken');
    const decoded = jwtDecode(token.split(' ')[1]);
    console.log("check decode",decoded);


    if (!user) {
        message.error("Please login");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (roles && !roles.includes(decoded.payload.role)) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default ProtectedRoute;