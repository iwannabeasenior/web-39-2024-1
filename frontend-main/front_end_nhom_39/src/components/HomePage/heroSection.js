import "../../global.css"

export default function HeroSection() {
    return (
        <div className="min-h-screen flex items-center justify-between px-4 md:px-20 py-12 bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="flex flex-col gap-6 max-w-xl items-center">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
                    Enjoy
                    <span className="text-orange-500 block mt-2">Delicious food</span> 
                    in your healthy life
                </h1>
                
                <p className="text-lg md:text-xl text-gray-600">
                    Mon an rat ngon
                </p>

                <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-full w-fit transition-all duration-300 shadow-lg hover:shadow-xl">
                    Visit now
                </button>
            </div>

            <div className="hidden md:block">
                <img 
                    src="../../Assets/HomePage/breadsup.jpg" 
                    alt="Delicious breads"
                    className="w-[500px] h-[500px] object-cover rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300"
                />
            </div>
        </div>
    )
}