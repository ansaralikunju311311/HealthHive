import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import cookies from 'js-cookie'
import { verifyDoctorToken } from '../../../Services/apiService'

const RevProtected = ({children}) => {
    const navigate = useNavigate();
   
    useEffect(() => {
        const verifyToken = async () => {
        try {
           
            const response = await verifyDoctorToken();
            if (response.doctor) {
                navigate('/doctor/dashboard');
                
            } else {
                cookies.remove('doctortoken');
                navigate('/doctor/login');
            }
        } catch (error) {
            console.error('Error verifying token:', error);
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
