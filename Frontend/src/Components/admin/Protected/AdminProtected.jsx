import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const AdminProtected = ({ children }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('admintoken');
                if (!token) {
                    navigate('/admin');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/admin/verify-token', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.admin) {
                    setVerified(true);
                } else {
                    localStorage.removeItem('admintoken');
                    navigate('/admin');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                localStorage.removeItem('admintoken');
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
