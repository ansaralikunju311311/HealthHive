import express from 'express';
import mongoose from 'mongoose';
import {protect} from '../Middleware/authMiddleware.js';
import {RegisterUser, LoginUser, verifyOtp, getOtpRemainingTime, resendOtp,forgotPassword,resetPassword, verifyToken} from '../Controllers/userController.js';
const router = express.Router();

router.post('/signup',RegisterUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login',LoginUser);
router.get('/otp-remaining-time', getOtpRemainingTime);
router.get('/verify-token', protect, verifyToken);
router.post('/forgot-password', forgotPassword);
// router.get('/profile', getProfile);
router.post('/reset-password', resetPassword);


export default router;
