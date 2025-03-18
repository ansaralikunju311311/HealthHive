import express from 'express';
import { 
    registerDoctor, 
    loginDoctor, 
    verifyDoctorToken, 
    fetchDoctors, 
    forgotPassword, 
    resetPassword, 
    doctorProfile, 
    fetchDepartments, 
    logout, 
    schedule, 
    getSchedules, 
    slots, 
    fullAppoiments, 
    fetchAppointments, 
    fetchWalletBalance,
    userDetails,
    chatDetails,
    updateDoctorProfile,
    // salesData,
    // graphDetails,
    getDashboardData
} from '../Controllers/doctorController.js';
import { protectDoctor } from '../Middleware/authMiddleware.js';

const doctor = express.Router();

doctor.post("/signup", registerDoctor);
doctor.post("/login", loginDoctor);
doctor.post('/forgot-password', forgotPassword);
doctor.post('/reset-password', resetPassword);
doctor.get("/get-doctor",fetchDoctors);
doctor.get("/profile/:id",doctorProfile)
doctor.get("/departments",fetchDepartments)
doctor.post('/logout', logout);
doctor.post('/schedule/:id', schedule);
doctor.get('/existing-schedules/:id', getSchedules);
doctor.get('/slots/:id',slots);
doctor.get('/appointments/:doctor_Id',fetchAppointments);
doctor.get('/appoimentdetails/:id',fullAppoiments);
doctor.get('/doctor-wallet-balance/:id',fetchWalletBalance);
doctor.get('/userinfo/:userId',userDetails);
doctor.get('/Chats/:doctorId/:userId',chatDetails)
doctor.put('/profile/:id',updateDoctorProfile)

doctor.get('/verify-token', protectDoctor, verifyDoctorToken);
// doctor.get('/graphdetails/:doctorId/:filter', graphDetails);
// doctor.get('/salesdata/:id',salesData)
doctor.get('/dashboard/:doctorId/:filter', getDashboardData);
export default doctor;