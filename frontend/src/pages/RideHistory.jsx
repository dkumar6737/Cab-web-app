import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
import { useContext } from 'react';


function RideHistory() {
    const [rides, setRides] = useState([]);
    const [error, setError] = useState(null);
    const { user} = useContext(UserDataContext);
    const navigate = useNavigate(); // Initialize useNavigate

    const goHome = () => {
        navigate('/home');
    };

    useEffect(() => {
        const fetchRideHistory = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/rides/ridehistory`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    }
                );
                setRides(response.data);
            } catch (err) {
                console.error('Error fetching ride history:', err);
                setError('No Ride History.');
            }
        };

        

        fetchRideHistory();
        
    }, []);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            
            <h1 className="text-2xl font-semibold text-gray-800">Ride History</h1>
            <button
          onClick={goHome}
          className="absolute top-4 right-4 h-10 w-10 bg-gray-100  flex items-center justify-center rounded-full"
        >
          <i className="text-lg font-medium ri-logout-box-r-line"></i>
        </button>
            <h2 className="text-xl text-gray-700">Welcome {user.fullname?.firstname}</h2>

            <div className="mt-4 bg-white shadow-md rounded-lg p-4">
    {error && <p className="text-red-600">{error}</p>}

    {rides.length === 0 ? (
        <p className="text-gray-600">No completed rides found.</p>
    ) : (
        <div className="  space-y-4"> {/* Added space between each ride */}
            {rides.map((ride) => (
                <div key={ride._id} className="p-4 border-b last:border-b-0">
                    <p className="text-lg font-medium text-gray-700">
                        <strong>Pickup:</strong> {ride?.pickup || 'Unknown'}
                    </p>
                    <p className="text-lg font-medium text-gray-700">
                        <strong>Destination:</strong> {ride?.destination || 'Unknown'}
                    </p>
                    <p className="text-gray-600">
                        <strong>Fare:</strong> ₹{ride?.fare ?? 'Unknown'}
                    </p>
                    <p className="text-gray-600">
                        <strong>Status:</strong> {ride?.status || 'Unknown'}
                    </p>
                    <p className="text-gray-600">
                        <strong>User ID:</strong> {ride?.user?._id || 'Unknown'}
                    </p>
                    <p className="text-gray-600">
                        <strong>Captain ID:</strong> {ride?.captain?._id || 'Unknown'}
                    </p>
                </div>
            ))}
        </div>
    )}
</div>


            <button
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => navigate('/home')}
            >
                Go to Home
            </button>
        </div>
    );
}

export default RideHistory;
