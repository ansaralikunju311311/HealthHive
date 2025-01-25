import User from '../Model/userModel.js'
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendOtp } from '../utils/sendMail.js';
import jwt from 'jsonwebtoken';
import {jwtToken} from '../utils/auth.js';
// Helper function to generate OTP and update user
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

const RegisterUser = async(req,res)=>{
    try {
        const {name,email,password,dateOfBirth,phone,age,gender,image} = req.body;
        
        // Check if user already exists and is active
        const existingUser = await User.findOne({email});
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
            existingUser.dateOfBirth = dateOfBirth;
            existingUser.phone = phone;
            existingUser.age = age;
            existingUser.gender = gender;
            existingUser.image = image;
            user = existingUser;
            console.log("Updated user:", user);
            console.log("Existing user:", existingUser);
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
                isActive: false
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
        res.status(500).json({error:error.message});
    }
}

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
        
        // Generate token
        // const userAccessToken = accessToken(user);
        // const userRefreshToken = refreshToken(user);
        const userToken = jwtToken(user);
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
            userToken: userToken,
            // refreshToken: userRefreshToken
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
        // const userAccessToken = accessToken(user);
        // const userRefreshToken = refreshToken(user);
           const userToken = jwtToken(user);
        res.status(200).json({
            message:"Login successful",
            user:{
                _id:user._id,
                email:user.email,
                name:user.name,
                phone:user.phone,
                dateOfBirth:user.dateOfBirth
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
        console.log("req.body=====",req.body)
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

// Verify token endpoint
 const verifyToken = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                dateOfBirth: user.dateOfBirth,
                image: user.image
            }
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export {RegisterUser, LoginUser, verifyOtp, getOtpRemainingTime, resendOtp,forgotPassword,resetPassword, verifyToken};