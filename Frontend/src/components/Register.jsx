import React, { useState } from 'react'
import backendUrl from '../BackendUrlConfig'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const navigate = useNavigate();
    const { isDarkMode } = useAuth();

    const handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setProfilePicturePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null)
        setSuccessMessage("")

        if (password !== confirmPassword) {
            setError('Passwords do not match!');
            return;
        }

        const customerData = {
            name,
            email,
            userName,
            password,
            phone,
            dateOfBirth,
            address
        }

        const formData = new FormData();
        formData.append('customer', new Blob([JSON.stringify(customerData)], { type: 'application/json' }));

        if (profilePicture) {
            formData.append('file', profilePicture);
        }

        try {
            const response = await backendUrl.post('/public/register', formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            });
      
            if (response.data) {
              setSuccessMessage('Registration successful! You can now sign in.');
              setTimeout(() => {
                navigate('/signin')
              }, 3000)
            }
        } catch (err) {
            setError('Failed to register. Please try again!');
            console.error(err);
        }
    }

    return (
        <div className={`${
            isDarkMode ? "bg-gray-900" : "bg-gray-100"
        } flex justify-center items-center h-screen`}>
            <div className={`${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white"
            } p-6 rounded-lg shadow-md w-96`}>
                <h2 className={`${
                    isDarkMode ? "text-white" : "text-gray-800"
                } text-2xl font-bold text-center mb-4`}>
                    Register
                </h2>

                {profilePicturePreview && (
                    <div className="flex justify-center mb-4">
                        <img
                            src={profilePicturePreview}
                            alt="Profile Preview"
                            className="w-24 h-24 rounded-full object-cover"
                        />
                    </div>
                )}

                {error && <p className={`${
                    isDarkMode ? "text-red-400" : "text-red-600"
                } text-center mb-4`}>{error}</p>}
                {successMessage && <p className={`${
                    isDarkMode ? "text-green-400" : "text-green-600"
                } text-center mb-4`}>{successMessage}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        } block text-sm font-medium`}>
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`${
                                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50"
                            } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        } block text-sm font-medium`}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`${
                                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50"
                            } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="userName" className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        } block text-sm font-medium`}>
                            Username
                        </label>
                        <input
                            type="text"
                            id="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className={`${
                                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50"
                            } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        } block text-sm font-medium`}>
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

                    <div className="mb-4">
                        <label htmlFor="confirmPassword" className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        } block text-sm font-medium`}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`${
                                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50"
                            } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        } block text-sm font-medium`}>
                            Phone
                        </label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`${
                                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50"
                            } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dateOfBirth" className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        } block text-sm font-medium`}>
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className={`${
                                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50"
                            } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        } block text-sm font-medium`}>
                            Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={`${
                                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50"
                            } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="profilePicture" className={`${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                        } block text-sm font-medium`}>
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            id="profilePicture"
                            onChange={handleProfilePictureChange}
                            className={`${
                                isDarkMode ? "bg-gray-700 text-white" : "bg-gray-50"
                            } w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`${
                            isDarkMode ? "bg-blue-500" : "bg-blue-600"
                        } w-full py-2 px-4 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register