import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, InputNumber } from 'antd';
import { orderAPI } from "../../../services/apis/Order"; // Giả sử bạn có một API cho đơn hàng

export default function OrderManagements() {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingOrder, setEditingOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await orderAPI.getAllOrders(); // Lấy tất cả đơn hàng
            setOrders(response);
            console.log("Đã lấy đơn hàng:", response);
        } catch (error) {
            setError("Không thể tải đơn hàng");
            message.error("Lỗi khi tải đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const columns = [
        {
            title: 'Mã Đơn Hàng',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Mã khách hàng',
            dataIndex: 'customer_id',
            key: 'customer_id',
        },
        {
            title: 'Thời gian',
            dataIndex: 'time',
            key: 'time',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Trạng Thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Hành Động',
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
        setEditingOrder(null);
        form.resetFields();
        setIsModalVisible(true);
    };

    const handleEdit = (record) => {
        setEditingOrder(record);
        form.setFieldsValue(record);
        setIsModalVisible(true);
    };

    const handleDelete = async (record) => {
        try {
            await orderAPI.deleteOrder(record.id); // Xóa đơn hàng
            setOrders(orders.filter(order => order.id !== record.id));
            message.success('Xóa đơn hàng thành công');
        } catch (error) {
            message.error('Xóa đơn hàng không thành công');
        }
    };

    const handleModalOk = async () => {
        try {
            const values = await form.validateFields();
            if (editingOrder) {
                // Cập nhật đơn hàng
                await orderAPI.updateOrder({ ...values, id: editingOrder.id });
                setOrders(orders.map(order => (order.id === editingOrder.id ? { ...order, ...values } : order)));
                message.success('Cập nhật đơn hàng thành công');
            } else {
                // Thêm đơn hàng mới
                const newOrder = await orderAPI.addOrder(values);
                setOrders([...orders, newOrder]);
                message.success('Thêm đơn hàng mới thành công');
            }

            setIsModalVisible(false);
            form.resetFields();
        } catch (error) {
            console.error('Lỗi khi thêm/cập nhật đơn hàng:', error);
            message.error('Đã xảy ra lỗi. Vui lòng thử lại.');
        }
    };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Quản Lý Đơn Hàng</h1>
                <Button
                    type="primary"
                    onClick={handleAdd}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Thêm Đơn Hàng Mới
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <Table
                    columns={columns}
                    dataSource={orders}
                    rowKey="id"
                    loading={loading}
                    className="w-full"
                    pagination={{ pageSize: 5 }} // Thêm phân trang
                />
            </div>

            <Modal
                title={editingOrder ? "Sửa Đơn Hàng" : "Thêm Đơn Hàng Mới"}
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={() => {
                    setIsModalVisible(false);
                    form.resetFields();
                }}
                className="rounded-lg"
            >
                <Form
                    form={form}
                    layout="vertical"
                    className="mt-4"
                >
                    <Form.Item
                        name="customerName"
                        label="Tên Khách Hàng"
                        rules={[{ required: true, message: 'Vui lòng nhập tên khách hàng!' }]}
                    >
                        <Input placeholder="Nhập tên khách hàng" className="border rounded-md" />
                    </Form.Item>
                    <Form.Item
                        name="totalAmount"
                        label="Tổng Số Tiền"
                        rules={[{ required: true, message: 'Vui lòng nhập tổng số tiền!' }]}
                    >
                        <InputNumber className="w-full border rounded-md" placeholder="Nhập tổng số tiền" />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label="Trạng Thái"
                        rules={[{ required: true, message: 'Vui lòng chọn trạng thái đơn hàng!' }]}
                    >
                        <Input placeholder="Nhập trạng thái đơn hàng" className="border rounded-md" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}