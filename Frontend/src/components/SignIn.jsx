import React, { useState } from 'react'
import backendUrl from '../BackendUrlConfig'

const SignIn = () => {

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [token, setToken] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await backendUrl.post('/public/login', {
                userName, 
                password
            })

            const token = response.data
            console.log("token : ", token);

            if (token) {
                setToken(token)
                localStorage.setItem('token', token)
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

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
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
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
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

        {token && (
          <div className="mt-4 text-green-600 text-center">
            <p className="text-green-600 text-center mt-4">
                <span className="font-semibold">Success!</span> Your authentication token has been generated successfully.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignIn