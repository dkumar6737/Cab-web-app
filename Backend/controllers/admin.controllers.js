const adminModel = require('../models/admin.model'); // Fixed path
const { validationResult } = require('express-validator');
const adminService = require('../services/admin.service');
const bcrypt = require('bcrypt');
const blackListTokenModel = require('../models/blacklistToken.model');

module.exports.registerAdmin = async (req, res, next) => {
    try {
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullname, email, password } = req.body;

        // Ensure fullname is an object
        if (!fullname || typeof fullname !== 'object') {
            return res.status(400).json({ message: 'Fullname must be an object with firstname and lastname' });
        }

        const firstname = fullname.firstname;
        const lastname = fullname.lastname || ''; // Default to empty string if lastname is missing

        // Check if admin already exists
        const isAdminAlready = await adminModel.findOne({ email });
        if (isAdminAlready) {
            return res.status(400).json({ message: 'Admin already exists!' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new admin
        const admin = await adminService.createAdmin({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });

        // Generate token if method exists
        const token = admin.generateAuthToken ? admin.generateAuthToken() : null;

        res.status(201).json({ token, admin });
    } catch (error) {
        next(error); // Pass error to Express error handler
    }
};

//Login Admin

module.exports.loginAdmin = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email }).select('+password');

    console.log(admin);
    if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const ismatch = await admin.comparePassword(password);

    if (!ismatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }


    const token = admin.generateAuthToken();
    res.cookie('token', token);

    res.status(200).json({ token, admin });
}

//Logout Admin
module.exports.logoutAdmin = async (req, res, next) => {
    res.clearCookie('token');
    const token = req.cookies.token || req.headers.authorization.split(' ')[1];

    await blackListTokenModel.create({ token });
    res.status(200).json({ message: 'Logged out' });
}

//Admin Data
module, exports.getAllAdminData = async (req, res, next) => {

    try {
        const admin = await adminModel.find();
        res.status(200).json(admin);
    } catch (error) {
        next(error);
    }
}

//Delete Admin
module.exports.deleteAdmin = async (req, res) => {
    try {
        const id = req.params.id.trim(); //  Remove extra spaces or newlines

        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        const deleteAdmin = await adminModel.findByIdAndDelete(id);

        if (!deleteAdmin) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Admin deleted successfully" });
    } catch (error) {
        console.error("Error deleting Admin:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
