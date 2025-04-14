import React, { useRef, useState, useEffect,useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import LiveTracking from '../components/LiveTracking'
import RideCanceled from '../components/RideCanceled'
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CapatainContext';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios'
const CaptainRiding = () => {


    // Socket Message
    const navigate = useNavigate()
      

  
    const [ finishRidePanel, setFinishRidePanel ] = useState(false)
    const [isRideCanceled, setIsRideCanceled] = useState(false)
    const finishRidePanelRef = useRef(null)
    const rideCanceledRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride
    const { socket } = useContext(SocketContext);
     const { captain } = useContext(CaptainDataContext);
        const { user } = useContext(UserDataContext);

        socket.emit('join', {
            userId: captain._id,
            userType: 'captain',
        });

    socket.on('ride-cancel',(data) => {
        setIsRideCanceled(true)
        // console.log(data)
        
    })
    socket.on('payment-data', (data)=>{
        console.log(data)
        setFinishRidePanel(true)
    })
    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)',
                height:'60%'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ finishRidePanel ])


    useGSAP(() => {
        gsap.to(rideCanceledRef.current, {
            transform: isRideCanceled ? 'translateY(0)' : 'translateY(100%)',
            height: isRideCanceled ? '40%' : 'auto'
        })
    }, [isRideCanceled])




    const handleCaptainChat = async () => {
            try {
                const token = localStorage.getItem("token"); // Get token from storage
                if (!token) {
                    console.error("No token found!");
                    return;
                }
        
                // Fetch user's ride from backend
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/Captain-ID`, {
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
                localStorage.setItem('UserId:', userId)
                localStorage.setItem('CaptainId:', captainId)
                navigate('/captain-chat', { state: { rideId } }); // Navigate to chat page
            } catch (error) {
                console.error("Error fetching rideId:", error);
            }
        };
    return (
        <div className='h-screen relative flex flex-col justify-end'>

<div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
    <img className='w-16' src="https://tse4.mm.bing.net/th?id=OIP.iq7YfHIOzYUzr33bwUjhQQHaC1&pid=Api&P=0&h=180" alt="" />
    <div className="flex flex-col items-center gap-2">
        
            <i onClick={handleCaptainChat} className="text-lg font-medium ri-chat-3-line h-10 w-10 bg-white flex items-center justify-center rounded-full"></i>
       
       
        <Link to='/captain-home' className='h-10 w-10 bg-white flex items-center justify-center rounded-full'>
            <i   className="text-lg font-medium ri-logout-box-r-line"></i>
        </Link>
    </div>
</div>


            <div className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10'
                onClick={() => {
                    setFinishRidePanel(true)
                }}
            >
                <h5 className='p-1 text-center w-[90%] absolute top-0' onClick={() => {

                }}><i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i></h5>
                <h4 className='text-xl font-semibold'>{'4 KM away'}</h4>
                <button className=' bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>Complete Ride</button>
            </div>
            <div ref={finishRidePanelRef} className='fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <FinishRide
                    ride={rideData}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>

            <div className='h-screen fixed w-screen top-0 z-[-1]'>
                <LiveTracking />
            </div>

            <div ref={rideCanceledRef} className='fixed w-full z-[500] bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RideCanceled setRidecancled={setIsRideCanceled} />
            </div>
        </div>
    )
}

export default CaptainRiding