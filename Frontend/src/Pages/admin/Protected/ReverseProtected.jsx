import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cookies from 'js-cookie';
import { verifyAdminToken } from '../../../Services/apiService';

const ReverseProtected = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
              
                 const response = await verifyAdminToken();
                if (response?.admin) {
                    navigate('/admin/dashboard');
                } else {
                    cookies.remove('admintoken');
                    setLoading(false);
                }
            } catch (error) {
                console.error('Token verification error:', error);
                cookies.remove('admintoken');
                setLoading(false);
            }
        };

        verifyToken();
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return children;
};

export default ReverseProtected;
