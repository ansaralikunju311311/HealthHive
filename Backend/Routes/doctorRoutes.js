import express from 'express';
import { RegisterDoctor, LoginDoctor, verifyDoctorToken,fetchDoctors,forgotPassword,resetPassword } from '../Controllers/doctorController.js';
import { protectDoctor } from '../Middleware/authMiddleware.js';

const doctor = express.Router();

doctor.post("/signup",RegisterDoctor);
doctor.post("/login",LoginDoctor);
doctor.get('/verify-token', protectDoctor, verifyDoctorToken);
doctor.post('/forgot-password', forgotPassword);
doctor.post('/reset-password', resetPassword);
doctor.get("/get-doctor",fetchDoctors);


export default doctor;