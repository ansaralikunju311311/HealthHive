import Doctor from '../../Model/doctorModel.js';
import STATUS_CODE from '../../StatusCode/StatusCode.js';
import { sendDoctorVerificationEmail } from '../../utils/sendMail.js';
import RejectedDoctor from '../../Model/rejectedDoctors.js';
export const approveDoctor = async (req,res)=>
    {
        try {
            const {doctorid} = req.params;
        
            const doctorData = await Doctor.findById(doctorid);
            if(!doctorData){
                return res.status(STATUS_CODE.NOT_FOUND).json({message:"Doctor is not found"})
            }
            try {
                await sendDoctorVerificationEmail(doctorData.email, doctorData.name, 'approved');
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
    
        
            try {
                await sendDoctorVerificationEmail(doctorData.email, doctorData.name, 'rejected');
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