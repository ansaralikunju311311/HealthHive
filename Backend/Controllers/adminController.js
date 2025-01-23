import Admin from '../Model/adminModel.js';
import User from '../Model/userModel.js';
import bcrypt from 'bcrypt';

export const LoginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if admin exists
        const existingAdmin = await Admin.findOne({ email });
        if (!existingAdmin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, existingAdmin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Send response
        res.status(200).json({
            message: "Login successful",
            Admin: {
                _id: existingAdmin._id, 
                email: existingAdmin.email,
               
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const patients = async (req,res)=>
{
    try {
        const patients = await User.find({isActive:true});
        const patientsWithIndex = patients.map((patient, index) => ({
            ...patient.toObject(),
            serialNumber: index + 1
        }));
        res.send(patientsWithIndex);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
   
}