import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import cookies from 'js-cookie'

const RevProtected = ({children}) => {
    const navigate = useNavigate();
   
    useEffect(() => {
        const verifyToken = async () => {
        try {
            // const token = localStorage.getItem('doctortoken');
            const token = cookies.get('doctortoken');
            if (!token) {
                navigate('/doctor/signup');
                return;
            }
            const response = await axios.get('http://localhost:5000/api/doctor/verify-token', {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials:true,
            });
            if (response.data.doctor) {
                navigate('/doctor/dashboard');
                
            } else {
                // localStorage.removeItem('doctortoken');
                cookies.remove('doctortoken');
                navigate('/doctor/login');
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            // localStorage.removeItem('doctortoken');
            cookies.remove('doctortoken');
            navigate('/doctor/login');
        }
    };

    
        verifyToken();
    }, []);

  return (
    <div>
      {children}
    </div>
  )
}

export default RevProtected
