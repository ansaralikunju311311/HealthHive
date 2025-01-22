import User from '../Model/userModel.js'
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendOtp } from '../utils/sendMail.js';

// Store temporary user data
let tempUsers = new Map();

const RegisterUser = async(req,res)=>{
    try {
        const {name,email,password,dateOfBirth,phone} = req.body;
        console.log(req.body);
        
        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"User already exists"});
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        
        // Store user data temporarily
        const tempUserData = {
            name,
            email,
            password: hashedPassword,
            dateOfBirth,
            phone
        };
        
        // Generate OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        tempUserData.otp = otp;
        tempUserData.otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute expiry
        console.log(otp);
        // Store in temporary storage
        tempUsers.set(email, tempUserData);
        
        // Send OTP
        await sendOtp(email, otp);
        
        res.status(201).json({
            message: "Verification code sent to your email",
            email: email
        });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
const verifyOtp = async(req,res)=>{
    try {
        const {email, otp} = req.body;
        console.log('Received data:', { email, otp });

        // Get temporary user data
        const tempUserData = tempUsers.get(email);
        if(!tempUserData){
            return res.status(404).json({message:"Please register first"});
        }
        
        console.log('Stored data:', {
            storedOtp: tempUserData.otp,
            expiresAt: tempUserData.otpExpiresAt
        });
        
        // Check if OTP matches (convert both to strings for comparison)
        if(String(tempUserData.otp) !== String(otp)){
            return res.status(400).json({message:"Invalid verification code"});
        }
        
        // Check if OTP is expired
        if(Date.now() > tempUserData.otpExpiresAt){
            return res.status(400).json({message:"Verification code has expired"});
        }
        
        // Create and save the user
        const userData = {
            name: tempUserData.name,
            email: tempUserData.email,
            password: tempUserData.password,
            dateOfBirth: tempUserData.dateOfBirth,
            phone: tempUserData.phone
        };
        
        const user = new User(userData);
        await user.save();
        
        // Remove temporary data
        
        tempUsers.delete(tempUserData);
        
        res.status(200).json({message:"Account verified successfully"});
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({error:error.message});
    }
}

const LoginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }
        res.status(200).json({message:"Login successful"});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

const getOtpRemainingTime = async(req, res) => {
    try {
        const { email } = req.query;
        const tempUserData = tempUsers.get(email);
        
        if (!tempUserData || !tempUserData.otpExpiresAt) {
            return res.status(404).json({ remainingTime: 0 });
        }

        const remainingTime = Math.max(0, Math.floor((tempUserData.otpExpiresAt - Date.now()) / 1000));
        res.status(200).json({ remainingTime });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const generateOtp = async(req, res) => {
    try {
        const { email } = req.body;
        const tempUserData = tempUsers.get(email);
        
        if (!tempUserData) {
            return res.status(404).json({ message: "Please register first" });
        }

        // Generate new OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        tempUserData.otp = otp;
        tempUserData.otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000); // 1 minute expiry
        
        // Update in temporary storage
        tempUsers.set(email, tempUserData);
        
        // Send OTP
        await sendOtp(email, otp);
        
        res.status(200).json({ message: "New verification code sent to your email" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {RegisterUser, LoginUser, verifyOtp, getOtpRemainingTime, generateOtp};