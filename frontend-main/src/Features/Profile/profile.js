import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Input, message } from 'antd';
import { userAPI } from "../../services/apis/User"; // Giả sử bạn có một API cho hồ sơ cá nhân

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await userAPI.getProfile(); // Lấy thông tin hồ sơ cá nhân
            setProfile(response);
            form.setFieldsValue(response); // Đặt giá trị cho form
        } catch (error) {
            message.error("Lỗi khi tải thông tin hồ sơ");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEdit = () => {
        setIsModalVisible(true);
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            const requestData = {
                name: values.name,
                email: values.email,
                phone: values.phone,
            };

            // Cập nhật thông tin hồ sơ
            await userAPI.updateProfile(requestData);
            setProfile({ ...profile, ...requestData }); // Cập nhật state profile
            message.success('Cập nhật hồ sơ thành công');
            setIsModalVisible(false);
        } catch (error) {
            console.error('Lỗi khi cập nhật hồ sơ:', error);
            message.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Quản lý hồ sơ cá nhân</h1>
                <Button
                    type="primary"
                    onClick={handleEdit}
                    className="bg-blue-500 hover:bg-blue-600"
                >
                    Chỉnh sửa hồ sơ
                </Button>
            </div>

            {profile ? (
                <div className="bg-white rounded-lg shadow p-4">
                    <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
                    <p><strong>Tên:</strong> {profile.name}</p>
                    <p><strong>Email:</strong> {profile.email}</p>
                    <p><strong>Số điện thoại:</strong> {profile.phone}</p>
                </div>
            ) : (
                <p>Đang tải thông tin hồ sơ...</p>
            )}

            <Modal
                title="Chỉnh sửa hồ sơ cá nhân"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        name="name"
                        label="Tên"
                        rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
                    >
                        <Input placeholder="Nhập tên" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}
                    >
                        <Input placeholder="Nhập email" />
                    </Form.Item>
                    <Form.Item
                        name="phone"
                        label="Số điện thoại"
                        rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
                    >
                        <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}