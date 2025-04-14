const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blackListToken.model');
const captainModel = require('../models/captain.model');
const rideModel = require('../models/ride.model');
const mongoose = require('mongoose');
const adminModel = require('../models/admin.model');



module.exports.authUser = async (req, res, next) => {
    try {
        // Extract token from cookies or headers
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }

        // Check if token is blacklisted
        const isBlacklisted = await blackListTokenModel.findOne({ token });

        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized - Token is blacklisted' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?._id) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        // Fetch the user from database
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Attach user & token to request for further use
        req.user = user;
        req.token = token;

        next();
    } catch (err) {
        console.error('Authentication Error:', err);
        return res.status(401).json({ message: 'Unauthorized1 - Invalid or expired token' });
    }
};

// Example of async handling

module.exports.authCaptain = async (req, res, next) => {
    // Extract token from cookies or headers
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    console.log("Received Token:", token);  // Debugging token value

    // If no token, respond with Unauthorized
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    // Check if token is blacklisted
    const isBlacklisted = await blackListTokenModel.findOne({ token: token });
    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized: Token is blacklisted' });
    }

    try {
        // Verify the token using JWT secret
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging decoded token

        // Fetch the captain using the decoded user ID
        const captain = await captainModel.findById(decoded._id);
        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        // Attach the captain data to the request object
        req.captain = captain;
        console.log("Authenticated Captain:", captain); // Debugging captain data

        // Continue to next middleware/route handler
        return next();
    } catch (err) {
        console.error("JWT Error:", err.message); // Log error message for better debugging
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
};


// Admin Middlware

module.exports.authAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?._id) {
            return res.status(401).json({ message: "Unauthorized - Invalid token" });
        }

        const admin = await adminModel.findById(decoded._id);
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        req.admin = admin;
        next();
    } catch (err) {
        console.error("Authentication Error:", err);
        return res.status(401).json({ message: "Unauthorized - Invalid or expired token" });
    }
};
