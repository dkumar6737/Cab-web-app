const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const adminController = require('../controllers/admin.controllers');
const authMiddleware = require('../middlewares/auth.middleware');
const adminModel = require('../models/admin.model');

router.post('/register',[
    body('email').isEmail().withMessage('Invalid Email!'),
    body('fullname.firstname').isLength({ min: 5 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    adminController.registerAdmin
)

router.post('/login',[
    body('email').isEmail().withMessage('Invalid Email!'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    adminController.loginAdmin
)

router.get(
    '/adminLogout',
    authMiddleware.authAdmin,
    adminController.logoutAdmin
)

//admin Data
router.get(
    '/adminData',
    adminController.getAllAdminData
);

router.delete(
    '/deleteAdmin/:id',
    adminController.deleteAdmin
)

module.exports = router;