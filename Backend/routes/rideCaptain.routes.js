const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const authMiddleware = require('../middlewares/auth.middleware');
const rideCaptainModel = require('../models/rideCaptain.model'); // Ensure model usage if needed
const rideCaptainController = require('../controllers/rideCaptain.controller'); // Correct controller import

router.post(
    '/rideCaptainInfo',
    authMiddleware.authCaptain,  // Authentication to get captain info from token
    rideCaptainController.storeRideCaptainInfo  // Correct method name from the controller
);



module.exports = router;
