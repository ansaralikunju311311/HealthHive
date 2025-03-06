import Admin from '../Model/AdminModel/adminModel.js';
import User from '../Model/userModel.js';
import Doctor from '../Model/doctorModel.js';
import bcrypt from 'bcrypt';
import RejectedDoctor from '../Model/RejectedDoctors.js';
import Transaction from '../Model/Transaction.js';
import cookies from 'js-cookie';
import {setToken} from '../utils/auth.js';
import Department from '../Model/DepartmentModel.js';
import { sendDoctorVerificationEmail } from '../utils/sendMail.js';
import appointment from '../Model/appoiment.js';
import STATUS_CODE from '../StatusCode/StatusCode.js';

const cookieOptions = {
    
    httpOnly: false,
    secure: true,
    sameSite: 'None',
    maxAge: 9 * 60 * 60 * 1000, 
};


 const LoginAdmin = async (req, res) => {
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

export const Patients = async (req,res)=>
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
export const PendingDoctors = async (req,res)=>
{
    const {page,limit} = req.params;
    try {
        const page =  +(req.query.page || 1);
        const limit =  +(req.query.limit || 10);
        const skip = (page - 1) * limit;
        const doctors = await Doctor.find({isActive:false}).skip(skip).limit(limit);
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
export const ApproveDoctor = async (req,res)=>
{
    try {
        const {doctorid} = req.params;
    
        const doctorData = await Doctor.findById(doctorid);
        if(!doctorData){
            return res.status(STATUS_CODE.NOT_FOUND).json({message:"Doctor is not found"})
        }

    
        console.log("Attempting to send approval email to:", doctorData.email);
        try {
            await sendDoctorVerificationEmail(doctorData.email, doctorData.name, 'approved');
            console.log("Approval email sent successfully");
        } catch (emailError) {
            console.error("Error sending approval email:", emailError);
        
        }
        doctorData.isActive = true;
        await doctorData.save();

        res.status(STATUS_CODE.OK).json({
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
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const RejectDoctor = async(req,res)=>
{
    try{
        const {doctorid} = req.params;
        const doctorData = await Doctor.findById(doctorid);
        if(!doctorData){
            return res.status(STATUS_CODE.NOT_FOUND).json({message:"Doctor not found"});
        }

    
        console.log("Attempting to send rejection email to:", doctorData.email);
        try {
            await sendDoctorVerificationEmail(doctorData.email, doctorData.name, 'rejected');
            console.log("Rejection email sent successfully");
        } catch (emailError) {
            console.error("Error sending rejection email:", emailError);
        
        }

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

        await Doctor.findByIdAndDelete(doctorid);

        res.status(STATUS_CODE.NO_CONTENT).json({message:"Doctor rejected successfully"});
    } catch(error){
        console.error("Error in rejectDoctor:", error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({message:error.message});
    }
}
export const Doctors = async (req,res)=>
{
    const {page,limit} = req.query;
    try {
           const page =  +(req.query.page || 1);
           const limit =  +(req.query.limit || 10);
           const skip = (page - 1) * limit;
          const doctors = await Doctor.find({isActive:true}).skip(skip).limit(limit);
          const totalpage = Math.ceil(await Doctor.countDocuments({isActive:true}) / limit);
          const doctorsWithIndex = doctors.map((doctor, index) => ({
            ...doctor.toObject(),
            serialNumber: index + 1
          }));
          
          res.status(STATUS_CODE.OK).json({doctorsWithIndex,totalpage});
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

 const VerifyAdminToken = async (req, res) => {
    try {
    
        res.status(STATUS_CODE.OK).json({ admin: req.admin });
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
export const AddDepartment = async (req, res) => {
    try {
        const { Departmentname,Description } = req.body;
        
        
        const department = await Department.findOne({
            Departmentname: { $regex: new RegExp(`^${Departmentname}$`, 'i') }
        });
        
        if (department) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Department already exists' });
        }
        
    
        const newDepartment = new Department({ 
            Departmentname,
            status: 'Listed',
            Description
        });
        
        await newDepartment.save();
        res.status(STATUS_CODE.CREATED).json({ message: 'Department created successfully' });
        
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const GetDepartments = async (req, res) => 

{
    const {page,limit} = req.query;
    console.log(req.query)

    console.log("page=====",page);
    console.log("limit=====",limit);
    try {
         
        
        const page = +(req.query.page || 1);
        const limit = +(req.query.limit || 10);
        const skip = (page - 1) * limit;
         const departments = await Department.find().skip(skip).limit(limit);


         const totalpage = Math.ceil(await Department.countDocuments() / limit);

         const departmentWithIndex = departments.map((department, index) => ({
            ...department.toObject(),
            serialNumber: index + 1
          }));

        res.status(STATUS_CODE.OK).json({departments:departmentWithIndex,totalpage});
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const UpdateDepartment = async (req, res) => {
       const {id} = req.params;
       console.log("id=====",id);



    try {
        
        const department = await Department.findById(id);
        if (!department) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Department not found' });
        }
        if(department.status === 'Listed'){
            department.status = 'Unlisted';
        }else{
            department.status = 'Listed';
        }
        await department.save();
        res.status(STATUS_CODE.OK).json({ message: 'Department status updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const HandleBlock = async (req, res) => {
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
export const PatientBlock = async (req, res) => {
    try {
        const { patientid } = req.params;
        console.log("patientid=====",patientid);
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
export const UserCount = async (req, res) => {
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
export const Earnings = async (req, res) => {
     const {page,limit} = req.query;
    console.log(req.query)
    try {
        const page = +(req.query.page || 1);
        const limit = +(req.query.limit || 10);
        const skip = (page - 1) * limit;
        const transaction =  await Transaction.find().skip(skip).limit(limit).sort({createdAt: -1});
        const totalpage = Math.ceil(await Transaction.countDocuments() / limit);
        const count = await Transaction.countDocuments();

        const eranings = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        const totalAmount = eranings[0]?.totalAmount || 0;
        const totalEarnings = totalAmount*0.1;
       res.status(STATUS_CODE.OK).json({transaction,totalpage,totalEarnings,count});
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const FetchDoctorPayments = async (req, res) => {
    console.log("fetchDoctorPayments=====");
    try {
        const Drtransaction = await Transaction.find().populate('doctor', 'name email specialization profileImage');
        
        const appointmentCounts = await appointment.aggregate([
            {
                $group: {
                    _id: '$doctor',
                    appointmentCount: { $sum: 1 }
                }
            }
        ]);

        const appointmentCountMap = appointmentCounts.reduce((acc, curr) => {
            acc[curr._id.toString()] = curr.appointmentCount;
            return acc;
        }, {});

        const doctorWiseTotals = Drtransaction.reduce((acc, transaction) => {
            const doctorId = transaction.doctor._id.toString();
            if (!acc[doctorId]) {
                acc[doctorId] = {
                    doctorId: doctorId,
                    doctorName: transaction.doctor.name,
                    email: transaction.doctor.email,
                    specialization: transaction.doctor.specialization,
                    profileImage: transaction.doctor.profileImage,
                    appointmentCount: appointmentCountMap[doctorId] || 0,
                    transactions: [],
                    totalAmount: 0
                };
            }
            acc[doctorId].transactions.push(transaction);
            acc[doctorId].totalAmount += transaction.amount;
            return acc;
        }, {});

        const totalAmount = Object.values(doctorWiseTotals).reduce((sum, doctor) => sum + doctor.totalAmount, 0);

        res.status(STATUS_CODE.OK).json({
            doctorWiseTotals: Object.values(doctorWiseTotals),
            totalAmount
        });
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const GetDoctorPayments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const totalDoctors = await Doctor.countDocuments();
    const totalPages = Math.ceil(totalDoctors / limit);

    const doctorWiseTotals = await Doctor.aggregate([
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'doctor',
          as: 'appointments'
        }
      },
      {
        $project: {
          doctorName: '$name',
          specialization: '$specialization',
          totalAmount: { $multiply: ['$consultFee', { $size: '$appointments' }] },
          appointmentCount: { $size: '$appointments' }
        }
      },
      { $skip: skip },
      { $limit: limit }
    ]);

    const totalAmount = await appointment.aggregate([
      {
        $lookup: {
          from: 'doctors',
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctorInfo'
        }
      },
      {
        $unwind: '$doctorInfo'
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$doctorInfo.consultFee' }
        }
      }
    ]);

    res.json({
      doctorWiseTotals,
      totalAmount: totalAmount[0]?.total || 0,
      currentPage: page,
      totalPages,
      hasMore: page < totalPages
    });

  } catch (error) {
    console.error('Error in getDoctorPayments:', error);
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};

export { LoginAdmin, VerifyAdminToken };