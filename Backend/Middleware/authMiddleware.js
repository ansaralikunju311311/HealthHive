import jwt from 'jsonwebtoken';
import User from '../Model/userModel.js';
import doctor from '../Model/doctorModel.js';
import Admin from '../Model/AdminModel/adminModel.js';
import cookies from 'js-cookie'; 
import RejectedDoctor from '../Model/RejectedDoctors.js';

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies.usertoken;
        if (!token || token.trim() === '') {
            return res.status(STATUS_CODE.Unauthorized).json({ message: 'Not authorized, no valid token' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

            const user = await User.findById(decoded.userId).select('-password');
            
            if (!user) {
        
                res.cookie('usertoken', '', {
                    expires: new Date(0),
                    httpOnly: false,
                    secure: true,
                    sameSite: 'None',
                    path: '/'
                });
                return res.status(STATUS_CODE.Unauthorized).json({ message: 'Not authorized, user not found' });
            }

            req.user = user;
            next();
        } catch (verifyError) {
            console.error('Token verification error:', verifyError);
            
            res.cookie('usertoken', '', {
                expires: new Date(0),
                httpOnly: false,
                secure: true,
                sameSite: 'None',
                path: '/'
            });
            
    
            if (verifyError.name === 'JsonWebTokenError') {
                return res.status(STATUS_CODE.Unauthorized).json({ message: 'Invalid token structure', clearToken: true });
            }
            if (verifyError.name === 'TokenExpiredError') {
                return res.status(STATUS_CODE.Unauthorized).json({ message: 'Token has expired', clearToken: true });
            }
            
            return res.status(STATUS_CODE.Unauthorized).json({ message: 'Authentication failed', clearToken: true });
        }
    } catch (error) {
        console.error('Unexpected auth middleware error:', error);
        
    
        res.cookie('usertoken', '', {
            expires: new Date(0),
            httpOnly: false,
            secure: true,
            sameSite: 'None',
            path: '/'
        });
        
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error during authentication', clearToken: true });
    }
};

export const protectDoctor = async (req, res, next) => {
    try {
        const token = req.cookies.doctortoken;
        
    
        if (!token || token.trim() === '') {
            return res.status(STATUS_CODE.Unauthorized).json({ message: 'Not authorized, no valid token' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const doctorUser = await doctor.findById(decoded.userId).select('-password');
            
            if (!doctorUser) {
        
                res.cookie('doctortoken', '', {
                    expires: new Date(0),
                    httpOnly: false,
                    secure: true,
                    sameSite: 'None',
                    path: '/'
                });
                return res.status(STATUS_CODE.Unauthorized).json({ message: 'Not authorized, doctor not found' });
            }

        
            if (!doctorUser.isActive) {
                return res.status(STATUS_CODE.Unauthorized).json({ message: 'Account is not yet verified' });
            }
            if(doctorUser.isBlocked===true){
                return res.status(STATUS_CODE.Unauthorized).json({ message: 'Account is blocked' });
            }

            req.doctor = doctorUser;
            next();
        } catch (verifyError) {
            console.error('Token verification error:', verifyError);
            
        
            res.cookie('doctortoken', '', {
                expires: new Date(0),
                httpOnly: false,
                secure: true,
                sameSite: 'None',
                path: '/'
            });
            
        
            if (verifyError.name === 'JsonWebTokenError') {
                return res.status(STATUS_CODE.Unauthorized).json({ message: 'Invalid token structure', clearToken: true });
            }
            if (verifyError.name === 'TokenExpiredError') {
                return res.status(STATUS_CODE.Unauthorized).json({ message: 'Token has expired', clearToken: true });
            }
            
            return res.status(STATUS_CODE.Unauthorized).json({ message: 'Authentication failed', clearToken: true });
        }
    } catch (error) {
        console.error('Unexpected auth middleware error:', error);
        

        res.cookie('doctortoken', '', {
            expires: new Date(0),
            httpOnly: false,
            secure: true,
            sameSite: 'None',
            path: '/'
        });
        
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error during authentication', clearToken: true });
    }
};

export const protectAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.admintoken;
        
    
        if (!token || token.trim() === '') {
            return res.status(STATUS_CODE.Unauthorized).json({ message: 'Not authorized, no valid token' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const admin = await Admin.findById(decoded.userId).select('-password');
            
            if (!admin) {
            
                res.cookie('admintoken', '', {
                    expires: new Date(0),
                    httpOnly: false,
                    secure: true,
                    sameSite: 'None',
                    path: '/'
                });
                return res.status(STATUS_CODE.Unauthorized).json({ message: 'Not authorized, admin not found' });
            }

            req.admin = admin;
            next();
        } catch (verifyError) {
            console.error('Token verification error:', verifyError);
            
        
            res.cookie('admintoken', '', {
                expires: new Date(0),
                httpOnly: false,
                secure: true,
                sameSite: 'None',
                path: '/'
            });
            
        
            if (verifyError.name === 'JsonWebTokenError') {
                return res.status(STATUS_CODE.Unauthorized).json({ message: 'Invalid token structure', clearToken: true });
            }
            if (verifyError.name === 'TokenExpiredError') {
                return res.status(STATUS_CODE.Unauthorized).json({ message: 'Token has expired', clearToken: true });
            }
            
            return res.status(STATUS_CODE.Unauthorized).json({ message: 'Authentication failed', clearToken: true });
        }
    } catch (error) {
        console.error('Unexpected auth middleware error:', error);
        
        res.cookie('admintoken', '', {
            expires: new Date(0),
            httpOnly: false,
            secure: true,
            sameSite: 'None',
            path: '/'
        });
        
        res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error during authentication', clearToken: true });
    }
};