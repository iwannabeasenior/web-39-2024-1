import React, { useEffect, useState } from 'react';
import { itemAPI } from "../../services/apis/Item";
import { message } from "antd";
import CategoryNavigation from "../../components/Menu/categoryNavigation";

export default function MenuItems() {
    const [listItems, setListItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [quantities, setQuantities] = useState({});
    const [addingToCart, setAddingToCart] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('all'); // Mặc định là "Tất cả"

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await itemAPI.getAllItem();
            console.log("check res:", response);
            setListItems(response);
            // Khởi tạo số lượng cho mỗi món ăn
            const initialQuantities = Object.fromEntries(response.map(item => [item.id, 1]));
            setQuantities(initialQuantities);
        } catch (error) {
            console.error(error);
            message.error("Lỗi khi tải menu!");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    const handleQuantityChange = (itemId, delta) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: Math.max(1, prev[itemId] + delta) // Đảm bảo số lượng không nhỏ hơn 1
        }));
    };

    const handleAddToCart = (itemId) => {
        setAddingToCart(prev => ({ ...prev, [itemId]: true }));
        // Giả lập gọi API
        setTimeout(() => {
            // Thêm món vào giỏ hàng (có thể thêm logic ở đây để thực sự thêm vào giỏ hàng)
            console.log(`Thêm ${quantities[itemId]} ${listItems.find(item => item.id === itemId)?.name} vào giỏ hàng.`);
            setAddingToCart(prev => ({ ...prev, [itemId]: false }));
            setQuantities(prev => ({ ...prev, [itemId]: 1 })); // Reset số lượng về 1
        }, 1000);
    };

    // Lọc danh sách món ăn theo danh mục đã chọn
    const filteredItems = selectedCategory === 'all'
        ? listItems
        : listItems.filter(item => item.name.toLowerCase().includes(selectedCategory.toLowerCase()));

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <CategoryNavigation selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div>Đang tải...</div>
                    ) : (
                        filteredItems.map(item => (
                            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                {/* Phần hình ảnh */}
                                <div className="relative">
                                    <img
                                        className="w-full h-48 object-cover"
                                        src={item.image}
                                        alt={item.name}
                                    />
                                    {/* Nhãn */}
                                    <div className="absolute top-2 left-2 flex gap-2">
                                        {item.isPopular && (
                                            <span className="px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
                                                🔥 Phổ biến
                                            </span>
                                        )}
                                        {item.discount > 0 && (
                                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">
                                                -{item.discount}%
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Phần nội dung */}
                                <div className="p-4">
                                    {/* Tiêu đề và đánh giá */}
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                        <div className="flex items-center">
                                            <span className="text-amber-500 mr-1">⭐</span>
                                            <span className="text-sm text-gray-600">{item.rating || 5}</span>
                                        </div>
                                    </div>

                                    {/* Mô tả */}
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {item.description}
                                    </p>

                                    {/* Thông tin */}
                                    <div className="flex gap-2 mb-4">
                                        <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                                            ⏱️ {item.preparationTime || 30} phút
                                        </span>
                                        <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                                            👥 {item.numReviews || 8888} đánh giá
                                        </span>
                                    </div>

                                    {/* Giá và hành động */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg font-bold text-amber-600">
                                                {item.price.toLocaleString()}₫
                                            </span>
                                            {item.discount > 0 && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    {(item.price * (1 + item.discount / 100)).toLocaleString()}₫
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Điều khiển số lượng */}
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, -1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center">{quantities[item.id]}</span>
                                                <button
                                                    onClick={() => handleQuantityChange(item.id, 1)}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            {/* Nút thêm vào giỏ */}
                                            <button
                                                onClick={() => handleAddToCart(item.id)}
                                                disabled={addingToCart[item.id]}
                                                className={`
                                                    px-4 py-2 rounded-lg font-medium text-white
                                                    ${addingToCart[item.id]
                                                    ? 'bg-amber-400 cursor-not-allowed'
                                                    : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
                                                }
                                                    transition-colors duration-200
                                                `}
                                            >
                                                {addingToCart[item.id] ? (
                                                    <span className="flex items-center gap-2">
                                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Đang thêm...
                                                    </span>
                                                ) : (
                                                    'Đặt ngay'
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}