import express from "express";
import { LoginAdmin } from "../Controllers/adminController.js";
import { patients } from "../Controllers/adminController.js";

const admin = express.Router();

admin.post("/login", LoginAdmin);
// admin.post("/register", RegisterAdmin);
admin.get("/patients",patients);

export default admin;