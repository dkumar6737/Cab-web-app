import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import axios from "axios";

const Dashboard = () => {
  const [rides, setRides] = useState([]);
  const [users, setUsers] = useState([]);
  const [captains, setCaptains] = useState([]);

  // Define color arrays for each graph
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff6384", "#36a2eb", "#cc65fe", "#ffce56"];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const BASE_URL = import.meta.env.VITE_BASE_URL;
        const token = localStorage.getItem("token");

        const [rideRes, userRes, captainRes] = await Promise.all([
          axios.get(`${BASE_URL}/rides/ride-Data`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/user/users-Data`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${BASE_URL}/captain/captains-Data`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setRides(Array.isArray(rideRes.data) ? rideRes.data : []);
        setUsers(Array.isArray(userRes.data) ? userRes.data : []);
        setCaptains(Array.isArray(captainRes.data) ? captainRes.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const totalRides = rides.length;
  const totalUsers = users.length;
  const totalCaptains = captains.length

  return (
    <div className="flex flex-col space-y-6 p-6">

      
      <div className="border border-gray-300 rounded-lg p-6 shadow-md bg-white">
        <div className="flex flex-row items-center w-full">
          
          <div className="w-3/5">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={rides.map((ride, index) => ({ id: index + 1, fare: ride.fare }))}>
                <XAxis dataKey="id" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="fare">
                  {rides.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <p className="text-center">Numbers of ride : {totalRides}</p>
          </div>
          
          <div className="w-2/5 pl-6">
            <h2 className="text-xl font-bold mb-2">Rides Overview</h2>
            <p className="text-gray-600 text-sm">
              This bar chart displays the fare distribution of all rides. 
              Each bar represents a ride, and colors distinguish different rides.
            </p>
           
          </div>
        </div>
      </div>

      {/* Users Overview */}
      <div className="border border-gray-300 rounded-lg p-6 shadow-md bg-white">
        <div className="flex flex-row items-center w-full">
          
          <div className="w-3/5">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={users.map((user, index) => ({ name: user.fullname.firstname, value: 1 }))}
                  dataKey="value"
                  fill="#82ca9d"
                  label
                >
                  {users.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center">Numbers of Users : {totalUsers}</p>
          </div>
          
          <div className="w-2/5 pl-6">
            <h2 className="text-xl font-bold mb-2">Users Overview</h2>
            <p className="text-gray-600 text-sm">
              This pie chart represents the total number of registered users. 
              Each segment is a unique user and has a different color.
            </p>
          </div>
        </div>
      </div>

      {/* Captains Overview */}
      <div className="border border-gray-300 rounded-lg p-6 shadow-md bg-white">
        <div className="flex flex-row items-center w-full">
          
          <div className="w-3/5">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={captains.map((captain, index) => ({ name: captain.fullname.firstname, value: 1 }))}
                  dataKey="value"
                  fill="#ff7300"
                  label
                >
                  {captains.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-center">Numbers of captain : {totalCaptains}</p>
          </div>
          
          <div className="w-2/5 pl-6">
            <h2 className="text-xl font-bold mb-2">Captains Overview</h2>
            <p className="text-gray-600 text-sm">
              This pie chart displays the number of captains. 
              Each slice represents a different captain and has a unique color.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
