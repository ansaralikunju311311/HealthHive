import doctor from "../../Model/doctorModel.js";
import mongoose from 'mongoose';
import RejectedDoctor from "../../Model/rejectedDoctors.js";
import moment from 'moment-timezone';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {sendOtp} from '../../utils/sendMail.js';
import {setToken} from '../../utils/auth.js';    
import Department from '../../Model/departmentModel.js';
import appoimentSchedule from '../../Model/appoimentSchedule.js';
import Appointment from '../../Model/appoimentModel.js';
import DoctorWallet from '../../Model/DrWallet.js';
import User from '../../Model/userModel.js';
import Transaction from "../../Model/transactionModel.js";
import STATUS_CODE from "../../StatusCode/StatusCode.js";
import Chat from '../../Model/chatModel.js';    
import Prescription from '../../Model/prescriptions.js';
import AppointmentSchedule from '../../Model/appoimentSchedule.js';
import Feedback from '../../Model/feedBackModel.js'
const cookieOptions = {
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    maxAge: 10 * 60 * 1000,
};
 const generateAndSendOTP = async (doctor, email) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log("Generated OTP:", otp);
    const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
    doctor.otp = otp;
    doctor.otpExpiresAt = otpExpiresAt;
    await doctor.save();
    await sendOtp(email, otp);
    return true;
};
 const registerDoctor = async(req,res)=>{
    try {
        const {name,email,password,yearsOfExperience,specialization,phone,profileImage,medicalLicense,idProof,about,consultFee,gender,availability} = req.body;
        
        const department = await Department.findOne({ Departmentname: specialization });
        const existingUser = await doctor.findOne({email});
        const rejectedDoctor = await RejectedDoctor.findOne({email});
        
        if(rejectedDoctor)
        {
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"this is rejeced user please contact admin"});
        }
        
        if(existingUser && existingUser.isBlocked===true && existingUser.isActive===true){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"User is blocked"});
        }
        if(existingUser && !existingUser.isActive){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"User already exists   You are under verification process"});
        }
        if(existingUser && existingUser.isActive){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"User already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        let user;
        if (existingUser) {
            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.yearsOfExperience = yearsOfExperience;
            existingUser.specialization = department._id; 
            existingUser.phone = phone;
            existingUser.profileImage = profileImage;
            existingUser.medicalLicense = medicalLicense;
            existingUser.idProof = idProof;
            existingUser.about = about;
            existingUser.gender = gender;
            existingUser.consultFee = consultFee;
            existingUser.isActive = true;
            existingUser.availability = availability;
            user = existingUser;
           
        } else {
            
            user = new doctor({
                name,
                email,
                password: hashedPassword,
                yearsOfExperience,
                specialization: department._id, 
                phone,
                profileImage,
                medicalLicense,
                idProof,
                about,
                consultFee,
                gender,
                isActive: false,
                availability
            });
        }
        await user.save();
        res.status(STATUS_CODE.OK).json({message:"User registered successfully",user});
    } catch (error) {
        console.error('Registration error:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({message:error.message});
    }
}
 const loginDoctor = async(req,res)=>{
    try {
        const {email,password} = req.body;
        console.log("body",req.body)
        const existingDoctor = await doctor.findOne({email});
        const rejectedDoctor = await RejectedDoctor.findOne({email});
        if(!existingDoctor){
            return res.status(STATUS_CODE.NOT_FOUND).json({message:"User not found"});
        }
        if(existingDoctor.isBlocked===true && existingDoctor.isActive===true &&existingDoctor){
            return res.status(STATUS_CODE.OK).json({message:"Your account is blocked. Please contact the admin."});
        }
        if(!existingDoctor.isActive){
            return res.status(STATUS_CODE.OK).json({message:"Please verify your account first",
                doctor:{
                    isActive: existingDoctor.isActive
                }
            });
        }
        if(rejectedDoctor){
            return res.status(STATUS_CODE.OK).json({message:"Your account is rejected. Please contact the admin.",
                doctor:{
                    isActive: existingDoctor.isActive
                }
            });
        }
        const isMatch = await bcrypt.compare(password,existingDoctor.password);
        if(!isMatch){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"Invalid credentials"});
        }
        const doctorToken = setToken(existingDoctor);
        res.cookie('doctortoken', doctorToken, cookieOptions);
        res.status(STATUS_CODE.OK).json({
            message:"Login successful",
            doctor:{
                _id: existingDoctor._id,
                email: existingDoctor.email,
                name: existingDoctor.name,
                yearsOfExperience: existingDoctor.yearsOfExperience,
                specialization: existingDoctor.specialization,
                phone: existingDoctor.phone,
                profileImage: existingDoctor.profileImage,
                medicalLicense: existingDoctor.medicalLicense,
                idProof: existingDoctor.idProof,    
                isActive: existingDoctor.isActive,
                availability: existingDoctor.availability
            },
            token: doctorToken
        });
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({message:error.message});
    }
}
 const verifyDoctorToken = async (req, res) => {
    try {
        res.status(STATUS_CODE.OK).json({ doctor: req.doctor });
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
const fetchDoctors = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Email is required" });
        }
        const rejectedDoctor = await RejectedDoctor.findOne({ email });
        if (rejectedDoctor) {
            return res.status(STATUS_CODE.OK).json({
                isRejected: true,
                message: "Your registration has been rejected. Please contact the admin."
            });
        }
        const doctorData = await doctor.findOne({ email });
        if (!doctorData) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ 
                isVerified: false,
                message: "Doctor not found. Please register first." 
            });
        }

       
        if (doctorData.isActive === true) {
            return res.status(STATUS_CODE.OK).json({ 
                isVerified: true,
                doctor: doctorData 
            });
        } 
        
        if (doctorData.isActive === false) {
            return res.status(STATUS_CODE.OK).json({ 
                isVerified: false,
                message: "Your account is pending verification." 
            });
        }

    } catch (error) {
        console.error("Error in fetchDoctors:", error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
    }
};
    async function forgotPassword(req, res) {
        try {
            const { email } = req.body;

           
            const doctorData = await doctor.findOne({ email });
            const rejectedDoctor = await RejectedDoctor.findOne({ email });
            if (!doctorData) {
                return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Doctor not found. Please register first.' });
            }
            if (!doctorData.isActive) {
                return res.status(STATUS_CODE.FORBIDDEN).json({ message: 'Your account is not active. Please contact the admin.' });
            }
            if (rejectedDoctor) {
                return res.status(STATUS_CODE.FORBIDDEN).json({ message: 'Your account is rejected. Please contact the admin.' });
            }
            if (doctorData.isBlocked === true) {
                return res.status(STATUS_CODE.FORBIDDEN).json({ message: 'Your account is blocked. Please contact the admin.' });
            }
            await generateAndSendOTP(doctorData, email);

            res.status(STATUS_CODE.OK).json({
                message: "Verification code sent to your email",
                email
            });
        } catch (error) {
            console.error('Error in forgotPassword:', error);
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
        }
    }
