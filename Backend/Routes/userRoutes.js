import express from 'express';
import mongoose from 'mongoose';
import {RegisterUser, LoginUser, verifyOtp, getOtpRemainingTime, resendOtp,forgotPassword,resetPassword, verifyToken} from '../Controllers/userController.js';
const router = express.Router();

router.post('/signup',RegisterUser);
router.post('/verify-otp',verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login',LoginUser);
router.get('/otp-remaining-time', getOtpRemainingTime);
router.get('/verify-token', verifyToken);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


export default router;
