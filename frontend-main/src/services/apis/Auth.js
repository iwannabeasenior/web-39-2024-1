import axios from '../../config/axios.config';

export const authAPI = {
    // Đăng ký
    register: (data) => {
        return axios.post('/api/auth/signup', data);
    },

    // Đăng nhập
    login: (data) => {
        return axios.post('/api/auth/login', data);
    },

    // Đăng xuất
    logout: () => {
        return axios.post('/api/auth/logout');
    },

    // Refresh token
    refreshToken: () => {
        return axios.post('/api/auth/refresh-token');
    }
};

export const userAPI = {
    // Cập nhật thông tin user
    updateProfile: (data) => {
        return axios.put('/api/auth/update-user', data);
    },

    // Xóa tài khoản
    deleteAccount: (password) => {
        return axios.delete('/api/auth/delete', { data: { password } });
    }
};