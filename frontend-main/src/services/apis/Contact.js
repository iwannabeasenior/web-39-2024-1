
import axiosInstance from "../../config/axios.config";

export const contactAPI = {
    sendContact: (data) => {
        return axiosInstance.post('/contact', data); // Đảm bảo rằng bạn đã tạo route này trong backend
    },
};