import express from 'express';
import mongoose from 'mongoose';
import {protect} from '../Middleware/authMiddleware.js';
import {RegisterUser, LoginUser, verifyOtp, getOtpRemainingTime, resendOtp, forgotPassword, resetPassword, verifyToken} from '../Controllers/userController.js';
const router = express.Router();

// Public routes (no authentication needed)
router.post('/signup', RegisterUser);
router.post('/login', LoginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.get('/otp-remaining-time', getOtpRemainingTime);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.get('/verify-token', protect, verifyToken);

export default router;
