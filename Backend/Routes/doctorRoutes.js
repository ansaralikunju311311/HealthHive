import express from 'express';
import { RegisterDoctor, LoginDoctor, verifyDoctorToken } from '../Controllers/doctorController.js';
import { protectDoctor } from '../Middleware/authMiddleware.js';

const doctor = express.Router();

doctor.post("/signup",RegisterDoctor);
doctor.post("/login",LoginDoctor);
doctor.get('/verify-token', protectDoctor, verifyDoctorToken);

export default doctor;