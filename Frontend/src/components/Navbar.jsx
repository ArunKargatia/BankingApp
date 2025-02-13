import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth()
    const navigate = useNavigate();
    const location = useLocation()

    const handleLogout = () => {
        logout();
        navigate("/signin")
    }

    const showAuthButtons = 
      location.pathname !== "/signin" && 
      location.pathname !== "/register" && 
      location.pathname !== "/";

      return (
        <nav className="bg-white shadow-md p-4">
            <div className="flex justify-between items-center container mx-auto">
                <div className="flex items-center space-x-6">
                    <Link
                        to="/"
                        className="text-blue-600 font-bold text-xl hover:text-blue-800 transition duration-300"
                    >
                        Banking App
                    </Link>

                    {isAuthenticated && (
                        <>
                            <Link
                                to="/accounts"
                                className="text-gray-800 hover:text-blue-600 transition duration-300"
                            >
                                Accounts
                            </Link>
                            <Link
                                to="/transactions"
                                className="text-gray-800 hover:text-blue-600 transition duration-300"
                            >
                                Transactions
                            </Link>
                            <Link
                                to="/profile"
                                className="text-gray-800 hover:text-blue-600 transition duration-300"
                            >
                                Profile
                            </Link>
                        </>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300"
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        showAuthButtons && (
                            <>
                                <Link
                                    to="/signin"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300"
                                >
                                    Register
                                </Link>
                            </>
                        )
                    )}
                </div>
            </div>
        </nav>
    );
};
    
export default Navbar;