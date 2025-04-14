import React, { useState, useRef,useEffect } from "react";
import { gsap } from "gsap";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import Users from "../Components/Users";
import Captains from "../Components/Captains";
import Rides from "../Components/Rides";
import CompleteRides from "../Components/CompleteRides";
import PaymentData from "../Components/PaymentData";
import { useNavigate } from "react-router-dom";
import ManagementData from "../Components/ManagementData";
import Dashboard from "../Components/Dashboard";




function AdminDashboard() {

  const navigate = useNavigate()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [usersData, setUsersData] = useState(false);
  const [captainsData, setCaptainsData] = useState(false);
  const [RideData, setRideData] = useState(false);
  const [CompleteRidesData, setCompleteRidesData] = useState(false);
  const [PaymentHistoryData, setPaymentData] = useState(false);
  const [managementData, setManagementData] = useState(false);
  const [DashboardData, setDashboardData] = useState(true);
  
  const usersRef = useRef(null);
  const captainsRef = useRef(null);
  const ridesRef = useRef(null);
  const completeRidesRef = useRef(null);
  const paymentRef = useRef(null);
  const managementRef = useRef(null);
  const DashboardRef = useRef(null);
  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    setTimeout(() => {
      if (DashboardRef.current) {
        gsap.fromTo(
          DashboardRef.current,
          { x: "-100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }
    }, 50);
  }, []);

  const handleUser = () => {
    setUsersData(true);
    setCaptainsData(false);
    setRideData(false)
    setCompleteRidesData(false)
    setPaymentData(false)
    setManagementData(false)
    setDashboardData(false)
    

    setTimeout(() => {
      if (usersRef.current) {
        gsap.fromTo(
          usersRef.current,
          { x: "-100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }
    }, 50);
  };

  const handleCaptain = () => {
    setCaptainsData(true);
    setUsersData(false);
    setRideData(false)
    setCompleteRidesData(false)
    setPaymentData(false)
    setManagementData(false)
    setDashboardData(false)
    
    setTimeout(() => {
      if (captainsRef.current) {
        gsap.fromTo(
          captainsRef.current,
          { x: "-100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }
    }, 50);
  };

  const handleRide = () => {
    setCaptainsData(false);
    setUsersData(false);
    setRideData(true)
    setCompleteRidesData(false)
    setPaymentData(false)
    setManagementData(false)
    setDashboardData(false)
    

    setTimeout(() => {
      if (ridesRef.current) {
        gsap.fromTo(
          ridesRef.current,
          { x: "-100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }
    }, 50);
  };

  const handleCompleteRides = () => {
    setCaptainsData(false);
    setUsersData(false);
    setRideData(false)
    setCompleteRidesData(true);
    setPaymentData(false)
    setManagementData(false)
    setDashboardData(false)
    

    setTimeout(() => {
      if (completeRidesRef.current) {
        gsap.fromTo(
          completeRidesRef.current,
          { x: "-100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }
    }, 50);
  };


  const handlePaymentData = () => {
    setCaptainsData(false);
    setUsersData(false);
    setRideData(false)
    setCompleteRidesData(false);
    setPaymentData(true)
    setManagementData(false)
    setDashboardData(false)
    

    setTimeout(() => {
      if (paymentRef.current) {
        gsap.fromTo(
          paymentRef.current,
          { x: "-100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }
    }, 50);
  };

  const handleManagementData = () => {
    setCaptainsData(false);
    setUsersData(false);
    setRideData(false)
    setCompleteRidesData(false);
    setPaymentData(false)
    setManagementData(true)
    setDashboardData(false)
    

    setTimeout(() => {
      if (managementRef.current) {
        gsap.fromTo(
          managementRef.current,
          { x: "-100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }
    }, 50);
  };

  const handleDashboard = () => {
    setCaptainsData(false);
    setUsersData(false);
    setRideData(false)
    setCompleteRidesData(false);
    setPaymentData(false)
    setManagementData(false)
    setDashboardData(true)
    

    setTimeout(() => {
      if (DashboardRef.current) {
        gsap.fromTo(
          DashboardRef.current,
          { x: "-100%", opacity: 0 },
          { x: "0%", opacity: 1, duration: 0.8, ease: "power3.out" }
        );
      }
    }, 50);
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-md fixed top-0 w-full z-30 flex items-center justify-between px-6 py-4">
        <img
          className="w-20"
          src="https://tse4.mm.bing.net/th?id=OIP.iq7YfHIOzYUzr33bwUjhQQHaC1&pid=Api&P=0&h=180"
          alt="Logo"
        />
        <button className="block md:hidden text-3xl" onClick={toggleSidebar}>
          {isSidebarOpen ? <RiCloseLine /> : <RiMenuLine />}
        </button>
      </nav>

      {/* Main Content */}
      <div className="flex h-full pt-16">
        {/* Sidebar */}
        <div
          className={`fixed md:relative top-0 left-0 h-full ${
            isSidebarOpen ? "w-64 z-40" : "w-0"
          } md:w-1/5 bg-[#2A2D4E] text-white text-2xl font-serif flex flex-col pt-6 pl-5 transform ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-all duration-300 ease-in-out`}
        >
          <h1 className="text-3xl font-bold mb-6">FirstCab</h1>
          <ul className="w-full flex flex-col space-y-4 text-lg">
            <li 
            onClick={handleDashboard}
            className="px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-600">
              Dashboard
            </li>
            <li
              onClick={handleUser}
              className="px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-600"
            >
              Users
            </li>
            <li
              onClick={handleCaptain}
              className="px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-600"
            >
              Captains
            </li>
            <li 
            onClick={handleRide}
            className="px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-600">
              Rides
            </li>
            <li 
            onClick={handleCompleteRides}
            className="px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-600">
              Complete Rides
            </li>
            <li 
            onClick={handlePaymentData}
            className="px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-600">
              Payments
            </li>
            <li 
            onClick={handleManagementData}
            className="px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-600">
              Managements
            </li>
            <li 
            onClick={()=>{
              navigate('/adminLogin')
            }}
            className="px-4 py-2 rounded-md transition-all duration-300 cursor-pointer hover:bg-gray-600">
              Logout
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div
  className={`w-full h-full bg-white flex flex-col items-center justify-start text-black text-2xl relative overflow-hidden transition-all duration-300 ${
    isSidebarOpen ? "md:ml-0 mt-24" : "mt-0"
  }`}
>
  {/* Scrollable Content Wrapper */}
  <div className="w-full h-full overflow-auto">
    {/* Users Section */}
    {usersData && (
      <div
        ref={usersRef}
        className="absolute top-0 left-0 w-full h-full bg-white px-3 py-6 pt-12 shadow-md z-20 overflow-y-auto"
        style={{ transform: "translateX(100%)", opacity: 0 }}
      >
        <Users />
      </div>
    )}

    {/* Captains Section */}
    {captainsData && (
      <div
        ref={captainsRef}
        className="absolute top-0 left-0 w-full h-full bg-white px-3 py-6 pt-12 shadow-md z-20 overflow-y-auto"
        style={{ transform: "translateX(100%)", opacity: 0 }}
      >
        <Captains />
      </div>
    )}
    
    {/* Ride section */}
    {RideData && (
      <div
        ref={ridesRef}
        className="absolute top-0 left-0 w-full h-full bg-white px-3 py-6 pt-12 shadow-md z-20 overflow-y-auto"
        style={{ transform: "translateX(100%)", opacity: 0 }}
      >
        <Rides />
      </div>
    )}

    {/* // Complete Rides Section */}
    {CompleteRidesData && (
      <div
        ref={completeRidesRef}
        className="absolute top-0 left-0 w-full h-full bg-white px-3 py-6 pt-12 shadow-md z-20 overflow-y-auto"
        style={{ transform: "translateX(100%)", opacity: 0 }}
      >
        <CompleteRides />
      </div>
    )}

    {/* // Payment Section */}
    {PaymentHistoryData && (
      <div
        ref={paymentRef}
        className="absolute top-0 left-0 w-full h-full bg-white px-3 py-6 pt-12 shadow-md z-20 overflow-y-auto"
        style={{ transform: "translateX(100%)", opacity: 0 }}
      >
        <PaymentData />
      </div>
    )}

    {/* // Management Section */}
    {managementData && (
      <div
        ref={managementRef}
        className="absolute top-0 left-0 w-full h-full bg-white px-3 py-6 pt-12 shadow-md z-20 overflow-y-auto"
        style={{ transform: "translateX(100%)", opacity: 0 }}
      >
        <ManagementData />
      </div>
    )}


{DashboardData && (
      <div
        ref={DashboardRef}
        className="absolute top-0 left-0 w-full h-full bg-white px-3 py-6 pt-12 shadow-md z-20 overflow-y-auto"
        style={{ transform: "translateX(100%)", opacity: 0 }}
      >
        < Dashboard/>
      </div>
    )}



    
  </div>
</div>

      </div>
    </div>
  );
}

export default AdminDashboard;
