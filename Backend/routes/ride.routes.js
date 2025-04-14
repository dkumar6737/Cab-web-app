const express = require('express');
const router = express.Router();
const { body, query } = require('express-validator');
const rideController = require('../controllers/ride.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const rideModel = require('../models/ride.model');


router.post('/create',
    authMiddleware.authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'moto' ]).withMessage('Invalid vehicle type'),
    rideController.createRide
)

router.get('/get-fare',
    authMiddleware.authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    rideController.getFare
)

router.post('/confirm',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    // body('captainId').isMongoId().withMessage('Invalid captain id'),
    rideController.confirmRide
);
 

router.get('/start-ride',
    authMiddleware.authCaptain,
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    rideController.startRide
);
 

router.get('/rideInfo',authMiddleware.authCaptain, (req,res)=>{
    rideModel.find()
    .then(rides => res.json(rides))
    .catch(err => res.status(500).json({ error:err.message}))

})
router.post('/end-ride',
    authMiddleware.authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    rideController.endRide
)

router.get('/ridehistory', 
    authMiddleware.authUser, 
    rideController.rideHistory
);


//Captain History
router.get(
  "/captain-history",
  authMiddleware.authCaptain, // Ensure user is authenticated
  rideController.captainRideHistory
);

// Cancle Ride
router.delete(
    '/ride-cancel',
    authMiddleware.authUser,
    rideController.cancelRide
)

//get fare
router.get(
    '/ride-fare',
    authMiddleware.authUser,
    rideController.getOnlyFare
);

//Rides Data
router.get(
    '/ride-Data',
    rideController.getAllRideData
);

//delete Ride
router.delete(
    "/ride-Delete/:id",
     rideController.deleteRide
    );


//Complete Rides
router.get(
    '/Complete-Rides',
    rideController.getAllCompletedRides
);



router.get("/user-ID", authMiddleware.authUser, rideController.getUserRide);

router.get("/Captain-ID", authMiddleware.authCaptain, rideController.getCaptainRide);
module.exports = router;