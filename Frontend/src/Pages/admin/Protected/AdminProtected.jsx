import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cookies from 'js-cookie';

const AdminProtected = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = cookies.get('admintoken');
                if (!token) {
                    navigate('/admin');
                    return;
                }

                const response = await axios.get('http://localhost:5000/api/admin/verify-token', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true,
                });

                if (response.data.admin) {
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

export default AdminProtected;
