import express from 'express';
import { RegisterDoctor, LoginDoctor, verifyDoctorToken,fetchDoctors,forgotPassword,resetPassword ,doctorProfile} from '../Controllers/doctorController.js';
import { protectDoctor } from '../Middleware/authMiddleware.js';

const doctor = express.Router();

doctor.use(protectDoctor);
doctor.post("/signup",RegisterDoctor);
doctor.post("/login",LoginDoctor);
doctor.get('/verify-token', protectDoctor, verifyDoctorToken);
doctor.post('/forgot-password', forgotPassword);
doctor.post('/reset-password', resetPassword);
doctor.get("/get-doctor",fetchDoctors);
doctor.get("/profile/:id",doctorProfile)


export default doctor;