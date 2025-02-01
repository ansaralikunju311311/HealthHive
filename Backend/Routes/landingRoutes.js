import express from "express";
import { fetchDoctors } from "../Controllers/landingController.js";
const landing = express.Router();

landing.get("/landingdoctors", fetchDoctors);

export default landing;