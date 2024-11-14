import axios from '../config/axios.config';

export const authAPI = {
    // Đăng ký
    register: (data) => {
        return axios.post('/signup', data);
    },

    // Đăng nhập
    login: (data) => {
        return axios.post('/login', data);
    },

    // Đăng xuất
    logout: () => {
        return axios.post('/auth/logout');
    },

    // Refresh token
    refreshToken: () => {
        return axios.post('/auth/refresh-token');
    }
};

export const userAPI = {
    // Cập nhật thông tin user
    updateProfile: (data) => {
        return axios.put('/auth/update', data);
    },

    // Xóa tài khoản
    deleteAccount: (password) => {
        return axios.delete('/auth/delete', { data: { password } });
    }
};