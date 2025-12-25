import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <div className="text-2xl font-bold text-primary-600">🚀 LaunchPilot</div>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    {isAuthenticated && (
                        <div className="flex items-center space-x-4">
                            <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                                Dashboard
                            </Link>
                            <Link to="/launches" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                                Launches
                            </Link>
                            <Link to="/partners" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                                Partners
                            </Link>
                            <Link to="/analytics" className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md font-medium">
                                Analytics
                            </Link>

                            {/* User Menu */}
                            <div className="flex items-center space-x-3">
                                <span className="text-gray-700 text-sm">{user?.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="btn-secondary text-sm"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    )}

                    {!isAuthenticated && (
                        <div className="flex items-center space-x-3">
                            <Link to="/login" className="btn-secondary text-sm">
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary text-sm">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
