const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator")
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const UserModel = require('../models/user.model')


router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    userController.registerUser
)

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    userController.loginUser
)


router.get('/users', authMiddleware.authUser, (req, res) => {
    UserModel.find()
        .then(users => res.json(users))
        .catch(err => res.status(500).json({ error: err.message }));
});

router.get('/profile', authMiddleware.authUser, userController.getUserProfile)

router.get('/logout', authMiddleware.authUser, userController.logoutUser)

// router.get('/username', authMiddleware.authUser, userController.getUsername);



router.post(
    '/delete-account',
    authMiddleware.authUser,  // Ensure the user is authenticated
    body('password').isString().withMessage('Password is required'),
    userController.deleteAccount  // Call the delete account function
);


//  User histroy
router.get(
    '/users-Data',  // Route to get all users
    authMiddleware.authAdmin,  // Ensuring only admins can fetch users
    userController.getAllUsers
);

// Delete Row user Data
router.delete(
    "/users-Delete/:id", 
    userController.deleteUser
);


module.exports = router;