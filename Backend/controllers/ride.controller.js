const rideService = require('../services/ride.service');
const { validationResult } = require('express-validator');
const mapService = require('../services/maps.service');
const { sendMessageToSocketId } = require('../socket');
const captainModel = require('../models/captain.model');
const jwt = require('jsonwebtoken');
const rideModel = require('../models/ride.model');
const io = require('socket.io');


    // Create Ride


module.exports.createRide = async (req, res) => {
    const { pickup, destination, vehicleType } = req.body;

    try {
        // Validate input
        if (!pickup || typeof pickup !== 'string' || pickup.trim() === '') {
            return res.status(400).json({ message: 'Pickup location is required and must be a valid string' });
        }

        if (!destination || typeof destination !== 'string' || destination.trim() === '') {
            return res.status(400).json({ message: 'Destination is required and must be a valid string' });
        }

        if (!vehicleType || typeof vehicleType !== 'string' || vehicleType.trim() === '') {
            return res.status(400).json({ message: 'Vehicle type is required and must be a valid string' });
        }

        // Get pickup coordinates
        const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
        console.log('Pickup Coordinates:', pickupCoordinates);

        if (!pickupCoordinates || typeof pickupCoordinates.lat !== 'number' || typeof pickupCoordinates.lng !== 'number') {
            return res.status(400).json({ message: 'Invalid pickup location coordinates' });
        }

    //    ride.otp = '';

     
       

        const ride = await rideService.createRide({
            user: req.user._id,
            captain: req.user.captainId,
            pickup,
            destination,
            vehicleType,
        });

        const token = jwt.sign(
            { rideId: ride._id, captainId: req.user.captainId },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
    
        // Store token in ride database
        ride.token = token;
        await ride.save();
        // Find captains in radius
        const captainsInRadius = await mapService.getCaptainsInTheRadius(
            pickupCoordinates.lat,
            pickupCoordinates.lng,
            1000 // radius in meters
        );

        // Send ride request to captains with 
        captainsInRadius.map(captain => {

            console.log('Captain Info:',captain);
            console.log("Ride Info:",ride);
            

            sendMessageToSocketId(captain.socketId,{
                event: 'new-ride',
                data: ride
            })
        })
          

        // Respond with the created ride and nearby captains
        res.status(201).json({
            message: 'Ride created successfully',
            ride,
            captainsNearby: captainsInRadius,
        });
    } catch (err) {
        console.error('Error in createRide:', err.message);
        res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
};

      
    module.exports.getFare = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { pickup, destination } = req.query;
    
        try {
            const fare = await rideService.getFare(pickup, destination);
            return res.status(200).json(fare);
        } catch (err) {
            return res.status(500).json({ message: err.message });
        }
    }

    // Ride Controller

    module.exports.confirmRide = async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { rideId } = req.body;
    console.log('req.captain' ,req.captain )
        try {
            const ride = await rideService.confirmRide({ rideId, captain: req.captain });
           console.log("Ride User Socket Id:",ride.user.socketId)
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-confirmed',
                data: ride
            })
    
            return res.status(200).json(ride);
        } catch (err) {
    
            console.log(err);
            return res.status(500).json({ message: err.message });
        }
    }


    


    // Start Ride
    module.exports.startRide = async (req, res) => {
        const { rideId, otp } = req.query;
    
        try {
            // Call the service function to start the ride
            const ride = await rideService.startRide({ rideId, otp });
    
            if (!ride) {
                return res.status(404).json({ message: 'Ride not found or failed to start' });
            }
    
            // Send ride data to the socket
            sendMessageToSocketId(ride.user.socketId, {
                event: 'ride-started',
                data: ride
            });
    
            // Return the updated ride data
            res.status(200).json(ride);
        } catch (err) {
            console.error('Error in startRide:', err);
            res.status(500).json({ message: err.message });
        }
    };
    
    // End Ride
    module.exports.endRide = async (req, res) => {
        console.log("Received Request Body:", req.body);
        console.log("Authenticated Captain:", req.captain);
    
        if (!req.body || !req.body.rideId) {
            return res.status(400).json({ message: "Ride ID is required" });
        }
    
        try {
            // Fetch the ride from the database
            const ride = await rideModel.findOne({
                _id: req.body.rideId,
                captain: req.captain._id // Ensure the ride belongs to the authenticated captain
            }).populate("user").populate("captain");
    
            console.log("Found Ride:", ride);
    
            if (!ride) {
                return res.status(404).json({ message: "Ride not found" });
            }
    
            if (ride.status !== "ongoing") {
                return res.status(400).json({ message: "Ride is not ongoing" });
            }
    
            // Update ride status to 'completed'
            await rideModel.findByIdAndUpdate(req.body.rideId, { status: "completed" });
    
            res.status(200).json({ message: "Ride ended successfully", ride });
        } catch (err) {
            console.error("Error in endRide:", err);
            res.status(500).json({ message: err.message });
        }
    };
    
// Ride History

