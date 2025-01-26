import doctor from "../Model/doctorModel.js";
import RejectedDoctor from "../Model/RejectedDoctors.js";
import bcrypt from 'bcrypt';
import {jwtToken} from '../utils/auth.js'

 const RegisterDoctor = async(req,res)=>{
    try {
        const {name,email,password,yearsOfExperience,specialization,phone,profileImage,medicalLicense,idProof,about,consultFee,gender} = req.body;
        
        // Check if user already exists and is active
        const existingUser = await doctor.findOne({email});
        const rejectedDoctor = await RejectedDoctor.findOne({email})
         

        if(rejectedDoctor)
        {
            return res.status(400).json({message:"this is rejeced user please contact admin"});
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
            user = existingUser;
            console.log("Updated user:", user);
            console.log("Existing user:", existingUser);
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
                isActive: false
            });
            console.log("New user:", user);
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
        if(!existingDoctor){
            return res.status(404).json({message:"User not found"});
        }
        console.log(existingDoctor.isActive);
        // Check if user is active
        if(!existingDoctor.isActive){
            return res.status(200).json({message:"Please verify your account first",
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
        const doctorToken = jwtToken(existingDoctor);
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
                isActive: existingDoctor.isActive
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
        const doctorData = await doctor.findOne({ email, isActive: true });
        if (doctorData) {
            return res.status(200).json({ 
                isVerified: true,
                doctor: doctorData 
            });
        }
        // Check if doctor exists but is not verified
        const pendingDoctor = await doctor.findOne({ email, isActive: false });
        if (pendingDoctor) {
            return res.status(200).json({ 
                isVerified: false,
                message: "Your account is pending verification" 
            });
        }
        return res.status(404).json({ 
            isVerified: false,
            message: "Doctor not found" 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export { RegisterDoctor, LoginDoctor, verifyDoctorToken,fetchDoctors };