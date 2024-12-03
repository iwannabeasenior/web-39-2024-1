import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

export default function Contact() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        const { name, email, phone, message } = values;
        const requestData = { name, email, phone, message };

        try {
            setLoading(true);
            // Gửi request đến API để xử lý thông tin liên hệ
            // await contactAPI.sendContact(requestData);
            message.success('Gửi thông tin thành công!');
        } catch (error) {
            message.error('Gửi thông tin thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
            <div className="max-w-md w-full mx-4 relative">
                <Card className="relative bg-white/90 backdrop-blur-sm rounded-xl border-0 shadow-lg">
                    <div className="text-center mt-8 mb-4">
                        <h1 className="text-3xl font-serif font-bold text-amber-800 mb-2">
                            Liên Hệ Chúng Tôi
                        </h1>
                        <p className="text-amber-700 font-serif italic">
                            Chúng tôi luôn sẵn sàng hỗ trợ bạn
                        </p>
                    </div>

                    <Form
                        name="contact"
                        onFinish={handleSubmit}
                        layout="vertical"
                        scrollToFirstError
                        className="space-y-4"
                    >
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Vui lòng nhập tên của bạn!' }]}>
                            <Input
                                prefix={<UserOutlined className="text-amber-500" />}
                                placeholder="Tên của bạn"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            rules={[
                                { type: 'email', message: 'Vui lòng nhập email hợp lệ!' },
                                { required: true, message: 'Vui lòng nhập email!' },
                            ]}>
                            <Input
                                prefix={<MailOutlined className="text-amber-500" />}
                                placeholder="Email"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}>
                            <Input
                                prefix={<PhoneOutlined className="text-amber-500" />}
                                placeholder="Số điện thoại"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            name="message"
                            rules={[{ required: true, message: 'Vui lòng nhập tin nhắn của bạn!' }]}>
                            <Input.TextArea
                                rows={4}
                                placeholder="Tin nhắn của bạn"
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                loading={loading}
                                className="h-12 bg-gradient-to-r from-amber-500 to-orange-500 border-0 text-lg font-serif hover:from-amber-600 hover:to-orange-600 shadow-md hover:shadow-lg transition-all duration-300">
                                Gửi
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
}
