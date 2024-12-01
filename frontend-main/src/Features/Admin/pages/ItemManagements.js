import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, InputNumber, Upload } from 'antd';
import { itemAPI } from "../../../services/apis/Item"; // Giả sử bạn có một API cho menu
import axios from "axios";
import { UploadOutlined } from '@ant-design/icons';

export default function ItemManagements() {
    const [menuItems, setMenuItems] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingItem, setEditingItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]); // State để lưu trữ file ảnh

    const fetchMenuItems = async () => {
        setLoading(true);
        try {
            const response = await itemAPI.getAllItem(); // Lấy danh sách món ăn
            setMenuItems(response);
        } catch (error) {
            setError("Không thể tải danh sách món ăn");
            message.error("Lỗi khi tải danh sách món ăn");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const columns = [
        {
            title: 'Tên món',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Giá',
            dataIndex: 'price',
            key: 'price',
            render: (text) => <span>{text} VNĐ</span>,
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <img src={text} alt="item" style={{ width: 50, height: 50 }} />, // Hiển thị ảnh
        },
        {
            title: 'Thao tác',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="link"
                        onClick={() => handleEdit(record)}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        Sửa
                    </Button>
                    <Button
                        type="link"
                        onClick={() => handleDelete(record)}
                        className="text-red-600 hover:text-red-800"
                    >
                        Xóa
                    </Button>
                </Space>
            ),
        },
    ];

    const handleAdd = () => {
        setEditingItem(null);
        form.resetFields();
        setFileList([]); // Reset file list
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingItem(record);
        form.setFieldsValue(record);
        setFileList([{ uid: '-1', name: 'image.png', status: 'done', url: record.image }]); // Set file list for editing
        setIsModalVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            await itemAPI.deleteItem(record); // Xóa món ăn
            setMenuItems(menuItems.filter(item => item.id !== record.id));
            message.success('Xóa món ăn thành công');
        } catch (error) {
            message.error('Xóa món ăn không thành công');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            let imageUrl = '';

            // Nếu có file ảnh, upload lên server và lấy URL
            if (fileList.length > 0) {
                const formData = new FormData();
                formData.append('file', fileList[0].originFileObj); // Thêm file vào FormData

                // Giả sử bạn có một API để upload ảnh
                const uploadResponse = await axios.post('/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                imageUrl = uploadResponse.data.url; // Giả sử API trả về URL của ảnh
            }

            const requestData = {
                name: values.name,
                price: values.price,
                image: imageUrl, // Thêm URL ảnh vào requestData
            };

            if (editingItem) {
                console.log("check editing item: ",editingItem)
                // Cập nhật món ăn
                await itemAPI.updateItem({ ...requestData, id: editingItem.id });
                setMenuItems(menuItems.map(item=>(item.id===editingItem.id?{...item,...requestData}:item )));
                message.success('Cập nhật món ăn thành công');
            } else {
                // Thêm món ăn mới
                const newItem = await itemAPI.addItem(requestData); // Gửi requestData
                setMenuItems([...menuItems, newItem]);
                message.success('Thêm món ăn mới thành công');
            }

            setIsModalVisible(false);
            form.resetFields();
            setFileList([]); // Reset file list
        } catch (error) {
            console.error('Lỗi khi thêm/sửa món ăn:', error);
            message.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList); // Cập nhật file list khi người dùng chọn ảnh
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Quản lý menu món ăn</h1>
                <Button
                    type="primary"
                    onClick={handleAdd}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Thêm món ăn mới
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow">
                <Table
                    columns={columns}
                    dataSource={menuItems}
                    rowKey="id"
                    loading={loading}
                    className="w-full"
                />
            </div>

            <Modal
                title={editingItem ? "Sửa thông tin món ăn" : "Thêm món ăn mới"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                    setFileList([]); // Reset file list
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        name="name"
                        label="Tên món"
                        rules={[{ required: true, message: 'Vui lòng nhập tên món!' }]}
                    >
                        <Input placeholder="Nhập tên món" />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Giá"
                        rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}
                    >
                        <InputNumber className="w-full" placeholder="Nhập giá" />
                    </Form.Item>
                    <Form.Item
                        label="Ảnh"
                    >
                        <Upload
                            listType="picture"
                            fileList={fileList}
                            onChange={handleUploadChange}
                            beforeUpload={() => false} // Ngăn không cho tự động upload
                        >
                            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}