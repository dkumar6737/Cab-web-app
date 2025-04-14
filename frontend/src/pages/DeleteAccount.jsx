import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DeleteAccount() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const goHome = () => {
        navigate("/home");
    };

    const handleDelete = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        try {
            const token = localStorage.getItem('token'); // Get user token
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/delete-account`, { password }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.status === 200) {
                alert("Account deleted successfully.");
                localStorage.removeItem('token'); // Remove token
                navigate("/"); // Redirect to homepage or login
            }
        } catch (err) {
            setError(err.response?.data?.message || "Error deleting account");
        }
    };

    return (
        <div className="min-h-screen h-full bg-white text-black">
            <div className="bg-gray-100 p-8 rounded-lg shadow-lg w-full sm:w-96 mx-auto mt-1">
            <button
          onClick={goHome}
          className="absolute top-4 right-4 h-10 w-10 bg-gray-100  flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </button>
                <h2 className="text-3xl font-bold text-center mb-6">Delete Account</h2>
                <p className="text-gray-600 text-center mb-4">
                    Are you sure you want to delete your account? Please confirm by entering your password.
                </p>

                {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Enter your Password"
                        className="w-full p-3 bg-gray-200 border border-gray-400 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-4">
                    <input
                        type="password"
                        placeholder="Confirm your Password"
                        className="w-full p-3 bg-gray-200 border border-gray-400 rounded-lg text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button
                    className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-300"
                    onClick={handleDelete}
                >
                    Delete Account
                </button>
                <button
                    className="w-full py-3 mt-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition duration-300"
                    onClick={() => navigate("/home")}
                >
                    Cancel and Back to Home
                </button>
            </div>
        </div>
    );
}

export default DeleteAccount;