module.exports.rideHistory = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user ID

        // Find rides where user ID matches and status is 'completed', and populate user and captain details
        const completedRides = await rideModel.find({
            user: userId,
            status: 'completed'
        })
        .populate('user', 'name email')   // Populate user details (adjust fields as needed)
        .populate('captain', 'name email'); // Populate captain details (adjust fields as needed)

        if (!completedRides.length) {
            return res.status(404).json({ message: 'No completed rides found' });
        }

        res.json(completedRides);
    } catch (err) {
        console.error('Error fetching ride history:', err);
        res.status(500).json({ error: err.message });
    }
};


//Captain History

module.exports.captainRideHistory = async (req, res) => {
    try {
        const captainId = req.captain._id; // Authenticated captain ID

        // Find rides where captain ID matches and status is 'completed'
        const completedRides = await rideModel.find({
            captain: captainId,
            status: 'completed'
        });

        if (!completedRides.length) {
            return res.status(404).json({ message: 'No completed rides found for this captain' });
        }

        // Optionally, calculate total fare
        const totalFare = completedRides.reduce((total, ride) => total + ride.fare, 0);

        res.json({ completedRides, totalFare });
    } catch (err) {
        console.error('Error fetching captain ride history:', err);
        res.status(500).json({ error: err.message });
    }
};


//Cancel Ride 

module.exports.cancelRide = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user ID from middleware

        // Find the ongoing ride for the authenticated user
        const ride = await rideModel.findOne({ user: userId, status: 'ongoing' }).populate('captain'); // Assuming 'captain' is a reference field

        if (!ride) {
            return res.status(404).json({ message: 'No ongoing ride found for cancellation.' });
        }

        // Find the captain associated with the ride (captain populated with the ride)
        const captain = ride.captain;

        if (!captain) {
            return res.status(404).json({ message: 'No captain found for this ride.' });
        }

        // Delete the ongoing ride
        await rideModel.deleteOne({ _id: ride._id });

        // Send a message to the captain via socket
        sendMessageToSocketId(captain.socketId, {
            event: 'ride-cancel',
            data: ride
        });

        return res.status(200).json({ message: 'Ride canceled successfully.' });
    } catch (err) {
        console.error('Error canceling ride:', err);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


//get fare

module.exports.getOnlyFare = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user ID

        // Find rides where user ID matches and status is 'completed', and populate user and captain details
        const completedRides = await rideModel.find({
            user: userId,
            status: 'ongoing'
        }).select('fare');
       
        
        if (!completedRides.length) {
            return res.status(404).json({ message: 'No completed rides found' });
        }

        res.json(completedRides);
    } catch (err) {
        console.error('Error fetching ride history:', err);
        res.status(500).json({ error: err.message });
    }
};


//Get all ride data
module.exports.getAllRideData = async (req, res)=>{
    try{
        const ride = await rideModel.find();
        res.status(200).json(ride)
    } catch (error)  {
        console.log('Error fetching ride!',error);
        res.status(500).json({ message: "Internal server error! "})
    }
}

//Delete Ride
module.exports.deleteRide = async (req, res) => {
    try {
        const id = req.params.id.trim();

        // Validate ObjectId format
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid Ride ID format" });
        }

        const deletedRide = await rideModel.findByIdAndDelete(id);

        if (!deletedRide) {
            return res.status(404).json({ message: "Ride not found" });
        }

        // Success response
        return res.status(200).json({ message: "Ride deleted successfully" });

    } catch (error) {
        console.error("Error deleting ride:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



//Complete Rides
module.exports.getAllCompletedRides = async (req, res)=>{
    try{
        const ride = await rideModel.find({ status: "completed" });
        res.status(200).json(ride)
    } catch (error)  {
        console.log('Error fetching ride!',error);
        res.status(500).json({ message: "Internal server error! "})
    }
}

//Delete Row Data
module.exports.deleteCompleteRide = async (req, res) => {
    try {
        const id = req.params.id.trim(); //  Remove extra spaces or newlines

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid Ride ID format" });
        }

        const deletedRide = await rideModel.findByIdAndDelete(id);

        if (!deletedRide) {
            return res.status(404).json({ message: "Ride not found" });
        }

        res.status(200).json({ message: "Ride deleted successfully" });
    } catch (error) {
        console.error("Error deleting ride:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports.getUserRide = async (req, res) => {
    try {
        const userId = req.user._id; // Get userId from token

        const ride = await rideModel.findOne({ user: userId, status: "ongoing" });
        if (!ride) return res.status(404).json({ message: "No active ride found" });

        res.json({
            rideId: ride._id,
            userId: ride.user,
            captainId: ride.captain,
        });
    } catch (error) {
        console.error("Error fetching user ride:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports.getCaptainRide = async (req, res) => {
    try {
        const captainId = req.captain._id; // Get captainId from token

        const ride = await rideModel.findOne({ captain: captainId, status: "ongoing" });
        if (!ride) return res.status(404).json({ message: "No active ride found" });

        res.json({
            rideId: ride._id,
            userId: ride.user,
            captainId: ride.captain,
        });
    } catch (error) {
        console.error("Error fetching captain ride:", error);
        res.status(500).json({ message: "Server error" });
    }
};
