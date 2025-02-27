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
       handlePayment,
       bookAppointment,
       FetchAppoiments,
       verifyPayment,
       fetchDoctor,
       chatDetails
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
router.post('/book-appointments/:doctorid/:userid', bookAppointment);
// Payment routes
router.post('/pay',handlePayment)
router.post('/verify-payment', verifyPayment)
// Protected routes (require authentication)
router.get('/verify-token', protect, verifyToken);
router.get('/doctorsdetails', protect,getDoctorsData);
router.get('/getappointments/:userid',FetchAppoiments);


router.get('/doctorinfo/:doctorId',fetchDoctor);
// router.post('/chat/:doctorId/:userId',handleChat);
// router.get('/doctorChat',getDoctorChat);
// router.get('/ChatDetails/:doctorId/:userId',chatDetails);


// router.post('/sendmessage',sendMessage);
// router.get('/Chats/:roomId',getChat);
router.get('/Chats/:doctorId/:userId',chatDetails);

export default router;
