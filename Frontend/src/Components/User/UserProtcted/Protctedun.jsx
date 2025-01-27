import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import cookies from 'js-cookie'

const AuthProtected = ({children}) => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const verifyToken = async () => {
            try {
                // const token = localStorage.getItem('useraccessToken');
                const token = cookies.get('useraccessToken');
                if (token) {
                    // If token exists, verify it
                    const response = await axios.get('http://localhost:5000/api/user/verify-token', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials:true,
                    });
                    
                    // If token is valid, redirect to home page since user is already logged in
                    if (response.data.user) {
                        navigate('/home');
                        return;
                    }
                }
                // If no token or invalid token, allow access to login/signup pages
            } catch (error) {
                // If token verification fails, clear it and allow access to login/signup
                console.error('Error verifying token:', error);
                // localStorage.removeItem('useraccessToken');
                cookies.remove('useraccessToken');
                navigate('/');
            }
        };
        
        verifyToken();
    }, [navigate]);

    return (
        <div>
            {children}
        </div>
    )
}

export default AuthProtected
