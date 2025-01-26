import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
// import { useSelector } from 'react-redux'
// import { setToken } from '../../redux/Features/userSlice.js'
import axios from 'axios';

export const Protected = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const token = localStorage.getItem('useraccessToken');
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await axios.get('http://localhost:5000/api/user/verify-token', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.user) {
                    setVerified(true);
                } else {
                    localStorage.removeItem('useraccessToken');
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error verifying token:', error);
                localStorage.removeItem('useraccessToken');
                navigate('/login');
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
}

export default Protected
