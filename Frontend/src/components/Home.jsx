import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Home = () => {

  const { isAuthenticated, isDarkMode } = useAuth();

  return (
    <div
      className={`${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      } min-h-screen flex flex-col justify-center items-center`}
    >
      {/* Hero Section */}
      <div className="text-center py-16 px-4 md:px-8">
        <h1
          className={`text-5xl font-extrabold mb-6 ${
            isDarkMode ? "text-blue-400" : "text-blue-600"
          }`}
        >
          Welcome to Your Banking App
        </h1>
        <p
          className={`text-xl mb-8 max-w-xl mx-auto ${
            isDarkMode ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Manage your finances effortlessly. View your accounts, track your transactions, and more.
        </p>

        <div className="flex justify-center space-x-6">
          {!isAuthenticated && (
            <>
              <Link
                to="/signin"
                className={`${
                  isDarkMode ? "bg-blue-500" : "bg-blue-600"
                } text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition duration-300`}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className={`${
                  isDarkMode ? "bg-gray-600" : "bg-gray-600"
                } text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-gray-700 transition duration-300`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } w-full py-16 px-4`}
      >
        <div className="container mx-auto text-center">
          <h2
            className={`text-3xl font-bold mb-12 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Features of Our App
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div
              className={`${
                isDarkMode ? "bg-gray-700" : "bg-blue-50"
              } p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105`}
            >
              <h3
                className={`${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } text-2xl font-semibold mb-4`}
              >
                View Accounts
              </h3>
              <p className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Easily manage and view your bank accounts with real-time balances.
              </p>
            </div>
            {/* Feature 2 */}
            <div
              className={`${
                isDarkMode ? "bg-gray-700" : "bg-blue-50"
              } p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105`}
            >
              <h3
                className={`${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } text-2xl font-semibold mb-4`}
              >
                Track Transactions
              </h3>
              <p className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Stay updated with your transaction history and current activities.
              </p>
            </div>
            {/* Feature 3 */}
            <div
              className={`${
                isDarkMode ? "bg-gray-700" : "bg-blue-50"
              } p-8 rounded-lg shadow-lg transform transition duration-300 hover:scale-105`}
            >
              <h3
                className={`${
                  isDarkMode ? "text-blue-400" : "text-blue-600"
                } text-2xl font-semibold mb-4`}
              >
                Security First
              </h3>
              <p className={`${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}>
                Your security is our top priority with advanced encryption and protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
