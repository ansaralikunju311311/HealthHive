import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';
// import { useSelector } from 'react-redux'
// import { setToken } from '../../redux/Features/userSlice.js'
import axios from 'axios';
import cookies from 'js-cookie';
export const Protected = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            // console.log("useeffecvjjvjvjvjvjvjvjjvjvjjvjjvvvjt called");
            try {
                const token = cookies.get('useraccessToken');
                console.log("token from the cookie cncncncnncnncnnc  protected=====",token);
                // console.log("token from the cookie cncncncnncnncnnc  protected=====",token);
                if (!token) {
                    console.log("token not found");
                    navigate('/login');
                    return;
                }
                console.log('warp protcted route 1 veridy')
                const response = await axios.get('http://localhost:5000/api/user/verify-token', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                   withCredentials:true,
                });
                console.log("response from the backend=====",response.data);


                if (response.data.user) {
                    setVerified(true);
                } else {
                    console.log("user not found  vbvhj");
                    cookies.remove('useraccessToken');
                    navigate('/login');
                }
            } catch (error) {
                console.log('second time error')
                console.log("error in verify  this ojfjf andatr will token");
                console.error('Error verifying token:', error);
                cookies.remove('useraccessToken');
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
