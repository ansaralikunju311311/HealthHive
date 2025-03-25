import express from 'express';
import mongoose from 'mongoose';
import {protect} from '../Middleware/authMiddleware.js';
import {
    registerUser,
     loginUser, 
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
       fetchAppoiments,
       verifyPayment,
       fetchDoctor,
       chatDetails,
         googleSignUp,
         profileSetup,
         googleSignIn,
         getPrescription
    } from '../Controllers/userController.js';
const router = express.Router();
router.post('/signup', registerUser);//
router.post('/login', loginUser);//
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.get('/otp-remaining-time', getOtpRemainingTime);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/publicdoctors', getDoctorsData);
router.get('/Aboutdoctors', getDoctorsData);
router.post('/logout', logout);//
router.get('/departments', getDepartments);
router.get('/appointments/:departmentname',dptdoctor)
router.post('/book-appointments/:doctorid/:userid', bookAppointment);
router.post('/pay',handlePayment)
router.post('/verify-payment', verifyPayment)
router.get('/verify-token', protect, verifyToken);
router.get('/doctorsdetails', protect,getDoctorsData);
router.get('/getappointments/:userid',fetchAppoiments);
router.post('/google-signup',googleSignUp);
router.get('/doctorinfo/:doctorId',fetchDoctor);
router.get('/Chats/:doctorId/:userId',chatDetails);
router.post('/profile-completion',profileSetup);
router.post('/google-login',googleSignIn);
router.get('/prescription/:unique',getPrescription);

export default router;
