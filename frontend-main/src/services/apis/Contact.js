
import axiosInstance from "../../config/axios.config";

export const contactAPI = {
    sendContact: (data) => {
        return axiosInstance.post('/contact/create', data); // Đảm bảo rằng bạn đã tạo route này trong backend
    },
<<<<<<< HEAD
    getALlContact: () => {
        return axiosInstance.get('/contact/getAll', ); // Đảm bảo rằng bạn đã tạo route này trong backend
    },

=======
    getAllContacts: () => {
        return axiosInstance.get('/contact/getAll');
    }
>>>>>>> 852d27a68d9295699f2329b0909ddc57028f4ad8
};