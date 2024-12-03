import  axiosInstance from "../../config/axios.config"

export const itemCategoryAPI = {
    getAllItem: (data) => {
        return axiosInstance.get('/item');
    },

    createItemCategory: (data) => {
        return axiosInstance.post('/item-category/create-item-category', data);
    },

    updateItem: (data) => {
        return axiosInstance.patch('/item/update-item', data);
    },

    deleteItem: (data) => {
        return axiosInstance.delete('/item/delete-item',{data});
    },
    searchItem: (data) => {
        return axiosInstance.get('/item/delete-item');
    }
};

