import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeliveryHeader() {
    // States for managing UI interactions
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navigate = useNavigate();

    // Sample user data - replace with actual user data from your auth system
    const user = {
        name: "Nguyễn Văn A",
        avatar: "https://placehold.co/40x40",
        phone: "0123.456.789"
    };

    return (
        <div className="relative">
            {/* Main Header */}
            <div className="bg-white shadow-md">
                {/* Top Bar */}
                <div className="container mx-auto px-4">
                    <div className="h-16 flex items-center justify-between">
                        {/* Left Section - Logo & Location */}
                        <div className="flex items-center gap-2 md:gap-8">
                            {/* Mobile Menu Button */}
                            <button 
                                className="md:hidden text-gray-600 hover:text-amber-600"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                <i className="fas fa-bars text-xl"></i>
                            </button>

                            {/* Logo */}
                            <div 
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => navigate('/')}
                            >
                                <span className="text-2xl text-amber-600">🍜</span>
                                <span className="text-xl font-bold text-amber-800 hidden md:block">
                                    Trang chủ
                                </span>
                            </div>

                            {/* Location Selector */}
                            <div className="hidden md:flex items-center gap-2 text-gray-600 hover:text-amber-600 cursor-pointer">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>Hà Nội</span>
                                <i className="fas fa-chevron-down text-xs"></i>
                            </div>
                        </div>

                        {/* Center Section - Search Bar (Desktop) */}
                        <div className="hidden md:block flex-1 max-w-xl mx-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm món ăn yêu thích..."
                                    className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>
                        </div>

                        {/* Right Section - Cart & User */}
                        <div className="flex items-center gap-4">
                            {/* Mobile Search Button */}
                            <button 
                                className="md:hidden text-gray-600 hover:text-amber-600"
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                            >
                                <i className="fas fa-search text-xl"></i>
                            </button>

                            {/* Cart Button */}
                            <button 
                                className="relative text-gray-600 hover:text-amber-600"
                                onClick={() => setIsCartOpen(!isCartOpen)}
                            >
                                <i className="fas fa-shopping-cart text-xl"></i>
                                {cartItems.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                        {cartItems.length}
                                    </span>
                                )}
                            </button>

                            {/* User Menu */}
                            <div className="hidden md:flex items-center gap-2 cursor-pointer">
                                <img 
                                    src={user.avatar} 
                                    alt="User avatar" 
                                    className="w-8 h-8 rounded-full"
                                />
                                <span className="text-gray-600">{user.name}</span>
                                <i className="fas fa-chevron-down text-xs text-gray-600"></i>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                {isSearchOpen && (
                    <div className="md:hidden border-t border-gray-200 p-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Tìm kiếm món ăn..."
                                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <i className="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white shadow-lg z-50 md:hidden">
                    <div className="p-4 space-y-4">
                        {/* User Info */}
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                            <img 
                                src={user.avatar} 
                                alt="User avatar" 
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <div className="font-semibold">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.phone}</div>
                            </div>
                        </div>

                        {/* Menu Items */}
                        <div className="space-y-3">
                            <a href="#orders" className="flex items-center gap-3 text-gray-600 hover:text-amber-600">
                                <i className="fas fa-clock w-6"></i>
                                <span>Đơn hàng của tôi</span>
                            </a>
                            <a href="#favorites" className="flex items-center gap-3 text-gray-600 hover:text-amber-600">
                                <i className="fas fa-heart w-6"></i>
                                <span>Món ăn yêu thích</span>
                            </a>
                            <a href="#addresses" className="flex items-center gap-3 text-gray-600 hover:text-amber-600">
                                <i className="fas fa-map-marker-alt w-6"></i>
                                <span>Địa chỉ đã lưu</span>
                            </a>
                            <a href="#settings" className="flex items-center gap-3 text-gray-600 hover:text-amber-600">
                                <i className="fas fa-cog w-6"></i>
                                <span>Cài đặt tài khoản</span>
                            </a>
                            <button className="flex items-center gap-3 text-red-600 w-full">
                                <i className="fas fa-sign-out-alt w-6"></i>
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Sidebar */}
            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    {/* Overlay */}
                    <div 
                        className="absolute inset-0 bg-black/50"
                        onClick={() => setIsCartOpen(false)}
                    ></div>
                    
                    {/* Cart Content */}
                    <div className="relative w-full max-w-md bg-white h-full">
                        <div className="p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Giỏ hàng</h2>
                                <button 
                                    className="text-gray-400 hover:text-gray-600"
                                    onClick={() => setIsCartOpen(false)}
                                >
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>

                        {cartItems.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)]">
                                <span className="text-6xl mb-4">🛒</span>
                                <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
                            </div>
                        ) : (
                            <div className="p-4">
                                {/* Cart items would go here */}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}