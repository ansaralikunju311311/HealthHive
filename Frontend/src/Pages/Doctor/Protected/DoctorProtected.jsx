import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import cookies from 'js-cookie';
import { VerifyDoctorToken } from '../../../Services/apiService';
const DoctorProtected = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const navigate = useNavigate();
  useEffect(()=>
      {
        const verifyToken = async () => {
          try {
           
            const response = await VerifyDoctorToken();
            if (response.doctor) {
              setVerified(true);
            } else {
              cookies.remove('doctortoken');
              navigate('/doctor/login');
            }
          } catch (error) {
            console.error('Error verifying token:', error);
            cookies.remove('doctortoken');
            navigate('/doctor/login');
          }
          finally{
            setLoading(false);
          }
        }
        verifyToken();
      },[navigate])

      if (loading) {
        return <div>Loading...</div>;
      }
      return verified ? children : null
}

export default DoctorProtected