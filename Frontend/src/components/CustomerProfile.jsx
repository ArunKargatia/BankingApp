import React, { useState, useEffect } from 'react';
import backendUrl from '../BackendUrlConfig';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const CustomerProfile = () => {
    const { getCustomerIdFromToken, isAuthenticated } = useAuth();
    const customerId = getCustomerIdFromToken();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [phone, setPhone] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [address, setAddress] = useState('');
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        if (!isAuthenticated || !customerId) {
            navigate('/signin');
        } else {
            fetchUserProfile();
        }
    }, [isAuthenticated, customerId, navigate]);

    const fetchUserProfile = async () => {
        try {
            const response = await backendUrl.get(`/id/${customerId}`);
            const { name, email, userName, phone, profilePicture, dateOfBirth, address } = response.data;
            setName(name);
            setEmail(email);
            setUserName(userName);
            setPhone(phone);
            setProfilePicture(profilePicture);
            setDateOfBirth(dateOfBirth);
            setAddress(address);
        } catch (err) {
            setError('Failed to fetch profile details.');
            console.error(err);
        }
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        const updatedData = {
            name,
            email,
            userName,
            phone,
            dateOfBirth,
            address
        };

        const formData = new FormData();
        formData.append('updatedCustomer', new Blob([JSON.stringify(updatedData)], { type: 'application/json' }));

        if (profilePicture) {
            formData.append('file', profilePicture);
        }

        try {
            const response = await backendUrl.put(`/id/${customerId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                setSuccessMessage('Profile updated successfully!');
                setTimeout(() => {
                    navigate(`/profile`);
                }, 3000);
            }
        } catch (err) {
            setError('Failed to update profile. Please try again!');
            console.error(err);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold text-center mb-4">Edit Profile</h2>

                {error && <p className="text-red-600 text-center mb-4">{error}</p>}
                {successMessage && <p className="text-green-600 text-center mb-4">{successMessage}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            disabled
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            type="text"
                            id="userName"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                            type="text"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                        <input
                            type="file"
                            id="profilePicture"
                            onChange={handleProfilePictureChange}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
                    >
                        Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CustomerProfile;
