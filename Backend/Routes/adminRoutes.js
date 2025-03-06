import express from "express";
import { LoginAdmin, VerifyAdminToken } from "../Controllers/adminController.js";
import { Patients, PendingDoctors, ApproveDoctor, Doctors, RejectDoctor, HandleBlock,PatientBlock  ,AddDepartment,GetDepartments,UpdateDepartment,UserCount,Earnings,FetchDoctorPayments} from "../Controllers/adminController.js";
import { protectAdmin } from "../Middleware/authMiddleware.js";
const admin = express.Router();
admin.post("/login", LoginAdmin);
admin.get("/verify-token", protectAdmin, VerifyAdminToken);
admin.use(protectAdmin); 

admin.get("/patients", Patients);
admin.get("/pending-doctors", PendingDoctors);
admin.get("/doctors", Doctors);
admin.put("/approve-doctor/:doctorid", ApproveDoctor);
admin.put("/reject-doctor/:doctorid", RejectDoctor);
admin.put('/unblockpatient/:patientid', PatientBlock);
admin.put("/blockdoctor/:doctorid", HandleBlock);
admin.post("/department", AddDepartment)
admin.get("/department", GetDepartments)
admin.put("/department/:id", UpdateDepartment)
admin.get("/usercount", UserCount);
admin.get("/admin-earnings",Earnings)
admin.get("/getdoctorpayments",FetchDoctorPayments)
export default admin;