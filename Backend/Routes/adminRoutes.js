import express from "express";
import { LoginAdmin } from "../Controllers/adminController.js";
import { patients, pendingDoctors,approveDoctor,doctors } from "../Controllers/adminController.js";

const admin = express.Router();

admin.post("/login", LoginAdmin);
// admin.post("/register", RegisterAdmin);
admin.get("/patients",patients);
admin.get("/pending-doctors",pendingDoctors);
admin.put("/approve-doctor/:doctorid",approveDoctor);
admin.get("/doctors",doctors);

export default admin;