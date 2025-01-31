import jwt from 'jsonwebtoken';
import User from '../Model/userModel.js';
import doctor from '../Model/doctorModel.js';
import Admin from '../Model/AdminModel/adminModel.js';
import cookies from 'js-cookie'; 
import RejectedDoctor from '../Model/RejectedDoctors.js';
export const protect = async (req, res, next) => {
    try {
       
        const token = req.cookies.useraccessToken;
        console.log('in protected',token)  
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(401).json({ message: 'Not authorized' });
    }
};
export const protectDoctor = async (req, res, next) => {
    try {
       const token = req.cookies.doctortoken;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get doctor from token
        const doctorUser = await doctor.findById(decoded.userId).select('-password');
        if (!doctorUser) {
            return res.status(401).json({ message: 'Not authorized, doctor not found' });
        }
        // Verify if doctor is active
        if (!doctorUser.isActive) {
            return res.status(401).json({ message: 'Account is not yet verified' });
        }
        if(doctorUser.isBlocked===true){
            return res.status(401).json({ message: 'Account is blocked' });
        }

        // Add doctor to request object
        req.doctor = doctorUser;
        next();
    } catch (error) {
        console.error('Doctor auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(401).json({ message: 'Not authorized' });
    }
};

export const protectAdmin = async (req, res, next) => {
    try {
        // Get token from header

       const token = req.cookies.admintoken;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get admin from token
        const admin = await Admin.findById(decoded.userId).select('-password');
        
        if (!admin) {
            return res.status(401).json({ message: 'Not authorized, admin not found' });
        }
        // Add admin to request object
        req.admin = admin;
        next();
    } catch (error) {
        console.error('Admin auth middleware error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(401).json({ message: 'Not authorized' });
    }
};