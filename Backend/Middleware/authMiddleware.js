import jwt from 'jsonwebtoken';
import User from '../Model/userModel.js';
import doctor from '../Model/doctorModel.js';
import Admin from '../Model/AdminModel/adminModel.js';
import cookies from 'js-cookie'; 








export const protect = async (req, res, next) => {
    try {
        // Retrieve token from cookies
        const token = req.cookies.useraccessToken;
        console.log('in protected',token)  

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find user based on the token's payload
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        // Attach user to the request object
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












// export const protect = async (req, res, next) => {
//     console.log('in protected')
//     try {
//         // Get token from header
//         // const token = req.headers.authorization?.split(' ')[1];
//         const token = req.cookies.useraccessToken;
//         // console.log("token from the cookie protected=====",token);
//         console.log('reached middleware')
//         if (!token) {
//             return res.status(401).json({ message: 'Not authorized, no token' });
//         }

//         // Verify token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // Get user from token
//         const user = await User.findById(decoded.userId).select('-password');
        
//         if (!user) {
//             return res.status(401).json({ message: 'Not authorized, user not found' });
//         }

//         // Add user to request object
//         req.user = user;
//         // console.log("auth middleware", user);
//         console.log('completed')
//         next();
//     } catch (error) {
//         console.error('Auth middleware error:', error);
//         if (error.name === 'JsonWebTokenError') {
//             return res.status(401).json({ message: 'Invalid token' });
//         }
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({ message: 'Token expired' });
//         }
//         res.status(401).json({ message: 'Not authorized' });
//     }
// };

export const protectDoctor = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.headers.authorization?.split(' ')[1];

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
        const token = req.headers.authorization?.split(' ')[1];

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
