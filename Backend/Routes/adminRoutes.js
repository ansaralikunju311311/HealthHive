import express from "express";
import { LoginAdmin, verifyAdminToken } from "../Controllers/adminController.js";
import { patients, pendingDoctors,approveDoctor,doctors,rejectDoctor,blockDoctor,handleBlock,unblockDoctor,patientUnblock } from "../Controllers/adminController.js";
import { protectAdmin } from "../Middleware/authMiddleware.js";

const admin = express.Router();

admin.post("/login", LoginAdmin);
// admin.post("/register", RegisterAdmin);
admin.get("/patients",patients);
admin.get("/pending-doctors",pendingDoctors);
admin.put("/approve-doctor/:doctorid",approveDoctor);
admin.get("/doctors",doctors);
admin.put("/reject-doctor/:doctorid",rejectDoctor);
admin.put("/blockdoctor/:doctorid", blockDoctor);
admin.put('/blockpatient/:patientid', handleBlock);
admin.put('/unblockdoctor/:doctorid', unblockDoctor);
admin.put('/unblockpatient/:patientid', patientUnblock);
admin.get("/verify-token", protectAdmin, verifyAdminToken);
export default admin;