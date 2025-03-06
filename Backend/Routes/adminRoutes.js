import express from "express";
import { LoginAdmin, verifyAdminToken } from "../Controllers/adminController.js";
import { patients, pendingDoctors, approveDoctor, doctors, rejectDoctor, handleBlock,patientblock  ,addDepartment,getDepartments,updateDepartment,userCount,Earnings,fetchDoctorPayments} from "../Controllers/adminController.js";
import { protectAdmin } from "../Middleware/authMiddleware.js";

const admin = express.Router();
admin.post("/login", LoginAdmin);
admin.get("/verify-token", protectAdmin, verifyAdminToken);
admin.use(protectAdmin);

admin.get("/patients", patients);
admin.get("/pending-doctors", pendingDoctors);
admin.get("/doctors", doctors);
admin.put("/approve-doctor/:doctorid", approveDoctor);
admin.put("/reject-doctor/:doctorid", rejectDoctor);
admin.put('/unblockpatient/:patientid', patientblock);
admin.put("/blockdoctor/:doctorid", handleBlock);
admin.post("/department", addDepartment)
admin.get("/department", getDepartments)
admin.put("/department/:id", updateDepartment)
admin.get("/usercount", userCount);
admin.get("/admin-earnings",Earnings)
admin.get("/getdoctorpayments",fetchDoctorPayments)
export default admin;