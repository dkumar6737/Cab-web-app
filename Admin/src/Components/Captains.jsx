import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import gsap from "gsap";

function Captains() {
  const [captains, setCaptains] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const rowRefs = useRef({}); // Store references for each expandable row

  useEffect(() => {
    const fetchCaptains = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captain/captains-Data`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setCaptains(response.data);
      } catch (error) {
        console.error("Error fetching captains:", error);
      }
    };

    fetchCaptains();
  }, []);

  const toggleRow = useCallback((captainId) => {
    setExpandedRows((prev) => {
      const isExpanding = !prev[captainId];

      if (rowRefs.current[captainId]) {
        if (isExpanding) {
          gsap.fromTo(
            rowRefs.current[captainId],
            { height: 0, opacity: 0 },
            { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" }
          );
        } else {
          gsap.to(rowRefs.current[captainId], {
            height: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      }

      return { ...prev, [captainId]: isExpanding };
    });
  }, []);

  const deleteCaptain = async (captainId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/captain/captain-Delete/${captainId.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCaptains((prevCaptains) =>
        prevCaptains.filter((captain) => captain._id !== captainId)
      );
    } catch (error) {
      console.error("Error deleting captain:", error);
    }
  };

  const filteredCaptains = captains.filter((captain) =>
    captain.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //numbers of captains
  const totalcaptains = filteredCaptains.length;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold underline mt-2 mb-2 text-center text-black font-[Times_New_Roman] p-4">
        Captain Data List
      </h1>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search by Email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border p-2 w-[400px] h-[35px] text-sm placeholder-gray-500"
        />
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">#</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCaptains.length > 0 ? (
            filteredCaptains.map((captain, index) => (
              <React.Fragment key={captain._id}>
                <tr className="pl-5" style={{ marginLeft: "50px" }}>
                  <td className="border border-gray-300 px-4 py-2">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {captain.email}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => toggleRow(captain._id)}
                      aria-expanded={expandedRows[captain._id]}
                      className="w-[130px] h-[40px] bg-blue-500 text-white text-[16px] font-bold border-none shadow-md transition duration-300 ease-in-out transform hover:bg-gray-500 hover:scale-105 active:scale-95"
                    >
                      {expandedRows[captain._id] ? "Hide" : "Show"}
                    </button>

                    <button
                      onClick={() => deleteCaptain(captain._id)}
                      className="w-[130px] h-[40px] bg-gray-500 text-white text-[16px] font-bold border-none shadow-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105 active:scale-95"
                    >
                      Delete
                    </button>
                  </td>
                </tr>

                <tr
                  ref={(el) => (rowRefs.current[captain._id] = el)}
                  className="bg-gray-100 overflow-hidden"
                  style={{
                    display: expandedRows[captain._id] ? "table-row" : "none",
                  }}
                >
                  <td colSpan="3" className="p-4">
                    <div>
                      <p>
                        <strong>First Name : </strong>{" "}
                        {captain.fullname?.firstname || "-"}
                      </p>
                      <p>
                        <strong>Last Name : </strong>{" "}
                        {captain.fullname?.lastname || "-"}
                      </p>
                      <p>
                        <strong>Email : </strong> {captain.email}
                      </p>
                      <p>
                        <strong>Status : </strong> {captain.status}
                      </p>
                      <p>
                        <strong>Vehical-Color : </strong> 
                        {captain.vehicle?.color || "-"}
                      </p>
                      <p>
                        <strong>Vehical-Plate : </strong> 
                        {captain.vehicle?.plate || "-"}
                      </p>
                      <p>
                        <strong>Vehical-capacity : </strong> 
                        {captain.vehicle?.capacity || "-"}
                      </p>
                      <p>
                        <strong>Vehical-Type : </strong> 
                        {captain.vehicle?.vehicleType || "-"}
                      </p>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td
                colSpan="3"
                className="border border-gray-300 px-4 py-2 text-center"
              >
                No captains found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-start mt-20 ml-[1050px] space-x-4">
  
  <button className="bg-blue-500 text-white text-sm px-6 py-2  shadow-md">
    Number of Captains: {totalcaptains}
  </button>
 
</div>
    </div>
  );
}

export default Captains;