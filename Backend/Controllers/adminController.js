import Admin from '../Model/adminModel.js';

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

// export const RegisterAdmin = async (req, res) => {
//     try {
//         const { name, email, password } = req.body;

//         // Check if admin already exists
//         const existingAdmin = await admin.findOne({ email });
//         if (existingAdmin) {
//             return res.status(400).json({ message: "Admin already exists" });
//         }

//         // Hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Create new admin
//         const newAdmin = new admin({
//             name,
//             email,
//             password: hashedPassword
//         });

//         await newAdmin.save();
//         res.status(201).json({ 
//             message: "Admin registered successfully",
//             admin: {
//                 _id: newAdmin._id,
//                 name: newAdmin.name,
//                 email: newAdmin.email,
//                 role: newAdmin.role
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };