import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import gsap from "gsap";

function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const rowRefs = useRef({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/users-Data`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const toggleRow = useCallback((userId) => {
    setExpandedRows((prev) => {
      const isExpanding = !prev[userId];
      if (rowRefs.current[userId]) {
        if (isExpanding) {
          gsap.fromTo(
            rowRefs.current[userId],
            { height: 0, opacity: 0 },
            { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" }
          );
        } else {
          gsap.to(rowRefs.current[userId], {
            height: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      }
      return { ...prev, [userId]: isExpanding };
    });
  }, []);

  const deleteUser = async (userId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/user/users-Delete/${userId.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Numbers of users
  const totalUsers = users.length;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold underline mt-2 mb-2 text-center text-black font-[Times_New_Roman] p-4">
        Users Data List
      </h1>

      <div className="flex justify-center mb-4">
      <input
        type="text"
        placeholder="Search by email..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border p-2 mb-4 w-[400px] h-[35px] text-sm placeholder-gray-400"
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
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <React.Fragment key={user._id}>
                <tr>
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => toggleRow(user._id)}
                      className="w-[130px] h-[40px] bg-blue-500 text-white text-[16px] font-bold shadow-md transition duration-300 ease-in-out transform hover:bg-gray-500 hover:scale-105 active:scale-95"
                    >
                      {expandedRows[user._id] ? "Hide" : "Show"}
                    </button>
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="w-[130px] h-[40px] bg-gray-500 text-white text-[16px] font-bold shadow-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105 active:scale-95"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                <tr
                  ref={(el) => (rowRefs.current[user._id] = el)}
                  className="bg-gray-100 overflow-hidden"
                  style={{ display: expandedRows[user._id] ? "table-row" : "none" }}
                >
                  <td colSpan="3" className="p-4">
                    <div>
                      <p>
                        <strong>First Name:</strong> {user.fullname?.firstname || "-"}
                      </p>
                      <p>
                        <strong>Last Name:</strong> {user.fullname?.lastname || "-"}
                      </p>
                      <p>
                        <strong>Email:</strong> {user.email}
                      </p>
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex justify-start mt-20 ml-[1050px] space-x-4">
  
  <button className="bg-gray-500 text-white text-sm px-6 py-2  shadow-md">
    Number of Users: {totalUsers}
  </button>
 
</div>
    </div>
  );
}

export default Users;
