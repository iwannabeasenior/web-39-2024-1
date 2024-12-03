import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, DatePicker, message, Select, InputNumber } from 'antd';
import { itemAPI } from '../../services/apis/Item'; // API to fetch menu items
import { reservationAPI } from '../../services/apis/Reservation'; // API to create reservations

const { Option } = Select;

const Reservation = () => {
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await itemAPI.getAllItem();
                setItems(response);
            } catch (error) {
                message.error('Unable to load menu items.');
            }
        };

        fetchItems();
    }, []);

    const handleItemChange = (itemId, quantity) => {
        setSelectedItems(prev => ({
            ...prev,
            [itemId]: quantity,
        }));
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Build basic data
            const orderData = {
                type: "reservation",
                status: "pending",
                start_time: new Date(values.date).toISOString(), // Convert to ISO format
                num_people: values.num_people,
            };

            // Handle menu items (if any)
            const selectedItemsArray = Object.entries(selectedItems)
                .filter(([_, quantity]) => quantity > 0) // Filter items with quantity greater than 0
                .map(([itemId, quantity]) => ({ id: parseInt(itemId), quantity }));

            if (selectedItemsArray.length > 0) {
                orderData.items = selectedItemsArray; // Add items to the data if present
            }

            // Send request to API
            const response = await reservationAPI.createOrder(orderData); // reservationAPI is the service that calls the API
            message.success('Reservation successful!');
        } catch (error) {
            console.error('Error creating order:', error);
            message.error('Unable to make a reservation. Please try again.');
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
                            Reservation
                        </h1>
                        <p className="text-amber-700 font-serif italic">
                            Please fill out the information below
                        </p>
                    </div>

                    <Form onFinish={handleSubmit} layout="vertical" scrollToFirstError>
                        <Form.Item
                            name="name"
                            rules={[{ required: true, message: 'Please enter your name!' }]}>
                            <Input placeholder="Full Name" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="phone"
                            rules={[{ required: true, message: 'Please enter your phone number!' }]}>
                            <Input placeholder="Phone Number" size="large" />
                        </Form.Item>

                        <Form.Item
                            name="num_people"
                            rules={[{ required: true, message: 'Please enter the number of people!' }]}>
                            <InputNumber
                                min={1}
                                placeholder="Number of People"
                                size="large"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="date"
                            rules={[{ required: true, message: 'Please select a date and time!' }]}>
                            <DatePicker
                                showTime
                                placeholder="Select Date and Time"
                                size="large"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>

                        {/* Choose Menu Items */}
                        <h3>Choose Menu Items</h3>
                        {items.map(item => (
                            <Form.Item key={item.id} label={item.name}>
                                <Select
                                    defaultValue={0}
                                    onChange={(value) => handleItemChange(item.id, value)} // Update selectedItems
                                    size="large">
                                    <Option value={0}>Not Selected</Option>
                                    {[...Array(10).keys()].map(i => (
                                        <Option key={i + 1} value={i + 1}>{i + 1}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        ))}
                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                size="large"
                                className="w-full">
                                Make Reservation and Order
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

export default Reservation;
