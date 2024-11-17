import DeliveryHeader from "../../components/Menu/deliveryHeader"
import CategoryNavigation from "../../components/Menu/categoryNavigation"
import MenuItem from "../../components/Menu/menuItem"
export default function Menu() {
    return (
        <div><DeliveryHeader />
            <CategoryNavigation />
            <MenuItem/>
        </div>

    )
}