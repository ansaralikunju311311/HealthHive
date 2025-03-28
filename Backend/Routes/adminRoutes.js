import express from "express";
import { 
    loginAdmin, 
    verifyAdminToken
 } from "../Controllers/adminController/adminController.js";
import { 
     patients, 
     pendingDoctors,
     doctors, 
     handleBlock,
     patientBlock  ,
     userCount,
    } 
     from "../Controllers/adminController/adminController.js";
     import {
        approveDoctor, 
        rejectDoctor
    } 
    from "../Controllers/adminController/verificationController.js";

    import {
        addDepartment, 
        getDepartments, 
        updateDepartment
    }
     from '../Controllers/adminController/departmentController.js'
    import 
    { 
        earnings, 
        fetchDoctorPayments
     } from '../Controllers/adminController/paymentController.js';
    import { 
        getDashboardData 
    } from '../Controllers/adminController/dashBoardController.js';
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
admin.get("/dashboard/:filter", getDashboardData);

export default admin;