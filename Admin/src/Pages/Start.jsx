import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Start() {

  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 w-full h-screen overflow-hidden flex">
      <div className="bg-cover bg-center h-full w-full flex flex-col justify-between" style={{ backgroundImage: 'url(https://images.pexels.com/photos/15481199/pexels-photo-15481199/free-photo-of-yellow-cab-between-buildings.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)' }}>
        {/* Top Logo */}
        <img
          className="w-20 self-start ml-4 mt-4"
          src="https://houseofbeauty.org.uk/wp-content/uploads/2020/07/Book-Now.png"
          alt="Book Now"
        />
        
        {/* Bottom Content */}
        <div className="bg-white pb-8 py-4 px-4">
          <h2 className="text-[30px] font-semibold">Get Started with Cab Booking</h2>
          <div>
          <button
          onClick={() =>{
           navigate('/admin')
          }}
          className="flex items-center justify-center w-full bg-black text-white py-3 rounded-lg mt-5">Continue </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Start;
