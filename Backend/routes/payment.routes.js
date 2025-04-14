const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware');
const paymentController = require('../controllers/payment.controllers');

// Create Payment Route
router.post('/create-payment',
    authMiddleware.authUser,
    paymentController.createPayment
);


//Show Payment Data Route
router.get(
    '/all-payment-data',
    paymentController.getAllPaymentData
);
module.exports = router;

router.delete('/delete-payment/:id',
    paymentController.deletePayment
);