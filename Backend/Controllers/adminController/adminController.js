import mongoose from 'mongoose';
import Admin from '../../Model/AdminModel/adminModel.js';
import User from '../../Model/userModel.js';
import Doctor from '../../Model/doctorModel.js';
import bcrypt from 'bcrypt';
import RejectedDoctor from '../../Model/rejectedDoctors.js';
import Transaction from '../../Model/transactionModel.js';
import cookies from 'js-cookie';
import {setToken} from '../../utils/auth.js';
import Department from '../../Model/departmentModel.js';
import { sendDoctorVerificationEmail } from '../../utils/sendMail.js';
import appointment from '../../Model/appoimentModel.js';
import STATUS_CODE from '../../StatusCode/StatusCode.js';
import { populate } from 'dotenv';
const cookieOptions = {
    httpOnly: false,
    secure: true,
    sameSite: 'None',
    maxAge: 9 * 60 * 60 * 1000, 
};
 const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingAdmin = await Admin.findOne({ email });
        if (!existingAdmin) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: "Admin not found" });
        }
        const isMatch = await bcrypt.compare(password, existingAdmin.password);
        if (!isMatch) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Invalid credentials" });
        }
    
           const adminToken = setToken(existingAdmin);
           res.cookie('admintoken', adminToken, cookieOptions);
        res.status(STATUS_CODE.CREATED).json({
            message: "Login successful",
            Admin: {
                _id: existingAdmin._id, 
                email: existingAdmin.email,
               
            },
            adminToken:adminToken
        });
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
export const patients = async (req,res)=>
{
    const {page,limit} = req.params;
    try {
        const page =  +(req.query.page || 1);
        const limit =  +(req.query.limit || 10);
        const skip = (page - 1) * limit;
        const patients = await User.find({isActive:true}).skip(skip).limit(limit);

        const totalpage = Math.ceil(await User.countDocuments({isActive:true}) / limit);
        const patientsWithIndex = patients.map((patient, index) => ({
            ...patient.toObject(),
            serialNumber: index + 1
        }));
        res.status(STATUS_CODE.OK).json({patientsWithIndex,totalpage});
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const pendingDoctors = async (req,res)=>
{
    const {page,limit} = req.params;
    try {
        const page =  +(req.query.page || 1);
        const limit =  +(req.query.limit || 10);
        const skip = (page - 1) * limit;
        const doctors = await Doctor.find({isActive:false}).skip(skip).limit(limit).populate({
            path:'specialization',
            select:'Departmentname'
        });
        const totalpage = Math.ceil(await Doctor.countDocuments({isActive:false}) / limit);
        const doctorsWithIndex = doctors.map((doctor, index) => ({
            ...doctor.toObject(),
            serialNumber: index + 1
          }));
        res.status(STATUS_CODE.OK).json({doctorsWithIndex,totalpage});
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

export const doctors = async (req, res) => {
    const { page, limit } = req.query;
    try {
        const currentPage = +(req.query.page || 1);
        const currentLimit = +(req.query.limit || 10);
        const skip = (currentPage - 1) * currentLimit;

        const doctors = await Doctor.find({ isActive: true })
            .skip(skip)
            .limit(currentLimit)
            .populate({
                path: 'specialization',
                select: 'Departmentname'
            });
        const totalpage = Math.ceil(await Doctor.countDocuments({ isActive: true }) / currentLimit);
        const doctorsWithIndex = doctors.map((doctor, index) => ({
            ...doctor.toObject(),
            serialNumber: index + 1
        }));

        res.status(STATUS_CODE.OK).json({ doctorsWithIndex, totalpage });
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
 const verifyAdminToken = async (req, res) => {
    try {
    
        res.status(STATUS_CODE.OK).json({ admin: req.admin });
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};

export const handleBlock = async (req, res) => {
    try {
        const { doctorid } = req.params;
        const doctor = await Doctor.findById(doctorid);
        if(!doctor){
            return res.status(STATUS_CODE.NOT_FOUND).json({message:"Doctor not found"});
        }
        if(doctor.isBlocked===true){
            doctor.isBlocked=false;
        }else{
            doctor.isBlocked=true;
        }
        await doctor.save();
        res.status(STATUS_CODE.OK).json({message:"Doctor blocked successfully"});
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
        if (error.name === 'JsonWebTokenError') {
            return res.status(STATUS_CODE.Unauthorized).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(STATUS_CODE.Unauthorized).json({ message: 'Token expired' });
        }
    }
}
export const patientBlock = async (req, res) => {
    try {
        const { patientid } = req.params;
        const patient = await User.findById(patientid);
        if (!patient) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Patient not found' });
        }
        if(patient.isBlocked===true){
            patient.isBlocked=false;
        }else{
            patient.isBlocked=true;
        }
        await patient.save();
        res.status(STATUS_CODE.OK).json({ message: 'Patient unblocked successfully' });
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
export const userCount = async (req, res) => {
    try {
    
        const count = await User.countDocuments({ isActive: true });
        const DrCount = await Doctor.countDocuments({ isActive: true });

        const transactions = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        const totalAmount = transactions[0]?.totalAmount || 0;
        
        res.status(STATUS_CODE.OK).json({ userCount: count, doctorCount: DrCount, totalAmount });
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}


export { loginAdmin, verifyAdminToken };