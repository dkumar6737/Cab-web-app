import React from 'react';
import { useNavigate } from 'react-router-dom';

function RideCanceled({ setIsRideCanceled }) {
  const navigate = useNavigate()
  const goHome = () => {
    navigate('/captain-home');
  };

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-3xl font-bold opacity-75">Ride canceled</h1>
      <button 
        className="text-2xl mt-4 px-4 py-2 bg-green-500 text-white rounded w-52 h-12" 
        onClick={goHome}
      >
        Ok
      </button>
    </div>
  );
}
export default RideCanceled;
