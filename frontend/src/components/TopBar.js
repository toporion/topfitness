import React, { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import UseAuth from '../hook/UseAuth';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { logOutUser } = UseAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logOutUser();
        navigate('/login');
    };

    return (
        // Changed background, border, and made it sticky
        <header className="bg-gray-800 h-16 px-6 flex justify-between items-center border-b border-gray-700 sticky top-0 z-10">
            {/* Changed text color */}
            <div>
                <h1 className="text-xl font-bold text-gray-100">Dashboard</h1>
            </div>

            {/* Right Side: Search, Notifications, and User Menu */}
            <div className="flex items-center gap-4 sm:gap-6">
                {/* 🔍 Search Bar - Styled for dark theme */}
                <div className="relative hidden md:block">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        // Updated colors and added reddish focus ring
                        className="pl-10 pr-4 py-2 w-64 rounded-full border border-gray-600 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    />
                </div>

                {/* 🔔 Notifications - Styled for dark theme */}
                <div className="relative">
                    <button className="p-2 rounded-full hover:bg-gray-700 text-gray-300">
                        <Bell size={20} />
                    </button>
                    {/* Notification dot */}
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-gray-800"></span>
                </div>

                {/* 👤 User Menu - Styled for dark theme */}
                <div className="relative">
                    <button
                        onClick={() => setIsDropdownOpen(prev => !prev)}
                        className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-700"
                    >
                        <img
                            src="https://placehold.co/40x40/f8fafc/111827?text=JD"
                            alt="User Avatar"
                            className="w-9 h-9 rounded-full"
                        />
                        <span className="hidden sm:block font-semibold text-gray-200">John Doe</span>
                        <ChevronDown size={16} className={`text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu - Styled for dark theme */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-xl py-1 z-20 border border-gray-700">
                            <a href="#profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Profile</a>
                            <a href="#settings" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Settings</a>
                            <div className="my-1 h-px bg-gray-700"></div>
                            <a onClick={handleLogout} href="#logout" className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">Log Out</a>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default TopBar;