const resetPassword = async (req, res) => {
    try {
       

        const email = req.body.email;
        const otp = req.body.otp;
        const newPassword = req.body.newPassword || req.body.new_password;


        if (!email) {
            console.log("Email is missing or undefined");
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Email is required' });
        }

        if (!otp) {
            console.log("OTP is missing or undefined");
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'OTP is required' });
        }

        if (!newPassword) {
            console.log("New Password is missing or undefined");
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'New password is required' });
        }
        
        const doctorData = await doctor.findOne({ email });
       const rejectedDoctor = await RejectedDoctor.findOne({ email });
        if(rejectedDoctor){
            return res.status(STATUS_CODE.FORBIDDEN).json({ message: 'Your account is rejected. Please contact the admin.' });
       }
        if (!doctorData) {
            console.log("Doctor not found with email:", email);
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Doctor not found. Please register first.' });
        }
        
        console.log("Stored Reset Password OTP:", doctorData.resetPasswordOtp);
        if(!doctorData.otp || doctorData.otp !== otp){
            console.log("OTP Validation Failed");
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Invalid OTP' });
        }

        console.log("OTP Expires:", doctorData.resetPasswordOtpExpires);
        console.log("Current Time:", Date.now());
        if(doctorData.resetPasswordOtpExpires < Date.now()){
            console.log("OTP Has Expired");
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'OTP has expired' });
        }
        
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            doctorData.password = hashedPassword;
            doctorData.resetPasswordOtp = undefined;
            doctorData.resetPasswordOtpExpires = undefined;
            await doctorData.save();
            
            res.status(STATUS_CODE.OK).json({ message: 'Password reset successful' });
        } catch (hashError) {
            console.error('Password hashing error:', hashError);
            return res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ 
                message: 'Error processing password', 
                error: hashError.message 
            });
        }
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
const doctorProfile = async (req, res) => {
    try {
        const doctorId = req.params.id;
        const doctorData = await doctor.findById(doctorId).select('-password').populate({
            path: 'specialization',
            select: 'Departmentname'
        });
        if (!doctorData) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Doctor not found' });
        }
        res.status(STATUS_CODE.OK).json({ doctorData });
    } catch (error) {
        console.log("Error in doctofjnjnjfnfjnjrProfile:", error);
        console.error('Error in doctorProfile:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
export const fetchDepartments = async (req, res) => {
    try {
        const departments = await Department.find({status:'Listed'});
        res.status(STATUS_CODE.OK).json(departments);
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const logout = async (req, res) => {
    try {
        req.user = null;
        res.cookie('doctortoken', null, {
            expires: new Date(Date.now()),
            httpOnly: false,
            secure: true,
            sameSite: 'None'
        });
        res.status(STATUS_CODE.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const schedule = async (req, res) => {
    const { id: doctorId } = req.params;
    const { appointments } = req.body;

    console.log("Received Scheduling Request:");
    console.log("Doctor ID:", doctorId);
    console.log("Appointments:", JSON.stringify(appointments, null, 2));

    try {
        const existingSchedule = await AppointmentSchedule.findOne({ doctorId });
        const validAppointments = appointments.map(appt => {
            const appointmentDate = new Date(appt.appointmentDate);
            if (isNaN(appointmentDate.getTime())) {
                console.warn(`Invalid date detected: ${appt.appointmentDate}`);
            }

            
            return {
                appointmentDate: appointmentDate.toISOString().split('T')[0], 
                slotTime: appt.slotTime,
                bookingTime: new Date(appt.bookingTime)
            };
        });

        if (!existingSchedule) {
            const newSchedule = new AppointmentSchedule({
                doctorId,
                appointments: validAppointments
            });

            await newSchedule.save();

            return res.status(STATUS_CODE.CREATED).json({ 
                message: 'Schedules created successfully',
                schedule: newSchedule.appointments.map(appt => ({
                    appointmentDate: appt.appointmentDate,
                    slotTime: appt.slotTime
                }))
            });
        } else {
            const duplicateAppointments = validAppointments.filter(newAppt => 
                existingSchedule.appointments.some(existingAppt => 
                    existingAppt.appointmentDate === newAppt.appointmentDate && 
                    existingAppt.slotTime === newAppt.slotTime
                )
            );

            if (duplicateAppointments.length > 0) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({
                    message: 'Some appointments are already scheduled',
                    duplicates: duplicateAppointments.map(appt => ({
                        date: appt.appointmentDate,
                        slot: appt.slotTime
                    }))
                });
            }

            const mergedAppointments = [
                ...existingSchedule.appointments,
                ...validAppointments
            ].filter((appointment, index, self) => 
                index === self.findIndex(a => 
                    a.appointmentDate === appointment.appointmentDate && 
                    a.slotTime === appointment.slotTime
                )
            );

            existingSchedule.appointments = mergedAppointments;
            await existingSchedule.save();


            return res.status(STATUS_CODE.OK).json({ 
                message: 'Schedules updated successfully',
                schedule: existingSchedule.appointments.map(appt => ({
                    appointmentDate: appt.appointmentDate,
                    slotTime: appt.slotTime
                }))
            });
        }
    } catch (error) {
        console.error('Error in Scheduling:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ 
            message: 'Internal server error during scheduling',
            errorDetails: error.message 
        });
    }
};
export const getSchedules = async (req, res) => {
    const { id: doctorId } = req.params;

    try {
        const existingSchedule = await AppointmentSchedule.findOne({ doctorId });

        if (!existingSchedule) {
            return res.status(STATUS_CODE.NOT_FOUND).json({
                message: 'No schedules found for this doctor',
                schedules: []
            });
        }

       

        const todayInIndia = moment().tz("Asia/Kolkata").startOf('day');
        
        const upcomingAppointments = existingSchedule.appointments.filter(appointment => {
            const appointmentDate = moment.tz(appointment.appointmentDate, "Asia/Kolkata").startOf('day');
        
            return appointmentDate.isSameOrAfter(todayInIndia, 'day');
        });
        return res.status(STATUS_CODE.OK).json({
            message: 'Schedules retrieved successfully',
            schedules: upcomingAppointments 
        });
    } catch (error) {
        console.error('Error retrieving schedules:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: 'Internal server error while fetching schedules',
            errorDetails: error.message
        });
    }
};
export const slots = async (req, res) => {
     console.log(" happen after middlware verify token=====");
    const { id: doctorId } = req.params;
    try {
        const existingSchedule = await AppointmentSchedule.findOne({ doctorId });
    

        if (!existingSchedule) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ 
                message: 'No schedules found for this doctor',
                schedules: []
            });
        }
        const todayInIndia = moment().tz("Asia/Kolkata").startOf('day');

       const schedules = existingSchedule.appointments.filter(appointment => {
           const appointmentDate = moment.tz(appointment.appointmentDate, "Asia/Kolkata").startOf('day');
    
            return appointmentDate.isSameOrAfter(todayInIndia, 'day');
        });

        res.status(STATUS_CODE.OK).json({ 
            message: 'Schedules retrieved successfully',
            schedules: schedules
        });
    } catch (error) {
        console.error('Error retrieving schedules:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ 
            message: 'Internal server error while fetching schedules',
            errorDetails: error.message 
        });
    }
}
export const fetchAppointments = async (req, res) => {
    const {doctor_Id} = req.params;
    console.log("=============",doctor_Id)
    const appoiments = await Appointment.find({doctor:doctor_Id})
        .populate({
            path: 'user',
            select: 'name email phone age gender image' 
        });
    
    res.status(STATUS_CODE.OK).json(appoiments)
}
export const fullAppoiments = async (req, res) => {
    try {
        const {id} = req.params;
        
       
        const totalAppointments = await Appointment.countDocuments({doctor: id});
        
       
        const uniquePatients = await Appointment.distinct('user', { doctor: id }).then(users => users.length);
        
        const fee = await doctor.findById(id).select('consultFee -_id');
        
        res.status(STATUS_CODE.OK).json({
            totalAppointments,
            uniquePatients,
            fee
        });
    } catch (error) {
        console.error('Error in fullAppoiments:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}

export const fetchWalletBalance = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;
 
        const { id } = req.params;
        
        const countAppoiments = await Appointment.countDocuments({ doctor: id });
        const fees = await doctor.findById(id).select('consultFee -_id');
        
        const totalearnings = countAppoiments * fees.consultFee - (countAppoiments * fees.consultFee * 0.1);

        let walletBalance = await DoctorWallet.findOne({ doctor: id });
        
        const transactions = await Transaction.find({ doctor: id })
            .sort({ createdAt: -1 }) 
            .skip(skip)
            .limit(limit);
        const history = transactions.map((transaction, index) => ({
            index: skip + index + 1,
            ...transaction._doc 
        }));
        const totalTransactions = await Transaction.countDocuments({ doctor: id });
        const totalPages = Math.ceil(totalTransactions / limit);

        if (!walletBalance) {
            walletBalance = new DoctorWallet({
                doctor: id,
                totalAmount: totalearnings
            });
            await walletBalance.save();
        } else {
            walletBalance.totalAmount = totalearnings;
            await walletBalance.save();
        }

        res.status(STATUS_CODE.OK).json({
            walletBalance,
            history,
            pagination: {
                currentPage: page,
                totalPages,
                totalItems: totalTransactions,
                itemsPerPage: limit
            }
        });
    } catch (error) {
        console.error('Error in fetchWalletBalance:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const userDetails = async(req,res)=>
{

    try {
        const {userId} = req.params;
        const user = await User.findById(userId).select('-password');
        res.status(STATUS_CODE.OK).json(user);
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const chatDetails = async(req,res)=>
{
    try {
        const {userId,doctorId} = req.params;
      const roomId = doctorId+'_'+userId;
        const chats = await Chat.find({roomId}).sort({ createdAt: 1 });
        res.status(STATUS_CODE.OK).json(chats);
        console.log("chats",chats);
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const updateDoctorProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { consultFee, about } = req.body;
        const updatedoctor = await doctor.findById(id);
        if (!updatedoctor) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'Doctor not found' });
        }
        updatedoctor.consultFee = consultFee;
        updatedoctor.about = about;
        await updatedoctor.save();
        
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Error updating profile' });
    }
}
export const getDashboardData = async (req, res) => {
    try {
        const { doctorId, filter } = req.params;

        if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId)) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Invalid doctor ID' });
        }

        const now = new Date();
        let startDate = new Date();
        let endDate = new Date();
        let groupByFormat;

        switch (filter) {
            case 'today':
                startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                groupByFormat = '%H:00'; // updated format to include minutes
                break;
            case 'weekly':
                startDate = new Date(now);
                startDate.setDate(startDate.getDate() - 6);
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date(now);
                endDate.setHours(23, 59, 59, 999);
                groupByFormat = '%Y-%m-%d';
                break;
            case 'monthly':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
                groupByFormat = '%Y-%m-%d';
                break;
            case 'yearly':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
                groupByFormat = '%Y-%m';
                break;
            default:
                return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Invalid filter type' });
        }

        const appointmentPipeline = [
            {
                $match: {
                    doctor: new mongoose.Types.ObjectId(doctorId),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id': 1 } }
        ];

        const revenuePipeline = [
            {
                $match: {
                    doctor: new mongoose.Types.ObjectId(doctorId),
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' }
                    },
                    earnings: { $sum: '$amount' }
                }
            },
            { $sort: { '_id': 1 } }
        ];


        const reports  = [
            {
                $match:{
                    doctor:new mongoose.Types.ObjectId(doctorId),
                    createdAt:{
                        $gte:startDate,$lte:endDate}
                    }
                
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: groupByFormat, date: '$createdAt', timezone: 'Asia/Kolkata' }
                    },
                    details:{
                        $push:{
                            PatientName :'$userName',
                            Fee :'$amount',
                            Date : '$createdAt',
                            AppoimentDate:'$appoimentdate',
                            Slot:'$slot'

                        }
                    }
                }
            },
            { $sort: { '_id': 1 } }
        ];
       

        const findReports = await Transaction.aggregate(reports);
        console.log("reportsData",findReports);
        const [appointmentData, revenueData] = await Promise.all([
            Appointment.aggregate(appointmentPipeline),
            Transaction.aggregate(revenuePipeline)
        ]);

        let formattedData = {
            appointments: { labels: [], data: [] },
            revenue: { labels: [], data: [] },
            filter,
            startDate,
            endDate
        };

        if (filter === 'today') {
            for (let hour = 0; hour < 24; hour++) {
                const hourLabel = hour.toString().padStart(2, '0') + ':00';
                const appointmentFound = appointmentData.find(item => item._id === hourLabel);
                const revenueFound = revenueData.find(item => item._id === hourLabel);
                formattedData.appointments.labels.push(hourLabel);
                formattedData.revenue.labels.push(hourLabel);
                formattedData.appointments.data.push(appointmentFound ? appointmentFound.count : 0);
                formattedData.revenue.data.push(revenueFound ? revenueFound.earnings * 0.9 : 0);
            }
        } 
        
        else if (filter === 'weekly') {
            for (let i = 0; i < 7; i++) {
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);
                // Use locale format 'en-CA' to get YYYY-MM-DD format matching aggregation
                const dateStr = date.toLocaleDateString('en-CA');
                const dayLabel = date.toLocaleDateString('en-US', { weekday: 'short' });
    
                const appointmentFound = appointmentData.find(item => item._id === dateStr);
                const revenueFound = revenueData.find(item => item._id === dateStr);
    
                formattedData.appointments.labels.push(dayLabel);
                formattedData.revenue.labels.push(dayLabel);
                formattedData.appointments.data.push(appointmentFound ? appointmentFound.count : 0);
                formattedData.revenue.data.push(revenueFound ? revenueFound.earnings * 0.9 : 0);
            }
        }
        else if (filter === 'monthly') {
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(now.getFullYear(), now.getMonth(), day);
                const dateStr = date.toISOString().split('T')[0];

                const appointmentFound = appointmentData.find(item => item._id === dateStr);
                const revenueFound = revenueData.find(item => item._id === dateStr);

                formattedData.appointments.labels.push(day.toString());
                formattedData.revenue.labels.push(day.toString());
                formattedData.appointments.data.push(appointmentFound ? appointmentFound.count : 0);
                formattedData.revenue.data.push(revenueFound ? revenueFound.earnings * 0.9 : 0);
            }
        } else {
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            for (let month = 0; month < 12; month++) {
                const monthStr = `${now.getFullYear()}-${(month + 1).toString().padStart(2, '0')}`;
                
                const appointmentFound = appointmentData.find(item => item._id === monthStr);
                const revenueFound = revenueData.find(item => item._id === monthStr);

                formattedData.appointments.labels.push(months[month]);
                formattedData.revenue.labels.push(months[month]);
                formattedData.appointments.data.push(appointmentFound ? appointmentFound.count : 0);
                formattedData.revenue.data.push(revenueFound ? revenueFound.earnings * 0.9 : 0);
            }
        }

        res.status(STATUS_CODE.OK).json({formattedData,findReports});
    } catch (error) {
        console.error('Error in getDashboardData:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: 'Error fetching dashboard data',
            error: error.message
        });
    }

};
export const getFeedBack = async (req, res) => {
  const { doctorId } = req.params;
  try {
    const feedback = await Feedback.find({ doctor: doctorId }).populate('user', 'name image');
    res.status(STATUS_CODE.OK).json(feedback);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
  }
};

export { registerDoctor, loginDoctor, verifyDoctorToken,fetchDoctors,forgotPassword,resetPassword ,doctorProfile};