import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';


const PaymentPage = ( props ) => {
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const navigate = useNavigate();
    const [rideAmount, setRideAmount] = useState(null);
    const [error, setError] = useState('');
    const appFee = 30;
    const totalAmount = (rideAmount || 0) + appFee;
    const visaLogo = "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg";
    const masterCardLogo = "https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg";
    const amexLogo = "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg";

    
    const location = useLocation();
    const yourData = location.state?.yourData;
    const handleCancle = () => {
        navigate(-1);
    };

    useEffect(() => {
        const fetchFare = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/rides/ride-fare`,
                    {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    }
                );
                // console.log('Full Response:', response);
                // console.log('Data:', response.data);
                const possibleFare = response.data.fare || response.data.ride?.fare || response.data[0]?.fare;
                // console.log('Possible Fare:', possibleFare);
                setRideAmount(possibleFare || 0);
            } catch (err) {
                console.error('Error fetching ride fare:', err);
                // setError('Failed to fetch ride fare.');
            }
        };
        fetchFare();
    }, []);

    // console.log('Ride Amount State:', rideAmount);

    const handlePayment = async () => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/payment/create-payment`,
                {
                    totalfare: totalAmount // Sending the total amount including the ride fare and app fee
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
    
            // console.log('Payment Response:', response.data);
    
            if (response.status === 201) {
                alert('Payment stored successfully!');
                navigate('/home');  // Redirect to the ride summary or another relevant page
            }
        } catch (err) {
            // console.error('Error processing payment:', err);
            // setError('Payment failed. Please try again.');
        }
    };
    

    return (
        <div className="flex items-center justify-center bg-gray-100" style={{ height: '915px' }}>
            <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md h-full overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold">Payment Details</h2>
                    <i onClick={()=>{
                        navigate('/home')
                    }} className="text-lg font-medium ri-logout-box-r-line"></i>
                </div>

                <div className="space-y-4">
                    {paymentMethod === 'card' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Card Number</label>
                                <div className="flex space-x-3 mb-2 mt-1">
                                    <img src={visaLogo} alt="Visa" className="h-8" />
                                    <img src={masterCardLogo} alt="MasterCard" className="h-8" />
                                    <img src={amexLogo} alt="Amex" className="h-8" />
                                </div>
                                <input 
                                    type="text" 
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="1234 5678 9012 3456"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(e.target.value)}
                                    required={paymentMethod === 'card'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                <input 
                                    type="number" 
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="MM/YY"
                                    value={expiryDate}
                                    onChange={(e) => setExpiryDate(e.target.value)}
                                    required={paymentMethod === 'card'}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">CVV</label>
                                <input 
                                    type="number" 
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                    placeholder="123"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    required={paymentMethod === 'card'}
                                />
                            </div>
                        </>
                    )}

                    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Total Ride Amount:</span>
                            <span className="font-semibold">
                                {rideAmount !== null ? `₹${rideAmount}` : 'Loading...'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-700">Application Fee:</span>
                            <span className="font-semibold">₹{appFee}</span>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold">Total:</span>
                            <span className="font-bold">₹{totalAmount}</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Apply Coupon (optional*)</label>
                        <div className="flex space-x-2">
                            <input 
                                type="text" 
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                                placeholder="Enter Coupon Code"
                            />
                            <button 
                                type="button" 
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Additional Information (optional*)</label>
                        <textarea
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Any additional information or requests"
                        />
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">Choose Payment Method:</label>
                        <div className="flex space-x-4 mt-2">
                            <button
                                onClick={() => setPaymentMethod('card')}
                                type="button"
                                className={`py-2 px-4 rounded-lg font-semibold shadow-md transition duration-300 
                                    ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            >
                                Card
                            </button>
                            <button
                                onClick={() => setPaymentMethod('cash')}
                                type="button"
                                className={`py-2 px-4 rounded-lg font-semibold shadow-md transition duration-300 
                                    ${paymentMethod === 'cash' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                            >
                                Cash
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button 
                            onClick={handlePayment}
                            className={`w-full py-2 px-4 font-semibold rounded-lg shadow-md transition duration-300
                                ${paymentMethod === 'card' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-green-600 text-white hover:bg-green-700'}`}
                        >
                            {paymentMethod === 'card' ? 'Pay Now' : 'Confirm Cash Payment'}
                        </button>
                    </div>
                    
                    <div className="mt-4">
                        <button 
                            onClick={handleCancle}
                            className={`w-full py-2 px-4 font-semibold rounded-lg shadow-md transition duration-300
                                ${paymentMethod === 'card' ? 'bg-green-600 text-white hover:bg-blue-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        >
                            {paymentMethod === 'card' ? 'Cancel' :'Cancel'}
                        </button>
                    </div>

                    {error && (
                        <div className="text-red-600 text-center mt-2">
                            {error}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
