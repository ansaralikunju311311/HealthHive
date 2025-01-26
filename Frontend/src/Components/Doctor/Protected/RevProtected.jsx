import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const RevProtected = ({children}) => {
    const navigate = useNavigate();
   
    useEffect(() => {
        const verifyToken = async () => {
        try {
            const token = localStorage.getItem('doctortoken');
            if (!token) {
                navigate('/doctor-login');
                return;
            }
            const response = await axios.get('http://localhost:5000/api/doctor/verify-token', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.doctor) {
                navigate('/doctor-dashboard');
                
            } else {
                localStorage.removeItem('doctortoken');
                navigate('/doctor-login');
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            localStorage.removeItem('doctortoken');
            navigate('/doctor-login');
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
