import express from "express";
import { LoginAdmin, verifyAdminToken } from "../Controllers/adminController.js";
import { patients, pendingDoctors, approveDoctor, doctors, rejectDoctor, blockDoctor, handleBlock, unblockDoctor, patientUnblock  ,addDepartment} from "../Controllers/adminController.js";
import { protectAdmin } from "../Middleware/authMiddleware.js";

const admin = express.Router();

// Public routes (no authentication needed)
admin.post("/login", LoginAdmin);
admin.get("/verify-token", protectAdmin, verifyAdminToken);

// Protected routes (require admin authentication)
admin.use(protectAdmin); // Apply protectAdmin middleware to all routes below this line

admin.get("/patients", patients);
admin.get("/pending-doctors", pendingDoctors);
admin.get("/doctors", doctors);
admin.put("/approve-doctor/:doctorid", approveDoctor);
admin.put("/reject-doctor/:doctorid", rejectDoctor);
admin.put("/blockdoctor/:doctorid", blockDoctor);
admin.put('/blockpatient/:patientid', handleBlock);
admin.put('/unblockdoctor/:doctorid', unblockDoctor);
admin.put('/unblockpatient/:patientid', patientUnblock);
admin.post("/department", addDepartment)

export default admin;