// Auth routes with OTP
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Signup routes
router.post('/signup-initiate', authController.signupInitiate);
router.post('/signup-verify-otp', authController.signupVerifyOTP);

// Forgot password routes
router.post('/forgot-password-initiate', authController.forgotPasswordInitiate);
router.post('/forgot-password-verify-otp', authController.forgotPasswordVerifyOTP);
router.post('/reset-password', authController.resetPassword);

// Login
router.post('/login', authController.login);

module.exports = router;
