import React from 'react';
import { Link } from 'react-router-dom';
import '../../../src/global.css'


export default function Header({ logo, navLinks }) {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);

    return (
        <header className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <div className="h-10">
                    <img src={logo} alt="Restaurant Logo" className='h-10' />
                </div>
                <nav className="header__nav">
                    <ul className="flex gap-6 list-none">
                        {navLinks.map((link, index) => (
                            <li key={index}>
                                <Link 
                                    to={link.path} 
                                    className="text-gray-800 no-underline font-medium transition-colors duration-300 hover:text-blue-500"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>

            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                        <span className="text-gray-700">Welcome, User!</span>
                        <Link 
                            to="/" 
                            onClick={() => setIsLoggedIn(false)}
                            className="px-4 py-2 text-red-500 border border-red-500 rounded-md hover:bg-red-50 transition-colors duration-300"
                        >
                            Logout
                        </Link>
                    </div>
                ) : (
                    <>
                        <Link 
                            to="/login"
                            className="px-4 py-2 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-50 transition-colors duration-300"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/register"
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-300"
                        >
                            Register
                        </Link>
                    </>
                )}
            </div>
        </header>
    )
}