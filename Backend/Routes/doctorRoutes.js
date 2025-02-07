import express from 'express';
import { RegisterDoctor, LoginDoctor, verifyDoctorToken,fetchDoctors,forgotPassword,resetPassword ,doctorProfile,fetchDepartments,logout,schedule,getSchedules} from '../Controllers/doctorController.js';
import { protectDoctor } from '../Middleware/authMiddleware.js';

const doctor = express.Router();

// Public routes (no authentication needed)
doctor.post("/signup", RegisterDoctor);
doctor.post("/login", LoginDoctor);
doctor.post('/forgot-password', forgotPassword);
doctor.post('/reset-password', resetPassword);
doctor.get("/get-doctor",fetchDoctors);
doctor.get("/profile/:id",doctorProfile)
doctor.get("/departments",fetchDepartments)
doctor.post('/logout', logout);
doctor.post('/schedule/:id', schedule);
doctor.get('/existing-schedules/:id', getSchedules);
// Protected routes (require authentication)
doctor.get('/verify-token', protectDoctor, verifyDoctorToken);

export default doctor;