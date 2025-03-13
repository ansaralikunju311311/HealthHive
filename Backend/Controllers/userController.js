import User from '../Model/userModel.js'
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { sendOtp } from '../utils/sendMail.js';
import {setToken} from '../utils/auth.js';
import Doctor from '../Model/doctorModel.js';
import Department from '../Model/departmentModel.js';
import Appointment from '../Model/appoimentModel.js';
import appointmentSchedule from '../Model/appoimentSchedule.js';
import { razorpay } from '../server.js';
import Transaction from '../Model/transactionModel.js';
import Chat from '../Model/chatModel.js';
import { timeStamp } from 'console';
import STATUS_CODE from '../StatusCode/StatusCode.js';
const cookieOptions = {
    httpOnly: false,
    secure: true,
    sameSite: 'None',
    maxAge: 9 * 60 * 60 * 1000, 
};
const generateAndSendOTP = async (user, email) => {
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log("Generated OTP:", otp);
    
    const otpExpiresAt = new Date(Date.now() + 1 * 60 * 1000);
    

    user.otp = otp;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();
    await sendOtp(email, otp);
    
    return true;
};
const registerUser = async (req, res) => {
    try {
        const { name, email, password, dateOfBirth, phone, age, gender, image,bloodGroup,address } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) { 
            if (existingUser.isBlocked === true && existingUser.isActive === true) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "User is blocked" });
            }
            if (existingUser.isActive) {
                return res.status(STATUS_CODE.BAD_REQUEST).json({ message: "User already exists" });
            }
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let user;

        if (existingUser) {
            existingUser.name = name;
            existingUser.password = hashedPassword;
            existingUser.dateOfBirth = dateOfBirth;
            existingUser.phone = phone;
            existingUser.age = age;
            existingUser.gender = gender;
            existingUser.image = image;
            existingUser.bloodGroup = bloodGroup;
            existingUser.address = address;
            existingUser.profileCompletion = true;

            user = existingUser;
        } else {
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
                address,
                profileCompletion:true
            });
        }

        await generateAndSendOTP(user, email);

        res.status(STATUS_CODE.CREATED).json({
            message: "Verification code sent to your email",
            email
        });
    } catch (error) {
        console.error('Error in RegisterUser:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
};


export const googleSignUp = async(req,res)=>{
    try{
        const { email, name, uid } = req.body;

        console.log("req.body.userData",req.body);
        const user = await User.findOne({ email });
        if(user){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'User already exists' });
        }
        const newuser = new User({
            name,
            email,
            uid,
            isActive: true,
            isBlocked: false,
            bloodGroup: 'N/A',
            image: 'N/A',
            address: 'N/A',
            gender: 'N/A',
            age: 'N/A',
            dateOfBirth: Date.now(),
            phone: 'N/A',
            password: 'N/A',
            profileCompletion:false
        })
        await newuser.save();
        res.status(STATUS_CODE.OK).json({ message: 'Google sign up successful' });
    }
    catch(error)
    {
        console.log(error)
    }
}
export const googleSignIn = async(req,res)=>{
    try{
        const { email, name, uid } = req.body;
        const user = await User.findOne({ email});
        if(!user){
            return res.status(STATUS_CODE.NOT_FOUND).json({message:"User not found"});
        }
        if(user.isBlocked===true){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"User is blocked"});
        }
        if(!user.isActive){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"Please verify your account first"});
        }
        if(user.profileCompletion===false){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"Please complete your profile first"});
        }
        if(user.uid!==uid){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"User not found"});
        }
        
        if(user.uid===uid && email===user.email){
            const token = setToken(user);
            console.log("token   coolesdsjdnfjdfjdfr=====",token);

            res.cookie('usertoken', token, cookieOptions);
            res.status(STATUS_CODE.OK).json({
                message:"Login successful",
                user:{
                    _id:user._id,
                    email:user.email,
                    name:user.name,
                    phone:user.phone,
                    dateOfBirth:user.dateOfBirth,
                    isActive:user.isActive,
                    profileCompletion:user.profileCompletion
                }
                ,usertoken:token
            });
    }   
} catch(error)
    {
        console.log(error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
const verifyOtp = async(req,res)=>{
    try {
        const {email, otp} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(STATUS_CODE.NOT_FOUND).json({message:"User not found"});
        }
        if(user.otp !== otp){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"Invalid verification code"});
        }
        if(Date.now() > user.otpExpiresAt){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"Verification code has expired"});
        }
        user.isActive = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        const token = setToken(user);
    console.log("token   coolesdsjdnfjdfjdfr=====",token);
        res.cookie('usertoken', token, cookieOptions);
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
const loginUser = async(req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(STATUS_CODE.NOT_FOUND).json({message:"User not found"});
        }
        if(user.isBlocked===true){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"User is blocked"});
        }
        if(!user.isActive){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"Please verify your account first"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(STATUS_CODE.BAD_REQUEST).json({message:"Invalid credentials"});
        }
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
        
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'User not found. Please register first.' });
        }
        if(user.isBlocked===true){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'User is blocked' });
        }
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

       
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'User not found. Please register first.' });
        }
        if(user.otp !== otp){
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Invalid verification code' });
        }

       
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);
    
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
        const doctors = await Doctor.find({ isActive: true, isBlocked: false }).sort({ _id: -1 }).limit(4).populate({
            path: 'specialization',
            select: 'Departmentname'
        });

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
        console.log("Department Name:", departmentname);
        
        
        const department = await Department.findOne({ Departmentname: departmentname });
        
        if (!department) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ 
                message: "Department not found",
                doctors: []
            });
        }

        const doctors = await Doctor.find({ 
            specialization: department._id, 
            isActive: true, 
            isBlocked: false 
        }).populate({
            path: 'specialization',
            select: 'Departmentname'
        });

        console.log("Found doctors:", doctors);
        res.status(STATUS_CODE.OK).json({ doctors });
    } catch (error) {
        console.error('Error fetching doctors by department:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
}
export const bookAppointment = async (req, res) => {
    try {
        const { doctorid, userid } = req.params;
        const { slots,transactionData} = req.body;
        console.log("Doctor ID:", doctorid);
        console.log("User ID:", userid);
        console.log("Slot details:", slots);
        console.log("Transaction datanvnfjdjjjfdjccccf:", transactionData.order_id);

        if (!doctorid || !userid || !slots) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ 
                message: 'Invalid booking request. Missing required fields.'
            });
        }

        const newAppointment = new Appointment({
            user: userid,
            doctor: doctorid,
            date: slots.date,
            time: slots.time,
           
        });

        await newAppointment.save();

        try {
            const doctorSchedule = await appointmentSchedule.findOne({ doctorId: doctorid });
            
            if (doctorSchedule) {
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
export const fetchAppoiments = async(req, res) => {
    
       const {page,limit} = req.query;
       const { userid } = req.params;


    try {

        console.log("userid",userid);
        const page = +(req.query.page || 1);
        console.log(page)
        const limit = +(req.query.limit || 10);
        const skip = (page - 1) * limit;
        console.log("now i am here ok correct")
        const appointments = await Appointment.find({ user: userid }).populate({
            path:'doctor',
            select:'name specialization consultFee profileImage',
            populate:{
                path:'specialization',
                select:'Departmentname'
            }
        }).sort({createdAt:-1}).skip(skip).limit(limit);
        
        const totalPages = Math.ceil(await Appointment.countDocuments({ user: userid })/limit);

        const appoinmentwithindex = appointments.map((appointment, index) => ({
            ...appointment.toObject(), 
            serialNumber: index + 1 + skip
        }));
      
        res.status(STATUS_CODE.OK).json({appointments:appoinmentwithindex, pagination: { currentPage: page, totalPages } });
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


export const profileSetup = async (req, res) => {
    try {
        const { email, profileImage, bloodGroup, address, dob, phone, gender,age } = req.body;

        console.log("req.body:", req.body);
        const user = await User.findOne({ email }).select('-password');

        if (!user) {
            return res.status(STATUS_CODE.NOT_FOUND).json({ message: 'User not found' });
        }

        if (user.profileCompletion === true) {
            return res.status(STATUS_CODE.BAD_REQUEST).json({ message: 'Profile already completed' });
        }

    
        user.profileImage = profileImage;
        user.bloodGroup = bloodGroup;
        user.address = address;
        user.dateOfBirth = dob;
        user.phone = phone;
        user.gender = gender;
        user.image = profileImage;
        user.age = age;
        user.profileCompletion = true;
       
        await user.save();

      
        const token = setToken(user);
        res.cookie('usertoken', token, cookieOptions);
        
        res.status(STATUS_CODE.CREATED).json(user)
    } 
    catch (error) {
        console.error('Error setting up profile:', error);
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
};


export { registerUser, loginUser, verifyOtp, getOtpRemainingTime, resendOtp, forgotPassword, resetPassword, verifyToken};