import express from "express";
import { LoginAdmin } from "../Controllers/adminController.js";

const admin = express.Router();

admin.post("/login", LoginAdmin);
// admin.post("/register", RegisterAdmin);

export default admin;