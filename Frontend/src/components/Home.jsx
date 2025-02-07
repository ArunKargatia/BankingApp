import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const Home = () => {

    const { isAuthenticated } = useAuth()

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
          {/* Hero Section */}
          <div className="text-center p-8">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Welcome to Your Banking App
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Manage your finances with ease. View your accounts, track transactions, and more.
            </p>
    
            <div className="flex justify-center space-x-6">
              {!isAuthenticated && (  // Only show buttons if the user is not authenticated
                <>
                  <Link
                    to="/signin"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg text-lg hover:bg-gray-700 transition duration-300"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
    
          {/* Features Section */}
          <div className="bg-white w-full py-12 px-4">
            <div className="container mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Features of Our App
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Feature 1 */}
                <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-blue-600 mb-4">View Accounts</h3>
                  <p className="text-gray-600">
                    Easily manage and view your bank accounts with real-time balances.
                  </p>
                </div>
                {/* Feature 2 */}
                <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-blue-600 mb-4">Track Transactions</h3>
                  <p className="text-gray-600">
                    Stay updated with your transaction history and current activities.
                  </p>
                </div>
                {/* Feature 3 */}
                <div className="bg-blue-50 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold text-blue-600 mb-4">Security First</h3>
                  <p className="text-gray-600">
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
