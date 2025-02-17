import React, { useState } from 'react'
import backendUrl from '../BackendUrlConfig'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const SignIn = () => {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("")
    const navigate = useNavigate();
    const { login, isDarkMode } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage("")

        try {
            const response = await backendUrl.post('/public/login', {
                userName, 
                password
            })
            const token = response.data
            // console.log("token : ", token);

            if (token) {
                login(token)
                setSuccessMessage("You have successfully signed in! Redirecting...")
                setTimeout(() => {
                  navigate("/accounts")
                }, 1000)
            }
        } catch (err) {
            setError("Invalid username or password.")
        }
    }

    return (
        <div
          className={`${
            isDarkMode ? "bg-gray-900" : "bg-gray-100"
          } flex justify-center items-center h-screen`}
        >
            <div
              className={`${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white"
              } p-6 rounded-lg shadow-md w-96`}
            >
                <h2
                  className={`${
                    isDarkMode ? "text-white" : "text-gray-800"
                  } text-2xl font-bold text-center mb-4`}
                >
                  Sign In
                </h2>
                {error && (
                  <p
                    className={`${
                      isDarkMode ? "text-red-400" : "text-red-600"
                    } text-center mb-4`}
                  >
                    {error}
                  </p>
                )}
                {successMessage && (
                  <p
                    className={`${
                      isDarkMode ? "text-green-400" : "text-green-600"
                    } text-center mb-4`}
                  >
                    {successMessage}
                  </p>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label
                          htmlFor="username"
                          className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          } block text-sm font-medium`}
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className={`${
                              isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50"
                            } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label
                          htmlFor="password"
                          className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          } block text-sm font-medium`}
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`${
                              isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50"
                            } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={`${
                          isDarkMode ? "bg-blue-500" : "bg-blue-600"
                        } w-full py-2 px-4 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        Sign In
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p
                      className={`${
                        isDarkMode ? "text-gray-400" : "text-gray-600"
                      } text-sm`}
                    >
                        Don't have an account?{' '}
                        <Link
                          to="/register"
                          className={`${
                            isDarkMode ? "text-blue-400" : "text-blue-600"
                          } hover:underline`}
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
  }

export default SignIn