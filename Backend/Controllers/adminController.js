import Admin from '../Model/AdminModel/adminModel.js';
import User from '../Model/userModel.js';
import Doctor from '../Model/doctorModel.js';
import bcrypt from 'bcrypt';
import RejectedDoctor from '../Model/RejectedDoctors.js';
import jwt from 'jsonwebtoken';
import cookies from 'js-cookie';
import {setToken} from '../utils/auth.js';
import Department from '../Model/DepartmentModel.js';
import { sendDoctorVerificationEmail } from '../utils/sendMail.js';



 const LoginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email });
        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, existingAdmin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
    
           const adminToken = setToken(existingAdmin,res);
        // Send response
        res.status(200).json({
            message: "Login successful",
            Admin: {
                _id: existingAdmin._id, 
                email: existingAdmin.email,
               
            },
            adminToken:adminToken
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const patients = async (req,res)=>
{
    try {
        const patients = await User.find({isActive:true});
        const patientsWithIndex = patients.map((patient, index) => ({
            ...patient.toObject(),
            serialNumber: index + 1
        }));
        res.send(patientsWithIndex);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
   
}
export const pendingDoctors = async (req,res)=>
{
    try {
        const doctors = await Doctor.find({isActive:false});
        res.status(200).json(doctors);
        console.log("doctors=====",doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const approveDoctor = async (req,res)=>
{
    try {
        const {doctorid} = req.params;

        console.log("doctorid=====",doctorid);
        const doctorData = await Doctor.findById(doctorid);
        console.log("doctorData=====",doctorData);
        if(!doctorData){
            return res.status(404).json({message:"Doctor is not found"})
        }

        // Send approval email before updating status
        console.log("Attempting to send approval email to:", doctorData.email);
        try {
            await sendDoctorVerificationEmail(doctorData.email, doctorData.name, 'approved');
            console.log("Approval email sent successfully");
        } catch (emailError) {
            console.error("Error sending approval email:", emailError);
            // Continue with the approval process even if email fails
        }

        // Update doctor status
        doctorData.isActive = true;
        await doctorData.save();

        res.status(200).json({
            message: "Doctor approved successfully",
            doctor:{
                _id: doctorData._id,
                name: doctorData.name,
                email: doctorData.email,
                isActive: doctorData.isActive
            }
        });
    }
    catch (error) {
        console.error("Error in approveDoctor:", error);
        res.status(500).json({ message: error.message });
    }
}
export const rejectDoctor = async(req,res)=>
{
    try{
        const {doctorid} = req.params;
        const doctorData = await Doctor.findById(doctorid);
        if(!doctorData){
            return res.status(404).json({message:"Doctor not found"});
        }

        // Send rejection email before making any changes
        console.log("Attempting to send rejection email to:", doctorData.email);
        try {
            await sendDoctorVerificationEmail(doctorData.email, doctorData.name, 'rejected');
            console.log("Rejection email sent successfully");
        } catch (emailError) {
            console.error("Error sending rejection email:", emailError);
            // Continue with the rejection process even if email fails
        }

        // Create rejected doctor record
        const rejectedDoctor = new RejectedDoctor({
            name: doctorData.name,
            email: doctorData.email,
            phone: doctorData.phone,
            yearsOfExperience: doctorData.yearsOfExperience,
            specialization: doctorData.specialization,
            password: doctorData.password,
            profileImage: doctorData.profileImage,
            medicalLicense: doctorData.medicalLicense,
            idProof: doctorData.idProof,
            gender: doctorData.gender,
            about: doctorData.about,
            consultFee: doctorData.consultFee
        });
        await rejectedDoctor.save();

        // Delete from doctors collection
        await Doctor.findByIdAndDelete(doctorid);

        res.status(200).json({message:"Doctor rejected successfully"});
    } catch(error){
        console.error("Error in rejectDoctor:", error);
        res.status(500).json({message:error.message});
    }
}




export const doctors = async (req,res)=>
{
    try {
          const doctors = await Doctor.find({isActive:true});
          const doctorsWithIndex = doctors.map((doctor, index) => ({
            ...doctor.toObject(),
            serialNumber: index + 1
          }));
          res.status(200).json(doctorsWithIndex);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

 const verifyAdminToken = async (req, res) => {
    try {
        // req.admin is set by the protectAdmin middleware
        res.status(200).json({ admin: req.admin });
        console.log("req.admin=====",req.admin);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};



// export const handleBlock = async (req, res) => {
//     try {
//         const { patientid } = req.params;
//         console.log("patientid=====",patientid);
//         const patient = await User.findById(patientid);
//         if (!patient) {
//             return res.status(404).json({ message: 'Patient not found' });
//         }
//         patient.isBlocked = true;
//         await patient.save();
//         res.status(200).json({ message: 'Patient blocked successfully' });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error.message });
//     }
// };





// export const unblockDoctor = async (req, res) => {
//     try {
//         const { doctorid } = req.params;
//         console.log("doctorid=====",doctorid);
//         const doctor = await Doctor.findById(doctorid);
//         if (!doctor) {
//             return res.status(404).json({ message: 'Doctor not found' });
//         }
//         doctor.isBlocked = false;
//         await doctor.save();
//         res.status(200).json({ message: 'Doctor unblocked successfully' });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: error.message });
//     }
// };
export const addDepartment = async (req, res) => {
    try {
        const { Departmentname } = req.body;
        
        // Check if department exists (case-insensitive)
        const department = await Department.findOne({
            Departmentname: { $regex: new RegExp(`^${Departmentname}$`, 'i') }
        });
        
        if (department) {
            return res.status(400).json({ message: 'Department already exists' });
        }
        
        // Create new department with original capitalization
        const newDepartment = new Department({ 
            Departmentname,
            status: 'Listed'
        });
        
        await newDepartment.save();
        res.status(201).json({ message: 'Department created successfully' });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
export const getDepartments = async (req, res) => 
{
    try {
        const departments = await Department.find();
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const updateDepartment = async (req, res) => {
       const {id} = req.params;
       console.log("id=====",id);
    try {
        
        const department = await Department.findById(id);
        if (!department) {
            return res.status(404).json({ message: 'Department not found' });
        }
        if(department.status === 'Listed'){
            department.status = 'Unlisted';
        }else{
            department.status = 'Listed';
        }
        await department.save();
        res.status(200).json({ message: 'Department status updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
export const handleBlock = async (req, res) => {
    try {
        const { doctorid } = req.params;
        const doctor = await Doctor.findById(doctorid);
        if(!doctor){
            return res.status(404).json({message:"Doctor not found"});
        }
        if(doctor.isBlocked===true){
            doctor.isBlocked=false;
        }else{
            doctor.isBlocked=true;
        }
        await doctor.save();
        res.status(200).json({message:"Doctor blocked successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
    }
}
export const patientblock = async (req, res) => {
    try {
        const { patientid } = req.params;
        console.log("patientid=====",patientid);
        const patient = await User.findById(patientid);
        if (!patient) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        if(patient.isBlocked===true){
            patient.isBlocked=false;
        }else{
            patient.isBlocked=true;
        }


        
        
        await patient.save();
        res.status(200).json({ message: 'Patient unblocked successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
export { LoginAdmin, verifyAdminToken };
