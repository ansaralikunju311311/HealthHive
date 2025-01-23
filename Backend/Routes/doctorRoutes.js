import express from "express";
const doctor = express.Router();
import {LoginDoctor,RegisterDoctor} from "../Controllers/doctorController.js";
doctor.post("/signup",RegisterDoctor);
doctor.post("/login",LoginDoctor);

export default doctor;