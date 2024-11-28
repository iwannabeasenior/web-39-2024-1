// contexts/AuthContext.js
import { createContext, useState, useContext, useEffect } from 'react';
import { message } from 'antd';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in when app loads
        const user = localStorage.getItem('user');
        if (user) {
            try{
                const parsedUser = JSON.parse(user);
                setUser(parsedUser);
            }
            catch (error) {
                console.log(error);
                localStorage.removeItem('user');
            }
            setUser(JSON.parse(user));
        }
        setLoading(false);
    }, []);

    const login = (data) => {
        // Lưu token và user info vào localStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.username));
        setUser(data);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        message.success('Đăng xuất thành công');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);