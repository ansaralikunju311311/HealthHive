import express from 'express';
import { RegisterDoctor, LoginDoctor, VerifyDoctorToken,FetchDoctors,ForgotPassword,ResetPassword ,DoctorProfile,FetchDepartments,Logout,Schedule,GetSchedules,Slots,FullAppoiments,FetchAppointments,FetchWalletBalance,
    UserDetails,
    ChatDetails,
    UpdateDoctorProfile
} from '../Controllers/doctorController.js';
import { protectDoctor } from '../Middleware/authMiddleware.js';

const doctor = express.Router();

doctor.post("/signup", RegisterDoctor);
doctor.post("/login", LoginDoctor);
doctor.post('/forgot-password', ForgotPassword);
doctor.post('/reset-password', ResetPassword);
doctor.get("/get-doctor",FetchDoctors);
doctor.get("/profile/:id",DoctorProfile)
doctor.get("/departments",FetchDepartments)
doctor.post('/logout', Logout);
doctor.post('/schedule/:id', Schedule);
doctor.get('/existing-schedules/:id', GetSchedules);
doctor.get('/slots/:id',Slots);
doctor.get('/appointments/:doctor_Id',FetchAppointments);
doctor.get('/appoimentdetails/:id',FullAppoiments);
doctor.get('/doctor-wallet-balance/:id',FetchWalletBalance);
doctor.get('/userinfo/:userId',UserDetails);
doctor.get('/Chats/:doctorId/:userId',ChatDetails)
doctor.put('/profile/:id',UpdateDoctorProfile)

doctor.get('/verify-token', protectDoctor, VerifyDoctorToken);


export default doctor;