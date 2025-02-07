import User from '../Model/userModel.js'
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendOtp } from '../utils/sendMail.js';
import {setToken} from '../utils/auth.js';
import Doctor from '../Model/doctorModel.js';
import Department from '../Model/DepartmentModel.js';
import Appointment from '../Model/appoiment.js';
// Helper function to generate OTP and update user



const cookieOptions = {
    
    httpOnly: false,
    secure: true,
    sameSite: 'None',
    maxAge: 9 * 60 * 60 * 1000, // 1 hour
};
const generateAndSendOTP = async (user, email) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log("Generated OTP:", otp);
    
    const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute expiry
    
    // Update user with new OTP
    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();
    // Send OTP
    await sendOtp(email, otp);
    
    return true;
};

// Register user
const RegisterUser = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, phone, age, gender, image } = req.body;
    
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) { 
            // Ensure existingUser is not null before accessing properties
            if (existingUser.isBlocked === true && existingUser.isActive === true) {
                return res.status(400).json({ message: "User is blocked" });
            }
            if (existingUser.isActive) {
                return res.status(400).json({ message: "User already exists" });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let user;

        if (existingUser) {
            // Update existing inactive user
            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.dateOfBirth = dateOfBirth;
            existingUser.phone = phone;
            existingUser.age = age;
            existingUser.gender = gender;
            existingUser.image = image;
            user = existingUser;
        } else {
            // Create new user
            user = new User({
                name,
                email,
                password: hashedPassword,
                dateOfBirth,
                phone,
                age,
                image,
                gender,
                isActive: false,
                isBlocked: false
            });
        }

        // Generate and send OTP
        await generateAndSendOTP(user, email);

        res.status(201).json({
            message: "Verification code sent to your email",
            email
        });
    } catch (error) {
        console.error('Error in RegisterUser:', error);
        res.status(500).json({ error: error.message });
    }
};

// Verify OTP
const verifyOtp = async(req,res)=>{
    try {
        const {email, otp} = req.body;
        
        // Get user
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        
        // Check if OTP matches
        if(user.otp !== otp){
            return res.status(400).json({message:"Invalid verification code"});
        }
        
        // Check if OTP is expired
        if(Date.now() > user.otpExpiresAt){
            return res.status(400).json({message:"Verification code has expired"});
        }
        
        // Activate user
        user.isActive = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        
        // Generate tokens
        const token = setToken(user);
    console.log("token   coolesdsjdnfjdfjdfr=====",token);
        res.cookie('usertoken', token, cookieOptions);

        // console.log("token   coolesdsjdnfjdfjdfr=====",token);
    
        await user.save();
       
        res.status(200).json({
            message: "Account verified successfully",
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                isActive: user.isActive
            },
            userToken: token
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({error:error.message});
    }
}
const LoginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        
        // Check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if(user.isBlocked===true){
            return res.status(400).json({message:"User is blocked"});
        }
        // Check if user is active
        if(!user.isActive){
            return res.status(400).json({message:"Please verify your account first"});
        }
        
        // Check password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        
        // Generate tokens
        const userToken = setToken(user);
        // console.log("userToken   coolesdsjdnfjdfjdfr=====",userToken);
        // console.log("Time", new Date().toLocaleTimeString());
    //    console.log(res.cookie('usertoken', userToken, cookieOptions)); 
    // console.log(cookieOptions)
       res.cookie('usertoken', userToken, cookieOptions)
        res.status(200).json({
            message:"Login successful",
            user:{
                _id:user._id,
                email:user.email,
                name:user.name,
                phone:user.phone,
                dateOfBirth:user.dateOfBirth,
                isActive:user.isActive,
                
            },
            userToken: userToken
        });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
};

