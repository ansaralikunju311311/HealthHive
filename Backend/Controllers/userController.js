import User from '../Model/userModel.js'
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendOtp } from '../utils/sendMail.js';
import {setToken} from '../utils/auth.js';
import Doctor from '../Model/doctorModel.js';
import Department from '../Model/DepartmentModel.js';
import Appointment from '../Model/appoiment.js';
import appointmentSchedule from '../Model/appoimentSchedule.js';
import { razorpay } from '../server.js';
import Transaction from '../Model/Transaction.js';
import Chat from '../Model/chat.js';
import e from 'cors';
import { timeStamp } from 'console';
import STATUS_CODE from '../StatusCode/StatusCode.js';
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
        const { name, email, password, dateOfBirth, phone, age, gender, image,bloodGroup,address } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) { 
            // Ensure existingUser is not null before accessing properties
            if (existingUser.isBlocked === true && existingUser.isActive === true) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "User is blocked" });
            }
            if (existingUser.isActive) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "User already exists" });
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
            existingUser.bloodGroup = bloodGroup;
            existingUser.address = address;
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
                isBlocked: false,
                bloodGroup,
                address
            });
        }

        // Generate and send OTP
        await generateAndSendOTP(user, email);

        res.status(STATUS_CODE.POST).json({
            message: "Verification code sent to your email",
            email
        });
    } catch (error) {
        console.error('Error in RegisterUser:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

// Verify OTP
const verifyOtp = async(req,res)=>{
    try {
        const {email, otp} = req.body;
        
        // Get user
        const user = await User.findOne({email});
        if(!user){
            return res.status(STATUS_CODE.NOT_FOUND).json({message:"User not found"});
        }
        
        // Check if OTP matches
        if(user.otp !== otp){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"Invalid verification code"});
        }
        
        // Check if OTP is expired
        if(Date.now() > user.otpExpiresAt){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"Verification code has expired"});
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
       
        res.status(STATUS_CODE.OK).json({
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
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({error:error.message});
    }
}
const LoginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        
        // Check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(STATUS_CODE.NOT_FOUND).json({message:"User not found"});
        }
        if(user.isBlocked===true){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"User is blocked"});
        }
        // Check if user is active
        if(!user.isActive){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"Please verify your account first"});
        }
        // Check password
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"Invalid credentials"});
        }
        
        // Generate tokens
        const userToken = setToken(user);
       res.cookie('usertoken', userToken, cookieOptions)
        res.status(STATUS_CODE.OK).json({
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
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({error:error.message});
    }
};

const getOtpRemainingTime = async(req, res) => {
    try {
        const { email } = req.query;
        
        const user = await User.findOne({ email });
        if (!user || !user.otpExpiresAt) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ remainingTime: 0 });
        }

        const remainingTime = Math.max(0, Math.floor((user.otpExpiresAt - Date.now()) / 1000));
        res.status(STATUS_CODE.OK).json({ remainingTime });
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};

const resendOtp = async(req, res) => {
    try {
        const { email } = req.body;
        console.log("Resend OTP request for email:", email);
        
        if (!email) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "Email is required" });
        }

        // Find user
        const user = await User.findOne({ email });
        console.log("Found user:", user ? "yes" : "no");
        
        if (!user) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: "User not found" });
        }
        
        if (user.isActive) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "User is already verified" });
        }

        try {
            await generateAndSendOTP(user, email);
            console.log("OTP sent successfully");
            
            res.status(STATUS_CODE.OK).json({ 
                message: "New verification code sent to your email",
                email 
            });
        } catch (error) {
            console.error("Error sending OTP:", error);
            res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ 
                message: "Failed to send verification code",
                error: error.message 
            });
        }
    } catch (error) {
        console.error('Error in resendOtp:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ 
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
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'User not found. Please register first.' });
        }
        if(user.isBlocked===true){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'User is blocked' });
        }
        // Generate and send OTP
        await generateAndSendOTP(user, email);
        
        res.status(STATUS_CODE.OK).json({
            message: "Verification code sent to your email",
            email
        });
    } catch (error) {
        console.error('Error in forgotPassword:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
const resetPassword = async(req, res) => {
    try {
        
        const { email, otp, new_password } = req.body;

        // console.log("req.body=====",req.body)
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'User not found. Please register first.' });
        }
        if(user.otp !== otp){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Invalid verification code' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
        
        // Save new password
        user.password = hashedPassword;
        await user.save();
        
        res.status(STATUS_CODE.OK).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
const verifyToken = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'User not found' });
        }
        res.status(STATUS_CODE.OK).json({ user });
    } catch (error) {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};
