import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function CaptainRideHistory() {
  const [rides, setRides] = useState([]); // Default state is an empty array
  const [totalFare, setTotalFare] = useState(0);
  const [error, setError] = useState(null); // Add error state for better error handling

  const navigate = useNavigate(); // Initialize useNavigate

  const goHome = () => {
    navigate('/captain-home');
  };

  // Fetching ride history when the component is mounted
 useEffect(() => {
  const fetchRideHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      // Fetching captain ride history from the backend
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/captain-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Checking if response data exists
      if (response.data && response.data.completedRides) {
        setRides(response.data.completedRides);
        
        // Calculate the total fare from the rides
        const total = response.data.completedRides.reduce((sum, ride) => sum + ride.fare, 0);
        setTotalFare(total);

        // Store the total fare in localStorage
        localStorage.setItem('totalFare', total);
      } else {
        setError('No completed rides found for this captain.');
      }
    } catch (err) {
      console.error('Error fetching ride history:', err);
      // setError('Failed to fetch captain ride history. Please try again.');
    }
  };

  fetchRideHistory();
}, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-800">Completed Ride History</h1>

      {/* Back button */}
      <button
        onClick={goHome}
        className="absolute top-4 right-4 h-10 w-10 bg-gray-100  flex items-center justify-center rounded-full"
      >
        <i className="text-lg font-medium ri-logout-box-r-line"></i>
      </button>

      <div className="mt-4 bg-white shadow-md rounded-lg p-4">
        {error && <p className="text-red-600">{error}</p>} {/* Show error message */}

        {rides.length === 0 ? (
          <p className="text-gray-600">No completed rides found for this captain.</p>
        ) : (
          <div>
            <ul>
              {rides.map((ride) => (
                <li key={ride._id} className="p-4 border-b last:border-b-0">
                    <p className="text-lg font-medium text-gray-700">
                    <strong>UserId:</strong> {ride?.user || 'Unknown'}
                  </p>
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
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Total Fare Button outside of the main div */}
      <div className="mt-4 flex justify-end">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md">
          <strong>Total Earn: </strong>₹{totalFare}
        </button>
      </div>
    </div>
  );
}

export default CaptainRideHistory;
