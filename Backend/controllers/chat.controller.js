const chatModel = require("../models/chat.model");
const rideModel = require("../models/ride.model");
const userModel = require("../models/user.model");
const captainModel = require("../models/captain.model");
const { sendMessageToSocketId } = require("../socket");

// User sends a message to the captain
module.exports.sendUserMessage = async (req, res) => {
    try {
        const { rideId } = req.params;
        const { message } = req.body;
        const userId = req.user?._id; // Ensure user is authenticated

        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: User not authenticated" });
        }

        if (!message?.trim()) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        const ride = await rideModel.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: "Ride not found" });
        }

        if (ride.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Unauthorized: You are not part of this ride" });
        }

        if (!ride.captain) {
            return res.status(400).json({ message: "Captain is not assigned to this ride" });
        }

        const newMessage = await chatModel.create({
            ride: rideId,
            user: userId,
            captain: ride.captain,
            senderType: "user",
            message,
            timestamp: new Date(),
        });

        // Send real-time message to captain if online
        const captain = await captainModel.findById(ride.captain);
        if (captain?.socketId) {
            sendMessageToSocketId(captain.socketId, {
                event: "receiveMessage",
                data: {
                    rideId,
                    message: newMessage.message,
                    senderType: "user",
                    timestamp: newMessage.timestamp,
                },
            });
            console.log("Message sent to captain:", newMessage.message);
        }

        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        console.error("Error sending user message:", error);
        res.status(500).json({ message: "Failed to send message", error });
    }
};


//  Captain sends a message to the user
module.exports.sendCaptainMessageToUser = async (req, res) => {
    try {
        const { rideId } = req.params;
        const { message } = req.body;
        const captainId = req.captain._id;

        if (!message?.trim()) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        const ride = await rideModel.findById(rideId);
        if (!ride || ride.captain.toString() !== captainId.toString()) {
            return res.status(403).json({ message: "Unauthorized: Invalid ride or access denied" });
        }

        const newMessage = await chatModel.create({
            ride: rideId,
            user: ride.user,
            captain: captainId,
            senderType: "captain",
            message,
            timestamp: new Date(),
        });

        // Send real-time message to user if online
        const user = await userModel.findById(ride.user);
        if (user?.socketId) {
            sendMessageToSocketId(user.socketId, {
                event: "receiveMessageFromCaptain",
                data: {
                    rideId,
                    message: newMessage.message,
                    senderType: "captain",
                    timestamp: newMessage.timestamp,
                },
            });
            console.log("Message sent to user:", newMessage.message);
        }

        res.status(201).json({ success: true, message: newMessage });
    } catch (error) {
        console.error("Error sending captain message:", error);
        res.status(500).json({ message: "Failed to send message", error });
    }
};

//  Fetch all messages for a ride (for both user & captain)
module.exports.getMessagesForRide = async (req, res) => {
    try {
        const { rideId } = req.params;

        const messages = await chatModel
            .find({ ride: rideId })
            .sort({ timestamp: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Failed to fetch messages", error });
    }
};

// Fetch only user messages (for captain)
module.exports.getUserMessagesFromCaptain = async (req, res) => {
    try {
        const { rideId } = req.params;

        const messages = await chatModel
            .find({ ride: rideId, senderType: "user" })
            .sort({ timestamp: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching user messages:", error);
        res.status(500).json({ message: "Failed to fetch messages", error });
    }
};

// Fetch only captain messages (for user)
module.exports.getCaptainMessagesFromUser = async (req, res) => {
    try {
        const { rideId } = req.params;

        const messages = await chatModel
            .find({ ride: rideId, senderType: "captain" })
            .sort({ timestamp: 1 });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error("Error fetching captain messages:", error);
        res.status(500).json({ message: "Failed to fetch messages", error });
    }
};
