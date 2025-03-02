import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import cookies from 'js-cookie';
import { verifyAdminToken } from '../../../Services/apiService';

const AdminProtected = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await verifyAdminToken();
                
                if (response?.admin) {
                    setLoading(false);
                } else {
                    cookies.remove('admintoken');
                    navigate('/admin');
                }
            } catch (error) {
                console.error('Token verification error:', error);
                cookies.remove('admintoken');
                navigate('/admin');
            }
        };

        checkAuth();
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

export default AdminProtected;
