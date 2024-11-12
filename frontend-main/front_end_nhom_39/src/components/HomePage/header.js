import React from 'react';
import { Link } from 'react-router-dom';
import '../../../src/global.css'
export default function Header({ logo, navLinks }) {
    return (
        <header className="flex items-center justify-start p-4 bg-white shadow-sm gap-2 sticky top-0 z-10">
            <div className="h-10">
                <img src={logo} alt="Restaurant Logo" className='h-10' />
            </div>
            <nav className="header__nav">
                <ul className="flex gap-6 list-none">
                    {navLinks.map((link, index) => (
                        <li key={index}>
                            <Link to={link.path} className="text-gray-800 no-underline font-medium transition-colors duration-300 hover:text-blue-500">
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    )
}