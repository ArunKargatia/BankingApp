import React, { useState, useEffect } from 'react';
import backendUrl from '../BackendUrlConfig';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaPen } from 'react-icons/fa';

const CustomerProfile = () => {
    const { token, isDarkMode } = useAuth();
    const { getCustomerIdFromToken, isAuthenticated } = useAuth();
    const customerId = getCustomerIdFromToken();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (isAuthenticated === undefined) return;
        if (!isAuthenticated || !customerId) {
            navigate('/signin');
        } else {
            fetchUserProfile();
        }
    }, [isAuthenticated, customerId, navigate]);

    const fetchUserProfile = async () => {
        if (!token) {
            console.error("No token available!");
            setError('Authentication token is missing');
            navigate('/signin');
            return;
        }

        try {
            const response = await backendUrl.get(`/customer/id/${customerId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            const { name, email, userName, phone, profilePicture, dateOfBirth, address } = response.data;
            setName(name);
            setEmail(email);
            setUserName(userName);
            setPhone(phone);
            setDateOfBirth(dateOfBirth);
            setAddress(address);

            if (profilePicture) {  
                setProfilePicture(profilePicture);
                setProfilePicturePreview(profilePicture);    
            }

        } catch (err) {
            setError('Failed to fetch profile details.');
            console.error(err);
        }
    };

    const handleProfilePictureChange = (e) => {
        const newProfilePicture = e.target.files[0];
        if (newProfilePicture) {
        setProfilePicturePreview(URL.createObjectURL(newProfilePicture));
        setProfilePicture(newProfilePicture);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        try {
            let uploadedImageUrl = profilePicture;
            if (profilePicture instanceof File) {
                const formData = new FormData();
                formData.append('file', profilePicture);
                const uploadResponse = await backendUrl.post('/customer/upload-profile-picture', formData, {
                    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
                });
                uploadedImageUrl = uploadResponse.data.split(': ')[1];
            }

            const updatedData = {
                name,
                email,
                userName,
                phone,
                dateOfBirth,
                address,
                profilePicture: uploadedImageUrl,
            };

            const response = await backendUrl.put(`/customer/id/${customerId}`, updatedData, {
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });

            if (response.data) {
                setSuccessMessage('Profile updated successfully!');
                setTimeout(() => navigate(`/profile`), 1500);
            }
        } catch (err) {
            setError('Failed to update profile. Please try again!');
            console.error(err);
        }
    };

    return (
        <div
            className={`${
                isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
            } flex justify-center items-center h-screen`}
        >
            <div
                className={`${
                    isDarkMode ? "bg-gray-800" : "bg-white"
                } p-6 rounded-lg shadow-md w-96`}
            >
                <h2
                    className={`${
                        isDarkMode ? "text-white" : "text-gray-800"
                    } text-2xl font-bold text-center mb-4`}
                >
                    Edit Profile
                </h2>

                {error && <p className={`${isDarkMode ? "text-red-400" : "text-red-600"} text-center mb-4`}>{error}</p>}
                {successMessage && <p className={`${isDarkMode ? "text-green-400" : "text-green-600"} text-center mb-4`}>{successMessage}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Profile Picture */}
                    <div className="flex flex-col items-center mb-4 relative">
                        <img
                            src={profilePicturePreview || profilePicture || "https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid"}
                            alt="Profile"
                            className="w-24 h-24 rounded-full border border-gray-300 mb-2"
                        />
                        <button
                            type="button"
                            onClick={() => document.getElementById("profilePictureInput").click()}
                            className="absolute bottom-0 right-0 bg-gray-500 text-white rounded-full p-1 text-sm"
                        >
                            <FaPen />
                        </button>
                        <input
                            type="file"
                            id="profilePictureInput"
                            onChange={handleProfilePictureChange}
                            className="hidden"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="name" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} block text-sm font-medium`}>Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"} w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} block text-sm font-medium`}>Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            className={`${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"} w-full p-2 mt-1 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed`}
                            disabled
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="userName" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} block text-sm font-medium`}>Username</label>
                        <input
                            type="text"
                            id="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className={`${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"} w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} block text-sm font-medium`}>Phone</label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className={`${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"} w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dateOfBirth" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} block text-sm font-medium`}>Date of Birth</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className={`${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"} w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} block text-sm font-medium`}>Address</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={`${isDarkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"} w-full p-2 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`${isDarkMode ? "bg-blue-500" : "bg-blue-600"} w-full py-2 px-4 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomerProfile
