import express from 'express';
import mongoose from 'mongoose';
import {protect} from '../Middleware/AuthMiddleware.js';
import {
    RegisterUser,
     LoginUser, 
     VerifyOtp, 
     GetOtpRemainingTime,
      ResendOtp, 
      ForgotPassword,
       ResetPassword, 
       VerifyToken,
       GetDoctorsData,
       Logout,
       GetDepartments,
       Dptdoctor,
       HandlePayment,
       BookAppointment,
       FetchAppoiments,
       VerifyPayment,
       FetchDoctor,
       ChatDetails,
         GoogleSignUp,
         ProfileSetup,
         GoogleSignIn
    } from '../Controllers/UserController.js';
const router = express.Router();
router.post('/signup', RegisterUser);//
router.post('/login', LoginUser);//
router.post('/verify-otp', VerifyOtp);
router.post('/resend-otp', ResendOtp);
router.get('/otp-remaining-time', GetOtpRemainingTime);
router.post('/forgot-password', ForgotPassword);
router.post('/reset-password', ResetPassword);
router.get('/publicdoctors', GetDoctorsData);//
router.get('/Aboutdoctors', GetDoctorsData);//
router.post('/logout', Logout);//
router.get('/departments', GetDepartments);//
router.get('/appointments/:departmentname',Dptdoctor)
router.post('/book-appointments/:doctorid/:userid', BookAppointment);
router.post('/pay',HandlePayment)
router.post('/verify-payment', VerifyPayment)//
router.get('/verify-token', protect, VerifyToken);
router.get('/doctorsdetails', protect,GetDoctorsData);//
router.get('/getappointments/:userid',FetchAppoiments);
router.post('/google-signup',GoogleSignUp);
router.get('/doctorinfo/:doctorId',FetchDoctor);
router.get('/Chats/:doctorId/:userId',ChatDetails);
router.post('/profile-completion',ProfileSetup);
router.post('/google-login',GoogleSignIn);

export default router;
