import React, { useEffect, useRef, useState, useContext } from 'react';
import { gsap } from 'gsap';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';
import { Link, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import { UserDataContext } from '../context/UserContext';
import LiveTracking from '../components/LiveTracking';
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';


const Home = () => {
    // State Hooks
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [panelOpen, setPanelOpen] = useState(false);
    const [vehiclePanel, setVehiclePanel] = useState(false);
    const [confirmRidePanel, setConfirmRidePanel] = useState(false);
    const [vehicleFound, setVehicleFound] = useState(false);
    const [waitingForDriver, setWaitingForDriver] = useState(false);
    const [pickupSuggestions, setPickupSuggestions] = useState([]);
    const [destinationSuggestions, setDestinationSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null);
    const [fare, setFare] = useState({});
    const [vehicleType, setVehicleType] = useState(null);
    const [ride, setRide] = useState(null);
    const [menuOpen, setMenuOpen] = useState(false);
    
    

    // Refs
    const menuRef = useRef(null);
    const panelRef = useRef(null);
    const panelCloseRef = useRef(null);
    const vehiclePanelRef = useRef(null);
    const confirmRidePanelRef = useRef(null);
    const vehicleFoundRef = useRef(null);
    const waitingForDriverRef = useRef(null);

    // Socket and User Context
    const { socket } = useContext(SocketContext);
    const { user } = useContext(UserDataContext);
    const navigate = useNavigate();

    // Handle socket events for ride confirmations
    useEffect(() => {
        socket.emit("join", { userType: "user", userId: user._id })
    }, [ user ])

    socket.on('ride-confirmed', (ride) => {

        // console.log("Ride Confirmed Data Recived", ride)
        setVehicleFound(false)
        setWaitingForDriver(true)
        setRide(ride)
    })

   
    socket.on('ride-started', (ride) => {
        // console.log("ride")
        setWaitingForDriver(false)
        navigate('/riding', { state: { ride } }) // Updated navigate to include ride data
    })
   

    // Handle menu animation
    useEffect(() => {
        if (menuRef.current) {
            gsap.to(menuRef.current, {
                x: menuOpen ? '0%' : '-100%',
                duration: 0.5,
                ease: 'power3.out',
                onStart: () => {
                    if (menuOpen) {
                        menuRef.current.classList.remove('invisible');
                    }
                },
                onComplete: () => {
                    if (!menuOpen) {
                        menuRef.current.classList.add('invisible');
                    }
                },
            });
        }
    }, [menuOpen]);

    // Handle Pickup and Destination input changes
    const handlePickupChange = async (e) => {
        setPickup(e.target.value);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setPickupSuggestions(response.data);
        } catch (error) {
            // Handle error
        }
    };

    const handleDestinationChange = async (e) => {
        setDestination(e.target.value);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                params: { input: e.target.value },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setDestinationSuggestions(response.data);
        } catch (error) {
            // Handle error
        }
    };

    const submitHandler = (e) => {
        e.preventDefault();
    };

    // API calls to handle trip data
    async function findTrip() {
        setVehiclePanel(true);
        setPanelOpen(false);
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setFare(response.data);
        } catch (error) {
            console.error('Error fetching fare:', error);
            // Handle error
        }
    }

    async function createRide() {
        try {
            // Debug: Log the inputs
            // console.log("Pickup object:", pickup);
            // console.log("Destination object:", destination);
    
            // Validate `pickup` and `destination`
            if (!pickup) {
                // console.error("Invalid pickup:", pickup);
                alert("Please select a valid pickup location.");
                return;
            }
            if (!destination) {
                // console.error("Invalid destination:", destination);
                alert("Please select a valid destination location.");
                return;
            }
    
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("Authorization token is missing.");
                alert("Please log in to continue.");
                return;
            }
    
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/rides/create`,
                { pickup, destination, vehicleType },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            // console.log("Ride created successfully:", response.data);
        } catch (error) {
            console.error("Error creating ride:", error);
    
            if (error.response) {
                console.error("Server responded with:", error.response.data);
                alert(`Error: ${error.response.data.error || "Something went wrong!"}`);
            } else if (error.request) {
                console.error("No response received:", error.request);
                alert("No response from server. Please check your network connection.");
            } else {
                console.error("Error message:", error.message);
                alert("Unexpected error occurred. Please try again.");
            }
        }
    }
    
      

   
    


    // GSAP Animations for Panels
    useEffect(() => {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '60%',
                padding: 24,
                opacity: 1,
            });
            gsap.to(panelCloseRef.current, {
                opacity: 1,
            });
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0,
                opacity: 0,
            });
            gsap.to(panelCloseRef.current, {
                opacity: 0,
            });
        }
    }, [panelOpen]);

    useEffect(() => {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)',
                height:'50%'
            });
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [vehiclePanel]);

    useEffect(() => {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)',
                height:'65%'
            });
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [confirmRidePanel]);

    useEffect(() => {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)',
                height:'60%'
            });
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)',
            });
        }
    }, [vehicleFound]);

    useEffect(() => {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)',
                height:'50%'
                
            });
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)',
                // height:'70%'
            });
        }
    }, [waitingForDriver]);


   const handlelogout =()=>{
    localStorage.removeItem('token');
    navigate('/login')
   }

    return (
        <div className="h-screen relative overflow-hidden">
            {/* Navigation and Menu */}
            <nav className="bg-white shadow-md fixed top-0 w-full z-20 flex items-center justify-between px-6 py-4">
                <img className="w-20" src="https://tse4.mm.bing.net/th?id=OIP.iq7YfHIOzYUzr33bwUjhQQHaC1&pid=Api&P=0&h=180" alt="Logo" />
                <div>
                    <i
                        // className="text-lg font-medium ri-home-5-line cursor-pointer"
                        className="text-lg font-medium ri-menu-line cursor-pointer"
                        onClick={() => setMenuOpen(!menuOpen)}
                    ></i> 
                </div>
            </nav><div ref={menuRef} className="bg-white text-white fixed top-0 left-0 w-64 h-full p-4 transform invisible transition-all z-30">
            <img className="w-20 mt-8" src="https://tse4.mm.bing.net/th?id=OIP.iq7YfHIOzYUzr33bwUjhQQHaC1&pid=Api&P=0&h=180" alt="Logo" />
  <div>
            <h1>User Details</h1>
            {user ? (
                <div>
                   <p className="text-black font-bold text-[30px] pl-[20px] fixed left-2 ">{user.fullname?.firstname}</p>

                   
                </div>
            ) : (
                <p>Loading...</p>
            )}
            
        </div>
        <h3 className="text-black pl-[10px] mt-[23%] font-semibold text-lg">Suggestions</h3>
  <ul className="mt-7 text-black">
    
        <Link to={'#'}><li  className="py-1.5 pl-[20px] border border-white shadow-[0_4px_6px_rgba(0,0,0,0.4)] bg-white-200 rounded-[20px] text-lg cursor-pointer hover:font-semibold">Home</li></Link>
        <Link to={'/services'}><li  className="py-1.5 mt-5 pl-[20px] border border-white shadow-[0_4px_6px_rgba(0,0,0,0.4)] bg-white-200 rounded-[20px] text-lg cursor-pointer hover:font-semibold">Services</li></Link>
        <Link to={'/payment-page'}><li  className="py-1.5 mt-5 pl-[20px] border border-white shadow-[0_4px_6px_rgba(0,0,0,0.4)] bg-white-200 rounded-[20px] text-lg cursor-pointer hover:font-semibold">Payment</li></Link>
        <Link to={'/ride-history'}><li  className="py-1.5 mt-5 pl-[20px] border border-white shadow-[0_4px_6px_rgba(0,0,0,0.4)] bg-white-200 rounded-[20px] text-lg cursor-pointer hover:font-semibold">My Rides</li></Link>
        <Link to={'/about'}><li  className="py-1.5 mt-5 pl-[20px] border border-white shadow-[0_4px_6px_rgba(0,0,0,0.4)] bg-white-200 rounded-[20px] text-lg cursor-pointer hover:font-semibold">About</li></Link>
        <Link to={'/delete-acc'}><li  className="py-1.5 mt-5 pl-[20px] border border-white shadow-[0_4px_6px_rgba(0,0,0,0.4)] bg-white-200 rounded-[20px] text-lg cursor-pointer hover:font-semibold">Delete Account</li></Link>
        {/* <Link to={'/chat'}><li  className="py-1.5 mt-5 pl-[20px] border border-white shadow-[0_4px_6px_rgba(0,0,0,0.4)] bg-white-200 rounded-[20px] text-lg cursor-pointer hover:font-semibold">Chat</li></Link> */}
        
        <button className="py-1.5 w-full mt-5 pl-[0px] border border-white shadow-[0_4px_6px_rgba(0,0,0,0.4)] bg-white-200 rounded-[20px] text-lg cursor-pointer hover:font-semibold" onClick={handlelogout}>Logout</button>
      </ul>
      <div className="flex pl-[0] justify-center absolute bottom-4 w-full pb-4 space-x-4 px-4">
    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
        <i className="ri-twitter-line text-2xl text-black hover:text-gray-600"></i>
    </a>
    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
        <i className="ri-linkedin-line text-2xl text-black hover:text-gray-600"></i>
    </a>
    <a href="https://www.instagram.com/invites/contact/?igsh=b18v6htvkqzo&utm_content=nu9tbxu " target="_blank" rel="noopener noreferrer">
        <i className="ri-instagram-line text-2xl text-black hover:text-gray-600"></i>
    </a>
    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
        <i className="ri-facebook-line text-2xl text-black hover:text-gray-600"></i>
    </a>
    <a href="https://www.github.com" target="_blank" rel="noopener noreferrer">
        <i className="ri-github-line text-2xl text-black hover:text-gray-600"></i>
    </a>
</div>
<Link to={'#'}><p className='text-black flex pl-[0] justify-center absolute bottom-0 w-full pb-4 space-x-4 px-4'>www.cabbookin.com</p></Link>



    </div>
            

            {/* Live Tracking */}
            <div className="h-screen w-screen mt-[60px]">
                <LiveTracking />
            </div>

            {/* Search and Trip Details */}
            <div className="flex flex-col justify-end h-screen absolute top-0 w-full">
                <div className="h-[35%] p-6 bg-white relative">
                    <h5 ref={panelCloseRef} onClick={() => setPanelOpen(false)} className="absolute opacity-0 right-6 top-6 text-2xl">
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className="text-2xl font-semibold ">Find a trip</h4>
                    <form onSubmit={submitHandler}>
                        {/* <div className="line absolute h-20 w-1 top-[40%] left-12 -translate-y-1/2  bg-gray-700 rounded-full"></div> */}
                        
                        <input
                            onClick={() => {
                                setPanelOpen(true);
                                setActiveField('pickup');
                            }}
                            value={pickup}
                            onChange={handlePickupChange}
                            className="bg-[#eee]  px-12 py-2 text-lg rounded-lg w-full mt-5"
                            type="text"
                            placeholder="Add a pick-up location"
                            required
                        />
                        <input
                            onClick={() => {
                                setPanelOpen(true);
                                setActiveField('destination');
                            }}
                            value={destination}
                            onChange={handleDestinationChange}
                            className="bg-[#eee] px-12 py-2 text-lg rounded-lg w-full mt-5"
                            type="text"
                            placeholder="Enter your destination"
                            required
                        />
                    </form>
                    <button onClick={findTrip} className="bg-black text-white px-4 py-2 rounded-lg mt-5 w-full">
                        Find Trip
                    </button>
                </div>
                <div ref={panelRef} className="bg-white h-0">
                    <LocationSearchPanel
                        suggestions={activeField === 'pickup' ? pickupSuggestions : destinationSuggestions}
                        setPanelOpen={setPanelOpen}
                        setVehiclePanel={setVehiclePanel}
                        setPickup={setPickup}
                        setDestination={setDestination}
                        activeField={activeField}
                    />
                </div>
            </div>

            {/* Vehicle Panel */}
            <div ref={vehiclePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12">
                <VehiclePanel selectVehicle={setVehicleType} fare={fare} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} />
            </div>

            {/* Confirm Ride Panel */}
            <div ref={confirmRidePanelRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
                <ConfirmRide createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
            </div>

            {/* Looking For Driver */}
            <div ref={vehicleFoundRef} className="fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12">
                <LookingForDriver createRide={createRide} pickup={pickup} destination={destination} fare={fare} vehicleType={vehicleType} setVehicleFound={setVehicleFound} />
            </div>

            {/* Waiting for Driver */}
            <div ref={waitingForDriverRef} className="fixed w-full z-10 bottom-0 bg-white px-3 py-6 pt-12">
                <WaitingForDriver ride={ride} setVehicleFound={setVehicleFound} setWaitingForDriver={setWaitingForDriver} />
            </div>
        </div>
    );
};

export default Home;
