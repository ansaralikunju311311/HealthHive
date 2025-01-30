import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import cookies from 'js-cookie';
const DoctorProtected = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const navigate = useNavigate();
  useEffect(()=>
      {
        const verifyToken = async () => {
          try {
            const token = cookies.get('doctortoken');
            if (!token) {
              navigate('/doctor/login');
              return;
            }
            const response = await axios.get('http://localhost:5000/api/doctor/verify-token', {
              headers: {
                Authorization: `Bearer ${token}`
              },
              withCredentials:true,
            });
            if (response.data.doctor) {
              setVerified(true);
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