import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import cookies from 'js-cookie';        
const AdminProtected = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    useEffect(() => {
        const verifyToken = async () => {
            try {
                // const token = localStorage.getItem('admintoken');
                const token = cookies.get('admintoken');
                if (!token) {
                    navigate('/admin');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/admin/verify-token', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials:true,
                });

                if (response.data.admin) {
                    setVerified(true);
                } else {
                   
                    cookies.remove('admintoken');
                    navigate('/admin');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                // localStorage.removeItem('admintoken');
                cookies.remove('admintoken');
                navigate('/admin');
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }
    return verified ? children : null;
};
export default AdminProtected;
