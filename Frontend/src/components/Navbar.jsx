import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext"
import { FaUserCircle, FaSignOutAlt, FaSun, FaMoon } from "react-icons/fa";
import { Tooltip } from 'react-tooltip';

const Navbar = () => {
  const { isAuthenticated, logout, isDarkMode, toggleDarkMode } = useAuth();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const navigate = useNavigate();
    const location = useLocation()

    const handleLogout = () => {
        logout();
        navigate("/")
    }

    const showAuthButtons = 
      location.pathname !== "/signin" && 
      location.pathname !== "/register" && 
      location.pathname !== "/";

      return (
        <nav
          className={`bg-white shadow-md p-4 ${isDarkMode ? "dark:bg-gray-800" : ""}`}
        >
          <div
            className={`flex justify-between items-center container mx-auto ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            <div className="flex items-center space-x-6">
              <Link
                to="/"
                className="font-bold text-xl hover:text-blue-800 transition duration-300"
              >
                Banking App
              </Link>
    
              {isAuthenticated && (
                <>
                  <Link
                    to="/accounts"
                    className="hover:text-blue-600 transition duration-300"
                  >
                    Accounts
                  </Link>
                </>
              )}
            </div>
    
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle with Icons */}
              <button
                onClick={toggleDarkMode}
                className="p-2 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-300"
              >
                {isDarkMode ? (
                   <FaSun className="text-yellow-600" />
                ) : (
                  <FaMoon className="text-blue-700" />
                )}
              </button>
    
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="hover:text-blue-600 transition duration-300"
                  >
                    <FaUserCircle className="text-3xl" />
                  </Link>
    
                  <button
                    onClick={handleLogout}
                    data-tooltip-id="logout-tooltip"
                    data-tooltip-content="Log Out"
                    className="flex items-center bg-red-600 text-white p-3 rounded-md hover:bg-red-700 transition duration-300"
                  >
                    <FaSignOutAlt className="text-lg" />
                  </button>
                  <Tooltip id="logout-tooltip" />
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
    
            {/* Hamburger menu for mobile */}
            <div className="block lg:hidden">
              <button
                className="text-blue-600"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <i className="fas fa-bars"></i>
              </button>
            </div>
    
            {/* Mobile menu */}
            {showMobileMenu && (
              <div className="lg:hidden absolute top-0 left-0 w-full bg-white p-4">
                <Link to="/accounts" className="block p-2">
                  Accounts
                </Link>
                <Link to="/profile" className="block p-2">
                  Profile
                </Link>
                <Link to="/signin" className="block p-2">
                  Sign In
                </Link>
                <Link to="/register" className="block p-2">
                  Register
                </Link>
                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 mt-2"
                  >
                    Log Out
                  </button>
                )}
              </div>
            )}
          </div>
        </nav>
      );
    };
    
export default Navbar;