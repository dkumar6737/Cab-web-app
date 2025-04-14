import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import gsap from "gsap";

function ManagementData() {
  const [managements, setManagements] = useState([]);
  const [filteredManagements, setFilteredManagements] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const rowRefs = useRef({});

  useEffect(() => {
    const fetchManagements = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/admin/adminData`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setManagements(response.data);
        setFilteredManagements(response.data);
      } catch (error) {
        console.error("Error fetching management data:", error.response?.data || error.message);
      }
    };

    fetchManagements();
  }, []);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery === "") {
      setFilteredManagements(managements);
    } else {
      const filtered = managements.filter((management) =>
        management._id.includes(trimmedQuery)
      );
      setFilteredManagements(filtered);
    }
  };

  const toggleRow = useCallback((managementId) => {
    setExpandedRows((prev) => {
      const isExpanding = !prev[managementId];

      if (rowRefs.current[managementId]) {
        gsap.to(rowRefs.current[managementId], {
          height: isExpanding ? "auto" : 0,
          opacity: isExpanding ? 1 : 0,
          duration: 0.5,
          ease: "power2.inOut",
        });
      }

      return { ...prev, [managementId]: isExpanding };
    });
  }, []);

  const deleteManagement = async (managementId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/admin/deleteAdmin/${managementId.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setManagements((prev) => prev.filter((m) => m._id !== managementId));
      setFilteredManagements((prev) => prev.filter((m) => m._id !== managementId));
    } catch (error) {
      console.error("Error deleting management data:", error.response?.data || error.message);
    }
  };

  // Calculate total values safely
  const totalFare = filteredManagements.reduce((acc, management) => acc + (management.totalfare || 0), 0);
  const totalManagements = filteredManagements.length;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold underline mt-2 mb-2 text-center text-black font-[Times_New_Roman] p-4">
        Management Data List
      </h1>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search Management ID..."
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
            <th className="border border-gray-300 px-4 py-2">Management ID</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredManagements.length > 0 ? (
            filteredManagements.map((management, index) => (
              <React.Fragment key={management._id}>
                <tr className="pl-5">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{management._id}</td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => toggleRow(management._id)}
                      aria-expanded={expandedRows[management._id]}
                      className="w-[130px] h-[40px] bg-blue-500 text-white text-[16px] font-bold border-none shadow-md transition duration-300 ease-in-out transform hover:bg-gray-500 hover:scale-105 active:scale-95"
                    >
                      {expandedRows[management._id] ? "Hide" : "Show"}
                    </button>

                    <button
                      onClick={() => deleteManagement(management._id)}
                      className="w-[130px] h-[40px] bg-gray-500 text-white text-[16px] font-bold border-none shadow-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105 active:scale-95"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                <tr
                  ref={(el) => (rowRefs.current[management._id] = el)}
                  className="bg-gray-100 overflow-hidden"
                  style={{
                    display: expandedRows[management._id] ? "table-row" : "none",
                  }}
                >
                  <td colSpan="3" className="p-4">
                    <div>
                      <p><strong>Management ID : </strong>{management._id || "-"}</p>
                      <p><strong>FirstName : </strong>{management.fullname.firstname || "-"}</p>
                      <p><strong>LastName : </strong>{management.fullname.lastname || "-"}</p>
                      <p><strong>Email : </strong>{management.email || "-"}</p>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">
                No management data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-center mt-10 ml-[900px] space-x-4">
        <button className="bg-green-500 text-white text-sm px-6 py-2 shadow-md">
          Number of Managements: {totalManagements}
        </button>
        
      </div>
    </div>
  );
}

export default ManagementData;
