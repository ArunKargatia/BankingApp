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
    const { login } = useAuth()

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
            console.log("token : ", token);

            if (token) {
                login(token)
                setSuccessMessage("You have successfully signed in! Redirecting...")
                setTimeout(() => {
                  navigate("/accounts")
                }, 1500)
            }
        } catch (err) {
            setError("Invalid username or password.")
        }
    }

    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
              <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>
              {error && <p className="text-red-600 text-center mb-4">{error}</p>}
              {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}
              <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                          Username
                      </label>
                      <input
                          type="text"
                          id="username"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                      />
                  </div>
                  <div className="mb-4">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                          Password
                      </label>
                      <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                      />
                  </div>
                  <button
                      type="submit"
                      className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                      Sign In
                  </button>
              </form>
              <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-blue-600 hover:underline">
                          Register here
                      </Link>
                  </p>
              </div>
          </div>
      </div>
  );
}

export default SignIn