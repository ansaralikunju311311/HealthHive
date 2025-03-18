import express from "express";
import { loginAdmin, verifyAdminToken } from "../Controllers/adminController.js";
import { patients, pendingDoctors, approveDoctor, doctors, rejectDoctor, handleBlock,patientBlock  ,addDepartment,getDepartments,updateDepartment,userCount,earnings,fetchDoctorPayments,revenueAdmin,userReport} from "../Controllers/adminController.js";
import { protectAdmin } from "../Middleware/authMiddleware.js";
const admin = express.Router();
admin.post("/login", loginAdmin);
admin.get("/verify-token", protectAdmin, verifyAdminToken);
admin.use(protectAdmin); 

admin.get("/patients", patients);
admin.get("/pending-doctors", pendingDoctors);
admin.get("/doctors", doctors);
admin.put("/approve-doctor/:doctorid", approveDoctor);
admin.put("/reject-doctor/:doctorid", rejectDoctor);
admin.put('/unblockpatient/:patientid', patientBlock);
admin.put("/blockdoctor/:doctorid", handleBlock);
admin.post("/department", addDepartment)
admin.get("/department", getDepartments)
admin.put("/department/:id", updateDepartment)
admin.get("/usercount", userCount);
admin.get("/admin-earnings",earnings)
admin.get("/getdoctorpayments",fetchDoctorPayments);
admin.get("/revenue/:filter",revenueAdmin);


admin.get('/userdoctor/:filter',userReport)
// admin.get("/salesdata",salesData)
export default admin;