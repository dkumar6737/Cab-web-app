const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const blackListTokenModel = require('../models/blacklistToken.model');
const { validationResult } = require('express-validator');


module.exports.registerCaptain = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password, vehicle } = req.body;

    const isCaptainAlreadyExist = await captainModel.findOne({ email });

    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: 'Captain already exist' });
    }


    const hashedPassword = await captainModel.hashPassword(password);

    const captains = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captains.generateAuthToken();

    res.status(201).json({ token, captains });

    // console.log(req.body);

}

module.exports.loginCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await captainModel.findOne({ email }).select('+password');

    if (!captain) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = captain.generateAuthToken();


    captain.status = 'active';
    await captain.save();

    res.cookie('token', token);

    res.status(200).json({ token, captain });
};


module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    await blackListTokenModel.create({ token });

    const captain = await captainModel.findById(req.captain._id);
    if (captain) {
        captain.status = 'inactive';
        await captain.save();
    }

    res.clearCookie('token');

    res.status(200).json({ message: 'Logout successfully' });
}
// controller/captainController.js
// const captainService = require('../services/captainService');

//captain data
module.exports.getAllCaptain = async (req, res) => {
    try {
        const users = await captainModel.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

//Delete captain
module.exports.deleteCaptain = async (req, res) => {
    try {
        const id = req.params.id.trim();

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid Captain Id" })
        }

        const deleteCaptain = await captainModel.findByIdAndDelete(id);

        if (!deleteCaptain) {
            return res.status(404).json({ message: "Captain not found" })
        }
        res.status(200).json({ message: "Captain Delete successfully" })
    } catch (error) {
        console.log("Error deleting captain", error)
        res.status(500).json({ message: "Internal server Error!" })
    }
};

