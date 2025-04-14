const paymentModel = require('../models/payment.model');
const rideModel = require('../models/ride.model');
const captainModel = require('../models/captain.model');  // Import the captain model
const { sendMessageToSocketId } = require('../socket');

module.exports.createPayment = async (req, res) => {
    try {
        const userId = req.user.id;  // Get userId from the authenticated request
        const { totalfare } = req.body;

        if (!totalfare) {
            return res.status(400).json({ message: 'Total fare is required.' });
        }

        // Find the most recent ride for the user
        const ride = await rideModel.findOne({ user: userId }).sort({ createdAt: -1 });

        if (!ride) {
            return res.status(404).json({ message: 'No ride found for this user.' });
        }

        if (!ride.captain) {
            return res.status(400).json({ message: 'Ride does not have an assigned captain.' });
        }

        // Store the payment
        const newPayment = new paymentModel({ ride: ride._id, totalfare });
        await newPayment.save();

        // Fetch captain details
        const captain = await captainModel.findById(ride.captain);

        if (!captain) {
            return res.status(404).json({ message: 'Captain not found.' });
        }

        if (!captain.socketId) {
            return res.status(400).json({ message: 'Captain is offline or unavailable.' });
        }

        // Notify the captain via WebSocket
        sendMessageToSocketId(captain.socketId, {
            event: 'payment-data',
            data: ride
        });

        res.status(201).json({ message: 'Payment stored successfully.' });
    } catch (err) {
        console.error('Error storing payment:', err);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


//Payemtn History
module.exports.getAllPaymentData = async (req, res) => {
    try{
        const payments = await paymentModel.find();
        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payment data:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};


module.exports.deletePayment = async (req, res) => {
    try {
        const  id  = req.params.id.trim();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid Ride ID format" });
        }
        const payment = await paymentModel.findByIdAndDelete(id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found.' });
        }

        
        res.status(200).json({ message: 'Payment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
}
