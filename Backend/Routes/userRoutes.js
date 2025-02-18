import express from 'express';
import mongoose from 'mongoose';
import {protect} from '../Middleware/authMiddleware.js';
import {
    RegisterUser,
     LoginUser, 
     verifyOtp, 
     getOtpRemainingTime,
      resendOtp, 
      forgotPassword,
       resetPassword, 
       verifyToken,
       getDoctorsData,
       logout,
       getDepartments,
       dptdoctor,
    //    bookAppointment,
       FetchAppoiments
    } from '../Controllers/userController.js';
const router = express.Router();


// Public routes (no authentication needed)

router.post('/signup', RegisterUser);
router.post('/login', LoginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.get('/otp-remaining-time', getOtpRemainingTime);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/publicdoctors', getDoctorsData);
router.get('/Aboutdoctors', getDoctorsData);
router.post('/logout', logout);
router.get('/departments', getDepartments);
router.get('/appointments/:departmentname',dptdoctor)
// router.post('/book-appointments/:doctorid/:userid', bookAppointment);
// Protected routes (require authentication)
router.get('/verify-token', protect, verifyToken);
router.get('/doctorsdetails', protect,getDoctorsData);
router.get('/getappointments/:userid',FetchAppoiments);

export default router;
