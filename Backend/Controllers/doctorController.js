import doctor from "../Model/doctorModel.js";
import mongoose from 'mongoose';
import RejectedDoctor from "../Model/RejectedDoctors.js";
import moment from 'moment-timezone';
import bcrypt from 'bcrypt';
// import {jwtToken} from '../utils/auth.js'
import crypto from 'crypto';
import {sendOtp} from '../utils/sendMail.js';
import {setToken} from '../utils/auth.js';    
import Department from '../Model/DepartmentModel.js';
import appoimentSchedule from '../Model/appoimentSchedule.js';
import Appointment from '../Model/appoiment.js';
import DoctorWallet from '../Model/Drwallet.js';
import User from '../Model/userModel.js';
import Transaction from "../Model/Transaction.js";
import Chat from '../Model/chat.js'; // Import the Chat model
// import RejectedDoctor from "../Model/RejectedDoctors.js";
    // import ClearToken from '../utils/auth.js';    
 import cookies from 'js-cookie';
// import appoimentSchedule from '../Model/appoimentSchedule.js';

 const cookieOptions = {
     
    httpOnly: false,
    secure: true,
    sameSite: 'none',
    maxAge: 10 * 60 * 1000, // 1 minute
};




 const generateAndSendOTP = async (doctor, email) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log("Generated OTP:", otp);
    
    const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute expiry
    
    // Update user with new OTP
    doctor.otp = otp;
    doctor.otpExpiresAt = otpExpiresAt;
    await doctor.save();
    // Send OTP
    await sendOtp(email, otp);
    
    return true;
};
 const RegisterDoctor = async(req,res)=>{
    try {
        const {name,email,password,yearsOfExperience,specialization,phone,profileImage,medicalLicense,idProof,about,consultFee,gender,availability} = req.body;
        // console.log(req.body);
        // Check if user already exists and is active
        const existingUser = await doctor.findOne({email});
        const rejectedDoctor = await RejectedDoctor.findOne({email})
         

        if(rejectedDoctor)
        {
            return res.status(400).json({message:"this is rejeced user please contact admin"});
        }
        
        if(existingUser && existingUser.isBlocked===true && existingUser.isActive===true){
            return res.status(400).json({message:"User is blocked"});
        }
        if(existingUser && !existingUser.isActive){
            return res.status(400).json({message:"User already exists   You are under verification process"});
        }
        if(existingUser && existingUser.isActive){
            return res.status(400).json({message:"User already exists"});
        }
       
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        let user;
        if (existingUser) {
            // Update existing inactive user
            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.yearsOfExperience = yearsOfExperience;
            existingUser.specialization = specialization;
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
            // console.log("Updated user:", user);
            // console.log("Existing user:", existingUser);
        } else {
            // Create new user
            user = new doctor({
                name,
                email,
                password: hashedPassword,
                yearsOfExperience,
                specialization,
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
            // console.log("New user:", user);
        }
        await user.save();
        res.status(200).json({message:"User registered successfully",user});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

 const LoginDoctor = async(req,res)=>{
    try {
        const {email,password} = req.body;
        
        // Check if user exists
        const existingDoctor = await doctor.findOne({email});
        const rejectedDoctor = await RejectedDoctor.findOne({email});
        if(!existingDoctor){
            return res.status(404).json({message:"User not found"});
        }
        if(existingDoctor.isBlocked===true && existingDoctor.isActive===true &&existingDoctor){
            return res.status(200).json({message:"Your account is blocked. Please contact the admin."});
        }
        // console.log(existingDoctor.isActive);
        // Check if user is active
        if(!existingDoctor.isActive){
            return res.status(200).json({message:"Please verify your account first",
                doctor:{
                    isActive: existingDoctor.isActive
                }
            });
        }
        if(rejectedDoctor){
            return res.status(200).json({message:"Your account is rejected. Please contact the admin.",
                doctor:{
                    isActive: existingDoctor.isActive
                }
            });
        }
        // Check password
        const isMatch = await bcrypt.compare(password,existingDoctor.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        const doctorToken = setToken(existingDoctor);
        res.cookie('doctortoken', doctorToken, cookieOptions);
        // Generate tokens
        res.status(200).json({
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
        res.status(500).json({message:error.message});
    }
}

 const verifyDoctorToken = async (req, res) => {
    try {
        // req.doctor is set by the protectDoctor middleware
        res.status(200).json({ doctor: req.doctor });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

const fetchDoctors = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Check if the doctor exists in rejected list first
        const rejectedDoctor = await RejectedDoctor.findOne({ email });
        if (rejectedDoctor) {
            return res.status(200).json({
                isRejected: true,
                message: "Your registration has been rejected. Please contact the admin."
            });
        }

        // Fetch the doctor from the main collection
        const doctorData = await doctor.findOne({ email });
        if (!doctorData) {
            return res.status(404).json({ 
                isVerified: false,
                message: "Doctor not found. Please register first." 
            });
        }

        // Check activation status
        if (doctorData.isActive === true) {
            return res.status(200).json({ 
                isVerified: true,
                doctor: doctorData 
            });
        } 
        
        if (doctorData.isActive === false) {
            return res.status(200).json({ 
                isVerified: false,
                message: "Your account is pending verification." 
            });
        }

    } catch (error) {
        console.error("Error in fetchDoctors:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

    async function forgotPassword(req, res) {
        try {
            const { email } = req.body;

            // Find user
            const doctorData = await doctor.findOne({ email });
            const rejectedDoctor = await RejectedDoctor.findOne({ email });
            if (!doctorData) {
                return res.status(404).json({ message: 'Doctor not found. Please register first.' });
            }
            if (!doctorData.isActive) {
                return res.status(403).json({ message: 'Your account is not active. Please contact the admin.' });
            }
            if (rejectedDoctor) {
                return res.status(403).json({ message: 'Your account is rejected. Please contact the admin.' });
            }
            if (doctorData.isBlocked === true) {
                return res.status(403).json({ message: 'Your account is blocked. Please contact the admin.' });
            }
            // Generate and send OTP
            await generateAndSendOTP(doctorData, email);

            res.status(200).json({
                message: "Verification code sent to your email",
                email
            });
        } catch (error) {
            console.error('Error in forgotPassword:', error);
            res.status(500).json({ message: error.message });
        }
    }










            



// working code
const resetPassword = async (req, res) => {
    try {
       

        // Destructure with additional logging, handling both camelCase and snake_case
        const email = req.body.email;
        const otp = req.body.otp;
        const newPassword = req.body.newPassword || req.body.new_password;


        // Validate input with detailed checks
        if (!email) {
            console.log("Email is missing or undefined");
            return res.status(400).json({ message: 'Email is required' });
        }

        if (!otp) {
            console.log("OTP is missing or undefined");
            return res.status(400).json({ message: 'OTP is required' });
        }

        if (!newPassword) {
            console.log("New Password is missing or undefined");
            return res.status(400).json({ message: 'New password is required' });
        }
        
        // Find user
        const doctorData = await doctor.findOne({ email });
       const rejectedDoctor = await RejectedDoctor.findOne({ email });
        if(rejectedDoctor){
            return res.status(403).json({ message: 'Your account is rejected. Please contact the admin.' });
       }
        if (!doctorData) {
            console.log("Doctor not found with email:", email);
            return res.status(404).json({ message: 'Doctor not found. Please register first.' });
        }
        
        // Validate OTP
        console.log("Stored Reset Password OTP:", doctorData.resetPasswordOtp);
        if(!doctorData.otp || doctorData.otp !== otp){
            console.log("OTP Validation Failed");
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check OTP expiration
        console.log("OTP Expires:", doctorData.resetPasswordOtpExpires);
        console.log("Current Time:", Date.now());
        if(doctorData.resetPasswordOtpExpires < Date.now()){
            console.log("OTP Has Expired");
            return res.status(400).json({ message: 'OTP has expired' });
        }
        
        // Hash the new password
        try {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            // Update password and clear OTP
            doctorData.password = hashedPassword;
            doctorData.resetPasswordOtp = undefined;
            doctorData.resetPasswordOtpExpires = undefined;
            await doctorData.save();
            
            res.status(200).json({ message: 'Password reset successful' });
        } catch (hashError) {
            console.error('Password hashing error:', hashError);
            return res.status(500).json({ 
                message: 'Error processing password', 
                error: hashError.message 
            });
        }
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: error.message });
    }
};

const doctorProfile = async (req, res) => {
    try {
        const doctorId = req.params.id;

        // console.log("Doctor ID:", doctorId);


        // const doctorData = await doctor.findOne({ email });

        const doctorData = await doctor.findById(doctorId).select('-password');



        // console.log("Doctor Data:", doctorData);
        if (!doctorData) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.status(200).json({ doctorData });
    } catch (error) {
        console.log("Error in doctofjnjnjfnfjnjrProfile:", error);
        console.error('Error in doctorProfile:', error);
        res.status(500).json({ message: error.message });
    }
};

export const fetchDepartments = async (req, res) => {
    try {
        const departments = await Department.find({status:'Listed'});
        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
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
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(500).json({ message: error.message });
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

        // Validate and normalize appointments
        const validAppointments = appointments.map(appt => {
            const appointmentDate = new Date(appt.appointmentDate);

            // Log any parsing issues
            if (isNaN(appointmentDate.getTime())) {
                console.warn(`Invalid date detected: ${appt.appointmentDate}`);
            }

            // Store the appointment date as a string in YYYY-MM-DD format
            return {
                appointmentDate: appointmentDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
                slotTime: appt.slotTime,
                bookingTime: new Date(appt.bookingTime) // Assuming you want to keep bookingTime as a Date object
            };
        });

        if (!existingSchedule) {
            // If no existing schedule, create new
            const newSchedule = new AppointmentSchedule({
                doctorId,
                appointments: validAppointments
            });

            await newSchedule.save();

            // console.log("New Schedule Created:", newSchedule);

            return res.status(201).json({ 
                message: 'Schedules created successfully',
                schedule: newSchedule.appointments.map(appt => ({
                    appointmentDate: appt.appointmentDate,
                    slotTime: appt.slotTime
                }))
            });
        } else {
            // Check for duplicate appointments
            const duplicateAppointments = validAppointments.filter(newAppt => 
                existingSchedule.appointments.some(existingAppt => 
                    existingAppt.appointmentDate === newAppt.appointmentDate && // Compare as strings
                    existingAppt.slotTime === newAppt.slotTime
                )
            );

            if (duplicateAppointments.length > 0) {
                return res.status(400).json({
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
                    a.appointmentDate === appointment.appointmentDate && // Compare as strings
                    a.slotTime === appointment.slotTime
                )
            );

            existingSchedule.appointments = mergedAppointments;
            await existingSchedule.save();


            return res.status(200).json({ 
                message: 'Schedules updated successfully',
                schedule: existingSchedule.appointments.map(appt => ({
                    appointmentDate: appt.appointmentDate,
                    slotTime: appt.slotTime
                }))
            });
        }
    } catch (error) {
        console.error('Error in Scheduling:', error);
        res.status(500).json({ 
            message: 'Internal server error during scheduling',
            errorDetails: error.message 
        });
    }
};
import AppointmentSchedule from '../Model/appoimentSchedule.js'; // Ensure correct path

export const getSchedules = async (req, res) => {
    const { id: doctorId } = req.params;

    try {
        const existingSchedule = await AppointmentSchedule.findOne({ doctorId });

        if (!existingSchedule) {
            return res.status(404).json({
                message: 'No schedules found for this doctor',
                schedules: []
            });
        }

       

        const todayInIndia = moment().tz("Asia/Kolkata").startOf('day');
        
        const upcomingAppointments = existingSchedule.appointments.filter(appointment => {
            const appointmentDate = moment.tz(appointment.appointmentDate, "Asia/Kolkata").startOf('day');
        
            return appointmentDate.isSameOrAfter(todayInIndia, 'day');
        });
        
        
        return res.status(200).json({
            message: 'Schedules retrieved successfully',
            schedules: upcomingAppointments // Use the simplified field name
        });
    } catch (error) {
        console.error('Error retrieving schedules:', error);
        res.status(500).json({
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
            return res.status(404).json({ 
                message: 'No schedules found for this doctor',
                schedules: []
            });
        }
        const todayInIndia = moment().tz("Asia/Kolkata").startOf('day');

       const schedules = existingSchedule.appointments.filter(appointment => {
           const appointmentDate = moment.tz(appointment.appointmentDate, "Asia/Kolkata").startOf('day');
        
            // Include appointment if it's today or in the future
            return appointmentDate.isSameOrAfter(todayInIndia, 'day');
        });

        // console.log("schedules=====",schedules)

        res.status(200).json({ 
            message: 'Schedules retrieved successfully',
            schedules: schedules
        });
    } catch (error) {
        console.error('Error retrieving schedules:', error);
        res.status(500).json({ 
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
            select: 'name email phone age gender image' // Select specific user fields you want to retrieve
        });
    
    res.status(200).json(appoiments)
}
export const fullAppoiments = async (req, res) => {
    try {
        const {id} = req.params;
        
       
        const totalAppointments = await Appointment.countDocuments({doctor: id});
        
       
        const uniquePatients = await Appointment.distinct('user', { doctor: id }).then(users => users.length);
        
        const fee = await doctor.findById(id).select('consultFee -_id');
        
        res.status(200).json({
            totalAppointments,
            uniquePatients,
            fee
        });
    } catch (error) {
        console.error('Error in fullAppoiments:', error);
        res.status(500).json({ message: error.message });
    }
}
export const fetchWalletBalance = async (req, res) => {
    try {
        const {id} = req.params;
        const countAppoiments = await Appointment.countDocuments({ doctor: id });
        const fees =  await doctor.findById(id).select('consultFee -_id');

        let totalearnings = countAppoiments * fees.consultFee    - (countAppoiments * fees.consultFee * 0.1) ;

        console.log("totaleearnings", totalearnings);

        let walletBalance = await DoctorWallet.findOne({ doctor: id });

        const history = await Transaction.find({doctor: id});
         console.log("history", history);

        if (!walletBalance) {
            // Create new wallet if it doesn't exist
            walletBalance = new DoctorWallet({
                doctor: id,
                totalAmount: totalearnings
            });
        } else {
            // Update existing wallet
            walletBalance.totalAmount = totalearnings;
        }
        await walletBalance.save();
        res.status(200).json({walletBalance,history});
    } catch (error) {
        console.error('Error in fetchWalletBalance:', error);
        res.status(500).json({ message: error.message });
    }
}


export const userDetails = async(req,res)=>
{

    try {
        const {userId} = req.params;
        const user = await User.findById(userId).select('-password');
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}




export const chatDetails = async(req,res)=>
{
    try {
        const {userId,doctorId} = req.params;
      const roomId = doctorId+'_'+userId;
        const chats = await Chat.find({roomId}).sort({ createdAt: 1 });
        res.status(200).json(chats);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}
export { RegisterDoctor, LoginDoctor, verifyDoctorToken,fetchDoctors,forgotPassword,resetPassword ,doctorProfile};