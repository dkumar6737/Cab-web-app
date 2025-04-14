import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import gsap from "gsap";

function PaymentData() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRows, setExpandedRows] = useState({});
  const rowRefs = useRef({});

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/payment/all-payment-data`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setPayments(response.data);
        setFilteredPayments(response.data);
      } catch (error) {
        console.error("Error fetching payments:", error);
      }
    };

    fetchPayments();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      setFilteredPayments(payments);
    } else {
      const filtered = payments.filter((payment) =>
        payment._id.includes(searchQuery.trim())
      );
      setFilteredPayments(filtered);
    }
  };

  const toggleRow = useCallback((paymentId) => {
    setExpandedRows((prev) => {
      const isExpanding = !prev[paymentId];

      if (rowRefs.current[paymentId]) {
        if (isExpanding) {
          gsap.fromTo(
            rowRefs.current[paymentId],
            { height: 0, opacity: 0 },
            { height: "auto", opacity: 1, duration: 0.5, ease: "power2.out" }
          );
        } else {
          gsap.to(rowRefs.current[paymentId], {
            height: 0,
            opacity: 0,
            duration: 0.5,
            ease: "power2.inOut",
          });
        }
      }

      return { ...prev, [paymentId]: isExpanding };
    });
  }, []);

  const deletePayment = async (paymentId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/payment/delete-payment/${paymentId.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setPayments((prevPayments) =>
        prevPayments.filter((payment) => payment._id !== paymentId)
      );
      setFilteredPayments((prevPayments) =>
        prevPayments.filter((payment) => payment._id !== paymentId)
      );
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  // Calculate total payments
  const totalfare = filteredPayments.reduce((acc, payment) => acc + payment.totalfare, 0);
  const totalPayments = payments.length;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold underline mt-2 mb-2 text-center text-black font-[Times_New_Roman] p-4">
        Payment Data List
      </h1>

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search Payment ID..."
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
            <th className="border border-gray-300 px-4 py-2">PaymentId</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment, index) => (
              <React.Fragment key={payment._id}>
                <tr className="pl-5">
                  <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                  <td className="border border-gray-300 px-4 py-2">{payment._id}</td>
                  <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                    <button
                      onClick={() => toggleRow(payment._id)}
                      aria-expanded={expandedRows[payment._id]}
                      className="w-[130px] h-[40px] bg-blue-500 text-white text-[16px] font-bold border-none shadow-md transition duration-300 ease-in-out transform hover:bg-gray-500 hover:scale-105 active:scale-95"
                    >
                      {expandedRows[payment._id] ? "Hide" : "Show"}
                    </button>

                    <button
                      onClick={() => deletePayment(payment._id)}
                      className="w-[130px] h-[40px] bg-gray-500 text-white text-[16px] font-bold border-none shadow-md transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105 active:scale-95"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                <tr
                  ref={(el) => (rowRefs.current[payment._id] = el)}
                  className="bg-gray-100 overflow-hidden"
                  style={{
                    display: expandedRows[payment._id] ? "table-row" : "none",
                  }}
                >
                  <td colSpan="3" className="p-4">
                    <div>
                      <p>
                        <strong>Payment Id : </strong>
                        {payment._id || "-"}
                      </p>

                      <p>
                        <strong>Ride Id : </strong>
                        {payment.ride || "-"}
                      </p>
                      <p>
                        <strong>Total Fare : </strong>
                        {payment.totalfare || "-"}
                      </p>
                     
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="border border-gray-300 px-4 py-2 text-center">
                No payments found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="flex justify-start mt-20 ml-[780px] space-x-4">


        <button className="bg-green-500 text-white text-sm px-6 py-2 shadow-md">
          Number of Payments: {totalPayments}
        </button>
        <button className="bg-blue-500 text-white text-sm px-6 py-2 shadow-md">
          Total Fare: {totalfare}
        </button>
      </div>
    </div>
  );
}

export default PaymentData;
