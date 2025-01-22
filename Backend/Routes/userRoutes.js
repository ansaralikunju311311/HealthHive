import express from 'express';
import mongoose from 'mongoose';
import {RegisterUser, LoginUser, verifyOtp, getOtpRemainingTime, generateOtp} from '../Controllers/userController.js';
const router = express.Router();

router.post('/signup',RegisterUser);
router.post('/generate-otp', generateOtp);
router.post('/verify-otp',verifyOtp);
router.post('/login',LoginUser);
router.get('/otp-remaining-time', getOtpRemainingTime);

export default router;
