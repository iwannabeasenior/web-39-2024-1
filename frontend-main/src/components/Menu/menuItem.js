import React, { useState } from 'react';

export default function MenuItems() {
    // Sample menu items data
    const menuItems = [
        {
            id: 1,
            name: "Phở Bò Đặc Biệt",
            description: "Phở bò với các loại thịt bò tươi ngon, nước dùng đậm đà nấu từ xương bò trong 24 giờ",
            price: 89000,
            image: "/Assets/Menu/mon1.jpg",
            rating: 4.8,
            numReviews: 245,
            isPopular: true,
            category: "noodles",
            preparationTime: "15-20",
            isAvailable: true,
            discount: 10,
        },
        {
            id: 2,
            name: "Cơm Gà Xối Mỡ",
            description: "Cơm gà với da gà giòn rụm, thịt gà mềm ngọt, ăn kèm với nước mắm tỏi ớt đặc biệt",
            price: 75000,
            image: "/Assets/Menu/mon2.jpg",
            rating: 4.6,
            numReviews: 189,
            isPopular: true,
            category: "rice",
            preparationTime: "10-15",
            isAvailable: true,
            discount: 0,
        },
        {
            id: 3,
            name: "Bún Chả Hà Nội",
            description: "Bún chả với thịt nướng thơm lừng, chả viên đậm đà, nước mắm chua ngọt truyền thống",
            price: 65000,
            image: "/Assets/Menu/mon3.jpg",
            rating: 4.7,
            numReviews: 156,
            isPopular: false,
            category: "noodles",
            preparationTime: "15-20",
            isAvailable: true,
            discount: 15,
        },
        {
            id: 4,
            name: "Trà Sữa Trân Châu",
            description: "Trà sữa thơm béo với trân châu đen dẻo dai, có thể điều chỉnh độ ngọt theo ý thích",
            price: 45000,
            image: "/Assets/Menu/mon3.jpg",
            rating: 4.5,
            numReviews: 320,
            isPopular: true,
            category: "drinks",
            preparationTime: "5-10",
            isAvailable: true,
            discount: 0,
        },
        {
            id: 4,
            name: "Trà Sữa Trân Châu",
            description: "Trà sữa thơm béo với trân châu đen dẻo dai, có thể điều chỉnh độ ngọt theo ý thích",
            price: 45000,
            image: "/Assets/Menu/mon3.jpg",
            rating: 4.5,
            numReviews: 320,
            isPopular: true,
            category: "drinks",
            preparationTime: "5-10",
            isAvailable: true,
            discount: 0,
        },
        {
            id: 4,
            name: "Trà Sữa Trân Châu",
            description: "Trà sữa thơm béo với trân châu đen dẻo dai, có thể điều chỉnh độ ngọt theo ý thích",
            price: 45000,
            image: "/Assets/Menu/mon3.jpg",
            rating: 4.5,
            numReviews: 320,
            isPopular: true,
            category: "drinks",
            preparationTime: "5-10",
            isAvailable: true,
            discount: 0,
        },
        {
            id: 4,
            name: "Trà Sữa Trân Châu",
            description: "Trà sữa thơm béo với trân châu đen dẻo dai, có thể điều chỉnh độ ngọt theo ý thích",
            price: 45000,
            image: "/Assets/Menu/mon3.jpg",
            rating: 4.5,
            numReviews: 320,
            isPopular: true,
            category: "drinks",
            preparationTime: "5-10",
            isAvailable: true,
            discount: 0,
        },
    ];

    // State for cart quantities
    const [quantities, setQuantities] = useState(
        Object.fromEntries(menuItems.map(item => [item.id, 1]))
    );
    const [addingToCart, setAddingToCart] = useState(
        Object.fromEntries(menuItems.map(item => [item.id, false]))
    );

    const handleQuantityChange = (itemId, delta) => {
        setQuantities(prev => ({
            ...prev,
            [itemId]: Math.max(1, prev[itemId] + delta)
        }));
    };

    const handleAddToCart = (itemId) => {
        setAddingToCart(prev => ({ ...prev, [itemId]: true }));
        // Simulate API call
        setTimeout(() => {
            setAddingToCart(prev => ({ ...prev, [itemId]: false }));
            setQuantities(prev => ({ ...prev, [itemId]: 1 }));
        }, 1000);
    };

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <div className="container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map(item => (
                        <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            {/* Image Section */}
                            <div className="relative">
                                <img
                                    className="w-full h-48 object-cover"
                                    src={item.image}
                                    alt={item.name}
                                />
                                
                                {/* Badges */}
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

                            {/* Content Section */}
                            <div className="p-4">
                                {/* Title and Rating */}
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                                    <div className="flex items-center">
                                        <span className="text-amber-500 mr-1">⭐</span>
                                        <span className="text-sm text-gray-600">{item.rating}</span>
                                    </div>
                                </div>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {item.description}
                                </p>

                                {/* Info Tags */}
                                <div className="flex gap-2 mb-4">
                                    <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                                        ⏱️ {item.preparationTime} phút
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded-full">
                                        👥 {item.numReviews} đánh giá
                                    </span>
                                </div>

                                {/* Price and Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-amber-600">
                                            {item.price.toLocaleString()}₫
                                        </span>
                                        {item.discount > 0 && (
                                            <span className="text-sm text-gray-400 line-through">
                                                {(item.price * (1 + item.discount/100)).toLocaleString()}₫
                                            </span>
                                        )}
                                    </div>

                                    {item.isAvailable ? (
                                        <div className="flex items-center gap-2">
                                            {/* Quantity Controls */}
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

                                            {/* Add to Cart Button */}
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
                                                    'Thêm vào giỏ'
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-red-500 text-sm font-medium">
                                            Tạm hết hàng
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}