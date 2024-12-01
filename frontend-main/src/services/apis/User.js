import  axiosInstance from "../../config/axios.config"

export const userAPI = {
    getAllUser: (data) => {
        return axiosInstance.get('/api/auth/all-users');
    },



    updateUser: (user) => {
        return axiosInstance.patch('/api/auth/update-user',user);
    },

    deleteUser: (user) => {
        return axiosInstance.delete('/api/auth/delete',user);
    }
};

