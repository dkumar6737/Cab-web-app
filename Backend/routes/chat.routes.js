const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chat.controller');

const router = express.Router();

router.post('/userMessage/:rideId',
    authMiddleware.authUser,
    chatController.sendUserMessage
)


router.get('/getMessageFromUser/:rideId',
    authMiddleware.authCaptain,
    chatController.getUserMessagesFromCaptain
)


router.post('/CaptainMessageSendTouser/:rideId',
    authMiddleware.authCaptain,
    chatController.sendCaptainMessageToUser
)


router.get('/getCaptainMessage/:rideId',
    authMiddleware.authUser,
    chatController.getCaptainMessagesFromUser
)
module.exports = router;
