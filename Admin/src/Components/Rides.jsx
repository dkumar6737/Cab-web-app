import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import gsap from "gsap";

function Rides() {
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const rowRefs = useRef({});

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/rides/ride-Data`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setRides(response.data);
        setFilteredRides(response.data);
      } catch (error) {
        console.error("Error fetching rides:", error);
      }
    };

    fetchRides();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredRides(rides);
    } else {
      const filtered = rides.filter((ride) =>
        ride._id.includes(searchQuery.trim())
      );
      setFilteredRides(filtered);
    }
  };

  const toggleRow = useCallback((rideId) => {
    setExpandedRows((prev) => {
      const isExpanding = !prev[rideId];

      if (rowRefs.current[rideId]) {
        if (isExpanding) {
          gsap.fromTo(
            rowRefs.current[rideId],
            { height: 0, opacity: 0 },
            { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" }
          );
        } else {
          gsap.to(rowRefs.current[rideId], {
            height: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      }

      return { ...prev, [rideId]: isExpanding };
    });
  }, []);

  const deleteRide = async (rideId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/rides/ride-Delete/${rideId.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setRides((prevRides) => prevRides.filter((ride) => ride._id !== rideId));
      setFilteredRides((prevRides) => prevRides.filter((ride) => ride._id !== rideId));
    } catch (error) {
      console.error("Error deleting ride:", error);
    }
  };
  //calculate total rides
  const totalRides = rides.length;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold underline mt-2 mb-2 text-center text-black font-[Times_New_Roman] p-4">
        Ride Data List
      </h1>
      
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search Ride ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 mr-2 w-[450px] h-[35px] text-sm placeholder-gray-500"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white text-sm px-4 py-2 w-[150px] h-[35px] shadow-md transition duration-300 ease-in-out transform hover:bg-gray-500 hover:scale-105 active:scale-95"
        >
          Search
        </button>
      </div>
      
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">RideId</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRides.length > 0 ? (
            filteredRides.map((ride, index) => (
              <React.Fragment key={ride._id}>
                <tr className="pl-5">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{ride._id}</td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => toggleRow(ride._id)}
                      aria-expanded={expandedRows[ride._id]}
                      className="w-[130px] h-[40px] bg-blue-500 text-white text-[16px] font-bold border-none shadow-md transition duration-300 ease-in-out transform hover:bg-gray-500 hover:scale-105 active:scale-95"
                    >
                      {expandedRows[ride._id] ? "Hide" : "Show"}
                    </button>

                    <button
                      onClick={() => deleteRide(ride._id)}
                      className="w-[130px] h-[40px] bg-gray-500 text-white text-[16px] font-bold border-none shadow-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105 active:scale-95"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                <tr
                  ref={(el) => (rowRefs.current[ride._id] = el)}
                  className="bg-gray-100 overflow-hidden"
                  style={{ display: expandedRows[ride._id] ? "table-row" : "none" }}
                >
                  <td colSpan="3" className="p-4">
                    <div>
                      <p><strong>UserId : </strong>{ride.user || "-"}</p>
                      <p><strong>CaptainId : </strong>{ride.captain || "-"}</p>
                      <p><strong>Pickup : </strong>{ride.pickup}</p>
                      <p><strong>Destination : </strong>{ride.destination}</p>
                      <p><strong>Fare : </strong>{ride.fare}</p>
                      <p><strong>Status : </strong>{ride.status}</p>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">
                No rides found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-start mt-20 ml-[1000px] space-x-4">
  
  <button className="bg-green-500 text-white text-sm px-6 py-2  shadow-md">
    Number of Rides: {totalRides}
  </button>
  
</div>

    </div>
  );
}

export default Rides;
