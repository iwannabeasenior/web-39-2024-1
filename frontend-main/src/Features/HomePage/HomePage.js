import Header from "../../components/HomePage/header"
import HeroSection from "../../components/HomePage/heroSection"
import Menu from "../../components/HomePage/menu"
import WhyChoseUs from "../../components/HomePage/whyChoseUs"
export default function HomePage() {
    console.log("check thanh")
    const navLinks = [
        { path: '/', label: 'Trang chủ' },
        { path: '/menu', label: 'Thực đơn' },
        { path: '/reservation', label: 'Đặt bàn' },
        { path: '/contact', label: 'Liên hệ' },
    ];
    return (
        <div>
            <div>
                <Header logo="/Assets/Header/logoRestaurant.png" navLinks={navLinks} cl />
                <HeroSection />
                <Menu />
                <WhyChoseUs />
                 Các thành phần khác
            </div>
        </div>
    )
}