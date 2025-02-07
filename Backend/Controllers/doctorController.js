import doctor from "../Model/doctorModel.js";

import RejectedDoctor from "../Model/RejectedDoctors.js";
import bcrypt from 'bcrypt';
// import {jwtToken} from '../utils/auth.js'
import crypto from 'crypto';
import {sendOtp} from '../utils/sendMail.js';
import {setToken} from '../utils/auth.js';    
import Department from '../Model/DepartmentModel.js';
import appoimentSchedule from '../Model/appoimentSchedule.js';
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
        // Detailed logging of entire request
        // console.log("Full Request Body:", JSON.stringify(req.body, null, 2));
        // console.log("Request Body Type:", typeof req.body);

        // Destructure with additional logging, handling both camelCase and snake_case
        const email = req.body.email;
        const otp = req.body.otp;
        const newPassword = req.body.newPassword || req.body.new_password;

        // console.log("Email:", email, "Type:", typeof email);
        // console.log("OTP:", otp, "Type:", typeof otp);
        // console.log("New Password:", newPassword, "Type:", typeof newPassword);

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
export const schedule = async (req,res)=>{
    const { id: doctorId } = req.params;
    const { schedules } = req.body;
    console.log("doctorId=====",doctorId);
    console.log("schedules=====",schedules);
    try {
        const existingSchedule = await appoimentSchedule.findOne({ doctorId });
        
        if (!existingSchedule) {
            // If no existing schedule, create new
            const newSchedule = new appoimentSchedule({
                doctorId,
                schedules
            });
            await newSchedule.save();
            return res.status(201).json({ 
                message: 'Schedules created successfully',
                schedule: newSchedule
            });
        } else {
            // Merge schedules intelligently
            const mergedSchedules = existingSchedule.schedules.map(existingEntry => {
                // Find matching date in new schedules
                const newEntry = schedules.find(
                    newSchedule => newSchedule.date === existingEntry.date
                );

                if (!newEntry) {
                    // If no new schedule for this date, keep existing
                    return existingEntry;
                }

                // Combine time slots, removing duplicates
                const combinedTimeSlots = [
                    ...existingEntry.timeSlots,
                    ...newEntry.timeSlots
                ].filter((slot, index, self) => 
                    index === self.findIndex(t => 
                        t.label === slot.label && 
                        new Date(t.time).getTime() === new Date(slot.time).getTime()
                    )
                );

                return {
                    date: existingEntry.date,
                    timeSlots: combinedTimeSlots
                };
            });

            // Add completely new dates
            const newDates = schedules.filter(
                newSchedule => !existingSchedule.schedules.some(
                    existingSchedule => existingSchedule.date === newSchedule.date
                )
            );

            // Update schedules
            existingSchedule.schedules = [
                ...mergedSchedules,
                ...newDates
            ];

            await existingSchedule.save();
            return res.status(200).json({ 
                message: 'Schedules updated successfully',
                schedule: existingSchedule
            });
        }
    } catch (error) {
        console.error('Error in Scheduling:', error);
        res.status(500).json({ 
            message: 'Internal server error during scheduling',
            errorDetails: error.message 
        });
    }
}

// export const schedule = async (req,res)
export { RegisterDoctor, LoginDoctor, verifyDoctorToken,fetchDoctors,forgotPassword,resetPassword ,doctorProfile};