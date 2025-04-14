import React, { useRef, useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import CaptainDetails from '../components/CaptainDetails';
import RidePopUp from '../components/RidePopUp';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import { SocketContext } from '../context/SocketContext';
import { CaptainDataContext } from '../context/CapatainContext';
import { UserDataContext } from '../context/UserContext';
import axios from 'axios';



const CaptainHome = (props) => {
    const [ridePopupPanel, setRidePopupPanel] = useState(false); // Initially set to false
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
    const [ride, setRide] = useState(null);
    

    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);

    const { socket } = useContext(SocketContext);
    const { captain } = useContext(CaptainDataContext);
    const { user } = useContext(UserDataContext);

    useEffect(() => {

        // Emit join event to server when captain data is available
        socket.emit('join', {
            userId: captain._id,
            userType: 'captain',
        });

        const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {


                    // console.log({
                    //     userId: captain._id,
                    //     ltd: position.coords.latitude,
                    //     lng: position.coords.longitude
                    // });

                    
                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()

        // return () => clearInterval(locationInterval)
    }, [])


    // Listening for new ride data
    useEffect(() => {
        socket.on('new-ride', (data) => {
            // console.log("Ride Data",data);
            
            setRide(data);
            setRidePopupPanel(true);
        });

        return () => {
            socket.off('new-ride'); // Cleanup listener when component unmounts
        };
    }, [socket]);
  

    async function confirmRide() {
        try {
            if (!ride || !ride._id) {
                console.error("Ride ID is missing. Cannot confirm ride.");
                return;
            }
    
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("No authentication token found.");
                return;
            }
    
            console.log("Token:", token); // Print the token
    
            console.log("Sending request to confirm ride:", `${import.meta.env.VITE_BASE_URL}/rides/confirm`, "with rideId:", ride._id);
       
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/confirm`,
                { rideId: ride._id },
                // { captainId: captain._id },
                { headers: { Authorization: `Bearer ${token}` } }
            );
    
            // console.log("Ride confirmation response:", response.data);
    
            // Check if confirmation was successful before updating UI
            if (response.status === 200 && response.data) {
                console.log("Ride confirmed! Updating UI...");
                setRidePopupPanel(false);
                setConfirmRidePopupPanel(true);
            } else {
                console.warn("Ride confirmation failed, not updating UI.");
            }
        } catch (error) {
            console.error("Ride confirmation failed:", error.response?.data || error.message);
        }
    }
    
    
    

useEffect(() =>{
    socket.on('ride-confirmed', (data) => {
        // console.log("Ride Confirm Data",data);
        
        setRidePopupPanel(false)
        setConfirmRidePopupPanel(true)
    })
})



    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)',
            });
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [ridePopupPanel]);

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)',
            });
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [confirmRidePopupPanel]);

    return (
        <div className="h-screen">
            <div className="fixed p-6 top-0 flex items-center justify-between w-screen">
                <img
                    className="w-20 mb-10"
                    src="https://houseofbeauty.org.uk/wp-content/uploads/2020/07/Book-Now.png"
                    alt=""
                />
               <div className="flex flex-col gap-2.5">
    <Link
        to="/captain-login"
        className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
    >
        <i className="text-lg font-medium ri-logout-box-r-line"></i>
    </Link>
    <Link
        to="/captain-ride-history"
        className="h-10 w-10 bg-white flex items-center justify-center rounded-full"
    >
        <i className="text-lg font-medium ri-user-line"></i>  
    </Link>
</div>

                
            </div>
            <div className="h-3/5">
                <img
                    className="h-full w-full object-cover"
                    src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif"
                    alt=""
                />
            </div>
            <div className="h-2/5 p-6">
                <CaptainDetails />
            </div>
            {console.log('Ride object:', ride)}
            {ride && (
                <div ref={ridePopupPanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
                    <RidePopUp
                        ride={ride}
                        setRidePopupPanel={setRidePopupPanel}
                        setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                        confirmRide={() => confirmRide()}
                    />
                </div>
            )}

            <div ref={confirmRidePopupPanelRef} className="fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    );
};

export default CaptainHome;