const getOtpRemainingTime = async(req, res) => {
    try {
        const { email } = req.query;
        
        const user = await User.findOne({ email });
        if (!user || !user.otpExpiresAt) {
            return res.status(404).json({ remainingTime: 0 });
        }

        const remainingTime = Math.max(0, Math.floor((user.otpExpiresAt - Date.now()) / 1000));
        res.status(200).json({ remainingTime });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const resendOtp = async(req, res) => {
    try {
        const { email } = req.body;
        console.log("Resend OTP request for email:", email);
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Find user
        const user = await User.findOne({ email });
        console.log("Found user:", user ? "yes" : "no");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        if (user.isActive) {
            return res.status(400).json({ message: "User is already verified" });
        }

        try {
            await generateAndSendOTP(user, email);
            console.log("OTP sent successfully");
            
            res.status(200).json({ 
                message: "New verification code sent to your email",
                email 
            });
        } catch (error) {
            console.error("Error sending OTP:", error);
            res.status(500).json({ 
                message: "Failed to send verification code",
                error: error.message 
            });
        }
    } catch (error) {
        console.error('Error in resendOtp:', error);
        res.status(500).json({ 
            message: "Failed to process resend OTP request",
            error: error.message 
        });
    }
};
 const forgotPassword = async(req, res) => {
    try {
        const { email } = req.body;
        
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }
        if(user.isBlocked===true){
            return res.status(400).json({ message: 'User is blocked' });
        }
        // Generate and send OTP
        await generateAndSendOTP(user, email);
        
        res.status(200).json({
            message: "Verification code sent to your email",
            email
        });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(500).json({ message: error.message });
    }
}
const resetPassword = async(req, res) => {
    try {
        
        const { email, otp, new_password } = req.body;

        // console.log("req.body=====",req.body)
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please register first.' });
        }
        if(user.otp !== otp){
            return res.status(400).json({ message: 'Invalid verification code' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        
        // Save new password
        user.password = hashedPassword;
        await user.save();
        
        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ message: error.message });
    }
}



const verifyToken = async (req, res) => {
    // console.log(" happen after middlware verify token=====",req.user);
    try {
        const user = await User.findById(req.user._id).select('-password');
        // console.log("user after select=====",user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};


export const getDoctorsData = async (req, res) => {
    try {
        const doctors = await Doctor.find({ isActive: true, isBlocked: false }).sort({ _id: -1 }).limit(4);

        // console.log("Fetched doctors:", doctors);
        res.status(200).json({ doctors: doctors }); 
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ message: error.message });
    }
}
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({status:'Listed'});
        res.status(200).json(departments);
        console.log("departments",departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
export const logout = async (req, res) => {
    try {
        req.user = null;
        res.cookie('usertoken', null, {
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
export const dptdoctor = async (req, res) => {
    try {
        const { departmentname } = req.params;
        // console.log("===========================",departmentname)
        
        const doctors = await Doctor.find({ specialization:departmentname, isActive: true, isBlocked: false });
        // console.log("doctors====================",doctors)
        res.status(200).json({ doctors });
    } catch (error) {
        console.error('Error fetching doctors by department:', error);
        res.status(500).json({ message: error.message });
    }
}
export const bookAppointment = async (req, res) => {
    try {
        const { doctorid } = req.params;
        const { userid } = req.params;
        const { slots } = req.body;

        // Basic validation
        if (!doctorid || !userid || !slots || !Array.isArray(slots)) {
            return res.status(400).json({ 
                message: 'Invalid booking request'
            });
        }

        // Process each slot and create appointments
        const bookingResults = await Promise.all(slots.map(async (slotData) => {
            // Check if slot is already booked
            const existingAppointment = await Appointment.findOne({
                doctor: doctorid,
                date: new Date(slotData.date),
                time: slotData.time,
                slot: slotData.slot
            });

            if (existingAppointment) {
                throw new Error(`Slot ${slotData.slot} on ${slotData.date} is already booked`);
            }

            // Create new appointment
            const newAppointment = new Appointment({
                user: userid,
                doctor: doctorid,
                date: new Date(slotData.date),
                time: slotData.time,
                slot: slotData.slot
            });

            // Save the appointment
            await newAppointment.save();

            return {
                date: slotData.date,
                slot: slotData.slot,
                time: slotData.time
            };
        }));
        
        res.status(201).json({
            message: 'Appointments booked successfully',
            bookings: bookingResults
        });

    } catch (error) {
        console.error('Booking error:', error);
        res.status(400).json({ 
            message: error.message || 'Error booking appointments'
        });
    }
};
export { RegisterUser, LoginUser, verifyOtp, getOtpRemainingTime, resendOtp, forgotPassword, resetPassword, verifyToken};