export const getDoctorsData = async (req, res) => {
    try {
        const doctors = await Doctor.find({ isActive: true, isBlocked: false }).sort({ _id: -1 }).limit(4);

        // console.log("Fetched doctors:", doctors);
        res.status(STATUS_CODE.OK).json({ doctors: doctors }); 
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const getDepartments = async (req, res) => {
    try {
        const departments = await Department.find({status:'Listed'});
        res.status(STATUS_CODE.OK).json(departments);
        // console.log("departments",departments);
    } catch (error) {
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
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
        res.status(STATUS_CODE.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Error logging out:', error); 
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const dptdoctor = async (req, res) => {
    try {
        const { departmentname } = req.params;
        
        const doctors = await Doctor.find({ specialization:departmentname, isActive: true, isBlocked: false });
        res.status(STATUS_CODE.OK).json({ doctors });
    } catch (error) {
        console.error('Error fetching doctors by department:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
//importent for checking i comment this code 
export const bookAppointment = async (req, res) => {
    try {
        const { doctorid, userid } = req.params;
        const { slots,transactionData} = req.body;
        console.log("Doctor ID:", doctorid);
        console.log("User ID:", userid);
        console.log("Slot details:", slots);
        console.log("Transaction datanvnfjdjjjfdjccccf:", transactionData.order_id);

        // Basic validation
        if (!doctorid || !userid || !slots) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ 
                message: 'Invalid booking request. Missing required fields.'
            });
        }

        // Create new appointment
        const newAppointment = new Appointment({
            user: userid,
            doctor: doctorid,
            date: slots.date,
            time: slots.time,
           
        });

        // Save the appointment
        await newAppointment.save();

        // Update appointment schedule
        try {
            const doctorSchedule = await appointmentSchedule.findOne({ doctorId: doctorid });
            
            if (doctorSchedule) {
                // Find and update the specific slot
                const updatedAppointments = doctorSchedule.appointments.map(appointment => {
                    if (appointment.appointmentDate === slots.date && 
                        appointment.slotTime === slots.time) {
                        return {
                            ...appointment.toObject(),
                            isBooked: true,
                            bookingTime: new Date()
                        };
                    }
                    return appointment;
                });

                doctorSchedule.appointments = updatedAppointments;
                await doctorSchedule.save();
            }
            const doctor = await Doctor.findById(doctorid);
            const user = await User.findById(userid);
            const newTransaction = new Transaction({
                user: userid,
                doctor: doctorid,
                doctorName: doctor.name,
                userName: user.name,
                amount: doctor.consultFee,
                date: new Date(),
                appoimentdate: slots.date,
                slot: slots.time,
                orderId : transactionData.order_id,
                paymentId : transactionData.payment_id
            });
            await newTransaction.save();
        } catch (error) {
            console.error('Error updating appointment schedule:', error);
        }
        res.status(STATUS_CODE.OK).json({
            message: 'Appointment booked successfully',
            appointment: newAppointment
        });

    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ 
            message: 'Failed to book appointment',
            error: error.message 
        });
    }
};
export const FetchAppoiments = async(req, res) => {
    const {page,limit} = req.query;
    console.log("page,limit",page,limit);

    try {

        const { userid } = req.params;
        console.log("userid",userid);
        const page = +(req.query.page || 1);
        const limit = +(req.query.limit || 10);
        const skip = (page - 1) * limit;
        const appointments = await Appointment.find({ user: userid }).populate({
            path:'doctor',
            select:'name specialization',
        }).sort({ timeStamp: -1 }).skip(skip).limit(limit);
        const totalAppointments = await Appointment.countDocuments({ user: userid });
        const totalPages = Math.ceil(totalAppointments / limit);
        res.status(STATUS_CODE.OK).json({ appointments, pagination: { currentPage: page, totalPages } });

        console.log("Appointments:", appointments);
        // res.status(STATUS_CODE.OK).json(appointments);
    } catch (error) {

        console.error('Error fetching appointments:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export  const handlePayment = async(req, res) => {
    console.log("req.body",req.body)
    const { amount } = req.body;
    try {
        const options = {
            amount: Number(amount * 100), 
            currency: "INR",
            receipt: `rcpt_${Date.now()}`,
            payment_capture: 1,
            notes: {
                description: "Consultation Payment"
            }
        };
        
        const order = await razorpay.orders.create(options);
        
        res.status(STATUS_CODE.OK).json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt
        });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(STATUS_CODE.BAD_REQUEST).json({ 
            message: 'Error processing payment',
            error: error.message 
        });
    }
}
export const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");
        if (razorpay_signature === expectedSign) {
            return res.status(STATUS_CODE.OK).json({
                message: "Payment verified successfully",
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id
            });
        } else {
            return res.status(STATUS_CODE.BAD_REQUEST).json({
                message: "Invalid signature sent!"
            });
        }
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
            message: "Internal Server Error!",
            error: error.message
        });
    }
};

export const fetchDoctor = async(req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await Doctor.findById(doctorId);
        res.status(STATUS_CODE.OK).json(doctor);
        // console.log('Doctor details:', doctor);
    } catch (error) {
        console.error('Error fetching doctor:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}
export const chatDetails = async (req,res) => {
    try {
        
        const { doctorId, userId } = req.params;
      const roomId = doctorId + '_' + userId;
        const messages = await Chat.find({ roomId }).sort({ createdAt: 1 });
        res.status(STATUS_CODE.OK).json(messages);
    } catch (error) {
        console.error('Error fetching chat details:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
}
export { RegisterUser, LoginUser, verifyOtp, getOtpRemainingTime, resendOtp, forgotPassword, resetPassword, verifyToken};