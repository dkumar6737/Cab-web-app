import React from 'react'
import { Link, useLocation } from 'react-router-dom' // Added useLocation
import { useEffect, useContext } from 'react'
import { SocketContext } from '../context/SocketContext'
import { useNavigate } from 'react-router-dom'
import LiveTracking from '../components/LiveTracking'
import axios from 'axios'

const Riding = (props) => {
    const location = useLocation()
    const { ride } = location.state || {} // Retrieve ride data
    const { socket } = useContext(SocketContext)
    const navigate = useNavigate()


    const handleUserChat = async () => {
        try {
            const token = localStorage.getItem("token"); // Get token from storage
            if (!token) {
                console.error("No token found!");
                return;
            }
    
            // Fetch user's ride from backend
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/user-ID`, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            const rideId = response.data?.rideId;
            if (!rideId) {
                console.error("No active ride found for this user");
                return;
            }

            const userId = response.data?.userId;
            if (!userId) {
                console.error("No active ride found for this user");
                return;
            }

            const captainId = response.data?.captainId;
            if (!captainId) {
                console.error("No active ride found for this user");
                return;
            }
    
            console.log("Fetched rideId:", rideId);
            localStorage.setItem("rideId", rideId); // Store rideId
            localStorage.setItem("userId", userId); // Store rideId
            localStorage.setItem("CaptainId", captainId); // Store rideId
            navigate('/chat', { state: { rideId } }); // Navigate to chat page
        } catch (error) {
            console.error("Error fetching rideId:", error);
        }
    };
    
    
    
    

    socket.on("ride-ended", () => {
        navigate('/home')
    })
    const handlePayment=()=>{
        navigate('/payment-page')
    }


    const handleCancel = async () => {
       
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    alert("User not authenticated. Please log in.");
                    return;
                }
    
                // API request to cancel the ride
                const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/rides/ride-cancel`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
    
                alert(response.data.message); // Show success message
    
                // Redirect to home page after canceling the ride
                navigate('/home');
                props.setIsRideCanceled(true)

            } catch (error) {
                console.error("Error canceling ride:", error);
               
            }
       
    }

    return (
        <div className='h-screen mt-200'>
            
            <Link to='/home' className='fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                <i className="text-lg font-medium ri-home-5-line"></i>
            </Link>
            <nav className="bg-white shadow-md fixed top-0 w-full z-20 px-6 py-4 flex justify-between items-center">
        <img className="w-20" src="https://tse4.mm.bing.net/th?id=OIP.iq7YfHIOzYUzr33bwUjhQQHaC1&pid=Api&P=0&h=180" alt="Logo" />
        <i className="ri-chat-3-line text-xl cursor-pointer" onClick={handleUserChat}></i>
      </nav>
            <div className='h-1/2'>
                <LiveTracking />
            </div>
           
            <div className='h-1/2 p-4 '>
                <div className='flex items-center justify-between'>
                    <img className='h-12 mt-10' src="https://www.uber-assets.com/image/upload/f_auto,q_auto:eco,c_fill,h_368,w_552/v1569352630/assets/4b/28f11e-c97b-495a-bac1-171ae9b29362/original/BlackSUV.png" alt="" />
                    <div className='text-right'>
                        <h2 className='text-lg font-medium capitalize'>{ride?.captain.fullname.firstname}</h2>
                        <h4 className='text-xl font-semibold -mt-1 -mb-1'>{ride?.captain.vehicle.plate}</h4>
                        <p className='text-sm text-gray-600'>Maruti Suzuki Alto</p>
                    </div>
                </div>

                <div className='flex gap-2 justify-between  flex-col items-center'>
                    <div className='w-full mt-10'>
                        <div className='flex items-center gap-5 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                <h3 className='text-lg font-medium mt-0'>562/11-A</h3>
                                <p className='text-sm -mt-1 text-gray-600'>{ride?.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-5 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{ride?.fare} </h3>
                                <p className='text-sm -mt-0 text-gray-600'>Cash Cash</p>
                            </div>
                        </div>
                    </div>
                </div>
                <button onClick={handlePayment} className='w-full mt-10 bg-green-600 text-white font-semibold p-2 rounded-lg'>Make a Payment</button>
                <button onClick={handleCancel} className='w-full mt-5 bg-blue-600 text-white font-semibold p-2 rounded-lg'>Cancel</button>
            </div>
        </div>
    )
}

export default Riding