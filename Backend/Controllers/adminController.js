import mongoose from 'mongoose';
import Admin from '../Model/AdminModel/adminModel.js';
import User from '../Model/userModel.js';
import Doctor from '../Model/doctorModel.js';
import bcrypt from 'bcrypt';
import RejectedDoctor from '../Model/rejectedDoctors.js';
import Transaction from '../Model/transactionModel.js';
import cookies from 'js-cookie';
import {setToken} from '../utils/auth.js';
import Department from '../Model/departmentModel.js';
import { sendDoctorVerificationEmail } from '../utils/sendMail.js';
import appointment from '../Model/appoimentModel.js';
import STATUS_CODE from '../StatusCode/StatusCode.js';
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
        console.log(doctors)
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
export const approveDoctor = async (req,res)=>
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
export const rejectDoctor = async(req,res)=>
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
export const addDepartment = async (req, res) => {
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
export const getDepartments = async (req, res) => 

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
export const updateDepartment = async (req, res) => {
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
export const earnings = async (req, res) => {
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
export const fetchDoctorPayments = async (req, res) => {
    console.log("fetchDoctorPayments=====");
    try {
    const Drtransaction = await Transaction.find().populate({
        path: 'doctor',
        select: 'name email specialization profileImage',
        populate: {
            path: 'specialization',
            select: 'Departmentname'
        }
    });
        
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
export const getDoctorPayments = async (req, res) => {
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


// export const revenueAdmin = async(req,res)=>
// { 
//     try {
//         const {filter} = req.params;
//         const now = new Date();
//         let startDate = new Date();
//         let endDate = new Date();
//         let groupByFormat;

//         switch (filter) {
//             case 'today':
//                 startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
//                 endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
//                 groupByFormat = '%H';
//                 break;
//             case 'weekly':
//                 startDate = new Date(now);
//                 startDate.setDate(startDate.getDate() - 7); // Last 7 days
//                 startDate.setHours(0, 0, 0, 0);
//                 endDate.setHours(23, 59, 59, 999);
//                 groupByFormat = '%Y-%m-%d';
//                 break;
//             case 'monthly':
//                 startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//                 endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
//                 groupByFormat = '%d';
//                 break;
//             case 'yearly':
//                 startDate = new Date(now.getFullYear(), 0, 1);
//                 endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
//                 groupByFormat = '%m';
//                 break;
//             default:
//                 startDate = new Date(now.getFullYear(), 0, 1);
//                 endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
//                 groupByFormat = '%m';
//         }

//         const pipeline = [
//             {
//                 $match: {
//                     createdAt: { $gte: startDate, $lte: endDate }
//                 }
//             },
//             {
//                 $group: {
//                     _id: { $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' } },
//                     totalAmount: { $sum: '$amount' }
//                 }
//             },
//             {
//                 $sort: { _id: 1 }
//             }
//         ];

//         const result = await Transaction.aggregate(pipeline);
//         console.log('Aggregation result:', result);

//         let formattedData = {
//             labels: [],
//             data: [],
//             filter: filter || 'yearly',
//             startDate: startDate,
//             endDate: endDate
//         };

//         if (filter === 'today') {
//             for (let hour = 0; hour < 24; hour++) {
//                 const hourStr = hour.toString().padStart(2, '0');
//                 const found = result.find(item => item._id === hourStr);
//                 formattedData.labels.push(`${hourStr}:00`);
//                 formattedData.data.push(found ? found.totalAmount*0.1 : 0);
//             }
//         } else if (filter === 'weekly') {
//             for (let i = 6; i >= 0; i--) {
//                 const date = new Date(now);
//                 date.setDate(date.getDate() - i);
//                 const dateStr = date.toISOString().split('T')[0];
//                 const found = result.find(item => item._id === dateStr);
//                 formattedData.labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
//                 formattedData.data.push(found ? found.totalAmount*0.1 : 0);
//             }
//         } else if (filter === 'monthly') {
//             const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
//             for (let day = 1; day <= daysInMonth; day++) {
//                 const dayStr = day.toString().padStart(2, '0');
//                 const found = result.find(item => item._id === dayStr);
//                 formattedData.labels.push(day.toString());
//                 formattedData.data.push(found ? found.totalAmount*0.1 : 0);
//             }
//         } else if (filter === 'yearly') {
//             const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//             for (let month = 1; month <= 12; month++) {
//                 const monthStr = month.toString().padStart(2, '0');
//                 const found = result.find(item => item._id === monthStr);
//                 formattedData.labels.push(months[month - 1]);
//                 formattedData.data.push(found ? found.totalAmount*0.1 : 0);
//             }
//         }

//         // console.log('Formatted data:', formattedData);
//         res.status(STATUS_CODE.OK).json({ result: formattedData });
//     } catch (error) {
//         console.error('Revenue calculation error:', error);
//         res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
//     }
// }
// export const userReport = async (req, res) => {
//     try {
//         const { filter } = req.params;
//         const now = new Date();
//         let startDate = new Date();
//         let endDate = new Date();
//         let groupByFormat;

//         switch (filter) {
//             case 'today':
//                 startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
//                 endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
//                 groupByFormat = '%H';
//                 break;
//             case 'weekly':
//                 startDate = new Date(now);
//                 startDate.setDate(startDate.getDate() - 7);
//                 startDate.setHours(0, 0, 0, 0);
//                 endDate.setHours(23, 59, 59, 999);
//                 groupByFormat = '%Y-%m-%d';
//                 break;
//             case 'monthly':
//                 startDate = new Date(now.getFullYear(), now.getMonth(), 1);
//                 endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
//                 groupByFormat = '%d';
//                 break;
//             case 'yearly':
//             default:
//                 startDate = new Date(now.getFullYear(), 0, 1);
//                 endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
//                 groupByFormat = '%m';
//         }

//         // Pipeline for Users with timezone
//         const userPipeline = [
//             {
//                 $match: {
//                     createdAt: { $gte: startDate, $lte: endDate }
//                 }
//             },
//             {
//                 $group: {
//                     _id: { $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' } },
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $sort: { _id: 1 }
//             }
//         ];

//         // Pipeline for Doctors with timezone
//         const doctorPipeline = [
//             {
//                 $match: {
//                     createdAt: { $gte: startDate, $lte: endDate },
//                     isActive: true
//                 }
//             },
//             {
//                 $group: {
//                     _id: { $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' } },
//                     count: { $sum: 1 }
//                 }
//             },
//             {
//                 $sort: { _id: 1 }
//             }
//         ];

//         // Run aggregations in parallel
//         const [userResult, doctorResult] = await Promise.all([
//             User.aggregate(userPipeline),
//             Doctor.aggregate(doctorPipeline)
//         ]);

//         let formattedData = {
//             labels: [],
//             data: [],
//             filter: filter || 'yearly',
//             startDate: startDate,
//             endDate: endDate
//         };

//         if (filter === 'today') {
//             for (let hour = 0; hour < 24; hour++) {
//                 const hourStr = hour.toString().padStart(2, '0');
//                 const userFound = userResult.find(item => item._id === hourStr);
//                 const doctorFound = doctorResult.find(item => item._id === hourStr);
//                 formattedData.labels.push(`${hourStr}:00`);
//                 formattedData.data.push(userFound ? userFound.count : 0);
//                 formattedData.doctorData = formattedData.doctorData || [];
//                 formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
//             }
//         } else if (filter === 'weekly') {
//             for (let i = 6; i >= 0; i--) {
//                 const date = new Date(now);
//                 date.setDate(date.getDate() - i);
//                 const dateStr = date.toISOString().split('T')[0];
//                 const userFound = userResult.find(item => item._id === dateStr);
//                 const doctorFound = doctorResult.find(item => item._id === dateStr);
//                 formattedData.labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
//                 formattedData.data.push(userFound ? userFound.count : 0);
//                 formattedData.doctorData = formattedData.doctorData || [];
//                 formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
//             }
//         } else if (filter === 'monthly') {
//             const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
//             for (let day = 1; day <= daysInMonth; day++) {
//                 const dayStr = day.toString().padStart(2, '0');
//                 const userFound = userResult.find(item => item._id === dayStr);
//                 const doctorFound = doctorResult.find(item => item._id === dayStr);
//                 formattedData.labels.push(day.toString());
//                 formattedData.data.push(userFound ? userFound.count : 0);
//                 formattedData.doctorData = formattedData.doctorData || [];
//                 formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
//             }
//         } else if (filter === 'yearly') {
//             const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//             for (let month = 1; month <= 12; month++) {
//                 const monthStr = month.toString().padStart(2, '0');
//                 const userFound = userResult.find(item => item._id === monthStr);
//                 const doctorFound = doctorResult.find(item => item._id === monthStr);
//                 formattedData.labels.push(months[month - 1]);
//                 formattedData.data.push(userFound ? userFound.count : 0);
//                 formattedData.doctorData = formattedData.doctorData || [];
//                 formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
//             }
//         }

//         res.status(STATUS_CODE.OK).json({ Datas: formattedData });
//     } catch (error) {
//         console.log('User report error:', error);
//         res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
//     }
// };



export const getDashboardData = async(req,res)=>{ 
    try {
        const {filter} = req.params;
        const now = new Date();
        let startDate = new Date();
        let endDate = new Date();
        let groupByFormat;

        switch (filter) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                groupByFormat = '%H';
                break;
            case 'weekly':
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
                groupByFormat = '%Y-%m-%d';
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                groupByFormat = '%d';
                break;
            case 'yearly':
            default:
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                groupByFormat = '%m';
        }

        // Pipeline for Revenue
        const revenuePipeline = [
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' } },
                    totalAmount: { $sum: '$amount' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ];

        // Pipeline for Users
        const userPipeline = [
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ];

        // Pipeline for Doctors
        const doctorPipeline = [
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate },
                    isActive: true
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ];

        // Run all aggregations in parallel
        const [revenueResult, userResult, doctorResult] = await Promise.all([
            Transaction.aggregate(revenuePipeline),
            User.aggregate(userPipeline),
            Doctor.aggregate(doctorPipeline)
        ]);

        let formattedData = {
            labels: [],
            revenueData: [],
            userData: [],
            doctorData: [],
            filter: filter || 'yearly',
            startDate: startDate,
            endDate: endDate
        };

        if (filter === 'today') {
            for (let hour = 0; hour < 24; hour++) {
                const hourStr = hour.toString().padStart(2, '0');
                const revenueFound = revenueResult.find(item => item._id === hourStr);
                const userFound = userResult.find(item => item._id === hourStr);
                const doctorFound = doctorResult.find(item => item._id === hourStr);
                formattedData.labels.push(`${hourStr}:00`);
                formattedData.revenueData.push(revenueFound ? revenueFound.totalAmount * 0.1 : 0);
                formattedData.userData.push(userFound ? userFound.count : 0);
                formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
            }
        } else if (filter === 'weekly') {
            for (let i = 6; i >= 0; i--) {
                const date = new Date(now);
                date.setDate(date.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                const revenueFound = revenueResult.find(item => item._id === dateStr);
                const userFound = userResult.find(item => item._id === dateStr);
                const doctorFound = doctorResult.find(item => item._id === dateStr);
                formattedData.labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
                formattedData.revenueData.push(revenueFound ? revenueFound.totalAmount * 0.1 : 0);
                formattedData.userData.push(userFound ? userFound.count : 0);
                formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
            }
        } else if (filter === 'monthly') {
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const dayStr = day.toString().padStart(2, '0');
                const revenueFound = revenueResult.find(item => item._id === dayStr);
                const userFound = userResult.find(item => item._id === dayStr);
                const doctorFound = doctorResult.find(item => item._id === dayStr);
                formattedData.labels.push(day.toString());
                formattedData.revenueData.push(revenueFound ? revenueFound.totalAmount * 0.1 : 0);
                formattedData.userData.push(userFound ? userFound.count : 0);
                formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
            }
        } else if (filter === 'yearly') {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for (let month = 1; month <= 12; month++) {
                const monthStr = month.toString().padStart(2, '0');
                const revenueFound = revenueResult.find(item => item._id === monthStr);
                const userFound = userResult.find(item => item._id === monthStr);
                const doctorFound = doctorResult.find(item => item._id === monthStr);
                formattedData.labels.push(months[month - 1]);
                formattedData.revenueData.push(revenueFound ? revenueFound.totalAmount * 0.1 : 0);
                formattedData.userData.push(userFound ? userFound.count : 0);
                formattedData.doctorData.push(doctorFound ? doctorFound.count : 0);
            }
        }

        res.status(STATUS_CODE.OK).json({ data: formattedData });
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
}
export { loginAdmin, verifyAdminToken };